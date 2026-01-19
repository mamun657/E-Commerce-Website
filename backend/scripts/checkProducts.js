import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

dotenv.config({
    path: new URL('../.env', import.meta.url)
});

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const products = await Product.find({}).select('name category images');

        products.forEach(product => {
            console.log(`📦 ${product.name}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Images:`);
            product.images.forEach((img, idx) => {
                console.log(`     [${idx}] ${img}`);
            });
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkProducts();
