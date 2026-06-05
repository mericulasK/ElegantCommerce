using Microsoft.EntityFrameworkCore;
using EliteShopAPI.Models;

namespace EliteShopAPI.Data
{
    public class EliteShopDbContext : DbContext
    {
        public EliteShopDbContext(DbContextOptions<EliteShopDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<CmsPage> CmsPages { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<ReturnRequest> ReturnRequests { get; set; }
        public DbSet<ReturnRequestItem> ReturnRequestItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configurations
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Role).HasDefaultValue("Customer");

                // Self-referencing relationship for admin approval
                entity.HasOne(e => e.ApprovedByAdmin)
                    .WithMany()
                    .HasForeignKey(e => e.ApprovedByAdminId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Category configurations
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
            });

            // Product configurations
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Seller)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.SellerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.Price).HasPrecision(18, 2);
                entity.Property(e => e.OriginalPrice).HasPrecision(18, 2);
                entity.Property(e => e.Rating).HasPrecision(3, 2);
                entity.Property(e => e.Weight).HasPrecision(10, 3);
            });

            // ProductImage configurations
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // CartItem configurations
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Order configurations
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.ShippingAddress)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.ShippingAddressId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.Promotion)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.PromotionId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.Property(e => e.Subtotal).HasPrecision(18, 2);
                entity.Property(e => e.ShippingCost).HasPrecision(18, 2);
                entity.Property(e => e.Tax).HasPrecision(18, 2);
                entity.Property(e => e.DiscountAmount).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);
            });

            // OrderItem configurations
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
            });

            // Address configurations
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Review configurations
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Promotion configurations
            modelBuilder.Entity<Promotion>(entity =>
            {
                entity.HasOne(d => d.Seller)
                    .WithMany()
                    .HasForeignKey(d => d.SellerId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.DiscountValue).HasPrecision(18, 2);
                entity.Property(e => e.MinimumOrderAmount).HasPrecision(18, 2);
                entity.HasIndex(e => e.CouponCode).IsUnique();
            });

                        // CmsPage configurations
            modelBuilder.Entity<CmsPage>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
            });

            // ActivityLog configurations
            modelBuilder.Entity<ActivityLog>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ReturnRequest configurations
            modelBuilder.Entity<ReturnRequest>(entity =>
            {
                entity.HasOne(d => d.Order)
                    .WithMany()
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.ProcessedByUser)
                    .WithMany()
                    .HasForeignKey(d => d.ProcessedByUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ReturnRequestItem configurations
            modelBuilder.Entity<ReturnRequestItem>(entity =>
            {
                entity.HasOne(d => d.ReturnRequest)
                    .WithMany(p => p.ReturnRequestItems)
                    .HasForeignKey(d => d.ReturnRequestId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.OrderItem)
                    .WithMany()
                    .HasForeignKey(d => d.OrderItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Demo Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, FirstName = "System", LastName = "Administrator", Email = "admin@eliteshop.com", Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"), Role = "Admin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 2, FirstName = "Elite", LastName = "Designer", Email = "seller1@eliteshop.com", Username = "seller1", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Seller123!"), Role = "Seller", CompanyName = "EliteDesign Store", IsSellerApproved = true, IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 3, FirstName = "Fashion", LastName = "World", Email = "seller2@eliteshop.com", Username = "seller2", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Seller456!"), Role = "Seller", CompanyName = "Fashion World", IsSellerApproved = false, IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 4, FirstName = "Ali", LastName = "Yılmaz", Email = "customer1@eliteshop.com", Username = "customer1", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"), Role = "Customer", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 5, FirstName = "Ayşe", LastName = "Demir", Email = "customer2@eliteshop.com", Username = "customer2", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer456!"), Role = "Customer", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 6, FirstName = "Mehmet", LastName = "Kaya", Email = "vip@eliteshop.com", Username = "vipcustomer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("VipCustomer789!"), Role = "Customer", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 7, FirstName = "Test", LastName = "Admin", Email = "testadmin@test.com", Username = "testadmin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"), Role = "Admin", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 8, FirstName = "Test", LastName = "Seller", Email = "testseller@test.com", Username = "testseller", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"), Role = "Seller", CompanyName = "Test Company", IsSellerApproved = true, IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new User { Id = 9, FirstName = "Test", LastName = "Customer", Email = "testcustomer@test.com", Username = "testcustomer", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"), Role = "Customer", IsEmailVerified = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Clothing", Slug = "clothing", Description = "Trendy and comfortable clothing for all occasions", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 2, Name = "Accessories", Slug = "accessories", Description = "Complete your look with our stylish accessories", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 3, Name = "Shoes", Slug = "shoes", Description = "Step out in style with our premium footwear", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Category { Id = 4, Name = "Electronics", Slug = "electronics", Description = "Latest gadgets and electronic devices", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );

            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Strappy Sandals", Description = "Perfect for sunny days and beach walks.", Price = 59.99m, Image = "/images/products/sandals.jpg", CategoryId = 3, Rating = 4.5m, ReviewCount = 128, InStock = true, Featured = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 2, Name = "Classic Watch", Description = "An elegant timepiece for all occasions.", Price = 149.99m, Image = "/images/products/watch.jpg", CategoryId = 2, Rating = 4.8m, ReviewCount = 89, InStock = true, Featured = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 3, Name = "Wide-Brim Hat", Description = "Stylish sun protection for your adventures.", Price = 39.99m, Image = "/images/products/hat.jpg", CategoryId = 2, Rating = 4.3m, ReviewCount = 67, InStock = true, Featured = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 4, Name = "Elegant Necklace", Description = "Add a touch of sparkle to your look.", Price = 89.99m, Image = "/images/products/necklace.jpg", CategoryId = 2, Rating = 4.7m, ReviewCount = 156, InStock = true, Featured = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 5, Name = "Slim Fit Jeans", Description = "Versatile denim for everyday wear.", Price = 39.99m, OriginalPrice = 79.99m, Image = "/images/products/jeans.jpg", CategoryId = 1, Rating = 4.2m, ReviewCount = 234, InStock = true, Sale = true, Discount = 50, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 6, Name = "Lightweight Jacket", Description = "Perfect for cool evenings.", Price = 69.99m, OriginalPrice = 139.99m, Image = "/images/products/jacket.jpg", CategoryId = 1, Rating = 4.6m, ReviewCount = 98, InStock = true, Sale = true, Discount = 50, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 7, Name = "Silk Scarf", Description = "An elegant touch of luxury.", Price = 29.99m, OriginalPrice = 59.99m, Image = "/images/products/scarf.jpg", CategoryId = 2, Rating = 4.4m, ReviewCount = 76, InStock = true, Sale = true, Discount = 50, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Product { Id = 8, Name = "Leather Sneakers", Description = "Comfort and style for your feet.", Price = 79.99m, OriginalPrice = 159.99m, Image = "/images/products/sneakers.jpg", CategoryId = 3, Rating = 4.5m, ReviewCount = 187, InStock = true, Sale = true, Discount = 50, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );
        }
    }
}
