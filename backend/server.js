import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables FIRST
dotenv.config();

// Utils for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { stripeWebhook } from './controllers/paymentController.js';

// Import error handler & DB
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';

const app = express();

/* =======================
   ENV VALIDATION
======================= */
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length) {
  console.error('\n❌ Missing environment variables:');
  missingEnvVars.forEach(v => console.error(`   - ${v}`));
  console.error('❌ Server stopped. Fix .env file.\n');
  process.exit(1);
}

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Stripe webhook (raw body)
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =======================
   HEALTH CHECK
======================= */
app.get('/api/health', (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    status: 'OK',
    server: 'running',
    database: dbStatus
  });
});

/* =======================
   ROUTES
======================= */
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

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

/**
 * Start server on an available port
 * Automatically finds next available port if requested port is busy
 */
const startServerOnPort = (port, attempt = 1) => {
  return new Promise((resolve, reject) => {
    if (attempt > MAX_PORT_ATTEMPTS) {
      reject(new Error(`Could not find available port after ${MAX_PORT_ATTEMPTS} attempts`));
      return;
    }

    const server = app.listen(port, () => {
      console.log('\n✅ Server started successfully!');
      
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

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`   ⚠️  Port ${port} is busy, trying ${port + 1}...`);
        server.close();
        // Try next port
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

/**
 * Initialize and start the server
 */
const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB FIRST (required)
    console.log('\n🔄 Initializing server...\n');
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      console.error('❌ MongoDB connection failed. Server cannot start without database.');
      process.exit(1);
    }

    // Step 2: Start server on available port
    console.log(`🔍 Starting server on port ${REQUESTED_PORT}...`);
    const server = await startServerOnPort(REQUESTED_PORT);

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    if (error.code === 'EADDRINUSE') {
      console.error('   Port conflict could not be resolved automatically.');
    }
    process.exit(1);
  }
};

startServer();

