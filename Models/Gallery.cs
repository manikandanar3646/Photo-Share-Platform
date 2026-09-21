namespace Photo_Share_Platform.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string Token { get; set; } = string.Empty;
        public string PinHash { get; set; } = string.Empty;
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
        public Event Event { get; set; } = null!;
        public ICollection<GalleryPhoto> GalleryPhotos { get; set; } = new List<GalleryPhoto>();
    }
}