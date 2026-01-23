import mongoose from 'mongoose';

export const connectDB = async () => {
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.error('\n❌ MongoDB connection failed: MONGO_URI is not defined in environment variables.');
    console.error('   Please set MONGO_URI in your .env file.');
    console.error('   Example format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>\n');
    return false;
  }

  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return true;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}\n`);
    
    return true;
  } catch (error) {
    console.error('\n❌ MongoDB connection error:');
    console.error(`   ${error.message}\n`);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('⚠️  Could not connect to MongoDB Atlas.');
      console.error('   Please check:');
      console.error('   1. Your internet connection');
      console.error('   2. MongoDB Atlas IP whitelist settings');
      console.error('   3. Your connection string is correct\n');
    } else if (error.name === 'MongoParseError') {
      console.error('⚠️  Invalid MongoDB connection string format.');
      console.error('   Expected format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>\n');
    } else {
      console.error('⚠️  Server will continue running, but database operations will fail.');
      console.error('   Please check your MONGO_URI and try again.\n');
    }
    
    return false;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};
