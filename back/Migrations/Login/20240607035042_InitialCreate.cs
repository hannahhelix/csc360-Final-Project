using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations.Login
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Logins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    base64Credentials = table.Column<string>(type: "TEXT", nullable: false),
                    hash = table.Column<string>(type: "TEXT", nullable: false),
                    InitialSavingsBalance = table.Column<decimal>(type: "TEXT", nullable: false),
                    GoalSavingsBalance = table.Column<decimal>(type: "TEXT", nullable: false),
                    BudgetGoalTitle = table.Column<string>(type: "TEXT", nullable: false),
                    BudgetGoalAmount = table.Column<decimal>(type: "TEXT", nullable: false),
                    BudgetGoalDecription = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logins", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logins");
        }
    }
}
