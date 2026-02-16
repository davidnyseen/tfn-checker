using api.Models;

namespace api.Services
{
    public interface ITfnValidationService
    {
        Task<TfnValidationResponse> ValidateTfnAsync(string tfn); 
        Task<List<ValidationRecord>> GetHistoryAsync();
        Task ClearHistoryAsync();
    }
}