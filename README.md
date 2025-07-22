# ElegantCommerce - Modern E-commerce Platform

![ElegantCommerce](https://img.shields.io/badge/ElegantCommerce-E--commerce%20Platform-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Last Updated](https://img.shields.io/badge/Last%20Updated-July%202025-blue)

ElegantCommerce is a modern, full-stack e-commerce platform built with cutting-edge technologies. It features a comprehensive admin dashboard, seller management system, and responsive customer interface with complete shopping cart functionality.

**✅ Current Status**: Fully functional and production-ready with all components working correctly.

## 🌐 Live Demo & Access Links

### 🚀 Application URLs
- **Main Application**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Seller Dashboard**: [http://localhost:3000/seller](http://localhost:3000/seller)
- **About Us**: [http://localhost:3000/about](http://localhost:3000/about)
- **Contact Us**: [http://localhost:3000/contact](http://localhost:3000/contact)
- **API Endpoints**: `http://localhost:3000/api/*`

### 🔐 Demo Access
The application includes comprehensive demo data and functionality:
- **Admin Panel**: Complete user, product, order, and seller management
- **Seller Dashboard**: Product management, order tracking, analytics, and customer reviews
- **Customer Interface**: Product browsing, cart functionality, and checkout process
- **About Us Page**: Company information with mission, vision, values, and team profiles
- **Contact Us Page**: Professional contact form with team directory and department routing

## 🌟 Key Features

### 🎯 Complete Admin Dashboard
- **User Management**: Create, update, delete users with role-based access
- **Product Management**: Full CRUD operations with image upload and categorization
- **Order Management**: Track orders, update statuses, and manage fulfillment
- **Seller Management**: Approve sellers, manage commissions, and monitor performance
- **Analytics Dashboard**: Revenue tracking, user analytics, and business insights
- **System Monitoring**: Activity logs and system health monitoring

### 👨‍💼 Comprehensive Seller Dashboard
- **Product Management**: Add, edit, and manage product inventory
- **Order Processing**: Track and fulfill customer orders
- **Inventory Management**: Stock level monitoring and automated alerts
- **Customer Reviews**: Respond to reviews and manage customer feedback
- **Promotions & Discounts**: Create and manage promotional campaigns
- **Sales Analytics**: Revenue reports, performance metrics, and trend analysis
- **Profile Management**: Business information and seller settings

### 🛒 Customer Experience
- **Modern Product Catalog**: Responsive grid with advanced filtering
- **Shopping Cart**: Add/remove items with real-time price calculation
- **User Authentication**: Secure login/register with form validation
- **Contact Us Page**: Professional contact form with team directory and department routing
- **About Us Page**: Comprehensive company information with mission, vision, and team profiles
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: TanStack Query for API state, React Context for cart

### 🔧 Technical Architecture
- **Frontend**: React 18 + TypeScript with Vite build system
- **Backend**: Dual architecture - Node.js Express + .NET 8 Web API
- **Database**: PostgreSQL with Drizzle ORM / SQL Server with Entity Framework
- **UI Components**: shadcn/ui component library with Radix UI
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight client-side navigation
- **Build System**: Vite with hot reload and optimized production builds

### ⚙️ Backend Features
- **Dual Backend Architecture**:
  - Node.js/Express.js with PostgreSQL (Drizzle ORM)
  - .NET 8 Web API with Entity Framework Core + SQL Server
- **Authentication & Authorization**: JWT-based authentication with role-based access
- **Image Management**: File upload and management system with Azure CDN
- **RESTful API**: Comprehensive API endpoints for all operations
- **Database Integration**: PostgreSQL with Neon Database support
- **Real-time Features**: WebSocket support for live updates
- **Caching**: Redis caching for improved performance
- **Security**: HTTPS, CORS, rate limiting, and input validation
- **Monitoring**: Application insights and error tracking

### 🛍️ E-commerce Functionality
- **Product Catalog**: Advanced product browsing with filtering and search
- **Shopping Cart**: Persistent cart with session management
- **Order Management**: Complete order processing workflow
- **Payment Integration**: Stripe and PayPal payment processing
- **User Management**: Registration, authentication, and profile management
- **Admin Panel**: Administrative features for product and order management
- **Seller Dashboard**: Multi-vendor support with seller management
- **Review System**: Product reviews and ratings with moderation
- **Address Management**: Multiple shipping addresses support
- **Inventory Management**: Real-time stock tracking and alerts
- **Promotion System**: Coupons, discounts, and promotional campaigns
- **Analytics Dashboard**: Sales analytics and reporting tools

## 🛠️ Technology Stack

### 🎨 Frontend Technologies
- **Framework**: React 18.3.1 with TypeScript 5.6.3
- **Build Tool**: Vite 5.4.19 with HMR and optimized builds  
- **Styling**: Tailwind CSS 3.4.17 with shadcn/ui components
- **State Management**: TanStack React Query 5.60.5 for server state
- **Routing**: Wouter 3.3.5 for lightweight client-side routing
- **Animations**: Framer Motion 11.13.1 for smooth transitions
- **Icons**: Lucide React for modern iconography
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### ⚙️ Backend Technologies (Node.js)
- **Runtime**: Node.js 20+ with Express.js 4.21.2
- **Database**: PostgreSQL with Drizzle ORM 0.39.1
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: express-session with PostgreSQL store
- **Validation**: Zod 3.24.2 with drizzle-zod integration
- **Authentication**: Passport.js with local strategy
- **File Upload**: Multer for multipart/form-data handling
- **WebSockets**: ws library for real-time communication
- **Security**: Helmet.js, CORS, rate limiting

### 🏗️ Backend Technologies (.NET)
- **Framework**: .NET 8.0 with ASP.NET Core
- **ORM**: Entity Framework Core 8.0 with SQL Server
- **Authentication**: JWT Bearer authentication with role-based authorization
- **API Documentation**: Swagger/OpenAPI with Swashbuckle
- **Dependency Injection**: Built-in DI container
- **Middleware**: Custom error handling and request logging
- **Security**: Data protection, HTTPS redirection, CORS
- **Background Services**: Hosted services for background tasks

### 🛠️ Development & DevOps Tools
- **Package Managers**: npm/yarn for Node.js, NuGet for .NET
- **Type Checking**: TypeScript with strict mode enabled
- **Code Quality**: ESLint, Prettier for code formatting
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: tsx for TypeScript execution
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Application Insights for performance tracking
- **Testing**: Jest, React Testing Library, xUnit for .NET

## 📁 Project Structure

```
ElegantCommerce/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── admin/     # Admin dashboard components
│   │   │   ├── seller/    # Seller dashboard components
│   │   │   ├── cart/      # Shopping cart components
│   │   │   ├── home/      # Homepage components
│   │   │   ├── layout/    # Layout components
│   │   │   └── ui/        # UI primitives (shadcn/ui)
│   │   ├── pages/         # Route components
│   │   │   ├── about.tsx  # About Us page
│   │   │   ├── contact.tsx # Contact Us page
│   │   │   └── ...        # Other pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── contexts/      # React contexts
├── server/                # Node.js backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Memory storage implementation
│   └── seed.ts           # Database seeding
├── backend/              # .NET Web API
│   └── EliteShopAPI/     # Renamed from TrendifyAPI
│       ├── Controllers/  # API Controllers
│       ├── Services/     # Business logic
│       ├── Models/       # Data models
│       ├── Data/         # Database context
│       └── DTOs/         # Data transfer objects
├── shared/               # Shared types and schemas
│   └── schema.ts         # Type definitions
└── dist/                 # Production build output
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- .NET 8.0 SDK (optional for full-stack development)
- PostgreSQL (for production) or use memory storage (development)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/mericulasK/ElegantCommerce.git
   cd ElegantCommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Node.js backend + React frontend
   npm run dev
   
   # Optional: Start .NET backend in parallel
   cd backend/EliteShopAPI && dotnet run
   ```

4. **Access the application**
   - Main Application: http://localhost:3000
   - About Us: http://localhost:3000/about
   - Contact Us: http://localhost:3000/contact
   - Admin Dashboard: http://localhost:3000/admin  
   - Seller Dashboard: http://localhost:3000/seller
   - .NET API: http://localhost:5236 (if running)

### Available Scripts

```bash
npm run dev          # Start development server (Node.js + React)
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Support**: Full type safety across the stack
- **Built-in Demo Data**: Pre-loaded with sample products, users, and orders
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: shadcn/ui component library integration

## 🔄 API Endpoints

The application provides comprehensive REST API endpoints:

### 🔐 Admin Endpoints
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/sellers` - Seller management
- `PUT /api/admin/sellers/:id/approve` - Approve seller

### 👨‍💼 Seller Endpoints
- `GET /api/seller/stats` - Seller statistics
- `GET /api/seller/products` - Product management
- `POST /api/seller/products` - Add new product
- `PUT /api/seller/products/:id` - Update product
- `GET /api/seller/orders` - Order management
- `PUT /api/seller/orders/:id/status` - Update order status
- `GET /api/seller/reviews` - Customer reviews
- `GET /api/seller/inventory` - Inventory management
- `GET /api/seller/promotions` - Promotions management

### 🛍️ Product & Category Endpoints
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin/Seller)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category

### 🛒 Cart & Order Endpoints
- `GET /api/cart` - Get user's shopping cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get detailed order information
- `PUT /api/orders/:id/status` - Update order status (Admin/Seller)

### 📦 Authentication & User Management
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address

## 📋 Features Completed

### ✅ **Admin Dashboard** (100% Complete)
- ✅ User management with role-based access control
- ✅ Product management with full CRUD operations  
- ✅ Order tracking and status management
- ✅ Seller approval and commission management
- ✅ System analytics and business insights
- ✅ Activity logging and system monitoring

### ✅ **Seller Dashboard** (100% Complete)
- ✅ Product inventory management
- ✅ Order processing and fulfillment
- ✅ Customer review management
- ✅ Promotional campaign tools
- ✅ Sales analytics and reporting
- ✅ Business profile management

### ✅ **Customer Interface** (100% Complete)
- ✅ Responsive product catalog with filtering
- ✅ Shopping cart with session persistence
- ✅ User authentication and profile management
- ✅ Order history and tracking
- ✅ Review and rating system
- ✅ Address management
- ✅ **NEW**: Professional Contact Us page with team directory
- ✅ **NEW**: Comprehensive About Us page with company information

### ✅ **Technical Implementation** (100% Complete)
- ✅ TypeScript implementation with full type safety
- ✅ Modern React 18 with hooks and context
- ✅ TanStack Query for efficient data fetching
- ✅ Responsive design with Tailwind CSS
- ✅ Production-ready build system
- ✅ Dual backend architecture (Node.js + .NET)

## 🧪 Testing & Quality

- **Build Status**: ✅ All builds passing
- **TypeScript**: ✅ Zero compilation errors
- **Code Quality**: ✅ Consistent coding standards
- **Performance**: ✅ Optimized production builds
- **Responsiveness**: ✅ Mobile-first responsive design
- **Accessibility**: ✅ Modern UI patterns with proper semantics

## 🤝 Contributing

We welcome contributions to ElegantCommerce! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Install dependencies (`npm install`)
4. Make your changes with proper TypeScript types
5. Test your changes (`npm run check` and `npm run build`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Standards
- TypeScript strict mode enabled
- ESLint and Prettier for code formatting
- Consistent component patterns
- Comprehensive error handling
- Mobile-first responsive design

## 🏆 Team

ElegantCommerce is developed and maintained by a team of experienced professionals:

### 🚀 Co-Founders & Development Team

#### **Meriç Ulaş Kıray**
- **Position**: Co-Founder & Sales and Marketing Director & Developer
- **Email**: mericulask@gmail.com
- **Phone**: +90 537 478 36 66
- **Expertise**: Sales Strategy, Marketing, Software Development, Business Development
- **Role**: Leads sales and marketing strategies while contributing to software development processes.

#### **Ömer Sadık Uysal**
- **Position**: Co-Founder & CTO & Technology Director & Developer
- **Email**: omersadikuysal09@gmail.com
- **Phone**: +90 552 265 13 37
- **Expertise**: Technology Management, Software Architecture, DevOps, System Design
- **Role**: Oversees technology infrastructure, software development, and technology strategies.

#### **Ali Bulut**
- **Position**: Co-Founder & Marketing Director & Developer
- **Email**: abulut48@hotmail.com
- **Phone**: +90 532 123 45 67
- **Expertise**: Digital Marketing, Brand Strategy, Frontend Development, SEO/SEM
- **Role**: Specializes in marketing strategies, brand management, and frontend development.

#### **Kadir Görkem Uzun**
- **Position**: Co-Founder & Sales Director & Developer
- **Email**: kuzun5675@gmail.com
- **Phone**: +90 555 987 65 43
- **Expertise**: Sales Management, Customer Relations, Backend Development, B2B Sales
- **Role**: Manages sales operations and customer relations while contributing to backend development.

### 📧 Contact Information
- **General Inquiries**: info@elegantcommerce.com
- **Technical Support**: Contact CTO Ömer Sadık Uysal
- **Sales Inquiries**: Contact Sales Directors Meriç Ulaş Kıray or Kadir Görkem Uzun
- **Marketing**: Contact Marketing Director Ali Bulut

## 📞 Support & Links

### Quick Links
- 🌐 **Local Development**: http://localhost:3000
- 📚 **GitHub Repository**: https://github.com/mericulasK/ElegantCommerce
- 🐛 **Report Issues**: https://github.com/mericulasK/ElegantCommerce/issues
- 💬 **Discussions**: https://github.com/mericulasK/ElegantCommerce/discussions

### Recent Updates (July 2025)
- ✨ **NEW**: Professional Contact Us page with team directory and contact form
- ✨ **NEW**: Comprehensive About Us page with company mission, vision, and values
- 🔄 **UPDATED**: Navigation system with About Us and Contact Us links
- 🔄 **UPDATED**: Footer with accurate contact information
- 🏗️ **RENAMED**: Backend API from TrendifyAPI to EliteShopAPI
- 📚 **UPDATED**: Complete documentation with team information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**ElegantCommerce** - Building the future of e-commerce, one component at a time. 🛍️

**🚀 Status: Production Ready** | **📦 Current Version: 1.0.0** | **🗓️ Last Updated: July 23, 2025**

⭐ **[Star on GitHub](https://github.com/mericulasK/ElegantCommerce)** if you find this project useful!
