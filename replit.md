# EliteShop E-commerce Application

## Overview

EliteShop is a modern full-stack e-commerce application built with React, TypeScript, and Express.js. The application features a premium fashion-focused design with a comprehensive product catalog, shopping cart functionality, and a responsive user interface built with Tailwind CSS and shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management, React Context for cart state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions and interactions
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: RESTful API with JSON responses
- **Session Management**: In-memory storage with session-based cart persistence

### Project Structure
```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/          # Backend Express application
├── shared/          # Shared types and schemas
└── migrations/      # Database migrations
```

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation
- **Tables**: Users, Categories, Products, CartItems
- **Migration Strategy**: Schema-driven migrations to `./migrations` directory

### Authentication & Sessions
- Session-based authentication using guest sessions for anonymous users
- Cart persistence tied to session ID stored in localStorage
- User accounts supported through the users table schema

### Product Management
- Hierarchical category system with slug-based routing
- Product filtering by category, featured status, new arrivals, and sales
- Support for product variants, ratings, and inventory tracking
- Image gallery support with multiple product images

### Shopping Cart
- Real-time cart synchronization with backend
- Guest cart persistence using session IDs
- Cart item quantity management and removal
- Automatic cart total calculations including tax and shipping

### UI/UX Design
- Mobile-first responsive design
- Premium fashion-focused visual design
- Dark/light mode support through CSS variables
- Comprehensive component library using Radix UI primitives
- Smooth animations and micro-interactions

## Data Flow

### Product Catalog Flow
1. Categories and products are fetched from PostgreSQL via Drizzle ORM
2. Product filtering and search handled through API query parameters
3. TanStack Query manages caching and background updates
4. Components reactively update based on cached data

### Shopping Cart Flow
1. Cart actions trigger API calls to backend endpoints
2. Backend updates PostgreSQL cart_items table
3. Frontend optimistically updates UI and invalidates cache
4. TanStack Query refetches cart data to maintain consistency

### Navigation Flow
1. Wouter handles client-side routing
2. Route parameters passed to page components
3. Pages fetch required data using TanStack Query
4. Loading states and error handling managed at component level

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with middleware for JSON parsing and CORS
- Drizzle ORM with PostgreSQL driver

### UI/Styling Dependencies
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Framer Motion for animations
- Lucide React for consistent iconography

### Development Dependencies
- TypeScript for type safety
- Vite for development server and build tooling
- ESBuild for server-side bundling

### Database Dependencies
- Neon Database serverless PostgreSQL
- Connect-pg-simple for PostgreSQL session storage
- Drizzle-kit for schema migrations

## Deployment Strategy

### Development Mode
- Vite dev server serves frontend with HMR
- Express server runs with tsx for TypeScript execution
- Database connections use development environment variables

### Production Build
1. Frontend built using `vite build` to `dist/public`
2. Backend compiled using `esbuild` to `dist/index.js`
3. Static files served by Express in production
4. Database migrations applied using `drizzle-kit push`

### Environment Configuration
- `NODE_ENV` controls development vs production behavior
- `DATABASE_URL` required for PostgreSQL connection
- Replit-specific optimizations for deployment platform

### Build Pipeline
```bash
npm run build    # Builds both frontend and backend
npm run start    # Runs production server
npm run dev      # Runs development servers
npm run db:push  # Applies database schema changes
```

## Changelog

Changelog:
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.