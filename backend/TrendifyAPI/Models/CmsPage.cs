using System.ComponentModel.DataAnnotations;

namespace TrendifyAPI.Models
{
    public class CmsPage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Slug { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        [StringLength(200)]
        public string? MetaKeywords { get; set; }

        public bool IsPublished { get; set; } = false;

        public int? CreatedByAdminId { get; set; }

        public int? UpdatedByAdminId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User? CreatedByAdmin { get; set; }
        public virtual User? UpdatedByAdmin { get; set; }
    }
}
