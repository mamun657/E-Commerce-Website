# E-Commerce Website - Full Stack Application

A complete, modern, and production-ready e-commerce website built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Authentication (MongoDB-based)
- User registration and login with JWT tokens
- Password hashing using bcrypt
- Protected routes with role-based access control
- User sessions stored in MongoDB

### User Features
- Modern landing page
- Product browsing with search, filter, and sort
- Shopping cart (persistent in MongoDB)
- Wishlist functionality
- User dashboard with profile management
- Order history and tracking
- Secure checkout with Stripe integration
- Cash on Delivery option

### Admin Panel
- Admin dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates
- User management
- Sales statistics

### Product System
- 7 product categories:
  - Mobile Phones
  - Headphones
  - Clothes
  - Shoes
  - Laptops
  - Smart Watches
  - Accessories
- Product variants (size, color, storage)
- Stock management
- Ratings and reviews
- Image galleries

### Design & UI
- Modern, premium e-commerce UI
- Tailwind CSS + ShadCN UI components
- Framer Motion animations
- Dark mode support
- Fully responsive design
- Glassmorphism navbar
- Skeleton loaders
- Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Stripe account (for payments - test mode)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**MongoDB Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>
```

**Example (your provided format):**
```
mongodb+srv://minul:UfiX49XfnnjfYXKO@com.zurhmht.mongodb.net/ecommerce_db
```

**Important Notes:**
- Replace `<username>` with your MongoDB username
- Replace `<password>` with your MongoDB password
- Replace `<cluster>` with your cluster name
- Replace `<database_name>` with your desired database name
- The backend will NOT crash if MONGO_URI is missing - it will show a clear error message

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Authentication Flow

### MongoDB-Based Authentication

The authentication system uses **MongoDB** to store user credentials. See `AUTHENTICATION.md` for detailed documentation.

**Key Points:**
1. **Registration Flow:**
   - User provides name, email, and password
   - Password is hashed using **bcrypt** (10 salt rounds) in `backend/models/User.js`
   - User document is **saved to MongoDB** `users` collection
   - JWT token is generated and returned

2. **Login Flow:**
   - User provides email and password
   - System **queries MongoDB** to find user by email
   - Password is fetched from MongoDB using `.select('+password')`
   - Password is compared using **bcrypt.compare()**
   - If valid, JWT token is generated and returned

3. **Protected Routes:**
   - JWT token is sent in Authorization header: `Bearer <token>`
   - Middleware verifies token using `JWT_SECRET`
   - User is **fetched from MongoDB** using the user ID from token
   - User object is attached to `req.user` for route handlers

4. **Page Refresh Persistence:**
   - Token stored in `localStorage`
   - On page load, `getMe()` API call verifies token
   - User data fetched from MongoDB and Redux store updated
   - Authentication state persists across page refreshes

### Important: No Third-Party Auth

This project does NOT use:
- ❌ Firebase Authentication
- ❌ Auth0
- ❌ Clerk
- ❌ Any other third-party auth service

All authentication is handled directly with **MongoDB, JWT, and bcrypt**.

**MongoDB Usage in Authentication:**
- ✅ User credentials stored in MongoDB `users` collection
- ✅ Passwords hashed with bcrypt before storage (never plain text)
- ✅ User lookup during login queries MongoDB
- ✅ Token verification queries MongoDB to fetch user
- ✅ All user data persisted in MongoDB

For complete authentication documentation, see `AUTHENTICATION.md`.

## 📁 Project Structure

```
E-Commerce/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware, error handler
│   ├── utils/            # Helper functions
│   └── server.js         # Express server
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store and slices
│   │   ├── lib/          # API configuration
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
└── README.md
```

## 🗄️ Database Schema

### User Schema
- name, email, password (hashed)
- role (user/admin)
- wishlist, recentlyViewed
- address, phone, avatar

### Product Schema
- name, description, category
- price, compareAtPrice, stock
- images, variants
- rating (average, count)
- brand, SKU

### Order Schema
- user (reference)
- orderItems (array)
- shippingAddress
- paymentMethod, paymentResult
- prices (items, shipping, tax, discount, total)
- orderStatus, timestamps

### Review Schema
- product, user (references)
- rating (1-5), comment
- timestamps

### Cart Schema
- user (reference)
- items (array with product, quantity, variant)
- couponCode, discount

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Create review (protected)

### Users
- `GET /api/users/profile` - Get profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/wishlist` - Get wishlist (protected)
- `POST /api/users/wishlist/:productId` - Add to wishlist (protected)
- `DELETE /api/users/wishlist/:productId` - Remove from wishlist (protected)
- `GET /api/users/orders` - Get user orders (protected)
- `GET /api/users/cart` - Get cart (protected)
- `POST /api/users/cart` - Add to cart (protected)
- `PUT /api/users/cart/:itemId` - Update cart item (protected)
- `DELETE /api/users/cart/:itemId` - Remove from cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/:id` - Get order (protected)
- `PUT /api/orders/:id/pay` - Update order payment (protected)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent (protected)
- `POST /api/payments/webhook` - Stripe webhook

### Admin (Protected, Admin only)
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

## 🎨 Frontend Routes

- `/` - Landing page
- `/login` - Login/Signup page
- `/shop` - Product shop page
- `/product/:id` - Product detail page
- `/cart` - Shopping cart (protected)
- `/checkout` - Checkout page (protected)
- `/dashboard` - User dashboard (protected)
- `/admin` - Admin dashboard (protected, admin only)
- `/admin/products` - Product management (protected, admin only)
- `/admin/orders` - Order management (protected, admin only)
- `/admin/users` - User management (protected, admin only)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Role-based authorization
- Input validation
- Error handling
- Environment variables for secrets
- CORS configuration

## 🧪 Testing the Application

1. **Create an Admin User:**
   - Register a new user through the signup page
   - In MongoDB, update the user's role to "admin":
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Test User Flow:**
   - Register/Login
   - Browse products
   - Add to cart
   - Proceed to checkout
   - Place order

3. **Test Admin Flow:**
   - Login as admin
   - Access admin dashboard
   - Manage products, orders, and users

## 📝 Notes

- The application uses MongoDB Atlas (cloud) by default, but can work with local MongoDB
- Stripe is in test mode - use test card numbers for payments
- Image uploads use Cloudinary - configure your credentials in `.env`
- All sensitive data should be stored in `.env` files (never commit these)

## 🤝 Contributing

This is a complete e-commerce application. Feel free to fork and customize for your needs.

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with modern web technologies:
- React.js + Vite
- Redux Toolkit
- Tailwind CSS
- Framer Motion
- Node.js + Express.js
- MongoDB + Mongoose
- Stripe API
- Cloudinary

---

**Happy Coding! 🚀**
