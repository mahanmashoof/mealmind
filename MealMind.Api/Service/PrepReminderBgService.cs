using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;

namespace MealMind.Api.Services;

public class PrepReminderBgService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PrepReminderBgService> _logger;

    public PrepReminderBgService(IServiceScopeFactory scopeFactory, ILogger<PrepReminderBgService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckForUpcomingMealsAsync();
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // check hourly
        }
    }

    private async Task CheckForUpcomingMealsAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MealMindDBContext>();

        var tomorrow = DateOnly.FromDateTime(DateTime.Today.AddDays(1));
        var tomorrowDayOfWeek = tomorrow.DayOfWeek;

        var plans = await context.WeeklyPlans
            .Include(p => p.Entries)
            .ThenInclude(e => e.Recipe)
            .ToListAsync();

        foreach (var plan in plans)
        {
            var tomorrowEntries = plan.Entries.Where(e => e.Day == tomorrowDayOfWeek);

            foreach (var entry in tomorrowEntries)
            {
                var alreadyReminded = await context.Reminders.AnyAsync(r =>
                    r.UserId == plan.UserId &&
                    r.Message.Contains(entry.Recipe!.Name) &&
                    r.CreatedAt.Date == DateTime.Today);

                if (!alreadyReminded)
                {
                    context.Reminders.Add(new Models.Reminder
                    {
                        UserId = plan.UserId,
                        Message = $"Prep reminder: {entry.Slot} tomorrow is {entry.Recipe!.Name}",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    });
                }
            }
        }

        await context.SaveChangesAsync();
        _logger.LogInformation("Prep reminder check completed at {time}", DateTime.UtcNow);
    }
}