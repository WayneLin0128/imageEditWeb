namespace ImageEditWeb.Api;

public sealed class HeicConversionOptions
{
    public const string SectionName = "HeicConversion";

    public long MaxFileSizeBytes { get; set; } = 20 * 1024 * 1024;

    public int JpegQuality { get; set; } = 90;
}
