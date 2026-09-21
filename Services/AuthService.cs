using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Photo_Share_Platform.Data;
using Photo_Share_Platform.DTOs;
using Photo_Share_Platform.DTOs.Auth;
using Photo_Share_Platform.Interfaces;
using Photo_Share_Platform.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Photo_Share_Platform.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // =========================
    // REGISTER
    // =========================
    public async Task<LoginResponseDto> RegisterAsync(RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new Exception("Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new Exception("Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new Exception("Password is required.");
        }

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            throw new Exception("Email is already registered.");
        }

        // Only these two roles are allowed.
        var role = request.Role?.Trim();

        if (role != "Admin" && role != "Team")
        {
            role = "Team";
        }

        // Admin registration requires the secret registration code.
        if (role == "Admin")
        {
            var adminRegistrationCode =
                _configuration["AdminRegistrationCode"];

            if (string.IsNullOrWhiteSpace(adminRegistrationCode))
            {
                throw new Exception(
                    "Admin registration is not configured."
                );
            }

            if (string.IsNullOrWhiteSpace(request.AdminCode) ||
                request.AdminCode != adminRegistrationCode)
            {
                throw new Exception(
                    "Invalid Admin Registration Code."
                );
            }
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            ),
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    // =========================
    // LOGIN
    // =========================
    public async Task<LoginResponseDto> LoginAsync(LoginDto request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            throw new Exception("Invalid email or password.");
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            throw new Exception("Invalid email or password.");
        }

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    // =========================
    // JWT TOKEN
    // =========================
    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new Exception("JWT key is not configured.");
        }

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Name
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var duration = _configuration
            .GetValue<int>("Jwt:DurationInMinutes");

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(duration),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}