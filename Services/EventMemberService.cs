using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;
using Photo_Share_Platform.DTOs.EventMember;
using Photo_Share_Platform.Interfaces;
using Photo_Share_Platform.Models;

namespace Photo_Share_Platform.Services
{
    public class EventMemberService : IEventMemberService
    {
        private readonly AppDbContext _context;

        public EventMemberService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<EventMemberResponseDto> AddMemberAsync(
            int eventId,
            AddEventMemberDto request,
            int currentUserId)
        {
            var eventItem = await _context.Events
                .FirstOrDefaultAsync(e =>
                    e.Id == eventId &&
                    e.CreatedBy == currentUserId);

            if (eventItem == null)
                throw new Exception("Event not found.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null)
                throw new Exception("User not found.");

            if (user.Role != "Team")
                throw new Exception("Only Team users can be assigned to events.");

            var eventRole = request.EventRole?.Trim();

            if (string.IsNullOrWhiteSpace(eventRole))
                throw new Exception("Event role is required.");

            if (!eventRole.Equals("Photographer", StringComparison.OrdinalIgnoreCase) &&
                !eventRole.Equals("Editor", StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception(
                    "Invalid event role. Choose Photographer or Editor.");
            }

            var alreadyMember = await _context.EventMembers
                .AnyAsync(em =>
                    em.EventId == eventId &&
                    em.UserId == request.UserId);

            if (alreadyMember)
                throw new Exception(
                    "User is already a member of this event.");

            var member = new EventMember
            {
                EventId = eventId,
                UserId = request.UserId,
                EventRole = eventRole
            };

            _context.EventMembers.Add(member);

            await _context.SaveChangesAsync();

            return new EventMemberResponseDto
            {
                Id = member.Id,
                EventId = eventId,
                UserId = user.Id,
                UserName = user.Name,
                UserEmail = user.Email,
                EventRole = member.EventRole
            };
        }

        public async Task<List<EventMemberResponseDto>> GetMembersAsync(
            int eventId,
            int currentUserId)
        {
            var eventExists = await _context.Events
                .AnyAsync(e =>
                    e.Id == eventId &&
                    e.CreatedBy == currentUserId);

            if (!eventExists)
                throw new Exception("Event not found.");

            return await _context.EventMembers
                .Where(em => em.EventId == eventId)
                .Select(em => new EventMemberResponseDto
                {
                    Id = em.Id,
                    EventId = em.EventId,
                    UserId = em.UserId,
                    UserName = em.User.Name,
                    UserEmail = em.User.Email,
                    EventRole = em.EventRole
                })
                .ToListAsync();
        }

        public async Task RemoveMemberAsync(
            int eventId,
            int userId,
            int currentUserId)
        {
            var eventExists = await _context.Events
                .AnyAsync(e =>
                    e.Id == eventId &&
                    e.CreatedBy == currentUserId);

            if (!eventExists)
                throw new Exception("Event not found.");

            var member = await _context.EventMembers
                .FirstOrDefaultAsync(em =>
                    em.EventId == eventId &&
                    em.UserId == userId);

            if (member == null)
                throw new Exception("Member not found.");

            _context.EventMembers.Remove(member);

            await _context.SaveChangesAsync();
        }
    }
}