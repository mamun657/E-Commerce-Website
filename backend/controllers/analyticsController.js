import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get demand forecast for a product
// @route   GET /api/analytics/forecast/:productId
// @access  Public
export const getProductDemandForecast = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        // Fetch product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Calculate date range (last 7 days)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Query orders from last 7 days and aggregate sales
        const orders = await Order.find({
            createdAt: { $gte: sevenDaysAgo },
            orderStatus: { $ne: 'cancelled' } // Exclude cancelled orders
        });

        // Calculate total units sold for this product
        let last7DaysSold = 0;
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.product.toString() === productId) {
                    last7DaysSold += item.quantity;
                }
            });
        });

        // Handle case with no sales data
        if (last7DaysSold === 0) {
            return res.status(200).json({
                success: true,
                productId: product._id,
                productName: product.name,
                last7DaysSold: 0,
                dailyAverage: 0,
                forecastNext7Days: 0,
                currentStock: product.stock,
                needsRestock: false,
                restockPriority: 'none',
                daysUntilStockOut: null,
                message: 'Not enough historical sales data to generate forecast yet.'
            });
        }

        // Calculate daily average
        const dailyAverage = last7DaysSold / 7;

        // Forecast next 7 days (rule-based AI)
        const forecastNext7Days = Math.ceil(dailyAverage * 7);

        // Get current stock
        const currentStock = product.stock;

        // Restocking logic
        const needsRestock = currentStock < forecastNext7Days;

        // Calculate days until stock out
        const daysUntilStockOut = dailyAverage > 0
            ? Math.round((currentStock / dailyAverage) * 10) / 10 // Round to 1 decimal
            : null;

        // Determine restock priority
        let restockPriority = 'low';
        let message = '✅ Stock levels are healthy based on current sales trends.';

        if (needsRestock) {
            if (daysUntilStockOut !== null && daysUntilStockOut <= 3) {
                restockPriority = 'high';
                message = `⚠️ Low stock! Restocking recommended - estimated stockout in ${Math.ceil(daysUntilStockOut)} days.`;
            } else if (daysUntilStockOut !== null && daysUntilStockOut <= 7) {
                restockPriority = 'medium';
                message = `📦 Stock running low. Consider restocking - estimated stockout in ${Math.ceil(daysUntilStockOut)} days.`;
            } else {
                restockPriority = 'low';
                message = '📊 Stock is below forecasted demand. Monitor inventory levels.';
            }
        }

        // Return forecast data
        res.status(200).json({
            success: true,
            productId: product._id,
            productName: product.name,
            last7DaysSold,
            dailyAverage: Math.round(dailyAverage * 10) / 10, // Round to 1 decimal
            forecastNext7Days,
            currentStock,
            needsRestock,
            restockPriority,
            daysUntilStockOut,
            message
        });

    } catch (error) {
        console.error('Error generating demand forecast:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating demand forecast',
            error: error.message
        });
    }
};
