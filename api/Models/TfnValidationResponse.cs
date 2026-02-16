namespace api.Models;

public class TfnValidationResponse
{
    public bool IsValid { get; set; }
    public string Tfn { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();
    public DateTime ValidatedAt { get; set; } 
}