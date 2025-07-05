import { users, categories, products, cartItems, type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { category?: string; featured?: boolean; isNew?: boolean; isOnSale?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId?: string, userId?: number): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId?: string, userId?: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
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
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getProducts(filters?: { category?: string; featured?: boolean; isNew?: boolean; isOnSale?: boolean; search?: string }): Promise<Product[]> {
    if (filters) {
      const conditions = [];
      
      if (filters.category) {
        conditions.push(eq(products.category, filters.category));
      }
      if (filters.featured) {
        conditions.push(eq(products.featured, filters.featured));
      }
      if (filters.isNew) {
        conditions.push(eq(products.isNew, filters.isNew));
      }
      if (filters.isOnSale) {
        conditions.push(eq(products.isOnSale, filters.isOnSale));
      }
      if (filters.search) {
        conditions.push(
          or(
            ilike(products.name, `%${filters.search}%`),
            ilike(products.description, `%${filters.search}%`)
          )
        );
      }
      
      if (conditions.length > 0) {
        return await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
      }
    }
    
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.featured, true))
      .limit(limit)
      .orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.categoryId, categoryId))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCartItems(sessionId?: string, userId?: number): Promise<CartItemWithProduct[]> {
    if (userId) {
      const results = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        userId: cartItems.userId,
        sessionId: cartItems.sessionId,
        size: cartItems.size,
        color: cartItems.color,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));
      
      return results.map(row => ({
        id: row.id,
        productId: row.productId,
        quantity: row.quantity,
        userId: row.userId,
        sessionId: row.sessionId,
        size: row.size,
        color: row.color,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        product: row.product
      }));
    } else if (sessionId) {
      const results = await db.select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        userId: cartItems.userId,
        sessionId: cartItems.sessionId,
        size: cartItems.size,
        color: cartItems.color,
        createdAt: cartItems.createdAt,
        updatedAt: cartItems.updatedAt,
        product: products
      }).from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
      
      return results.map(row => ({
        id: row.id,
        productId: row.productId,
        quantity: row.quantity,
        userId: row.userId,
        sessionId: row.sessionId,
        size: row.size,
        color: row.color,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        product: row.product
      }));
    }
    
    return [];
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db
      .insert(cartItems)
      .values(insertCartItem)
      .returning();
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id)) as any;
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId?: string, userId?: number): Promise<boolean> {
    if (userId) {
      await (db.delete(cartItems).where(eq(cartItems.userId, userId)) as any);
      return true;
    } else if (sessionId) {
      await (db.delete(cartItems).where(eq(cartItems.sessionId, sessionId)) as any);
      return true;
    }
    
    return false;
  }
}

export const storage = new DatabaseStorage();
