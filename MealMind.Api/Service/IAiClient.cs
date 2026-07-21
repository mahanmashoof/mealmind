namespace MealMind.Api.Service;

public interface IAiClient
{
    Task<string> GetCompletionAsync(string prompt);
}