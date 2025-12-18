# Authentication System Documentation

## Overview

This e-commerce application uses **MongoDB-based authentication** with JWT tokens and bcrypt password hashing. No third-party authentication services are used (no Firebase, Auth0, Clerk, etc.).

## Authentication Flow

### 1. User Registration

**Location:** `POST /api/auth/register`

**Process:**
1. User provides: `name`, `email`, `password`
2. Backend validates input fields
3. Checks if user already exists in MongoDB
4. **Password is hashed using bcrypt** (10 salt rounds) - see `backend/models/User.js`
5. User document is **saved to MongoDB** in the `users` collection
6. JWT token is generated using `JWT_SECRET` from environment variables
7. Token and user data (without password) are returned to frontend

**MongoDB Storage:**
- User data stored in: `users` collection
- Password stored as: Hashed string (never plain text)
- Schema: `backend/models/User.js`

### 2. User Login

**Location:** `POST /api/auth/login`

**Process:**
1. User provides: `email`, `password`
2. Backend queries MongoDB to find user by email
3. **Password is fetched from MongoDB** (includes password field using `.select('+password')`)
4. **bcrypt.compare()** is used to verify password against stored hash
5. If password matches, JWT token is generated
6. Token and user data are returned to frontend

**MongoDB Query:**
```javascript
const user = await User.findOne({ email }).select('+password');
const isPasswordMatch = await user.matchPassword(password);
```

### 3. Password Hashing

**Location:** `backend/models/User.js`

**Implementation:**
- Uses bcrypt with 10 salt rounds
- Password is hashed in a pre-save hook before storing in MongoDB
- Never stored in plain text

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 4. JWT Token Generation

**Location:** `backend/utils/generateToken.js`

**Implementation:**
- Uses `jsonwebtoken` library
- Secret key from `process.env.JWT_SECRET`
- Token expires in 7 days (configurable via `JWT_EXPIRE`)

### 5. Protected Routes

**Location:** `backend/middleware/authMiddleware.js`

**How it works:**
1. Frontend sends JWT token in Authorization header: `Bearer <token>`
2. Middleware extracts token from header
3. Token is verified using `JWT_SECRET`
4. User ID is extracted from token
5. User is fetched from MongoDB using the ID
6. User object is attached to `req.user` for use in route handlers

**Usage:**
```javascript
router.get('/profile', protect, getProfile);
```

### 6. Frontend Authentication Persistence

**Location:** `frontend/src/store/slices/authSlice.js`

**How it works:**
1. On successful login/register, token and user data are saved to `localStorage`
2. On app initialization, Redux store is populated from `localStorage`
3. If token exists, user is considered authenticated
4. Token is automatically attached to all API requests via axios interceptor

**Token Storage:**
- Token: `localStorage.getItem('token')`
- User: `localStorage.getItem('user')`

**API Interceptor:** `frontend/src/lib/api.js`
- Automatically adds `Authorization: Bearer <token>` header to all requests
- If token is invalid (401), clears localStorage and redirects to login

### 7. Page Refresh Persistence

**How authentication persists on refresh:**
1. When page loads, `App.jsx` checks for token in localStorage
2. If token exists, `getMe()` is called to verify token and fetch current user
3. User data is updated in Redux store
4. Protected routes check `isAuthenticated` from Redux store
5. All subsequent API calls include the token automatically

**Code Flow:**
```
Page Refresh
  → App.jsx useEffect
  → Check localStorage for token
  → If token exists, dispatch getMe()
  → API call with token to /api/auth/me
  → Backend verifies token via JWT
  → Backend queries MongoDB for user
  → User data returned
  → Redux store updated
  → isAuthenticated = true
  → Protected routes accessible
```

## MongoDB Connection

**Location:** `backend/config/database.js`

**Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>
```

**Environment Variable:**
- `MONGO_URI` must be set in `.env` file
- Example: `mongodb+srv://minul:UfiX49XfnnjfYXKO@com.zurhmht.mongodb.net/ecommerce_db`

**Connection Handling:**
- Connection is established on server startup
- If `MONGO_URI` is missing, server starts but logs error
- If connection fails, server continues running (for debugging)
- Connection status can be checked via `/api/health` endpoint

## Database Schema

### User Collection

**Schema:** `backend/models/User.js`

**Fields:**
- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed, not returned by default)
- `role`: String ('user' or 'admin', default: 'user')
- `wishlist`: Array of Product IDs
- `recentlyViewed`: Array of products with timestamps
- `address`: Object (street, city, state, zipCode, country)
- `phone`: String
- `avatar`: String
- `createdAt`, `updatedAt`: Timestamps (automatic)

**Indexes:**
- Email is unique (prevents duplicate accounts)

## Security Features

1. **Password Hashing:** All passwords hashed with bcrypt (never stored in plain text)
2. **JWT Tokens:** Secure token-based authentication
3. **Environment Variables:** Sensitive data stored in `.env` (never committed)
4. **Protected Routes:** Middleware verifies JWT before allowing access
5. **Role-Based Access:** Admin routes require `role: 'admin'` in user document
6. **Password Selection:** Passwords excluded from queries by default (`.select('+password')` only when needed)

## Testing Authentication

### Create a Test User

1. Register via frontend: `POST /api/auth/register`
2. Or directly in MongoDB:
   ```javascript
   // Password will be auto-hashed by pre-save hook
   db.users.insertOne({
     name: "Test User",
     email: "test@example.com",
     password: "plaintextpassword" // Will be hashed automatically
   });
   ```

### Create an Admin User

```javascript
// In MongoDB, update user role
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"yourpassword"}'
```

## Troubleshooting

### "MongoDB connection failed"
- Check `MONGO_URI` in `.env` file
- Verify MongoDB Atlas IP whitelist includes your IP
- Check internet connection
- Verify connection string format

### "JWT_SECRET is not defined"
- Add `JWT_SECRET` to `.env` file
- Generate a secure random secret (32+ characters)

### "Invalid credentials"
- Verify email exists in MongoDB
- Check password is correct
- Verify bcrypt.compare() is working (password must match stored hash)

### "Not authorized"
- Check token is being sent in Authorization header
- Verify token hasn't expired
- Check `JWT_SECRET` matches between login and verification

## Summary

**MongoDB Usage:**
- ✅ User credentials stored in MongoDB
- ✅ Passwords hashed with bcrypt before storage
- ✅ User lookup during login from MongoDB
- ✅ Token verification queries MongoDB for user
- ✅ No third-party auth services used

**Authentication Flow:**
1. Register → Hash password → Save to MongoDB → Generate JWT
2. Login → Query MongoDB → Compare password → Generate JWT
3. Protected Routes → Verify JWT → Query MongoDB for user → Allow access
4. Page Refresh → Check localStorage → Verify JWT → Update Redux store
