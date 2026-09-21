using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Photo_Share_Platform.DTOs.EventMember;
using Photo_Share_Platform.Interfaces;

namespace Photo_Share_Platform.Controllers
{
    [ApiController]
    [Route("api/events/{eventId}/members")]
    [Authorize]
    public class EventMemberController : ControllerBase
    {
        private readonly IEventMemberService _eventMemberService;

        public EventMemberController(
            IEventMemberService eventMemberService)
        {
            _eventMemberService = eventMemberService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMember(
            int eventId,
            AddEventMemberDto request)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                var result = await _eventMemberService.AddMemberAsync(
                    eventId,
                    request,
                    userId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetMembers(int eventId)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                var result = await _eventMemberService.GetMembersAsync(
                    eventId,
                    userId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> RemoveMember(
            int eventId,
            int userId)
        {
            var currentUserId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                await _eventMemberService.RemoveMemberAsync(
                    eventId,
                    userId,
                    currentUserId);

                return Ok(new
                {
                    message = "Member removed successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}