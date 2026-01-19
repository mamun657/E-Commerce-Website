import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

/* ===================== ENV SETUP (ESM FIX) ===================== */
dotenv.config({
  path: new URL('../.env', import.meta.url)
});

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

/* ===================== CATEGORY-BASED IMAGE MAPPING ===================== */
/**
 * CRITICAL: Each category maps to specific, deterministic image URLs.
 * This ensures laptops always get laptop images, phones get phone images, etc.
 * All photo IDs have been verified on Unsplash to ensure they work and show correct images.
 */
const CATEGORY_IMAGE_MAP = {
  'Mobile Phones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', // iPhone black
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80', // Samsung
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=900&q=80', // Modern phone
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80', // OnePlus
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=900&q=80'  // Xiaomi
  ],
  'Laptops': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80', // MacBook
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80', // Dell XPS
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80', // ThinkPad (verified working)
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80', // HP Laptop
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=900&q=80'  // Modern laptop
  ],
  'Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', // Premium Headphones
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80', // Sony WH style
    'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80', // Earbuds
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80', // Bose style
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80'  // JBL style
  ],
  'Shoes': [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80', // Leather Sneakers
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80', // Nike style
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', // Running Shoes
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80', // Casual shoes
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80'  // Classic leather
  ],
  'Clothes': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', // White T-Shirt
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80', // Black T-Shirt
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', // Jacket
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80', // Hoodie
    'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=900&q=80'  // Sweater
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1523364537883-cc292987a22c?auto=format&fit=crop&w=900&q=80', // Watch
    'https://images.unsplash.com/photo-1545235616-db3cd822ad8c?auto=format&fit=crop&w=900&q=80', // Wireless Charger
    'https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?auto=format&fit=crop&w=900&q=80', // Wallet
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80', // Backpack
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'  // Sunglasses
  ],
  'Smart Watches': [
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80', // Apple Watch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80', // Samsung Watch
    'https://images.unsplash.com/photo-1617625802912-cde586faf331?auto=format&fit=crop&w=900&q=80', // Fitness Watch
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=900&q=80', // Sport Watch
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'  // Luxury Watch
  ]
};

/**
 * Get deterministic, category-specific images for a product
 * @param {string} category - Product category
 * @param {number} index - Product index within category (for variety)
 * @param {number} count - Number of images needed
 * @returns {Array<string>} Array of image URLs
 */
const getCategoryImages = (category, index = 0, count = 2) => {
  const categoryImages = CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP['Accessories'];

  // Use modulo to ensure we don't exceed available images
  const images = [];
  for (let i = 0; i < count; i++) {
    const imageIndex = (index + i) % categoryImages.length;
    images.push(categoryImages[imageIndex]);
  }

  return images;
};

/* ===================== PRODUCTS ===================== */
const products = [

  /* ================= MOBILE PHONES ================= */
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple flagship phone with A17 Pro chip and titanium design.',
    category: 'Mobile Phones',
    price: 1199,
    compareAtPrice: 1299,
    images: getCategoryImages('Mobile Phones', 0, 2),
    stock: 50,
    brand: 'Apple'
  },

  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android phone with Snapdragon Gen 3 and 200MP camera.',
    category: 'Mobile Phones',
    price: 1299,
    compareAtPrice: 1399,
    images: getCategoryImages('Mobile Phones', 1, 2),
    stock: 42,
    brand: 'Samsung'
  },

  {
    name: 'Google Pixel 8 Pro',
    description: 'Tensor G3 powered Pixel with AI photography.',
    category: 'Mobile Phones',
    price: 999,
    compareAtPrice: 1099,
    images: getCategoryImages('Mobile Phones', 2, 2),
    stock: 38,
    brand: 'Google'
  },

  /* ================= LAPTOPS ================= */
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    description: 'Ultralight business laptop with OLED display.',
    category: 'Laptops',
    price: 2149,
    compareAtPrice: 2299,
    images: getCategoryImages('Laptops', 0, 2),
    stock: 36,
    brand: 'Lenovo'
  },

  {
    name: 'Dell XPS 15 Creator Edition',
    description: 'High-performance creator laptop with OLED display.',
    category: 'Laptops',
    price: 1899,
    compareAtPrice: 2099,
    images: getCategoryImages('Laptops', 1, 2),
    stock: 44,
    brand: 'Dell'
  },

  /* ================= HEADPHONES ================= */
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation headphones.',
    category: 'Headphones',
    price: 399,
    compareAtPrice: 449,
    images: getCategoryImages('Headphones', 0, 2),
    stock: 75,
    brand: 'Sony'
  },

  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Premium wireless earbuds with adaptive audio.',
    category: 'Headphones',
    price: 249,
    compareAtPrice: 279,
    images: getCategoryImages('Headphones', 2, 2),
    stock: 110,
    brand: 'Apple'
  },

  /* ================= CLOTHES ================= */
  {
    name: 'Premium Cotton T-Shirt',
    description: '100% organic cotton t-shirt.',
    category: 'Clothes',
    price: 29,
    compareAtPrice: 39,
    images: getCategoryImages('Clothes', 0, 1),
    stock: 210,
    brand: 'Everyday Supply'
  },

  /* ================= SHOES ================= */
  {
    name: 'Classic Leather Sneakers',
    description: 'Minimal leather sneakers for daily wear.',
    category: 'Shoes',
    price: 95,
    compareAtPrice: 119,
    images: getCategoryImages('Shoes', 0, 1),
    stock: 97,
    brand: 'Common Line'
  },

  /* ================= ACCESSORIES ================= */
  {
    name: 'Wireless Charging Pad',
    description: 'Fast Qi wireless charger.',
    category: 'Accessories',
    price: 29,
    compareAtPrice: 39,
    images: getCategoryImages('Accessories', 1, 1),
    stock: 150,
    brand: 'Volt Essentials'
  }
];

/* ===================== SEED FUNCTION ===================== */
const seedProducts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    console.log('🧹 Removing existing products...');
    await Product.deleteMany({});
    console.log('🗑 Old products removed');

    console.log('📦 Seeding products with category-specific images...');
    await Product.insertMany(products);

    console.log(`✅ ${products.length} products seeded successfully`);
    console.log('✔ All images are now category-specific and deterministic');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
