using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;
using Photo_Share_Platform.DTOs.Photo;
using Photo_Share_Platform.Interfaces;
using Photo_Share_Platform.Models;

namespace Photo_Share_Platform.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly AppDbContext _context;
        private readonly IStorageService _storageService;

        public PhotoService(
            AppDbContext context,
            IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }

        public async Task<PhotoResponseDto> UploadPhotoAsync(
            int eventId,
            int userId,
            IFormFile file)
        {
            // Check whether the event exists
            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem == null)
                throw new Exception("Event not found.");

            // Check whether the user belongs to the event
            var isMember = await _context.EventMembers
                .AnyAsync(em =>
                    em.EventId == eventId &&
                    em.UserId == userId);

            // Event creator can also upload
            var isEventCreator = eventItem.CreatedBy == userId;

            if (!isMember && !isEventCreator)
                throw new Exception(
                    "You are not a member of this event.");

            // Validate file
            if (file == null || file.Length == 0)
                throw new Exception("No file selected.");

            var allowedTypes = new[]
            {
                "image/jpeg",
                "image/png",
                "image/webp"
            };

            if (!allowedTypes.Contains(file.ContentType))
                throw new Exception(
                    "Only JPG, PNG and WEBP images are allowed.");

            // 10 MB limit
            if (file.Length > 10 * 1024 * 1024)
                throw new Exception(
                    "File size cannot exceed 10 MB.");

            // Generate unique storage name
            var storageKey =
                $"{eventId}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            // Upload image to Supabase
            await using var stream = file.OpenReadStream();

            await _storageService.UploadAsync(
                stream,
                storageKey,
                file.ContentType);

            // Save metadata in PostgreSQL
            var photo = new Photo
            {
                EventId = eventId,
                UploadedBy = userId,
                FileName = file.FileName,
                StorageKey = storageKey,
                FileSize = file.Length,
                CreatedAt = DateTime.UtcNow
            };

            _context.Photos.Add(photo);

            await _context.SaveChangesAsync();

            return new PhotoResponseDto
            {
                Id = photo.Id,
                EventId = photo.EventId,
                UploadedBy = photo.UploadedBy,
                FileName = photo.FileName,
                FileSize = photo.FileSize,
                CreatedAt = photo.CreatedAt
            };
        }

        public async Task<List<PhotoResponseDto>> GetPhotosAsync(
            int eventId,
            int userId)
        {
            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem == null)
                throw new Exception("Event not found.");

            var isMember = await _context.EventMembers
                .AnyAsync(em =>
                    em.EventId == eventId &&
                    em.UserId == userId);

            var isEventCreator = eventItem.CreatedBy == userId;

            if (!isMember && !isEventCreator)
                throw new Exception(
                    "You do not have access to this event.");

            return await _context.Photos
                .Where(p => p.EventId == eventId)
                .Select(p => new PhotoResponseDto
                {
                    Id = p.Id,
                    EventId = p.EventId,
                    UploadedBy = p.UploadedBy,
                    FileName = p.FileName,
                    FileSize = p.FileSize,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();
        }
    }
}