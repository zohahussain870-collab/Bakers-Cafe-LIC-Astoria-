# Prioritized Audit Defect & Security Findings Register

**Project:** Home Bakery (Karachi, Pakistan)  
**Repository Path:** `c:\Users\Syed Ghazi Ali Zaidi\Desktop\Home Bakery`  
**Audit Branch:** `audit/technical-security-remediation`  
**Audit Date:** October 14, 2026  
**Auditor Role:** Independent Principal Software Auditor, Application Security & Reliability Reviewer  

---

## 1. Severity Classification Framework

- **CRITICAL:** Remote code execution, authentication/authorization bypass, customer cross-account data exposure (IDOR), or immediate compromise of data confidentiality.
- **HIGH:** Exploitable privilege escalation, order/inventory concurrency corruption, race conditions in payments/discounts, or absence of brute-force throttling on privileged gateways.
- **MEDIUM:** Security posture gaps (missing headers, timing attacks), build/lint failures, detached unit tests, or unindexed database schemas.
- **LOW:** Minor documentation discrepancies, credential hygiene, or cosmetic code warnings.
- **INFORMATIONAL:** Architecture recommendations, production deployment warnings, and hosting advisories.

---

## 2. Findings Summary Matrix

| Finding ID | Severity | Category | Status | Summary |
| :--- | :---: | :--- | :---: | :--- |
| **FINDING-SEC-01** | **CRITICAL** | Authorization / IDOR | **RESOLVED** | Order tracking substring phone bypass via `.includes()` allowed leaking full customer order data using prefix `"92"`. |
| **FINDING-SEC-02** | **HIGH** | AppSec / Brute Force | **RESOLVED** | Missing rate limiting & timing attack vulnerability in administrator login endpoint (`/api/admin/login`). |
| **FINDING-SEC-03** | **HIGH** | Concurrency / Integrity | **RESOLVED** | Non-atomic inventory decrement and coupon usage counter race conditions in `/api/orders/create`. |
| **FINDING-SEC-04** | **HIGH** | Cryptography / IDOR | **RESOLVED** | Low entropy (4 characters, ~1M combinations) and `Math.random()` in order reference generation caused high birthday attack collision probability. |
| **FINDING-DB-01** | **MEDIUM** | Database / Reliability | **RESOLVED** | Database lacked Prisma migration history (`npx prisma migrate status` exited 1) and query performance indexes. |
| **FINDING-CODE-01**| **MEDIUM** | Code Quality / Lint | **RESOLVED** | `npm run lint` failed with 6 fatal errors and 53 warnings (React 19 `set-state-in-effect`, unescaped entities, `any` casts). |
| **FINDING-TEST-01**| **MEDIUM** | QA Verification | **RESOLVED** | `discounts.test.ts` tested a disconnected local mock function rather than application code. |
| **FINDING-SEC-05** | **MEDIUM** | Network Security | **RESOLVED** | Missing Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS) headers in `next.config.ts`. |
| **FINDING-AUTH-01**| **LOW** | Credential Hygiene | **RESOLVED** | Publicly disclosed bootstrap password (`HomeBakeryAdmin2026!`) documented; rotation procedures established. |
| **FINDING-DOC-01** | **LOW** | Documentation | **RESOLVED** | Discrepancy between completion report (all 13 milestones complete) and plan artifact (Milestone 1 current). |

---

## 3. Detailed Findings & Remediation Records

### FINDING-SEC-01: Order Tracking IDOR / Substring Phone Bypass
- **Severity:** **CRITICAL**
- **Affected File:** `src/app/api/orders/track/route.ts` (lines 34–40)
- **Root Cause:** The phone matching logic was written as:
  ```ts
  const orderPhoneClean = normalizeWhatsAppNumber(order.customerPhone);
  if (!orderPhoneClean.includes(cleanPhone) && !cleanPhone.includes(orderPhoneClean)) {
    return NextResponse.json({ error: "The phone number does not match this order reference." }, { status: 403 });
  }
  ```
  Because all Pakistani telephone numbers normalized for WhatsApp start with `92...`, passing `phone: "92"` or `"923"` caused `orderPhoneClean.includes(cleanPhone)` to evaluate to `true`. Negating this resulted in `false`, bypassing the check entirely and rendering the full order details.
- **Exploitation Evidence:**
  Direct curl/PowerShell request with reference `HB-2026-V6UD` and `phone: "92"` returned HTTP 200 with complete customer name (`Syed Daniyal`), items, customization notes, and totals.
- **Correction Performed:**
  1. Enforced minimum phone length validation (`cleanPhone.length >= 10`).
  2. Replaced substring matching with strict normalized equality: `if (orderPhoneClean !== cleanPhone)`.
  3. Replaced 403 status with generic 404 (`"No order found matching the provided reference and telephone number."`) to eliminate order reference enumeration.
  4. Added IP rate limiting (15 requests/minute).
- **Regression Test:** `tests/integration/security-regression.test.ts` (verifies substring bypass rejection and exact phone matching).
- **Retest Result:** Request with `phone: "92"` returns HTTP 400 (`"Please enter a valid, complete Pakistani telephone number."`). Request with incorrect 11-digit phone returns HTTP 404. Valid matching phone returns HTTP 200.
- **Residual Risk:** None.

---

### FINDING-SEC-02: Missing Brute Force & Rate Limiting Protection on Admin Login
- **Severity:** **HIGH**
- **Affected File:** `src/app/api/admin/login/route.ts`
- **Root Cause:**
  1. No rate limiting middleware or request throttling was implemented on the login route.
  2. If an email did not exist, the route returned immediately (~2ms); if the email existed, it computed `bcrypt.compare` (~200ms). This timing discrepancy permitted username enumeration.
- **Correction Performed:**
  1. Implemented in-memory sliding window rate limiter in `src/lib/rate-limit.ts` (max 5 login attempts per 15 minutes per IP).
  2. Added dummy bcrypt hash comparison (`verifyPassword(password, DUMMY_HASH)`) when an email is not found, ensuring uniform response times across valid and invalid accounts.
  3. Recorded IP address in `AuditLog` table on both failed and successful logins.
- **Regression Test:** `tests/unit/rate-limit.test.ts` (verifies sliding window thresholding and IP isolation).
- **Retest Result:** Exceeding 5 attempts returns HTTP 429 (`"Too many failed login attempts from this network. Access is throttled for 15 minutes."`).
- **Residual Risk:** In multi-instance serverless deployments without shared Redis/database store, in-memory rate limits apply per container instance. Recommended production runbook advises deploying a centralized Redis rate limiter.

---

### FINDING-SEC-03: Inventory & Coupon Concurrency Race Conditions
- **Severity:** **HIGH**
- **Affected File:** `src/app/api/orders/create/route.ts`
- **Root Cause:**
  `findUnique` followed by non-conditional `update({ data: { stock: { decrement: item.quantity } } })` permitted negative inventory when two requests competed for the last available item. The same flaw permitted concurrent requests to exceed promotion `maxUses`.
- **Correction Performed:**
  Replaced non-conditional updates with atomic conditional updates:
  ```ts
  const updateResult = await tx.product.updateMany({
    where: { id: product.id, stock: { gte: item.quantity } },
    data: { stock: { decrement: item.quantity } },
  });
  if (updateResult.count === 0) {
    throw new Error(`Insufficient stock for "${product.name}". The item was just claimed by another order.`);
  }
  ```
  Similarly implemented atomic conditional reservation on `Promotion.currentUses` with `where: { currentUses: { lt: promo.maxUses } }`.
- **Retest Result:** Atomic operations verify count > 0 before proceeding; conflicting updates safely abort transaction.
- **Residual Risk:** None.

---

### FINDING-SEC-04: Low Entropy & Weak Randomness in Order References
- **Severity:** **HIGH**
- **Affected File:** `src/lib/utils.ts`
- **Root Cause:**
  `generateOrderReference()` used `Math.random()` to generate a 4-character code from a 32-character alphabet ($32^4 = 1,048,576$ combinations). Under the birthday paradox, collision probability exceeded 50% after approximately 1,200 orders.
- **Correction Performed:**
  Upgraded to Node.js `crypto.randomBytes(6)` producing a 6-character code ($32^6 = 1,073,741,824$ combinations). Added collision retry loop in `orders/create/route.ts` (up to 3 retries).
- **Regression Test:** `tests/integration/security-regression.test.ts` (generates 500 consecutive references verifying format and zero collisions).
- **Retest Result:** Format matches `HB-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}` with 100% uniqueness.
- **Residual Risk:** None.

---

### FINDING-DB-01: Missing Database Migration History and Query Performance Indexes
- **Severity:** **MEDIUM**
- **Affected Files:** `prisma/schema.prisma`, `prisma/migrations`
- **Root Cause:**
  The baseline audit command `npx prisma migrate status` exited with code 1 because the database was created using `prisma db push` without versioned migrations. Furthermore, key search columns (`customerPhone`, `status`, `categoryId`, `createdAt`) lacked indexes.
- **Correction Performed:**
  1. Added explicit indexes across `Order`, `Product`, `Session`, `Promotion`, and `AuditLog` models in `prisma/schema.prisma`.
  2. Generated baseline migration `prisma/migrations/20261014000000_init/migration.sql`.
  3. Resolved baseline in database via `npx prisma migrate resolve --applied 20261014000000_init`.
- **Retest Result:** `npx prisma migrate status` exits 0: *"1 migration found in prisma/migrations. Database schema is up to date!"*.
- **Residual Risk:** None.

---

### FINDING-CODE-01: ESLint Suite Failures (6 Errors, 53 Warnings)
- **Severity:** **MEDIUM**
- **Affected Files:** `CartContext.tsx`, `BakeryStory.tsx`, `MenuCatalog.tsx`, `PromotionsManager.tsx`, API routes.
- **Root Cause:**
  - `CartContext.tsx`: `useEffect` synchronously invoked `setItems(JSON.parse(saved))` triggering cascading renders in React 19.
  - `BakeryStory.tsx`: Unescaped apostrophe `'` in JSX.
  - TypeScript `any` type annotations in API routes and components.
- **Correction Performed:**
  1. Refactored `CartContext.tsx` to use lazy state initialization (`useState(() => ...)`).
  2. Escaped `'` to `&apos;` and cleaned unused imports.
  3. Replaced all `any` types with strong TypeScript interfaces (`VariantInput`, strict unions).
- **Retest Result:** `npm run lint` exits 0 with 0 errors.
- **Residual Risk:** None.

---

### FINDING-TEST-01: Mock-Only Discount Test Suite
- **Severity:** **MEDIUM**
- **Affected File:** `tests/unit/discounts.test.ts`
- **Root Cause:**
  `discounts.test.ts` contained an internal duplicate function `calculateDiscount` and did not test application code.
- **Correction Performed:**
  Created production engine `src/lib/discounts.ts` with `evaluatePromotion()` and refactored both `api/promotions/validate` and `tests/unit/discounts.test.ts` to share the real module.
- **Retest Result:** 7 comprehensive unit tests pass testing minimum order value, expired promos, max usage limits, and capping.
- **Residual Risk:** None.

---

### FINDING-SEC-05: Missing Security Headers (CSP, HSTS)
- **Severity:** **MEDIUM**
- **Affected File:** `next.config.ts`
- **Root Cause:**
  `next.config.ts` lacked Content-Security-Policy (CSP) and HTTP Strict Transport Security (HSTS).
- **Correction Performed:**
  Added comprehensive CSP header and HSTS (`max-age=31536000; includeSubDomains; preload`).
- **Retest Result:** Observed in Next.js production build and runtime responses.
- **Residual Risk:** None.
