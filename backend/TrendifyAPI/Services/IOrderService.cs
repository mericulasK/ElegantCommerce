using TrendifyAPI.DTOs;

namespace TrendifyAPI.Services
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto);
        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
        Task<OrderDto> GetOrderByIdAsync(int userId, int orderId);
        Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status);
        Task<bool> CancelOrderAsync(int userId, int orderId);
        
        // Address management
        Task<IEnumerable<AddressDto>> GetUserAddressesAsync(int userId);
        Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto createAddressDto);
        Task<AddressDto> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto updateAddressDto);
        Task<bool> DeleteAddressAsync(int userId, int addressId);
        Task<AddressDto> SetDefaultAddressAsync(int userId, int addressId);
    }
}
