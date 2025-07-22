using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EliteShopAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? OriginalPrice { get; set; }

        [Required]
        [StringLength(500)]
        public string Image { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        // Seller relationship
        public int? SellerId { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0;

        public int ReviewCount { get; set; } = 0;

        public int StockQuantity { get; set; } = 0;

        public bool InStock { get; set; } = true;

        public bool Featured { get; set; } = false;

        public bool Sale { get; set; } = false;

        public int? Discount { get; set; }

        // Product specifications
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; }
        public string? Material { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual User? Seller { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
