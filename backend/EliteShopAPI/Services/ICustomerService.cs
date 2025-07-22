using EliteShopAPI.DTOs;

namespace EliteShopAPI.Services
{
    public interface ICustomerService
    {
        Task<CustomerProfileDto> GetProfileAsync(int userId);
        Task<CustomerProfileDto> UpdateProfileAsync(int userId, UpdateCustomerProfileDto updateProfileDto);
        Task<CustomerDashboardDto> GetDashboardAsync(int userId);
        Task<List<CustomerOrderDto>> GetOrdersAsync(int userId);
        Task<CustomerOrderDto> GetOrderAsync(int userId, int orderId);
        Task<List<AddressDto>> GetAddressesAsync(int userId);
        Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto createAddressDto);
        Task<AddressDto> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto updateAddressDto);
        Task DeleteAddressAsync(int userId, int addressId);
        Task<ReviewDto> CreateReviewAsync(int userId, CreateReviewDto createReviewDto);
        Task<ReturnRequestDto> CreateReturnRequestAsync(int userId, CreateReturnRequestDto createReturnDto);
        Task<List<ReturnRequestDto>> GetReturnRequestsAsync(int userId);
    }
}
