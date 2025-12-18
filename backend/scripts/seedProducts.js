import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// 20 real-looking demo products evenly distributed across categories
const products = [
  // Mobile Phones (3)
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple flagship with A17 Pro chip, 6.7-inch Super Retina XDR display, titanium enclosure, and 5x tetraprism camera zoom.',
    category: 'Mobile Phones',
    price: 1199,
    compareAtPrice: 1299,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    stock: 50,
    isFeatured: true,
    brand: 'Apple',
    variants: {
      storage: ['256GB', '512GB', '1TB'],
      colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
    }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android experience with Snapdragon 8 Gen 3, 6.8-inch Dynamic AMOLED 2X, integrated S Pen, and 200MP quad camera.',
    category: 'Mobile Phones',
    price: 1299,
    compareAtPrice: 1399,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    stock: 42,
    isFeatured: true,
    brand: 'Samsung',
    variants: {
      storage: ['256GB', '512GB', '1TB'],
      colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow']
    }
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Tensor G3 powered Pixel with intelligent photography, Magic Eraser, and pro-level controls in a matte glass finish.',
    category: 'Mobile Phones',
    price: 999,
    compareAtPrice: 1099,
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=400',
    stock: 38,
    isFeatured: false,
    brand: 'Google',
    variants: {
      storage: ['128GB', '256GB', '512GB'],
      colors: ['Obsidian', 'Porcelain', 'Bay']
    }
  },

  // Headphones (3)
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation, LDAC hi-res audio, adaptive sound control, and up to 30 hours of battery life.',
    category: 'Headphones',
    price: 399,
    compareAtPrice: 449,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 75,
    isFeatured: true,
    brand: 'Sony',
    variants: {
      colors: ['Black', 'Silver']
    }
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'H2 chip powered earbuds with Adaptive Audio, Personalized Spatial Audio, and Find My speaker inside the charging case.',
    category: 'Headphones',
    price: 249,
    compareAtPrice: 279,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
    stock: 110,
    isFeatured: true,
    brand: 'Apple',
    variants: {
      colors: ['White']
    }
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    description: 'Immersive spatial audio, CustomTune calibration, plush ear cushions, and 24-hour battery for premium comfort.',
    category: 'Headphones',
    price: 349,
    compareAtPrice: 399,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    stock: 58,
    isFeatured: false,
    brand: 'Bose',
    variants: {
      colors: ['Black', 'White Smoke']
    }
  },

  // Clothes (3)
  {
    name: 'Premium Cotton T-Shirt',
    description: '100% organic cotton crewneck with a relaxed fit and pre-washed fabric for softness right out of the box.',
    category: 'Clothes',
    price: 29,
    compareAtPrice: 39,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 210,
    isFeatured: false,
    brand: 'Everyday Supply',
    variants: {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Navy', 'Heather Gray']
    }
  },
  {
    name: 'Classic Denim Jeans',
    description: 'Selvedge-inspired slim jeans with reinforced stitching, stretch comfort, and a dark indigo rinse.',
    category: 'Clothes',
    price: 79,
    compareAtPrice: 99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    stock: 155,
    isFeatured: true,
    brand: 'Denim District',
    variants: {
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Dark Indigo', 'Vintage Blue', 'Jet Black']
    }
  },
  {
    name: 'Heritage Hooded Sweatshirt',
    description: 'Brushed fleece hoodie with kangaroo pocket, rib cuffs, and tonal drawcords for everyday layering.',
    category: 'Clothes',
    price: 59,
    compareAtPrice: 79,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    stock: 125,
    isFeatured: false,
    brand: 'Comfort Works',
    variants: {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy', 'Charcoal', 'Olive', 'Sand']
    }
  },

  // Shoes (3)
  {
    name: 'Nike Air Max 270',
    description: 'Lifestyle runner highlighted by a visible 270-degree Air unit, engineered mesh, and responsive foam cushioning.',
    category: 'Shoes',
    price: 150,
    compareAtPrice: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 82,
    isFeatured: true,
    brand: 'Nike',
    variants: {
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['Black/White', 'Volt/Black', 'University Red']
    }
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Boost midsole cushioned runner with Primeknit upper, Linear Energy Push system, and Continental rubber outsole.',
    category: 'Shoes',
    price: 180,
    compareAtPrice: 220,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    stock: 68,
    isFeatured: true,
    brand: 'Adidas',
    variants: {
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['Core Black', 'Cloud White', 'Grey Three']
    }
  },
  {
    name: 'Classic Leather Sneakers',
    description: 'Minimalist court sneaker in full-grain leather with cushioned insole and stitched cupsole for durability.',
    category: 'Shoes',
    price: 95,
    compareAtPrice: 119,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    stock: 97,
    isFeatured: false,
    brand: 'Common Line',
    variants: {
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Tan', 'Matte Black']
    }
  },

  // Laptops (3)
  {
    name: 'MacBook Pro 16-inch M3 Pro',
    description: 'Pro-grade notebook with M3 Pro chip, Liquid Retina XDR display, 22-hour battery life, and six-speaker audio.',
    category: 'Laptops',
    price: 2499,
    compareAtPrice: 2699,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    stock: 32,
    isFeatured: true,
    brand: 'Apple',
    variants: {
      storage: ['512GB', '1TB', '2TB'],
      colors: ['Space Gray', 'Silver']
    }
  },
  {
    name: 'Dell XPS 15 Creator Edition',
    description: 'Aluminum-and-carbon-fiber chassis with Intel Core i7, RTX 4070 graphics, OLED InfinityEdge display, and quad speakers.',
    category: 'Laptops',
    price: 1899,
    compareAtPrice: 2099,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    stock: 44,
    isFeatured: true,
    brand: 'Dell',
    variants: {
      storage: ['512GB', '1TB', '2TB'],
      colors: ['Platinum Silver', 'Frost White']
    }
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    description: 'Ultralight business laptop with 14-inch 2.8K OLED, Intel vPro processors, Dolby Atmos speakers, and MIL-STD durability.',
    category: 'Laptops',
    price: 2149,
    compareAtPrice: 2299,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    stock: 36,
    isFeatured: false,
    brand: 'Lenovo',
    variants: {
      storage: ['512GB', '1TB'],
      colors: ['Black']
    }
  },

  // Smart Watches (2)
  {
    name: 'Apple Watch Series 9',
    description: 'S9 SiP, double tap gesture, second-gen Ultra Wideband chip, and advanced health sensors in an aluminum case.',
    category: 'Smart Watches',
    price: 399,
    compareAtPrice: 449,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
    stock: 72,
    isFeatured: true,
    brand: 'Apple',
    variants: {
      sizes: ['41mm', '45mm'],
      colors: ['Midnight', 'Starlight', 'Product Red', 'Pink']
    }
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'Signature rotating bezel smartwatch with BioActive sensor suite, Sapphire Crystal display, and LTE-ready design.',
    category: 'Smart Watches',
    price: 349,
    compareAtPrice: 399,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 57,
    isFeatured: false,
    brand: 'Samsung',
    variants: {
      sizes: ['43mm', '47mm'],
      colors: ['Black', 'Silver']
    }
  },

  // Accessories (3)
  {
    name: 'Wireless Charging Pad',
    description: '15W fast Qi charger with soft-touch surface, foreign object detection, and USB-C PD power input.',
    category: 'Accessories',
    price: 29,
    compareAtPrice: 39,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
    stock: 150,
    isFeatured: false,
    brand: 'Volt Essentials',
    variants: {
      colors: ['Black', 'White']
    }
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity pack with USB-C 45W PD output, dual USB-A ports, pass-through charging, and LED battery readout.',
    category: 'Accessories',
    price: 59,
    compareAtPrice: 79,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c7?w=400',
    stock: 105,
    isFeatured: false,
    brand: 'PowerTech',
    variants: {
      colors: ['Black', 'Blue']
    }
  },
  {
    name: 'USB-C Pro Hub 8-in-1',
    description: 'Aluminum USB-C hub with dual 4K HDMI, 100W PD passthrough, gigabit Ethernet, SD reader, and twin USB-A 3.2 ports.',
    category: 'Accessories',
    price: 89,
    compareAtPrice: 109,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock: 85,
    isFeatured: false,
    brand: 'Dockly',
    variants: {
      colors: ['Space Gray']
    }
  }
];

const formattedProducts = products.map((product, index) => {
  const { image, isFeatured, ...rest } = product;
  const categoryCode = rest.category.split(' ')[0].replace(/[^A-Za-z]/g, '').toUpperCase();

  return {
    ...rest,
    images: [image],
    featured: isFeatured,
    sku: rest.sku || `SKU-${categoryCode}-${String(index + 1).padStart(3, '0')}`
  };
});

const seedProducts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    console.log('♻️  Removing existing demo products (by name)...');
    await Product.deleteMany({ name: { $in: products.map((p) => p.name) } });
    console.log('🧹 Previous demo products cleared\n');

    console.log('📦 Seeding products...\n');
    const createdProducts = await Product.insertMany(formattedProducts);

    console.log(`✅ Successfully created ${createdProducts.length} products!\n`);

    const categoryCount = createdProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Products by category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    console.log('\n📝 Sample products:');
    createdProducts.slice(0, 3).forEach((product) => {
      console.log(`   - ${product.name} (${product.category}) - $${product.price}`);
    });

    console.log('\n📄 Example MongoDB document:');
    const sampleDoc = createdProducts[0].toObject({ versionKey: false });
    console.dir(sampleDoc, { depth: null });

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
