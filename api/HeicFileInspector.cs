namespace ImageEditWeb.Api;

public static class HeicFileInspector
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".heic",
        ".heif"
    };

    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/heic",
        "image/heic-sequence",
        "image/heif",
        "image/heif-sequence",
        "application/octet-stream"
    };

    public static bool LooksLikeHeic(IFormFile file)
    {
        var extension = Path.GetExtension(file.FileName);
        return AllowedExtensions.Contains(extension) || AllowedMimeTypes.Contains(file.ContentType);
    }
}
