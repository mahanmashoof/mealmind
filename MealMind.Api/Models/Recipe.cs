using System.ComponentModel.DataAnnotations;

namespace MealMind.Api.Models
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public NutritionInfo? Nutrition { get; set; }
        public string UserId { get; set; } = string.Empty;
    }
}