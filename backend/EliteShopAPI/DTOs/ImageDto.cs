namespace EliteShopAPI.DTOs
{
    public class ImageUploadResultDto
    {
        public bool Success { get; set; }
        public string? ImageUrl { get; set; }
        public string? FileName { get; set; }
        public string? ErrorMessage { get; set; }
        public long FileSize { get; set; }
        public string? ContentType { get; set; }
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddProductImageDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
        public bool IsPrimary { get; set; } = false;
    }

    public class UpdateProductImageDto
    {
        public string? AltText { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsPrimary { get; set; }
    }

    public class ImageReorderDto
    {
        public List<int> ImageIds { get; set; } = new List<int>();
    }

    public class MultipleImageUploadDto
    {
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public string Folder { get; set; } = "products";
    }
}
