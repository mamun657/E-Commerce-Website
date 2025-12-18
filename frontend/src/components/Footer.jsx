import React from 'react';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

// Footer for the site-wide layout
const Footer = () => {
  return (
    <footer className="bg-black text-gray-400">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-[0.2em] text-white">ORGANIC STORE</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Fresh, sustainable products delivered with care. We believe in quality ingredients and
              honest service for every shopper.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["About", "Cart", "Checkout", "Contact", "My Account", "Shop"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-colors duration-150 hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Site Links</h3>
            <ul className="space-y-3 text-sm">
              {["Privacy Policy", "Shipping Details", "Offers & Coupons", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-colors duration-150 hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App Downloads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Download Our Mobile App</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Shop on the go and never miss a deal. Available on Android and iOS.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex w-44 items-center justify-between rounded-lg border border-gray-700 bg-[#111] px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-500 hover:bg-[#161616]"
              >
                <FaGooglePlay className="text-lg" aria-hidden />
                <span className="ml-3 flex-1 text-right">Get it on Play</span>
              </a>
              <a
                href="#"
                className="inline-flex w-44 items-center justify-between rounded-lg border border-gray-700 bg-[#111] px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-500 hover:bg-[#161616]"
              >
                <FaApple className="text-lg" aria-hidden />
                <span className="ml-3 flex-1 text-right">Download on App Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
