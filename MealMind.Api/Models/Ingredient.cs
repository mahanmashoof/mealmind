namespace MealMind.Api.Models;

public class Ingredient
{
    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty; // e.g. "g", "ml", "cups", "pcs"
}