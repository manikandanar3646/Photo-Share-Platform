using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Photo_Share_Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddEventMemberRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EventRole",
                table: "EventMembers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventRole",
                table: "EventMembers");
        }
    }
}
