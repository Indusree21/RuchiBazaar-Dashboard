# RuchiBazaar Dashboard

A complete marketplace platform connecting street food vendors with vegetable suppliers (frontend + backend).

## Project Overview

- `vendor-app-backend/`: Node.js + Express API, MongoDB models (`User`, `Product`, `Order`), auth and order endpoints.
- `vendor-app-frontend/`: static client pages for vendor/supplier login, dashboard, product catalog, orders and profiles.
- `.vscode/`: optional editor settings/workspace launch config (non-essential).

## Features

### For Vendors
- Browse product catalog from multiple suppliers
- Create and track orders
- Manage profile and order history

### For Suppliers
- Add/update products
- View received orders
- Manage supplier profile

## Tech Stack

- Backend: Node.js, Express, Mongoose, MongoDB
- Frontend: HTML, CSS, JavaScript

## Setup Instructions

### Backend Setup

1. Open terminal:
   ```bash
   cd "C:\Users\ullii\OneDrive\Desktop\My Vendor App\vendor-app-backend"
   npm install
   ```

2. Create `.env` in backend folder:
   ```env
   MONGO_URI=mongodb://localhost:27017/ruchibazaar
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

3. Run backend:
   ```bash
   npm start
   ```

### Frontend Setup

1. Open `vendor-app-frontend/index.html` directly in browser, or run local server:
   ```bash
   cd "C:\Users\ullii\OneDrive\Desktop\My Vendor App\vendor-app-frontend"
   npx http-server -p 8080
   ```
2. Visit: `http://localhost:8080`

## Usage

1. Signup as vendor or supplier
2. Login
3. Vendor flow:
   - Browse marketplace
   - Add products to cart
   - Place orders
4. Supplier flow:
   - Add products
   - View/manage orders
   - Update status

## Git Commands

```bash
git add .
git commit -m "Update README for GitHub rendering"
git push origin main
```

## Notes

- Make sure MongoDB is running before starting backend.
- Use browser console for frontend errors, and terminal logs for backend.

## Project Structure

```
├── vendor-app-backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
└── vendor-app-frontend/
    ├── index.html
    ├── login.html
    ├── signup.html
    └── ...
```
