<!-- Project Header -->
<h1 align="center">🛒 Apnar Dokan</h1>
<h2 align="center">✨ A Modern Full-Stack E-Commerce Platform</h2>

---

<!-- Animated subtitle -->
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=00FFCC&center=true&vCenter=true&width=800&lines=🛍+Modern+E-Commerce+Experience;⚡+React+%2B+Node.js+%2B+MongoDB;🔐+JWT+Authentication;💳+Stripe+Payments;🤖+AI+Chatbot+Integration" alt="Typing SVG" />
</p>

---

## 🌟 About Apnar Dokan

**Apnar Dokan** is a **production-ready full-stack e-commerce website** designed with a **premium UI/UX** and **scalable backend architecture**.  
It provides a complete shopping experience for users and a powerful management system for admins.

💡 Built for **real-world deployment**, performance, and clean architecture.

---

## 🚀 Key Features

### 👤 User Features
- User registration & login (JWT based)
- Product browsing with search, filter & sort
- Shopping cart & wishlist (MongoDB persistent)
- Secure checkout
- Order history & tracking
- User dashboard with profile management
- Dark mode & responsive UI
- AI Chatbot for shopping assistance 🤖

---

### 🛠 Admin Panel
- Admin dashboard with analytics
- Product management (CRUD)
- Order management & status updates
- User management
- Sales & revenue overview

---

### 🧩 Product System
- Categories:
  - 📱 Mobile Phones
  - 🎧 Headphones
  - 💻 Laptops
  - ⌚ Smart Watches
  - 👕 Clothes
  - 👟 Shoes
  - 🎒 Accessories
- Product variants (size, color, storage)
- Stock management
- Ratings & reviews
- Image galleries

---

## 🎨 UI & Design Highlights

- Premium dark theme
- Glassmorphism navbar
- Tailwind CSS + ShadCN UI
- Framer Motion animations
- Fully responsive (Desktop + Mobile)
- Skeleton loaders
- Toast notifications

---

## ⚙️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Redux Toolkit**
- **Tailwind CSS**
- **ShadCN UI**
- **Framer Motion**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcrypt password hashing**

### Integrations
- **Stripe** (Payments)
- **Cloudinary** (Image uploads)
- **Groq API** (AI Chatbot)

---

## 🔐 Authentication System

- MongoDB-based authentication
- Password hashing with bcrypt
- JWT access tokens
- Role-based authorization (User / Admin)
- Protected API routes
- Persistent login after refresh

❌ No Firebase  
❌ No third-party auth services  

---

## 📁 Project Structure

E-Commerce/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── store/
│ │ ├── lib/
│ │ └── utils/
│ └── public/
│
└── README.md


---

## 🔌 API Endpoints (Highlights)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products/:id/reviews`

### Orders
- `POST /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/pay`

### Admin
- `GET /api/admin/stats`
- `POST /api/admin/products`
- `PUT /api/admin/orders/:id/status`

---

## 📱 Frontend Routes

- `/` – Landing Page  
- `/shop` – Product Shop  
- `/product/:id` – Product Details  
- `/cart` – Cart  
- `/checkout` – Checkout  
- `/dashboard` – User Dashboard  
- `/admin` – Admin Dashboard  

---

## 🧪 Testing Guide

1. Register a user
2. Update role to `admin` in MongoDB
3. Login as admin
4. Manage products & orders
5. Test checkout (Stripe test mode)

---

## 📸 Screenshots / Demo

<p align="center">
  <img src="https://github.com/user-attachments/assets/your-image-1" width="300"/>
  <img src="https://github.com/user-attachments/assets/your-image-2" width="300"/>
</p>

---

## 🔒 Security

- Hashed passwords
- JWT authentication
- Secure API routes
- Environment variable protection
- CORS configured

---

## 🤝 Contributing

This project is open for learning and customization.  
Feel free to fork and improve it 🚀

---

## 📄 License

Open-source – for educational & personal use.

---

## 🙏 Acknowledgments

Built using modern web technologies:

- React + Vite
- Redux Toolkit
- Tailwind CSS
- Node.js + Express
- MongoDB
- Stripe
- Cloudinary
- Groq AI

---

<h3 align="center">🚀 Happy Coding with Apnar Dokan!</h3>
