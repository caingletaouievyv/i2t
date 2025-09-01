// i2t-Api/Services/TesseractOcrService.cs

using Tesseract;
using i2t.Models;
using WeCantSpell.Hunspell;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace i2t.Services
{
    public class TesseractOcrService : IOcrService
    {
        private static readonly WordList _hunspell;

        static TesseractOcrService()
        {
            var basePath = AppContext.BaseDirectory;

            var affFile = Path.Combine(basePath, "Dictionaries", "en_US.aff");
            var dicFile = Path.Combine(basePath, "Dictionaries", "en_US.dic");

            _hunspell = WordList.CreateFromFiles(dicFile, affFile);
        }

        public async Task<OcrResult> ExtractTextAsync(
            IFormFile imageFile,
            string language = "eng",
            int version = 1,
            int expandPixels = 5,
            int? x = null,
            int? y = null,
            int? width = null,
            int? height = null)
        {
            try
            {
                var tempFilePath = Path.GetTempFileName();
                await using (var stream = File.Create(tempFilePath))
                    await imageFile.CopyToAsync(stream);

                var tessDataPath = Path.Combine(AppContext.BaseDirectory, "tessdata");
                if (!Directory.Exists(tessDataPath))
                    throw new Exception($"Tessdata folder not found at {tessDataPath}");

                using var engine = new TesseractEngine(tessDataPath, language, EngineMode.Default);
                string fileToProcess = tempFilePath;

                int offsetX = 0, offsetY = 0;

                if (version >= 2 && x.HasValue && y.HasValue && width.HasValue && height.HasValue)
                {
                    int cropX = Math.Max(0, x.Value);
                    int cropY = Math.Max(0, y.Value);
                    int cropW = width.Value;
                    int cropH = height.Value;

                    if (version == 3)
                    {
                        cropX = Math.Max(0, cropX - expandPixels);
                        cropY = Math.Max(0, cropY - expandPixels);
                        cropW += expandPixels * 2;
                        cropH += expandPixels * 2;
                    }

                    offsetX = cropX;
                    offsetY = cropY;

                    using (var image = Image.Load<Rgba32>(tempFilePath))
                    {
                        cropW = Math.Min(cropW, image.Width - cropX);
                        cropH = Math.Min(cropH, image.Height - cropY);

                        var cropRect = new SixLabors.ImageSharp.Rectangle(cropX, cropY, cropW, cropH);

                        using var cropped = image.Clone(ctx => ctx.Crop(cropRect));

                        fileToProcess = Path.GetTempFileName();
                        await cropped.SaveAsPngAsync(fileToProcess);
                    }
                }

                using var img = Pix.LoadFromFile(fileToProcess);
                using var page = engine.Process(img);

                var result = new OcrResult();
                using var iter = page.GetIterator();
                iter.Begin();
                do
                {
                    if (iter.TryGetBoundingBox(PageIteratorLevel.Word, out var rect))
                    {
                        var rawWord = iter.GetText(PageIteratorLevel.Word) ?? string.Empty;
                        var confidence = iter.GetConfidence(PageIteratorLevel.Word);
                        var finalWord = (confidence < 90 && version != 1) ? CorrectWord(rawWord) : rawWord;

                        result.Boxes.Add(new OcrBox
                        {
                            Word = finalWord,
                            X = rect.X1 + offsetX,
                            Y = rect.Y1 + offsetY,
                            Width = rect.Width,
                            Height = rect.Height,
                            Confidence = confidence
                        });

                        result.Text += finalWord + " ";
                    }
                }
                while (iter.Next(PageIteratorLevel.Word));

                result.Text = result.Text.Trim();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("OCR Error: " + ex);
                throw;
            }
        }



        private string CorrectWord(string word)
        {
            if (string.IsNullOrWhiteSpace(word)) return word;

            var trimmed = word.Trim();
            var prefix = new string(trimmed.TakeWhile(char.IsPunctuation).ToArray());
            var suffix = new string(trimmed.Reverse().TakeWhile(char.IsPunctuation).Reverse().ToArray());
            var core = trimmed.Substring(prefix.Length, trimmed.Length - prefix.Length - suffix.Length);

            if (string.IsNullOrWhiteSpace(core)) return word;

            if (_hunspell.Check(core) || _hunspell.Check(core.ToLowerInvariant()))
                return word;

            var suggestions = _hunspell.Suggest(core).ToList();
            if (suggestions.Count > 0)
            {
                var suggestion = suggestions[0];
                if (char.IsUpper(core[0]))
                    suggestion = char.ToUpper(suggestion[0]) + suggestion.Substring(1);

                return prefix + suggestion + suffix;
            }

            return word;
        }
    }
}