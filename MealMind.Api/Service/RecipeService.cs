using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;

namespace MealMind.Api.Services;

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetAllAsync();
    Task<Recipe?> GetByIdAsync(int id);
    Task<Recipe> CreateAsync(Recipe recipe);
    Task<bool> UpdateAsync(int id, Recipe updated);
    Task<bool> DeleteAsync(int id);
}

public class RecipeService : IRecipeService
{
    private readonly MealMindDBContext _context;

    public RecipeService(MealMindDBContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Recipe>> GetAllAsync() =>
        await _context.Recipes.ToListAsync();

    public async Task<Recipe?> GetByIdAsync(int id) =>
        await _context.Recipes.FindAsync(id);

    public async Task<Recipe> CreateAsync(Recipe recipe)
    {
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }

    public async Task<bool> UpdateAsync(int id, Recipe updated)
    {
        var existing = await _context.Recipes.FindAsync(id);
        if (existing is null) return false;

        existing.Name = updated.Name;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Recipes.FindAsync(id);
        if (existing is null) return false;

        _context.Recipes.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}