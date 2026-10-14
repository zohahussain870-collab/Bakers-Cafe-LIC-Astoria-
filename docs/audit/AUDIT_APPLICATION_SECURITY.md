# Application Security & OWASP ASVS Audit Report

**Project:** Home Bakery Platform  
**Target:** Next.js Full-Stack Application, Server Endpoints & Client Surface  
**Audit Date:** October 14, 2026  
**Reference Frameworks:** OWASP Top 10 (2021), OWASP ASVS v4.0.3, OWASP File Upload Cheat Sheet  

---

## 1. Input Validation & Request Hygiene (ASVS V5)

### 1.1 Server-Side Schema Validation
- **Engine:** `zod` v3.
- **Order Placement (`/api/orders/create`):**
  - Validates `customerName` (string, 2–100 chars), `customerPhone` (string, min 10 digits), `requestedDate` (ISO format string), `requestedTime` (non-empty string), and `items` (array, min 1 item).
  - Rejects unknown or malicious payload parameters.
- **Order Tracking (`/api/orders/track`):**
  - Requires both `orderReference` (string) and `phone` (string, min 10 normalized digits).
- **Promotion Creation (`/api/admin/promotions`):**
  - Enforces uppercase alphanumeric code, positive discount value, and integer minimum order threshold.
- **Product Creation (`/api/admin/products`):**
  - Sanitizes title and slug, ensures base price is positive integer PKR, and strictly verifies image URL protocol (`https://` or `http://`).

### 1.2 Phone Number Normalization
- All Pakistani phone numbers are passed through `normalizeWhatsAppNumber()` in `src/lib/utils.ts`.
- Strips non-digit characters and normalizes local formats (`0330...` -> `92330...`, `+92 330...` -> `92330...`).

---

## 2. Injection & Browser Security (ASVS V5, V14)

### 2.1 SQL Injection (SQLi)
- **Status:** **IMMUNE.**
- **Verification:** The application uses Prisma ORM exclusively (`findUnique`, `findMany`, `create`, `update`, `transaction`). All user inputs are bound through parameterized queries. No raw SQL (`$queryRaw` or `$executeRawUnsafe`) exists anywhere in the codebase.

### 2.2 Cross-Site Scripting (XSS)
- **Status:** **MITIGATED.**
- **Verification:**
  - React 19 automatically escapes variables embedded in JSX expressions.
  - JSON-LD structured data in `src/app/layout.tsx` is serialized with `JSON.stringify()`, which escapes HTML special characters.
  - User-provided image URLs in product creation are validated to start with `https://` or `http://`, preventing `javascript:` pseudo-protocol execution.
  - Unescaped entity warnings in `BakeryStory.tsx` have been resolved.

### 2.3 Cross-Site Request Forgery (CSRF)
- **Status:** **MITIGATED.**
- **Verification:**
  - Administrative session cookies employ `SameSite=Lax`, preventing third-party origin submission on cross-site requests.
  - All modifying API routes (`POST`, `PUT`, `PATCH`, `DELETE`) require `Content-Type: application/json`. Modern browsers enforce CORS preflight for cross-origin JSON requests, preventing classic HTML form-based CSRF attacks.

---

## 3. HTTP Security Headers & Content Security Policy (ASVS V14)

Configured in `next.config.ts`:

| Header Name | Value | Purpose | Status |
| :--- | :--- | :--- | :---: |
| **Content-Security-Policy** | `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://*.google.com https://*.googleapis.com; font-src 'self' data:; connect-src 'self' https://wa.me; frame-ancestors 'none'; form-action 'self' https://wa.me; base-uri 'self';` | Restricts resource loading, script execution, framing, and form submissions. | **ACTIVE** |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS browser connections for 1 year. | **ACTIVE** |
| **X-Content-Type-Options** | `nosniff` | Prevents MIME-type sniffing. | **ACTIVE** |
| **X-Frame-Options** | `DENY` | Prevents clickjacking by disabling iframe embedding. | **ACTIVE** |
| **X-XSS-Protection** | `1; mode=block` | Enables legacy browser XSS filters. | **ACTIVE** |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Limits referrer leakage on cross-origin requests. | **ACTIVE** |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Disables sensitive device hardware features. | **ACTIVE** |

---

## 4. Media & File Upload Security Analysis

- **Architectural Fact:** The application does **not** expose a binary multipart upload endpoint (no `multer`, `form-data`, or disk upload script).
- **Design Pattern:** The catalog stores validated external CDN / Unsplash URLs in the `ProductImage` database table.
- **Threat Vector Mitigation:**
  - Because no executable files (e.g. PHP, SVG, HTML) are accepted or written to local storage, path traversal, shell upload, and arbitrary file execution risks are eliminated.
  - Image URLs submitted via `/api/admin/products` are strictly validated to require `https://` or `http://` protocols, eliminating `javascript:` or `data:text/html` vector payloads.
  - Next.js image optimization in `next.config.ts` enforces `remotePatterns` restricting external image domains to `images.unsplash.com`.

---

## 5. Rate Limiting Coverage

| Route | Target Operations | Applied Limit | Behavior on Limit |
| :--- | :--- | :--- | :--- |
| `/api/admin/login` | Sign-in attempts | 5 req / 15 min | HTTP 429 + Audit Log entry |
| `/api/orders/track` | Customer order lookup | 15 req / 1 min | HTTP 429 |
| `/api/orders/create` | Order submissions | 10 req / 1 min | HTTP 429 |

---

## 6. Secrets & Dependency Vulnerability Review

- **Committed Secrets:** Audited repository commits. `.env` is properly listed in `.gitignore`. No hardcoded private keys or production database connection strings are present in repository commits.
- **Dependencies Audited:**
  - Next.js: `16.4.0`
  - React: `19.3.0`
  - Prisma: `6.19.3`
  - bcryptjs: `3.0.3`
  - zod: `4.6.7`
- All dependencies originate from official npm registries. No malicious or unauthorized postinstall hooks were observed.
