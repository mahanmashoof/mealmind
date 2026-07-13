using Microsoft.EntityFrameworkCore;
using MealMind.Api.Models;

namespace MealMind.Api.Data
{
    public class MealMindDBContext : DbContext
    {
        public MealMindDBContext(DbContextOptions<MealMindDBContext> options) : base(options) { }
        public DbSet<Recipe> Recipes => Set<Recipe>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //store NutritionInfo's fields as extra columns on the Recipes table itself rather than creating a whole new table with its own foreign key
            modelBuilder.Entity<Recipe>().OwnsOne(r => r.Nutrition);
        }
    }
}