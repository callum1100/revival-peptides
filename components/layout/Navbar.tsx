'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];


export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex items-center justify-between">
          <span className="font-inter text-[11px] text-[#a0a0a0] tracking-wide">
            For Research Purposes Only. Not For Human Consumption.
          </span>
          <span className="font-inter text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: '#D4AF37' }}>
            FREE SHIPPING ON ORDERS $250+
          </span>
        </div>
      </div>

      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.97)' : '#000000',
          borderBottom: scrolled ? '1px solid rgba(212,175,55,0.3)' : '1px solid #1a1a1a',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between relative">

          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/image.png"
              alt="Revival Peptides"
              width={160}
              height={48}
              priority
              style={{ height: '48px', width: 'auto' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-inter text-[13px] uppercase tracking-[0.12em] font-medium transition-colors duration-200 group pb-1"
                  style={{ color: active ? '#D4AF37' : '#ffffff' }}
                >
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 h-[2px] transition-all duration-300"
                    style={{ width: active ? '100%' : '0%', background: '#D4AF37' }}
                  />
                  {!active && (
                    <span className="absolute bottom-0 left-0 h-[2px] bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center transition-colors"
              style={{
                width: '44px',
                height: '44px',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#ffffff',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 font-inter text-[10px] font-black rounded-full flex items-center justify-center"
                    style={{
                      background: '#D4AF37',
                      color: '#000000',
                      minWidth: '18px',
                      minHeight: '18px',
                      padding: '0 4px',
                    }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2 text-[#a0a0a0] hover:text-[#D4AF37] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ borderTop: '1px solid #1e1e1e', background: '#0a0a0a' }}
            >
              <div className="px-6 py-5 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-inter text-sm uppercase tracking-[0.12em] font-medium transition-colors py-1"
                    style={{ color: pathname === link.href ? '#D4AF37' : '#a0a0a0' }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-[#1e1e1e]">
                  <p className="font-inter text-[11px] uppercase tracking-[0.12em] font-semibold" style={{ color: '#D4AF37' }}>
                    FREE SHIPPING ON ORDERS $250+
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
