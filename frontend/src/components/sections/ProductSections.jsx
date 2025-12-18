import ProductCard from '../ProductCard';
import { cn } from '../../utils/cn';

const SectionShell = ({ title, children, className }) => (
  <section className={cn('space-y-6 py-8', className)}>
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
    </div>
    {children}
  </section>
);

const ProductGrid = ({ products, onAddToCart }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product._id || product.id || product.slug || product.name}
        product={product}
        onAddToCart={onAddToCart}
      />
    ))}
  </div>
);

export const BestSellingProducts = ({ products, onAddToCart, className }) => (
  <SectionShell title="Best Selling Products" className={className}>
    <ProductGrid products={products} onAddToCart={onAddToCart} />
  </SectionShell>
);

export const TrendingProducts = ({ products, onAddToCart, className }) => (
  <SectionShell title="Trending Products" className={className}>
    <ProductGrid products={products} onAddToCart={onAddToCart} />
  </SectionShell>
);

export default BestSellingProducts;
