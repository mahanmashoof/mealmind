using Microsoft.AspNetCore.Mvc;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        var recipes = new[] { "Pasta", "Tacos", "Salad" };
        return Ok(recipes);
    }
}