using TrendifyAPI.DTOs;

namespace TrendifyAPI.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string categorySlug);
        Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync();
        Task<IEnumerable<ProductDto>> GetSaleProductsAsync();
        Task<ProductDto> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
        Task<bool> DeleteProductAsync(int id);
        Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm);
        Task<IEnumerable<ProductDto>> GetProductsWithFiltersAsync(
            string? category = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            decimal? minRating = null,
            bool? inStock = null,
            bool? onSale = null,
            string? sortBy = null,
            int page = 1,
            int pageSize = 12);
    }
}
