import { db } from "./db";
import { categories, products, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  // Create demo users first
  const demoUsers = [
    {
      username: "admin",
      email: "admin@eliteshop.com",
      password: "Admin123!",
      role: "admin" as const,
      firstName: "System",
      lastName: "Administrator"
    },
    {
      username: "seller1",
      email: "seller1@eliteshop.com", 
      password: "Seller123!",
      role: "seller" as const,
      firstName: "Elite",
      lastName: "Designer",
      companyName: "EliteDesign Store",
      isApproved: true
    },
    {
      username: "seller2", 
      email: "seller2@eliteshop.com",
      password: "Seller456!",
      role: "seller" as const,
      firstName: "Fashion",
      lastName: "World",
      companyName: "Fashion World",
      isApproved: false
    },
    {
      username: "customer1",
      email: "customer1@eliteshop.com",
      password: "Customer123!",
      role: "customer" as const,
      firstName: "Ali",
      lastName: "Yılmaz"
    },
    {
      username: "customer2",
      email: "customer2@eliteshop.com", 
      password: "Customer456!",
      role: "customer" as const,
      firstName: "Ayşe",
      lastName: "Demir"
    },
    {
      username: "vipcustomer",
      email: "vip@eliteshop.com",
      password: "VipCustomer789!",
      role: "customer" as const,
      firstName: "Mehmet",
      lastName: "Kaya"
    },
    {
      username: "testadmin",
      email: "testadmin@test.com",
      password: "Test123!",
      role: "admin" as const,
      firstName: "Test",
      lastName: "Admin"
    },
    {
      username: "testseller",
      email: "testseller@test.com",
      password: "Test123!",
      role: "seller" as const,
      firstName: "Test",
      lastName: "Seller",
      companyName: "Test Company",
      isApproved: true
    },
    {
      username: "testcustomer",
      email: "testcustomer@test.com",
      password: "Test123!",
      role: "customer" as const,
      firstName: "Test",
      lastName: "Customer"
    }
  ];

  const insertedUsers = await db.insert(users).values(demoUsers).returning();
  console.log(`Created ${insertedUsers.length} demo users`);

  // Create categories
  const categoryData = [
    {
      name: "Women's Fashion",
      description: "Stylish clothing and accessories for women",
      slug: "womens-fashion",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=300&fit=crop"
    },
    {
      name: "Men's Fashion", 
      description: "Contemporary men's clothing and accessories",
      slug: "mens-fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop"
    },
    {
      name: "Accessories",
      description: "Fashion accessories for all occasions",
      slug: "accessories", 
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=300&fit=crop"
    },
    {
      name: "Electronics",
      description: "Latest gadgets and electronic devices",
      slug: "electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop"
    },
    {
      name: "Sports & Outdoors",
      description: "Sports equipment and outdoor gear",
      slug: "sports-outdoors",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
    },
    {
      name: "Books & Hobby",
      description: "Books, art supplies, and hobby items",
      slug: "books-hobby",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop"
    }
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`Created ${insertedCategories.length} categories`);

  // Create products for each category
  const productsData = [
    // Women's Fashion
    {
      name: "Designer Evening Dress",
      description: "Elegant black evening dress perfect for special occasions",
      price: "299.99",
      originalPrice: "399.99",
      image: "https://images.unsplash.com/photo-1566479179817-c0b36c8fe4d2?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1566479179817-c0b36c8fe4d2?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop"
      ],
      category: "Women's Fashion",
      categoryId: 1,
      brand: "EliteDesign",
      color: "Black",
      size: "M",
      material: "Silk",
      stockQuantity: 25,
      featured: true,
      isNew: true,
      isOnSale: true,
      sale: true,
      discount: 25,
      rating: "4.8",
      reviewCount: 42,
      tags: ["elegant", "evening", "dress", "silk"]
    },
    {
      name: "Casual Summer Blouse",
      description: "Light and comfortable blouse for everyday wear",
      price: "79.99", 
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=600&fit=crop"
      ],
      category: "Women's Fashion",
      categoryId: 1,
      brand: "CasualChic",
      color: "White", 
      size: "S",
      material: "Cotton",
      stockQuantity: 50,
      featured: true,
      isNew: false,
      rating: "4.5",
      reviewCount: 28,
      tags: ["casual", "summer", "blouse", "cotton"]
    },
    {
      name: "High-Waisted Jeans",
      description: "Trendy high-waisted jeans with perfect fit",
      price: "129.99",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=600&fit=crop"
      ],
      category: "Women's Fashion",
      categoryId: 1,
      brand: "DenimCo",
      color: "Blue",
      size: "L",
      material: "Denim",
      stockQuantity: 35,
      featured: false,
      isNew: true,
      rating: "4.6",
      reviewCount: 33,
      tags: ["jeans", "high-waisted", "denim", "trendy"]
    },

    // Men's Fashion
    {
      name: "Classic Business Suit",
      description: "Professional suit for business and formal events",
      price: "499.99",
      originalPrice: "699.99",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
      ],
      category: "Men's Fashion",
      categoryId: 2,
      brand: "SuitMaster",
      color: "Navy",
      size: "L",
      material: "Wool",
      stockQuantity: 20,
      featured: true,
      isOnSale: true,
      sale: true,
      discount: 30,
      rating: "4.9",
      reviewCount: 56,
      tags: ["suit", "business", "formal", "wool"]
    },
    {
      name: "Casual Cotton Polo",
      description: "Comfortable polo shirt for casual occasions",
      price: "59.99",
      image: "https://images.unsplash.com/photo-1586755919003-6a5b00d5a8f6?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1586755919003-6a5b00d5a8f6?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500&h=600&fit=crop"
      ],
      category: "Men's Fashion",
      categoryId: 2,
      brand: "CasualWear",
      color: "Blue",
      size: "M",
      material: "Cotton",
      stockQuantity: 45,
      featured: false,
      isNew: true,
      rating: "4.3",
      reviewCount: 22,
      tags: ["polo", "casual", "cotton", "comfortable"]
    },
    {
      name: "Leather Dress Shoes",
      description: "Handcrafted leather shoes for formal occasions",
      price: "199.99",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=600&fit=crop"
      ],
      category: "Men's Fashion",
      categoryId: 2,
      brand: "LeatherCraft",
      color: "Brown",
      size: "42",
      material: "Leather",
      stockQuantity: 30,
      featured: true,
      rating: "4.7",
      reviewCount: 38,
      tags: ["shoes", "leather", "formal", "handcrafted"]
    },

    // Accessories
    {
      name: "Luxury Watch",
      description: "Premium stainless steel watch with automatic movement",
      price: "899.99",
      originalPrice: "1199.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500&h=600&fit=crop"
      ],
      category: "Accessories",
      categoryId: 3,
      brand: "TimeMaster",
      color: "Silver",
      material: "Stainless Steel",
      stockQuantity: 15,
      featured: true,
      isOnSale: true,
      sale: true,
      discount: 25,
      rating: "4.9",
      reviewCount: 67,
      tags: ["watch", "luxury", "automatic", "steel"]
    },
    {
      name: "Designer Handbag",
      description: "Elegant leather handbag for sophisticated women",
      price: "349.99",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop"
      ],
      category: "Accessories",
      categoryId: 3,
      brand: "LuxeBags",
      color: "Black",
      material: "Leather",
      stockQuantity: 25,
      featured: true,
      isNew: true,
      rating: "4.6",
      reviewCount: 45,
      tags: ["handbag", "leather", "designer", "elegant"]
    },

    // Electronics
    {
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling wireless headphones",
      price: "249.99",
      originalPrice: "299.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=600&fit=crop"
      ],
      category: "Electronics",
      categoryId: 4,
      brand: "AudioTech",
      color: "Black",
      stockQuantity: 40,
      featured: true,
      isOnSale: true,
      sale: true,
      discount: 17,
      rating: "4.8",
      reviewCount: 89,
      tags: ["headphones", "wireless", "bluetooth", "noise-cancelling"]
    },
    {
      name: "Smartphone Pro Max",
      description: "Latest flagship smartphone with advanced camera",
      price: "1199.99",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=600&fit=crop"
      ],
      category: "Electronics",
      categoryId: 4,
      brand: "TechGiant",
      color: "Space Gray",
      stockQuantity: 18,
      featured: true,
      isNew: true,
      rating: "4.7",
      reviewCount: 124,
      tags: ["smartphone", "flagship", "camera", "premium"]
    },

    // Sports & Outdoors
    {
      name: "Professional Running Shoes",
      description: "High-performance running shoes for athletes",
      price: "159.99",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=600&fit=crop"
      ],
      category: "Sports & Outdoors",
      categoryId: 5,
      brand: "SportMax",
      color: "White",
      size: "42",
      stockQuantity: 55,
      featured: true,
      rating: "4.5",
      reviewCount: 78,
      tags: ["running", "shoes", "athletic", "performance"]
    },
    {
      name: "Camping Backpack",
      description: "Durable hiking backpack for outdoor adventures",
      price: "89.99",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500&h=600&fit=crop"
      ],
      category: "Sports & Outdoors",
      categoryId: 5,
      brand: "OutdoorGear",
      color: "Green",
      material: "Nylon",
      stockQuantity: 32,
      featured: false,
      isNew: true,
      rating: "4.4",
      reviewCount: 29,
      tags: ["backpack", "camping", "hiking", "outdoor"]
    },

    // More Women's Fashion
    {
      name: "Luxury Wool Coat",
      description: "Premium wool coat for cold weather",
      price: "459.99",
      originalPrice: "599.99",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop"
      ],
      category: "Women's Fashion",
      categoryId: 1,
      brand: "LuxeStyle",
      color: "Beige",
      size: "M",
      material: "Wool",
      stockQuantity: 18,
      featured: false,
      isOnSale: true,
      sale: true,
      discount: 23,
      rating: "4.7",
      reviewCount: 41,
      tags: ["coat", "wool", "luxury", "winter"]
    },
    {
      name: "Floral Print Midi Dress",
      description: "Beautiful floral print dress for spring",
      price: "189.99",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop"
      ],
      category: "Women's Fashion",
      categoryId: 1,
      brand: "FloralChic",
      color: "Multi",
      size: "S",
      material: "Cotton",
      stockQuantity: 32,
      featured: false,
      isNew: true,
      rating: "4.4",
      reviewCount: 27,
      tags: ["dress", "floral", "midi", "spring"]
    },

    // More Men's Fashion
    {
      name: "Casual Denim Jacket",
      description: "Classic denim jacket for casual wear",
      price: "149.99",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&h=600&fit=crop"
      ],
      category: "Men's Fashion",
      categoryId: 2,
      brand: "DenimWorks",
      color: "Blue",
      size: "L",
      material: "Denim",
      stockQuantity: 38,
      featured: false,
      rating: "4.2",
      reviewCount: 31,
      tags: ["jacket", "denim", "casual", "classic"]
    },
    {
      name: "Premium Wool Sweater",
      description: "Soft merino wool sweater for comfort",
      price: "179.99",
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=600&fit=crop"
      ],
      category: "Men's Fashion",
      categoryId: 2,
      brand: "WoolCraft",
      color: "Gray",
      size: "M",
      material: "Merino Wool",
      stockQuantity: 26,
      featured: false,
      isNew: true,
      rating: "4.6",
      reviewCount: 19,
      tags: ["sweater", "wool", "merino", "comfort"]
    },

    // More Accessories
    {
      name: "Leather Wallet",
      description: "Handcrafted leather wallet with multiple compartments",
      price: "89.99",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop"
      ],
      category: "Accessories",
      categoryId: 3,
      brand: "LeatherCraft",
      color: "Brown",
      material: "Leather",
      stockQuantity: 45,
      featured: false,
      rating: "4.5",
      reviewCount: 63,
      tags: ["wallet", "leather", "handcrafted", "accessories"]
    },
    {
      name: "Designer Sunglasses",
      description: "UV protection sunglasses with style",
      price: "229.99",
      originalPrice: "299.99",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&h=600&fit=crop"
      ],
      category: "Accessories",
      categoryId: 3,
      brand: "SunStyle",
      color: "Black",
      stockQuantity: 34,
      featured: true,
      isOnSale: true,
      sale: true,
      discount: 23,
      rating: "4.7",
      reviewCount: 52,
      tags: ["sunglasses", "UV", "designer", "style"]
    },

    // More Electronics
    {
      name: "4K Action Camera",
      description: "Waterproof action camera for adventures",
      price: "399.99",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&h=600&fit=crop"
      ],
      category: "Electronics",
      categoryId: 4,
      brand: "ActionPro",
      color: "Black",
      stockQuantity: 22,
      featured: false,
      isNew: true,
      rating: "4.6",
      reviewCount: 87,
      tags: ["camera", "4K", "waterproof", "action"]
    },
    {
      name: "Wireless Charging Pad",
      description: "Fast wireless charging for smartphones",
      price: "49.99",
      image: "https://images.unsplash.com/photo-1585337517129-de6d23b4c1a1?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1585337517129-de6d23b4c1a1?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1609592918461-11f51d4b0f86?w=500&h=600&fit=crop"
      ],
      category: "Electronics",
      categoryId: 4,
      brand: "ChargeTech",
      color: "White",
      stockQuantity: 67,
      featured: false,
      rating: "4.3",
      reviewCount: 234,
      tags: ["wireless", "charging", "fast", "smartphone"]
    },

    // More Sports & Outdoors
    {
      name: "Yoga Mat Pro",
      description: "Non-slip yoga mat for all practices",
      price: "79.99",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&h=600&fit=crop"
      ],
      category: "Sports & Outdoors",
      categoryId: 5,
      brand: "YogaFlow",
      color: "Purple",
      material: "TPE",
      stockQuantity: 48,
      featured: false,
      rating: "4.7",
      reviewCount: 156,
      tags: ["yoga", "mat", "non-slip", "exercise"]
    },
    {
      name: "Water Bottle Steel",
      description: "Insulated steel water bottle 24oz",
      price: "34.99",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop"
      ],
      category: "Sports & Outdoors",
      categoryId: 5,
      brand: "HydroSteel",
      color: "Silver",
      material: "Stainless Steel",
      stockQuantity: 89,
      featured: false,
      rating: "4.8",
      reviewCount: 267,
      tags: ["water", "bottle", "insulated", "steel"]
    },

    // Books & Hobby
    {
      name: "Premium Art Set", 
      description: "Professional art supplies for creative expression",
      price: "149.99",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop"
      ],
      category: "Books & Hobby",
      categoryId: 6,
      brand: "ArtMaster",
      stockQuantity: 28,
      featured: true,
      isNew: true,
      rating: "4.6",
      reviewCount: 34,
      tags: ["art", "supplies", "creative", "professional"]
    },
    {
      name: "Classic Novel Collection",
      description: "Set of timeless literary classics in hardcover",
      price: "79.99",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=600&fit=crop"
      ],
      category: "Books & Hobby",
      categoryId: 6,
      brand: "ClassicBooks",
      material: "Hardcover",
      stockQuantity: 42,
      featured: false,
      rating: "4.8",
      reviewCount: 56,
      tags: ["books", "classics", "literature", "hardcover"]
    },
    {
      name: "Digital Drawing Tablet",
      description: "Professional drawing tablet for digital artists",
      price: "299.99",
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=600&fit=crop"
      ],
      category: "Books & Hobby",
      categoryId: 6,
      brand: "DrawTech",
      color: "Black",
      stockQuantity: 15,
      featured: true,
      isNew: true,
      rating: "4.9",
      reviewCount: 78,
      tags: ["tablet", "drawing", "digital", "art"]
    },
    {
      name: "Cookbook Collection",
      description: "International cuisine cookbook set",
      price: "59.99",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=600&fit=crop",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=600&fit=crop"
      ],
      category: "Books & Hobby",
      categoryId: 6,
      brand: "ChefBooks",
      stockQuantity: 56,
      featured: false,
      rating: "4.5",
      reviewCount: 92,
      tags: ["cookbook", "recipes", "cooking", "international"]
    }
  ];

  // Update categoryId references to match the inserted categories
  const updatedProductsData = productsData.map(product => ({
    ...product,
    categoryId: insertedCategories.find((cat: any) => cat.name === product.category)?.id || 1
  }));

  const insertedProducts = await db.insert(products).values(updatedProductsData).returning();
  console.log(`Created ${insertedProducts.length} products`);

  console.log("Database seeding completed!");
  return { 
    users: insertedUsers,
    categories: insertedCategories, 
    products: insertedProducts 
  };
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}
