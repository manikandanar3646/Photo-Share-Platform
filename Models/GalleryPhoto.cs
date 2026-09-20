namespace Photo_Share_Platform.Models
{
    public class GalleryPhoto
    {
        public int Id { get; set; }
        public int GalleryId { get; set; }
        public int PhotoId { get; set; }
        public Gallery Gallery { get; set; } = null!;
        public Photo Photo { get; set; } = null!;
    }
}