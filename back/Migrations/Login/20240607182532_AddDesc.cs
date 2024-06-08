using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations.Login
{
    /// <inheritdoc />
    public partial class AddDesc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BudgetGoalDecription",
                table: "Logins",
                newName: "BudgetGoalDescription");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BudgetGoalDescription",
                table: "Logins",
                newName: "BudgetGoalDecription");
        }
    }
}
