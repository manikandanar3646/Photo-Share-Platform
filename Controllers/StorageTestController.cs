using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Photo_Share_Platform.Interfaces;

namespace Photo_Share_Platform.Controllers
{
    [ApiController]
    [Route("api/storage-test")]
    [Authorize]
    public class StorageTestController : ControllerBase
    {
        private readonly IStorageService _storageService;

        public StorageTestController(IStorageService storageService)
        {
            _storageService = storageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new
                {
                    message = "No file selected."
                });
            }

            var fileName =
                $"{Guid.NewGuid()}-{file.FileName}";

            await using var stream = file.OpenReadStream();

            var result = await _storageService.UploadAsync(
                stream,
                fileName,
                file.ContentType);

            return Ok(new
            {
                message = "Upload successful.",
                fileName = result
            });
        }
    }
}