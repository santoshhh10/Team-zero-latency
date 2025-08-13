# Surplus Food Management - Backend

## Setup

1. Copy environment file
```
cp .env.example .env
```
2. Install dependencies
```
npm install
```
3. Run dev server
```
npm run dev
```
4. Seed database
```
npm run seed
```

Environment:
- MONGO_URI
- JWT_SECRET
- PORT
- CLIENT_URL

## API Endpoints

Auth
- POST /api/auth/register — { name, email, password, role }
- POST /api/auth/login — { email, password } -> { token, user }

Items
- GET /api/items — list active items. Query: location, veg=true|false, expiringSoon=true
- POST /api/items — create item (role: canteen/admin)
- PUT /api/items/:id — update item (role: canteen/admin)

Orders
- POST /api/orders — create preorder (role: student)
- POST /api/orders/:id/cancel — cancel preorder (role: student; >=15 min before slot)
- POST /api/orders/walkin — record walk-in (role: canteen)
- POST /api/orders/scan — validate QR and mark picked-up (role: canteen/admin)

Users
- GET /api/users/:id/points — get points (auth)
- GET /api/users/leaderboard — leaderboard

Admin
- GET /api/admin/analytics — aggregated stats (role: admin)
- POST /api/admin/alerts/trigger — run NGO alert job (role: admin)

NGO
- GET /api/ngos/alerts — list items nearing expiry (role: ngo/admin)
- POST /api/ngos/pickup — confirm pickup (role: ngo/admin)

Events
- GET /api/events — list events (auth)
- POST /api/events — create event (role: admin/canteen) {title, description, start, end, location}

Points
- POST /api/users/:id/points/adjust — adjust points by delta (role: admin)

## Sample Item Payload
```
{
  "name": "Veg Sandwich Combo",
  "description": "Sandwich + Juice",
  "quantityTotal": 20,
  "originalPrice": 120,
  "discountedPrice": 60,
  "bestBefore": "2025-08-14T10:00:00.000Z",
  "images": [],
  "veg": true,
  "location": "North Campus",
  "availabilityWindow": { "start": "2025-08-13T08:00:00.000Z", "end": "2025-08-13T10:00:00.000Z" },
  "pickupSlots": []
}
```

## Notes
- Quantity updates are atomic using findOneAndUpdate with quantity check to avoid race conditions.
- Background job runs every 5 minutes to alert NGOs for items expiring in <= 30 minutes and >0 quantity.

Cron jobs
- Runs every 5 minutes: expiry alerts to NGOs, reminders to students before slots, and post-event reminders to organizers.

.env example in this folder documents SMTP settings for local dev (Mailhog/Maildev).