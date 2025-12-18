import express from 'express';
import {
  getProducts,
  getProduct,
  getProductReviews,
  getFeaturedProducts,
  getProductsByCategory,
  createReview
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createReview);

export default router;
