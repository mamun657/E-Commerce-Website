import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatBDT } from '../utils/currency';
import { getPrimaryImage, FALLBACK_PRODUCT_IMAGE } from '../utils/image';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Link to="/shop">
            <Button variant="gradient">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Link to={`/product/${item.product?._id}`}>
                      <img
                        src={getPrimaryImage(item.product?.images, FALLBACK_PRODUCT_IMAGE)}
                        alt={item.product?.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product?._id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product?.category}
                      </p>
                      {(item.variant?.size || item.variant?.color || item.variant?.storage) && (
                        <p className="text-sm text-muted-foreground">
                          {[
                            item.variant.size,
                            item.variant.color,
                            item.variant.storage,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-accent"
                          >
                            -
                          </button>
                          <span className="px-4 py-1">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-accent"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold">
                            {formatBDT((item.product?.price || 0) * item.quantity).formatted}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item._id)}
                          >
                            <Trash2 size={18} className="text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatBDT(calculateTotal()).formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatBDT(0).formatted}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatBDT(calculateTotal()).formatted}</span>
                </div>
              </div>
              <Button
                variant="gradient"
                className="w-full"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
