namespace MealMind.Api.Service
{
    public interface IRecipeService
    {
        IEnumerable<string> GetAll();
    }
    public class RecipeService : IRecipeService
    {
        public IEnumerable<string> GetAll()
        {
            return new[] { "Pasta", "Tacos", "Salad" };
        }
    }
}