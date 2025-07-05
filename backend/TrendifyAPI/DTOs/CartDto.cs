namespace TrendifyAPI.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public ProductDto Product { get; set; } = null!;
        public int Quantity { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
        public string? Size { get; set; }
        public string? Color { get; set; }
    }

    public class UpdateCartItemDto
    {
        public int Quantity { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
    }

    public class CartSummaryDto
    {
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public int TotalItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }
}
