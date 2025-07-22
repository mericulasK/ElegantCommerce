using Microsoft.EntityFrameworkCore;
using EliteShopAPI.Data;
using EliteShopAPI.DTOs;
using EliteShopAPI.Models;

namespace EliteShopAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly EliteShopDbContext _context;

        public OrderService(EliteShopDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Validate address
                var address = await _context.Addresses
                    .FirstOrDefaultAsync(a => a.Id == createOrderDto.ShippingAddressId && a.UserId == userId);
                
                if (address == null)
                {
                    throw new KeyNotFoundException("Shipping address not found");
                }

                // Calculate totals
                decimal subtotal = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in createOrderDto.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null || !product.InStock)
                    {
                        throw new InvalidOperationException($"Product {item.ProductId} is not available");
                    }

                    var orderItem = new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        TotalPrice = product.Price * item.Quantity,
                        Size = item.Size,
                        Color = item.Color
                    };

                    orderItems.Add(orderItem);
                    subtotal += orderItem.TotalPrice;
                }

                var shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
                var tax = subtotal * 0.08m; // 8% tax
                var total = subtotal + shippingCost + tax;

                // Create order
                var order = new Order
                {
                    UserId = userId,
                    OrderNumber = GenerateOrderNumber(),
                    Subtotal = subtotal,
                    ShippingCost = shippingCost,
                    Tax = tax,
                    Total = total,
                    Status = "Pending",
                    PaymentStatus = "Pending",
                    PaymentMethod = createOrderDto.PaymentMethod,
                    ShippingAddressId = createOrderDto.ShippingAddressId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Clear user's cart
                var cartItems = await _context.CartItems.Where(c => c.UserId == userId).ToListAsync();
                _context.CartItems.RemoveRange(cartItems);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return await GetOrderByIdAsync(userId, order.Id);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapToOrderDto);
        }

        public async Task<OrderDto> GetOrderByIdAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.ShippingAddress)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
            {
                throw new KeyNotFoundException("Order not found");
            }

            return MapToOrderDto(order);
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                throw new KeyNotFoundException("Order not found");
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            if (status == "Shipped")
            {
                order.ShippedAt = DateTime.UtcNow;
            }
            else if (status == "Delivered")
            {
                order.DeliveredAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return await GetOrderByIdAsync(order.UserId, orderId);
        }

        public async Task<bool> CancelOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
            {
                return false;
            }

            if (order.Status != "Pending" && order.Status != "Processing")
            {
                throw new InvalidOperationException("Order cannot be cancelled");
            }

            order.Status = "Cancelled";
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        // Address management methods
        public async Task<IEnumerable<AddressDto>> GetUserAddressesAsync(int userId)
        {
            var addresses = await _context.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync();

            return addresses.Select(MapToAddressDto);
        }

        public async Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto createAddressDto)
        {
            // If this is set as default, unset other defaults
            if (createAddressDto.IsDefault)
            {
                var existingDefaults = await _context.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var addr in existingDefaults)
                {
                    addr.IsDefault = false;
                }
            }

            var address = new Address
            {
                UserId = userId,
                Street = createAddressDto.Street,
                City = createAddressDto.City,
                State = createAddressDto.State,
                ZipCode = createAddressDto.ZipCode,
                Country = createAddressDto.Country,
                IsDefault = createAddressDto.IsDefault,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return MapToAddressDto(address);
        }

        public async Task<AddressDto> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto updateAddressDto)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
            {
                throw new KeyNotFoundException("Address not found");
            }

            if (!string.IsNullOrEmpty(updateAddressDto.Street))
                address.Street = updateAddressDto.Street;

            if (!string.IsNullOrEmpty(updateAddressDto.City))
                address.City = updateAddressDto.City;

            if (!string.IsNullOrEmpty(updateAddressDto.State))
                address.State = updateAddressDto.State;

            if (!string.IsNullOrEmpty(updateAddressDto.ZipCode))
                address.ZipCode = updateAddressDto.ZipCode;

            if (!string.IsNullOrEmpty(updateAddressDto.Country))
                address.Country = updateAddressDto.Country;

            if (updateAddressDto.IsDefault.HasValue)
            {
                if (updateAddressDto.IsDefault.Value)
                {
                    // Unset other defaults
                    var existingDefaults = await _context.Addresses
                        .Where(a => a.UserId == userId && a.IsDefault && a.Id != addressId)
                        .ToListAsync();

                    foreach (var addr in existingDefaults)
                    {
                        addr.IsDefault = false;
                    }
                }
                address.IsDefault = updateAddressDto.IsDefault.Value;
            }

            address.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToAddressDto(address);
        }

        public async Task<bool> DeleteAddressAsync(int userId, int addressId)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
            {
                return false;
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AddressDto> SetDefaultAddressAsync(int userId, int addressId)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
            {
                throw new KeyNotFoundException("Address not found");
            }

            // Unset other defaults
            var existingDefaults = await _context.Addresses
                .Where(a => a.UserId == userId && a.IsDefault)
                .ToListAsync();

            foreach (var addr in existingDefaults)
            {
                addr.IsDefault = false;
            }

            address.IsDefault = true;
            address.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToAddressDto(address);
        }

        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        }

        private OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Subtotal = order.Subtotal,
                ShippingCost = order.ShippingCost,
                Tax = order.Tax,
                Total = order.Total,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                PaymentMethod = order.PaymentMethod,
                ShippingAddress = MapToAddressDto(order.ShippingAddress),
                OrderItems = order.OrderItems.Select(MapToOrderItemDto).ToList(),
                CreatedAt = order.CreatedAt,
                ShippedAt = order.ShippedAt,
                DeliveredAt = order.DeliveredAt
            };
        }

        private OrderItemDto MapToOrderItemDto(OrderItem orderItem)
        {
            return new OrderItemDto
            {
                Id = orderItem.Id,
                Product = new ProductDto
                {
                    Id = orderItem.Product.Id,
                    Name = orderItem.Product.Name,
                    Description = orderItem.Product.Description,
                    Price = orderItem.Product.Price,
                    OriginalPrice = orderItem.Product.OriginalPrice,
                    Image = orderItem.Product.Image,
                    CategoryId = orderItem.Product.CategoryId,
                    CategoryName = orderItem.Product.Category.Name,
                    Rating = orderItem.Product.Rating,
                    ReviewCount = orderItem.Product.ReviewCount,
                    InStock = orderItem.Product.InStock,
                    Featured = orderItem.Product.Featured,
                    Sale = orderItem.Product.Sale,
                    Discount = orderItem.Product.Discount
                },
                Quantity = orderItem.Quantity,
                UnitPrice = orderItem.UnitPrice,
                TotalPrice = orderItem.TotalPrice,
                Size = orderItem.Size,
                Color = orderItem.Color
            };
        }

        private AddressDto MapToAddressDto(Address address)
        {
            return new AddressDto
            {
                Id = address.Id,
                Street = address.Street,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault
            };
        }
    }
}
