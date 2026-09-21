namespace Photo_Share_Platform.DTOs.Team;

public class TeamEventResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime EventDate { get; set; }
    public string? Location { get; set; }
    public int PhotoCount { get; set; }
}