using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealMind.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMealPlanEntryPortions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Portions",
                table: "MealPlanEntries",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Portions",
                table: "MealPlanEntries");
        }
    }
}
