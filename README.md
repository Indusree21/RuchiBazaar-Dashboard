# RuchiBazaar Dashboard

A complete marketplace platform connecting street food vendors with vegetable suppliers.

## Features

### For Vendors
- Browse products from multiple suppliers
- Place orders for vegetables and ingredients
- Track order history and status
- Manage vendor profile
- View dashboard with order statistics

### For Suppliers
- Add and manage products with images
- View and manage incoming orders
- Update order status (pending/delivered/cancelled)
- Track earnings and sales statistics
- Manage supplier profile

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Multer (file uploads)
- bcryptjs (password hashing)

**Frontend:**
- HTML5
- TailwindCSS
- Vanilla JavaScript

## Setup Instructions

### 1. Backend Setup

```bash
cd vendor-app-backend
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the server:
```bash
node server.js
```

### 2. Frontend Setup

Open any HTML file in the `vendor-app-frontend` folder with a browser or use a local server:

```bash
cd vendor-app-frontend
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

Visit: `http://localhost:8000`

## Usage

1. **Signup**: Choose vendor or supplier role
2. **Login**: Use your phone and password
3. **Vendor Flow**:
   - Browse marketplace
   - Add products to cart
   - Place orders
   - Track orders
4. **Supplier Flow**:
   - Add products with images
   - View incoming orders
   - Update order status

## API Endpoints

### Auth
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/forgot-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `POST /api/products/add` - Add product (supplier)
- `GET /api/products/supplier/:supplierId` - Get supplier products

### Orders
- `POST /api/orders/place` - Place order (vendor)
- `GET /api/orders/vendor/:vendorId` - Get vendor orders
- `GET /api/orders/supplier/:supplierId` - Get supplier orders
- `PUT /api/orders/:orderId/status` - Update order status

### Profile
- `GET /api/vendor/profile/:id` - Get vendor profile
- `PUT /api/vendor/profile/:id` - Update vendor profile
- `GET /api/supplier/:id` - Get supplier profile
- `PUT /api/supplier/:id` - Update supplier profile

## Project Structure

```
├── vendor-app-backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── vendor-app-frontend/
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── vendor-dashboard.html
    ├── vendor-profile.html
    ├── vendor-orders.html
    ├── marketplace.html
    ├── supplier-dashboard.html
    ├── supplier-orders.html
    └── add-product.html
```

## License

MIT
