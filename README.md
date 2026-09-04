# 1Fi EMI Store

A full-stack e-commerce application for purchasing flagship devices through flexible EMI plans while demonstrating a mutual-fund-backed financing model.

## Live Demo

[View the Live Demo](<YOUR_LIVE_DEMO_URL>)

## Video Walkthrough

[Watch the Video Walkthrough](<YOUR_VIDEO_WALKTHROUGH_URL>)

## 1. Project Overview

1Fi EMI Store combines e-commerce and fintech functionality. Users can browse devices, search and filter the catalog, configure product variants, view technical specifications, calculate EMI options, review products, save products to a wishlist, compare products, and proceed through a financing flow.

The project also includes an admin catalog management dashboard for products, variants, categories, EMI plans, inventory, and variant images.

### Main Features

- Database-backed product search, filtering, facets, and sorting
- Category, brand, storage, and price filters
- URL-synchronized catalog filters
- Product color and storage variants
- Variant-aware multi-image gallery
- Fullscreen image lightbox and mobile swipe gestures
- Dynamic technical specifications
- Interactive EMI calculator
- 0% No-Cost EMI and reducing-balance EMI calculations
- Mutual-fund-backed financing visualization
- Product reviews and ratings
- Wishlist with local persistence
- Product comparison for up to three products
- Responsive desktop and mobile interfaces
- Admin catalog management
- Zod-based request validation
- PostgreSQL database with Prisma ORM
- Automated API, database, and financial verification

## 2. Tech Stack Used

| Area | Technology |
|---|---|
| Frontend | Next.js, React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Client State | React Context |
| Browser Persistence | localStorage |
| Build | Next.js with Turbopack |
| Verification | Custom TypeScript verification suite |

## 3. Setup and Run Instructions

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
ADMIN_SECRET_KEY="your-admin-secret"
```

A dedicated admin secret should be configured for non-development environments.

### Generate Prisma Client

```bash
npx prisma generate
```

### Validate the Schema

```bash
npx prisma validate
```

### Apply the Database Schema

```bash
npx prisma db push
```

### Seed the Database

```bash
npx tsx prisma/seed.ts
```

### Start the Development Server

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

### TypeScript Validation

```bash
npx tsc --noEmit
```

### Verification Suite

```bash
npm run verify
```

## 4. API Endpoints and Example Responses

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "success": true
}
```

### Product Catalog

```http
GET /api/products
```

Supported query parameters:

| Parameter | Description |
|---|---|
| `search` | Searches product name, brand, description, tagline, and variant SKU |
| `category` | Filters by category slug or name |
| `brand` | Filters by brand |
| `storage` | Filters by variant storage |
| `minPrice` | Minimum price |
| `maxPrice` | Maximum price |
| `sort` | Sorting mode |

Supported sort values:

```text
recommended
price_asc
price_desc
newest
```

Examples:

```http
GET /api/products?search=iPhone
GET /api/products?brand=Apple
GET /api/products?storage=256GB
GET /api/products?minPrice=100000&maxPrice=150000
GET /api/products?search=iPhone&brand=Apple&storage=256GB&maxPrice=150000&sort=price_asc
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "id": "product-id",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "slug": "iphone-17-pro"
    }
  ],
  "facets": {
    "categories": [
      {
        "name": "Smartphones",
        "slug": "smartphones",
        "count": 3
      }
    ],
    "brands": [
      {
        "name": "Apple",
        "count": 2
      }
    ],
    "storages": [
      {
        "value": "256GB",
        "count": 7
      }
    ],
    "priceRange": {
      "min": 99999,
      "max": 169900
    }
  },
  "totalCount": 1
}
```

### Product Details

```http
GET /api/products/[slug]
```

Example:

```http
GET /api/products/iphone-17-pro
```

Example response structure:

```json
{
  "success": true,
  "data": {
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "slug": "iphone-17-pro",
    "variants": [],
    "emiPlans": [],
    "specifications": []
  }
}
```

The returned product also includes the database-backed variant and image information used by the product detail page.

### Product Reviews

Get reviews:

```http
GET /api/products/[slug]/reviews
```

Filter by rating:

```http
GET /api/products/iphone-17-pro/reviews?rating=5
```

Example response:

```json
{
  "success": true,
  "data": [],
  "summary": {
    "averageRating": 4.8,
    "totalReviews": 10,
    "ratingDistribution": {
      "5": 7,
      "4": 2,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

### Create Review

```http
POST /api/products/[slug]/reviews
```

Example request:

```json
{
  "rating": 5,
  "title": "Excellent device",
  "comment": "The device and financing experience were excellent.",
  "reviewerName": "Demo User",
  "variantName": "256GB - Desert Titanium"
}
```

The request is validated using Zod before persistence.

### Product Comparison

```http
GET /api/products/compare
```

The endpoint returns the product information required for comparison, including pricing, specifications, and EMI financing information. The frontend supports up to three products.

## 5. Schema Used

The application uses a relational PostgreSQL schema managed through Prisma ORM.

### Entity Relationship Overview

```text
Category
    |
    +-- Product
          |
          +-- ProductVariant
          |      |
          |      +-- VariantImage
          |
          +-- ProductSpecification
          |
          +-- Review
          |
          +-- EmiPlan
```

### Product

Stores core product information:

```text
id
name
slug
brand
description
badge
categoryId
createdAt
updatedAt
```

### ProductVariant

Stores individual purchasable configurations:

```text
id
productId
sku
variantName
colorName
colorHex
storage
price
mrp
stock
```

A product can contain multiple color and storage variants.

### VariantImage

Stores images associated with product variants:

```text
image URL
alt text
primary image flag
display order
```

### ProductSpecification

Stores normalized product-level technical specifications:

```text
id
productId
category
name
value
displayOrder
createdAt
updatedAt
```

Specification categories include:

```text
Performance
Display
Camera
Battery & Power
Connectivity
General
```

### Review

Stores customer review information:

```text
id
productId
variantName
rating
title
comment
reviewerName
verifiedBuyer
createdAt
updatedAt
```

### EmiPlan

Stores predefined financing plan information:

```text
tenure
interest rate
cashback
minimum pledge multiplier
```

The application supports 0% No-Cost EMI and reducing-balance EMI plans.

### Category

Stores product categories and their relationships with products.

## 6. Database Schema and Seed Data

The database schema is defined in:

```text
prisma/schema.prisma
```

Seed data is defined in:

```text
prisma/seed.ts
```

The demonstration database contains:

| Resource | Count |
|---|---:|
| Products | 4 |
| Product Variants | 13 |
| EMI Plans | 91 |
| Demonstration Reviews | 10 |

Seeded products:

- Apple iPhone 17 Pro
- Samsung Galaxy S25 Ultra
- Google Pixel 10 Pro
- Apple MacBook Pro 14 (M4)

The seed data also includes multiple variant images and product specifications.

To reset the demonstration database and seed it again:

```bash
npx tsx prisma/seed.ts
```

## 7. Project Architecture

The application follows a layered full-stack architecture:

```text
                    Browser / Client
                          |
                          v
                Next.js React UI
                          |
              +-----------+-----------+
              |                       |
              v                       v
        Client State              API Client
        React Context                  |
                                      v
                              Next.js API Routes
                                      |
                          +-----------+-----------+
                          |                       |
                          v                       v
                    Zod Validation          Auth Guard
                          |                       |
                          +-----------+-----------+
                                      |
                                      v
                              Service Layer
                                      |
                                      v
                                Prisma ORM
                                      |
                                      v
                                PostgreSQL
```

### Frontend Layer

Located primarily under:

```text
src/components/
src/app/
src/context/
```

Responsible for:

- Catalog discovery
- Product configuration
- Search and filtering
- Image galleries
- EMI interaction
- Reviews
- Wishlist and comparison
- Responsive layouts
- Admin dashboard

### API Layer

Located under:

```text
src/app/api/
```

Responsible for:

- Request handling
- Query parameter parsing
- Response formatting
- Validation
- Authentication for admin endpoints

### Validation Layer

Located in:

```text
src/lib/validators.ts
```

Zod schemas validate catalog and administrative inputs before they reach service/database operations.

### Service Layer

Located under:

```text
src/lib/services/
```

Database operations are isolated inside service functions rather than being performed directly from React components.

### Data Layer

The application uses:

```text
Prisma ORM
PostgreSQL
```

The database contains products, variants, images, specifications, reviews, categories, and EMI plans.

## 8. Core Application Flows

### Product Discovery Flow

```text
User opens catalog
      |
      v
Search / Filter / Sort
      |
      v
GET /api/products
      |
      v
Prisma database filtering
      |
      v
Products + Facets
      |
      v
Responsive Product Grid
```

### Product Configuration Flow

```text
Product Detail
      |
      +-- Select Color
      |
      +-- Select Storage
      |
      +-- View Variant Images
      |
      +-- View Specifications
      |
      +-- Select EMI Plan
      |
      +-- Calculate Financing
      |
      v
Checkout Summary
```

### Admin Management Flow

```text
Admin Dashboard
      |
      v
Authentication Guard
      |
      v
Zod Validation
      |
      v
Admin Service
      |
      v
Prisma
      |
      v
PostgreSQL
      |
      v
Customer APIs reflect updated catalog data
```

## 9. Admin API Endpoints

Admin endpoints are protected by the application authentication guard.

Supported authentication mechanisms:

```text
x-admin-key
Authorization: Bearer <key>
1fi_admin_key cookie
```

### Admin Statistics

```http
GET /api/admin/stats
```

### Admin Products

```http
GET    /api/admin/products
POST   /api/admin/products

GET    /api/admin/products/[id]
PUT    /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

### Admin Categories

```http
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories
DELETE /api/admin/categories
```

### Admin Variants

```http
GET    /api/admin/variants
POST   /api/admin/variants
PUT    /api/admin/variants
DELETE /api/admin/variants
```

### Admin EMI Plans

```http
GET    /api/admin/emi-plans
POST   /api/admin/emi-plans
PUT    /api/admin/emi-plans
DELETE /api/admin/emi-plans
```

### Admin Variant Images

```http
GET    /api/admin/images
POST   /api/admin/images
PUT    /api/admin/images
DELETE /api/admin/images
```

## 10. EMI Calculation

The centralized financial calculation engine is:

```text
src/lib/emi-calculator.ts
```

### Reducing-Balance EMI

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = loan principal
r = monthly interest rate
n = tenure in months
```

### 0% No-Cost EMI

```text
EMI = Principal / Tenure
```

The calculator also determines:

- Total repayment
- Total interest
- Cashback impact
- Effective net cost
- Down-payment-adjusted principal

The financial engine is reused by the interactive calculator instead of duplicating calculation logic in UI components.

## 11. Product Experience

### Catalog

The catalog provides:

- Debounced backend search
- Multi-attribute filtering
- Dynamic facet counts
- Price filtering
- Sorting
- Active filter chips
- Clear-all functionality
- URL query synchronization
- Desktop filter sidebar
- Mobile filter drawer
- Loading skeletons
- Empty states

### Product Details

Product pages provide:

- Variant selection
- Color selection
- Storage selection
- Dynamic pricing
- Variant-aware image galleries
- Fullscreen image lightbox
- Keyboard navigation
- Mobile touch gestures
- Technical specifications
- EMI plan selection
- Interactive EMI calculator
- Reviews and rating summaries
- Wishlist support
- Comparison support

### Wishlist and Comparison

Wishlist state is persisted using:

```text
localStorage
```

Only product slugs are stored locally. Current product metadata is retrieved from the database/API.

Product comparison supports up to three products and compares:

- Product information
- Pricing
- Storage
- Display
- Processor
- RAM
- Camera
- Battery
- Operating system
- Warranty
- EMI financing information

## 12. Project Structure

```text
.
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── scripts/
│   └── verify-api.ts
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   └── products/
│   │   ├── admin/
│   │   ├── compare/
│   │   ├── wishlist/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── catalog/
│   │   ├── product/
│   │   └── layout/
│   │
│   ├── context/
│   ├── lib/
│   │   ├── services/
│   │   ├── emi-calculator.ts
│   │   ├── api-client.ts
│   │   ├── validators.ts
│   │   └── auth-guard.ts
│   │
│   └── types/
│
├── public/
├── implementation_plan.md
├── package.json
└── README.md
```

## 13. Security and Validation

The application uses several layers of validation and access control.

### Request Validation

Zod schemas validate:

- Product data
- Variant data
- Category data
- EMI plan data
- Image data
- Review data
- Product query parameters

### Admin Authentication

Admin API requests require an accepted admin credential through:

```text
x-admin-key
Authorization: Bearer <key>
1fi_admin_key cookie
```

Unauthorized requests return a standardized HTTP 401 response.

### Database Access

Database operations are isolated in service functions using Prisma ORM.

## 14. Verification and Testing

Run the complete verification suite:

```bash
npm run verify
```

Additional checks:

```bash
npx prisma validate
npx prisma generate
npx tsc --noEmit
npm run build
```

The verification suite covers:

- Database persistence
- Product and variant relationships
- Catalog APIs
- Search
- Filtering
- Sorting
- Dynamic facets
- Product specifications
- Variant images
- Reviews
- EMI calculations
- Product comparison
- Admin functionality

### Verification Status

| Area | Status |
|---|---|
| Prisma schema validation | Passed |
| TypeScript validation | Passed |
| Database seeding | Passed |
| Product APIs | Passed |
| Catalog filtering and sorting | Passed |
| Product specifications | Passed |
| Product images | Passed |
| EMI calculations | Passed |
| Reviews | Passed |
| Product comparison | Passed |
| Admin APIs | Passed |
| Production build | Passed |

## 15. Implementation Highlights

### Database-Backed Catalog

Filtering, sorting, search, and facet calculations are performed against the database rather than relying on a static client-side product array.

### Dynamic Product Data

Product variants, images, specifications, reviews, prices, inventory, and EMI plans are stored in and retrieved from the database.

### Reusable Financial Engine

The EMI calculation logic is centralized in:

```text
src/lib/emi-calculator.ts
```

This prevents duplicated financial formulas across the application.

### Responsive UX

The interface provides dedicated desktop and mobile experiences for catalog filtering, product browsing, image viewing, and checkout interactions.

### Admin-to-Store Data Flow

Changes made through the admin dashboard propagate through the database and are immediately reflected by the customer-facing APIs.

## 16. Disclaimer

This project is a demonstration e-commerce and financing application.

The mutual-fund-backed financing flow, projected investment growth, cashback values, financing calculations, and seeded reviews are demonstration data and functionality and should not be interpreted as financial advice or as an actual financing offer.
