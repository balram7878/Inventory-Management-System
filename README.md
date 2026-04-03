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
