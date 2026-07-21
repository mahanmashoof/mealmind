namespace MealMind.Api.Models;

public class WeeklyPlan
{
    public int Id { get; set; }
    public DateOnly WeekStartDate { get; set; }
    public string UserId { get; set; } = string.Empty;

    public List<MealPlanEntry> Entries { get; set; } = new();
}