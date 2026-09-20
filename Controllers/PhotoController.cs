using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Photo_Share_Platform.Interfaces;

namespace Photo_Share_Platform.Controllers
{
    [ApiController]
    [Route("api/photos")]
    [Authorize]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _photoService;
        public PhotoController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpPost("upload/{eventId}")]
        public async Task<IActionResult> UploadPhoto(
            int eventId,
            IFormFile file)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );
            try
            {
                var result = await _photoService.UploadPhotoAsync(
                    eventId,
                    userId,
                    file);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetPhotos(int eventId)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );
            try
            {
                var result = await _photoService.GetPhotosAsync(
                    eventId,
                    userId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}