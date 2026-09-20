using Photo_Share_Platform.DTOs.Galleries;
using Photo_Share_Platform.DTOs.Photo;

namespace Photo_Share_Platform.Interfaces
{
    public interface IGalleryService
    {
        Task<GalleryResponseDto> CreateGalleryAsync(CreateGalleryDto request, int userId);

        Task AddPhotosAsync(
            int galleryId,
            AddGalleryPhotosDto request,
            int userId);

        Task<GalleryResponseDto> PublishGalleryAsync(
            int galleryId,
            int userId);

        Task<List<PhotoResponseDto>> VerifyGalleryPinAsync(
            string token,
            VerifyGalleryPinDto request);
    }
}