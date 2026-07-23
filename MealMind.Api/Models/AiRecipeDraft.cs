namespace MealMind.Api.Models;

public class AiRecipeDraft
{
    public string Name { get; set; } = string.Empty;
    public List<string> Steps { get; set; } = new();
    public NutritionInfo Nutrition { get; set; } = new();
    public int Portions { get; set; }
    public List<Ingredient> Ingredients { get; set; } = new();
}