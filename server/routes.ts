import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertProductSchema, insertCategorySchema, insertCartItemSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed Database
  app.post("/api/seed", async (req, res) => {
    try {
      await seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ message: "Failed to seed database" });
    }
  });

  // Admin Routes
  app.get("/api/admin/overview", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      const activities = await storage.getActivityLogs(undefined, 10);
      
      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const pendingSellers = users.filter(u => u.role === 'seller').length; // All sellers for now
      
      // Recent orders with customer info
      const recentOrders = orders.slice(0, 5).map(order => {
        const customer = users.find(u => u.id === order.userId);
        return {
          ...order,
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer'
        };
      });

      // Recent activities
      const recentActivities = activities.map(activity => ({
        id: activity.id,
        action: activity.action,
        description: activity.description,
        createdAt: activity.createdAt
      }));

      // System alerts (empty for now)
      const systemAlerts: any[] = [];
      
      res.json({
        users: {
          total: users.length,
          new: users.filter(u => {
            if (!u.createdAt) return false;
            const createdAt = new Date(u.createdAt);
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return createdAt > oneWeekAgo;
          }).length
        },
        products: {
          total: products.length,
          active: products.filter(p => p.inStock).length,
          lowStock: products.filter(p => (p.stockQuantity || 0) < 10).length
        },
        orders: {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          completed: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        },
        revenue: {
          total: totalRevenue
        },
        sellers: {
          pending: pendingSellers
        },
        recentOrders,
        recentActivities,
        alerts: systemAlerts
      });
    } catch (error) {
      console.error("Admin overview error:", error);
      res.status(500).json({ message: "Failed to fetch admin overview" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      const activities = await storage.getActivityLogs(undefined, 10);
      
      res.json({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
        activities
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.get("/api/admin/seller-applications", async (req, res) => {
    try {
      const sellers = await storage.getUsersByRole("seller");
      res.json(sellers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller applications" });
    }
  });

  app.post("/api/admin/seller-applications/:userId/approve", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.updateUser(userId, { isApproved: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.logActivity({
        action: "Seller Approved",
        description: `Seller application approved for user ${user.email}`,
        userId: undefined,
        entityType: "user",
        entityId: userId
      });
      
      res.json({ message: "Seller approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve seller" });
    }
  });

  app.get("/api/admin/statistics", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const products = await storage.getProducts();
      const orders = await storage.getOrders();
      const activities = await storage.getActivityLogs(undefined, 20);
      
      const stats = {
        totalUsers: users.length,
        totalCustomers: users.filter((u: any) => u.role === "customer").length,
        totalSellers: users.filter((u: any) => u.role === "seller").length,
        totalAdmins: users.filter((u: any) => u.role === "admin").length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
        pendingOrders: orders.filter(o => o.status === "pending").length,
        deliveredOrders: orders.filter(o => o.status === "delivered").length,
        cancelledOrders: orders.filter(o => o.status === "cancelled").length,
        topSellingProducts: [],
        topSellers: [],
        salesByMonth: [],
        userActivities: activities
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/admin/activities", async (req, res) => {
    try {
      const activities = await storage.getActivityLogs();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Seller Routes
  app.get("/api/seller/stats/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      const orders = await storage.getOrdersBySeller(sellerId);
      const reviews = await storage.getReviews(undefined, sellerId);
      
      res.json({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
        averageRating: reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller stats" });
    }
  });

  app.get("/api/seller/products/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  });

  app.get("/api/seller/orders/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const orders = await storage.getOrdersBySeller(sellerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller orders" });
    }
  });

  app.get("/api/seller/reviews/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const reviews = await storage.getReviews(undefined, sellerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller reviews" });
    }
  });

  // Seller product management
  app.post("/api/seller/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/seller/products/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const product = await storage.updateProduct(productId, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/seller/products/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const success = await storage.deleteProduct(productId);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Seller order management
  app.put("/api/seller/orders/:orderId/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, isNew, isOnSale, search } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured !== undefined) filters.featured = featured === 'true';
      if (isNew !== undefined) filters.isNew = isNew === 'true';
      if (isOnSale !== undefined) filters.isOnSale = isOnSale === 'true';
      if (search) filters.search = search as string;

      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid product data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItemQuantity(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.post("/api/orders", async (req: any, res) => {
    try {
      const orderData = req.body;
      
      // Extract items from order data
      const items = orderData.items || [];
      
      // Get user ID from session or use default
      const userId = req.session?.user?.id || orderData.userId || 1;
      
      // Create order object with required fields
      const order = {
        userId: userId,
        totalAmount: orderData.total.toString(),
        status: "pending" as const,
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        paymentMethod: orderData.paymentMethod,
        paymentStatus: "pending" as const,
        notes: orderData.orderNotes || null
      };
      
      const createdOrder = await storage.createOrder(order, items);
      res.json(createdOrder);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      const orders = await storage.getOrders(userId ? parseInt(userId as string) : undefined);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get orders for a specific user with full details
  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrders(userId);
      
      // Get full order details with items
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const fullOrder = await storage.getOrder(order.id);
          return fullOrder;
        })
      );
      
      res.json(ordersWithItems.filter(Boolean));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  // Reorder endpoint
  app.post("/api/orders/:id/reorder", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Add all items from the order to cart
      for (const item of order.items) {
        await storage.addToCart({
          productId: item.productId,
          quantity: item.quantity,
          userId: order.userId
        });
      }

      res.json({ message: "Items added to cart successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder items" });
    }
  });

  app.get("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });
  
  // Reviews
  app.get("/api/reviews/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const { productId, userId, rating, comment } = req.body;
      
      // Get product to find sellerId
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const review = await storage.createReview({
        productId,
        userId,
        sellerId: product.sellerId || 1, // Default to first seller if no sellerId
        rating,
        comment
      });
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const { sessionId, userId } = req.query;
      const cartItems = await storage.getCartItems(
        sessionId as string,
        userId ? parseInt(userId as string) : undefined
      );
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add item to cart" });
      }
    }
  });

  // Customer Profile Routes
  app.get("/api/customer/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const orders = await storage.getOrders(user.id);
      const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        memberSince: user.createdAt,
        totalOrders: orders.length,
        totalSpent,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer profile" });
    }
  });

  app.put("/api/customer/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, { ...updates, updatedAt: new Date() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/customer/orders/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrders(userId);
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = await storage.getOrder(order.id);
          return orderDetails;
        })
      );
      res.json(ordersWithDetails.filter(Boolean));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.post("/api/customer/reviews", async (req, res) => {
    try {
      const reviewData = req.body;
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get("/api/customer/reviews/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer reviews" });
    }
  });

  // Enhanced Seller Routes  
  app.get("/api/seller/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user || user.role !== 'seller') {
        return res.status(404).json({ message: "Seller not found" });
      }
      
      const products = await storage.getProductsBySeller(user.id);
      const orders = await storage.getOrdersBySeller(user.id);
      const reviews = await storage.getReviews(undefined, user.id);
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
      
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        companyName: user.companyName,
        companyLogo: user.companyLogo,
        isApproved: user.isApproved,
        memberSince: user.createdAt,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        averageRating: averageRating.toFixed(1),
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller profile" });
    }
  });

  app.put("/api/seller/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, { ...updates, updatedAt: new Date() });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update seller profile" });
    }
  });

  app.get("/api/seller/products/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  });

  app.get("/api/seller/orders/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const orders = await storage.getOrdersBySeller(sellerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller orders" });
    }
  });

  app.get("/api/seller/reviews/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const reviews = await storage.getReviews(undefined, sellerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller reviews" });
    }
  });

  app.post("/api/seller/reviews/:reviewId/reply", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const { sellerReply } = req.body;
      const review = await storage.updateReview(reviewId, { sellerReply });
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to reply to review" });
    }
  });

  app.get("/api/seller/analytics/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const products = await storage.getProductsBySeller(sellerId);
      const orders = await storage.getOrdersBySeller(sellerId);
      const reviews = await storage.getReviews(undefined, sellerId);
      
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
      
      // Sales by month (mock data for last 6 months)
      const salesByMonth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: Math.floor(Math.random() * 10000) + 1000,
          orders: Math.floor(Math.random() * 50) + 10
        };
      }).reverse();
      
      res.json({
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        totalProducts: products.length,
        averageOrderValue: averageOrderValue.toFixed(2),
        averageRating: averageRating.toFixed(1),
        totalReviews: reviews.length,
        salesByMonth,
        topProducts: products.slice(0, 5),
        recentOrders: orders.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller analytics" });
    }
  });

  app.get("/api/seller/promotions/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const promotions = await storage.getPromotions(sellerId);
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.post("/api/seller/promotions", async (req, res) => {
    try {
      const promotionData = req.body;
      const promotion = await storage.createPromotion(promotionData);
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create promotion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
