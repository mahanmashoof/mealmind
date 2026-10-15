namespace MealMind.Api.Service;

public interface IAiClient
{
    Task<string> GetCompletionAsync(string prompt);
    Task<string> GetJsonCompletionAsync(string prompt);
    Task<string> GetJsonCompletionFromImageAsync(string prompt, byte[] imageBytes, string mimeType);
}