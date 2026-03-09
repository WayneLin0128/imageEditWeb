namespace ImageEditWeb.Api;

public sealed record HeicConversionResult(bool Succeeded, byte[]? ImageBytes, string? ErrorCode, string? ErrorMessage)
{
    public static HeicConversionResult Success(byte[] imageBytes) => new(true, imageBytes, null, null);

    public static HeicConversionResult Failure(string errorCode, string errorMessage) =>
        new(false, null, errorCode, errorMessage);
}
