namespace MealMind.Api.Models;

public class ShoppingList
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<ShoppingListItem> Items { get; set; } = new();
}