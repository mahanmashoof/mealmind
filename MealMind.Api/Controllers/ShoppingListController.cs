using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MealMind.Api.Services;

namespace MealMind.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShoppingListController : ControllerBase
{
    private readonly IShoppingListService _service;
    public ShoppingListController(IShoppingListService service) => _service = service;

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User ID claim missing");

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var list = await _service.GetMineAsync(CurrentUserId);
        return list is null ? NotFound() : Ok(list);
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate()
    {
        var list = await _service.GenerateAsync(CurrentUserId);
        return Ok(list);
    }

    public record UpdateItemRequest(double? Quantity, bool? IsChecked);

    [HttpPatch("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, UpdateItemRequest request)
    {
        var success = await _service.UpdateItemAsync(id, CurrentUserId, request.Quantity, request.IsChecked);
        return success ? NoContent() : NotFound();
    }
}