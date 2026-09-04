# 1Fi Mutual Fund EMI Store — SDE1 Full-Stack Project

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20SQLite-4169E1?style=flat&logo=postgresql)](https://postgresql.org)

A production-grade, full-stack fintech e-commerce platform built for the **1Fi SDE1 Assignment**. It serves dynamic catalog data, multi-variant selections, and intelligent Loan Against Mutual Funds (LAMF) EMI calculations backed by a relational database, type-safe REST APIs, and an original visual design.

---

## 🌟 Key Features & Original Design System

1. **Original Visual Identity & Fintech Aesthetics**:
   - **Modern Brand System**: Designed around `"Smart purchases powered by your investments"` using deep purple (`#6C28D9`), soft lavender surfaces, crisp white cards, and fintech data visualizers.
   - **Original Page Compositions**: Custom-crafted layout including an interactive **Hero Simulation Dashboard**, **Connected 4-Step Process Timeline**, **Asymmetric Wealth Advantage Grid**, **4-Step Financing Diagram**, and an **Accordion FAQ Section**.

2. **Interactive Product Configurator (`/products/[slug]`)**:
   - **Step-by-Step Configurator**: Storage capacity buttons, high-fidelity color swatches, and a dynamic presentation stage with ambient lighting.
   - **Matrix EMI Tenure Selector**: Distinctive cards highlighting monthly installments, tenure pills (3 to 60 months), 0% No-Cost tags, and cashback rewards.
   - **URL Deep-Linking & State Synchronization**: Full URL synchronization for `?variant=<sku>&tenure=<months>`. Preserves user configurations on page refresh and direct link sharing.
   - **1Fi Wealth Compounding Dashboard**: Dynamically computes mutual fund collateral requirements (1.5x) and projected investment returns (~12% CAGR).

3. **Production Architecture & Data Layer**:
   - **Unified Data Service Layer** (`src/lib/services/product-service.ts`): Eliminates duplicate Prisma queries between API route handlers and Server Components.
   - **Dynamic Server-Side Rendering (SSR)**: Generates metadata, OpenGraph tags, and server-rendered HTML for fast TTFB and SEO.
   - **Next.js Client Error Boundaries**: Global (`src/app/error.tsx`) and product-level (`src/app/products/[slug]/error.tsx`) error boundaries with retry mechanisms.
   - **Strict TypeScript & Zod Validation**: Zero `any` type escapes, strictly typed Prisma query filters, and runtime parameter validation.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Unified Full-Stack Framework with SSR, Server Components, and REST Route Handlers |
| **Language** | TypeScript 5 | End-to-end strict type safety and interface contracts |
| **Styling** | Tailwind CSS v4 | Curated 1Fi color system, micro-animations, glassmorphism, responsive viewports |
| **ORM & Database** | Prisma ORM 6.4 + PostgreSQL / SQLite | Relational schema modeling, foreign key constraints, automated migrations & seeding |
| **Validation** | Zod | Runtime validation for route params and query filters |
| **Icons** | Lucide React | Modern, accessible vector iconography |

---

## 🚀 Getting Started (Quick Run)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd 1fi-emi-store
npm install
```

### 2. Set Up Environment & Database
The project comes pre-configured with SQLite for **zero-dependency instant local execution**:
```bash
# Push schema to database
npm run db:push

# Seed the database with all 4 products, 13 variants & EMI plans
npm run seed
```

### 3. Run Automated Tests
```bash
npm run verify
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the store!

---

## 🗄 Database Schema & Relational Design

```
┌──────────────┐       ┌──────────────┐       ┌────────────────┐
│   Category   │──1:N──│   Product    │──1:N──│ ProductVariant │
└──────────────┘       └──────────────┘       └────────────────┘
                                                       │
                                        ┌──────────────┼──────────────┐
                                        │ 1:N                         │ 1:N
                                        ▼                             ▼
                               ┌─────────────────┐           ┌────────────────┐
                               │  VariantImage   │           │ ProductEmiPlan │
                               └─────────────────┘           └────────────────┘
                                                                      │ N:1
                                                                      ▼
                                                             ┌────────────────┐
                                                             │    EmiPlan     │
                                                             └────────────────┘
```

### Core Entities:
- **`Category`**: Product classification (`smartphones`, `laptops`).
- **`Product`**: Brand, name, slug (`iphone-17-pro`), description, and badges (`NEW`, `BESTSELLER`).
- **`ProductVariant`**: SKU (`IP17P-512-SILVER`), color finish (`Natural Silver`, `#E3E4E5`), storage tier (`512GB`), MRP, and discounted selling price.
- **`VariantImage`**: Multi-angle/color product renders with primary flag.
- **`EmiPlan`**: Master financial plans (tenure in months, interest rate, cashback amount, collateral multiplier).
- **`ProductEmiPlan`**: Join table binding variants to specific EMI plans with custom or dynamically computed monthly amounts.

---

## 📡 API Documentation & Endpoints

### 1. Catalog Products List
- **Endpoint**: `GET /api/products`
- **Query Params (Optional)**: `?category=smartphones&search=iphone`
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_iphone17pro",
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "badge": "NEW",
      "categoryName": "Smartphones",
      "startingPrice": 127400,
      "startingMrp": 134900,
      "discountPercentage": 6,
      "minMonthlyEmi": 2842,
      "variantsCount": 5,
      "defaultVariant": {
        "id": "var_1",
        "sku": "IP17P-256-DESERT",
        "storage": "256GB",
        "colorName": "Desert Titanium",
        "colorHex": "#C5A98F",
        "imageUrl": "/images/products/iphone17pro-desert.svg"
      }
    }
  ]
}
```

### 2. Product Detail with All Variants & EMI Plans
- **Endpoint**: `GET /api/products/:slug`
- **Example**: `GET /api/products/iphone-17-pro`
- **Example Response**:
```json
{
  "success": true,
  "data": {
    "id": "prod_iphone17pro",
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "badge": "NEW",
    "description": "Supercharged by the next-generation A19 Pro chip...",
    "category": {
      "id": "cat_1",
      "name": "Smartphones",
      "slug": "smartphones"
    },
    "variants": [
      {
        "id": "var_ip17p_256_desert",
        "sku": "IP17P-256-DESERT",
        "variantName": "256GB - Desert Titanium",
        "colorName": "Desert Titanium",
        "colorHex": "#C5A98F",
        "storage": "256GB",
        "mrp": 134900,
        "price": 127400,
        "discountPercentage": 6,
        "isDefault": true,
        "images": [
          {
            "id": "img_1",
            "url": "/images/products/iphone17pro-desert.svg",
            "altText": "iPhone 17 Pro - 256GB - Desert Titanium",
            "isPrimary": true
          }
        ],
        "emiPlans": [
          {
            "id": "plan_3m",
            "tenureMonths": 3,
            "monthlyEmi": 44967,
            "annualInterestRate": 0,
            "isNoCost": true,
            "cashbackAmount": 7500,
            "cashbackDescription": "Additional cashback of ₹7,500",
            "totalPayable": 134901,
            "netEffectiveCost": 119900,
            "requiredMfPledge": 191100
          },
          {
            "id": "plan_12m",
            "tenureMonths": 12,
            "monthlyEmi": 11242,
            "annualInterestRate": 0,
            "isNoCost": true,
            "cashbackAmount": 7500,
            "cashbackDescription": "Additional cashback of ₹7,500",
            "totalPayable": 134904,
            "netEffectiveCost": 119900,
            "requiredMfPledge": 191100
          },
          {
            "id": "plan_60m",
            "tenureMonths": 60,
            "monthlyEmi": 2842,
            "annualInterestRate": 10.5,
            "isNoCost": false,
            "cashbackAmount": 7500,
            "cashbackDescription": "Additional cashback of ₹7,500",
            "totalPayable": 170520,
            "netEffectiveCost": 163020,
            "requiredMfPledge": 191100
          }
        ]
      }
    ]
  }
}
```

### 3. Service Health Check
- **Endpoint**: `GET /api/health`
- **Example Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-03T01:10:00.000Z",
  "database": "connected",
  "stats": {
    "products": 4,
    "variants": 13
  }
}
```

---

## 🧮 Financial Math & Reducing Balance Formula

For interest-bearing plans (e.g. 10.5% p.a.), the calculation engine uses the standard reducing balance amortization formula:

$$E = P \cdot r \cdot \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $E$ = Equated Monthly Installment (EMI)
- $P$ = Principal Selling Price
- $r$ = Monthly interest rate ($\text{Annual Rate} / 12 / 100$)
- $n$ = Loan tenure in months

**Wealth Preservation Calculation:**
$$\text{Projected Mutual Fund Value} = \text{Pledged Collateral} \times (1 + \text{CAGR})^{n/12}$$

---

## 📁 Project Folder Structure

```
1fi-emi-store/
├── prisma/
│   ├── schema.prisma            # Relational database schema
│   └── seed.ts                  # Multi-variant catalog seeder
├── public/
│   ├── 1fi-logo.svg             # Brand logo mark
│   └── images/products/         # High-resolution vector device renders
├── scripts/
│   └── verify-api.ts            # Automated verification test suite
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with fonts & metadata
│   │   ├── globals.css          # Tailwind design tokens
│   │   ├── error.tsx            # Global client error boundary
│   │   ├── page.tsx             # Storefront homepage
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx     # Dynamic SSR product configurator
│   │   │       ├── loading.tsx  # Shimmer skeleton loader
│   │   │       ├── error.tsx    # Product error boundary
│   │   │       └── not-found.tsx# Custom 404 page
│   │   └── api/
│   │       ├── products/
│   │       │   ├── route.ts     # Catalog REST API
│   │       │   └── [slug]/
│   │       │       └── route.ts # Product Detail REST API
│   │       └── health/
│   │           └── route.ts     # Health check API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Original fintech brand bar & mobile drawer
│   │   │   └── Footer.tsx       # Trust, API reference & legal footer
│   │   ├── home/
│   │   │   ├── HeroVisualizer.tsx       # Live investment vs cash visualizer
│   │   │   ├── HowItWorksTimeline.tsx   # 4-step connected timeline
│   │   │   ├── BenefitsGrid.tsx         # Asymmetric wealth preservation tiles
│   │   │   ├── FinancingExplainer.tsx   # 4-step calculation flow
│   │   │   └── FaqAccordion.tsx         # Expandable accordion FAQs
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx          # Catalog product card
│   │   │   └── ProductGrid.tsx          # Search & category filter grid
│   │   └── product/
│   │       ├── ProductDetailView.tsx    # Configurator & URL query synchronizer
│   │       ├── ProductGallery.tsx       # Showcase stage with ambient lighting
│   │       ├── VariantSelector.tsx      # Step-by-step capacity & finish chips
│   │       ├── EmiPlanCard.tsx          # Matrix EMI card with cashback ribbon
│   │       ├── EmiPlanList.tsx          # EMI tenure selector with filter chips
│   │       ├── MfAdvantageCard.tsx      # Wealth compounding dashboard
│   │       └── PlanSummaryModal.tsx     # Transparent checkout loan breakdown
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── emi-calculator.ts    # Financial calculation engine
│   │   ├── formatters.ts        # Currency (₹ INR) formatters
│   │   ├── validators.ts        # Zod validation schemas
│   │   └── services/
│   │       └── product-service.ts # Unified product data service
│   └── types/
│       └── product.ts           # TypeScript DTO interfaces
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚢 Deployment Instructions (Vercel)

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the build command:
   ```bash
   npx prisma generate && npm run build
   ```
4. Configure your `DATABASE_URL` environment variable (Neon, Supabase, or Vercel Postgres).
5. Deploy and submit the live link!

---

## 👤 Author & Submission Details
- **Assignment**: 1Fi SDE1 Internship Technical Task
- **Candidate**: Yash Sharma
- **Submission Form**: [Google Form](https://forms.gle/V4vqbcSAhJV7BqoAA)
