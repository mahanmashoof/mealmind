using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealMind.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNutritionInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NutritionInfo_Calories",
                table: "Recipes",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "NutritionInfo_CarbsGrams",
                table: "Recipes",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "NutritionInfo_FatGrams",
                table: "Recipes",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "NutritionInfo_ProteinGrams",
                table: "Recipes",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NutritionInfo_Calories",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "NutritionInfo_CarbsGrams",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "NutritionInfo_FatGrams",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "NutritionInfo_ProteinGrams",
                table: "Recipes");
        }
    }
}
