import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, clearCart } from '../store/slices/cartSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { formatBDT } from '../utils/currency';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const CheckoutForm = ({ cart, totalPrice, onOrderComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        variant: item.variant,
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: 0,
        taxPrice: 0,
        discountPrice: cart.discount || 0,
        couponCode: cart.couponCode || '',
        totalPrice,
      };

      if (paymentMethod === 'cod') {
        // Cash on Delivery
        const response = await api.post('/orders', orderData);
        toast.success('Order placed successfully!');
        onOrderComplete(response.data.order);
      } else {
        // Stripe payment
        const paymentResponse = await api.post('/payments/create-intent', {
          amount: totalPrice,
        });

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          paymentResponse.data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: shippingAddress.name,
              },
            },
          }
        );

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        // Create order
        const orderResponse = await api.post('/orders', orderData);
        
        // Update order payment
        await api.put(`/orders/${orderResponse.data.order._id}/pay`, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: shippingAddress.email,
        });

        toast.success('Order placed successfully!');
        onOrderComplete(orderResponse.data.order);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder="Full Name"
            value={shippingAddress.name}
            onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
            required
          />
          <Input
            placeholder="Phone"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
            required
          />
          <Input
            placeholder="Street Address"
            value={shippingAddress.street}
            onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
            required
            className="md:col-span-2"
          />
          <Input
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            required
          />
          <Input
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            required
          />
          <Input
            placeholder="ZIP Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
            required
          />
          <Input
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Cash on Delivery</span>
          </label>
        </div>

        {paymentMethod === 'stripe' && (
          <div className="mt-4 p-4 border rounded-md">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      <Button type="submit" variant="gradient" className="w-full" disabled={loading || !stripe}>
        {loading ? 'Processing...' : `Place Order (${formatBDT(totalPrice).formatted})`}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleOrderComplete = async (order) => {
    await dispatch(clearCart());
    navigate('/dashboard', { state: { orderId: order._id } });
  };

  if (loading || !cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  const totalPrice = calculateTotal();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  cart={cart}
                  totalPrice={totalPrice}
                  onOrderComplete={handleOrderComplete}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>{formatBDT((item.product?.price || 0) * item.quantity).formatted}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatBDT(totalPrice).formatted}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
