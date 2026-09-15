# Online Business - E-Commerce Platform

A full-stack e-commerce platform with a customer-facing storefront, admin portal, and REST API backend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ONLINE BUSINESS                              │
├──────────────────────┬──────────────────────┬──────────────────────┤
│      CLIENT          │       ADMIN          │       SERVER         │
│  (Storefront)        │    (Admin Portal)    │     (Backend API)    │
├──────────────────────┼──────────────────────┼──────────────────────┤
│ Next.js 14+          │ React 18+            │ Node.js              │
│ React 18+            │ TypeScript           │ Express.js           │
│ TypeScript           │ Vite                 │ TypeScript           │
│ Material UI          │ Ant Design           │ MongoDB              │
│ TanStack React Query │ Redux Toolkit        │ Mongoose             │
│ SSR/SSG/ISR          │ React Router         │ JWT Auth             │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

## Project Structure

```
onlineBusiness/
├── client/                 # Customer-facing storefront (Next.js)
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-based modules
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   ├── providers/     # React context providers
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   └── theme/         # Material UI theme
│   ├── public/            # Static assets
│   └── package.json
│
├── admin/                  # Admin/CMS portal (Vite + React)
│   ├── src/
│   │   ├── app/           # Application setup
│   │   ├── components/    # Shared components
│   │   ├── features/      # Feature modules
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   ├── public/
│   └── package.json
│
└── server/                 # Backend API (Express + TypeScript)
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── constants/     # Application constants
    │   ├── database/      # MongoDB connection
    │   ├── middlewares/   # Express middlewares
    │   ├── modules/       # Feature modules
    │   │   ├── auth/      # Authentication
    │   │   ├── users/     # User management
    │   │   ├── products/  # Product catalog
    │   │   ├── categories/
    │   │   ├── brands/
    │   │   ├── inventory/
    │   │   ├── cart/
    │   │   ├── wishlist/
    │   │   ├── addresses/
    │   │   ├── coupons/
    │   │   ├── orders/
    │   │   ├── payments/
    │   │   ├── shipping/
    │   │   ├── reviews/
    │   │   ├── notifications/
    │   │   ├── media/
    │   │   ├── dashboard/
    │   │   └── admin/
    │   ├── routes/        # Route definitions
    │   ├── app.ts         # Express app setup
    │   └── server.ts      # Server entry point
    └── package.json
```

## Features

### Customer Storefront (Client)
- **Product Discovery**: Browse, search, filter, and sort products
- **Product Details**: Image gallery, variants, specifications, reviews
- **Shopping Cart**: Add/remove items, quantity management, coupons
- **Checkout**: Multi-step flow with address, shipping, payment
- **Authentication**: Register, login, password reset, email verification
- **Account Management**: Profile, orders, addresses, wishlist, reviews
- **SEO Optimized**: SSR/SSG/ISR, structured data, sitemap, robots.txt
- **Responsive Design**: Mobile-first with Material UI

### Admin Portal (Admin)
- **Dashboard**: KPIs, charts, recent orders, low stock alerts
- **Product Management**: CRUD, variants, images, SEO, publishing
- **Category Management**: Hierarchical categories with tree view
- **Brand Management**: Brands with logos and status
- **Inventory Management**: Stock tracking, adjustments, history
- **Order Management**: View, status updates, shipping, refunds
- **Customer Management**: View, search, activate/deactivate
- **Coupon Management**: Create, edit, validate, usage tracking
- **Review Moderation**: Approve/reject/delete reviews
- **Reports**: Sales, products, customers with date filters
- **Media Management**: Upload, preview, delete images
- **Role-Based Access**: Super Admin, Admin, Manager, Staff
- **Audit Logs**: Track administrative actions

### Backend API (Server)
- **Authentication**: JWT with refresh tokens, RBAC
- **Product Catalog**: Products, variants, categories, brands
- **Inventory**: Stock tracking, reservations, adjustments
- **Shopping**: Cart, wishlist, addresses, coupons
- **Checkout**: Validation, pricing, tax, shipping, order creation
- **Payments**: Provider-agnostic (Stripe, PayPal, COD), webhooks
- **Orders**: Full lifecycle, status tracking, snapshots
- **Reviews**: Ratings, verified purchases, moderation
- **Notifications**: Email, in-app, SMS
- **Media**: Upload, metadata, cloud storage support
- **Dashboard/Reports**: Aggregated analytics
- **Audit Logging**: Administrative action tracking
- **Security**: Helmet, CORS, rate limiting, validation

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend (Client)** | Next.js, React, TypeScript, Material UI, TanStack React Query, React Hook Form, Zod |
| **Frontend (Admin)** | React, TypeScript, Vite, Ant Design, Redux Toolkit, TanStack React Query, React Router |
| **Backend** | Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, Zod/Joi |
| **Database** | MongoDB |
| **Auth** | JWT, Refresh Tokens, bcrypt/Argon2 |
| **API Docs** | OpenAPI/Swagger |
| **Testing** | Vitest, Jest, React Testing Library, Supertest, MSW |
| **Code Quality** | ESLint, Prettier, Husky, lint-staged |
| **Logging** | Pino/Winston |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd onlineBusiness
```

2. **Install dependencies for all projects**
```bash
# Client
cd client && npm install

# Admin
cd ../admin && npm install

# Server
cd ../server && npm install
```

3. **Configure environment variables**

Create `.env` files in each project:

**server/.env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onlinebusiness
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**client/.env.local**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Online Business
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**admin/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Online Business Admin
VITE_APP_ENV=development
```

4. **Start development servers**

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Client Storefront
cd client && npm run dev

# Terminal 3 - Admin Portal
cd admin && npm run dev
```

5. **Access the applications**
- Storefront: http://localhost:3000
- Admin Portal: http://localhost:5173
- API: http://localhost:5000/api/v1
- API Docs: http://localhost:5000/api/docs

## Available Scripts

### Client (Next.js)
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

### Admin (Vite + React)
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Unit tests
```

### Server (Express + TypeScript)
```bash
npm run dev          # Development with hot reload
npm run build        # Compile TypeScript
npm run start        # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Unit/Integration tests
npm run test:watch   # Watch mode
```

## API Documentation

API documentation is available via Swagger UI at `/api/docs` when running the server in development mode.

### Key Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` |
| **Products** | `GET /products`, `GET /products/:slug`, `POST /admin/products` |
| **Categories** | `GET /categories`, `GET /categories/:slug` |
| **Cart** | `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id` |
| **Orders** | `GET /orders`, `POST /orders`, `GET /orders/:id` |
| **Payments** | `POST /payments/create`, `POST /payments/verify` |
| **Admin Dashboard** | `GET /admin/dashboard/summary` |

## Deployment

### Docker (Recommended)
```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d
```

### Manual Deployment
1. Build each project: `npm run build`
2. Set production environment variables
3. Run database migrations if needed
4. Start servers with process manager (PM2, systemd)
5. Configure reverse proxy (Nginx)
6. Set up SSL certificates

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Feature-based architecture
- Separation of client/server state (React Query for server, Redux/Zustand for client)

### Git Workflow
- Feature branches from `main`
- Pull requests with CI checks
- Conventional commits
- Protected branches

### Testing
- Unit tests for utilities and business logic
- Component tests for UI
- Integration tests for API endpoints
- E2E tests for critical user journeys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint, typecheck, and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.