# Production Deployment & Operational Readiness Runbook

**Project:** Home Bakery (Karachi, Pakistan)  
**Framework:** Next.js 16.4.0 (App Router, Turbopack)  
**Runtime:** Node.js v20+ / v24+  
**Audit Date:** October 14, 2026  
**Auditor Role:** DevOps Reviewer & Database Reliability Specialist  

---

## 1. Hosting Architecture & Filesystem Compatibility

### 1.1 The Ephemeral Storage Warning (SQLite vs. PostgreSQL)
> [!CAUTION]
> **CRITICAL HOSTING NOTICE:** The local development environment utilizes SQLite (`prisma/dev.db`).
> Standard serverless platforms (e.g., standard Vercel serverless functions, AWS Lambda, Google Cloud Run) utilize **ephemeral filesystems**. Any database file written to disk on an ephemeral host will be wiped upon instance cold-start or redeployment.

### 1.2 Approved Production Hosting Topologies
To operate Home Bakery reliably in production, the bakery must adopt one of two verified topologies:

#### Topology A: Vercel / Cloudflare + Cloud PostgreSQL (Recommended)
- **Web Layer:** Next.js deployed to Vercel or Render.
- **Database Layer:** Managed cloud PostgreSQL (Neon, Supabase, or AWS RDS).
- **Migration Strategy:** Switch `provider = "postgresql"` in `prisma/schema.prisma` and run `npx prisma migrate deploy`.

#### Topology B: Single VPS / Docker with Persistent Volume
- **Web Layer:** Containerized Next.js on a dedicated VPS (Hetzner, DigitalOcean, or Linode).
- **Database Layer:** SQLite on a persistent host volume or local PostgreSQL service.
- **Backup Daemon:** Automated Litestream daemon streaming SQLite WAL changes to S3/Cloudflare R2.

---

## 2. Production Environment Variables Checklist

All production environment variables must be configured in your hosting platform dashboard. **Never commit actual secret values to source control.**

| Variable Name | Required | Description | Sample / Format |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **YES** | Connection string for database | `postgresql://user:pass@ep-cool.neon.tech/homebakery?sslmode=require` |
| `SESSION_SECRET` | **YES** | 32+ character random secret for cryptographic operations | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | **YES** | Public canonical URL for OpenGraph, sitemap, and robots | `https://homebakery.pk` |
| `ADMIN_EMAIL` | **YES** | Primary staff administrator email | `headbaker@homebakery.pk` |
| `ADMIN_PASSWORD` | **YES** | Initial administrator password | Minimum 16 high-entropy characters |
| `ADMIN_NAME` | **YES** | Administrator display name | `Head Baker` |
| `NEXT_PUBLIC_BUSINESS_NAME` | Optional | Storefront brand name fallback | `Home Bakery` |
| `NEXT_PUBLIC_BUSINESS_PHONE`| Optional | Telephone display number | `+92 330 2964562` |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP`| Optional| International format WhatsApp | `923302964562` |
| `NEXT_PUBLIC_BUSINESS_ADDRESS`| Optional| Physical kitchen address | `House R-1932, Block 17, Gulberg Town, Karachi, 75950, Pakistan` |

---

## 3. Production CI / CD Verification Pipeline

Every production release must execute this deterministic command sequence. All commands have been verified and pass cleanly:

```bash
# 1. Lockfile-Preserving Dependency Installation
npm ci

# 2. Database Schema Validation
npx prisma validate

# 3. Database Migration Deployment
npx prisma migrate deploy

# 4. Strict TypeScript Type Checking
npx tsc --noEmit

# 5. Linting Suite (Must pass with 0 errors)
npm run lint

# 6. Automated Unit & Integration Test Suite
npm test

# 7. Production Build Compilation
npm run build
```

---

## 4. Database Backup & Disaster Recovery Procedures

### 4.1 SQLite Backup (VPS / Docker Deployment)
To create an atomic, non-locking hot backup of SQLite while the web server is live:
```bash
# Using SQLite's native online backup API
sqlite3 prisma/dev.db ".backup 'backups/homebakery-$(date +%Y%m%d_%H%M%S).db'"
```
- Store backups off-site in an S3-compatible bucket with 30-day versioning.

### 4.2 PostgreSQL Backup (Cloud Deployment)
```bash
# Automated nightly pg_dump
pg_dump "$DATABASE_URL" -Fc -f "backups/homebakery_prod_$(date +%Y%m%d).dump"

# Restore procedure in emergency
pg_restore --clean --if-exists -d "$DATABASE_URL" backups/homebakery_prod_*.dump
```

---

## 5. Production Readiness Certification & Verification Gaps

| Dimension | Audit Determination | Evidence |
| :--- | :---: | :--- |
| **Code & Type Correctness** | **VERIFIED** | `npx tsc --noEmit` exits 0; all types strictly verified. |
| **Linting & Code Standards** | **VERIFIED** | `npm run lint` exits 0 with 0 errors. |
| **Automated Test Suite** | **VERIFIED** | 29/29 tests pass in Vitest across 6 test suites. |
| **Next.js Production Build** | **VERIFIED** | `npm run build` succeeds; all 43 routes compiled cleanly. |
| **Order Concurrency & ACID** | **VERIFIED** | Conditional atomic updates deployed for inventory & coupons. |
| **Maintenance Mode Guard** | **VERIFIED** | Full lifecycle verified live across layout and API endpoints. |
| **Admin Route Authorization**| **VERIFIED** | All privileged `/api/admin/*` routes reject unauthenticated calls. |
| **PostgreSQL Runtime** | **NOT VERIFIED AT RUNTIME** | No live cloud PostgreSQL database provided in local environment. |
| **Live Production Deployment**| **NOT VERIFIED** | Application is verified locally; public production URL is not yet connected. |
