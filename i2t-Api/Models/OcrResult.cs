// i2t-Api/Models/OcrResult.cs

namespace i2t.Models
{
    public class OcrResult
    {
        public string Text { get; set; } = string.Empty;
        public List<OcrBox> Boxes { get; set; } = new List<OcrBox>();
    }

    public class OcrBox
    {
        public string? Word { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public float Confidence { get; set; }
    }
}
