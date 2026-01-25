import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Card, CardContent } from '../components/ui/Card';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { DEFAULT_EXCHANGE_RATES, formatBDT } from '../utils/currency';
import { getPrimaryImage, FALLBACK_PRODUCT_IMAGE } from '../utils/image';
import ProductCard from '../components/ProductCard';
import {
  fetchRelatedProducts,
  fetchProductsByIds,
  trackProductView,
  getViewedProductIds
} from '../api/productApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({
    size: '',
    color: '',
    storage: '',
  });
  const [reviews, setReviews] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Recommendation system state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loadingViewed, setLoadingViewed] = useState(false);

  // Demand forecasting state
  const [forecast, setForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    fetchReviews();
    loadRelatedProducts();
    loadViewedProducts();
    loadDemandForecast();
  }, [id, dispatch]);

  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  useEffect(() => {
    if (user && product) {
      checkWishlist();
    }
  }, [user, product]);

  // Track product view for "People Also Viewed"
  useEffect(() => {
    if (id) {
      trackProductView(id);
    }
  }, [id]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/products/${id}/reviews`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await api.get('/users/wishlist');
      const wishlist = response.data.wishlist || [];
      setIsInWishlist(wishlist.some((item) => item._id === id));
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    await dispatch(addToCart({ productId: id, quantity, variant: selectedVariant }));
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await api.delete(`/users/wishlist/${id}`);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/users/wishlist/${id}`);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  // Load related products based on category and price
  const loadRelatedProducts = async () => {
    if (!id) return;

    setLoadingRelated(true);
    try {
      const products = await fetchRelatedProducts(id);
      setRelatedProducts(products);
    } catch (error) {
      console.error('Failed to load related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  // Load "People Also Viewed" products from localStorage
  const loadViewedProducts = async () => {
    if (!id) return;

    setLoadingViewed(true);
    try {
      const viewedIds = getViewedProductIds(id); // Exclude current product
      if (viewedIds.length > 0) {
        const products = await fetchProductsByIds(viewedIds);
        setViewedProducts(products);
      } else {
        setViewedProducts([]);
      }
    } catch (error) {
      console.error('Failed to load viewed products:', error);
    } finally {
      setLoadingViewed(false);
    }
  };

  // Load demand forecast for this product
  const loadDemandForecast = async () => {
    if (!id) return;

    setLoadingForecast(true);
    try {
      const response = await api.get(`/analytics/forecast/${id}`);
      if (response.data.success) {
        setForecast(response.data);
      }
    } catch (error) {
      console.error('Failed to load demand forecast:', error);
      setForecast(null);
    } finally {
      setLoadingForecast(false);
    }
  };

  // Handle add to cart from recommendation cards
  const handleRecommendationAddToCart = async (recommendedProduct) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    await dispatch(addToCart({ productId: recommendedProduct._id, quantity: 1 }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Product not found</p>
      </div>
    );
  }

  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [getPrimaryImage(product.images, FALLBACK_PRODUCT_IMAGE)];
  const displayedImage = galleryImages[selectedImage] || getPrimaryImage(galleryImages, FALLBACK_PRODUCT_IMAGE);
  const approxBdt = formatBDT(Number(product.price) || 0, {
    rate: DEFAULT_EXCHANGE_RATES.USD_TO_BDT
  });
  const compareAtPriceBdt = product.compareAtPrice
    ? formatBDT(Number(product.compareAtPrice) || 0, {
        rate: DEFAULT_EXCHANGE_RATES.USD_TO_BDT
      })
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
            <img
              src={displayedImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
              <span className="ml-1 font-semibold">
                {product.rating?.average?.toFixed(1) || '0.0'}
              </span>
              <span className="ml-1 text-muted-foreground">
                ({product.rating?.count || 0} reviews)
              </span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{product.category}</span>
          </div>

          <div className="mb-6">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">{approxBdt.formatted}</span>
              {compareAtPriceBdt && (
                <span className="text-xl text-muted-foreground line-through">
                  {compareAtPriceBdt.formatted}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants && (
            <div className="space-y-4 mb-6">
              {product.variants.sizes && product.variants.sizes.length > 0 && (
                <div>
                  <label className="block mb-2 font-medium">Size</label>
                  <div className="flex gap-2">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                        className={`px-4 py-2 border rounded-md ${selectedVariant.size === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.colors && product.variants.colors.length > 0 && (
                <div>
                  <label className="block mb-2 font-medium">Color</label>
                  <div className="flex gap-2">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                        className={`px-4 py-2 border rounded-md ${selectedVariant.color === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.variants.storage && product.variants.storage.length > 0 && (
                <div>
                  <label className="block mb-2 font-medium">Storage</label>
                  <div className="flex gap-2">
                    {product.variants.storage.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedVariant({ ...selectedVariant, storage })}
                        className={`px-4 py-2 border rounded-md ${selectedVariant.storage === storage
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input'
                          }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                +
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.stock} in stock
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button
              variant="gradient"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
            >
              <Heart className={isInWishlist ? 'fill-red-500 text-red-500' : ''} size={20} />
            </Button>
          </div>

          {/* Reviews */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.user?.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI-Powered Demand Forecast */}
          {!loadingForecast && forecast && (
            <Card className="mt-6 border-2 border-blue-500/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">AI-Powered Demand Forecast</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📦</span>
                      <p className="text-sm text-muted-foreground">Sold Last 7 Days</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {forecast.last7DaysSold} units
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">📈</span>
                      <p className="text-sm text-muted-foreground">Expected Next 7 Days</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {forecast.forecastNext7Days} units
                    </p>
                  </div>
                </div>

                {forecast.needsRestock && (
                  <div className={`rounded-lg p-4 ${forecast.restockPriority === 'high'
                      ? 'bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800'
                      : forecast.restockPriority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-800'
                        : 'bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800'
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">⚠️</span>
                      <div className="flex-1">
                        <p className={`font-semibold mb-1 ${forecast.restockPriority === 'high'
                            ? 'text-red-700 dark:text-red-400'
                            : forecast.restockPriority === 'medium'
                              ? 'text-yellow-700 dark:text-yellow-400'
                              : 'text-blue-700 dark:text-blue-400'
                          }`}>
                          {forecast.message}
                        </p>
                        {forecast.daysUntilStockOut !== null && (
                          <p className="text-sm text-muted-foreground">
                            🕒 Current stock: {forecast.currentStock} units
                            {forecast.daysUntilStockOut > 0 && (
                              <span> • Estimated stockout: ~{Math.ceil(forecast.daysUntilStockOut)} days</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!forecast.needsRestock && forecast.last7DaysSold > 0 && (
                  <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1">
                        <p className="font-semibold text-green-700 dark:text-green-400">
                          {forecast.message}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Current stock: {forecast.currentStock} units • Daily average: {forecast.dailyAverage} units/day
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {forecast.last7DaysSold === 0 && (
                  <div className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <p className="text-muted-foreground">
                        {forecast.message}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 Forecast based on historical sales trends and intelligent business rules
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading state for forecast */}
          {loadingForecast && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                product={relatedProduct}
                onAddToCart={handleRecommendationAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading state for Related Products */}
      {loadingRelated && relatedProducts.length === 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-[4/5] rounded-3xl" />
            ))}
          </div>
        </div>
      )}

      {/* People Also Viewed Section */}
      {viewedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">People Also Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {viewedProducts.map((viewedProduct) => (
              <ProductCard
                key={viewedProduct._id}
                product={viewedProduct}
                onAddToCart={handleRecommendationAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading state for People Also Viewed */}
      {loadingViewed && viewedProducts.length === 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">People Also Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-[4/5] rounded-3xl" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
