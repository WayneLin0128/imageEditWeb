using System.Net;
using System.Net.Http.Headers;
using ImageEditWeb.Api;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace ImageEditWeb.Api.Tests;

public sealed class HeicApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public HeicApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ConvertHeic_ReturnsJpeg_WhenConversionSucceeds()
    {
        using var client = _factory.WithConverter(_ => HeicConversionResult.Success(new byte[] { 1, 2, 3 })).CreateClient();
        using var form = CreateForm("sample.heic", "image/heic", new byte[] { 9, 8, 7 });

        using var response = await client.PostAsync("/api/images/convert-heic", form);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("image/jpeg", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal(new byte[] { 1, 2, 3 }, await response.Content.ReadAsByteArrayAsync());
    }

    [Fact]
    public async Task ConvertHeic_ReturnsUnsupportedMediaType_ForNonHeicFiles()
    {
        using var client = _factory.CreateClient();
        using var form = CreateForm("sample.png", "image/png", new byte[] { 1, 2, 3 });

        using var response = await client.PostAsync("/api/images/convert-heic", form);

        Assert.Equal(HttpStatusCode.UnsupportedMediaType, response.StatusCode);
    }

    [Fact]
    public async Task ConvertHeic_ReturnsBadRequest_WhenFileIsMissing()
    {
        using var client = _factory.CreateClient();
        using var form = new MultipartFormDataContent();

        using var response = await client.PostAsync("/api/images/convert-heic", form);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ConvertHeic_ReturnsPayloadTooLarge_WhenFileExceedsLimit()
    {
        using var client = _factory.CreateClient();
        using var form = CreateForm("sample.heic", "image/heic", new byte[21 * 1024 * 1024]);

        using var response = await client.PostAsync("/api/images/convert-heic", form);

        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, response.StatusCode);
    }

    private static MultipartFormDataContent CreateForm(string fileName, string contentType, byte[] bytes)
    {
        var fileContent = new ByteArrayContent(bytes);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(contentType);

        var form = new MultipartFormDataContent();
        form.Add(fileContent, "file", fileName);
        return form;
    }
}

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private Func<Stream, HeicConversionResult> _handler = _ => HeicConversionResult.Failure("not_configured", "No fake converter configured.");

    public CustomWebApplicationFactory WithConverter(Func<Stream, HeicConversionResult> handler)
    {
        _handler = handler;
        return this;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IHeicConversionService>();
            services.AddSingleton<IHeicConversionService>(new FakeHeicConversionService(_handler));
        });
    }
}

public sealed class FakeHeicConversionService : IHeicConversionService
{
    private readonly Func<Stream, HeicConversionResult> _handler;

    public FakeHeicConversionService(Func<Stream, HeicConversionResult> handler)
    {
        _handler = handler;
    }

    public Task<HeicConversionResult> ConvertToJpegAsync(Stream input, CancellationToken cancellationToken)
    {
        return Task.FromResult(_handler(input));
    }
}

