using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;
using Photo_Share_Platform.DTOs.Galleries;
using Photo_Share_Platform.DTOs.Photo;
using Photo_Share_Platform.Interfaces;
using Photo_Share_Platform.Models;

namespace Photo_Share_Platform.Services
{
    public class GalleryService : IGalleryService
    {
        private readonly AppDbContext _context;

        public GalleryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<GalleryResponseDto> CreateGalleryAsync(
            CreateGalleryDto request,
            int userId)
        {
            // Check that the event belongs to the current user
            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e =>
                    e.Id == request.EventId &&
                    e.CreatedBy == userId);

            if (eventItem == null)
                throw new Exception("Event not found.");

            // Validate PIN
            if (string.IsNullOrWhiteSpace(request.Pin))
                throw new Exception("PIN is required.");

            if (request.Pin.Length < 4)
                throw new Exception("PIN must be at least 4 characters.");

            // Check if gallery already exists for this event
            var existingGallery = await _context.Galleries
                .FirstOrDefaultAsync(g => g.EventId == request.EventId);

            if (existingGallery != null)
                throw new Exception(
                    "A gallery already exists for this event.");

            // Generate shareable token
            var token = Guid.NewGuid().ToString("N");

            var gallery = new Gallery
            {
                EventId = request.EventId,
                Token = token,
                PinHash = BCrypt.Net.BCrypt.HashPassword(request.Pin),
                IsPublished = false,
                PublishedAt = null
            };

            _context.Galleries.Add(gallery);

            await _context.SaveChangesAsync();

            return new GalleryResponseDto
            {
                Id = gallery.Id,
                EventId = gallery.EventId,
                Token = gallery.Token,
                IsPublished = gallery.IsPublished,
                PublishedAt = gallery.PublishedAt
            };
        }

        public async Task AddPhotosAsync(
            int galleryId,
            AddGalleryPhotosDto request,
            int userId)
        {
            var gallery = await _context.Galleries
                .Include(g => g.Event)
                .FirstOrDefaultAsync(g =>
                    g.Id == galleryId &&
                    g.Event.CreatedBy == userId);

            if (gallery == null)
                throw new Exception("Gallery not found.");

            if (request.PhotoIds == null ||
                request.PhotoIds.Count == 0)
            {
                throw new Exception("No photos selected.");
            }

            // Check that all selected photos belong to this gallery's event
            var photos = await _context.Photos
                .Where(p =>
                    p.EventId == gallery.EventId &&
                    request.PhotoIds.Contains(p.Id))
                .ToListAsync();

            if (photos.Count != request.PhotoIds.Distinct().Count())
                throw new Exception(
                    "One or more selected photos do not belong to this event.");

            foreach (var photo in photos)
            {
                var alreadyAdded = await _context.GalleryPhotos
                    .AnyAsync(gp =>
                        gp.GalleryId == galleryId &&
                        gp.PhotoId == photo.Id);

                if (!alreadyAdded)
                {
                    _context.GalleryPhotos.Add(new GalleryPhoto
                    {
                        GalleryId = galleryId,
                        PhotoId = photo.Id
                    });
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<GalleryResponseDto> PublishGalleryAsync(
            int galleryId,
            int userId)
        {
            var gallery = await _context.Galleries
                .Include(g => g.Event)
                .FirstOrDefaultAsync(g =>
                    g.Id == galleryId &&
                    g.Event.CreatedBy == userId);

            if (gallery == null)
                throw new Exception("Gallery not found.");

            var photoCount = await _context.GalleryPhotos
                .CountAsync(gp => gp.GalleryId == galleryId);

            if (photoCount == 0)
                throw new Exception(
                    "Add at least one photo before publishing.");

            gallery.IsPublished = true;
            gallery.PublishedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new GalleryResponseDto
            {
                Id = gallery.Id,
                EventId = gallery.EventId,
                Token = gallery.Token,
                IsPublished = gallery.IsPublished,
                PublishedAt = gallery.PublishedAt
            };
        }

        public async Task<List<PhotoResponseDto>> VerifyGalleryPinAsync(
    string token,
    VerifyGalleryPinDto request)
        {
            var gallery = await _context.Galleries
                .FirstOrDefaultAsync(g => g.Token == token);

            if (gallery == null)
                throw new Exception("Gallery not found.");

            if (!gallery.IsPublished)
                throw new Exception("Gallery is not published.");

            if (string.IsNullOrWhiteSpace(request.Pin))
                throw new Exception("PIN is required.");

            if (!BCrypt.Net.BCrypt.Verify(request.Pin, gallery.PinHash))
                throw new Exception("Invalid PIN.");

            return await _context.GalleryPhotos
                .Where(gp => gp.GalleryId == gallery.Id)
                .Select(gp => new PhotoResponseDto
                {
                    Id = gp.Photo.Id,
                    EventId = gp.Photo.EventId,
                    UploadedBy = gp.Photo.UploadedBy,
                    FileName = gp.Photo.FileName,
                    FileSize = gp.Photo.FileSize,
                    CreatedAt = gp.Photo.CreatedAt
                })
                .ToListAsync();
        }
    }
}