using api.Data;
using api.Services;
using Microsoft.EntityFrameworkCore;

namespace api.Tests;

public class TfnValidationServiceTests
{
    private static AppDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task ValidTfn_ReturnsValid()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("123456782");
        Assert.True(result.IsValid);
        Assert.Empty(result.Errors);
    }

    [Fact]
    public async Task ValidTfn_WithSpaces_ReturnsValid()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("123 456 782");
        Assert.True(result.IsValid);
    }

    [Fact]
    public async Task TfnFailingChecksum_ReturnsInvalid()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("123456789");
        Assert.False(result.IsValid);
        Assert.Contains("not valid", result.Errors[0]);
    }

    [Fact]
    public async Task TfnTooShort_ReturnsInvalid()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("12345678");
        Assert.False(result.IsValid);
        Assert.Contains("9 digits", result.Errors[0]);
    }

    [Fact]
    public async Task EmptyTfn_ReturnsInvalid()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("");
        Assert.False(result.IsValid);
        Assert.Contains("required", result.Errors[0]);
    }

    [Fact]
    public async Task ValidTfn_IsSavedToHistory()
    {
        var db = CreateDb();
        var service = new TfnValidationService(db);
        await service.ValidateTfnAsync("123456782");
        var history = await service.GetHistoryAsync();
        Assert.Single(history);
        Assert.True(history[0].IsValid);
    }

    [Fact]
    public async Task ValidTfn_MasksAllButLastThreeDigits()
    {
        var service = new TfnValidationService(CreateDb());
        var result = await service.ValidateTfnAsync("123456782");
        Assert.Equal("******782", result.Tfn);
    }

    [Fact]
    public async Task GetHistory_ReturnsNewestFirst()
    {
        var db = CreateDb();
        var service = new TfnValidationService(db);
        await service.ValidateTfnAsync("123456782");
        await service.ValidateTfnAsync("876543210");
        var history = await service.GetHistoryAsync();
        Assert.Equal("******210", history[0].MaskedTfn);
    }

    [Fact]
    public async Task ClearHistory_RemovesAllRecords()
    {
        var db = CreateDb();
        var service = new TfnValidationService(db);
        await service.ValidateTfnAsync("123456782");
        await service.ValidateTfnAsync("876543210");
        await service.ClearHistoryAsync();
        var history = await service.GetHistoryAsync();
        Assert.Empty(history);
    }
}
