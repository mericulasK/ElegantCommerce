import { 
  users, categories, products, cartItems, orders, orderItems, reviews, promotions, activityLogs, cmsPages,
  type User, type InsertUser, type LoginUser, type Category, type InsertCategory, type Product, type InsertProduct, 
  type CartItem, type InsertCartItem, type CartItemWithProduct, type Order, type InsertOrder, 
  type OrderItem, type InsertOrderItem, type Review, type InsertReview, type Promotion, type InsertPromotion,
  type ActivityLog, type InsertActivityLog, type CmsPage, type InsertCmsPage,
  type OrderWithItems, type ProductWithReviews, type UserWithStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, desc, count, sum, sql } from "drizzle-orm";

export interface StorageInterface {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersWithStats(role?: string): Promise<UserWithStats[]>;
  approveUser(id: number): Promise<User | undefined>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getProducts(filters?: { category?: string; featured?: boolean; isNew?: boolean; isOnSale?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart
  getCartItems(sessionId?: string, userId?: number): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId?: string, userId?: number): Promise<boolean>;

  // Orders
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getOrdersBySeller(sellerId: number): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Reviews
  getReviews(productId?: number, sellerId?: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: any): Promise<Review>;

  // Promotions
  getPromotions(sellerId?: number): Promise<Promotion[]>;
  createPromotion(promotion: any): Promise<Promotion>;

  // CMS Pages
  getCmsPages(): Promise<CmsPage[]>;
  createCmsPage(page: any): Promise<CmsPage>;
  updateCmsPage(id: number, updates: any): Promise<CmsPage | undefined>;
  deleteCmsPage(id: number): Promise<boolean>;

  // Activity Logs
  getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]>;
  logActivity(activity: any): Promise<ActivityLog>;

  // Auth
  authenticateUser(email: string, password: string): Promise<User | undefined>;
}

export class MemStorage implements StorageInterface {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private promotions: Map<number, Promotion>;
  private activityLogs: Map<number, ActivityLog>;
  private cmsPages: Map<number, CmsPage>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentReviewId: number;
  private currentPromotionId: number;
  private currentActivityLogId: number;
  private currentCmsPageId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.promotions = new Map();
    this.activityLogs = new Map();
    this.cmsPages = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentReviewId = 1;
    this.currentPromotionId = 1;
    this.currentActivityLogId = 1;
    this.currentCmsPageId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Demo Users
    const demoUsers: Omit<User, 'id'>[] = [
      {
        username: "admin",
        email: "admin@elegantcommerce.com",
        password: "Admin123!",
        role: "admin",
        firstName: "System",
        lastName: "Administrator",
        phone: "+90 555 0123",
        profileImage: null,
        address: null,
        isApproved: true,
        companyName: null,
        companyLogo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "seller1",
        email: "seller1@elegantcommerce.com", 
        password: "Seller123!",
        role: "seller",
        firstName: "Elite",
        lastName: "Designer",
        phone: "+90 555 0124",
        profileImage: null,
        address: null,
        isApproved: true,
        companyName: "EliteDesign Store",
        companyLogo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "customer1",
        email: "customer1@elegantcommerce.com",
        password: "Customer123!",
        role: "customer",
        firstName: "Ali",
        lastName: "Yılmaz",
        phone: "+90 555 0125",
        profileImage: null,
        address: null,
        isApproved: false,
        companyName: null,
        companyLogo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "testadmin",
        email: "testadmin@test.com",
        password: "Test123!",
        role: "admin",
        firstName: "Test",
        lastName: "Admin",
        phone: "+90 555 0126",
        profileImage: null,
        address: null,
        isApproved: true,
        companyName: null,
        companyLogo: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add demo users to storage
    demoUsers.forEach(userData => {
      const user: User = {
        id: this.currentUserId++,
        ...userData
      };
      this.users.set(user.id, user);
    });

    // Categories
    const womenCategory: Category = {
      id: this.currentCategoryId++,
      name: "Women's Fashion",
      description: "Elegant & Trendy",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      slug: "womens-fashion"
    };
    this.categories.set(womenCategory.id, womenCategory);

    const menCategory: Category = {
      id: this.currentCategoryId++,
      name: "Men's Fashion",
      description: "Classic & Modern",
      image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      slug: "mens-fashion"
    };
    this.categories.set(menCategory.id, menCategory);

    const accessoriesCategory: Category = {
      id: this.currentCategoryId++,
      name: "Accessories",
      description: "Luxury & Style",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      slug: "accessories"
    };
    this.categories.set(accessoriesCategory.id, accessoriesCategory);

    const electronicsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Elektronik",
      description: "En son teknoloji ürünleri",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      slug: "elektronik"
    };
    this.categories.set(electronicsCategory.id, electronicsCategory);

    const sportsCategory: Category = {
      id: this.currentCategoryId++,
      name: "Spor",
      description: "Spor ve fitness ürünleri",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      slug: "spor"
    };
    this.categories.set(sportsCategory.id, sportsCategory);

    const booksHobbyCategory: Category = {
      id: this.currentCategoryId++,
      name: "Kitap & Hobi",
      description: "Kitaplar ve hobi ürünleri",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      slug: "kitap-hobi"
    };
    this.categories.set(booksHobbyCategory.id, booksHobbyCategory);

    // Products with complete backend compatibility
    const products: Omit<Product, 'id'>[] = [
      {
        name: "Designer Evening Dress",
        description: "Elegant silk dress perfect for special occasions",
        price: "189.00",
        originalPrice: "270.00",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Women's Fashion",
        categoryId: womenCategory.id,
        sellerId: null,
        brand: "EliteDesign",
        color: "Black",
        size: "M",
        material: "Silk",
        weight: null,
        dimensions: null,
        stockQuantity: 25,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: true,
        sale: true,
        discount: 30,
        rating: "4.8",
        reviewCount: 127,
        tags: ["dress", "evening", "silk", "elegant"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Luxury Leather Handbag",
        description: "Premium quality leather with modern design",
        price: "299.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Accessories",
        categoryId: accessoriesCategory.id,
        sellerId: null,
        brand: "LuxuryBrand",
        color: "Brown",
        size: "Medium",
        material: "Genuine Leather",
        weight: "0.8",
        dimensions: "30x20x15 cm",
        stockQuantity: 15,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.9",
        reviewCount: 89,
        tags: ["handbag", "leather", "luxury", "accessories"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Casual Sport Jacket",
        description: "Comfortable and stylish for everyday wear",
        price: "149.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Men's Fashion",
        categoryId: menCategory.id,
        sellerId: null,
        brand: "SportStyle",
        color: "Navy Blue",
        size: "L",
        material: "Cotton Blend",
        weight: null,
        dimensions: null,
        stockQuantity: 30,
        inStock: true,
        featured: true,
        isNew: true,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.6",
        reviewCount: 156,
        tags: ["jacket", "sport", "casual", "men"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Designer Sneakers",
        description: "Premium comfort meets street style",
        price: "179.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Accessories",
        categoryId: accessoriesCategory.id,
        sellerId: null,
        brand: "StreetStyle",
        color: "White",
        size: "42",
        material: "Canvas & Rubber",
        weight: "0.6",
        dimensions: null,
        stockQuantity: 20,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.7",
        reviewCount: 203,
        tags: ["sneakers", "designer", "comfort", "shoes"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Classic White Shirt",
        description: "Timeless elegance for professional settings",
        price: "89.00",
        originalPrice: "120.00",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Women's Fashion",
        categoryId: womenCategory.id,
        sellerId: null,
        brand: "Classic",
        color: "White", 
        size: "M",
        material: "Cotton",
        weight: null,
        dimensions: null,
        stockQuantity: 50,
        inStock: true,
        featured: false,
        isNew: false,
        isOnSale: true,
        sale: true,
        discount: 25,
        rating: "4.5",
        reviewCount: 78,
        tags: ["shirt", "classic", "white", "professional"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Premium Watch",
        description: "Luxury timepiece with Swiss movement",
        price: "599.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Accessories",
        categoryId: accessoriesCategory.id,
        sellerId: null,
        brand: "SwissMade",
        color: "Silver",
        size: null,
        material: "Stainless Steel",
        weight: "0.2",
        dimensions: "40mm diameter",
        stockQuantity: 10,
        inStock: true,
        featured: false,
        isNew: true,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.9",
        reviewCount: 45,
        tags: ["watch", "luxury", "swiss", "timepiece"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Elektronik Ürünleri
      {
        name: "Kablosuz Bluetooth Kulaklık",
        description: "Yüksek ses kalitesi ve noise cancellation teknolojisi",
        price: "299.00",
        originalPrice: "399.00",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Elektronik",
        categoryId: electronicsCategory.id,
        sellerId: null,
        brand: "TechSound",
        color: "Siyah",
        size: null,
        material: "Plastik & Metal",
        weight: "0.3",
        dimensions: null,
        stockQuantity: 45,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: true,
        sale: true,
        discount: 25,
        rating: "4.6",
        reviewCount: 234,
        tags: ["kulaklık", "bluetooth", "teknoloji", "ses"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Akıllı Telefon",
        description: "128GB depolama alanı ve yüksek çözünürlüklü kamera",
        price: "899.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Elektronik",
        categoryId: electronicsCategory.id,
        sellerId: null,
        brand: "SmartTech",
        color: "Mavi",
        size: "6.1 inch",
        material: "Alüminyum & Cam",
        weight: "0.2",
        dimensions: "146.7 x 71.5 x 7.7 mm",
        stockQuantity: 25,
        inStock: true,
        featured: true,
        isNew: true,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.8",
        reviewCount: 456,
        tags: ["telefon", "akıllı", "teknoloji", "kamera"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Spor Ürünleri
      {
        name: "Koşu Ayakkabısı",
        description: "Hafif ve nefes alabilir yapı ile maksimum konfor",
        price: "199.00",
        originalPrice: "249.00",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Spor",
        categoryId: sportsCategory.id,
        sellerId: null,
        brand: "RunMax",
        color: "Beyaz",
        size: "42",
        material: "Sentetik Kumaş",
        weight: "0.4",
        dimensions: null,
        stockQuantity: 60,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: true,
        sale: true,
        discount: 20,
        rating: "4.7",
        reviewCount: 189,
        tags: ["ayakkabı", "koşu", "spor", "fitness"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Yoga Matı",
        description: "Kaymaz taban ve ekstra kalın yapı",
        price: "89.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Spor",
        categoryId: sportsCategory.id,
        sellerId: null,
        brand: "YogaLife",
        color: "Mor",
        size: "180x60 cm",
        material: "TPE",
        weight: "1.2",
        dimensions: "180x60x6 mm",
        stockQuantity: 35,
        inStock: true,
        featured: false,
        isNew: true,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.5",
        reviewCount: 98,
        tags: ["yoga", "mat", "spor", "egzersiz"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Kitap & Hobi Ürünleri
      {
        name: "Kişisel Gelişim Kitabı",
        description: "Hayatınızı değiştirecek pratik öneriler",
        price: "45.00",
        originalPrice: "60.00",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Kitap & Hobi",
        categoryId: booksHobbyCategory.id,
        sellerId: null,
        brand: "YayınEvi",
        color: null,
        size: "14x21 cm",
        material: "Kağıt",
        weight: "0.3",
        dimensions: "14x21x2 cm",
        stockQuantity: 120,
        inStock: true,
        featured: true,
        isNew: false,
        isOnSale: true,
        sale: true,
        discount: 25,
        rating: "4.9",
        reviewCount: 167,
        tags: ["kitap", "kişisel gelişim", "eğitim", "okuma"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Puzzle 1000 Parça",
        description: "Doğa manzaralı eğlenceli puzzle",
        price: "35.00",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
        images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
        category: "Kitap & Hobi",
        categoryId: booksHobbyCategory.id,
        sellerId: null,
        brand: "PuzzleMaster",
        color: "Renkli",
        size: "70x50 cm",
        material: "Karton",
        weight: "0.8",
        dimensions: "27x37x5 cm",
        stockQuantity: 75,
        inStock: true,
        featured: false,
        isNew: true,
        isOnSale: false,
        sale: false,
        discount: null,
        rating: "4.4",
        reviewCount: 89,
        tags: ["puzzle", "oyun", "hobi", "eğlence"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    products.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "customer",
      profileImage: insertUser.profileImage || null,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      isApproved: insertUser.isApproved || false,
      companyName: insertUser.companyName || null,
      companyLogo: insertUser.companyLogo || null,
      createdAt: insertUser.createdAt || new Date(),
      updatedAt: insertUser.updatedAt || new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async authenticateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getUsersWithStats(role?: string): Promise<UserWithStats[]> {
    const users = Array.from(this.users.values());
    const filteredUsers = role ? users.filter(user => user.role === role) : users;
    
    return filteredUsers.map(user => ({
      ...user,
      totalOrders: 0,
      totalSpent: "0.00",
      averageRating: "0.0"
    }));
  }

  async approveUser(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isApproved: true, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      image: insertCategory.image || null,
      description: insertCategory.description || null 
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(filters?: { category?: string; featured?: boolean; isNew?: boolean; isOnSale?: boolean; search?: string }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      if (filters.category) {
        products = products.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.featured !== undefined) {
        products = products.filter(p => p.featured === filters.featured);
      }
      if (filters.isNew !== undefined) {
        products = products.filter(p => p.isNew === filters.isNew);
      }
      if (filters.isOnSale !== undefined) {
        products = products.filter(p => p.isOnSale === filters.isOnSale);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm) ||
          p.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter(p => p.featured)
      .slice(0, limit);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
      image: insertProduct.image || null,
      description: insertProduct.description || null,
      featured: insertProduct.featured || null,
      isNew: insertProduct.isNew || null,
      isOnSale: insertProduct.isOnSale || null,
      originalPrice: insertProduct.originalPrice || null,
      images: insertProduct.images || null,
      categoryId: insertProduct.categoryId || null,
      inStock: insertProduct.inStock || null,
      rating: insertProduct.rating || null,
      reviewCount: insertProduct.reviewCount || null,
      tags: insertProduct.tags || null,
      brand: insertProduct.brand || null,
      color: insertProduct.color || null,
      size: insertProduct.size || null,
      material: insertProduct.material || null,
      weight: insertProduct.weight || null,
      dimensions: insertProduct.dimensions || null,
      sellerId: insertProduct.sellerId || null,
      stockQuantity: insertProduct.stockQuantity || 0,
      sale: insertProduct.sale || false,
      discount: insertProduct.discount || null,
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.sellerId === sellerId);
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart
  async getCartItems(sessionId?: string, userId?: number): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => {
      if (userId) return item.userId === userId;
      if (sessionId) return item.sessionId === sessionId;
      return false;
    });

    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found for cart item ${item.id}`);
      return { ...item, product };
    });
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existingItem = Array.from(this.cartItems.values()).find(item =>
      item.productId === insertCartItem.productId &&
      ((insertCartItem.userId && item.userId === insertCartItem.userId) ||
       (insertCartItem.sessionId && item.sessionId === insertCartItem.sessionId))
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += (insertCartItem.quantity ?? 1);
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { 
      id,
      productId: insertCartItem.productId,
      quantity: insertCartItem.quantity ?? 1,
      userId: insertCartItem.userId ?? null,
      sessionId: insertCartItem.sessionId ?? null,
      size: null,
      color: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId?: string, userId?: number): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.entries()).filter(([, item]) => {
      if (userId) return item.userId === userId;
      if (sessionId) return item.sessionId === sessionId;
      return false;
    });

    itemsToRemove.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Orders
  async getOrders(userId?: number): Promise<Order[]> {
    const orders = Array.from(this.orders.values());
    return userId ? orders.filter(order => order.userId === userId) : orders;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        return { ...item, product };
      })
      .filter(item => item.product) as (OrderItem & { product: Product })[];
    
    return { ...order, items };
  }

  async getOrdersBySeller(sellerId: number): Promise<OrderWithItems[]> {
    const orderItemsBySeller = Array.from(this.orderItems.values()).filter(item => {
      const product = this.products.get(item.productId);
      return product?.sellerId === sellerId;
    });
    
    const orderIds = Array.from(new Set(orderItemsBySeller.map(item => item.orderId)));
    const orders = await Promise.all(orderIds.map(id => this.getOrder(id)));
    return orders.filter(Boolean) as OrderWithItems[];
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.currentOrderId++;
    const newOrder: Order = {
      ...order,
      id: orderId,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || null,
      paymentStatus: order.paymentStatus || "pending",
      notes: order.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(orderId, newOrder);

    items.forEach(item => {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        ...item,
        id: orderItemId,
        orderId,
        status: item.status || "pending",
        color: item.color || null,
        size: item.size || null
      };
      this.orderItems.set(orderItemId, orderItem);
    });

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status: status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
      updatedAt: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderItemStatus(id: number, status: string): Promise<OrderItem | undefined> {
    const orderItem = this.orderItems.get(id);
    if (!orderItem) return undefined;
    
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return undefined;
    
    const updatedOrderItem = { 
      ...orderItem, 
      status: status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
    };
    this.orderItems.set(id, updatedOrderItem);
    return updatedOrderItem;
  }

  // Reviews
  async getReviews(productId?: number, sellerId?: number): Promise<Review[]> {
    const reviews = Array.from(this.reviews.values());
    if (productId) return reviews.filter(review => review.productId === productId);
    if (sellerId) return reviews.filter(review => review.sellerId === sellerId);
    return reviews;
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.userId === userId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview: Review = {
      ...review,
      id,
      isApproved: review.isApproved || null,
      comment: review.comment || null,
      sellerReply: review.sellerReply || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview = { ...review, ...updates, updatedAt: new Date() };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Promotions
  async getPromotions(sellerId?: number): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values());
    return sellerId ? promotions.filter(promotion => promotion.sellerId === sellerId) : promotions;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const newPromotion: Promotion = {
      ...promotion,
      id,
      description: promotion.description || null,
      isActive: promotion.isActive || null,
      applicableProducts: promotion.applicableProducts || null,
      minimumOrderAmount: promotion.minimumOrderAmount || null,
      usageLimit: promotion.usageLimit || null,
      usageCount: 0,
      createdAt: new Date()
    };
    this.promotions.set(id, newPromotion);
    return newPromotion;
  }

  async updatePromotion(id: number, updates: Partial<Promotion>): Promise<Promotion | undefined> {
    const promotion = this.promotions.get(id);
    if (!promotion) return undefined;
    
    const updatedPromotion = { ...promotion, ...updates, updatedAt: new Date() };
    this.promotions.set(id, updatedPromotion);
    return updatedPromotion;
  }

  async deletePromotion(id: number): Promise<boolean> {
    return this.promotions.delete(id);
  }

  // Activity Logs
  async logActivity(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityLogId++;
    const activityLog: ActivityLog = {
      ...log,
      id,
      userId: log.userId || null,
      entityType: log.entityType || null,
      entityId: log.entityId || null,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      createdAt: new Date()
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }

  async getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]> {
    let logs = Array.from(this.activityLogs.values());
    if (userId) logs = logs.filter(log => log.userId === userId);
    logs.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });
    return limit ? logs.slice(0, limit) : logs;
  }

  // CMS Pages
  async getCmsPages(): Promise<CmsPage[]> {
    return Array.from(this.cmsPages.values());
  }

  async getCmsPage(slug: string): Promise<CmsPage | undefined> {
    return Array.from(this.cmsPages.values()).find(page => page.slug === slug);
  }

  async createCmsPage(page: InsertCmsPage): Promise<CmsPage> {
    const id = this.currentCmsPageId++;
    const cmsPage: CmsPage = {
      ...page,
      id,
      metaDescription: page.metaDescription || null,
      metaKeywords: page.metaKeywords || null,
      isPublished: page.isPublished || null,
      createdBy: page.createdBy || null,
      updatedBy: page.updatedBy || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cmsPages.set(id, cmsPage);
    return cmsPage;
  }

  async updateCmsPage(id: number, updates: Partial<CmsPage>): Promise<CmsPage | undefined> {
    const page = this.cmsPages.get(id);
    if (!page) return undefined;
    
    const updatedPage = { ...page, ...updates, updatedAt: new Date() };
    this.cmsPages.set(id, updatedPage);
    return updatedPage;
  }

  async deleteCmsPage(id: number): Promise<boolean> {
    return this.cmsPages.delete(id);
  }
}

// Use MemStorage for demo purposes when database is not available
export const storage = new MemStorage();

