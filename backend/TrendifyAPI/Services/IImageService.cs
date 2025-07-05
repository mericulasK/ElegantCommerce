using TrendifyAPI.DTOs;

namespace TrendifyAPI.Services
{
    public interface IImageService
    {
        Task<ImageUploadResultDto> UploadImageAsync(IFormFile file, string folder = "products");
        Task<List<ImageUploadResultDto>> UploadMultipleImagesAsync(IFormFileCollection files, string folder = "products");
        Task<bool> DeleteImageAsync(string imageUrl);
        Task<List<ProductImageDto>> GetProductImagesAsync(int productId);
        Task<ProductImageDto> AddProductImageAsync(int productId, string imageUrl, string altText = "", int sortOrder = 0, bool isPrimary = false);
        Task<ProductImageDto> UpdateProductImageAsync(int imageId, UpdateProductImageDto updateDto);
        Task<bool> DeleteProductImageAsync(int imageId);
        Task<bool> SetPrimaryImageAsync(int productId, int imageId);
        Task<bool> ReorderProductImagesAsync(int productId, List<int> imageIds);
        string GetImageUrl(string fileName, string folder = "products");
        bool IsValidImageFile(IFormFile file);
    }
}
