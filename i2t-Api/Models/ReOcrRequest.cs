// i2t-Api/Models/ReOcrRequest.cs

namespace i2t.Models
{
    public class ReOcrRequest
    {
        public string? ImageBase64 { get; set; }
        public OcrBox Box { get; set; } = null!;
        public string? Language { get; set; }
    }
}

