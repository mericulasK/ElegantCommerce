using Microsoft.EntityFrameworkCore;
using TrendifyAPI.Data;
using TrendifyAPI.DTOs;
using TrendifyAPI.Models;

namespace TrendifyAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly TrendifyDbContext _context;

        public ProductService(TrendifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsByCategoryAsync(string categorySlug)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Category.Slug == categorySlug)
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Featured)
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        public async Task<IEnumerable<ProductDto>> GetSaleProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Sale)
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found");
            }

            return MapToProductDto(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                OriginalPrice = createProductDto.OriginalPrice,
                Image = createProductDto.Image,
                CategoryId = createProductDto.CategoryId,
                StockQuantity = createProductDto.StockQuantity,
                InStock = createProductDto.StockQuantity > 0,
                Brand = createProductDto.Brand,
                Color = createProductDto.Color,
                Size = createProductDto.Size,
                Material = createProductDto.Material,
                Weight = createProductDto.Weight,
                Dimensions = createProductDto.Dimensions,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return await GetProductByIdAsync(product.Id);
        }

        public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                throw new KeyNotFoundException("Product not found");
            }

            if (!string.IsNullOrEmpty(updateProductDto.Name))
                product.Name = updateProductDto.Name;

            if (!string.IsNullOrEmpty(updateProductDto.Description))
                product.Description = updateProductDto.Description;

            if (updateProductDto.Price.HasValue)
                product.Price = updateProductDto.Price.Value;

            if (updateProductDto.OriginalPrice.HasValue)
                product.OriginalPrice = updateProductDto.OriginalPrice;

            if (!string.IsNullOrEmpty(updateProductDto.Image))
                product.Image = updateProductDto.Image;

            if (updateProductDto.CategoryId.HasValue)
                product.CategoryId = updateProductDto.CategoryId.Value;

            if (updateProductDto.StockQuantity.HasValue)
            {
                product.StockQuantity = updateProductDto.StockQuantity.Value;
                product.InStock = updateProductDto.StockQuantity.Value > 0;
            }

            if (!string.IsNullOrEmpty(updateProductDto.Brand))
                product.Brand = updateProductDto.Brand;

            if (!string.IsNullOrEmpty(updateProductDto.Color))
                product.Color = updateProductDto.Color;

            if (!string.IsNullOrEmpty(updateProductDto.Size))
                product.Size = updateProductDto.Size;

            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GetProductByIdAsync(id);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string searchTerm)
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.Name.Contains(searchTerm) || 
                           p.Description.Contains(searchTerm) ||
                           p.Category.Name.Contains(searchTerm))
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        public async Task<IEnumerable<ProductDto>> GetProductsWithFiltersAsync(
            string? category = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            decimal? minRating = null,
            bool? inStock = null,
            bool? onSale = null,
            string? sortBy = null,
            int page = 1,
            int pageSize = 12)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category.Slug == category);

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (minRating.HasValue)
                query = query.Where(p => p.Rating >= minRating.Value);

            if (inStock.HasValue)
                query = query.Where(p => p.InStock == inStock.Value);

            if (onSale.HasValue)
                query = query.Where(p => p.Sale == onSale.Value);

            // Apply sorting
            query = sortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "rating" => query.OrderByDescending(p => p.Rating),
                "newest" => query.OrderByDescending(p => p.CreatedAt),
                "name" => query.OrderBy(p => p.Name),
                _ => query.OrderByDescending(p => p.Featured).ThenByDescending(p => p.CreatedAt)
            };

            // Apply pagination
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return products.Select(MapToProductDto);
        }

        private ProductDto MapToProductDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                OriginalPrice = product.OriginalPrice,
                Image = product.Image,
                Images = product.ProductImages.OrderBy(pi => pi.SortOrder).Select(pi => pi.ImageUrl).ToList(),
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                Rating = product.Rating,
                ReviewCount = product.ReviewCount,
                StockQuantity = product.StockQuantity,
                InStock = product.InStock,
                Featured = product.Featured,
                Sale = product.Sale,
                Discount = product.Discount,
                Brand = product.Brand,
                Color = product.Color,
                Size = product.Size,
                CreatedAt = product.CreatedAt
            };
        }
    }
}
