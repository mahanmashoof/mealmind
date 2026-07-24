using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MealMind.Api.Data;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RemindersController : ControllerBase
{
    private readonly MealMindDBContext _context;

    public RemindersController(MealMindDBContext context) => _context = context;

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User ID claim missing");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reminders = await _context.Reminders
            .Where(r => r.UserId == CurrentUserId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(reminders);
    }

    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var reminder = await _context.Reminders.FindAsync(id);
        if (reminder is null || reminder.UserId != CurrentUserId) return NotFound();

        reminder.IsRead = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}