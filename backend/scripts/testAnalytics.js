import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config({
    path: new URL('../.env', import.meta.url)
});

const getProductInfo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const products = await Product.find({}).limit(5);

        console.log('📦 Available Products for Testing:');
        console.log('===================================\n');

        products.forEach(product => {
            console.log(`Name: ${product.name}`);
            console.log(`ID: ${product._id}`);
            console.log(`Stock: ${product.stock}`);
            console.log(`Category: ${product.category}`);
            console.log(`\nTest URL: http://localhost:5173/product/${product._id}`);
            console.log(`API URL: http://localhost:5000/api/analytics/forecast/${product._id}`);
            console.log('---\n');
        });

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

getProductInfo();
