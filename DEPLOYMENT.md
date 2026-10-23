# Deployment & Production Runbook

This guide describes how to configure, deploy, and operate the Bakers Cafe LIC platform in production.

---

## 1. Environment Configuration

Ensure the following environment variables are set in your production hosting platform:

```ini
# Production Database Connection (e.g. Neon, Supabase, Railway PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/bakerscafelic?schema=public"

# Session & Cryptographic Secret (32+ characters)
SESSION_SECRET="generate-a-strong-random-secret-key-32-chars-minimum"

# Production Canonical Application URL
NEXT_PUBLIC_APP_URL="https://bakerscafelic.com"

# Initial Administrator Provisioning Credentials
ADMIN_EMAIL="admin@bakerscafelic.com"
ADMIN_PASSWORD="StrongProductionAdminPassword2026!"
ADMIN_NAME="Head Baker"

# Business Information Defaults (Source of Truth)
NEXT_PUBLIC_BUSINESS_NAME="Bakers Cafe LIC"
NEXT_PUBLIC_BUSINESS_PHONE="+1 718-489-9077"
NEXT_PUBLIC_BUSINESS_WHATSAPP="17184899077"
NEXT_PUBLIC_BUSINESS_ADDRESS="34-06 9th St, Astoria, NY 11106, USA"
NEXT_PUBLIC_MAPS_URL="https://www.google.com/maps/search/?api=1&query=Bakers+Cafe+LIC+34-06+9th+St+Astoria+NY+11106"
```

---

## 2. Deploying to Vercel / Railway / Render

### Method A: Vercel with PostgreSQL (Neon / Supabase)
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. In `prisma/schema.prisma`, switch the datasource provider from `sqlite` to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Set the Build Command in Vercel to:
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
5. Deploy.
6. Once deployed, run the seed script to initialize business settings and the first admin:
   ```bash
   npm run seed
   ```

### Method B: Self-Hosted Docker / VPS
Build the production Docker container:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 3. Maintenance Mode Operation

If the kitchen needs to undergo scheduled deep cleaning, holiday closure, or system maintenance:
1. Log in to `/admin/login`.
2. Navigate to **Settings** (`/admin/settings`).
3. Toggle the **Maintenance Mode** switch to ON.
4. Customize the maintenance notice message.
5. Click **Save Settings**.
6. The public storefront immediately displays the maintenance shield. Authenticated administrators retain bypass access to manage orders or test new bakes.
7. To resume normal operations, simply toggle the switch back to OFF. No redeployment or server restart is required.
