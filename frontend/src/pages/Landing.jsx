import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f14] via-[#0f172a] to-[#0b0f14]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text drop-shadow-[0_15px_60px_rgba(56,189,248,0.35)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to ShopHub
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/login">
              <Button
                variant="gradient"
                size="lg"
                className="text-lg px-8 py-6 group"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="p-6 rounded-2xl glass-surface border border-border/60">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your orders delivered quickly and safely
              </p>
            </div>
            <div className="p-6 rounded-2xl glass-surface border border-border/60">
              <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Payment</h3>
              <p className="text-muted-foreground">
                Shop with confidence using our secure payment system
              </p>
            </div>
            <div className="p-6 rounded-2xl glass-surface border border-border/60">
              <h3 className="text-xl font-semibold mb-2 text-foreground">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our support team is always here to help you
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
