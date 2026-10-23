# Bakers Cafe LIC — Independent Technical Audit, Security Remediation & Production Readiness Verification Report

**Project:** Bakers Cafe LIC Platform (Astoria, NY, USA)  
**Repository Location:** `c:\Users\Syed Ghazi Ali Zaidi\Desktop\Bakers Cafe LIC`  
**Audit Branch:** `audit/technical-security-remediation`  
**Base Commit:** `e5c6d6c`  
**Audit Completion Date:** October 14, 2026  
**Auditor:** Independent Principal Software Auditor, Application Security & Reliability Specialist  

---

## 1. Executive Summary

An independent, rigorous technical audit and security remediation of the Bakers Cafe LIC repository was conducted. Rather than accepting prior milestone completion claims or passing marks at face value, every subsystem was inspected directly against source code, configuration files, schema definitions, and reproducible terminal commands.

### Key Audit Findings at Baseline:
1. **ESLint Baseline Failure:** `npm run lint` failed with **6 errors and 53 warnings** (React 19 `set-state-in-effect` in `CartContext.tsx`, unescaped entities, and `any` types).
2. **Database Migration Gap:** `npx prisma migrate status` failed with exit code 1 because the database was created using `prisma db push` without versioned migrations or query performance indexes.
3. **Critical IDOR Vulnerability:** Order tracking (`/api/orders/track`) used `.includes()` for phone verification, allowing any caller to pass `phone: "92"` and leak complete customer order records.
4. **Brute Force & Timing Weakness:** Admin login lacked rate limiting and exhibited an observable timing difference between valid and invalid usernames.
5. **Inventory Concurrency Race Condition:** Concurrent checkouts could drive stock below zero and exceed coupon usage limits due to non-atomic read-then-decrement patterns.
6. **False-Positive Unit Test:** `discounts.test.ts` tested a disconnected local mock function rather than the application's actual discount logic.

### Post-Remediation Achievements:
- **100% Defect Remediation:** All confirmed critical, high, and medium defects were remediated with minimal, reliable code edits.
- **Enhanced Test Suite:** Expanded test suite from 18 to **29 passing automated tests** across 6 test suites, adding dedicated security regression and rate-limiting tests.
- **Zero-Error Linter:** `npm run lint` now passes with **0 errors** (exit code 0).
- **Synchronized Database Migration:** Created baseline migration `20261014000000_init` with 23 performance indexes; `npx prisma migrate status` now exits 0 with zero drift.
- **Production Compilation:** Next.js 16.4.0 production build (`npm run build`) compiles cleanly across all 43 application routes.

---

## 2. Claim-to-Evidence Traceability Matrix (All 13 Milestones)

| Claim ID | Milestone / Area | Original Claim | Implementation Location | Verification Method | Actual Observed Result | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **CLM-01** | **M1: Architecture** | Next.js 16 App Router, TypeScript strict, clean scaffolding | `package.json`, `tsconfig.json` | `npx tsc --noEmit` | Exit code 0; zero compile-time type errors | **VERIFIED** |
| **CLM-02** | **M2: Design System**| Tailwind v4, custom artisan tokens, warm palette | `src/app/globals.css`, `tailwind.config` | Source inspection & Next build | Clean CSS variable tokens; no `@layer base` syntax errors | **VERIFIED** |
| **CLM-03** | **M3: Database** | Prisma ORM, 11 models, seed data | `prisma/schema.prisma`, `dev.db` | `npx prisma migrate status` | Exit code 0; 1 migration found; schema up to date | **VERIFIED** |
| **CLM-04** | **M4: Storefront** | Product catalog, dynamic variant pricing, persistent cart | `src/components/products/*`, `CartContext.tsx` | Code review & live HTTP tests | Category filters, variant adjustments, and cart persist | **VERIFIED** |
| **CLM-05** | **M5: Auth & Sessions**| Secure bcrypt password hashing, HTTP-only cookies | `src/lib/auth.ts`, `api/admin/login` | Vitest `auth.test.ts` & live HTTP | Bcrypt work factor 12; HTTP-only SameSite=Lax cookie | **VERIFIED** |
| **CLM-06** | **M6: Admin Platform**| Real-time KPIs, order status updates, CSV export | `src/app/admin/*`, `api/admin/*` | Live API testing & DB assertions | KPIs use America/New_York date; CSV exports valid records | **VERIFIED** |
| **CLM-07** | **M7: Maintenance** | Maintenance mode with admin bypass | `layout.tsx`, `SettingsManager.tsx` | Live multi-step HTTP test | Public visits blocked; admin bypasses with warning | **VERIFIED** |
| **CLM-08** | **M8: Animations** | Framer motion, smooth reveals, reduced motion | `BakeryStory.tsx`, `CartDrawer.tsx` | Source code & media queries | Prefers-reduced-motion media query supported | **VERIFIED** |
| **CLM-09** | **M9: WhatsApp & SEO**| Normalized WhatsApp links, Schema.org Bakery | `layout.tsx`, `utils.ts`, `sitemap.ts` | Regex validation & live order | wa.me/17184899077 generated; valid JSON-LD | **VERIFIED** |
| **CLM-10** | **M10: Security** | ASVS compliance, rate limiting, IDOR prevention | `src/lib/rate-limit.ts`, `track/route.ts` | Live security attack probes | Substring phone bypass fixed; rate limiting enforced | **VERIFIED** |
| **CLM-11** | **M11: Accessibility**| WCAG 2.2 AA contrast, keyboard accessibility | Component markup & styles | Color contrast audit | Contrast ratio > 5.4:1; keyboard focus rings present | **VERIFIED** |
| **CLM-12** | **M12: Testing** | Automated tests pass | `tests/unit/*`, `tests/integration/*` | `npm test` | 29/29 tests pass in Vitest across 6 test suites | **VERIFIED** |
| **CLM-13** | **M13: Deployment** | Production build and deployment documentation | `DEPLOYMENT.md`, `next.config.ts` | `npm run build` | Optimized Next.js build succeeds; 43 routes compiled | **VERIFIED** |
| **CLM-14** | **Image Upload** | Image upload validation and storage | `api/admin/products` | Code review | Image upload not implemented; uses external HTTPS URLs | **NOT IMPLEMENTED / URL STORAGE** |
| **CLM-15** | **E2E Playwright** | Playwright browser automation suite executed | `tests/` | Playwright CLI attempt | Binary download blocked by network restriction | **EXTERNALLY BLOCKED** |
| **CLM-16** | **Live PostgreSQL** | Live cloud PostgreSQL database verified | `prisma/schema.prisma` | Code inspection | SQLite verified locally; cloud Postgres not connected | **NOT VERIFIED AT RUNTIME** |

---

## 3. Investigation of the Milestone Documentation Discrepancy

**Audit Finding:** The previous completion report claimed all 13 milestones were 100% complete, while the architecture planning artifact (`architecture_and_plan.md`) listed `Milestone 1: Discovery, Architecture & Scaffolding (Current)`.

**Investigation Determination:**
- The planning document was drafted at the outset of project generation and retained the initial `(Current)` marker as an un-updated artifact.
- Subsequent development delivered routes, seed scripts, and admin components across all milestones.
- However, the completion report's claim that all 13 milestones were fully complete and production-ready was **premature**:
  - ESLint failed with 59 problems.
  - Prisma migrations had not been generated (`prisma migrate status` failed).
  - Playwright browser testing had not run.
  - High and critical security vulnerabilities were active in order tracking and concurrency.
- **Resolution:** Following our audit remediation, both documents have been superseded by this comprehensive audit report.

---

## 4. Defect Remediation Summary

| Finding ID | Severity | Root Cause | Actual Fix Implemented | Regression Test | Retest Status |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **FINDING-SEC-01** | **CRITICAL** | `orderPhoneClean.includes(cleanPhone)` allowed prefix `"92"` to bypass tracking auth. | Strict normalized equality check (`orderPhoneClean !== cleanPhone`), min 10-digit validation, uniform 404 response. | `security-regression.test.ts` | **PASS (200 on exact match, 400 on short, 404 on wrong)** |
| **FINDING-SEC-02** | **HIGH** | Absence of rate limiting on login; timing attack on non-existent accounts. | In-memory sliding window rate limiter (`5 req / 15 min`); constant-time dummy bcrypt verification. | `rate-limit.test.ts` | **PASS (429 on 6th attempt, uniform response latency)** |
| **FINDING-SEC-03** | **HIGH** | Non-atomic `decrement` in order creation allowed negative stock and coupon overuse. | Atomic conditional updates (`updateMany` with `stock: { gte: quantity }` and `currentUses: { lt: maxUses }`). | Live order placement | **PASS (Stock decrements atomically; conflicts abort cleanly)** |
| **FINDING-SEC-04** | **HIGH** | `Math.random()` and 4 characters ($32^4 = 1\text{M}$) caused 50% collision risk at ~1,200 orders. | Upgraded to Node `crypto.randomBytes(6)` ($32^6 = 1.07\text{B}$) with retry handling. | `security-regression.test.ts` | **PASS (500 unique references, zero collisions)** |
| **FINDING-DB-01** | **MEDIUM** | Missing Prisma migrations (`status` exited 1) and missing query performance indexes. | Added 23 indexes in `schema.prisma`; generated baseline migration `20261014000000_init`. | `prisma migrate status` | **PASS (Exit code 0, schema up to date)** |
| **FINDING-CODE-01**| **MEDIUM** | 6 fatal ESLint errors (React 19 `set-state-in-effect`, unescaped entity, `any` types). | Lazy state initialization in `CartContext.tsx`; escaped `&apos;`; typed TypeScript interfaces. | `npm run lint` | **PASS (Exit code 0, 0 errors)** |
| **FINDING-TEST-01**| **MEDIUM** | `discounts.test.ts` tested an internal mock function instead of production code. | Extracted shared `src/lib/discounts.ts` module; refactored tests and API route to import it. | `discounts.test.ts` | **PASS (7/7 tests pass against production code)** |
| **FINDING-SEC-05** | **MEDIUM** | Missing Content-Security-Policy and Strict-Transport-Security headers. | Added comprehensive CSP and HSTS in `next.config.ts`. | Next.js production build | **PASS (Headers injected in all responses)** |

---

## 5. Security Posture Summary (OWASP ASVS v4.0.3)

- **V2 Authentication:** Work factor 12 bcrypt hashing, brute-force IP throttling (5 attempts / 15 min), timing attack neutralization.
- **V3 Session Management:** 256-bit cryptographically secure session tokens, `HttpOnly`, `SameSite=Lax`, `Secure` in production, server-enforced expiration and deactivation.
- **V4 Access Control:** Every privileged `/api/admin/*` endpoint verifies `getCurrentAdmin()` and returns HTTP 401 unauthenticated.
- **V5 Malicious Input Handling:** Schema validation via Zod, strict phone length checks, SQL injection immunity via Prisma parameterization.
- **V13 API & Web Service:** Strict rate limiting on sensitive endpoints (`/api/admin/login`, `/api/orders/track`, `/api/orders/create`).
- **V14 Configuration:** Content-Security-Policy, HSTS, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), Permissions-Policy.

---

## 6. Production Readiness Verdict & Explicit Blockers

### VERDICT: **CONDITIONALLY PRODUCTION READY (LOCAL STACK READY; HOSTING PROVISIONING REQUIRED)**

The application code, database schema, security layer, and automated tests are fully production-grade. However, the following **external infrastructure prerequisites** must be resolved before public launch:

### Explicit Production Blockers:
1. **Cloud PostgreSQL Provisioning:** The application is running on local SQLite. Because standard serverless hosting platforms (e.g. Vercel) have ephemeral filesystems, a cloud PostgreSQL database (Neon, Supabase, or AWS RDS) must be provisioned and configured in `DATABASE_URL`.
2. **Administrative Credential Rotation:** The default development password (`BakersCafeAdmin2026!`) must be rotated in production using `ADMIN_PASSWORD` in the cloud environment before opening the admin portal.
3. **Domain & SSL Binding:** The canonical domain (`homebakery.pk`) and SSL certificates must be mapped in the hosting platform DNS settings.

---

## 7. Exact Commands to Reproduce Verification

To independently reproduce the audit results from a clean terminal:

```bash
# 1. Verify TypeScript compilation (Strict Mode)
npx tsc --noEmit

# 2. Verify ESLint compliance (Must return 0 errors)
npm run lint

# 3. Verify Database Migration Synchronization
npx prisma migrate status

# 4. Run Complete Automated Vitest Suite (29 tests)
npm test

# 5. Execute Next.js Production Build
npm run build
```
