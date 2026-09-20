using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;
using Photo_Share_Platform.DTOs.Event;
using Photo_Share_Platform.Interfaces;
using Photo_Share_Platform.Models;

namespace Photo_Share_Platform.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<EventResponseDto> CreateEventAsync(
            CreateEventDto request,
            int userId)
        {
            var newEvent = new Event
            {
                Name = request.Name,
                Description = request.Description,
                EventDate = DateTime.SpecifyKind(
                    request.EventDate,
                    DateTimeKind.Utc
                ),
                Location = request.Location,
                CreatedBy = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Events.Add(newEvent);

            await _context.SaveChangesAsync();

            return new EventResponseDto
            {
                Id = newEvent.Id,
                Name = newEvent.Name,
                Description = newEvent.Description,
                EventDate = newEvent.EventDate,
                Location = newEvent.Location,
                CreatedBy = newEvent.CreatedBy,
                CreatedAt = newEvent.CreatedAt
            };
        }

        public async Task<List<EventResponseDto>> GetEventsAsync(int userId)
        {
            return await _context.Events
                .Where(e => e.CreatedBy == userId)
                .Select(e => new EventResponseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    EventDate = e.EventDate,
                    Location = e.Location,
                    CreatedBy = e.CreatedBy,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();
        }
    }
}