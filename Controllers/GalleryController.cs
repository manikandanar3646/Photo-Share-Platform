using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Photo_Share_Platform.DTOs.Galleries;
using Photo_Share_Platform.Interfaces;
using System.Security.Claims;

namespace Photo_Share_Platform.Controllers
{
    [ApiController]
    [Route("api/galleries")]
    [Authorize]
    public class GalleryController : ControllerBase
    {
        private readonly IGalleryService _galleryService;

        public GalleryController(IGalleryService galleryService)
        {
            _galleryService = galleryService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGallery(
            CreateGalleryDto request)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                var result = await _galleryService.CreateGalleryAsync(
                    request,
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

        [HttpPost("{galleryId}/photos")]
        public async Task<IActionResult> AddPhotos(
            int galleryId,
            AddGalleryPhotosDto request)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                await _galleryService.AddPhotosAsync(
                    galleryId,
                    request,
                    userId);

                return Ok(new
                {
                    message = "Photos added to gallery successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPost("{galleryId}/publish")]
        public async Task<IActionResult> PublishGallery(
            int galleryId)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            try
            {
                var result = await _galleryService.PublishGalleryAsync(
                    galleryId,
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

        [HttpPost("public/{token}/verify")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyPin(
                string token,
        VerifyGalleryPinDto request)
        {
            try
            {
                var result = await _galleryService.VerifyGalleryPinAsync(token, request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}