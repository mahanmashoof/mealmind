using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;
using MealMind.Api.Service;

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
    Task<PrepPlanDraft> GeneratePrepPlanAsync(int planId, string userId);
}

public class WeeklyPlanService : IWeeklyPlanService
{
    private readonly MealMindDBContext _context;

    private readonly IAiClient _aiClient;

    public WeeklyPlanService(MealMindDBContext context, IAiClient aiClient)
    {
        _context = context;
        _aiClient = aiClient;
    }

    public async Task<PrepPlanDraft> GeneratePrepPlanAsync(int planId, string userId)
    {
        var plan = await _context.WeeklyPlans
            .Include(p => p.Entries)
            .ThenInclude(e => e.Recipe)
            .FirstOrDefaultAsync(p => p.Id == planId)
            ?? throw new KeyNotFoundException("Plan not found");

        if (plan.UserId != userId)
            throw new UnauthorizedAccessException("Not your plan");

        if (plan.Entries.Count == 0)
            throw new InvalidOperationException("Plan has no meals assigned yet");

        var mealSummaries = plan.Entries
            .Where(e => e.Recipe is not null)
            .Select(e => $"- {e.Day} {e.Slot}: {e.Recipe!.Name} — steps: {string.Join("; ", e.Recipe.Steps)}");

        var mealList = string.Join("\n", mealSummaries);

        var schemaExample = new { tasks = new[] { "string" } };
        var schemaJson = System.Text.Json.JsonSerializer.Serialize(schemaExample);

        var prompt =
            $"Here are the meals planned for the week:\n{mealList}\n\n" +
            "Group and optimize the prep work across all these meals into a batch-prep task list " +
            "(e.g. combine chopping the same vegetable across recipes, batch-cook shared ingredients). " +
            $"Respond ONLY with JSON matching this exact shape: {schemaJson}";

        var json = await _aiClient.GetJsonCompletionAsync(prompt);
        var draft = System.Text.Json.JsonSerializer.Deserialize<PrepPlanDraft>(json,
            new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidOperationException("AI returned invalid prep plan data");

        return draft;
    }

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