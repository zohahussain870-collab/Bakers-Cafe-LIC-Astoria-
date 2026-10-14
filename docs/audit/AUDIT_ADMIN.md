# Technical Audit: Admin Console & Operational Controls Report

**Console URL:** `/admin`  
**API Endpoints:** `/api/admin/*`  
**Audit Date:** October 14, 2026  
**Auditor Role:** Operations Reliability & Application Security Specialist  

---

## 1. Kitchen KPI Dashboard (`/admin`)

### 1.1 Real Database Metrics Verification
- **Orders Today:** Queries `prisma.order.count({ where: { createdAt: { gte: startOfToday } } })` using Asia/Karachi midnight boundary.
- **Awaiting Confirmation:** Queries `prisma.order.count({ where: { status: 'PENDING' } })`.
- **In Oven / Preparing:** Queries `prisma.order.count({ where: { status: 'PREPARING' } })`.
- **Total Sales Revenue:** Computed via `prisma.order.aggregate({ where: { status: { in: ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED'] } }, _sum: { total: true } })`.
  - **Financial Accuracy Note:** Correctly **excludes** `CANCELLED` and unaccepted `PENDING` orders from revenue totals.
- **Low Stock Alerts:** Surfaces products where `isStockTracked === true` and `stock <= 5`.

---

## 2. Order Pipeline & Management (`/admin/orders`)

### 2.1 Status Lifecycle Verification
The 5-stage lifecycle was verified through direct API manipulation:
```
[ PENDING ] ──► [ CONFIRMED ] ──► [ PREPARING ] ──► [ READY_FOR_PICKUP ] ──► [ COMPLETED ]
      │
      └──► [ CANCELLED ]
```
- **Observed Test:** Order `HB-2026-FBVM` was transitioned from `PENDING` to `CONFIRMED` via `PATCH /api/admin/orders/[id]/status`.
- **Audit Logging:** Verified that `AuditLog` row was created with action `ORDER_STATUS_CHANGED`, recording previous status, new status, timestamp, and administrator identity.
- **Internal Kitchen Notes:** Verified that internal staff notes persist in the database without being exposed to public tracking APIs.
- **Order Slips & Printing:** `/admin/orders/[id]` provides clean, printable slips formatted for thermal receipt printers.
- **Bookkeeping CSV Export:** `GET /api/admin/orders/export` generates valid CSV files with RFC-4180 escaping and UTF-8 charset.

---

## 3. Product & Category Management (`/admin/products`, `/admin/categories`)

- **Product Creation:** Validates title, category, base price, and slug uniqueness. Enforces secure `https://` or `http://` protocols on image URLs.
- **Safe Archival (Soft Delete):** `DELETE /api/admin/products/[id]` does **not** destructively drop rows from the database. It updates `availability = "UNAVAILABLE"`, preserving historical order references in `OrderItem` while immediately removing the treat from public storefront browsing.
- **Category Slugs & Display Order:** Unique slug enforcement tested; duplicate slugs return HTTP 400.

---

## 4. Physical Inventory Controls (`/admin/inventory`)

- **Steppers & Batch Adjustments:** Supports positive and negative stock increments (`+1`, `-1`, `+5 Batch`).
- **Negative Stock Guard:** Verified that stock can never be reduced below zero (`Math.max(0, product.stock + delta)`).
- **Concurrency Protection:** Implemented conditional atomic updates in order placement to prevent stock from dropping below zero under simultaneous customer checkouts.
- **Audit Logging:** Every stock modification writes an `INVENTORY_ADJUSTED` audit log entry with previous stock and new stock.

---

## 5. Maintenance Mode Security Verification (Mandatory Deep Test)

A complete end-to-end operational and security test was conducted on the running application:

### Step-by-Step Test Execution & Evidence

| Step | Action Taken | Target Route | Executed Method | Observed Result | Evaluation |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **1** | Admin activates maintenance mode | `/api/admin/settings` | `PUT` with session cookie | HTTP 200; `isMaintenanceMode: true` saved to database | **PASSED** |
| **2** | Unauthenticated public visitor visits site | `/` | `GET` (no cookies) | Renders branded `MaintenanceShield` view with message: *"Kitchen closed for deep sanitization."* | **PASSED** |
| **3** | Direct API order placement attempted | `/api/orders/create` | `POST` (no cookies) | **HTTP 403 Forbidden**: `{"error": "Ordering is temporarily paused due to kitchen maintenance."}` | **PASSED** |
| **4** | Authenticated admin visits storefront | `/` | `GET` (with admin session cookie) | Bypasses maintenance shield; renders full storefront with sticky amber warning: *"MAINTENANCE MODE IS CURRENTLY ACTIVE"* | **PASSED** |
| **5** | Admin deactivates maintenance mode | `/api/admin/settings` | `PUT` with session cookie | HTTP 200; `isMaintenanceMode: false` saved to database | **PASSED** |
| **6** | Public visitor re-visits storefront | `/` | `GET` (no cookies) | Normal storefront immediately restored without server restart | **PASSED** |

### Key Security Determinations
- **Server-Side Enforcement:** Maintenance is enforced both in layout rendering (`src/app/(storefront)/layout.tsx`) AND at the API level (`/api/orders/create`). An attacker cannot bypass the maintenance shield by issuing direct API requests.
- **Admin Access Preservation:** `/admin/login` and admin management routes remain accessible during maintenance mode, allowing staff to manage existing orders and adjust kitchen settings.
- **Cache Invalidation:** Calling `revalidatePath('/', 'layout')` ensures that cached pages do not continue serving stale operational states after maintenance is toggled.
