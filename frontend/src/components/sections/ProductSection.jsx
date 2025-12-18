import ProductCard from '../ProductCard';
import { cn } from '../../utils/cn';

const ProductSection = ({ title, products, onAddToCart, className }) => (
  <section className={cn('space-y-6 py-8', className)}>
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id || product.slug || product.name}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  </section>
);

export default ProductSection;
