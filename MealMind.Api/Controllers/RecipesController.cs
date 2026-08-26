using Microsoft.AspNetCore.Mvc;
using MealMind.Api.Services;
using MealMind.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class RecipesController : ControllerBase
{
    private string CurrentUserId =>
    User.FindFirstValue(ClaimTypes.NameIdentifier)
    ?? throw new InvalidOperationException("User ID claim missing");

    private readonly IRecipeService _recipeService;
    private readonly Cloudinary _cloudinary;

    public RecipesController(IRecipeService recipeService, Cloudinary cloudinary)
    {
        _recipeService = recipeService;
        _cloudinary = cloudinary;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var recipes = await _recipeService.GetAllAsync();
        return Ok(recipes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var recipe = await _recipeService.GetByIdAsync(id);
        return recipe is null ? NotFound() : Ok(recipe);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(Recipe recipe)
    {
        var created = await _recipeService.CreateAsync(recipe, CurrentUserId);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, Recipe recipe)
    {
        var result = await _recipeService.UpdateAsync(id, recipe, CurrentUserId);
        return result switch
        {
            RecipeOpResult.Success => NoContent(),
            RecipeOpResult.Forbidden => Forbid(),
            _ => NotFound()
        };
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _recipeService.DeleteAsync(id, CurrentUserId);
        return result switch
        {
            RecipeOpResult.Success => NoContent(),
            RecipeOpResult.Forbidden => Forbid(),
            _ => NotFound()
        };
    }

    [HttpPost("{id}/image")]
    [Authorize]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var recipe = await _recipeService.GetByIdAsync(id);
        if (recipe is null) return NotFound();
        if (recipe.UserId != CurrentUserId) return Forbid();

        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "mealmind-recipes"
        };
        var result = await _cloudinary.UploadAsync(uploadParams);

        recipe.ImageUrl = result.SecureUrl.ToString();
        await _recipeService.UpdateAsync(id, recipe, CurrentUserId);

        return Ok(new { imageUrl = recipe.ImageUrl });
    }

    [HttpPost("ai-generate")]
    [Authorize]
    public async Task<IActionResult> CreateFromAi([FromBody] string prompt)
    {
        var recipe = await _recipeService.CreateFromAiAsync(prompt, CurrentUserId);
        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
    }
}