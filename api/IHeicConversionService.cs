namespace ImageEditWeb.Api;

public interface IHeicConversionService
{
    Task<HeicConversionResult> ConvertToJpegAsync(Stream input, CancellationToken cancellationToken);
}
