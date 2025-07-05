using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrendifyAPI.Data;
using TrendifyAPI.DTOs;
using TrendifyAPI.Models;

namespace TrendifyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Seller")]
    public class SellerController : ControllerBase
    {
        private readonly TrendifyDbContext _context;

        public SellerController(TrendifyDbContext context)
        {
            _context = context;
        }

        // Check if seller is approved
        private async Task<bool> IsSellerApproved()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var user = await _context.Users.FindAsync(userId);
            return user?.IsSellerApproved ?? false;
        }

        // Product Management
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.SellerId == sellerId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    OriginalPrice = p.OriginalPrice,
                    Image = p.Image,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    Rating = p.Rating,
                    ReviewCount = p.ReviewCount,
                    StockQuantity = p.StockQuantity,
                    InStock = p.InStock,
                    Featured = p.Featured,
                    Sale = p.Sale,
                    Discount = p.Discount,
                    Brand = p.Brand,
                    Color = p.Color,
                    Size = p.Size,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                OriginalPrice = createProductDto.OriginalPrice,
                Image = createProductDto.Image,
                CategoryId = createProductDto.CategoryId,
                SellerId = sellerId,
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

            return CreatedAtAction(nameof(GetMyProducts), new { id = product.Id }, MapToProductDto(product));
        }

        [HttpPut("products/{id}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId);
            
            if (product == null)
                return NotFound();

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

            return Ok(MapToProductDto(product));
        }

        [HttpDelete("products/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId);
            
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Order Management
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .Where(o => o.OrderItems.Any(oi => oi.Product.SellerId == sellerId))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                UserId = o.UserId,
                CustomerName = $"{o.User.FirstName} {o.User.LastName}",
                Status = o.Status,
                PaymentStatus = o.PaymentStatus,
                Subtotal = o.Subtotal,
                ShippingCost = o.ShippingCost,
                Tax = o.Tax,
                Total = o.Total,
                CreatedAt = o.CreatedAt,
                OrderItems = o.OrderItems.Where(oi => oi.Product.SellerId == sellerId).Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            }).ToList();

            return Ok(orderDtos);
        }

        // Sales Reporting
        [HttpGet("sales-report")]
        public async Task<ActionResult> GetSalesReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var query = _context.OrderItems
                .Include(oi => oi.Product)
                .Include(oi => oi.Order)
                .Where(oi => oi.Product.SellerId == sellerId);

            if (startDate.HasValue)
                query = query.Where(oi => oi.Order.CreatedAt >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(oi => oi.Order.CreatedAt <= endDate.Value);

            var salesData = await query
                .GroupBy(oi => oi.Order.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalSales = g.Sum(oi => oi.TotalPrice),
                    OrderCount = g.Count(),
                    ProductsSold = g.Sum(oi => oi.Quantity)
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            var totalRevenue = salesData.Sum(s => s.TotalSales);
            var totalOrders = salesData.Sum(s => s.OrderCount);
            var totalProductsSold = salesData.Sum(s => s.ProductsSold);

            return Ok(new
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                TotalProductsSold = totalProductsSold,
                DailySales = salesData
            });
        }

        // Promotion Management
        [HttpGet("promotions")]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetMyPromotions()
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var promotions = await _context.Promotions
                .Where(p => p.SellerId == sellerId)
                .Select(p => new PromotionDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Type = p.Type,
                    DiscountValue = p.DiscountValue,
                    MinimumOrderAmount = p.MinimumOrderAmount,
                    CouponCode = p.CouponCode,
                    MaxUsageCount = p.MaxUsageCount,
                    UsageCount = p.UsageCount,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    IsActive = p.IsActive,
                    SellerId = p.SellerId,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(promotions);
        }

        [HttpPost("promotions")]
        public async Task<ActionResult<PromotionDto>> CreatePromotion([FromBody] CreatePromotionDto createDto)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            // Validate promotion dates
            if (createDto.StartDate >= createDto.EndDate)
            {
                return BadRequest("Start date must be before end date");
            }

            // Check if coupon code already exists
            if (!string.IsNullOrEmpty(createDto.CouponCode))
            {
                if (await _context.Promotions.AnyAsync(p => p.CouponCode == createDto.CouponCode))
                {
                    return BadRequest("Coupon code already exists");
                }
            }

            var promotion = new Promotion
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Type = createDto.Type,
                DiscountValue = createDto.DiscountValue,
                MinimumOrderAmount = createDto.MinimumOrderAmount,
                CouponCode = createDto.CouponCode,
                MaxUsageCount = createDto.MaxUsageCount,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                IsActive = createDto.IsActive,
                SellerId = sellerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyPromotions), new { id = promotion.Id }, MapToPromotionDto(promotion));
        }

        [HttpPut("promotions/{id}")]
        public async Task<ActionResult<PromotionDto>> UpdatePromotion(int id, [FromBody] UpdatePromotionDto updateDto)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var promotion = await _context.Promotions.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId);

            if (promotion == null)
                return NotFound();

            if (!string.IsNullOrEmpty(updateDto.Name))
                promotion.Name = updateDto.Name;

            if (!string.IsNullOrEmpty(updateDto.Description))
                promotion.Description = updateDto.Description;

            if (!string.IsNullOrEmpty(updateDto.Type))
                promotion.Type = updateDto.Type;

            if (updateDto.DiscountValue.HasValue)
                promotion.DiscountValue = updateDto.DiscountValue;

            if (updateDto.MinimumOrderAmount.HasValue)
                promotion.MinimumOrderAmount = updateDto.MinimumOrderAmount;

            if (updateDto.CouponCode != null)
            {
                // Check if new coupon code already exists
                if (!string.IsNullOrEmpty(updateDto.CouponCode) && updateDto.CouponCode != promotion.CouponCode)
                {
                    if (await _context.Promotions.AnyAsync(p => p.CouponCode == updateDto.CouponCode))
                    {
                        return BadRequest("Coupon code already exists");
                    }
                }
                promotion.CouponCode = updateDto.CouponCode;
            }

            if (updateDto.MaxUsageCount.HasValue)
                promotion.MaxUsageCount = updateDto.MaxUsageCount;

            if (updateDto.StartDate.HasValue)
                promotion.StartDate = updateDto.StartDate.Value;

            if (updateDto.EndDate.HasValue)
                promotion.EndDate = updateDto.EndDate.Value;

            if (updateDto.IsActive.HasValue)
                promotion.IsActive = updateDto.IsActive.Value;

            // Validate dates
            if (promotion.StartDate >= promotion.EndDate)
            {
                return BadRequest("Start date must be before end date");
            }

            promotion.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(MapToPromotionDto(promotion));
        }

        [HttpDelete("promotions/{id}")]
        public async Task<ActionResult> DeletePromotion(int id)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var promotion = await _context.Promotions.FirstOrDefaultAsync(p => p.Id == id && p.SellerId == sellerId);

            if (promotion == null)
                return NotFound();

            _context.Promotions.Remove(promotion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Review Management
        [HttpGet("reviews")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetMyProductReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .Where(r => r.Product.SellerId == sellerId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = r.Product.Name,
                    UserId = r.UserId,
                    UserName = $"{r.User.FirstName} {r.User.LastName}",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpGet("reviews/{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetProductReviews(int productId)
        {
            if (!await IsSellerApproved())
                return Forbid("Seller account is not approved yet");

            var sellerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            // Verify the product belongs to this seller
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId && p.SellerId == sellerId);
            if (product == null)
                return NotFound("Product not found or doesn't belong to you");

            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    ProductName = product.Name,
                    UserId = r.UserId,
                    UserName = $"{r.User.FirstName} {r.User.LastName}",
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            return Ok(reviews);
        }

        private PromotionDto MapToPromotionDto(Promotion promotion)
        {
            return new PromotionDto
            {
                Id = promotion.Id,
                Name = promotion.Name,
                Description = promotion.Description,
                Type = promotion.Type,
                DiscountValue = promotion.DiscountValue,
                MinimumOrderAmount = promotion.MinimumOrderAmount,
                CouponCode = promotion.CouponCode,
                MaxUsageCount = promotion.MaxUsageCount,
                UsageCount = promotion.UsageCount,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                IsActive = promotion.IsActive,
                SellerId = promotion.SellerId,
                CreatedAt = promotion.CreatedAt
            };
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
                CategoryId = product.CategoryId,
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
