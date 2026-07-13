using Microsoft.AspNetCore.Mvc;
using MealMind.Api.Services;
using MealMind.Api.Models;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipesController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
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
    public async Task<IActionResult> Create(Recipe recipe)
    {
        var created = await _recipeService.CreateAsync(recipe);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Recipe recipe)
    {
        var success = await _recipeService.UpdateAsync(id, recipe);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _recipeService.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        var recipe = await _recipeService.GetByIdAsync(id);
        if (recipe is null) return NotFound();

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine("wwwroot/uploads", fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        recipe.ImageUrl = $"/uploads/{fileName}";
        await _recipeService.UpdateAsync(id, recipe);

        return Ok(new { imageUrl = recipe.ImageUrl });
    }
}