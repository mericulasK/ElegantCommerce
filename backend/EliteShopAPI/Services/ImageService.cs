using Microsoft.EntityFrameworkCore;
using EliteShopAPI.Data;
using EliteShopAPI.DTOs;
using EliteShopAPI.Models;

namespace EliteShopAPI.Services
{
    public class ImageService : IImageService
    {
        private readonly EliteShopDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public ImageService(EliteShopDbContext context, IWebHostEnvironment environment, IConfiguration configuration)
        {
            _context = context;
            _environment = environment;
            _configuration = configuration;
        }

        public async Task<ImageUploadResultDto> UploadImageAsync(IFormFile file, string folder = "products")
        {
            try
            {
                if (!IsValidImageFile(file))
                {
                    return new ImageUploadResultDto
                    {
                        Success = false,
                        ErrorMessage = "Invalid image file. Allowed formats: JPG, JPEG, PNG, GIF, WEBP. Max size: 5MB."
                    };
                }

                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", folder);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = GenerateUniqueFileName(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var imageUrl = GetImageUrl(fileName, folder);

                return new ImageUploadResultDto
                {
                    Success = true,
                    ImageUrl = imageUrl,
                    FileName = fileName,
                    FileSize = file.Length,
                    ContentType = file.ContentType
                };
            }
            catch (Exception ex)
            {
                return new ImageUploadResultDto
                {
                    Success = false,
                    ErrorMessage = $"Upload failed: {ex.Message}"
                };
            }
        }

        public async Task<List<ImageUploadResultDto>> UploadMultipleImagesAsync(IFormFileCollection files, string folder = "products")
        {
            var results = new List<ImageUploadResultDto>();

            foreach (var file in files)
            {
                var result = await UploadImageAsync(file, folder);
                results.Add(result);
            }

            return results;
        }

        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return false;

                // Extract file path from URL
                var uri = new Uri(imageUrl, UriKind.RelativeOrAbsolute);
                var relativePath = uri.IsAbsoluteUri ? uri.AbsolutePath : imageUrl;
                
                if (relativePath.StartsWith("/"))
                    relativePath = relativePath.Substring(1);

                var filePath = Path.Combine(_environment.WebRootPath, relativePath);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<ProductImageDto>> GetProductImagesAsync(int productId)
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderBy(pi => pi.SortOrder)
                .ThenBy(pi => pi.CreatedAt)
                .Select(pi => new ProductImageDto
                {
                    Id = pi.Id,
                    ProductId = pi.ProductId,
                    ImageUrl = pi.ImageUrl,
                    AltText = pi.AltText,
                    SortOrder = pi.SortOrder,
                    IsPrimary = pi.IsPrimary,
                    CreatedAt = pi.CreatedAt
                })
                .ToListAsync();

            return images;
        }

        public async Task<ProductImageDto> AddProductImageAsync(int productId, string imageUrl, string altText = "", int sortOrder = 0, bool isPrimary = false)
        {
            // If this is set as primary, unset other primary images
            if (isPrimary)
            {
                await UnsetPrimaryImagesAsync(productId);
            }

            var productImage = new ProductImage
            {
                ProductId = productId,
                ImageUrl = imageUrl,
                AltText = altText,
                SortOrder = sortOrder,
                IsPrimary = isPrimary,
                CreatedAt = DateTime.UtcNow
            };

            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();

            return new ProductImageDto
            {
                Id = productImage.Id,
                ProductId = productImage.ProductId,
                ImageUrl = productImage.ImageUrl,
                AltText = productImage.AltText,
                SortOrder = productImage.SortOrder,
                IsPrimary = productImage.IsPrimary,
                CreatedAt = productImage.CreatedAt
            };
        }

        public async Task<ProductImageDto> UpdateProductImageAsync(int imageId, UpdateProductImageDto updateDto)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
                throw new ArgumentException("Image not found");

            if (!string.IsNullOrEmpty(updateDto.AltText))
                image.AltText = updateDto.AltText;

            if (updateDto.SortOrder.HasValue)
                image.SortOrder = updateDto.SortOrder.Value;

            if (updateDto.IsPrimary.HasValue)
            {
                if (updateDto.IsPrimary.Value)
                {
                    await UnsetPrimaryImagesAsync(image.ProductId);
                }
                image.IsPrimary = updateDto.IsPrimary.Value;
            }

            await _context.SaveChangesAsync();

            return new ProductImageDto
            {
                Id = image.Id,
                ProductId = image.ProductId,
                ImageUrl = image.ImageUrl,
                AltText = image.AltText,
                SortOrder = image.SortOrder,
                IsPrimary = image.IsPrimary,
                CreatedAt = image.CreatedAt
            };
        }

        public async Task<bool> DeleteProductImageAsync(int imageId)
        {
            var image = await _context.ProductImages.FindAsync(imageId);
            if (image == null)
                return false;

            // Delete physical file
            await DeleteImageAsync(image.ImageUrl);

            // Remove from database
            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SetPrimaryImageAsync(int productId, int imageId)
        {
            var image = await _context.ProductImages
                .FirstOrDefaultAsync(pi => pi.Id == imageId && pi.ProductId == productId);

            if (image == null)
                return false;

            // Unset other primary images
            await UnsetPrimaryImagesAsync(productId);

            // Set this image as primary
            image.IsPrimary = true;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ReorderProductImagesAsync(int productId, List<int> imageIds)
        {
            var images = await _context.ProductImages
                .Where(pi => pi.ProductId == productId && imageIds.Contains(pi.Id))
                .ToListAsync();

            for (int i = 0; i < imageIds.Count; i++)
            {
                var image = images.FirstOrDefault(img => img.Id == imageIds[i]);
                if (image != null)
                {
                    image.SortOrder = i;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public string GetImageUrl(string fileName, string folder = "products")
        {
            return $"/uploads/{folder}/{fileName}";
        }

        public bool IsValidImageFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return false;

            if (file.Length > _maxFileSize)
                return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                return false;

            if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
                return false;

            return true;
        }

        private async Task UnsetPrimaryImagesAsync(int productId)
        {
            var primaryImages = await _context.ProductImages
                .Where(pi => pi.ProductId == productId && pi.IsPrimary)
                .ToListAsync();

            foreach (var image in primaryImages)
            {
                image.IsPrimary = false;
            }

            if (primaryImages.Any())
            {
                await _context.SaveChangesAsync();
            }
        }

        private string GenerateUniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            var fileName = Path.GetFileNameWithoutExtension(originalFileName);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var guid = Guid.NewGuid().ToString("N")[..8];
            
            return $"{fileName}_{timestamp}_{guid}{extension}";
        }
    }
}
