using ImageMagick;
using Microsoft.Extensions.Options;

namespace ImageEditWeb.Api;

public sealed class MagickHeicConversionService : IHeicConversionService
{
    private readonly HeicConversionOptions _options;

    public MagickHeicConversionService(IOptions<HeicConversionOptions> options)
    {
        _options = options.Value;
    }

    public async Task<HeicConversionResult> ConvertToJpegAsync(Stream input, CancellationToken cancellationToken)
    {
        try
        {
            await using var copy = new MemoryStream();
            await input.CopyToAsync(copy, cancellationToken);
            copy.Position = 0;

            using var image = new MagickImage(copy);
            image.AutoOrient();
            image.Format = MagickFormat.Jpeg;
            image.Quality = _options.JpegQuality;

            return HeicConversionResult.Success(image.ToByteArray(MagickFormat.Jpeg));
        }
        catch (MagickMissingDelegateErrorException)
        {
            return HeicConversionResult.Failure(
                "decoder_unavailable",
                "HEIC decoding is not available on this server.");
        }
        catch (MagickCorruptImageErrorException)
        {
            return HeicConversionResult.Failure(
                "invalid_heic",
                "The uploaded file could not be decoded as a valid HEIC image.");
        }
        catch (MagickBlobErrorException)
        {
            return HeicConversionResult.Failure(
                "invalid_heic",
                "The uploaded file could not be decoded as a valid HEIC image.");
        }
    }
}
