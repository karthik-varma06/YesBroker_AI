"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Building2,
  Menu,
  X,
  Home,
  Search,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: Building2 },
  { label: "Voice AI", href: "/voice-agent", icon: Phone },
  // { label: "Negotiation", href: "/negotiation", icon: Zap },
  // { label: "CRM", href: "/crm", icon: Users },
  // { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-2xl shadow-black/50" : "bg-transparent"
      }`}
      style={
        isScrolled
          ? {
              background: "rgba(5, 8, 22, 0.97)",
              backdropFilter: "blur(60px)",
              WebkitBackdropFilter: "blur(60px)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            id="nav-logo"
          >
            <div className="relative w-9 h-9 shrink-0">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-[17px] tracking-tight">
                <span className="text-gradient-blue">Yes</span>
                <span className="text-[#F8FAFC]">Broker</span>{" "}
                <span className="text-gradient-aurora font-black text-[13px]">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-[#94A3B8] tracking-widest uppercase font-medium mt-0.5"></span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center">
            {/* pill container */}
            <div
              className="flex items-center gap-0.5 rounded-2xl p-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`relative flex flex-col items-center px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                      active ? "text-white" : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "rgba(59,130,246,0.15)",
                          border: "1px solid rgba(59,130,246,0.25)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {item.sub && (
                      <span className="relative z-10 text-[10px] leading-none opacity-50 mt-0.5">
                        {item.sub}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
            className="lg:hidden p-2.5 rounded-xl transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#94A3B8]" />
            ) : (
              <Menu className="w-5 h-5 text-[#94A3B8]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(5,8,22,0.95)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(30px)",
            }}
          >
            <div className="px-6 py-5 space-y-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    id={`nav-mobile-${item.label.toLowerCase()}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === item.href
                        ? "text-[#22D3EE] bg-blue-500/10 border border-blue-500/20"
                        : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-3 flex gap-3">
                <Link
                  href="/voice-agent"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 justify-center text-sm"
                >
                  Get Started →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
