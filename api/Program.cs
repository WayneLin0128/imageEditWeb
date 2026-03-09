using ImageEditWeb.Api;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddProblemDetails();
builder.Services.Configure<HeicConversionOptions>(
    builder.Configuration.GetSection(HeicConversionOptions.SectionName));
builder.Services.Configure<FormOptions>(options =>
{
    var heicOptions = builder.Configuration.GetSection(HeicConversionOptions.SectionName)
        .Get<HeicConversionOptions>() ?? new HeicConversionOptions();

    options.MultipartBodyLengthLimit = heicOptions.MaxFileSizeBytes + (1024 * 1024);
});
builder.Services.AddSingleton<IHeicConversionService, MagickHeicConversionService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
if (allowedOrigins.Length > 0)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
    });
}

var app = builder.Build();

app.UseExceptionHandler();

if (allowedOrigins.Length > 0)
{
    app.UseCors("Frontend");
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost("/api/images/convert-heic", async Task<IResult> (
    IFormFile? file,
    IHeicConversionService converter,
    IOptions<HeicConversionOptions> options,
    CancellationToken cancellationToken) =>
{
    if (file is null)
    {
        return Results.Problem(
            title: "Missing file",
            detail: "Form field 'file' is required.",
            statusCode: StatusCodes.Status400BadRequest);
    }

    if (file.Length == 0)
    {
        return Results.Problem(
            title: "Empty file",
            detail: "The uploaded file is empty.",
            statusCode: StatusCodes.Status400BadRequest);
    }

    if (file.Length > options.Value.MaxFileSizeBytes)
    {
        return Results.Problem(
            title: "File too large",
            detail: $"The uploaded file exceeds the {options.Value.MaxFileSizeBytes} byte limit.",
            statusCode: StatusCodes.Status413PayloadTooLarge);
    }

    if (!HeicFileInspector.LooksLikeHeic(file))
    {
        return Results.Problem(
            title: "Unsupported file type",
            detail: "Only HEIC or HEIF images are accepted by this endpoint.",
            statusCode: StatusCodes.Status415UnsupportedMediaType);
    }

    await using var stream = file.OpenReadStream();
    var result = await converter.ConvertToJpegAsync(stream, cancellationToken);

    if (!result.Succeeded || result.ImageBytes is null)
    {
        var statusCode = result.ErrorCode switch
        {
            "invalid_heic" => StatusCodes.Status422UnprocessableEntity,
            "decoder_unavailable" => StatusCodes.Status503ServiceUnavailable,
            _ => StatusCodes.Status500InternalServerError
        };

        return Results.Problem(
            title: "HEIC conversion failed",
            detail: result.ErrorMessage ?? "The HEIC image could not be converted.",
            statusCode: statusCode,
            extensions: new Dictionary<string, object?> { ["code"] = result.ErrorCode });
    }

    return Results.File(result.ImageBytes, "image/jpeg", "converted.jpg");
});

app.Run();

public partial class Program
{
}


