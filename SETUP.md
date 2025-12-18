# Quick Setup Guide

## MongoDB Atlas Connection

### Step 1: Get Your MongoDB Connection String

Your MongoDB Atlas connection string format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>
```

**Example (from your provided format):**
```
mongodb+srv://minul:UfiX49XfnnjfYXKO@com.zurhmht.mongodb.net/ecommerce_db
```

### Step 2: Create Backend .env File

Create `backend/.env` file:

```env
# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB (REQUIRED)
MONGO_URI=mongodb+srv://minul:UfiX49XfnnjfYXKO@com.zurhmht.mongodb.net/ecommerce_db

# JWT (REQUIRED)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Optional - Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional - Stripe (for payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Step 3: Create Frontend .env File

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Installation

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
🚀 Server starting on port 5000...

🔄 Connecting to MongoDB Atlas...
✅ MongoDB Connected Successfully!
   Host: com.zurhmht.mongodb.net
   Database: ecommerce_db

✅ Server is running on http://localhost:5000
   Health check: http://localhost:5000/api/health
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Error Handling

### If MONGO_URI is Missing

The server will start but show this warning:
```
⚠️  Missing required environment variables:
   - MONGO_URI
⚠️  Server will start, but some features may not work correctly.
```

**Solution:** Add `MONGO_URI` to `backend/.env` file.

### If MongoDB Connection Fails

The server will start but show this error:
```
❌ MongoDB connection error:
   [error message]
⚠️  Server will continue running, but database operations will fail.
```

**Common Issues:**
1. **Invalid connection string** - Check format
2. **IP not whitelisted** - Add your IP in MongoDB Atlas
3. **Wrong credentials** - Verify username/password
4. **Network issues** - Check internet connection

## Testing Authentication

### 1. Test Registration

Visit: `http://localhost:5173/login`

- Click "Sign Up" or toggle to signup mode
- Enter: Name, Email, Password
- Click "Sign Up"

**What happens:**
- Password is hashed with bcrypt
- User saved to MongoDB `users` collection
- JWT token generated
- Token saved to localStorage
- Redirected to `/shop`

### 2. Test Login

Visit: `http://localhost:5173/login`

- Enter: Email, Password
- Click "Sign In"

**What happens:**
- Backend queries MongoDB for user by email
- Password compared using bcrypt.compare()
- JWT token generated if password matches
- Token saved to localStorage
- Redirected to `/shop`

### 3. Test Page Refresh

1. Login successfully
2. Navigate to `/dashboard`
3. Refresh the page (F5)

**What happens:**
- Token retrieved from localStorage
- `getMe()` API call verifies token
- User data fetched from MongoDB
- Redux store updated
- Dashboard remains accessible

### 4. Verify MongoDB Storage

Check MongoDB Atlas or use MongoDB Compass:

```javascript
// View all users
db.users.find().pretty()

// View a specific user (password is hashed)
db.users.findOne({ email: "test@example.com" })

// Create admin user
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## MongoDB Collection Structure

After registering a user, you'll see:

**users collection:**
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",  // Hashed with bcrypt
  "role": "user",
  "wishlist": [],
  "recentlyViewed": [],
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## Important Files

### Backend Authentication
- `backend/models/User.js` - User schema with bcrypt password hashing
- `backend/controllers/authController.js` - Register/login logic
- `backend/middleware/authMiddleware.js` - JWT verification
- `backend/utils/generateToken.js` - JWT token generation
- `backend/config/database.js` - MongoDB connection

### Frontend Authentication
- `frontend/src/store/slices/authSlice.js` - Redux auth state
- `frontend/src/lib/api.js` - Axios interceptor (adds token to requests)
- `frontend/src/App.jsx` - Initializes auth on page load
- `frontend/src/components/ProtectedRoute.jsx` - Route protection

## Troubleshooting

### "Not authorized to access this route"
- Token might be expired
- Token might be missing from localStorage
- Check browser console for errors

### "User already exists"
- Email already in MongoDB
- Try different email or login instead

### "Invalid credentials"
- Password doesn't match stored hash
- Verify email exists in MongoDB
- Check password is correct

### MongoDB connection issues
- Verify `MONGO_URI` format
- Check MongoDB Atlas IP whitelist
- Verify username/password are correct
- Check internet connection

## Security Notes

✅ **Secure:**
- Passwords hashed with bcrypt (never plain text)
- JWT tokens with expiration
- Environment variables for secrets
- MongoDB connection uses SSL (mongodb+srv://)

⚠️ **Development Only:**
- JWT_SECRET should be long and random in production
- Use HTTPS in production
- Enable MongoDB Atlas authentication
- Use strong passwords for MongoDB user

## Next Steps

1. ✅ MongoDB connection configured
2. ✅ Environment variables set
3. ✅ Backend running
4. ✅ Frontend running
5. ✅ Register first user
6. ✅ Create admin user (update role in MongoDB)
7. ✅ Start building your e-commerce features!

For detailed authentication documentation, see `AUTHENTICATION.md`.
