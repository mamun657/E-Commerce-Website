/**
 * Script to diagnose and fix corrupted password hashes in the database.
 * 
 * Run with: node scripts/fixPasswords.js
 * 
 * This script will:
 * 1. List all users and check if their password hashes look valid
 * 2. Optionally reset a specific user's password
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Simple user schema for this script
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

const diagnosePasswords = async () => {
  await connectDB();
  
  console.log('\n📊 DIAGNOSING USER PASSWORDS\n');
  console.log('='.repeat(60));
  
  const users = await User.find({}).select('+password');
  
  for (const user of users) {
    console.log(`\n👤 User: ${user.email}`);
    console.log(`   Role: ${user.role || 'user'}`);
    console.log(`   Password hash length: ${user.password?.length || 0}`);
    
    // Valid bcrypt hash should be 60 characters and start with $2
    const isValidHash = user.password && 
                        user.password.length === 60 && 
                        user.password.startsWith('$2');
    
    console.log(`   Hash format valid: ${isValidHash ? '✅ Yes' : '❌ No'}`);
    
    if (user.password) {
      console.log(`   Hash preview: ${user.password.substring(0, 20)}...`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 Total users: ${users.length}`);
};

const resetUserPassword = async (email, newPassword) => {
  await connectDB();
  
  console.log(`\n🔄 Resetting password for: ${email}`);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const result = await User.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );
  
  if (result.modifiedCount > 0) {
    console.log('✅ Password reset successfully');
    console.log(`   New hash: ${hashedPassword.substring(0, 20)}...`);
  } else {
    console.log('❌ User not found or password not updated');
  }
};

// Main execution
const main = async () => {
  const args = process.argv.slice(2);
  
  if (args[0] === 'reset' && args[1] && args[2]) {
    // Reset specific user password: node fixPasswords.js reset email@example.com newpassword
    await resetUserPassword(args[1], args[2]);
  } else {
    // Diagnose all users
    await diagnosePasswords();
  }
  
  await mongoose.disconnect();
  console.log('\n👋 Done\n');
  process.exit(0);
};

main().catch(console.error);
