using System.ComponentModel.DataAnnotations;

namespace MealMind.Api.Models;

public class NutritionInfo
{
    [Range(0, 10000)]
    public int Calories { get; set; }
    [Range(0, 1000)]
    public double ProteinGrams { get; set; }
    [Range(0, 1000)]
    public double CarbsGrams { get; set; }
    [Range(0, 1000)]
    public double FatGrams { get; set; }
}