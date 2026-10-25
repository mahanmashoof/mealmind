using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealMind.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeCookingTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CookingTimeMinutes",
                table: "Recipes",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CookingTimeMinutes",
                table: "Recipes");
        }
    }
}
