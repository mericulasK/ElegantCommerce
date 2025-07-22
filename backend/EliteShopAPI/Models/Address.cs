using System.ComponentModel.DataAnnotations;

namespace EliteShopAPI.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [StringLength(100)]
        public string Title { get; set; } = string.Empty; // Home, Office, etc.

        [Required]
        [StringLength(200)]
        public string Street { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Country { get; set; } = string.Empty;

        [StringLength(20)]
        public string Type { get; set; } = "Shipping"; // Shipping, Billing

        public bool IsDefault { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
