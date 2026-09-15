# E-Commerce Backend Requirements

## 1. Project Overview

Build a scalable e-commerce backend using **Node.js, TypeScript, Express.js, and MongoDB**.

The backend will provide REST APIs for:

- Customer authentication and authorization
- Product management
- Product categories and brands
- Product variants
- Inventory management
- Shopping cart
- Wishlist
- Checkout
- Orders
- Payments
- Shipping
- Customer addresses
- Coupons and discounts
- Product reviews and ratings
- Notifications
- Admin/CMS management
- Dashboard and reporting
- File/media management
- Audit logging

The backend should be designed using a modular architecture that allows new features to be added without significantly changing existing modules.

---

# 2. Technology Stack

## Core

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- Refresh tokens
- bcrypt/Argon2 for password hashing
- Role-based access control

## Validation

- Zod / Joi / class-validator

## API Documentation

- OpenAPI / Swagger

## Testing

- Jest
- Supertest

## Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

## Logging

- Pino / Winston

## Security

- Helmet
- CORS
- Rate limiting
- Request validation
- MongoDB query sanitization

## Optional Infrastructure

- Redis
- BullMQ
- Cloudinary / S3-compatible storage
- Docker

---

# 3. Architecture

The backend should follow a modular layered architecture.

Recommended structure:

```text
backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── database/
│   ├── middlewares/
│   ├── utils/
│   ├── types/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
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
│   │
│   ├── routes/
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

Each module should preferably contain:

```text
products/
├── product.controller.ts
├── product.service.ts
├── product.repository.ts
├── product.model.ts
├── product.routes.ts
├── product.validation.ts
├── product.types.ts
└── product.mapper.ts
```

---

# 4. User Roles

The system must support role-based access control.

## Customer

Customers can:

- Register
- Login
- Logout
- Manage profile
- Manage addresses
- Browse products
- Search products
- Add products to cart
- Manage wishlist
- Place orders
- Make payments
- View order history
- Track orders
- Write reviews
- Manage notifications

## Admin

Admins can:

- Manage customers
- Manage products
- Manage categories
- Manage brands
- Manage inventory
- Manage orders
- Manage coupons
- Manage reviews
- Manage shipping
- View dashboard
- View sales reports
- Manage CMS content
- Manage media
- Manage system settings

## Super Admin

Super admins can additionally:

- Create/update/delete admins
- Manage roles and permissions
- Configure system settings
- View audit logs
- Access all administrative features

---

# 5. Authentication Module

## Registration

Customers should be able to register using:

- First name
- Last name
- Email
- Phone number
- Password

Requirements:

- Email must be unique
- Password must be securely hashed
- Validate all inputs
- Return access token and refresh token after successful registration

## Login

Login using:

- Email
- Password

Response:

```json
{
  "user": {},
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Logout

Invalidate the refresh token/session.

## Refresh Token

Provide an endpoint to generate a new access token.

## Forgot Password

Flow:

```text
Request password reset
        ↓
Generate secure reset token
        ↓
Send email
        ↓
User opens reset link
        ↓
Validate token
        ↓
Set new password
```

## Email Verification

Support email verification using a time-limited verification token.

---

# 6. User Module

User model should contain:

```text
User
├── _id
├── firstName
├── lastName
├── email
├── phone
├── password
├── role
├── status
├── avatar
├── emailVerified
├── lastLoginAt
├── createdAt
└── updatedAt
```

Possible status values:

```text
ACTIVE
INACTIVE
BLOCKED
PENDING
```

APIs:

```http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/password
DELETE /api/v1/users/me
```

Admin APIs:

```http
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
```

---

# 7. Product Module

Products are the core entity of the application.

Product should support:

- Name
- Slug
- SKU
- Description
- Short description
- Category
- Brand
- Images
- Price
- Discount price
- Tax
- Stock
- Product variants
- Attributes
- Tags
- Status
- Featured flag
- SEO metadata

Example:

```text
Product
├── _id
├── name
├── slug
├── sku
├── description
├── shortDescription
├── categoryId
├── brandId
├── images[]
├── price
├── compareAtPrice
├── tax
├── variants[]
├── attributes[]
├── tags[]
├── status
├── featured
├── seo
├── createdAt
└── updatedAt
```

Product status:

```text
DRAFT
ACTIVE
INACTIVE
ARCHIVED
```

---

# 8. Product Variants

Products should support variants such as:

- Size
- Color
- Storage
- Material
- Weight

Example:

```json
{
  "name": "Red / Large",
  "sku": "TSHIRT-RED-L",
  "price": 25,
  "stock": 20,
  "attributes": {
    "color": "Red",
    "size": "L"
  }
}
```

Each variant should have its own:

- SKU
- Price
- Stock
- Images
- Attributes

---

# 9. Category Module

Categories should support hierarchical structures.

Example:

```text
Electronics
├── Mobile Phones
├── Laptops
└── Accessories
    ├── Chargers
    └── Cables
```

Category fields:

```text
_id
name
slug
description
parentId
image
status
sortOrder
seo
createdAt
updatedAt
```

APIs:

```http
GET    /api/v1/categories
GET    /api/v1/categories/:slug
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

---

# 10. Brand Module

Brand fields:

```text
_id
name
slug
description
logo
status
seo
createdAt
updatedAt
```

APIs:

```http
GET    /api/v1/brands
GET    /api/v1/brands/:slug
POST   /api/v1/admin/brands
PATCH  /api/v1/admin/brands/:id
DELETE /api/v1/admin/brands/:id
```

---

# 11. Product Search

Product APIs must support:

- Keyword search
- Category filtering
- Brand filtering
- Price filtering
- Rating filtering
- Availability filtering
- Attributes filtering
- Sorting
- Pagination

Example:

```http
GET /api/v1/products?search=iphone&category=mobile&minPrice=500&maxPrice=1500&sort=price_asc&page=1&limit=20
```

Supported sorting:

```text
price_asc
price_desc
newest
oldest
rating
popular
```

MongoDB indexes should be created for frequently queried fields.

---

# 12. Inventory Module

Inventory must be tracked separately from product information.

Inventory should support:

- Current stock
- Reserved stock
- Available stock
- Low-stock threshold
- Stock adjustments
- Stock history

Example:

```text
Inventory
├── productId
├── variantId
├── quantity
├── reservedQuantity
├── lowStockThreshold
├── createdAt
└── updatedAt
```

Available stock:

```text
availableStock = quantity - reservedQuantity
```

Stock changes must be recorded.

---

# 13. Cart Module

Customers should be able to:

- Add products
- Remove products
- Increase quantity
- Decrease quantity
- Update quantity
- Clear cart

Cart:

```text
Cart
├── _id
├── userId
├── items[]
│   ├── productId
│   ├── variantId
│   ├── quantity
│   ├── price
│   └── subtotal
├── subtotal
├── discount
├── tax
├── shipping
├── total
├── couponCode
├── createdAt
└── updatedAt
```

Important:

The backend must always calculate prices.

The client must never be trusted to provide the final price.

---

# 14. Wishlist Module

Customers can:

- Add product to wishlist
- Remove product
- View wishlist
- Check whether a product is already in wishlist

Endpoints:

```http
GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId
```

---

# 15. Address Module

Customers can manage:

- Billing addresses
- Shipping addresses

Address:

```text
Address
├── _id
├── userId
├── fullName
├── phone
├── addressLine1
├── addressLine2
├── city
├── state
├── country
├── postalCode
├── isDefault
├── type
├── createdAt
└── updatedAt
```

Types:

```text
SHIPPING
BILLING
```

---

# 16. Coupon Module

Admin should be able to create discount coupons.

Coupon fields:

```text
code
description
discountType
discountValue
minimumOrderAmount
maximumDiscount
usageLimit
usagePerUser
startDate
endDate
status
```

Discount types:

```text
PERCENTAGE
FIXED_AMOUNT
```

The backend must validate:

- Coupon exists
- Coupon is active
- Coupon has not expired
- Minimum order amount
- Usage limit
- User usage limit

---

# 17. Checkout Module

Checkout should validate:

1. User authentication
2. Cart availability
3. Product availability
4. Product price
5. Product status
6. Inventory
7. Coupon
8. Shipping address
9. Tax
10. Shipping fee
11. Final total

Flow:

```text
Cart
 ↓
Validate products
 ↓
Validate inventory
 ↓
Calculate prices
 ↓
Apply coupon
 ↓
Calculate tax
 ↓
Calculate shipping
 ↓
Create order
 ↓
Process payment
 ↓
Confirm order
 ↓
Reserve/deduct inventory
```

---

# 18. Order Module

Order model:

```text
Order
├── _id
├── orderNumber
├── userId
├── items[]
├── shippingAddress
├── billingAddress
├── subtotal
├── discount
├── tax
├── shippingFee
├── total
├── coupon
├── paymentStatus
├── orderStatus
├── shippingStatus
├── paymentMethod
├── notes
├── createdAt
└── updatedAt
```

Order statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

Customers:

```http
GET /api/v1/orders
GET /api/v1/orders/:id
POST /api/v1/orders
POST /api/v1/orders/:id/cancel
```

Admins:

```http
GET   /api/v1/admin/orders
GET   /api/v1/admin/orders/:id
PATCH /api/v1/admin/orders/:id/status
```

---

# 19. Payment Module

The payment module should be provider-independent.

Create a payment abstraction:

```text
PaymentProvider
├── createPayment()
├── verifyPayment()
├── refundPayment()
└── getPaymentStatus()
```

Possible providers:

- Stripe
- PayPal
- Local payment gateway
- Cash on Delivery

Payment model:

```text
Payment
├── _id
├── orderId
├── userId
├── provider
├── transactionId
├── amount
├── currency
├── status
├── paidAt
├── metadata
├── createdAt
└── updatedAt
```

Payment statuses:

```text
PENDING
PROCESSING
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

Payment webhooks must be implemented securely.

---

# 20. Shipping Module

Shipping should support:

- Shipping methods
- Shipping fee calculation
- Delivery zones
- Tracking number
- Shipment status

Example:

```text
ShippingMethod
├── name
├── description
├── price
├── estimatedDays
├── status
└── zones[]
```

Shipping statuses:

```text
PENDING
PROCESSING
SHIPPED
IN_TRANSIT
OUT_FOR_DELIVERY
DELIVERED
FAILED
RETURNED
```

---

# 21. Reviews and Ratings

Customers can review purchased products.

Review:

```text
Review
├── _id
├── productId
├── userId
├── orderId
├── rating
├── title
├── comment
├── images[]
├── status
├── createdAt
└── updatedAt
```

Rating:

```text
1 - 5
```

Only customers who purchased the product should be allowed to create a verified review.

Admin can:

- Approve
- Reject
- Delete
- Moderate reviews

---

# 22. Media Module

The backend should support product and category images.

Media operations:

- Upload
- Delete
- Replace
- Get metadata

Recommended storage:

```text
Development:
Local storage

Production:
AWS S3 / Cloudinary / equivalent object storage
```

The database should store metadata rather than large binary files.

---

# 23. Notification Module

Notifications should support:

- Email
- In-app notifications
- Optional SMS

Events:

```text
Account created
Email verified
Password changed
Order created
Payment successful
Payment failed
Order shipped
Order delivered
Order cancelled
Refund processed
```

Notification model:

```text
Notification
├── _id
├── userId
├── type
├── title
├── message
├── data
├── read
├── createdAt
└── updatedAt
```

---

# 24. Admin Dashboard

Dashboard APIs should provide:

- Total sales
- Total orders
- Total customers
- Total products
- Pending orders
- Completed orders
- Cancelled orders
- Revenue
- Average order value
- Best-selling products
- Best-performing categories
- Recent orders
- Low-stock products

Example:

```http
GET /api/v1/admin/dashboard/summary
GET /api/v1/admin/dashboard/sales
GET /api/v1/admin/dashboard/orders
GET /api/v1/admin/dashboard/products
GET /api/v1/admin/dashboard/customers
```

Dashboard queries should be optimized using MongoDB aggregation pipelines.

---

# 25. Product Reporting

Admin should be able to retrieve:

- Best-selling products
- Products by revenue
- Products by quantity sold
- Low-stock products
- Out-of-stock products
- Product views
- Product conversion metrics

---

# 26. Order Reporting

Reports should support:

- Daily sales
- Weekly sales
- Monthly sales
- Yearly sales
- Revenue by category
- Revenue by product
- Revenue by payment method
- Cancelled orders
- Refunded orders

Example:

```http
GET /api/v1/admin/reports/sales?from=2026-01-01&to=2026-12-31
```

---

# 27. Audit Logs

Administrative actions should be logged.

Audit log:

```text
AuditLog
├── _id
├── userId
├── action
├── resource
├── resourceId
├── oldValue
├── newValue
├── ipAddress
├── userAgent
└── createdAt
```

Examples:

```text
PRODUCT_CREATED
PRODUCT_UPDATED
PRODUCT_DELETED
ORDER_STATUS_UPDATED
USER_BLOCKED
COUPON_CREATED
ADMIN_CREATED
```

---

# 28. API Design

All APIs should use versioning.

Base URL:

```text
/api/v1
```

Example:

```text
/api/v1/products
/api/v1/categories
/api/v1/orders
/api/v1/users
```

HTTP methods:

```text
GET
POST
PUT
PATCH
DELETE
```

Use RESTful naming conventions.

---

# 29. Standard API Response

Successful response:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Product not found",
  "error": {
    "code": "PRODUCT_NOT_FOUND"
  }
}
```

---

# 30. Error Handling

Implement centralized error handling.

Error categories:

```text
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
DatabaseError
PaymentError
ExternalServiceError
InternalServerError
```

Never expose:

- Database credentials
- Stack traces
- Internal implementation details
- Sensitive user information

in production responses.

---

# 31. Validation

Every incoming request must be validated.

Validate:

- Body
- Query parameters
- Route parameters
- Headers where required

Example:

```text
POST /products

Validate:
- name
- price
- categoryId
- SKU
- stock
```

Invalid requests should return:

```http
400 Bad Request
```

with useful validation messages.

---

# 32. Authentication Middleware

Protected routes should use authentication middleware.

Example:

```text
Request
   ↓
JWT Middleware
   ↓
Validate Token
   ↓
Load User
   ↓
Attach User To Request
   ↓
Controller
```

---

# 33. Authorization Middleware

Implement permission-based authorization.

Example:

```text
requireRole("ADMIN")
requireRole("SUPER_ADMIN")
requirePermission("PRODUCT_UPDATE")
```

Permissions can include:

```text
PRODUCT_CREATE
PRODUCT_READ
PRODUCT_UPDATE
PRODUCT_DELETE

ORDER_READ
ORDER_UPDATE

USER_READ
USER_UPDATE
USER_DELETE

COUPON_CREATE
COUPON_UPDATE
COUPON_DELETE
```

---

# 34. MongoDB Requirements

Use MongoDB with Mongoose.

Requirements:

- Schema validation
- Proper indexes
- References where appropriate
- Aggregation pipelines for reports
- Transactions for critical operations
- Pagination
- Lean queries where appropriate

Important indexes:

```text
User.email
Product.slug
Product.sku
Product.categoryId
Product.brandId
Product.status
Order.orderNumber
Order.userId
Review.productId
Coupon.code
```

---

# 35. MongoDB Transactions

Transactions should be used for operations where multiple documents must remain consistent.

Examples:

### Order creation

```text
Create order
 ↓
Reserve inventory
 ↓
Create payment
 ↓
Commit transaction
```

If any step fails:

```text
Rollback transaction
```

### Order cancellation

```text
Update order
 ↓
Restore inventory
 ↓
Create refund record
 ↓
Commit
```

---

# 36. Pagination

All large collections must support pagination.

Example:

```http
GET /api/v1/products?page=1&limit=20
```

Response:

```json
{
  "page": 1,
  "limit": 20,
  "total": 250,
  "totalPages": 13
}
```

Maximum limit should be restricted to prevent excessive database queries.

---

# 37. Security Requirements

The backend must implement:

- JWT authentication
- Password hashing
- Helmet
- CORS
- Rate limiting
- Input validation
- Request size limits
- MongoDB injection protection
- Secure HTTP headers
- Secure cookies where applicable
- Refresh token rotation
- Account lock/rate limiting for repeated login failures
- Environment variable protection

Never commit:

```text
.env
database credentials
JWT secrets
API keys
payment secrets
cloud storage credentials
```

---

# 38. Environment Configuration

Use environment variables.

Example:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

CORS_ORIGIN=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Provide:

```text
.env.example
```

without real credentials.

---

# 39. Logging

Implement structured application logging.

Log:

- HTTP requests
- Errors
- Authentication events
- Payment events
- Order events
- Admin actions
- External API failures

Do not log:

- Passwords
- Access tokens
- Refresh tokens
- Payment credentials
- Sensitive personal information

---

# 40. API Documentation

Generate OpenAPI/Swagger documentation.

Documentation should include:

- Authentication
- Endpoints
- Request parameters
- Request body
- Response schemas
- Error responses
- Authentication requirements

Swagger should be available in development at:

```text
/api/docs
```

---

# 41. Testing Requirements

Testing should cover:

## Unit Tests

Test:

- Services
- Utilities
- Validation
- Business rules
- Price calculations
- Coupon calculations

## Integration Tests

Test:

- Authentication
- Product APIs
- Cart
- Checkout
- Orders
- Payments
- Inventory

## API Tests

Use:

```text
Jest + Supertest
```

Critical business logic should have high test coverage.

---

# 42. Performance Requirements

The backend should be optimized for:

- Database indexes
- Pagination
- Efficient queries
- Lean MongoDB queries
- Aggregation pipelines
- Caching
- Connection pooling
- Async processing

Redis can be introduced for:

```text
Product caching
Session/token management
Rate limiting
Frequently accessed categories
Background jobs
```

---

# 43. Background Jobs

Use a queue system such as BullMQ when required.

Background jobs:

```text
Send email
Send notifications
Process images
Generate reports
Update product statistics
Process payment events
Process order events
Clean expired sessions
```

Example:

```text
Order created
      ↓
Queue job
      ↓
Email service
      ↓
Send confirmation email
```

---

# 44. Health Check

Implement:

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Optional:

```http
GET /health/live
GET /health/ready
```

---

# 45. API Endpoint Summary

## Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
```

## Users

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me
PATCH /api/v1/users/me/password
```

## Products

```text
GET    /api/v1/products
GET    /api/v1/products/:id
GET    /api/v1/products/slug/:slug
POST   /api/v1/admin/products
PATCH  /api/v1/admin/products/:id
DELETE /api/v1/admin/products/:id
```

## Categories

```text
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

## Brands

```text
GET    /api/v1/brands
GET    /api/v1/brands/:id
POST   /api/v1/admin/brands
PATCH  /api/v1/admin/brands/:id
DELETE /api/v1/admin/brands/:id
```

## Cart

```text
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:itemId
DELETE /api/v1/cart/items/:itemId
DELETE /api/v1/cart
```

## Wishlist

```text
GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId
```

## Addresses

```text
GET    /api/v1/addresses
POST   /api/v1/addresses
PATCH  /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
```

## Coupons

```text
POST /api/v1/coupons/validate

GET    /api/v1/admin/coupons
POST   /api/v1/admin/coupons
PATCH  /api/v1/admin/coupons/:id
DELETE /api/v1/admin/coupons/:id
```

## Orders

```text
GET   /api/v1/orders
GET   /api/v1/orders/:id
POST  /api/v1/orders
POST  /api/v1/orders/:id/cancel

GET   /api/v1/admin/orders
PATCH /api/v1/admin/orders/:id/status
```

## Payments

```text
POST /api/v1/payments/create
POST /api/v1/payments/verify
POST /api/v1/payments/webhook
POST /api/v1/payments/:id/refund
```

## Reviews

```text
GET    /api/v1/products/:productId/reviews
POST   /api/v1/products/:productId/reviews
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

## Admin

```text
GET /api/v1/admin/dashboard/summary
GET /api/v1/admin/dashboard/sales
GET /api/v1/admin/dashboard/orders
GET /api/v1/admin/dashboard/products
GET /api/v1/admin/dashboard/customers
```

---

# 46. Business Rules

## Product Pricing

The backend is the source of truth for pricing.

Never trust:

```text
price
discount
tax
shipping
total
```

sent from the frontend.

The backend must recalculate them.

---

## Inventory

A product cannot be purchased if:

```text
availableStock < requestedQuantity
```

Inventory must be protected against overselling.

---

## Orders

Once an order is confirmed, the order should contain a snapshot of:

- Product name
- SKU
- Variant
- Price
- Quantity
- Tax
- Discount

This prevents historical orders from changing when the product is later edited.

---

## Coupons

Coupons must be validated on the server.

The frontend cannot determine whether a coupon is valid.

---

## Reviews

A customer can only submit a verified review after purchasing the product.

Optional restriction:

```text
One review per product per order
```

---

# 47. Soft Delete

Use soft deletion for important entities where historical references are required.

Example:

```text
deletedAt
deletedBy
```

Recommended for:

- Products
- Categories
- Users
- Brands
- Coupons

Orders and payments should generally never be physically deleted.

---

# 48. Data Consistency

The backend must prioritize consistency for:

- Inventory
- Orders
- Payments
- Coupons
- Refunds

Critical operations should use MongoDB transactions and idempotency where appropriate.

---

# 49. Idempotency

Payment and checkout operations should support idempotency.

Example:

```http
Idempotency-Key: unique-request-id
```

This prevents duplicate orders or duplicate payment processing when a request is retried.

---

# 50. Deployment

The application should be deployable using Docker.

Recommended production architecture:

```text
                    ┌──────────────┐
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │ Node.js API  │      │ Node.js API  │
        └──────┬───────┘      └──────┬───────┘
               │                     │
               └──────────┬──────────┘
                          ▼
                    ┌──────────┐
                    │ MongoDB  │
                    └──────────┘

                    ┌──────────┐
                    │  Redis   │
                    └──────────┘
```

---

# 51. Development Phases

## Phase 1 — Project Setup

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- ESLint
- Prettier
- Environment configuration
- Error handling
- Logging

## Phase 2 — Authentication

- Registration
- Login
- Logout
- JWT
- Refresh token
- Email verification
- Password reset
- RBAC

## Phase 3 — Catalog

- Products
- Categories
- Brands
- Variants
- Attributes
- Product search
- Filtering
- Pagination

## Phase 4 — Inventory

- Stock management
- Stock reservation
- Stock adjustment
- Inventory history

## Phase 5 — Shopping

- Cart
- Wishlist
- Addresses
- Coupons

## Phase 6 — Checkout

- Cart validation
- Price calculation
- Tax
- Shipping
- Coupon
- Order creation

## Phase 7 — Payments

- Payment provider integration
- Payment verification
- Webhooks
- Refunds
- Idempotency

## Phase 8 — Orders

- Order management
- Order status
- Shipping status
- Cancellation
- Refunds

## Phase 9 — Reviews

- Ratings
- Reviews
- Moderation
- Verified purchase

## Phase 10 — Admin

- Dashboard
- User management
- Product management
- Order management
- Inventory management
- Coupon management
- Reports

## Phase 11 — Notifications

- Email
- In-app notifications
- Background jobs

## Phase 12 — Production

- Docker
- CI/CD
- Security hardening
- Monitoring
- Logging
- Performance optimization
- Production deployment

---

# 52. Definition of Done

The backend will be considered complete when:

- All required modules are implemented.
- APIs are documented with OpenAPI.
- Authentication and authorization are implemented.
- MongoDB schemas and indexes are optimized.
- Product/catalog APIs support filtering and pagination.
- Cart and checkout correctly calculate prices server-side.
- Inventory cannot be oversold.
- Orders maintain historical product snapshots.
- Payments support verification and webhooks.
- Critical operations support transactions/idempotency.
- Admin APIs are protected by RBAC.
- Validation is implemented for all external input.
- Centralized error handling is implemented.
- Logging is implemented.
- Unit and integration tests are available.
- Health checks are available.
- Environment variables are properly managed.
- No secrets are committed to source control.
- API documentation is available.
- The application can be deployed to a production environment.

---

# 53. Primary Goal

The final backend should provide a **secure, scalable, maintainable, and production-ready e-commerce API** that can serve:

```text
                    E-Commerce Backend
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Storefront        Admin CMS       External Services
          │                │                │
          ▼                ▼                ▼
       Products         Products        Payments
       Cart             Orders          Email
       Wishlist         Inventory       Shipping
       Checkout         Customers       Storage
       Orders           Reports         Notifications
```

The architecture should remain modular enough to allow additional features such as multi-vendor support, subscriptions, loyalty programs, recommendations, advanced analytics, and multiple payment/shipping providers in the future.