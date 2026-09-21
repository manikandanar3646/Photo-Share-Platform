namespace Photo_Share_Platform.DTOs.EventMember
{
    public class AddEventMemberDto
    {
        public int UserId { get; set; }

        public string EventRole { get; set; } = "Photographer";
    }
}