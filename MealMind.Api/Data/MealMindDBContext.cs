using Microsoft.EntityFrameworkCore;
using MealMind.Api.Models;

namespace MealMind.Api.Data
{
    public class MealMindDBContext : DbContext
    {
        public MealMindDBContext(DbContextOptions<MealMindDBContext> options) : base(options) { }
        public DbSet<Recipe> Recipes => Set<Recipe>();
    }
}