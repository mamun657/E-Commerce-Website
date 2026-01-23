import Stripe from 'stripe';
import Order from '../models/Order.js';

// Lazy initialization of Stripe (to ensure dotenv has loaded)
let stripe = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Helper to check if Stripe is configured
const checkStripeConfigured = (res) => {
  if (!getStripe()) {
    res.status(503).json({
      success: false,
      message: 'Payment service not configured. Please set STRIPE_SECRET_KEY in environment variables.'
    });
    return false;
  }
  return true;
};

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  if (!checkStripeConfigured(res)) return;
  
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create payment intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId || '',
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe signature verification)
export const stripeWebhook = async (req, res, next) => {
  if (!checkStripeConfigured(res)) return;
  
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email || ''
        };
        order.paidAt = new Date();
        order.orderStatus = 'processing';
        await order.save();
      }
    }
  }

  res.json({ received: true });
};
