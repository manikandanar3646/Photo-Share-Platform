using Photo_Share_Platform.DTOs.Photo;

namespace Photo_Share_Platform.Interfaces
{
    public interface IPhotoService
    {
        Task<PhotoResponseDto> UploadPhotoAsync(
            int eventId,
            int userId,
            IFormFile file);
        Task<List<PhotoResponseDto>> GetPhotosAsync(
            int eventId,
            int userId);
    }
}