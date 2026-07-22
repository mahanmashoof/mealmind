using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MealMind.Api.Services;

namespace MealMind.Api.Controllers;

public record CreatePlanRequest(DateOnly WeekStartDate);
public record AssignRecipeRequest(DayOfWeek Day, int RecipeId);

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
        var plans = await _planService.GetAllAsync();
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var plan = await _planService.GetByIdAsync(id);
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
        var result = await _planService.DeleteAsync(id, CurrentUserId);
        return result switch
        {
            PlanOpResult.Success => NoContent(),
            PlanOpResult.Forbidden => Forbid(),
            _ => NotFound()
        };
    }

    [HttpPost("{planId}/entries")]
    public async Task<IActionResult> AssignRecipe(int planId, AssignRecipeRequest request)
    {
        try
        {
            var entry = await _planService.AssignRecipeAsync(planId, request.Day, request.RecipeId, CurrentUserId);
            return Ok(entry);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{planId}/entries/{entryId}")]
    public async Task<IActionResult> RemoveEntry(int planId, int entryId)
    {
        var result = await _planService.RemoveEntryAsync(planId, entryId, CurrentUserId);
        return result switch
        {
            PlanOpResult.Success => NoContent(),
            PlanOpResult.Forbidden => Forbid(),
            _ => NotFound()
        };
    }
}