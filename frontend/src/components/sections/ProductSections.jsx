import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Skeleton } from '../ui/Skeleton';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../ProductCard';
import { FALLBACK_PRODUCT_IMAGE, getPrimaryImage } from '../../utils/image';

const categories = [
  'Mobile Phones',
  'Headphones',
  'Clothes',
  'Shoes',
  'Laptops',
  'Smart Watches',
  'Accessories',
];

const DEFAULT_CATEGORY_IMAGES = {
  Laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  Shoes: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
};

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const ProductSections = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = {
      search: debouncedSearch || undefined,
      category: category || undefined,
      sort,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      // Pull a generous batch to surface all active products on a single grid
      limit: 1000,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, debouncedSearch, category, sort, minPrice, maxPrice, minRating]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const renderProductCard = (product) => (
    <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
  );

  const normalizeProduct = (product) => {
    const normalized = { ...product };

    if (normalized.name === 'Adidas Ultraboost 22') {
      normalized.category = 'Shoes';
      normalized.images = [
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
      ];
    }

    const categoryFallback = DEFAULT_CATEGORY_IMAGES[normalized.category] || FALLBACK_PRODUCT_IMAGE;
    const resolvedImage = getPrimaryImage(normalized.images, categoryFallback);

    return {
      ...normalized,
      images: [resolvedImage],
    };
  };

  const displayProducts = (products || []).map(normalizeProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">Discover amazing products</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Min Price</label>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Max Price</label>
            <Input
              type="number"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Min Rating</label>
            <Input
              type="number"
              placeholder="0"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayProducts.map(renderProductCard)}
        </div>
      )}
    </div>
  );
};

export default ProductSections;
