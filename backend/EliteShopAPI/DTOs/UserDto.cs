namespace EliteShopAPI.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public bool IsSellerApproved { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class RegisterDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = "Customer"; // Customer, Seller
        public string? CompanyName { get; set; } // Required for Seller role
        public string? CompanyLogo { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
    }

    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class SellerApprovalDto
    {
        public int SellerId { get; set; }
        public bool IsApproved { get; set; }
        public string? Notes { get; set; }
    }

    public class AdminUserManagementDto
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public bool? IsEmailVerified { get; set; }
    }

    // Customer DTOs
    public class CustomerProfileDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public bool IsEmailVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public string MembershipLevel { get; set; } = "Bronze";
        public List<AddressDto> Addresses { get; set; } = new List<AddressDto>();
        public CustomerPreferencesDto Preferences { get; set; } = new CustomerPreferencesDto();
        public DateTime MemberSince { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
    }

    public class UpdateCustomerProfileDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public CustomerPreferencesDto? Preferences { get; set; }
    }

    public class CustomerPreferencesDto
    {
        public bool EmailNotifications { get; set; } = true;
        public bool SmsNotifications { get; set; } = false;
        public bool MarketingEmails { get; set; } = true;
        public bool OrderUpdates { get; set; } = true;
    }

    public class CustomerDashboardDto
    {
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public int FavoriteProducts { get; set; }
        public List<RecentOrderDto> RecentOrders { get; set; } = new List<RecentOrderDto>();
        public List<ProductRecommendationDto> Recommendations { get; set; } = new List<ProductRecommendationDto>();
    }

    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ItemCount { get; set; }
    }

    public class ProductRecommendationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
    }

    public class CustomerOrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime? ShippedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public AddressDto ShippingAddress { get; set; } = new AddressDto();
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
        public string? TrackingNumber { get; set; }
        public DateTime? EstimatedDelivery { get; set; }
        public bool CanReturn { get; set; }
        public bool CanReview { get; set; }
    }

    public class ReturnRequestDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public List<int> ItemIds { get; set; } = new List<int>();
        public string Reason { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }

    public class CreateReturnRequestDto
    {
        public int OrderId { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
        public string Reason { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
