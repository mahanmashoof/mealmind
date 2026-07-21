using Microsoft.AspNetCore.Mvc;
using MealMind.Api.Service;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AiTestController : ControllerBase
{
    private readonly IAiClient _aiClient;

    public AiTestController(IAiClient aiClient)
    {
        _aiClient = aiClient;
    }

    [HttpGet]
    public async Task<IActionResult> Test([FromQuery] string prompt)
    {
        var result = await _aiClient.GetCompletionAsync(prompt);
        return Ok(new { result });
    }
}