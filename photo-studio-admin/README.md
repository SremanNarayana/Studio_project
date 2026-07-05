 +# Momento Frames — Photography Studio Admin Module

Admin-only dashboard for managing bookings, payments, and project stages for a
photography studio. Built so a client-facing portal can be added later without
touching this codebase.

## Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), MVC architecture
- **Frontend:** React (Vite), React Router, Axios

## Project Structure

```
photo-studio-admin/
├── backend/
│   ├── config/         db.js (Mongo connection), constants.js (shared enums)
│   ├── controllers/     bookingController.js, dashboardController.js
│   ├── middleware/      errorHandler.js, validateBooking.js
│   ├── models/          Booking.js, Counter.js (atomic tracking-number sequence)
│   ├── routes/          bookingRoutes.js, dashboardRoutes.js
│   ├── utils/            generateTrackingNumber.js, apiResponse.js, asyncHandler.js, ApiError.js
│   ├── app.js            Express app + middleware wiring
│   └── server.js         Entry point (connects DB, starts server)
│
└── frontend/
    └── src/
        ├── components/    Sidebar, StatCard, StatusBadge, ProjectTimeline, Modal, Pagination, Spinner
        ├── layouts/       AdminLayout (sidebar + content shell)
        ├── pages/         Dashboard, BookingList, BookingForm, BookingDetails, Settings
        ├── services/      api.js (axios instance), bookingService.js, dashboardService.js
        ├── hooks/         useToast.jsx, useDebounce.js
        └── constants.js   Shoot types, packages, stages (mirrors backend enums)
```

## Running it locally

### 1. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI if needed
npm install
npm run dev                # nodemon, http://localhost:5000
```
Requires a running MongoDB instance (local `mongod` or Atlas connection string in `.env`).

For automatic stage-update SMS, create an MSG91 account and add its server-side
authentication key to `backend/.env` as `MSG91_AUTH_KEY`. Then open **Settings →
SMS Notifications** in the admin app, enter the approved MSG91 Template ID and
enable sending. Until enabled, stage updates use safe log-only mode.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```
Vite is pre-configured to proxy `/api/*` requests to `http://localhost:5000`
(see `vite.config.js`), so no CORS setup is needed in dev.

## Tracking Numbers

Format: `MP-{YY}-{seq}` → e.g. `MP-26-001`, `MP-26-002`.

Generated atomically via a dedicated `Counter` collection (one document per
year, incremented with `findOneAndUpdate` + `$inc`). This avoids the classic
bug where counting existing bookings to derive the "next number" collides
after a deletion.

## API Reference

| Method | Endpoint                     | Purpose                                  |
|--------|-------------------------------|-------------------------------------------|
| POST   | `/api/bookings`               | Create booking (tracking # auto-generated)|
| GET    | `/api/bookings`                | List bookings — paginated, filterable, sortable via query params (`page`, `limit`, `shootType`, `paymentStatus`, `currentStage`, `packageType`, `dateFrom`, `dateTo`, `sortBy`, `order`) |
| GET    | `/api/bookings/search?q=`      | Search by tracking number, name, phone, or email |
| GET    | `/api/bookings/:id`            | Get one booking                           |
| PUT    | `/api/bookings/:id`            | Update booking details                    |
| DELETE | `/api/bookings/:id`            | Delete booking                            |
| PATCH  | `/api/bookings/:id/stage`      | Update one project stage (`stageName`, `status`, `completedDate`, `remarks`) |
| GET    | `/api/dashboard`               | Dashboard summary cards + 10 most recent bookings |

All responses use a standardized envelope:
```json
{ "success": true, "message": "...", "data": {...}, "meta": { "page": 1, "totalPages": 3 } }
```

## Designed for a future client portal

- **No client auth is built** — as scoped, this is admin-only.
- `Booking.projectTimeline` and top-level fields (`trackingNumber`,
  `payment.advancePayment/balancePayment`, `currentStage`, `estimatedDeliveryDate`,
  `adminNotes`) already map 1:1 to the fields a client-facing "track my project"
  view would need to expose — a future `GET /api/client/bookings/:trackingNumber`
  route can simply `.select()` this same subset with no schema changes.
- Routes are namespaced under `/api/*`, leaving `/api/client/*` free.
- `cors()` in `app.js` is wide open for now — lock it to specific origins once
  a client frontend exists.

## Project Stages (fixed order)

`Booking → Pre Wedding Shoot → Wedding Shoot → Post Wedding Shoot → Selection → Editing → MVP Copy → Delivery`

Every new booking is seeded with all 8 stages set to `Pending`. `currentStage`
auto-advances to the first non-`Completed` stage whenever a stage is updated.

## Verified

- All backend files pass `node --check` and the Express app loads cleanly
  with routes correctly registered (`/search` is declared before `/:id`).
- `npm run build` on the frontend completes with no errors.
- Full CRUD flow was not run end-to-end against a live MongoDB in this
  environment (no Mongo instance available here) — connect a real/Atlas DB
  and run `npm run dev` on both sides to exercise it live.

## Next steps (from the original 10-step plan)
Steps 1–9 (folder structure → backend → models → routes → controllers →
frontend pages → dashboard UI → booking CRUD → project tracking) are done.
Step 10, "final testing," needs a live MongoDB connection — plug in a
connection string and run through the flows in the browser.
