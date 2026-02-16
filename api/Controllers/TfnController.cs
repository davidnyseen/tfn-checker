using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TfnController : ControllerBase
    {
        private readonly ITfnValidationService _validationService;

        public TfnController(ITfnValidationService validationService)
        {
            _validationService = validationService;
        }

        [HttpPost("validate")]
        public async Task<ActionResult<TfnValidationResponse>> Validate(
            [FromBody] TfnValidationRequest request)
        {
            var result = await _validationService.ValidateTfnAsync(request.Tfn);
            return Ok(result);
        }

        [HttpGet("history")]
        public async Task<ActionResult<List<ValidationRecord>>> GetHistory()
        {
            var history = await _validationService.GetHistoryAsync();
            return Ok(history);
        }

        [HttpDelete("history")]
        public async Task<IActionResult> ClearHistory()
        {
            await _validationService.ClearHistoryAsync();
            return NoContent();
        }
    }
}
