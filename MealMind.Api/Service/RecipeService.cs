using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;

namespace MealMind.Api.Services;

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetAllAsync(string userId);
    Task<Recipe?> GetByIdAsync(int id, string userId);
    Task<Recipe> CreateAsync(Recipe recipe, string userId);
    Task<bool> UpdateAsync(int id, Recipe updated, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}

public class RecipeService : IRecipeService
{
    private readonly MealMindDBContext _context;

    public RecipeService(MealMindDBContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Recipe>> GetAllAsync(string userId) =>
        await _context.Recipes.Where(r => r.UserId == userId).ToListAsync();

    public async Task<Recipe?> GetByIdAsync(int id, string userId) =>
        await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

    public async Task<Recipe> CreateAsync(Recipe recipe, string userId)
    {
        recipe.UserId = userId;
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }

    public async Task<bool> UpdateAsync(int id, Recipe updated, string userId)
    {
        var existing = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (existing is null) return false;

        existing.Name = updated.Name;
        existing.Nutrition = updated.Nutrition;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var existing = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (existing is null) return false;

        _context.Recipes.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}