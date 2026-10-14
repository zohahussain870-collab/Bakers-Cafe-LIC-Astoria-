# Home Bakery — Complete Production-Ready Web Platform & Admin Console

> Handcrafted artisan patisserie rooted in Gulberg Town, Karachi, Pakistan. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and SQLite / PostgreSQL.

---

## 1. Business Information (Source of Truth)

- **Business Name:** Home Bakery
- **Business Type:** Dedicated home-based artisan bakery
- **Physical Kitchen Address:** House R-1932, Block 17, Gulberg Town, Karachi, 75950, Pakistan
- **Phone & WhatsApp:** [+92 330 2964562](https://wa.me/923302964562)
- **Google Maps Navigation URL:** [Open in Google Maps](https://www.google.com/maps/search/?api=1&query=Home+Bakery+House+R-1932+Block+17+Gulberg+Town+Karachi)
- **Supplied Google Rating:** 5.0 / 5.0 (from 1 review) — clearly distinguished as supplied listing data.
- **Listed Availability:** Open 24 hours (for order placement & scheduled preparation; all bakes made to order with advance preparation notice).
- **Service Type:** Takeout / Self-Pickup (Default). No commercial walk-in storefront. Delivery disabled by default until enabled by administrator.
- **Default Currency & Timezone:** PKR (Pakistani Rupee), Asia/Karachi (PKT).

---

## 2. Technology Stack

- **Framework:** Next.js 16.4.0 (App Router, Server Components + Dynamic Routing)
- **Language:** TypeScript 5 (Strict Mode enabled)
- **Styling & Design System:** Tailwind CSS v4, custom artisan tokens (Warm Ivory, Rich Dark Cocoa, Pistachio/Sage, Toasted Caramel), responsive layout primitives
- **Database & ORM:** Prisma ORM 6.19 with SQLite (zero-config, self-contained, schema-compatible with PostgreSQL)
- **Authentication:** Server-side secure HTTP-only cookies (`hb_admin_session`) with bcrypt password hashing
- **Validation:** Zod v3 schemas for forms, server actions, API routes, and environment variables
- **State & Cart:** Persistent client Cart Context with localStorage synchronization, quantity steppers, and promo code support
- **Testing:** Vitest 5.0 with 18 automated unit and integration tests

---

## 3. Quick Start & Local Development

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 3: Database Migration & Seeding
```bash
npx prisma db push
npm run seed
```
This initializes the database schema, provisions business settings, seeds the initial administrator account, creates 6 bakery categories, 8 artisan products with variants and photography, and sets up the `SWEETWELCOME` promotional code.

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Default Administrator Credentials

- **Admin Portal URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@homebakery.pk`
- **Password:** `HomeBakeryAdmin2026!`
- **Role:** `ADMIN`

*(Credentials can be customized in `.env` before running `npm run seed:admin`)*

---

## 5. Verification & Testing

Run all unit and integration tests:
```bash
npm test
```

Execute production build:
```bash
npm run build
```

---

## 6. Route Map

### Public Storefront
- `/` — Cinematic editorial homepage with hero, categories, featured bakes, ordering steps, FAQs, and location.
- `/menu` — Interactive product catalog with search, category filtering, and sorting.
- `/product/[slug]` — Product detail page with variants, quantity, custom piping notes, and WhatsApp inquiry.
- `/cart` — Dedicated basket review with promo code validation and checkout trigger.
- `/checkout` — Validated checkout with takeout scheduling (date/time) and Pakistan phone validation.
- `/order/confirmation/[reference]` — Order confirmation with official reference and WhatsApp trigger.
- `/order/track` — Privacy-preserving order status lookup (requires Order Reference + Phone Number).
- `/about` — Bakery philosophy, ingredients, and Karachi kitchen standards.
- `/contact` — Contact numbers, Google Maps navigation link, and pickup hours.
- `/faq` — Detailed frequently asked questions.
- `/privacy`, `/terms`, `/refund-and-cancellation` — Transparent policy pages.
- `/maintenance` — Branded maintenance shield displayed when maintenance mode is active.

### Administrative Platform
- `/admin/login` — Secure sign-in with brute-force throttling and audit logging.
- `/admin` — Real-time kitchen KPI dashboard (orders today, pending, in oven, total sales).
- `/admin/orders` — Order pipeline management, status transitions, printable slips, and CSV export.
- `/admin/orders/[id]` — Detailed order editor with customer contact, items, and internal notes.
- `/admin/products` — Product catalog management (create, edit, archive, prices in PKR).
- `/admin/categories` — Category creation, slugs, and display order.
- `/admin/inventory` — Physical stock adjustments and low-stock warnings.
- `/admin/customers` — Customer insights aggregated from verified order records.
- `/admin/promotions` — Promo code generation (percentage or fixed PKR) and usage limits.
- `/admin/settings` — Business information, ordering toggles, and live Maintenance Mode switch.
- `/admin/audit-logs` — Immutable audit trail of administrative actions.
