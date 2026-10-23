# Bakers Cafe LIC — Administrator User Handbook

Welcome to the Bakers Cafe LIC administration console. This handbook guides bakery staff on daily operations, kitchen workflow, order acceptance, and catalog adjustments.

---

## 1. Accessing the Admin Console

- **URL:** `/admin/login`
- **Default Login:** `admin@bakerscafelic.com`
- **Default Password:** `BakersCafeAdmin2026!`

After signing in, you will be taken to the **Kitchen Overview** dashboard.

---

## 2. Managing Orders & Daily Kitchen Workflow

Orders follow a 5-stage lifecycle designed for made-to-order baking:

```
[ PENDING ] ──► [ CONFIRMED ] ──► [ PREPARING ] ──► [ READY FOR PICKUP ] ──► [ COMPLETED ]
      │
      └──► [ CANCELLED ]
```

1. **Pending Confirmation (`PENDING`):**
   - The customer has placed an order online.
   - Review the requested pickup date, time window, and custom piping notes.
   - Click the **WhatsApp Customer** button to send an acceptance message.
2. **Confirmed (`CONFIRMED`):**
   - Transition to Confirmed once ingredients and baking slots are locked in.
3. **In Kitchen / Baking (`PREPARING`):**
   - The sponge, brownies, or cookies are actively being mixed, baked, or hand-decorated.
4. **Ready for Pickup (`READY_FOR_PICKUP`):**
   - The order is boxed in food-grade packaging with ribbon/stickers and stored at optimal temperature.
   - The customer tracking screen shows the item is ready for collection at 34-06 9th St, Astoria, NY.
5. **Completed (`COMPLETED`):**
   - The customer has collected their treats and payment is received.

### Printing Kitchen Slips
On any order details page (`/admin/orders/[id]`), click **Print Order Slip**. The slip is formatted for receipt printing with customer details, item quantities, and piping messages.

### Exporting Order History
On `/admin/orders`, click **Export CSV** to download a spreadsheet of all orders for bookkeeping and accounting.

---

## 3. Product & Menu Management

### Adding a New Treat
1. Go to **Products** (`/admin/products`) and click **Add New Treat**.
2. Enter the treat title, URL slug, and category.
3. Set the base price in integer USD (e.g. `2800`).
4. Specify the required preparation notice (e.g. `24 hours notice` for celebration cakes, `4-6 hours notice` for brownies).
5. Provide a high-resolution image URL (Unsplash or direct CDN link).
6. List key ingredients and allergens for transparency.
7. Click **Save Product**.

### Editing or Archiving Treats
- Click **Edit** on any treat to update prices or descriptions.
- To temporarily remove a treat without deleting its history, set its status to **UNAVAILABLE**.

---

## 4. Stock & Inventory Tracking

- For items baked strictly on demand (e.g. custom 2.5 Lb celebration cakes), leave **Stock Tracking** unchecked.
- For items baked in daily morning batches (e.g. brownies, cupcakes, cookies), check **Track physical inventory count**.
- Use the quick **+ / -** steppers or **+5 Batch** buttons on `/admin/inventory` to adjust inventory as batches come out of the oven.
- Any item with 5 or fewer units remaining will show an amber **Low Stock** warning.

---

## 5. Promotions & Discount Codes

1. Go to **Promotions** (`/admin/promotions`) and click **Create Promo Code**.
2. Enter the code in capital letters (e.g. `EIDSPECIAL`).
3. Select **Percentage (%)** or **Fixed (USD)** discount.
4. Set the minimum order requirement (e.g. `1500` USD).
5. Optionally set maximum usage limits.
6. The discount will automatically validate on the storefront during customer checkout.

---

## 6. Maintenance Mode

To temporarily pause orders for kitchen sanitization, holidays, or emergency repairs:
1. Navigate to **Settings** (`/admin/settings`).
2. Toggle the **Maintenance Mode** switch.
3. Enter an explanation message for visitors.
4. Click **Save Settings**.
5. The public storefront will immediately show the maintenance shield while preserving administrator access.
