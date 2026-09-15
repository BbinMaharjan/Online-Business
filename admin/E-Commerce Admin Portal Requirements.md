# E-Commerce Admin Portal Requirements

## 1. Project Overview

Build a modern, scalable, responsive **E-Commerce Admin/CMS Portal** using:

- React.js
- TypeScript
- Ant Design
- Redux Toolkit
- TanStack React Query
- React Router
- Vite

The Admin Portal will provide administrators with a centralized interface to manage the e-commerce platform, including:

- Dashboard
- Products
- Product variants
- Categories
- Brands
- Inventory
- Orders
- Customers
- Coupons
- Reviews
- Payments
- Shipping
- Media
- Reports
- Notifications
- Admin users
- Roles and permissions
- System settings
- Audit logs

The application should be modular, maintainable, responsive, accessible, and optimized for desktop and tablet usage.

---

# 2. Technology Stack

## Core

- React
- TypeScript
- Vite

## UI

- Ant Design
- Ant Design Icons

## State Management

- Redux Toolkit

Use Redux Toolkit for:

- Authentication state
- User/session state
- UI state
- Sidebar state
- Theme preferences
- Global filters where appropriate
- Permission state

Do not use Redux as the default storage for server data.

## Server State

Use TanStack React Query for:

- API requests
- Server-side caching
- Query invalidation
- Mutations
- Pagination
- Loading states
- Error states
- Refetching

## Routing

- React Router

## API

- Axios or Fetch API
- REST API
- OpenAPI-generated types/client where practical

## Forms

Use:

- Ant Design Form
- TypeScript validation
- Zod where complex validation is required

## Testing

- Vitest
- React Testing Library
- MSW for API mocking

## Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

---

# 3. Architecture

The application should use a feature-based architecture.

Recommended structure:

```text
admin-portal/
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   ├── store/
│   │   └── queryClient/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── table/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── feedback/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── brands/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── coupons/
│   │   ├── reviews/
│   │   ├── payments/
│   │   ├── shipping/
│   │   ├── media/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── administrators/
│   │   ├── roles/
│   │   ├── settings/
│   │   └── audit-logs/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   │
│   ├── main.tsx
│   └── App.tsx
│
├── public/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 4. State Management Strategy

The application should clearly separate **client state** and **server state**.

## Redux Toolkit

Redux Toolkit should manage:

```text
Authentication
Current admin user
Permissions
Sidebar state
UI preferences
Theme preferences
Global application state
```

Example:

```text
store/
├── authSlice.ts
├── uiSlice.ts
├── permissionSlice.ts
└── store.ts
```

## React Query

React Query should manage:

```text
Products
Categories
Brands
Orders
Customers
Inventory
Coupons
Reviews
Payments
Reports
Notifications
```

Example:

```text
useProductsQuery()
useProductQuery()
useCreateProductMutation()
useUpdateProductMutation()
useDeleteProductMutation()
```

### Important Rule

Do not duplicate React Query server data inside Redux unless there is a specific reason.

```text
Redux Toolkit
      │
      ├── Auth
      ├── UI
      └── Permissions

React Query
      │
      ├── Products
      ├── Orders
      ├── Customers
      ├── Inventory
      └── Reports
```

---

# 5. Authentication

Admin users must authenticate before accessing the portal.

## Login

Login page should contain:

- Email
- Password
- Remember me
- Login button
- Forgot password

Flow:

```text
Login
  ↓
API
  ↓
Validate credentials
  ↓
Access token
  ↓
Refresh token/session
  ↓
Load admin profile
  ↓
Load permissions
  ↓
Admin Dashboard
```

---

# 6. Authentication Handling

The frontend should:

- Store authentication securely
- Attach access token to API requests
- Handle expired access tokens
- Refresh authentication when appropriate
- Redirect unauthorized users to login
- Clear session on logout

Axios interceptor or an equivalent API client should handle:

```text
Request
   ↓
Attach Access Token
   ↓
API
   ↓
401?
   ↓
Refresh Token
   ↓
Retry Request
```

Avoid storing sensitive tokens in insecure locations when the backend supports secure HTTP-only cookies.

---

# 7. Authorization

The portal must support role-based and permission-based access.

Example:

```text
SUPER_ADMIN
ADMIN
MANAGER
STAFF
```

Permissions:

```text
PRODUCT_READ
PRODUCT_CREATE
PRODUCT_UPDATE
PRODUCT_DELETE

ORDER_READ
ORDER_UPDATE

CUSTOMER_READ
CUSTOMER_UPDATE

INVENTORY_READ
INVENTORY_UPDATE

COUPON_READ
COUPON_CREATE
COUPON_UPDATE
COUPON_DELETE

REPORT_READ
```

The frontend should hide or disable UI elements that the current administrator does not have permission to use.

Important:

> Frontend permission checks are only for UI control. The backend must always enforce authorization.

---

# 8. Application Layout

The main admin layout should use Ant Design components.

Recommended layout:

```text
┌──────────────────────────────────────────────────────┐
│ Header                                  Admin Profile │
├───────────────┬──────────────────────────────────────┤
│               │                                      │
│ Dashboard     │                                      │
│ Products      │                                      │
│ Categories    │             Main Content             │
│ Brands        │                                      │
│ Inventory     │                                      │
│ Orders        │                                      │
│ Customers     │                                      │
│ Coupons       │                                      │
│ Reviews       │                                      │
│ Reports       │                                      │
│ Settings      │                                      │
│               │                                      │
└───────────────┴──────────────────────────────────────┘
```

Use:

- `Layout`
- `Sider`
- `Header`
- `Menu`
- `Breadcrumb`
- `Content`
- `Dropdown`
- `Avatar`

---

# 9. Navigation

Sidebar navigation should be permission-aware.

Example:

```text
Dashboard

Catalog
├── Products
├── Categories
└── Brands

Sales
├── Orders
├── Payments
└── Coupons

Inventory
└── Inventory

Customers
└── Customers

Engagement
├── Reviews
└── Notifications

Reports
├── Sales
├── Products
└── Customers

Administration
├── Administrators
├── Roles & Permissions
├── Audit Logs
└── Settings
```

---

# 10. Dashboard

The dashboard should provide an overview of the store.

## KPI Cards

Display:

- Total Revenue
- Total Orders
- Total Customers
- Total Products
- Pending Orders
- Completed Orders
- Low Stock Products

Example:

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Revenue      │ │ Orders       │ │ Customers    │
│ $125,450     │ │ 1,240        │ │ 5,430        │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Charts

Display:

- Revenue over time
- Orders over time
- Sales by category
- Top-selling products
- Order status distribution

## Recent Orders

Display:

- Order number
- Customer
- Total
- Payment status
- Order status
- Created date
- Action

## Low Stock

Display:

- Product
- SKU
- Current stock
- Threshold
- Status

---

# 11. Product Management

Admin users should be able to:

- View products
- Search products
- Filter products
- Create products
- Edit products
- Delete products
- Publish/unpublish products
- Duplicate products
- Manage variants
- Manage images

---

# 12. Product List

Product table should display:

```text
Image
Name
SKU
Category
Brand
Price
Stock
Status
Created Date
Actions
```

Actions:

```text
View
Edit
Duplicate
Publish/Unpublish
Delete
```

Use Ant Design:

```text
Table
Pagination
Input
Select
Tag
Dropdown
Popconfirm
Modal
```

---

# 13. Product Creation

Product form should contain:

## Basic Information

- Product name
- SKU
- Slug
- Short description
- Description

## Classification

- Category
- Brand
- Tags

## Pricing

- Price
- Compare-at price
- Tax

## Inventory

- SKU
- Stock
- Low-stock threshold

## Media

- Main image
- Additional images

## Variants

- Variant attributes
- Variant SKU
- Variant price
- Variant stock
- Variant images

## SEO

- Meta title
- Meta description
- Meta keywords

## Publishing

- Draft
- Active
- Inactive

---

# 14. Product Form UX

The product form should be divided into logical sections.

Recommended layout:

```text
Product
├── Basic Information
├── Description
├── Category & Brand
├── Pricing
├── Inventory
├── Images
├── Variants
├── SEO
└── Publishing
```

For complex products, use:

- Tabs
- Cards
- Collapse panels

Avoid putting every field into one extremely long form.

---

# 15. Product Variants

Admin can create and manage variants.

Example:

```text
Color: Red
Size: Large
SKU: SHIRT-RED-L
Price: $25
Stock: 20
```

Variant table:

```text
Variant
SKU
Attributes
Price
Stock
Status
Actions
```

---

# 16. Category Management

Admin can:

- Create category
- Edit category
- Delete category
- Activate/deactivate category
- Upload category image
- Configure parent category
- Configure sort order
- Configure SEO

Use Ant Design `Tree` or `Table` to display hierarchical categories.

Example:

```text
Electronics
├── Mobile Phones
├── Laptops
└── Accessories
    ├── Chargers
    └── Cables
```

---

# 17. Brand Management

Admin can:

- Create brand
- Edit brand
- Delete brand
- Upload logo
- Activate/deactivate brand

Brand list:

```text
Logo
Name
Slug
Products
Status
Actions
```

---

# 18. Inventory Management

Inventory page should provide:

- Current stock
- Reserved stock
- Available stock
- Low-stock status
- Out-of-stock status

Table:

```text
Product
SKU
Variant
Stock
Reserved
Available
Threshold
Status
Actions
```

Admin can:

- Adjust stock
- Add stock
- Remove stock
- View stock history

---

# 19. Inventory Adjustment

Stock adjustment modal:

```text
Product
Variant
Current Stock
Adjustment Type
Quantity
Reason
```

Adjustment types:

```text
ADD
REMOVE
SET
```

Reasons:

```text
RESTOCK
DAMAGED
LOST
MANUAL_ADJUSTMENT
RETURN
CORRECTION
```

All adjustments should be sent to the backend and recorded in inventory history.

---

# 20. Order Management

Admin should be able to:

- View orders
- Search orders
- Filter orders
- View order details
- Update order status
- Update shipping status
- Cancel orders
- Process refunds where permitted

Order list:

```text
Order Number
Customer
Items
Total
Payment Status
Order Status
Created Date
Actions
```

---

# 21. Order Details

Order details should display:

## Customer

- Name
- Email
- Phone

## Items

- Product
- SKU
- Variant
- Quantity
- Unit price
- Discount
- Subtotal

## Pricing

- Subtotal
- Discount
- Tax
- Shipping
- Total

## Payment

- Payment method
- Transaction ID
- Payment status

## Shipping

- Shipping address
- Shipping method
- Tracking number
- Shipping status

## Timeline

Display:

```text
Order Created
     ↓
Payment Confirmed
     ↓
Processing
     ↓
Shipped
     ↓
Delivered
```

---

# 22. Customer Management

Admin can:

- View customers
- Search customers
- Filter customers
- View customer details
- Activate/deactivate customers
- Block customers

Customer table:

```text
Name
Email
Phone
Orders
Total Spent
Status
Joined Date
Actions
```

Customer details:

```text
Profile
Orders
Addresses
Reviews
Activity
```

---

# 23. Coupon Management

Admin can:

- Create coupons
- Edit coupons
- Delete coupons
- Activate/deactivate coupons
- View coupon usage

Coupon form:

```text
Code
Description
Discount Type
Discount Value
Minimum Order
Maximum Discount
Usage Limit
Usage Per Customer
Start Date
End Date
Status
```

Discount types:

```text
Percentage
Fixed Amount
```

---

# 24. Review Management

Admin should be able to moderate reviews.

Review table:

```text
Product
Customer
Rating
Title
Comment
Verified Purchase
Status
Created Date
Actions
```

Actions:

```text
Approve
Reject
Delete
View
```

Statuses:

```text
PENDING
APPROVED
REJECTED
```

---

# 25. Payment Management

Admin should be able to view payment records.

Payment table:

```text
Transaction ID
Order
Customer
Provider
Amount
Payment Method
Status
Date
```

Statuses:

```text
PENDING
PROCESSING
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

Payment details should be read-only unless the backend provides specific administrative actions.

---

# 26. Shipping Management

Admin can manage:

- Shipping methods
- Shipping zones
- Shipping prices
- Estimated delivery times

Shipping method:

```text
Name
Description
Price
Estimated Delivery
Zones
Status
```

---

# 27. Media Management

Media management should allow admins to:

- Upload images
- Preview images
- Delete images
- Replace images
- Copy image URL where appropriate

Supported formats:

```text
JPEG
PNG
WebP
SVG where safe
```

The frontend should validate:

- File type
- File size
- Number of files

The backend remains responsible for final validation.

---

# 28. Reports

Reports should provide:

## Sales

- Revenue
- Orders
- Average order value
- Sales by date

## Products

- Best-selling products
- Product revenue
- Quantity sold
- Low-stock products

## Categories

- Sales by category
- Revenue by category

## Customers

- New customers
- Returning customers
- Customer spending

Filters:

```text
Today
Yesterday
Last 7 days
Last 30 days
This month
Last month
Custom range
```

---

# 29. Data Tables

All management tables should support:

- Server-side pagination
- Search
- Filtering
- Sorting
- Column configuration where useful
- Loading state
- Empty state
- Error state
- Row actions

Example:

```text
GET /api/v1/admin/products?page=1&limit=20&search=phone
```

Do not load thousands of records into the browser unnecessarily.

---

# 30. URL State

Important filters should be synchronized with the URL where useful.

Example:

```text
/admin/products?page=2&status=ACTIVE&search=phone
```

Benefits:

- Browser back/forward
- Shareable URLs
- Refresh persistence
- Better navigation

---

# 31. Loading States

Every asynchronous operation must provide appropriate feedback.

Use:

- Skeleton
- Spin
- Table loading
- Button loading
- Progress indicators

Example:

```text
Submit
  ↓
Loading
  ↓
Success / Error
```

Prevent duplicate submissions while mutations are processing.

---

# 32. Error Handling

Display user-friendly error messages.

Example:

```text
Unable to create product.
Please check the required fields and try again.
```

For API errors:

```text
401 → Authentication required
403 → Permission denied
404 → Resource not found
409 → Conflict
422 → Validation error
500 → Server error
```

---

# 33. Notifications

Use Ant Design:

```text
message
notification
Modal
Alert
```

Examples:

```text
Product created successfully
Order status updated
Inventory updated
Coupon deleted
Unable to save changes
```

Destructive operations should require confirmation.

---

# 34. Delete Confirmation

Actions such as:

```text
Delete Product
Delete Category
Delete Brand
Delete Coupon
Delete Review
```

should require confirmation.

Use:

```text
Popconfirm
```

or a confirmation modal.

---

# 35. Responsive Design

The Admin Portal should support:

- Desktop
- Laptop
- Tablet

Desktop should be the primary target.

Responsive behavior:

```text
Desktop
Sidebar + Content

Tablet
Collapsible Sidebar + Content

Mobile
Collapsed Navigation + Content
```

Tables should support horizontal scrolling rather than breaking the layout.

---

# 36. Theme

Use Ant Design theming.

Support:

- Light theme
- Dark theme

Theme preference can be stored in Redux and persisted locally.

Use design tokens rather than hardcoding styles throughout components.

---

# 37. Accessibility

The application should follow accessible UI practices.

Requirements:

- Keyboard navigation
- Accessible form labels
- Proper button semantics
- Focus states
- Sufficient contrast
- Accessible modal behavior
- Screen-reader-friendly controls

Use Ant Design accessibility capabilities where available.

---

# 38. Routing

Recommended routes:

```text
/login

/dashboard

/products
/products/create
/products/:id
/products/:id/edit

/categories
/categories/create
/categories/:id/edit

/brands
/brands/create
/brands/:id/edit

/inventory
/inventory/:id

/orders
/orders/:id

/customers
/customers/:id

/coupons
/coupons/create
/coupons/:id/edit

/reviews

/payments

/shipping

/media

/reports/sales
/reports/products
/reports/customers

/notifications

/administrators
/roles

/settings

/audit-logs
```

---

# 39. Route Protection

Protected routes should use an authentication guard.

Example:

```text
                    Application
                         │
                         ▼
                  Authentication?
                   /          \
                 No            Yes
                 │              │
               Login      Check Permission
                                │
                         ┌──────┴──────┐
                         │             │
                       Allowed       Denied
                         │             │
                       Page       Access Denied
```

---

# 40. Permission-Based Components

Create reusable permission components.

Example:

```tsx
<PermissionGuard permission="PRODUCT_CREATE">
  <CreateProductButton />
</PermissionGuard>
```

Or:

```tsx
<Can permission="PRODUCT_DELETE">
  <DeleteButton />
</Can>
```

This should control visibility or availability of UI actions.

---

# 41. API Layer

Create a centralized API client.

Recommended:

```text
services/
├── apiClient.ts
├── authApi.ts
├── productApi.ts
├── categoryApi.ts
├── brandApi.ts
├── inventoryApi.ts
├── orderApi.ts
├── customerApi.ts
├── couponApi.ts
├── reviewApi.ts
├── paymentApi.ts
├── shippingApi.ts
├── reportApi.ts
└── mediaApi.ts
```

Each service should contain API-specific functionality rather than putting requests directly inside components.

---

# 42. React Query Architecture

Create feature-specific query hooks.

Example:

```text
features/products/
├── api/
│   └── productApi.ts
├── hooks/
│   ├── useProductsQuery.ts
│   ├── useProductQuery.ts
│   ├── useCreateProductMutation.ts
│   ├── useUpdateProductMutation.ts
│   └── useDeleteProductMutation.ts
├── components/
├── pages/
├── types/
└── schemas/
```

After mutations, invalidate relevant queries.

Example:

```text
Create Product
      ↓
Mutation Success
      ↓
Invalidate Products Query
      ↓
Fetch Updated Product List
```

---

# 43. React Query Requirements

Configure:

- Query client
- Retry behavior
- Stale time
- Cache time/gc time
- Error handling
- Query invalidation
- Mutation handling

Avoid unnecessary refetching.

Use query keys consistently.

Example:

```text
["products", filters]
["product", productId]
["orders", filters]
["order", orderId]
```

---

# 44. Redux Toolkit Requirements

Recommended slices:

```text
store/
├── auth/
│   └── authSlice.ts
├── ui/
│   └── uiSlice.ts
├── permissions/
│   └── permissionSlice.ts
└── store.ts
```

Keep Redux state minimal.

Do not store complete API collections in Redux when React Query already manages them.

---

# 45. Forms

Use Ant Design `Form`.

Forms should support:

- Required validation
- Field validation
- Async validation where required
- Error messages
- Loading states
- Reset
- Dirty-state handling where useful

Example:

```text
Product Form
├── Product Name *
├── SKU *
├── Category *
├── Price *
├── Stock *
└── Status *
```

---

# 46. Unsaved Changes

For large forms such as Product and Settings:

If the administrator has unsaved changes and attempts to leave:

```text
You have unsaved changes.
Are you sure you want to leave?
```

Provide:

```text
Stay
Leave
```

---

# 47. Search and Filtering

Search should generally be server-side.

Example:

```text
Search:
[ iphone                         ]

Category:
[ All Categories ▼ ]

Status:
[ Active ▼ ]

Price:
[ Min ] - [ Max ]

[Search] [Reset]
```

Debounce search inputs where appropriate.

---

# 48. Pagination

Use server-side pagination.

Default:

```text
20 records/page
```

Options:

```text
10
20
50
100
```

Maximum page size should match backend limitations.

---

# 49. Empty States

Every list page should handle an empty result.

Example:

```text
No products found.

[Create Product]
```

Differentiate between:

- No data exists
- Search returned no results
- API failed

---

# 50. Error Boundaries

Implement React Error Boundaries around major application sections.

Example:

```text
Application
├── Header
├── Sidebar
└── Content
      └── Error Boundary
           └── Feature Page
```

Display a friendly fallback instead of crashing the entire application.

---

# 51. Performance Requirements

The Admin Portal should:

- Lazy-load routes
- Avoid unnecessary renders
- Use React Query caching
- Paginate large datasets
- Optimize images
- Avoid unnecessary Redux state
- Memoize expensive components when needed
- Use virtualized tables for exceptionally large datasets

Example:

```text
Initial Bundle
      ↓
Load Dashboard
      ↓
User opens Products
      ↓
Load Product Module
```

---

# 52. Code Splitting

Routes should be lazy loaded.

Example:

```text
Dashboard
Products
Orders
Customers
Reports
Settings
```

should not necessarily be bundled into the initial JavaScript payload.

---

# 53. Security Requirements

Frontend security requirements:

- Do not expose secrets in frontend environment variables
- Do not store sensitive credentials
- Do not trust frontend permissions
- Sanitize/handle rich text safely
- Validate uploaded files
- Avoid dangerous HTML rendering
- Handle authentication expiration
- Protect admin routes

Remember:

> Anything included in a Vite frontend bundle can potentially be viewed by users.

---

# 54. Environment Configuration

Example:

```env
VITE_API_BASE_URL=
VITE_APP_NAME=
VITE_APP_ENV=
```

Never put:

```text
Database credentials
JWT secrets
Payment secret keys
Private API keys
```

in frontend environment variables.

---

# 55. Error Monitoring

Production should support error monitoring.

Possible integrations:

- Sentry
- OpenTelemetry-compatible monitoring
- Custom logging endpoint

Capture:

- Runtime errors
- API failures
- Route errors
- Important user actions

Do not capture sensitive information.

---

# 56. Testing Strategy

## Unit Tests

Test:

- Utility functions
- Selectors
- Validation
- Permission helpers
- Formatting functions

## Component Tests

Test:

- Forms
- Tables
- Modals
- Permission guards
- Error states

## Integration Tests

Test:

```text
Login
Product creation
Product editing
Order status update
Inventory adjustment
Customer management
```

Use:

```text
Vitest
React Testing Library
MSW
```

---

# 57. UI Testing Requirements

Critical flows should verify:

```text
Login
 ↓
Dashboard
 ↓
Products
 ↓
Create Product
 ↓
Submit
 ↓
Success
 ↓
Product appears in list
```

Also test:

```text
Unauthorized user
       ↓
Access restricted page
       ↓
403 / Access Denied
```

---

# 58. Browser Support

Support current versions of:

- Chrome
- Edge
- Firefox
- Safari

The primary development target should be modern Chromium-based browsers.

---

# 59. Build Requirements

Production build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Development:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm run test
```

---

# 60. CI/CD

CI pipeline should run:

```text
Install dependencies
       ↓
Type check
       ↓
Lint
       ↓
Unit tests
       ↓
Build
       ↓
Deploy
```

Pull requests should not be merged if:

- TypeScript errors exist
- Tests fail
- Lint fails
- Production build fails

---

# 61. MVP Scope

The first version should focus on operational e-commerce management.

## P0 — Must Have

```text
Authentication
Dashboard
Products
Categories
Brands
Product Variants
Inventory
Orders
Customers
Basic Roles & Permissions
```

## P1 — Important

```text
Coupons
Reviews
Payments
Shipping
Media Management
Sales Reports
Customer Reports
Notifications
Audit Logs
```

## P2 — Post MVP

```text
Advanced Analytics
Advanced Reporting
Bulk Product Import
Bulk Product Export
Advanced Promotions
Product Recommendations
Customer Segmentation
Multiple Store Management
Multi-language
Multi-currency
Advanced CMS
```

---

# 62. MVP Dashboard

The MVP dashboard should contain:

```text
┌───────────────────────────────────────────────────────┐
│ Total Revenue │ Orders │ Customers │ Products        │
├───────────────────────────────────────────────────────┤
│                                                       │
│                 Revenue Chart                         │
│                                                       │
├───────────────────────────┬───────────────────────────┤
│ Recent Orders             │ Low Stock Products        │
│                           │                           │
│                           │                           │
└───────────────────────────┴───────────────────────────┘
```

Keep the first dashboard simple and actionable.

---

# 63. MVP Product Management

Required:

```text
Product List
    ↓
Search / Filter
    ↓
Create Product
    ↓
Edit Product
    ↓
Manage Variants
    ↓
Upload Images
    ↓
Publish / Unpublish
```

---

# 64. MVP Order Management

Required:

```text
Order List
    ↓
Search / Filter
    ↓
Order Details
    ↓
View Customer
    ↓
View Items
    ↓
View Payment
    ↓
Update Order Status
```

---

# 65. MVP Inventory Management

Required:

```text
Inventory List
    ↓
Search Product
    ↓
View Stock
    ↓
Adjust Stock
    ↓
Record Reason
    ↓
Refresh Inventory
```

---

# 66. MVP Customer Management

Required:

```text
Customer List
    ↓
Search / Filter
    ↓
Customer Details
    ↓
View Orders
    ↓
View Total Spending
    ↓
Activate / Block
```

---

# 67. MVP Definition of Done

The Admin Portal MVP is complete when an authorized administrator can:

- Login securely
- Access the dashboard
- View key store metrics
- Create products
- Edit products
- Publish/unpublish products
- Manage product variants
- Manage product images
- Manage categories
- Manage brands
- View and adjust inventory
- View customers
- View customer order history
- View orders
- Update order status
- View payment information
- Use search/filter/pagination
- Access only permitted features
- Logout securely

The portal must also:

- Be responsive
- Have proper loading states
- Handle API errors
- Have protected routes
- Use TypeScript strictly
- Use React Query for server state
- Use Redux Toolkit for client state
- Use Ant Design consistently
- Pass linting and type checking
- Pass automated tests
- Produce a successful production build

---

# 68. Development Priority

Recommended implementation order:

## Phase 1 — Foundation

```text
Vite
TypeScript
Ant Design
React Router
Redux Toolkit
React Query
Axios/API client
Global error handling
Application layout
Theme
```

## Phase 2 — Authentication

```text
Login
Logout
Token handling
Auth state
Route protection
Permission handling
```

## Phase 3 — Dashboard

```text
Summary cards
Revenue
Orders
Customers
Products
Recent orders
Low stock
```

## Phase 4 — Catalog

```text
Products
Categories
Brands
Variants
Images
Search
Filters
Pagination
```

## Phase 5 — Inventory

```text
Inventory list
Stock adjustment
Stock history
Low stock
Out of stock
```

## Phase 6 — Sales

```text
Orders
Order details
Order status
Payments
Shipping
```

## Phase 7 — Customers

```text
Customer list
Customer details
Customer orders
Customer status
```

## Phase 8 — P1 Features

```text
Coupons
Reviews
Reports
Media
Notifications
Audit logs
```

## Phase 9 — Production Hardening

```text
Testing
Performance
Accessibility
Security
Error monitoring
CI/CD
Production build
```

---

# 69. Final Architecture

The final Admin Portal should follow this architecture:

```text
                         Admin Portal
                              │
              ┌───────────────┴───────────────┐
              │                               │
        Client State                     Server State
              │                               │
        Redux Toolkit                    React Query
              │                               │
       ┌──────┼──────┐              ┌─────────┼─────────┐
       │      │      │              │         │         │
      Auth    UI  Permissions    Products    Orders   Customers
                                      │         │         │
                                      └─────────┼─────────┘
                                                │
                                                ▼
                                         API Client
                                                │
                                                ▼
                                      Node.js REST API
                                                │
                                                ▼
                                             MongoDB
```

The Admin Portal should remain a **presentation and management layer**. Business-critical rules such as authorization, pricing, inventory validation, payment verification, and order consistency must remain enforced by the backend.