import Product from '../models/Product.js';
import Review from '../models/Review.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = { active: { $ne: false } };

    if (category && category.toLowerCase() !== 'all') {
      query.category = category;
    }

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      const searchRegex = new RegExp(trimmedSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { description: searchRegex }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query['rating.average'] = { $gte: Number(minRating) };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price-asc':
        sortObj = { price: 1 };
        break;
      case 'price-desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    // Pagination (cap limit to avoid accidental empty pages from huge skips)
    const pageNum = Number.isNaN(Number(page)) ? 1 : parseInt(page);
    const limitNum = Math.min(Number.isNaN(Number(limit)) ? 12 : parseInt(limit), 1000);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    // Return all active products so shop listings aren't accidentally limited to featured-only items
    const products = await Product.find({ active: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      active: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user._id,
      rating,
      comment
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products based on category and price
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Find the current product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate price range (±20%)
    const currentPrice = Number(product.price) || 0;
    const minPrice = currentPrice * 0.8;
    const maxPrice = currentPrice * 1.2;

    // Query for related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id }, // Exclude current product
      category: product.category, // Same category
      price: { $gte: minPrice, $lte: maxPrice }, // Price range ±20%
      active: { $ne: false } // Only active products
    })
      .sort({ 'rating.average': -1 }) // Sort by rating (descending)
      .limit(4); // Limit to 4 products

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};
