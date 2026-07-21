namespace MealMind.Api.Models;

public class AiRecipeDraft
{
    public string Name { get; set; } = string.Empty;
    public List<string> Steps { get; set; } = new();
    public NutritionInfo Nutrition { get; set; } = new();
}