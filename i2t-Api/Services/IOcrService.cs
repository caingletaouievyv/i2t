// i2t-Api/Services/IOcrService.cs

using i2t.Models;

namespace i2t.Services
{
    public interface IOcrService
    {
        Task<OcrResult> ExtractTextAsync(
            IFormFile imageFile,
            string language = "eng",
            int version = 1,
            int expandPixels = 5,
            int? x = null,
            int? y = null,
            int? width = null,
            int? height = null);
    }
}
