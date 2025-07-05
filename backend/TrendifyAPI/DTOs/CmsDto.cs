namespace TrendifyAPI.DTOs
{
    public class CmsPageDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public bool IsPublished { get; set; }
        public int? CreatedByAdminId { get; set; }
        public string? CreatedByAdminName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCmsPageDto
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public bool IsPublished { get; set; } = false;
    }

    public class UpdateCmsPageDto
    {
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? Content { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public bool? IsPublished { get; set; }
    }
}
