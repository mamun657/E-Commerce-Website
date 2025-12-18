import ProductSection from './ProductSection';
import productsData from '../../data/products';

const TrendingProducts = ({ className, onAddToCart }) => {
  const trending = productsData.filter((p) => p.trending);
  if (trending.length === 0) return null;
  return (
    <ProductSection
      title="Trending Products"
      products={trending}
      onAddToCart={onAddToCart}
      className={className}
    />
  );
};

export default TrendingProducts;
