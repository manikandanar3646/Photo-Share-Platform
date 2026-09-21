namespace Photo_Share_Platform.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User CreatedByUser { get; set; } = null!;
        public ICollection<EventMember> EventMembers { get; set; } = new List<EventMember>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();
    }
}