using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendifyAPI.DTOs;
using TrendifyAPI.Services;

namespace TrendifyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult<ImageUploadResultDto>> UploadImage([FromForm] IFormFile file, [FromForm] string folder = "products")
        {
            if (file == null)
            {
                return BadRequest(new ImageUploadResultDto
                {
                    Success = false,
                    ErrorMessage = "No file provided"
                });
            }

            var result = await _imageService.UploadImageAsync(file, folder);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }

        [HttpPost("upload-multiple")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult<List<ImageUploadResultDto>>> UploadMultipleImages([FromForm] IFormFileCollection files, [FromForm] string folder = "products")
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files provided");
            }

            var results = await _imageService.UploadMultipleImagesAsync(files, folder);
            return Ok(results);
        }

        [HttpDelete("{imageUrl}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult> DeleteImage(string imageUrl)
        {
            var result = await _imageService.DeleteImageAsync(Uri.UnescapeDataString(imageUrl));
            
            if (result)
            {
                return Ok(new { message = "Image deleted successfully" });
            }
            
            return NotFound(new { message = "Image not found" });
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<List<ProductImageDto>>> GetProductImages(int productId)
        {
            var images = await _imageService.GetProductImagesAsync(productId);
            return Ok(images);
        }

        [HttpPost("product/{productId}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult<ProductImageDto>> AddProductImage(int productId, [FromBody] AddProductImageDto addDto)
        {
            try
            {
                var result = await _imageService.AddProductImageAsync(
                    productId, 
                    addDto.ImageUrl, 
                    addDto.AltText, 
                    addDto.SortOrder, 
                    addDto.IsPrimary
                );
                
                return CreatedAtAction(nameof(GetProductImages), new { productId }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("product-image/{imageId}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult<ProductImageDto>> UpdateProductImage(int imageId, [FromBody] UpdateProductImageDto updateDto)
        {
            try
            {
                var result = await _imageService.UpdateProductImageAsync(imageId, updateDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("product-image/{imageId}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult> DeleteProductImage(int imageId)
        {
            var result = await _imageService.DeleteProductImageAsync(imageId);
            
            if (result)
            {
                return Ok(new { message = "Product image deleted successfully" });
            }
            
            return NotFound(new { message = "Product image not found" });
        }

        [HttpPut("product/{productId}/primary/{imageId}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult> SetPrimaryImage(int productId, int imageId)
        {
            var result = await _imageService.SetPrimaryImageAsync(productId, imageId);
            
            if (result)
            {
                return Ok(new { message = "Primary image set successfully" });
            }
            
            return NotFound(new { message = "Image not found" });
        }

        [HttpPut("product/{productId}/reorder")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult> ReorderProductImages(int productId, [FromBody] ImageReorderDto reorderDto)
        {
            var result = await _imageService.ReorderProductImagesAsync(productId, reorderDto.ImageIds);
            
            if (result)
            {
                return Ok(new { message = "Images reordered successfully" });
            }
            
            return BadRequest(new { message = "Failed to reorder images" });
        }

        [HttpPost("product/{productId}/upload-and-add")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<ActionResult<ProductImageDto>> UploadAndAddProductImage(
            int productId, 
            [FromForm] IFormFile file, 
            [FromForm] string altText = "", 
            [FromForm] int sortOrder = 0, 
            [FromForm] bool isPrimary = false)
        {
            if (file == null)
            {
                return BadRequest(new { message = "No file provided" });
            }

            // Upload the image first
            var uploadResult = await _imageService.UploadImageAsync(file, "products");
            
            if (!uploadResult.Success)
            {
                return BadRequest(uploadResult);
            }

            try
            {
                // Add the image to the product
                var productImage = await _imageService.AddProductImageAsync(
                    productId, 
                    uploadResult.ImageUrl!, 
                    altText, 
                    sortOrder, 
                    isPrimary
                );

                return CreatedAtAction(nameof(GetProductImages), new { productId }, productImage);
            }
            catch (Exception ex)
            {
                // If adding to product fails, clean up the uploaded file
                await _imageService.DeleteImageAsync(uploadResult.ImageUrl!);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
