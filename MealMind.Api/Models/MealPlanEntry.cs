using System.Text.Json.Serialization;

namespace MealMind.Api.Models;

public class MealPlanEntry
{
    public int Id { get; set; }
    public int WeeklyPlanId { get; set; }

    [JsonIgnore]
    public WeeklyPlan? WeeklyPlan { get; set; }

    public DayOfWeek Day { get; set; }
    public MealSlot Slot { get; set; }
    public int RecipeId { get; set; }
    public Recipe? Recipe { get; set; }
}