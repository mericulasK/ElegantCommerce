using System.ComponentModel.DataAnnotations;

namespace TrendifyAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Avatar { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "Customer"; // Admin, Seller, Customer

        public bool IsEmailVerified { get; set; } = false;

        // Seller specific fields
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public bool IsSellerApproved { get; set; } = false;
        public DateTime? SellerApprovedAt { get; set; }
        public int? ApprovedByAdminId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
        public virtual ICollection<Product> Products { get; set; } = new List<Product>(); // For sellers
        public virtual User? ApprovedByAdmin { get; set; } // Admin who approved seller
    }
}
