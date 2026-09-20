namespace Photo_Share_Platform.DTOs.Galleries
{
    public class GalleryResponseDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public string Token { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}
