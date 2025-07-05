using TrendifyAPI.DTOs;

namespace TrendifyAPI.Services
{
    public interface ICartService
    {
        Task<CartSummaryDto> GetCartAsync(int userId);
        Task<CartItemDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
        Task<CartItemDto> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto);
        Task<bool> RemoveFromCartAsync(int userId, int cartItemId);
        Task<bool> ClearCartAsync(int userId);
        Task<int> GetCartItemCountAsync(int userId);
    }
}
