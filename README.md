# StayNear PG Rental SaaS

Production-oriented monorepo for a student PG rental platform with a shared backend, single PostgreSQL database, Next.js web app, Expo mobile app, and shared packages.

## Monorepo Structure

```txt
apps/
  backend/   Express REST API, Prisma, Redis OTP auth
  web/       Next.js App Router, TailwindCSS, Framer Motion
  mobile/    React Native Expo app
packages/
  api/       Shared typed API client SDK
  config/    Shared constants, env defaults, roles, room types
  ui/        Shared UI primitives and design tokens
  utils/     Distance, occupancy, pricing, formatting logic
```

The older `backend`, `frontend_web`, and `frontend_flutter` folders are left untouched for reference. The active implementation is under `apps/` and `packages/`.

## Implemented Features

- OTP login with Redis TTL storage, JWT access tokens, refresh sessions, and OTP rate limiting.
- Roles: `student`, `owner`, `admin`.
- PostgreSQL Prisma schema for users, PGs, room inventory, bookings, verification, refresh sessions, and nearby infrastructure.
- `GET /api/pgs/nearby` geospatial 10 km radius search sorted by distance with pagination capped at 20.
- Business logic for distance, occupancy rate, availability, and nearby rent comparison.
- Google Places details and nearby infrastructure caching through Redis.
- Transaction-safe booking flow that atomically increments room occupancy and prevents overbooking.
- Owner dashboard APIs to add PGs, update room inventory, and view bookings.
- ID proof upload and admin verification route.
- Next.js student discovery, OTP login, PG details/booking, and owner dashboard pages.
- Expo mobile discovery and OTP login screens using the same API SDK and shared logic.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
copy .env.example .env
copy .env.example apps\backend\.env
```

Set `GOOGLE_MAPS_API_KEY` if you want live Google Places reviews and infrastructure. Without it, the app still works with database-backed PG data.

3. Start PostgreSQL and Redis:

```bash
docker compose up -d db redis
```

4. Prepare the database:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Run apps:

```bash
npm run dev:backend
npm run dev:web
npm run dev:mobile
```

Default URLs:

- Backend: `http://localhost:5000/health`
- Web: `http://localhost:3000`
- Expo: terminal QR code / emulator launcher

## Core API Routes

```txt
POST /api/auth/request-otp
POST /api/auth/verify-otp
POST /api/auth/refresh
GET  /api/pgs/nearby?lat=28.6803&lng=77.2046&page=1&limit=20
GET  /api/pgs/:id
POST /api/bookings
GET  /api/owners/dashboard
POST /api/owners/pgs
PATCH /api/owners/pgs/:id/rooms
POST /api/verifications/id-proof
PATCH /api/verifications/:id/review
```

In development, `POST /api/auth/request-otp` returns `devOtp` so the flow can be tested without an SMS provider. Replace that response branch with Twilio/Firebase/SNS delivery before production.

## Verification Commands

```bash
npm run typecheck
npm run build -w @pg-rental/backend
npm run build -w @pg-rental/web
```

The current workspace passes all three. `npm audit` currently reports dependency ecosystem advisories; use `npm audit fix` carefully and test after changes.
