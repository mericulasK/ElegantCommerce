using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteShopAPI.Models
{
    public class ReturnRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "pending"; // pending, approved, rejected, processed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ProcessedAt { get; set; }

        public int? ProcessedByUserId { get; set; }

        [StringLength(1000)]
        public string? AdminNotes { get; set; }

        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual User? ProcessedByUser { get; set; }
        public virtual ICollection<ReturnRequestItem> ReturnRequestItems { get; set; } = new List<ReturnRequestItem>();
    }

    public class ReturnRequestItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ReturnRequestId { get; set; }

        [Required]
        public int OrderItemId { get; set; }

        [Required]
        public int Quantity { get; set; }

        // Navigation properties
        public virtual ReturnRequest ReturnRequest { get; set; } = null!;
        public virtual OrderItem OrderItem { get; set; } = null!;
    }
}
