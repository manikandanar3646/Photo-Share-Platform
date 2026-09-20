using Photo_Share_Platform.DTOs.Event;

namespace Photo_Share_Platform.Interfaces
{
    public interface IEventService
    {
        Task<EventResponseDto> CreateEventAsync(
            CreateEventDto request,
            int userId);
        Task<List<EventResponseDto>> GetEventsAsync(
            int userId);
    }
}