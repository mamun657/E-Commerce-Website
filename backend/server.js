import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables FIRST
dotenv.config();

// Debug: Verify Stripe key is loaded
console.log('🔍 Environment check:');
console.log('   STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? `${process.env.STRIPE_SECRET_KEY.slice(0, 15)}...` : '❌ NOT FOUND');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ NOT FOUND');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ NOT FOUND');

// Utils for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chat.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Import controllers & utils
import { stripeWebhook } from "./controllers/paymentController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/database.js";

const app = express();

/* =======================
   ENV VALIDATION
======================= */
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY", "STRIPE_SECRET_KEY"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingEnvVars.length) {
  console.error("\n❌ Missing environment variables:");
  missingEnvVars.forEach((v) => console.error(`   - ${v}`));
  console.error("❌ Server stopped. Fix .env file.\n");
  process.exit(1);
}

/* =======================
   MIDDLEWARE
======================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Stripe webhook (RAW body only for this route)
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =======================
   HEALTH CHECK
======================= */
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    status: "OK",
    server: "running",
    database: dbStatus,
  });
});

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes); // ✅ CHAT ROUTE (ONLY ONCE)
app.use("/api/analytics", analyticsRoutes); // ✅ ANALYTICS ROUTE - Public demand forecasting

/* =======================
   ERROR HANDLER
======================= */
app.use(errorHandler);

/* =======================
   SERVER START
======================= */
const DEFAULT_PORT = 5000;
const REQUESTED_PORT = parseInt(process.env.PORT) || DEFAULT_PORT;
const MAX_PORT_ATTEMPTS = 10;

const startServerOnPort = (port, attempt = 1) => {
  return new Promise((resolve, reject) => {
    if (attempt > MAX_PORT_ATTEMPTS) {
      reject(
        new Error(
          `Could not find available port after ${MAX_PORT_ATTEMPTS} attempts`
        )
      );
      return;
    }

    const server = app.listen(port, () => {
      console.log("\n✅ Server started successfully!");

      if (port !== REQUESTED_PORT) {
        console.log(`   ⚠️  Port ${REQUESTED_PORT} was already in use`);
        console.log(`   ✅ Server running on port ${port} instead`);
      } else {
        console.log(`   ✅ Server running on port ${port}`);
      }

      console.log(`\n🌐 Server URL: http://localhost:${port}`);
      console.log(`🩺 Health Check: http://localhost:${port}/api/health`);
      console.log(`📝 API Base: http://localhost:${port}/api\n`);

      resolve(server);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.log(`⚠️  Port ${port} busy, trying ${port + 1}...`);
        server.close();
        startServerOnPort(port + 1, attempt + 1)
          .then(resolve)
          .catch(reject);
      } else {
        server.close();
        reject(error);
      }
    });
  });
};

const startServer = async () => {
  try {
    console.log("\n🔄 Initializing server...\n");

    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.error("❌ MongoDB connection failed.");
      process.exit(1);
    }

    console.log(`🔍 Starting server on port ${REQUESTED_PORT}...`);
    const server = await startServerOnPort(REQUESTED_PORT);

    const gracefulShutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.close(async () => {
        await mongoose.connection.close();
        console.log("✅ Connections closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("\n❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
