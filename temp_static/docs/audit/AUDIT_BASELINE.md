# Independent Technical Audit: Baseline Verification Report

**Project:** Bakers Cafe LIC (Astoria, NY, USA)  
**Repository Path:** `c:\Users\Syed Ghazi Ali Zaidi\Desktop\Bakers Cafe LIC`  
**Audit Branch:** `audit/technical-security-remediation`  
**Base Commit:** `e5c6d6c`  
**Date of Audit:** October 14, 2026  
**Auditor Role:** Independent Principal Software Auditor, Senior Full-Stack Engineer, AppSec & Reliability Engineer  

---

## 1. Environment & Runtime Specifications

| Attribute | Observed Value | Verification Method |
| :--- | :--- | :--- |
| **Operating System** | Windows 10/11 x64 | PowerShell Environment Detection |
| **Shell** | PowerShell 5.1 / 7.x | Observed terminal execution |
| **Node.js Version** | `v24.18.0` | `node -v` |
| **NPM Version** | `11.16.0` | `npm -v` |
| **Git Version** | `2.56.0.windows.2` | `git --version` |
| **Framework** | Next.js `16.4.0` (Turbopack, App Router) | `package.json` inspection |
| **UI Library** | React `19.3.0` | `package.json` inspection |
| **Styling** | Tailwind CSS `v4` (`@tailwindcss/turbopack`) | `package.json` & `src/app/globals.css` |
| **Database ORM** | Prisma `6.19.3` | `package.json` & `prisma/schema.prisma` |
| **Local Database Provider** | SQLite (`prisma/dev.db`, 136 KB) | `prisma/schema.prisma` inspection |
| **Test Runner** | Vitest `5.0.4` | `package.json` & `vitest run` |
| **Linter** | ESLint `9.x` with `eslint-config-next 16.4.0` | `eslint.config.mjs` inspection |

---

## 2. Baseline Command Execution Matrix

Every command was executed directly against the local repository without mocks or synthetic exit codes.

| Command | Working Directory | Observed Exit Code | Execution Time | Direct Result & Observations |
| :--- | :--- | :---: | :---: | :--- |
| `npx prisma validate` | Repo root | **0** | ~4s | **PASSED.** Schema at `prisma/schema.prisma` is syntactically and semantically valid under Prisma 6.19.3. |
| `npx prisma migrate status` | Repo root | **1** | ~3s | **FAILED.** Returned exit code 1: *"No migration found in prisma/migrations. The current database is not managed by Prisma Migrate."* The database was populated using `prisma db push` rather than tracked, versioned migrations. |
| `npm run lint` | Repo root | **1** | ~32s | **FAILED.** 59 problems identified (6 fatal ESLint errors, 53 unused variable warnings). Key errors: `react-hooks/set-state-in-effect` in `CartContext.tsx:40:9`, unescaped HTML entities in `BakeryStory.tsx`, and forbidden `@typescript-eslint/no-explicit-any` instances. |
| `npx tsc --noEmit` | Repo root | **0** | ~7s | **PASSED.** Strict TypeScript type-check passed with zero compile-time type errors. |
| `npm test` | Repo root | **0** | ~2.3s | **PASSED (WITH LIMITATIONS).** 4 test files executed, 18/18 tests passed. However, critical gaps exist: `discounts.test.ts` tests a duplicated local mock function instead of production code; zero database tests, zero API route integration tests, and zero E2E tests exist. |
| `npm run build` | Repo root | **0** | ~11s | **PASSED.** Next.js 16.4.0 optimized production bundle compiled cleanly for all 43 app routes. |

---

## 3. Detailed Baseline Findings

### 3.1 Migration Tracking Gap (`npx prisma migrate status`)
- **Evidence:** `prisma/migrations` directory does not exist.
- **Root Cause:** Initial setup relied on `prisma db push` and `scripts/seed.ts` directly against `prisma/dev.db`.
- **Operational Risk:** Without repeatable migration files, moving to production PostgreSQL or deploying across team environments cannot guarantee deterministic schema synchronization.
- **Action Required:** Baseline migrations must be established and documented for both SQLite and PostgreSQL.

### 3.2 Linter Failures (`npm run lint`)
- **Evidence:** 6 errors and 53 warnings across multiple files.
  - `src/context/CartContext.tsx:40:9`: Calling `setState` synchronously within a `useEffect` triggers cascading re-renders.
  - `src/components/home/BakeryStory.tsx:53:66`: Unescaped apostrophe character `'` in JSX.
  - `src/app/api/admin/products/route.ts:80:42`: `Unexpected any. Specify a different type`.
  - `src/app/api/orders/create/route.ts:263:19`: `Unexpected any. Specify a different type`.
  - `src/components/admin/PromotionsManager.tsx:124:68`: `Unexpected any. Specify a different type`.
  - `src/components/products/MenuCatalog.tsx:91:60`: `Unexpected any. Specify a different type`.
- **Action Required:** Fix root causes, clean up unused imports/variables, eliminate `any` types with strong TypeScript interfaces, and eliminate the cascading effect in `CartContext.tsx`.

### 3.3 Test Suite Evaluation (`npm test`)
- **Claimed:** "18 automated tests passed".
- **Observed:** 18 tests indeed pass, but the tests do not verify true end-to-end commerce flows:
  - `tests/unit/discounts.test.ts` duplicates a mini discount function inside the test file itself rather than testing the application's actual discount logic.
  - `tests/unit/business-rules.test.ts` checks static string constants in `src/lib/constants.ts`.
  - `tests/integration/auth.test.ts` tests `bcrypt.hash` and `bcrypt.compare` in memory, but does not test admin session cookies, session expiry, token verification, or login API handlers.
- **Action Required:** Retain working tests, replace the decoupled discount test with imports from production modules, and add true database transaction and API integration tests.

---

## 4. Audit Baseline Status Summary

The project possesses a functional application architecture and successful Next.js production build, but claims of complete automated verification and clean baseline status are **unverified and refuted** by the failing ESLint suite and unmigrated database schema.
Remediation is required in Phase 12 to bring the baseline to 100% compliance.
