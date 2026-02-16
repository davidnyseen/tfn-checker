using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class TfnValidationService : ITfnValidationService
{
    private static readonly int[] Weights = [ 1, 4, 3, 7, 5, 8, 6, 9, 10 ];
    private readonly AppDbContext _db;

    public TfnValidationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TfnValidationResponse> ValidateTfnAsync(string tfn)
    {
        var errors = new List<string>();
        var digitsOnly = new string(tfn.Where(char.IsDigit).ToArray());

        if (string.IsNullOrEmpty(digitsOnly))
        {
            errors.Add("TFN is required.");
        }
        else if (digitsOnly.Length != 9)
        {
            errors.Add("TFN must be exactly 9 digits.");
        }
        else if (!PassesChecksumValidation(digitsOnly))
        {
            errors.Add("TFN is not valid");
        }

        var isValid = errors.Count == 0;
        var now = DateTime.UtcNow;

        var record = new ValidationRecord
        {
            MaskedTfn = digitsOnly.Length >= 3
                ? new string('*', digitsOnly.Length - 3) + digitsOnly[^3..]
                : digitsOnly,
            IsValid = isValid,
            Errors = string.Join("; ", errors),
            ValidatedAt = now
        };
        _db.ValidationRecords.Add(record);
        await _db.SaveChangesAsync();

        return new TfnValidationResponse
        {
            Tfn = record.MaskedTfn,
            IsValid = isValid,
            Errors = errors,
            ValidatedAt = now
        };
    }

    public async Task<List<ValidationRecord>> GetHistoryAsync()
    {
        return await _db.ValidationRecords
            .OrderByDescending(r => r.ValidatedAt)
            .Take(100)
            .ToListAsync();
    }

    public async Task ClearHistoryAsync()
    {
        _db.ValidationRecords.RemoveRange(_db.ValidationRecords);
        await _db.SaveChangesAsync();
    }

    private static bool PassesChecksumValidation(string digits)
    {
        int sum = 0;
        for (int i = 0; i < 9; i++)
        {
            sum += (digits[i] - '0') * Weights[i];
        }
        return sum % 11 == 0;
    }
}
