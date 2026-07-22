using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;
using MealMind.Api.Service;

namespace MealMind.Api.Services;

public enum RecipeOpResult { Success, NotFound, Forbidden }

public interface IRecipeService
{
    Task<IEnumerable<Recipe>> GetAllAsync();
    Task<Recipe?> GetByIdAsync(int id);
    Task<Recipe> CreateAsync(Recipe recipe, string userId);
    Task<RecipeOpResult> UpdateAsync(int id, Recipe updated, string userId);
    Task<RecipeOpResult> DeleteAsync(int id, string userId);
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

    public async Task<IEnumerable<Recipe>> GetAllAsync() =>
        await _context.Recipes.ToListAsync();

    public async Task<Recipe?> GetByIdAsync(int id) =>
        await _context.Recipes.FindAsync(id);

    public async Task<Recipe> CreateAsync(Recipe recipe, string userId)
    {
        recipe.UserId = userId;
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }

    public async Task<RecipeOpResult> UpdateAsync(int id, Recipe updated, string userId)
    {
        var existing = await _context.Recipes.FindAsync(id);
        if (existing is null) return RecipeOpResult.NotFound;
        if (existing.UserId != userId) return RecipeOpResult.Forbidden;

        existing.Name = updated.Name;
        existing.Nutrition = updated.Nutrition;
        existing.Steps = updated.Steps;
        existing.ImageUrl = updated.ImageUrl;
        await _context.SaveChangesAsync();
        return RecipeOpResult.Success;
    }

    public async Task<RecipeOpResult> DeleteAsync(int id, string userId)
    {
        var existing = await _context.Recipes.FindAsync(id);
        if (existing is null) return RecipeOpResult.NotFound;
        if (existing.UserId != userId) return RecipeOpResult.Forbidden;

        _context.Recipes.Remove(existing);
        await _context.SaveChangesAsync();
        return RecipeOpResult.Success;
    }

    public async Task<Recipe> CreateFromAiAsync(string userPrompt, string userId)
    {
        // unchanged from Chapter 12
        var systemPrompt = $$$"""
            Create a recipe based on: "{{{userPrompt}}}".
            Respond ONLY with JSON matching this exact shape:
            {"name": "string", "steps": ["string"], "nutrition": {"calories": 0, "proteinGrams": 0, "carbsGrams": 0, "fatGrams": 0}}
            """;

        var json = await _aiClient.GetJsonCompletionAsync(systemPrompt);
        var draft = System.Text.Json.JsonSerializer.Deserialize<AiRecipeDraft>(json,
            new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new InvalidOperationException("AI returned invalid recipe data");

        var recipe = new Recipe { Name = draft.Name, Steps = draft.Steps, Nutrition = draft.Nutrition, UserId = userId };
        _context.Recipes.Add(recipe);
        await _context.SaveChangesAsync();
        return recipe;
    }
}