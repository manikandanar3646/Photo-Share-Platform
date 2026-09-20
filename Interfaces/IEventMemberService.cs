using Photo_Share_Platform.DTOs.EventMember;

namespace Photo_Share_Platform.Interfaces
{
    public interface IEventMemberService
    {
        Task<EventMemberResponseDto> AddMemberAsync(
            int eventId,
            AddEventMemberDto request,
            int currentUserId);

        Task<List<EventMemberResponseDto>> GetMembersAsync(
            int eventId,
            int currentUserId);

        Task RemoveMemberAsync(
            int eventId,
            int userId,
            int currentUserId);
    }
}