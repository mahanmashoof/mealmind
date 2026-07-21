using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace MealMind.Api.Service;

public class OpenAiClient : IAiClient
{
    private readonly HttpClient _httpClient;

    public OpenAiClient(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", config["OpenAI:ApiKey"]);
    }

    public async Task<string> GetCompletionAsync(string prompt)
    {
        var request = new
        {
            model = "gpt-4o-mini",
            messages = new[] { new { role = "user", content = prompt } }
        };

        var response = await _httpClient.PostAsJsonAsync("chat/completions", request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OpenAiResponse>();
        return result?.Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;
    }

    private class OpenAiResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice>? Choices { get; set; }
    }

    private class Choice
    {
        [JsonPropertyName("message")]
        public Message? Message { get; set; }
    }

    private class Message
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }
}