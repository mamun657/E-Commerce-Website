import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DEFAULT_EXCHANGE_RATES, formatBDT } from '../utils/currency';
import { getPrimaryImage, FALLBACK_PRODUCT_IMAGE } from '../utils/image';

const ProductCard = ({ product, onAddToCart }) => {
  const approxBdt = formatBDT(Number(product.price) || 0, {
    rate: DEFAULT_EXCHANGE_RATES.USD_TO_BDT
  });
  const compareAtPriceBdt = product.compareAtPrice
    ? formatBDT(Number(product.compareAtPrice) || 0, {
        rate: DEFAULT_EXCHANGE_RATES.USD_TO_BDT
      })
    : null;
  const ratingValue = Number(product.rating?.average) || 0;
  const ratingLabel = ratingValue > 0 ? ratingValue.toFixed(1) : '0.0';
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const primaryImage = getPrimaryImage(product?.images, FALLBACK_PRODUCT_IMAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-[#111827] via-[#0d1321] to-[#0b0f14] shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-lg hover-glow">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
        />
        <Link to={`/product/${product._id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-3">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900/60">
              <img
                src={primaryImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                }}
                className="h-full w-full object-contain transition duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
              />
            </div>
            {isOutOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-500 shadow">
                Out of Stock
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-3 rounded-2xl ring-1 ring-cyan-400/30 blur-[1px]" />
            </div>
          </div>
        </Link>
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-semibold leading-tight text-foreground/90 line-clamp-2 tracking-tight transition-colors hover:text-primary">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            <div className="flex items-center rounded-full bg-slate-800/60 px-3 py-1 text-sm text-muted-foreground shadow-inner shadow-black/30">
              <span className="text-amber-400">★</span>
              <span className="ml-1 font-semibold text-foreground">{ratingLabel}</span>
            </div>
          </div>

          {/* Price Display: BDT Only */}
          <div className="flex items-end gap-2">
            {/* Primary BDT Price */}
            <span className="text-2xl font-bold tracking-tight text-primary drop-shadow-[0_0_30px_rgba(78,243,195,0.35)]">
              {approxBdt.formatted}
            </span>
            {/* Old Price (strikethrough) in BDT */}
            {compareAtPriceBdt && (
              <span className="text-sm text-muted-foreground line-through">
                {compareAtPriceBdt.formatted}
              </span>
            )}
          </div>

          <Button
            variant="gradient"
            className="mt-auto w-full"
            disabled={isOutOfStock}
            onClick={(event) => {
              event.preventDefault();
              if (!isOutOfStock) {
                onAddToCart(product);
              }
            }}
          >
            <ShoppingCart size={16} className="mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default memo(ProductCard);
