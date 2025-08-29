// i2t-Api/Controllers/OcrController.cs

using i2t.Models;
using i2t.Services;
using Microsoft.AspNetCore.Mvc;

namespace i2t.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OcrController : ControllerBase
    {
        private readonly IOcrService _ocrService;

        public OcrController(IOcrService ocrService)
        {
            _ocrService = ocrService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile image,
                                                    [FromForm] string language = "eng",
                                                    [FromForm] int version = 1,
                                                    [FromForm] int expandPixels = 5,
                                                    [FromForm] int? x = null,
                                                    [FromForm] int? y = null,
                                                    [FromForm] int? width = null,
                                                    [FromForm] int? height = null)
        {
            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded.");
            
            OcrResult result = await _ocrService.ExtractTextAsync(image, language, version, expandPixels, x, y, width, height);
            return Ok(result);
        }

        [HttpPost("UploadMultipleImages")]
        public async Task<IActionResult> UploadMultipleImages(List<IFormFile> images, [FromForm] string language = "eng")
        {
            if (images == null || images.Count == 0)
                return BadRequest("No images uploaded.");

            var results = new List<OcrResult>();

            foreach (var image in images)
            {
                var res = await _ocrService.ExtractTextAsync(image, language);
                results.Add(res);
            }

            return Ok(new { results });
        }
    }
}

