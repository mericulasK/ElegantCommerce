# ElegantCommerce API Documentation

## 🌐 Base URLs

### Production
- **Main API**: `https://elegantcommerce.replit.app/api`
- **.NET API**: `https://elite-shop-api.azurewebsites.net/api`
- **Documentation**: `https://elite-shop-api.azurewebsites.net/swagger`

### Development
- **Local API**: `http://localhost:5000/api`
- **.NET API**: `https://localhost:7176/api`

## 🔐 Authentication

### JWT Token Authentication
All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

#### 🔑 Demo Login Examples:

**Admin Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@elegantcommerce.com",
  "password": "Admin123!"
}
```

**Seller Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "seller1@elegantcommerce.com", 
  "password": "Seller123!"
}
```

**Customer Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer1@elegantcommerce.com",
  "password": "Customer123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "Customer"
  }
}
```

## 📦 Products API

### Get All Products
```http
GET /api/products?page=1&limit=12&category=electronics&minPrice=10&maxPrice=1000
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search term
- `sortBy` (optional): Sort by (price, name, rating, date)
- `sortOrder` (optional): asc or desc

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Premium Headphones",
        "description": "High-quality wireless headphones",
        "price": 299.99,
        "originalPrice": 399.99,
        "image": "https://cdn.example.com/headphones.jpg",
        "category": "Electronics",
        "brand": "AudioTech",
        "rating": 4.5,
        "reviewCount": 128,
        "inStock": true,
        "stockQuantity": 50
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 120,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Product by ID
```http
GET /api/products/{id}
```

### Create Product (Admin/Seller)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "categoryId": 1,
  "brand": "BrandName",
  "stockQuantity": 100,
  "images": ["image1.jpg", "image2.jpg"]
}
```

## 🛒 Shopping Cart API

### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "product": {
          "id": 1,
          "name": "Premium Headphones",
          "price": 299.99,
          "image": "headphones.jpg"
        },
        "quantity": 2,
        "size": "M",
        "color": "Black",
        "subtotal": 599.98
      }
    ],
    "totalItems": 2,
    "totalAmount": 599.98
  }
}
```

### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2,
  "size": "M",
  "color": "Black"
}
```

### Update Cart Item
```http
PUT /api/cart/items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove Cart Item
```http
DELETE /api/cart/items/{itemId}
Authorization: Bearer <token>
```

## 📋 Orders API

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": 1,
  "paymentMethod": "stripe",
  "couponCode": "SAVE10"
}
```

### Get User Orders
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### Get Order Details
```http
GET /api/orders/{orderId}
Authorization: Bearer <token>
```

## ⭐ Reviews API

### Get Product Reviews
```http
GET /api/products/{productId}/reviews?page=1&limit=10
```

### Add Review
```http
POST /api/products/{productId}/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product!",
  "title": "Great quality"
}
```

## 👨‍💼 Admin API

### Get Dashboard Data
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalOrders": 3420,
    "totalRevenue": 125000.50,
    "totalProducts": 450,
    "recentOrders": [...],
    "topProducts": [...],
    "salesChart": [...]
  }
}
```

### Get All Users
```http
GET /api/admin/users?page=1&limit=20&role=customer
Authorization: Bearer <admin-token>
```

## 📊 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate resource)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

## 🔄 Rate Limiting

### Limits
- **General API**: 1000 requests per hour per IP
- **Authentication**: 10 requests per minute per IP
- **Admin API**: 5000 requests per hour per token

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600
```

## 📝 Request/Response Examples

### Pagination
All list endpoints support pagination:
```http
GET /api/products?page=2&limit=20
```

### Filtering
```http
GET /api/products?category=electronics&minPrice=100&maxPrice=500&inStock=true
```

### Sorting
```http
GET /api/products?sortBy=price&sortOrder=desc
```

### Search
```http
GET /api/products?search=wireless%20headphones
```

---

## 🛠️ SDK and Tools

### JavaScript/TypeScript SDK
```javascript
import { ElegantCommerceAPI } from '@elegantcommerce/sdk';

const api = new ElegantCommerceAPI({
  baseURL: 'https://elegantcommerce.replit.app/api',
  apiKey: 'your-api-key'
});

// Get products
const products = await api.products.getAll({
  page: 1,
  limit: 12,
  category: 'electronics'
});
```

### Postman Collection
Import our Postman collection for easy API testing:
- [Download Collection](https://github.com/mericulasK/ElegantCommerce/blob/main/postman-collection.json)

---

## 📞 Support

For API support and questions:
- 📚 [Full Documentation](https://elite-shop-api.azurewebsites.net/swagger)
- 🐛 [Report Issues](https://github.com/mericulasK/ElegantCommerce/issues)
- 💬 [API Discussions](https://github.com/mericulasK/ElegantCommerce/discussions)

---

**ElegantCommerce API** - Powering modern e-commerce experiences. 🚀
