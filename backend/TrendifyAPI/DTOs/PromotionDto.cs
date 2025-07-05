namespace TrendifyAPI.DTOs
{
    public class PromotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal? DiscountValue { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public string? CouponCode { get; set; }
        public int? MaxUsageCount { get; set; }
        public int UsageCount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public int? SellerId { get; set; }
        public string? SellerName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePromotionDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Percentage, FixedAmount, FreeShipping
        public decimal? DiscountValue { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public string? CouponCode { get; set; }
        public int? MaxUsageCount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdatePromotionDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public decimal? DiscountValue { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public string? CouponCode { get; set; }
        public int? MaxUsageCount { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
