using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;

namespace MealMind.Api.Services;

public interface IShoppingListService
{
    Task<ShoppingList?> GetMineAsync(string userId);
    Task<ShoppingList> GenerateAsync(string userId);
    Task<bool> UpdateItemAsync(int itemId, string userId, double? quantity, bool? isChecked);
}

public class ShoppingListService : IShoppingListService
{
    private readonly MealMindDBContext _context;
    public ShoppingListService(MealMindDBContext context) => _context = context;

    public async Task<ShoppingList?> GetMineAsync(string userId) =>
        await _context.ShoppingLists.Include(s => s.Items).FirstOrDefaultAsync(s => s.UserId == userId);

    public async Task<ShoppingList> GenerateAsync(string userId)
    {
        var plan = await _context.WeeklyPlans
            .Include(p => p.Entries).ThenInclude(e => e.Recipe).ThenInclude(r => r!.Ingredients)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        var aggregated = new Dictionary<(string Name, string Unit), (double Qty, string DisplayName)>();

        if (plan is not null)
        {
            foreach (var entry in plan.Entries)
            {
                if (entry.Recipe is null) continue;
                var basePortions = entry.Recipe.Portions > 0 ? entry.Recipe.Portions : 1;
                var factor = (double)entry.Portions / basePortions;

                foreach (var ing in entry.Recipe.Ingredients)
                {
                    var key = (ing.Name.Trim().ToLowerInvariant(), ing.Unit.Trim().ToLowerInvariant());
                    var scaled = ing.Quantity * factor;
                    aggregated[key] = aggregated.TryGetValue(key, out var existing)
                        ? (existing.Qty + scaled, existing.DisplayName)
                        : (scaled, ing.Name.Trim());
                }
            }
        }

        var existingList = await _context.ShoppingLists.Include(s => s.Items).FirstOrDefaultAsync(s => s.UserId == userId);
        if (existingList is not null)
        {
            _context.ShoppingListItems.RemoveRange(existingList.Items);
            _context.ShoppingLists.Remove(existingList);
            await _context.SaveChangesAsync();
        }

        var newList = new ShoppingList
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Items = aggregated.Select(kv => new ShoppingListItem
            {
                Name = kv.Value.DisplayName,
                Unit = kv.Key.Unit,
                Quantity = Math.Round(kv.Value.Qty, 2),
                IsChecked = false
            }).ToList()
        };

        _context.ShoppingLists.Add(newList);
        await _context.SaveChangesAsync();
        return newList;
    }

    public async Task<bool> UpdateItemAsync(int itemId, string userId, double? quantity, bool? isChecked)
    {
        var item = await _context.ShoppingListItems.Include(i => i.ShoppingList).FirstOrDefaultAsync(i => i.Id == itemId);
        if (item is null || item.ShoppingList?.UserId != userId) return false;

        if (quantity.HasValue) item.Quantity = quantity.Value;
        if (isChecked.HasValue) item.IsChecked = isChecked.Value;
        await _context.SaveChangesAsync();
        return true;
    }
}