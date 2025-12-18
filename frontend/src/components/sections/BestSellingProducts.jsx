import ProductSection from './ProductSection';
import productsData from '../../data/products';

const BestSellingProducts = ({ className, onAddToCart }) => {
  const bestSelling = productsData.filter((p) => p.bestSelling);
  if (bestSelling.length === 0) return null;
  return (
    <ProductSection
      title="Best Selling Products"
      products={bestSelling}
      onAddToCart={onAddToCart}
      className={className}
    />
  );
};

export default BestSellingProducts;
