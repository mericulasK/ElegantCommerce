namespace EliteShopAPI.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateCategoryDto
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
    }
}
