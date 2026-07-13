using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealMind.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameNutritionProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NutritionInfo_ProteinGrams",
                table: "Recipes",
                newName: "Nutrition_ProteinGrams");

            migrationBuilder.RenameColumn(
                name: "NutritionInfo_FatGrams",
                table: "Recipes",
                newName: "Nutrition_FatGrams");

            migrationBuilder.RenameColumn(
                name: "NutritionInfo_CarbsGrams",
                table: "Recipes",
                newName: "Nutrition_CarbsGrams");

            migrationBuilder.RenameColumn(
                name: "NutritionInfo_Calories",
                table: "Recipes",
                newName: "Nutrition_Calories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nutrition_ProteinGrams",
                table: "Recipes",
                newName: "NutritionInfo_ProteinGrams");

            migrationBuilder.RenameColumn(
                name: "Nutrition_FatGrams",
                table: "Recipes",
                newName: "NutritionInfo_FatGrams");

            migrationBuilder.RenameColumn(
                name: "Nutrition_CarbsGrams",
                table: "Recipes",
                newName: "NutritionInfo_CarbsGrams");

            migrationBuilder.RenameColumn(
                name: "Nutrition_Calories",
                table: "Recipes",
                newName: "NutritionInfo_Calories");
        }
    }
}
