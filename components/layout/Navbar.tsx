'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Building2, Menu, X, Home, Search, Zap, BarChart3, Users
} from 'lucide-react';

const navItems = [
  { label: 'Platform', href: '/', icon: Home },
  { label: 'Marketplace', href: '/marketplace', icon: Building2 },
  { label: 'Voice AI', href: '/voice-agent', icon: Phone },
  { label: 'Negotiation', href: '/negotiation', icon: Zap },
  { label: 'CRM', href: '/crm', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-champagne-500/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-champagne-400 to-champagne-600 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
              <Building2 className="absolute inset-0 w-full h-full p-1.5 text-obsidian-900" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gold-text">YES</span>
              <span className="text-ivory-100">BROKER</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === item.href
                  ? 'text-champagne-400 bg-champagne-500/10'
                  : 'text-gray-400 hover:text-ivory-100 hover:bg-white/5'
                  }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-ivory-100 hover:bg-white/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-champagne-500/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname === item.href
                    ? 'text-champagne-400 bg-champagne-500/10'
                    : 'text-gray-400 hover:text-ivory-100 hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
