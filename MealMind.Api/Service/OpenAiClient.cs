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

    public async Task<string> GetJsonCompletionAsync(string prompt)
    {
        var request = new
        {
            model = "gpt-4o-mini",
            messages = new[] { new { role = "user", content = prompt } },
            response_format = new { type = "json_object" }
        };

        var response = await _httpClient.PostAsJsonAsync("chat/completions", request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OpenAiResponse>();
        return result?.Choices?.FirstOrDefault()?.Message?.Content ?? string.Empty;
    }

    public async Task<string> GetJsonCompletionFromImagesAsync(string prompt, IEnumerable<(byte[] Bytes, string MimeType)> images)
    {
        var content = new List<object> { new { type = "text", text = prompt } };
        foreach (var (bytes, mimeType) in images)
        {
            var base64 = Convert.ToBase64String(bytes);
            content.Add(new { type = "image_url", image_url = new { url = $"data:{mimeType};base64,{base64}" } });
        }

        var request = new
        {
            model = "gpt-4o-mini",
            messages = new object[] { new { role = "user", content } },
            response_format = new { type = "json_object" }
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