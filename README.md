# Web-Based Inventory Management System (MVP)

This project is a beginner-friendly MERN stack MVP for inventory management.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React, Tailwind CSS, Vite

## Features Implemented
- JWT Authentication with roles (admin, staff, customer)
- Product CRUD and search
- Inventory stock-in and stock-out
- Dashboard stats (total products, low stock, total orders, total sales)
- Basic Order, Customer, and Supplier management endpoints
- Frontend pages: Login, Dashboard, Product Management

## Run Backend
1. Open terminal in `Backend`
2. Install packages:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`
4. Start server:
   ```bash
   npm run dev
   ```

Backend runs on: `http://localhost:5000`

## Run Frontend
1. Open terminal in `Frontend`
2. Install packages:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example`
4. Start app:
   ```bash
   npm run dev
   ```

Frontend runs on: `http://localhost:5173`

## Core API Endpoints
### Auth
- `POST /register`
- `POST /login`

### Products
- `POST /products` (Admin only)
- `GET /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /products/search?q=`

### Inventory
- `POST /inventory/stock-in`
- `POST /inventory/stock-out`

### Dashboard
- `GET /dashboard/stats`

## Notes
- Add at least one admin user using `POST /register` with body `{ "role": "admin", ... }` before testing admin-only product creation.
- Use `Authorization: Bearer <token>` header for protected routes.

## Deployment

### Render (Backend)
- This repo includes `render.yaml` configured for backend deployment.
- If creating a new Render service from Blueprint, Render will use:
   - `rootDir: Backend`
   - `buildCommand: npm install`
   - `startCommand: npm start`
- Required environment variables on Render:
   - `MONGO_URI`
   - `JWT_SECRET` (or `JWT_SECRET_KEY`)
   - `CLIENT_URL` (`https://inventory-management-system-neelam.vercel.app`)

- Backend URL:
   - `https://inventory-management-system-akoi.onrender.com`

Important: Do not set `node app.js` as the Build Command at repo root. `app.js` is inside `Backend`.

### Vercel (Frontend)
- Frontend includes `Frontend/vercel.json` with:
   - `buildCommand: npm run build`
   - `outputDirectory: dist`
   - SPA rewrites to `index.html`
- In Vercel Project Settings, ensure the project Root Directory is `Frontend`.
- Set frontend env variable:
   - `VITE_API_BASE_URL=https://inventory-management-system-akoi.onrender.com`

This prevents the "No Output Directory named build" error.

### Keep Render Awake Every 5 Minutes
- Added GitHub Actions workflow at `.github/workflows/keep-render-awake.yml`.
- It automatically calls `https://inventory-management-system-akoi.onrender.com/` every 5 minutes.
