using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;

namespace MealMind.Api.Services;

public enum PlanOpResult { Success, NotFound, Forbidden }

public interface IWeeklyPlanService
{
    Task<IEnumerable<WeeklyPlan>> GetAllAsync();
    Task<WeeklyPlan?> GetByIdAsync(int id);
    Task<WeeklyPlan> CreateAsync(DateOnly weekStartDate, string userId);
    Task<PlanOpResult> DeleteAsync(int id, string userId);
    Task<MealPlanEntry> AssignRecipeAsync(int planId, DayOfWeek day, MealSlot slot, int recipeId, string userId);
    Task<PlanOpResult> RemoveEntryAsync(int planId, int entryId, string userId);
}

public class WeeklyPlanService : IWeeklyPlanService
{
    private readonly MealMindDBContext _context;

    public WeeklyPlanService(MealMindDBContext context) => _context = context;

    public async Task<IEnumerable<WeeklyPlan>> GetAllAsync() =>
        await _context.WeeklyPlans.Include(p => p.Entries).ToListAsync();

    public async Task<WeeklyPlan?> GetByIdAsync(int id) =>
        await _context.WeeklyPlans.Include(p => p.Entries).FirstOrDefaultAsync(p => p.Id == id);

    public async Task<WeeklyPlan> CreateAsync(DateOnly weekStartDate, string userId)
    {
        var plan = new WeeklyPlan { WeekStartDate = weekStartDate, UserId = userId };
        _context.WeeklyPlans.Add(plan);
        await _context.SaveChangesAsync();
        return plan;
    }

    public async Task<PlanOpResult> DeleteAsync(int id, string userId)
    {
        var existing = await _context.WeeklyPlans.FindAsync(id);
        if (existing is null) return PlanOpResult.NotFound;
        if (existing.UserId != userId) return PlanOpResult.Forbidden;

        _context.WeeklyPlans.Remove(existing);
        await _context.SaveChangesAsync();
        return PlanOpResult.Success;
    }

    public async Task<MealPlanEntry> AssignRecipeAsync(int planId, DayOfWeek day, MealSlot slot, int recipeId, string userId)
    {
        var plan = await _context.WeeklyPlans
            .Include(p => p.Entries)
            .FirstOrDefaultAsync(p => p.Id == planId)
            ?? throw new KeyNotFoundException("Plan not found");

        if (plan.UserId != userId)
            throw new UnauthorizedAccessException("Not your plan");

        var recipeExists = await _context.Recipes.AnyAsync(r => r.Id == recipeId);
        if (!recipeExists)
            throw new KeyNotFoundException("Recipe not found");

        var existingEntry = plan.Entries.FirstOrDefault(e => e.Day == day && e.Slot == slot);

        if (existingEntry is not null)
        {
            existingEntry.RecipeId = recipeId;
        }
        else
        {
            existingEntry = new MealPlanEntry
            {
                WeeklyPlanId = planId,
                Day = day,
                Slot = slot,
                RecipeId = recipeId
            };
            _context.MealPlanEntries.Add(existingEntry);
        }

        await _context.SaveChangesAsync();
        return existingEntry;
    }

    public async Task<PlanOpResult> RemoveEntryAsync(int planId, int entryId, string userId)
    {
        var plan = await _context.WeeklyPlans.FindAsync(planId);
        if (plan is null) return PlanOpResult.NotFound;
        if (plan.UserId != userId) return PlanOpResult.Forbidden;

        var entry = await _context.MealPlanEntries
            .FirstOrDefaultAsync(e => e.Id == entryId && e.WeeklyPlanId == planId);
        if (entry is null) return PlanOpResult.NotFound;

        _context.MealPlanEntries.Remove(entry);
        await _context.SaveChangesAsync();
        return PlanOpResult.Success;
    }
}