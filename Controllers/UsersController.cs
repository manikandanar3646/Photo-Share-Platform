using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Photo_Share_Platform.Data;

namespace Photo_Share_Platform.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/users
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(user => new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                user.CreatedAt
            })
            .OrderBy(user => user.Name)
            .ToListAsync();

        return Ok(users);
    }

    // GET: /api/users/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Where(user => user.Id == id)
            .Select(user => new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role,
                user.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        return Ok(user);
    }
}