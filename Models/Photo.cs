namespace Photo_Share_Platform.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UploadedBy { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string StorageKey { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Event Event { get; set; } = null!;
        public User UploadedByUser { get; set; } = null!;
        public ICollection<GalleryPhoto> GalleryPhotos { get; set; } = new List<GalleryPhoto>();
    }
}