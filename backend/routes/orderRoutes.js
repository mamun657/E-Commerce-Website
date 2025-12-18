import express from 'express';
import {
  createOrder,
  getOrder,
  updateOrderToPaid
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/pay', updateOrderToPaid);

export default router;
