# Technical Architecture & Security Model

## 1. System Architecture Overview

Bakers Cafe LIC is designed as an App Router Next.js full-stack application with strict separation between public customer storefront interactions and privileged administrative workflows:

```
[ Client Browser ]
        │
        ├── Storefront Routes (/, /menu, /product/*, /checkout)
        │       │
        │       └── React Server Components + Framer Motion Client Interactivity
        │               │
        │               └── Cart Context (localStorage sync + Client State)
        │
        └── Admin Routes (/admin/*)
                │
                └── Server-Enforced Auth Guard (HTTP-only Session Cookies)
                        │
                        └── Admin Dashboard & CRUD API Endpoints
                                │
[ Next.js API Routes & Server Endpoints ]
        │
        ├── Transaction-Safe Order Placement (/api/orders/create)
        ├── Promo Validation (/api/promotions/validate)
        ├── Privacy Order Tracking (/api/orders/track)
        └── Admin Operations (/api/admin/*)
                │
                ▼
[ Prisma ORM Layer (Type-Safe Schema) ]
        │
        ▼
[ Database: SQLite (Dev) / PostgreSQL (Prod) ]
```

---

## 2. Security Architecture & Threat Modeling (OWASP ASVS)

### 2.1 Authentication & Session Management
- **Password Storage:** Hashed using `bcryptjs` with 12 salt rounds. No plaintext passwords or insecure hashing algorithms are used.
- **Session Tokens:** Cryptographically generated 32-byte hex tokens stored in the database with strict expiration timestamps (`expiresAt`).
- **Cookie Security:** Cookies are configured with `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` (in production environments), preventing client-side JavaScript access and XSS token extraction.
- **Enumeration Protection:** Authentication failures return generic `"Invalid email or password"` error messages regardless of whether the email exists.
- **Audit Logging:** Every login success and failure is logged in the `AuditLog` table with timestamp and username.

### 2.2 Insecure Direct Object Reference (IDOR) Protection
- Customer orders are referenced via high-entropy, non-guessable alphanumeric references (e.g. `BC-2026-V6UD`).
- Order tracking requires **both** the Order Reference AND the customer's matching phone number.
- Sequential numeric order IDs are never exposed in public URLs or APIs.

### 2.3 Commerce & Transaction Integrity
- **Zero Client Trust:** Prices, subtotals, discounts, and delivery fees submitted by the client browser are completely ignored during order creation.
- **Database Recalculation:** All item prices, variant adjustments, and promotional discounts are recalculated inside a database transaction (`prisma.$transaction`).
- **Atomic Stock Reservation:** If stock tracking is enabled on a product, stock decrements are verified and executed atomically to prevent race conditions.

### 2.4 Maintenance Mode Architecture
- Persisted in the `BusinessSettings` table (`isMaintenanceMode: Boolean`).
- Enforced server-side in `src/app/(storefront)/layout.tsx` and `/api/orders/create`.
- Public visitors are intercepted and rendered the branded `MaintenanceShield` view.
- Authenticated administrators (`getCurrentAdmin()`) bypass the shield seamlessly and see an ambient administrative warning banner.
- Changes take effect instantly without rebuilding or redeploying the application via `revalidatePath`.

---

## 3. Database Schema Models

1. **User:** Staff and administrator accounts (`ADMIN`, `STAFF`).
2. **Session:** Active admin sessions with expiration timestamps.
3. **Category:** Bakery collections with slug, image, and display order.
4. **Product:** Artisan treats with integer base prices (USD), prep time, stock, and allergen notes.
5. **ProductVariant:** Size, weight, and flavor options with price adjustments.
6. **ProductImage:** High-resolution photography with alt text and display ordering.
7. **Order:** Master order record with reference, customer details, schedule, and financial totals.
8. **OrderItem:** Snapshot of items, prices, and custom piping notes at purchase time.
9. **Promotion:** Coupon codes with percentage or fixed USD discounts and usage counters.
10. **BusinessSettings:** Singleton record storing business truth, ordering toggles, and maintenance state.
11. **AuditLog:** Immutable audit trail for security and operational actions.
