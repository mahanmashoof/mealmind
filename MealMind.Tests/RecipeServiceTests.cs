using Microsoft.EntityFrameworkCore;
using MealMind.Api.Data;
using MealMind.Api.Models;
using MealMind.Api.Services;
using Xunit;

namespace MealMind.Tests;

public class RecipeServiceTests
{
    private static MealMindDBContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<MealMindDBContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // unique DB per test = no shared state
            .Options;
        return new MealMindDBContext(options);
    }

    [Fact]
    public async Task CreateAsync_SetsUserId_FromParameter()
    {
        // Arrange
        var context = CreateInMemoryContext();
        var service = new RecipeService(context, aiClient: null!); // AI not needed for this test
        var recipe = new Recipe { Name = "Test Recipe" };

        // Act
        var result = await service.CreateAsync(recipe, "user-123");

        // Assert
        Assert.Equal("user-123", result.UserId);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsForbidden_WhenNotOwner()
    {
        var context = CreateInMemoryContext();
        var service = new RecipeService(context, aiClient: null!);
        var recipe = await service.CreateAsync(new Recipe { Name = "Owned by A" }, "user-A");

        var result = await service.DeleteAsync(recipe.Id, "user-B");

        Assert.Equal(RecipeOpResult.Forbidden, result);
    }
}