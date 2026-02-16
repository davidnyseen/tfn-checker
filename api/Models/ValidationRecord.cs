namespace api.Models
{
    public class ValidationRecord
    {
        public int Id { get; set; }
        public string MaskedTfn { get; set; } = string.Empty;
        public bool IsValid { get; set; }
        public string Errors { get; set; } = string.Empty;
        public DateTime ValidatedAt { get; set; }
        
    }
}