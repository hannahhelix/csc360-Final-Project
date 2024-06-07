using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    /// <inheritdoc />
    public partial class AddMonthlyGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccountId",
                table: "GoalMarkers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GoalMarkers_AccountId",
                table: "GoalMarkers",
                column: "AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_GoalMarkers_Accounts_AccountId",
                table: "GoalMarkers",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GoalMarkers_Accounts_AccountId",
                table: "GoalMarkers");

            migrationBuilder.DropIndex(
                name: "IX_GoalMarkers_AccountId",
                table: "GoalMarkers");

            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "GoalMarkers");
        }
    }
}
