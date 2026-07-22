using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealMind.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMealPlanEntrySlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Slot",
                table: "MealPlanEntries",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Slot",
                table: "MealPlanEntries");
        }
    }
}
