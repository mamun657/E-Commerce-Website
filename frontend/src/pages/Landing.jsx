import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import shoppingAnimation from '../assets/animations/shopping-hero.json';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-[#0b0f14] via-[#0f172a] to-[#0b0f14] py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6 text-center lg:text-left">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-foreground"
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
              >
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-[0_15px_60px_rgba(56,189,248,0.35)]">
                  Kinne Felun
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.8 }}
              >
                Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="flex justify-center lg:justify-start"
              >
                <Link to="/login">
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-[0_15px_40px_rgba(56,189,248,0.35)] transition hover:shadow-[0_20px_60px_rgba(56,189,248,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]">
                    Get Started
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                  </button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="relative flex justify-center lg:justify-end"
            >
              <motion.div
                className="relative max-w-sm w-full aspect-square [perspective:1200px]"
                initial={{ rotateX: -2, rotateY: 4, scale: 0.98 }}
                animate={{ rotateX: 0, rotateY: 0, scale: 1, y: 0 }}
                whileHover={{ rotateX: -4, rotateY: 6, scale: 1.03, y: -6 }}
                transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              >
                <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5 overflow-hidden transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/12 via-blue-500/12 to-indigo-500/16 pointer-events-none" />
                  <Lottie
                    animationData={shoppingAnimation}
                    loop
                    autoplay
                    className="relative h-full w-full object-contain"
                  />
                </div>
                <div className="absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.28),transparent_45%)] blur-3xl" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
