# ElegantCommerce - AI Agent Instructions

## Architecture Overview

**ElegantCommerce** is a full-stack e-commerce platform with **unified backend architecture**:
- **Frontend**: React 18 + TypeScript with Vite, using Wouter routing and TanStack Query
- **Node.js Backend**: Express + Drizzle ORM + PostgreSQL for rapid development
- **C# Backend**: .NET 8 Web API (EliteShopAPI) + Entity Framework Core + SQL Server for enterprise features

## Key Patterns & Conventions

### Project Structure
```
ElegantCommerce/
├── client/src/               # React frontend
│   ├── components/ui/        # shadcn/ui components (DON'T modify directly)  
│   ├── pages/               # Route components
│   ├── hooks/               # Custom React hooks (use-cart.tsx pattern)
│   └── contexts/            # React contexts (auth-context.tsx pattern)
├── server/                  # Node.js Express backend
├── backend/EliteShopAPI/    # .NET Web API backend
├── shared/schema.ts         # Single source of truth for data models
└── migrations/              # Drizzle database migrations
```

### Database Architecture
- **Single Schema Definition**: All models defined in `shared/schema.ts` using Drizzle ORM
- **Unified Backend Support**: Same schema works with both PostgreSQL (Node.js) and SQL Server (.NET)
- **Migration Strategy**: Use `npm run db:push` for schema updates

### Authentication Patterns
- **Node.js**: Session-based with express-session + PostgreSQL store
- **.NET**: JWT Bearer tokens with role-based authorization (`[Authorize(Roles = "Admin")]`)
- **Frontend**: React Context pattern in `auth-context.tsx` with localStorage token persistence

### API Design Patterns
- **Node.js Routes**: Direct Express routes in `server/routes.ts`
- **.NET Controllers**: Separate controllers per domain (AuthController, AdminController, etc.)
- **Error Handling**: Consistent JSON responses with error messages
- **Data Validation**: Zod schemas for Node.js, DTOs for .NET

## Critical Workflows

### Development Server Setup
```bash
# Start all services simultaneously
npm run dev          # Node.js backend + frontend
cd backend/EliteShopAPI && dotnet run  # .NET backend (parallel)
```

### Database Operations
```bash
npm run db:push      # Apply schema changes (Drizzle)
npm run check        # TypeScript compilation check
```

### Frontend State Management
- **Server State**: TanStack Query with custom `queryClient.ts` configuration
- **Cart State**: React Context with localStorage persistence (`use-cart.tsx`)
- **Authentication**: Context pattern with automatic token refresh

### Role-Based Features
- **Customer**: Product browsing, cart, orders, reviews
- **Seller**: Product management, order fulfillment, sales analytics (requires approval)
- **Admin**: User management, seller approval, system-wide analytics

## Component Patterns

### UI Components
- Use **shadcn/ui** components from `components/ui/` (don't modify directly)
- Custom components follow the pattern: `components/[domain]/component-name.tsx`
- Always import React as `import * as React from 'react'`

### Data Fetching
```typescript
// Pattern: Use TanStack Query for server state
const { data: products, isLoading } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => apiRequest('GET', `/api/products?${new URLSearchParams(filters)}`).then(res => res.json())
});
```

### Cart Management
```typescript
// Pattern: Use CartProvider context
const { addToCart, items, getCartTotal } = useCart();
```

## Backend Integration Points

### Node.js Service Layer
- Database operations in `server/storage.ts`
- Route definitions in `server/routes.ts`  
- Session management with PostgreSQL store

### .NET Service Architecture
- Controllers handle HTTP requests
- Services contain business logic (AuthService, ProductService, etc.)
- DTOs for request/response mapping
- Entity Framework for data access

### Cross-Backend Considerations
- Both backends serve the same frontend
- Consistent API contract defined by frontend usage
- Role-based authorization implemented differently but with same effect

## Development Guidelines

### Type Safety
- Shared types in `shared/schema.ts` using Drizzle + Zod
- Frontend uses TypeScript strict mode
- Backend .NET uses nullable reference types

### Styling
- **Tailwind CSS** with `@/` import alias for components
- **shadcn/ui** for base components
- **Framer Motion** for animations
- Responsive-first approach (mobile → desktop)

### Error Handling
- Frontend: Toast notifications using `useToast` hook
- Backend: Consistent error response format with HTTP status codes
- Validation: Zod schemas (Node.js) or Data Annotations (.NET)

### State Management
- **Client State**: React Context for cart, auth
- **Server State**: TanStack Query with optimistic updates
- **Persistence**: localStorage for cart, JWT tokens

### Testing Approach
- API endpoints manually tested with provided demo credentials
- Frontend components tested in isolation
- Database operations validated through migrations

## Critical Integration Points

1. **Authentication Flow**: Frontend → .NET Auth Controller → JWT → Subsequent API calls
2. **Cart Persistence**: Session-based with localStorage fallback  
3. **Image Management**: File uploads to Azure CDN via ImageController
4. **Payment Processing**: Stripe integration for order processing
5. **Role Authorization**: Multi-level access control (Customer/Seller/Admin)

## Debugging Tips

- **Frontend**: React DevTools + TanStack Query DevTools
- **API Logs**: Check terminal output for request/response logging
- **Database**: Use Drizzle Studio or Azure Data Studio
- **Authentication**: Verify JWT tokens in browser DevTools → Application → Local Storage
