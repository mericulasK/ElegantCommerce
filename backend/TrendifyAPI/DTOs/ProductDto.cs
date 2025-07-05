namespace TrendifyAPI.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new List<string>();
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int ReviewCount { get; set; }
        public int StockQuantity { get; set; }
        public bool InStock { get; set; }
        public bool Featured { get; set; }
        public bool Sale { get; set; }
        public int? Discount { get; set; }
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int StockQuantity { get; set; }
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; }
        public string? Material { get; set; }
        public decimal? Weight { get; set; }
        public string? Dimensions { get; set; }
    }

    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string? Image { get; set; }
        public int? CategoryId { get; set; }
        public int? StockQuantity { get; set; }
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; }
    }
}
