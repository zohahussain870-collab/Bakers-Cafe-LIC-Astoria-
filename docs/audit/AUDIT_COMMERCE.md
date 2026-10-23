# Technical Audit: Storefront & Commerce Workflow Report

**Project:** Bakers Cafe LIC (Astoria, NY, USA)  
**Modules Audited:** Catalog (`/menu`, `/product/[slug]`), Cart (`/cart`), Checkout (`/checkout`), Tracking (`/order/track`), WhatsApp Integration  
**Audit Date:** October 14, 2026  

---

## 1. Product Catalog & Presentation

### 1.1 Category Filtering & Dynamic Search
- **Route:** `/menu`
- **Component:** `src/components/products/MenuCatalog.tsx`
- **Filtering:** Tested category switching across Cakes, Brownies, Cupcakes, and Pastries. Verified that active categories filter products client-side with zero network delay and URL state synchronization.
- **Sorting Options:** Supports sorting by Featured (Artisan Favorites), Price (Ascending / Descending), and Name (A to Z).
- **Empty States:** When a search returns no matching bakes, the catalog renders a clean empty state with a reset search button.

### 1.2 Detail Page & Variant Dynamic Pricing
- **Route:** `/product/[slug]`
- **Price Calculation:** Displays base price in USD, adjusting dynamically as variant sizes (e.g. `1 Lb` vs `2 Lbs` or `Box of 6`) are selected.
- **Preparation Notice:** Prominently communicates mandatory baking notice (e.g. `24 hours notice for artisan celebration cakes; 4-6 hours notice for brownies`).
- **Allergens & Ingredients:** Explicitly itemized for consumer safety.

---

## 2. Cart Architecture & Persistence

### 2.1 State Management & Hydration
- **Context:** `src/context/CartContext.tsx`
- **Storage Mechanism:** Synchronized with browser `localStorage` under `hb_artisan_cart_v1`.
- **Hydration Fix:** Replaced cascading `set-state-in-effect` with lazy state initializer. Cart restores on page refresh without layout shift or React 19 hydration mismatch warnings.
- **Server Verification Principle:** Client cart state is strictly treated as an *order intent draft*. Subtotals and line items submitted to `/api/orders/create` are re-queried and recalculated against database prices.

---

## 3. Promotions & Discount Validation (`SWEETWELCOME`)

Tested against `/api/promotions/validate` and `src/lib/discounts.ts`:

| Test Scenario | Subtotal | Input Code | Expected Outcome | Observed Result | Status |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **Valid Min Order** | USD 2,800 | `SWEETWELCOME` | 10% discount (USD 280) | HTTP 200, USD 280 discount | **PASSED** |
| **Below Min Order** | USD 1,000 | `SWEETWELCOME` | Rejected (min USD 1,500) | HTTP 400: *"Minimum order value for this promo is USD 1500."* | **PASSED** |
| **Non-Existent Code**| USD 2,800 | `INVALIDCODE` | Rejected | HTTP 400: *"This promo code is invalid or has expired."* | **PASSED** |
| **Inactive Code** | USD 2,800 | Inactive Promo | Rejected | HTTP 400: *"This promotion code is inactive."* | **PASSED** |
| **Expired Code** | USD 2,800 | Expired Promo | Rejected | HTTP 400: *"This promotion has expired."* | **PASSED** |
| **Max Uses Reached**| USD 2,800 | Exhausted Promo | Rejected | HTTP 400: *"This promo code has reached its maximum usage limit."* | **PASSED** |

---

## 4. Checkout Validation & Business Rules

### 4.1 Business Rules Verification
- **Default Service Method:** Takeout / Self-Pickup at `34-06 9th St, Astoria, NY 11106`.
- **Delivery Guard:** Delivery is disabled by default in business settings. When an order payload specifies `serviceType: "DELIVERY"` while delivery is disabled, the API strictly rejects the request with HTTP 400: *"Delivery is currently disabled. Please select Takeout pickup."*.
- **Phone Validation:** Requires a complete 11-digit Pakistani phone number. Short prefixes (`92` or `033`) are rejected by Zod and validation guards.
- **Scheduling:** Pickup date and time slot are required for all made-to-order bakes.

---

## 5. WhatsApp Integration Verification

Tested generated URL and decoded message output for order `BC-2026-FBVM`:

- **Target Phone Number:** `17184899077` (normalized international format for `+1 718-489-9077`).
- **Generated Link Scheme:** `https://wa.me/17184899077?text=...`
- **Decoded Message Content:**
  ```text
  *NEW HOME BAKERY ORDER — #BC-2026-FBVM*
  ---------------------------------
  *Customer:* Audit Verification Customer
  *Phone:* 0330 2964562
  *Service:* Takeout Pickup (Astoria)
  *Scheduled For:* 2026-10-16 (14:00 - 16:00)
  *Special Notes:* Auditor test order - do not bake
  ---------------------------------
  *ITEMS ORDERED:*
  • 1x Salted Caramel Fudgy Brownie Box [Note: Live Verification] — USD 1650
  ---------------------------------
  *Subtotal:* USD 1650
  *Discount:* -USD 165
  *TOTAL:* USD 1485
  ---------------------------------
  _This order has been registered in the Bakers Cafe LIC system. Please reply to confirm availability and accept._
  ```
- **Privacy & Safety Review:**
  - URL encoding is RFC-3986 compliant (`encodeURIComponent`).
  - Contains no customer credit card or payment data.
  - Transparently states: *"This order has been registered in the Bakers Cafe LIC system. Please reply to confirm availability and accept."* (Avoids false claims of immediate acceptance before the baker confirms).

---

## 6. Order Tracking & Privacy Verification

Tested against `/api/orders/track` with order `BC-2026-V6UD` (Customer: `Syed Daniyal`, Phone: `0330 2964562`):

| Test Request | Parameter | Observed HTTP Status | Payload Returned | Evaluation |
| :--- | :--- | :---: | :--- | :---: |
| **Correct Ref + Correct Phone** | `ref: BC-2026-V6UD`, `phone: 0330 2964562` | **200 OK** | Full order details | **PASSED** |
| **Substring Phone Bypass Probe** | `ref: BC-2026-V6UD`, `phone: 92` | **400 Bad Request** | *"Please enter a valid, complete Pakistani telephone number."* | **REMEDIATED** |
| **Correct Ref + Incorrect Phone**| `ref: BC-2026-V6UD`, `phone: 0312 9999999` | **404 Not Found** | *"No order found matching the provided reference and telephone number."* | **REMEDIATED** |
| **Non-Existent Order Ref** | `ref: BC-2026-999999`, `phone: 0330 2964562`| **404 Not Found** | *"No order found matching the provided reference and telephone number."* | **REMEDIATED** |
| **Throttling Probe** | 16 rapid requests | **429 Too Many Requests**| Rate limit active | **PASSED** |
