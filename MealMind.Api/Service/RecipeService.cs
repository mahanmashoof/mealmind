using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;
using MealMind.Api.Service;

namespace MealMind.Api.Services;

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetAllAsync(string userId);
    Task<Recipe?> GetByIdAsync(int id, string userId);
    Task<Recipe> CreateAsync(Recipe recipe, string userId);
    Task<bool> UpdateAsync(int id, Recipe updated, string userId);
    Task<bool> DeleteAsync(int id, string userId);
    Task<Recipe> CreateFromAiAsync(string userPrompt, string userId);
}

public class RecipeService : IRecipeService
{
    private readonly MealMindDBContext _context;
    private readonly IAiClient _aiClient;

    public RecipeService(MealMindDBContext context, IAiClient aiClient)
    {
        _context = context;
        _aiClient = aiClient;
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
        existing.Steps = updated.Steps;
        existing.ImageUrl = updated.ImageUrl;
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

    public async Task<Recipe> CreateFromAiAsync(string userPrompt, string userId)
    {
        var systemPrompt = $$$"""
    Create a recipe based on: "{{{userPrompt}}}".
    Respond ONLY with JSON matching this exact shape:
    {"name": "string", "steps": ["string"], "nutrition": {"calories": 0, "proteinGrams": 0, "carbsGrams": 0, "fatGrams": 0}}
    """;

        var json = await _aiClient.GetJsonCompletionAsync(systemPrompt);
        var draft = System.Text.Json.JsonSerializer.Deserialize<AiRecipeDraft>(json,
            new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidOperationException("AI returned invalid recipe data");

        var recipe = new Recipe
        {
            Name = draft.Name,
            Steps = draft.Steps,
            Nutrition = draft.Nutrition,
            UserId = userId
        };

        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }
}