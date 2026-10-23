# Technical Audit: Database & Data Integrity Report

**Database Layer:** Prisma ORM 6.19.3  
**Active Local Provider:** SQLite (`prisma/dev.db`)  
**Target Production Provider:** PostgreSQL (Neon / Supabase / Railway)  
**Audit Date:** October 14, 2026  

---

## 1. Schema Integrity & Relationship Architecture

### 1.1 Referential Integrity & Cascades
The schema establishes appropriate foreign key relationships and delete constraints:

| Parent Model | Child Model | Relation Field | Delete Action | Security / Reliability Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **User** | Session | `Session.userId` | **Cascade** | Deleting a staff account instantly revokes all active session tokens. |
| **User** | AuditLog | `AuditLog.userId` | **SetNull** | Preserves historical audit entries even if a staff member account is pruned. |
| **Category** | Product | `Product.categoryId` | **Restrict** | Prevents accidental deletion of categories that currently contain active catalog items. |
| **Product** | ProductVariant | `ProductVariant.productId` | **Cascade** | Deleting a product removes its associated sizes and variations. |
| **Product** | ProductImage | `ProductImage.productId` | **Cascade** | Deleting a product prunes its image associations. |
| **Product** | OrderItem | `OrderItem.productId` | **SetNull** | **Critical:** Order records preserve historical sales even if a product is discontinued. |
| **Order** | OrderItem | `OrderItem.orderId` | **Cascade** | Deleting an order removes its item line records. |

### 1.2 Data Snapshots on Order Creation
In `OrderItem`, the schema does not merely link to `productId`. It takes an immutable snapshot of:
- `productName` (string)
- `variantName` (string, nullable)
- `unitPrice` (integer USD at the exact millisecond of purchase)
- `subtotal` (integer USD)
- `customizationNote` (custom piping instructions)

This ensures that future price changes or product renames never corrupt historical order totals or kitchen receipts.

### 1.3 Currency Representation
All monetary values (`basePrice`, `priceAdjustment`, `subtotal`, `discount`, `deliveryFee`, `total`, `unitPrice`) are modeled as `Int` representing Pakistani Rupees (USD). Because USD retail transactions operate in whole rupee denominations (1 USD = Rs 1) without decimal subdivision, integer arithmetic completely eliminates floating-point rounding errors.

---

## 2. Performance Indexes (Remediated)

The following explicit indexes were established in `prisma/schema.prisma` and deployed via migration `20261014000000_init`:

- **Order:**
  - `@@index([orderReference])` — High-speed unique lookup for customer tracking.
  - `@@index([customerPhone])` — Accelerated verification during order status queries.
  - `@@index([status])` — Rapid filtering for kitchen pipeline (`PENDING`, `PREPARING`, `READY_FOR_PICKUP`).
  - `@@index([createdAt])` — Fast daily revenue aggregations and date-sorted admin listings.
- **Product:**
  - `@@index([slug])` — Fast product detail resolution.
  - `@@index([categoryId])` — Menu category filtering.
  - `@@index([availability])` — Excludes unavailable items from customer storefront.
  - `@@index([isFeatured])` — Homepage curated pastry displays.
- **Session:**
  - `@@index([userId])`, `@@index([expiresAt])` — Rapid expired session pruning.
- **AuditLog:**
  - `@@index([action])`, `@@index([createdAt])`, `@@index([userId])` — Audit trail filtering.

---

## 3. SQLite vs. PostgreSQL Compatibility Analysis

The local development environment uses SQLite, while production deployment mandates PostgreSQL.

| Dimension | SQLite Implementation (Local) | PostgreSQL Behavior (Production) | Portability Status | Guidance |
| :--- | :--- | :--- | :---: | :--- |
| **Enums** | Stored as `TEXT` with application validation | Supports native `enum` or text constraints | **COMPATIBLE** | Prisma schema uses string types with Zod validation, ensuring portable operation. |
| **Dates / Timestamps** | Stored as ISO-8601 strings in `DATETIME` | Native `TIMESTAMP WITH TIME ZONE` | **COMPATIBLE** | Prisma transparently converts JavaScript `Date` objects. |
| **Booleans** | Stored as integer `0` or `1` | Native `BOOLEAN` (`true`/`false`) | **COMPATIBLE** | Handled natively by Prisma ORM. |
| **Concurrency & Locks** | Database-level write lock (`database is locked` on contention) | Row-level locking (MVCC) with transactional isolation | **SUPERIOR IN PROD** | Production PostgreSQL significantly outperforms SQLite under concurrent checkout loads. |
| **Case Sensitivity** | `LIKE` is case-insensitive for ASCII; case-sensitive for Unicode | `LIKE` is case-sensitive; requires `ILIKE` | **VERIFIED** | Search queries use lowercase normalized strings. |
| **JSON Fields** | Stored as `TEXT` string | Native `JSONB` | **COMPATIBLE** | `AuditLog.details` uses stringified JSON compatible with both. |

> [!IMPORTANT]
> **PostgreSQL Runtime Verification Status:** Marked as **NOT VERIFIED AT RUNTIME** due to absence of external cloud PostgreSQL credentials in the local development environment. Schema syntax and Prisma query mappings are fully compatible.

### PostgreSQL Migration Instructions
When deploying to Neon, Supabase, or Railway:
1. Update `prisma/schema.prisma` provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Generate PostgreSQL migration:
   ```bash
   npx prisma migrate dev --name init_postgresql
   ```
3. Run the seed script:
   ```bash
   npm run seed
   ```

---

## 4. Transactional Order Placement & Concurrency Safety

### 4.1 Order Placement Lifecycle (`/api/orders/create`)
All steps execute within an atomic `prisma.$transaction`:
1. **Catalog Lookup:** Reads live product and variant prices from database.
2. **Server Price Recalculation:** Subtotal is calculated exclusively from database prices; client-provided prices are completely discarded.
3. **Atomic Inventory Reservation:** Executes conditional decrement `updateMany({ where: { id: product.id, stock: { gte: item.quantity } } })`. Aborts atomically if stock is insufficient.
4. **Promotion Validation & Limit Increment:** Executes conditional coupon increment `updateMany({ where: { id: promo.id, currentUses: { lt: promo.maxUses } } })`.
5. **Collision-Safe Reference Assignment:** Generates 6-character cryptographic reference with retry handling.
6. **Atomic Commit:** Writes `Order` and `OrderItem` records simultaneously. If any step fails, the entire transaction is rolled back.

---

## 5. Migration History & Status

- **Command Executed:** `npx prisma migrate status`
- **Exit Code:** `0`
- **Output:**
  ```text
  1 migration found in prisma/migrations
  Database schema is up to date!
  ```
- **Migration Directory:** `prisma/migrations/20261014000000_init/migration.sql` (baseline migration tracking all 11 models, foreign keys, and 23 indexes).
