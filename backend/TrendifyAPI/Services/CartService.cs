using Microsoft.EntityFrameworkCore;
using TrendifyAPI.Data;
using TrendifyAPI.DTOs;
using TrendifyAPI.Models;

namespace TrendifyAPI.Services
{
    public class CartService : ICartService
    {
        private readonly TrendifyDbContext _context;

        public CartService(TrendifyDbContext context)
        {
            _context = context;
        }

        public async Task<CartSummaryDto> GetCartAsync(int userId)
        {
            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .ThenInclude(p => p.Category)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            var cartItemDtos = cartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                Product = new ProductDto
                {
                    Id = ci.Product.Id,
                    Name = ci.Product.Name,
                    Description = ci.Product.Description,
                    Price = ci.Product.Price,
                    OriginalPrice = ci.Product.OriginalPrice,
                    Image = ci.Product.Image,
                    CategoryId = ci.Product.CategoryId,
                    CategoryName = ci.Product.Category.Name,
                    Rating = ci.Product.Rating,
                    ReviewCount = ci.Product.ReviewCount,
                    InStock = ci.Product.InStock,
                    Featured = ci.Product.Featured,
                    Sale = ci.Product.Sale,
                    Discount = ci.Product.Discount
                },
                Quantity = ci.Quantity,
                Size = ci.Size,
                Color = ci.Color,
                CreatedAt = ci.CreatedAt
            }).ToList();

            var subtotal = cartItemDtos.Sum(ci => ci.Product.Price * ci.Quantity);
            var shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
            var tax = subtotal * 0.08m; // 8% tax
            var total = subtotal + shippingCost + tax;

            return new CartSummaryDto
            {
                Items = cartItemDtos,
                TotalItems = cartItemDtos.Sum(ci => ci.Quantity),
                Subtotal = subtotal,
                ShippingCost = shippingCost,
                Tax = tax,
                Total = total
            };
        }

        public async Task<CartItemDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
        {
            // Check if product exists
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == addToCartDto.ProductId);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found");
            }

            // Check if item already exists in cart
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && 
                                          ci.ProductId == addToCartDto.ProductId &&
                                          ci.Size == addToCartDto.Size &&
                                          ci.Color == addToCartDto.Color);

            if (existingCartItem != null)
            {
                // Update quantity
                existingCartItem.Quantity += addToCartDto.Quantity;
                existingCartItem.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return MapToCartItemDto(existingCartItem, product);
            }

            // Create new cart item
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = addToCartDto.ProductId,
                Quantity = addToCartDto.Quantity,
                Size = addToCartDto.Size,
                Color = addToCartDto.Color,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            return MapToCartItemDto(cartItem, product);
        }

        public async Task<CartItemDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto)
        {
            var cartItem = await _context.CartItems
                .Include(ci => ci.Product)
                .ThenInclude(p => p.Category)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.UserId == userId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Cart item not found");
            }

            cartItem.Quantity = updateCartItemDto.Quantity;
            cartItem.Size = updateCartItemDto.Size;
            cartItem.Color = updateCartItemDto.Color;
            cartItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToCartItemDto(cartItem, cartItem.Product);
        }

        public async Task<bool> RemoveFromCartAsync(int userId, int cartItemId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.UserId == userId);

            if (cartItem == null)
            {
                return false;
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetCartItemCountAsync(int userId)
        {
            return await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .SumAsync(ci => ci.Quantity);
        }

        private CartItemDto MapToCartItemDto(CartItem cartItem, Product product)
        {
            return new CartItemDto
            {
                Id = cartItem.Id,
                Product = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    OriginalPrice = product.OriginalPrice,
                    Image = product.Image,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    Rating = product.Rating,
                    ReviewCount = product.ReviewCount,
                    InStock = product.InStock,
                    Featured = product.Featured,
                    Sale = product.Sale,
                    Discount = product.Discount
                },
                Quantity = cartItem.Quantity,
                Size = cartItem.Size,
                Color = cartItem.Color,
                CreatedAt = cartItem.CreatedAt
            };
        }
    }
}
