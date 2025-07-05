import { users, categories, products, cartItems, type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";

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

export const storage = new MemStorage();
