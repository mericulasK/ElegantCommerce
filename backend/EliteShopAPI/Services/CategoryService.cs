using Microsoft.EntityFrameworkCore;
using EliteShopAPI.Data;
using EliteShopAPI.DTOs;
using EliteShopAPI.Models;

namespace EliteShopAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly EliteShopDbContext _context;

        public CategoryService(EliteShopDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            return categories.Select(MapToCategoryDto);
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException("Category not found");
            }

            return MapToCategoryDto(category);
        }

        public async Task<CategoryDto> GetCategoryBySlugAsync(string slug)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (category == null)
            {
                throw new KeyNotFoundException("Category not found");
            }

            return MapToCategoryDto(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto)
        {
            // Check if slug already exists
            if (await _context.Categories.AnyAsync(c => c.Slug == createCategoryDto.Slug))
            {
                throw new InvalidOperationException("Category with this slug already exists");
            }

            var category = new Category
            {
                Name = createCategoryDto.Name,
                Slug = createCategoryDto.Slug,
                Image = createCategoryDto.Image,
                Description = createCategoryDto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return MapToCategoryDto(category);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException("Category not found");
            }

            if (!string.IsNullOrEmpty(updateCategoryDto.Name))
                category.Name = updateCategoryDto.Name;

            if (!string.IsNullOrEmpty(updateCategoryDto.Slug))
            {
                // Check if new slug already exists (excluding current category)
                if (await _context.Categories.AnyAsync(c => c.Slug == updateCategoryDto.Slug && c.Id != id))
                {
                    throw new InvalidOperationException("Category with this slug already exists");
                }
                category.Slug = updateCategoryDto.Slug;
            }

            if (!string.IsNullOrEmpty(updateCategoryDto.Image))
                category.Image = updateCategoryDto.Image;

            if (!string.IsNullOrEmpty(updateCategoryDto.Description))
                category.Description = updateCategoryDto.Description;

            category.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToCategoryDto(category);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return false;
            }

            // Check if category has products
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                throw new InvalidOperationException("Cannot delete category that contains products");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        private CategoryDto MapToCategoryDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Image = category.Image,
                Description = category.Description
            };
        }
    }
}
