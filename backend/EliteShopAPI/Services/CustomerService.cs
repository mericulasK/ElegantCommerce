using Microsoft.EntityFrameworkCore;
using EliteShopAPI.Data;
using EliteShopAPI.DTOs;
using EliteShopAPI.Models;

namespace EliteShopAPI.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly EliteShopDbContext _context;

        public CustomerService(EliteShopDbContext context)
        {
            _context = context;
        }

        public async Task<CustomerProfileDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                throw new ArgumentException("User not found");

            // Get customer statistics
            var totalOrders = await _context.Orders.CountAsync(o => o.UserId == userId);
            var totalSpent = await _context.Orders
                .Where(o => o.UserId == userId && o.Status == "Delivered")
                .SumAsync(o => o.Total);

            return new CustomerProfileDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                Username = user.Username,
                Avatar = user.Avatar,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt,
                TotalOrders = totalOrders,
                TotalSpent = totalSpent,
                MembershipLevel = totalSpent >= 1000 ? "Gold" : totalSpent >= 500 ? "Silver" : "Bronze",
                Addresses = user.Addresses.Select(a => new AddressDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    Country = a.Country,
                    IsDefault = a.IsDefault
                }).ToList()
            };
        }

        public async Task<CustomerProfileDto> UpdateProfileAsync(int userId, UpdateCustomerProfileDto updateProfileDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new ArgumentException("User not found");

            if (!string.IsNullOrEmpty(updateProfileDto.FirstName))
                user.FirstName = updateProfileDto.FirstName;
            if (!string.IsNullOrEmpty(updateProfileDto.LastName))
                user.LastName = updateProfileDto.LastName;
            if (!string.IsNullOrEmpty(updateProfileDto.PhoneNumber))
                user.PhoneNumber = updateProfileDto.PhoneNumber;
            if (!string.IsNullOrEmpty(updateProfileDto.Avatar))
                user.Avatar = updateProfileDto.Avatar;

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetProfileAsync(userId);
        }

        public async Task<CustomerDashboardDto> GetDashboardAsync(int userId)
        {
            var totalOrders = await _context.Orders.CountAsync(o => o.UserId == userId);
            var completedOrders = await _context.Orders.CountAsync(o => o.UserId == userId && o.Status == "Delivered");
            var totalSpent = await _context.Orders
                .Where(o => o.UserId == userId && o.Status == "Delivered")
                .SumAsync(o => o.Total);

            var recentOrders = await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    Date = o.CreatedAt,
                    TotalAmount = o.Total,
                    Status = o.Status,
                    ItemCount = o.OrderItems.Count()
                }).ToListAsync();

            return new CustomerDashboardDto
            {
                TotalOrders = totalOrders,
                CompletedOrders = completedOrders,
                TotalSpent = totalSpent,
                RecentOrders = recentOrders
            };
        }

        public async Task<List<CustomerOrderDto>> GetOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .Include(o => o.ShippingAddress)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new CustomerOrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    Status = o.Status,
                    PaymentStatus = o.PaymentStatus,
                    Total = o.Total,
                    CreatedAt = o.CreatedAt,
                    ShippedAt = o.ShippedAt,
                    DeliveredAt = o.DeliveredAt,
                    ShippingAddress = new AddressDto
                    {
                        Id = o.ShippingAddress.Id,
                        Title = o.ShippingAddress.Title,
                        Street = o.ShippingAddress.Street,
                        City = o.ShippingAddress.City,
                        State = o.ShippingAddress.State,
                        ZipCode = o.ShippingAddress.ZipCode,
                        Country = o.ShippingAddress.Country,
                        IsDefault = o.ShippingAddress.IsDefault
                    },
                    Items = o.OrderItems.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        ProductId = i.ProductId,
                        ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TotalPrice = i.TotalPrice,
                        Size = i.Size,
                        Color = i.Color
                    }).ToList(),
                    CanReturn = o.Status == "Delivered" && o.DeliveredAt != null && o.DeliveredAt.Value.AddDays(30) > DateTime.UtcNow,
                    CanReview = o.Status == "Delivered"
                }).ToListAsync();
        }

        public async Task<CustomerOrderDto> GetOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders
                .Where(o => o.UserId == userId && o.Id == orderId)
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .Include(o => o.ShippingAddress)
                .FirstOrDefaultAsync();

            if (order == null)
                throw new ArgumentException("Order not found");

            return new CustomerOrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                Total = order.Total,
                CreatedAt = order.CreatedAt,
                ShippedAt = order.ShippedAt,
                DeliveredAt = order.DeliveredAt,
                ShippingAddress = new AddressDto
                {
                    Id = order.ShippingAddress.Id,
                    Title = order.ShippingAddress.Title,
                    Street = order.ShippingAddress.Street,
                    City = order.ShippingAddress.City,
                    State = order.ShippingAddress.State,
                    ZipCode = order.ShippingAddress.ZipCode,
                    Country = order.ShippingAddress.Country,
                    IsDefault = order.ShippingAddress.IsDefault
                },
                Items = order.OrderItems.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice,
                    Size = i.Size,
                    Color = i.Color
                }).ToList(),
                TrackingNumber = order.TrackingNumber,
                EstimatedDelivery = order.EstimatedDelivery,
                CanReturn = order.Status == "Delivered" && order.DeliveredAt != null && order.DeliveredAt.Value.AddDays(30) > DateTime.UtcNow,
                CanReview = order.Status == "Delivered"
            };
        }

        public async Task<List<AddressDto>> GetAddressesAsync(int userId)
        {
            return await _context.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenBy(a => a.CreatedAt)
                .Select(a => new AddressDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Street = a.Street,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    Country = a.Country,
                    IsDefault = a.IsDefault
                }).ToListAsync();
        }

        public async Task<AddressDto> CreateAddressAsync(int userId, CreateAddressDto createAddressDto)
        {
            // If this is set as default, make all other addresses non-default
            if (createAddressDto.IsDefault)
            {
                var existingAddresses = await _context.Addresses
                    .Where(a => a.UserId == userId)
                    .ToListAsync();
                
                foreach (var addr in existingAddresses)
                {
                    addr.IsDefault = false;
                }
            }

            var address = new Address
            {
                UserId = userId,
                Title = createAddressDto.Title,
                Street = createAddressDto.Street,
                City = createAddressDto.City,
                State = createAddressDto.State,
                ZipCode = createAddressDto.ZipCode,
                Country = createAddressDto.Country,
                IsDefault = createAddressDto.IsDefault,
                CreatedAt = DateTime.UtcNow
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return new AddressDto
            {
                Id = address.Id,
                Title = address.Title,
                Street = address.Street,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault
            };
        }

        public async Task<AddressDto> UpdateAddressAsync(int userId, int addressId, UpdateAddressDto updateAddressDto)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
                throw new ArgumentException("Address not found");

            // If setting as default, make all other addresses non-default
            if (updateAddressDto.IsDefault == true)
            {
                var otherAddresses = await _context.Addresses
                    .Where(a => a.UserId == userId && a.Id != addressId)
                    .ToListAsync();
                
                foreach (var addr in otherAddresses)
                {
                    addr.IsDefault = false;
                }
            }

            if (!string.IsNullOrEmpty(updateAddressDto.Title))
                address.Title = updateAddressDto.Title;
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
                address.IsDefault = updateAddressDto.IsDefault.Value;

            address.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new AddressDto
            {
                Id = address.Id,
                Title = address.Title,
                Street = address.Street,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                Country = address.Country,
                IsDefault = address.IsDefault
            };
        }

        public async Task DeleteAddressAsync(int userId, int addressId)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null)
                throw new ArgumentException("Address not found");

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();
        }

        public async Task<ReviewDto> CreateReviewAsync(int userId, CreateReviewDto createReviewDto)
        {
            // Verify user has purchased this product
            var hasPurchased = await _context.Orders
                .Where(o => o.UserId == userId && o.Status == "Delivered")
                .SelectMany(o => o.OrderItems)
                .AnyAsync(i => i.ProductId == createReviewDto.ProductId);

            if (!hasPurchased)
                throw new ArgumentException("You can only review products you have purchased");

            // Check if user already reviewed this product
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == createReviewDto.ProductId);

            if (existingReview != null)
                throw new ArgumentException("You have already reviewed this product");

            var review = new Review
            {
                UserId = userId,
                ProductId = createReviewDto.ProductId,
                Rating = createReviewDto.Rating,
                Comment = createReviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return new ReviewDto
            {
                Id = review.Id,
                UserId = userId,
                UserName = user?.Username ?? "Unknown",
                ProductId = review.ProductId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<ReturnRequestDto> CreateReturnRequestAsync(int userId, CreateReturnRequestDto createReturnDto)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == createReturnDto.OrderId && o.UserId == userId);

            if (order == null)
                throw new ArgumentException("Order not found");

            if (order.Status != "Delivered")
                throw new ArgumentException("Can only return delivered orders");

            if (order.DeliveredAt != null && order.DeliveredAt.Value.AddDays(30) < DateTime.UtcNow)
                throw new ArgumentException("Return period has expired");

            // Verify all items belong to this order
            var orderItemIds = order.OrderItems.Select(i => i.Id).ToList();
            if (!createReturnDto.ItemIds.All(id => orderItemIds.Contains(id)))
                throw new ArgumentException("One or more items do not belong to this order");

            var returnRequest = new ReturnRequest
            {
                OrderId = createReturnDto.OrderId,
                UserId = userId,
                Reason = createReturnDto.Reason,
                Description = createReturnDto.Description,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.ReturnRequests.Add(returnRequest);
            await _context.SaveChangesAsync();

            // Add return request items
            foreach (var itemId in createReturnDto.ItemIds)
            {
                var returnItem = new ReturnRequestItem
                {
                    ReturnRequestId = returnRequest.Id,
                    OrderItemId = itemId
                };
                _context.ReturnRequestItems.Add(returnItem);
            }

            await _context.SaveChangesAsync();

            return new ReturnRequestDto
            {
                Id = returnRequest.Id,
                OrderId = returnRequest.OrderId,
                OrderNumber = order.OrderNumber,
                ItemIds = createReturnDto.ItemIds,
                Reason = returnRequest.Reason,
                Description = returnRequest.Description,
                Status = returnRequest.Status,
                CreatedAt = returnRequest.CreatedAt
            };
        }

        public async Task<List<ReturnRequestDto>> GetReturnRequestsAsync(int userId)
        {
            return await _context.ReturnRequests
                .Where(r => r.UserId == userId)
                .Include(r => r.Order)
                .Include(r => r.ReturnRequestItems)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReturnRequestDto
                {
                    Id = r.Id,
                    OrderId = r.OrderId,
                    OrderNumber = r.Order.OrderNumber,
                    ItemIds = r.ReturnRequestItems.Select(i => i.OrderItemId).ToList(),
                    Reason = r.Reason,
                    Description = r.Description,
                    Status = r.Status,
                    CreatedAt = r.CreatedAt,
                    ProcessedAt = r.ProcessedAt
                }).ToListAsync();
        }
    }
}
