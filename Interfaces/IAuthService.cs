using Photo_Share_Platform.DTOs.Auth;

namespace Photo_Share_Platform.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> RegisterAsync(RegisterDto request);

        Task<LoginResponseDto> LoginAsync(LoginDto request);
    }
}