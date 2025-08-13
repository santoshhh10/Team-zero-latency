# Surplus Food Management (MERN)

Two apps: `backend` (Express + MongoDB) and `frontend` (React + Vite + Tailwind).

## Prerequisites
- Node 18+
- MongoDB running locally

## Quickstart
```
# backend
cd backend
npm install
cp .env.example .env
# edit .env MONGO_URI and JWT_SECRET
npm run seed
npm run dev

# frontend
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Default URLs:
- API: http://localhost:5000
- Web: http://localhost:5173

Seed users
- Admin: admin@example.com / password123
- Canteens: canteenA@example.com, canteenB@example.com / password123
- Students: alice@student.com, bob@student.com, cara@student.com / password123
- NGOs: ngo1@example.com, ngo2@example.com / password123

Use the Postman collection at `backend/postman_collection.json` to test endpoints.