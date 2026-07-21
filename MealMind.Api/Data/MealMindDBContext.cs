using Microsoft.EntityFrameworkCore;
using MealMind.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace MealMind.Api.Data
{
    public class MealMindDBContext : IdentityDbContext<ApplicationUser>
    {
        public MealMindDBContext(DbContextOptions<MealMindDBContext> options) : base(options) { }
        public DbSet<Recipe> Recipes => Set<Recipe>();
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // required for Identity's own tables
            //store NutritionInfo's fields as extra columns on the Recipes table itself rather than creating a whole new table with its own foreign key
            modelBuilder.Entity<Recipe>().OwnsOne(r => r.Nutrition);
            modelBuilder.Entity<Recipe>()
        .Property(r => r.Steps)
        .HasConversion(
            v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
            v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
        );
            modelBuilder.Entity<WeeklyPlan>()
        .HasMany(p => p.Entries)
        .WithOne(e => e.WeeklyPlan)
        .HasForeignKey(e => e.WeeklyPlanId);
        }
        public DbSet<WeeklyPlan> WeeklyPlans => Set<WeeklyPlan>();
        public DbSet<MealPlanEntry> MealPlanEntries => Set<MealPlanEntry>();
    }
}