import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, LogOut, Menu, X, Moon, Sun, Globe2, ArrowRight, MapPin, Store } from 'lucide-react';
import { Button } from './ui/Button';
import HoverDropdown from './HoverDropdown';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatBDT } from '../utils/currency';
import { useUser } from '../context/UserContext';

const DropdownLink = ({ to, label, description }) => (
  <Link
    to={to}
    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 transition hover:border-border hover:bg-muted/60"
  >
    <div>
      <p className="text-sm font-semibold">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <ArrowRight size={16} className="text-muted-foreground" />
  </Link>
);

const Navbar = () => {
  const { isAuthenticated, user: authUser } = useSelector((state) => state.auth);
  const { user } = useUser();
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? stored === 'true' : true;
  });
  const [locale] = useState({
    language: 'English (BD)',
    country: 'Bangladesh',
    currency: 'BDT — Bangladeshi Taka'
  });
  const previewItems = cart?.items?.slice(0, 3) || [];
  const hasCartItems = previewItems.length > 0;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const displayName = user?.name || user?.email;
  const avatarFallback = (user?.name || user?.email || 'U')?.charAt(0)?.toUpperCase();

  // Use Redux state directly for role detection
  const isAdmin = authUser?.role === 'admin';

  const handleAvatarClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  // Determine logo destination based on auth state and role
  const getLogoDestination = () => {
    if (!isAuthenticated) return '/';
    if (isAdmin) return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-[#0b0f14]/80 backdrop-blur-xl shadow-[0_10px_60px_rgba(0,0,0,0.55)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={getLogoDestination()}
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(56,189,248,0.35)]"
          >
            Apnar Dokan
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/shop"
              className="group relative text-sm font-semibold text-muted-foreground transition hover:text-primary"
            >
              Shop
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="group relative text-sm font-semibold text-muted-foreground transition hover:text-primary"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="group relative text-sm font-semibold text-muted-foreground transition hover:text-primary"
                  >
                    Admin
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated && (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/login?mode=signup">
                  <Button variant="gradient" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <HoverDropdown
              widthClass="w-80"
              caretPosition="right-8"
              trigger={
                <Link
                  to="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/5 text-foreground transition hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-destructive-foreground">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              }
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    Shopping Cart
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasCartItems
                      ? `${cartItemCount} item${cartItemCount === 1 ? '' : 's'} ready for checkout`
                      : 'You have no items yet'}
                  </p>
                </div>
                {hasCartItems ? (
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                    {previewItems.map((item) => {
                      const product = item.product || item;
                      const imageSrc = product?.images?.[0];
                      const productPrice = product?.price;
                      return (
                        <div
                          key={item._id || item.productId || product?._id || product?.name}
                          className="flex items-center gap-3 rounded-2xl border border-transparent bg-muted/40 p-3 transition hover:border-border hover:bg-muted/70"
                        >
                          <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={product?.name || 'Product image'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {product?.name || 'Product'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty {item.quantity}
                              {productPrice ? ` • ${formatBDT(Number(productPrice) || 0).formatted}` : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {cartItemCount > previewItems.length && (
                      <p className="text-xs text-muted-foreground text-right">
                        +{cartItemCount - previewItems.length} more item{cartItemCount - previewItems.length === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center rounded-2xl bg-muted/40 p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md shadow-slate-900/5 dark:bg-slate-800">
                      <ShoppingCart size={24} className="text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-base font-semibold">Your bag feels light</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add items to preview them here instantly.
                    </p>
                  </div>
                )}
                <Link to="/cart" className="block">
                  <Button variant="gradient" className="w-full">
                    Go to cart
                  </Button>
                </Link>
              </div>
            </HoverDropdown>

            <HoverDropdown
              widthClass="w-72"
              caretPosition="right-4"
              trigger={
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-white/5 text-foreground transition hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName || 'Profile avatar'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold">{avatarFallback}</span>
                  )}
                </button>
              }
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    Account
                  </p>
                  {isAuthenticated ? (
                    <>
                      <p className="mt-2 text-base font-semibold">
                        {displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">Manage your experience</p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Sign in to view orders and personalized picks.
                    </p>
                  )}
                </div>
                {isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      <DropdownLink to="/dashboard" label="Profile" description="Personal details" />
                      <DropdownLink to="/dashboard?tab=orders" label="Orders" description="Track & manage" />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="block">
                      <Button variant="gradient" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link to="/login?mode=signup" className="block">
                      <Button variant="outline" className="w-full">
                        Create account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </HoverDropdown>

            <HoverDropdown
              className="hidden sm:inline-flex"
              align="right"
              widthClass="w-64"
              caretPosition="right-2"
              trigger={
                <button
                  type="button"
                  className="flex h-10 items-center rounded-full border border-border/60 bg-white/5 px-4 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
                  aria-label="Language and region"
                >
                  <Globe2 size={18} className="mr-2" />
                  EN
                </button>
              }
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    Language & Region
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-base font-semibold">
                    <Globe2 size={16} />
                    {locale.language}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {locale.country}
                  </p>
                  <p className="text-xs text-muted-foreground">{locale.currency}</p>
                </div>
              </div>
            </HoverDropdown>

            {/* Mobile Shop Button */}
            <Link
              to="/shop"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/5 text-foreground transition hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
              aria-label="Shop"
            >
              <Store size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/5 text-foreground transition hover:border-primary/60 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4"
            >
              <Link
                to="/shop"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted/60 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Store size={18} />
                Shop
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted/60 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted/60 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={18} />
                    Cart ({cartItemCount})
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted/60 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
