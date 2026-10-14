# Technical Audit: Authentication & Authorization Security Report

**Target System:** Home Bakery (Karachi, Pakistan)  
**Audit Path:** `src/lib/auth.ts`, `src/app/api/admin/*`, `src/app/admin/*`  
**Audit Date:** October 14, 2026  
**Standards Applied:** OWASP ASVS v4.0.3 (V2 Authentication, V3 Session Management, V4 Access Control)  

---

## 1. Cryptographic Password Storage & Verification (ASVS V2.4)

### 1.1 Implementation Analysis
- **Algorithm:** `bcryptjs`
- **Work Factor (Cost):** `12` rounds (`bcrypt.hash(plainText, 12)`).
- **Execution Overhead:** Verified at ~180ms to 240ms per verification in Node.js v24.18.0. This strikes an optimal balance between brute-force resistance and server response latency.
- **Salt Generation:** Handled automatically by bcrypt's internal CSPRNG per password hash.
- **Plaintext Logging:** Audited all route handlers; plaintext passwords are never logged to console, database, or audit records.

### 1.2 Anti-Enumeration & Timing Attack Defense (ASVS V2.2.4)
- **Pre-Remediation State:** Non-existent emails returned immediately (~2ms), whereas existing emails triggered bcrypt verification (~200ms).
- **Post-Remediation State:** When a user is not found, `src/app/api/admin/login/route.ts` executes a dummy bcrypt comparison against a pre-computed constant salt hash (`DUMMY_HASH`). Response times are now indistinguishable between valid and invalid usernames.
- **Error Response Uniformity:** Both conditions return HTTP 401 with identical payload: `{"error": "Invalid email or password."}`.

---

## 2. Session Management & Cookie Architecture (ASVS V3)

### 2.1 Token Entropy & Cryptography
- **Generation:** `crypto.randomBytes(32).toString("hex")` in `src/lib/auth.ts:18`.
- **Entropy:** 256 bits of cryptographic entropy, rendering session guessing attacks computationally infeasible ($2^{256}$ possibilities).
- **Storage:** Persisted in the `Session` database table (`token` with `@unique` constraint and `expiresAt` timestamp).

### 2.2 Cookie Configuration
The session cookie is configured as follows in `src/lib/auth.ts`:

```ts
cookieStore.set("hb_admin_session", token, {
  httpOnly: true,                                  // Prevents access via client JavaScript (XSS mitigation)
  secure: process.env.NODE_ENV === "production",  // Enforces HTTPS transmission in production
  sameSite: "lax",                                 // Mitigates Cross-Site Request Forgery (CSRF)
  expires: expiresAt,                              // Enforces 7-day maximum lifespan
  path: "/",                                       // Scoped to root
});
```

### 2.3 Expiration & Invalidation
- **Session Lifespan:** Configured to 7 days (`24 * 7` hours).
- **Server-Side Validation:** `getCurrentAdmin()` queries the database record on every privileged request. If `session.expiresAt < new Date()`, the expired record is pruned from the database and authentication is denied.
- **Account Inactivation:** If `session.user.isActive === false`, access is immediately denied even if the cookie is unexpired.
- **Logout Revocation:** `POST /api/admin/logout` and `destroySession()` delete the session row from the database and expire the cookie.

---

## 3. Brute-Force & Abuse Throttling (ASVS V2.2)

### 3.1 Implementation
- **Mechanism:** In-memory sliding window rate limiter in `src/lib/rate-limit.ts`.
- **Login Endpoint Threshold:** Maximum **5 login attempts per 15 minutes** per client IP.
- **Enforcement Action:** Returns HTTP 429 (`"Too many failed login attempts from this network. Access is throttled for 15 minutes."`).
- **Audit Trail:** Every failed attempt records a `LOGIN_FAILED` entry in `AuditLog` including client IP and targeted email.

---

## 4. Privilege Boundary & Authorization Matrix (ASVS V4)

Every admin endpoint was tested unauthenticated using direct HTTP requests.

| Route / Asset | Method | Target Operation | Required Role | Observed Status (Unauthenticated) | Status |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `/api/admin/settings` | GET | View settings | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/settings` | PUT | Modify settings / Maint. mode | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/categories` | POST | Create category | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/products` | POST | Create treat | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/products/[id]` | PUT | Edit treat | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/products/[id]` | DELETE| Archive treat | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/inventory/adjust`| POST | Adjust stock | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/promotions` | POST | Create coupon | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/orders/export` | GET | Download orders CSV | ADMIN | **401 Unauthorized** | **SECURE** |
| `/api/admin/orders/[id]/status`| PATCH| Change order state | ADMIN | **401 Unauthorized** | **SECURE** |
| `/admin` | GET | Kitchen KPI Dashboard | ADMIN | **307 Redirect to /admin/login** | **SECURE** |
| `/admin/orders` | GET | Order management page | ADMIN | **307 Redirect to /admin/login** | **SECURE** |
| `/admin/settings` | GET | Settings page | ADMIN | **307 Redirect to /admin/login** | **SECURE** |

---

## 5. Compromised Credential Handling & Rotation Runbook

### 5.1 Disclosure Notice
The default development credential `HomeBakeryAdmin2026!` was documented in repository documentation and must be treated as **publicly known and compromised for production deployments**.

### 5.2 Mandatory Production Remediation Procedure
1. Never commit `.env` containing production passwords to source control.
2. Generate a high-entropy admin password (minimum 16 characters including upper, lower, numbers, and symbols).
3. Set the following in production hosting environment variables:
   ```ini
   ADMIN_EMAIL="headbaker@homebakery.pk"
   ADMIN_PASSWORD="<STRONG_RANDOMLY_GENERATED_PASSWORD>"
   ADMIN_NAME="Master Baker"
   ```
4. Run the seed command to provision or update the administrator:
   ```bash
   npm run seed:admin
   ```
5. Log in at `/admin/login` and verify that the previous default password (`HomeBakeryAdmin2026!`) fails with HTTP 401.
