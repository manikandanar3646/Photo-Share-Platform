using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;
using System.Security.Claims;

namespace Photo_Share_Platform.Controllers;

[ApiController]
[Route("api/team")]
[Authorize(Roles = "Team")]
public class TeamController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("events")]
    public async Task<IActionResult> GetMyEvents()
    {
        var userIdClaim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        var events = await _context.EventMembers
            .Where(member => member.UserId == userId)
            .Select(member => new
            {
                id = member.Event.Id,
                name = member.Event.Name,
                description = member.Event.Description,
                eventDate = member.Event.EventDate,
                location = member.Event.Location,
                photoCount = member.Event.Photos.Count
            })
            .OrderByDescending(eventItem => eventItem.eventDate)
            .ToListAsync();

        return Ok(events);
    }
}