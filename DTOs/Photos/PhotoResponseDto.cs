namespace Photo_Share_Platform.DTOs.Photo
{
    public class PhotoResponseDto
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public int UploadedBy { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string StorageKey { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}