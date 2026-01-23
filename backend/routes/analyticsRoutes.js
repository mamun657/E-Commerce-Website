import express from 'express';
import { getProductDemandForecast } from '../controllers/analyticsController.js';

const router = express.Router();

// Public endpoint - no authentication required
router.get('/forecast/:productId', getProductDemandForecast);

export default router;
