-- Azure SQL Database Setup for TrendifyAPI
-- Create database tables compatible with C# .NET 8.0 backend

-- Users table
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Username] nvarchar(100) NOT NULL UNIQUE,
    [Email] nvarchar(255) NOT NULL UNIQUE,
    [PasswordHash] nvarchar(500) NOT NULL,
    [FirstName] nvarchar(100) NULL,
    [LastName] nvarchar(100) NULL,
    [Phone] nvarchar(20) NULL,
    [Role] nvarchar(50) NOT NULL DEFAULT 'Customer',
    [IsActive] bit NOT NULL DEFAULT 1,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE()
);

-- Categories table
CREATE TABLE [dbo].[Categories] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] nvarchar(100) NOT NULL,
    [Slug] nvarchar(100) NOT NULL UNIQUE,
    [Image] nvarchar(500) NULL,
    [Description] nvarchar(500) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE()
);

-- Products table
CREATE TABLE [dbo].[Products] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] nvarchar(200) NOT NULL,
    [Description] nvarchar(1000) NULL,
    [Price] decimal(18,2) NOT NULL,
    [OriginalPrice] decimal(18,2) NULL,
    [Image] nvarchar(500) NOT NULL,
    [CategoryId] int NOT NULL,
    [SellerId] int NULL,
    [Rating] decimal(3,2) NOT NULL DEFAULT 0,
    [ReviewCount] int NOT NULL DEFAULT 0,
    [StockQuantity] int NOT NULL DEFAULT 0,
    [InStock] bit NOT NULL DEFAULT 1,
    [Featured] bit NOT NULL DEFAULT 0,
    [Sale] bit NOT NULL DEFAULT 0,
    [Discount] int NULL,
    [Brand] nvarchar(100) NULL,
    [Color] nvarchar(50) NULL,
    [Size] nvarchar(50) NULL,
    [Material] nvarchar(100) NULL,
    [Weight] decimal(10,2) NULL,
    [Dimensions] nvarchar(100) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Products_Categories] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories] ([Id]),
    CONSTRAINT [FK_Products_Users] FOREIGN KEY ([SellerId]) REFERENCES [dbo].[Users] ([Id])
);

-- ProductImages table
CREATE TABLE [dbo].[ProductImages] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [ProductId] int NOT NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [IsMain] bit NOT NULL DEFAULT 0,
    [DisplayOrder] int NOT NULL DEFAULT 0,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_ProductImages_Products] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products] ([Id]) ON DELETE CASCADE
);

-- CartItems table
CREATE TABLE [dbo].[CartItems] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [UserId] int NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] int NOT NULL DEFAULT 1,
    [Size] nvarchar(50) NULL,
    [Color] nvarchar(50) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_CartItems_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CartItems_Products] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products] ([Id]) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE [dbo].[Reviews] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [ProductId] int NOT NULL,
    [UserId] int NOT NULL,
    [Rating] int NOT NULL CHECK ([Rating] >= 1 AND [Rating] <= 5),
    [Comment] nvarchar(1000) NULL,
    [IsVerified] bit NOT NULL DEFAULT 0,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Reviews_Products] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE [dbo].[Orders] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [UserId] int NOT NULL,
    [OrderNumber] nvarchar(50) NOT NULL UNIQUE,
    [Status] nvarchar(50) NOT NULL DEFAULT 'Pending',
    [TotalAmount] decimal(18,2) NOT NULL,
    [ShippingAddress] nvarchar(500) NOT NULL,
    [PaymentMethod] nvarchar(50) NOT NULL,
    [PaymentStatus] nvarchar(50) NOT NULL DEFAULT 'Pending',
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_Orders_Users] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);

-- OrderItems table
CREATE TABLE [dbo].[OrderItems] (
    [Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [OrderId] int NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Size] nvarchar(50) NULL,
    [Color] nvarchar(50) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [FK_OrderItems_Orders] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Products] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products] ([Id])
);

-- Insert sample categories
INSERT INTO [dbo].[Categories] ([Name], [Slug], [Image], [Description]) VALUES
('Women''s Fashion', 'womens-fashion', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop', 'Trendy clothing and accessories for women'),
('Men''s Fashion', 'mens-fashion', 'https://images.unsplash.com/photo-1617137984095-74e4e2e3d6e2?w=400&h=300&fit=crop', 'Stylish clothing and accessories for men'),
('Accessories', 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', 'Bags, jewelry, watches and more');

-- Insert sample products
INSERT INTO [dbo].[Products] ([Name], [Description], [Price], [OriginalPrice], [Image], [CategoryId], [Brand], [Color], [Size], [Material], [StockQuantity], [InStock], [Featured], [Sale], [Rating], [ReviewCount]) VALUES
('Designer Evening Dress', 'Elegant silk dress perfect for special occasions', 189.00, 270.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 1, 'EliteDesign', 'Black', 'M', 'Silk', 25, 1, 1, 1, 4.8, 127),
('Luxury Leather Handbag', 'Premium quality leather with modern design', 299.00, NULL, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop', 3, 'LuxuryBrand', 'Brown', 'Medium', 'Genuine Leather', 15, 1, 1, 0, 4.9, 89),
('Casual Sport Jacket', 'Comfortable and stylish for everyday wear', 149.00, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 2, 'SportStyle', 'Navy Blue', 'L', 'Cotton Blend', 30, 1, 1, 0, 4.6, 156),
('Designer Sneakers', 'Premium comfort meets street style', 179.00, NULL, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop', 3, 'StreetStyle', 'White', '42', 'Canvas & Rubber', 20, 1, 1, 0, 4.7, 203),
('Classic White Shirt', 'Timeless elegance for professional settings', 89.00, 120.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop', 1, 'Classic', 'White', 'M', 'Cotton', 50, 1, 0, 1, 4.5, 78),
('Premium Watch', 'Luxury timepiece with Swiss movement', 599.00, NULL, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=500&fit=crop', 3, 'SwissMade', 'Silver', NULL, 'Stainless Steel', 10, 1, 0, 0, 4.8, 45);

PRINT 'Azure SQL Database setup completed successfully!';