namespace Photo_Share_Platform.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Event> CreatedEvents { get; set; } = new List<Event>();
        public ICollection<EventMember> EventMembers { get; set; } = new List<EventMember>();
        public ICollection<Photo> UploadedPhotos { get; set; } = new List<Photo>();
    }
}