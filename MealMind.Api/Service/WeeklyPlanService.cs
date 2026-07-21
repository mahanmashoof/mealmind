using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;

namespace MealMind.Api.Services;

public interface IWeeklyPlanService
{
    Task<IEnumerable<WeeklyPlan>> GetAllAsync(string userId);
    Task<WeeklyPlan?> GetByIdAsync(int id, string userId);
    Task<WeeklyPlan> CreateAsync(DateOnly weekStartDate, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}

public class WeeklyPlanService : IWeeklyPlanService
{
    private readonly MealMindDBContext _context;

    public WeeklyPlanService(MealMindDBContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<WeeklyPlan>> GetAllAsync(string userId) =>
        await _context.WeeklyPlans
            .Include(p => p.Entries)
            .Where(p => p.UserId == userId)
            .ToListAsync();

    public async Task<WeeklyPlan?> GetByIdAsync(int id, string userId) =>
        await _context.WeeklyPlans
            .Include(p => p.Entries)
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

    public async Task<WeeklyPlan> CreateAsync(DateOnly weekStartDate, string userId)
    {
        var plan = new WeeklyPlan { WeekStartDate = weekStartDate, UserId = userId };
        _context.WeeklyPlans.Add(plan);
        await _context.SaveChangesAsync();
        return plan;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var existing = await _context.WeeklyPlans.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (existing is null) return false;

        _context.WeeklyPlans.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}