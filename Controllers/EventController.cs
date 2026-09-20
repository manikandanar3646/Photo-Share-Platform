using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Photo_Share_Platform.DTOs.Event;
using Photo_Share_Platform.Interfaces;

namespace Photo_Share_Platform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent(CreateEventDto request)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _eventService.CreateEventAsync(
                request,
                userId
            );

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _eventService.GetEventsAsync(userId);

            return Ok(result);
        }
    }
}