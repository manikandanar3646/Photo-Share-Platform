namespace Photo_Share_Platform.Models
{
    public class EventMember
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UserId { get; set; }
        public Event Event { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}