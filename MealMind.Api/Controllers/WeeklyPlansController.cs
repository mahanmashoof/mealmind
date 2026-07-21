using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MealMind.Api.Services;

namespace MealMind.Api.Controllers;

public record CreatePlanRequest(DateOnly WeekStartDate);

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WeeklyPlansController : ControllerBase
{
    private readonly IWeeklyPlanService _planService;

    public WeeklyPlansController(IWeeklyPlanService planService)
    {
        _planService = planService;
    }

    private string CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new InvalidOperationException("User ID claim missing");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _planService.GetAllAsync(CurrentUserId);
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plan = await _planService.GetByIdAsync(id, CurrentUserId);
        return plan is null ? NotFound() : Ok(plan);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePlanRequest request)
    {
        var plan = await _planService.CreateAsync(request.WeekStartDate, CurrentUserId);
        return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _planService.DeleteAsync(id, CurrentUserId);
        return success ? NoContent() : NotFound();
    }
}