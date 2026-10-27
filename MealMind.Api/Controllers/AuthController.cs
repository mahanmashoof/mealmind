using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MealMind.Api.Models;
using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;

namespace MealMind.Api.Controllers;

public record GoogleLoginRequest(string IdToken);

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;

    private readonly MealMindDBContext _context;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config, MealMindDBContext context)
    {
        _userManager = userManager;
        _config = config;
        _context = context;
    }


    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin(GoogleLoginRequest request)
    {
        FirebaseToken decodedToken;
        try
        {
            decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(request.IdToken);
        }
        catch (FirebaseAuthException)
        {
            return Unauthorized(new { error = "Invalid Google token." });
        }

        var email = decodedToken.Claims["email"]?.ToString();
        if (email is null) return Unauthorized();

        var isAllowed = await _context.AllowedUsers.AnyAsync(a => a.Email == email);
        if (!isAllowed)
            return StatusCode(403, new { error = "This account isn't approved for MealMind yet." });

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser { UserName = email, Email = email };
            await _userManager.CreateAsync(user); // no password — Google is the only way in
        }

        var token = GenerateToken(user); // Chapter 9's existing method, unchanged
        return Ok(new { token });
    }

    private string GenerateToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}