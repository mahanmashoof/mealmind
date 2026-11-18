namespace MealMind.Api.Models;

public class ShoppingListItem
{
    public int Id { get; set; }
    public int ShoppingListId { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ShoppingList? ShoppingList { get; set; }

    public string Name { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool IsChecked { get; set; }
}