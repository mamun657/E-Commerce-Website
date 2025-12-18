import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const buildImage = (path) => `https://images.unsplash.com/${path}?auto=format&fit=crop&w=900&q=80`;
const FALLBACK_IMAGE = buildImage('photo-1498050108023-c5249f4df085');

// 20 real-looking demo products evenly distributed across categories
const products = [
  // Mobile Phones (3)
  {
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple flagship with A17 Pro chip, 6.7-inch Super Retina XDR display, titanium enclosure, and 5x tetraprism camera zoom.',
    category: 'Mobile Phones',
    price: 1199,
    compareAtPrice: 1299,
    images: [
      buildImage('photo-1511707171634-5f897ff02aa9'),
      buildImage('photo-1512499617640-c2f999098c01')
    ],
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
    images: [
      buildImage('photo-1502920917128-1aa500764b8a'),
      buildImage('photo-1510552776732-01acc9a4f294')
    ],
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
    images: [
      buildImage('photo-1504274066651-8d31a536b11a'),
      buildImage('photo-1503602642458-232111445657')
    ],
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
    images: [
      buildImage('photo-1517263904808-5dc91e3e7044'),
      buildImage('photo-1505740106531-4243f3831c78')
    ],
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
    images: [
      buildImage('photo-1511379938547-c1f69419868d'),
      buildImage('photo-1511376777868-611b54f68947')
    ],
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
    images: [
      buildImage('photo-1505740420928-5e560c06d30e'),
      buildImage('photo-1614850523451-b194b6fc2c40')
    ],
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
    images: [
      buildImage('photo-1521572163474-6864f9cf17ab'),
      buildImage('photo-1521572267360-ee0c2909d518')
    ],
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
    images: [
      buildImage('photo-1523381210434-271e8be1f52b'),
      buildImage('photo-1487412720507-e7ab37603c6f')
    ],
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
    images: [
      buildImage('photo-1503341455253-b2e723bb3dbb'),
      buildImage('photo-1460353581641-37baddab0fa2')
    ],
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
    images: [
      buildImage('photo-1542291026-7eec264c27ff'),
      buildImage('photo-1518544889280-37f4ca38e4ab')
    ],
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
    images: [
      buildImage('photo-1528701800489-20be3c21fda3'),
      buildImage('photo-1520440229-b5fef3d6c1df')
    ],
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
    images: [
      buildImage('photo-1472289065668-ce650ac443d2'),
      buildImage('photo-1503602642458-232111445657')
    ],
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
    images: [
      buildImage('photo-1517336714731-489689fd1ca8'),
      buildImage('photo-1518770660439-4636190af475')
    ],
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
    images: [
      buildImage('photo-1498050108023-c5249f4df085'),
      buildImage('photo-1483058712412-4245e9b90334')
    ],
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
    images: [
      buildImage('photo-1481277542470-605612bd2d61'),
      buildImage('photo-1517430816045-df4b7de11d1d')
    ],
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
    images: [
      buildImage('photo-1551816230-ef5deaed4a26'),
      buildImage('photo-1523275335684-37898b6baf30')
    ],
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
    images: [
      buildImage('photo-1523475472560-d2df97ec485c'),
      buildImage('photo-1523275335684-37898b6baf30')
    ],
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
    images: [
      buildImage('photo-1545235616-db3cd822ad8c'),
      buildImage('photo-1591290619618-904f6dd935e3')
    ],
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
    images: [
      buildImage('photo-1601898532138-9f145a2ad69e'),
      buildImage('photo-1725085815038-279c8139c8a4')
    ],
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
    images: [
      buildImage('photo-1760376789487-994070337c76'),
      buildImage('photo-1760376789478-c1023d2dc007')
    ],
    stock: 85,
    isFeatured: false,
    brand: 'Dockly',
    variants: {
      colors: ['Space Gray']
    }
  }
];

const formattedProducts = products.map((product, index) => {
  const { images, image, isFeatured, ...rest } = product;
  const categoryCode = rest.category.split(' ')[0].replace(/[^A-Za-z]/g, '').toUpperCase();
  const resolvedImages = Array.isArray(images) && images.length
    ? images
    : image
      ? [image]
      : [FALLBACK_IMAGE];

  return {
    ...rest,
    images: resolvedImages,
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
