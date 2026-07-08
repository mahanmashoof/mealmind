using MealMind.Api.Service;
using Microsoft.AspNetCore.Mvc;

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
    public IActionResult GetAll()
    {
        var recipes = _recipeService.GetAll();
        return Ok(recipes);
    }
}