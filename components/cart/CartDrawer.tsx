'use client';

import React from 'react';
import { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, Package, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { AuthModal } from '@/components/auth/AuthModal';

const FREE_SHIPPING_THRESHOLD = 250;

const ORDER_BUMP = {
  name: 'Bacteriostatic Water (30ml)',
  price: 12,
  description: 'Essential for peptide reconstitution',
};

const PAYMENT_METHODS = [
  { label: 'Apple Pay', bg: '#000000', color: '#ffffff' },
  { label: 'G Pay', bg: '#ffffff', color: '#000000' },
  { label: 'PayPal', bg: '#003087', color: '#ffffff' },
  { label: 'Afterpay', bg: '#B2FCE4', color: '#000000' },
  { label: 'Shop Pay', bg: '#5A31F4', color: '#ffffff' },
];

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const [orderBump, setOrderBump] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const total = subtotal + (orderBump ? ORDER_BUMP.price : 0);
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] flex flex-col z-50"
            style={{ background: '#0d0d0d', borderLeft: '1px solid #1e1e1e', boxShadow: '-10px 0 40px rgba(0,0,0,0.6)' }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e1e' }}>
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <h2 className="font-barlow font-extrabold text-white text-sm uppercase tracking-wider">Your Cart</h2>
                {items.length > 0 && (
                  <span
                    className="font-inter text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}
                  >
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded transition-colors"
                style={{ color: '#a0a0a0' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e1e1e' }}>
              <div className="flex justify-between font-inter text-xs mb-2">
                {remaining > 0 ? (
                  <span style={{ color: '#a0a0a0' }}>
                    <span style={{ color: '#D4AF37', fontWeight: 600 }}>${remaining.toFixed(0)}</span> away from FREE shipping
                  </span>
                ) : (
                  <span style={{ color: '#4ade80', fontWeight: 600 }}>You qualify for FREE shipping!</span>
                )}
                <span style={{ color: '#4a4a4a' }}>${FREE_SHIPPING_THRESHOLD}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e1e' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #A8861B, #D4AF37)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ border: '1px solid #262626' }}>
                    <ShoppingBag className="w-7 h-7" style={{ color: '#3a3a3a' }} />
                  </div>
                  <div>
                    <p className="font-barlow font-extrabold text-white text-base mb-1 uppercase">Your cart is empty</p>
                    <p className="font-inter text-sm" style={{ color: '#a0a0a0' }}>Add research compounds to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-5 py-2.5 font-inter font-bold text-sm rounded transition-colors"
                    style={{ background: '#D4AF37', color: '#0a0a0a' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#c9a227')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#D4AF37')}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedDosage}`}
                      className="flex gap-3 p-3 rounded-lg"
                      style={{ background: '#141414', border: '1px solid #1e1e1e' }}
                    >
                      <div className="w-16 h-16 flex-shrink-0" style={{ background: '#0a0a0a' }}>
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                            padding: '4px',
                            background: '#0a0a0a',
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-barlow text-white text-xs font-bold leading-snug">{item.product.name}</p>
                            {item.selectedDosage && (
                              <p className="font-inter text-xs mt-0.5" style={{ color: '#a0a0a0' }}>{item.selectedDosage}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="flex-shrink-0 mt-0.5 transition-colors"
                            style={{ color: '#4a4a4a' }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4a4a4a')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded" style={{ background: '#0d0d0d', border: '1px solid #262626' }}>
                            <button
                              onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                              className="px-2 py-1 transition-colors"
                              style={{ color: '#a0a0a0' }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-inter text-white text-sm w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 transition-colors"
                              style={{ color: '#a0a0a0' }}
                              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
                              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-barlow font-bold text-sm" style={{ color: '#D4AF37' }}>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 space-y-3.5" style={{ borderTop: '1px solid #1e1e1e' }}>
                <div
                  className="p-3.5 rounded-lg cursor-pointer"
                  style={{ background: '#151515', borderLeft: '2px solid #D4AF37', border: '1px solid #262626', borderLeftWidth: '2px' }}
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderBump}
                      onChange={(e) => setOrderBump(e.target.checked)}
                      className="mt-0.5 w-4 h-4 flex-shrink-0"
                      style={{ accentColor: '#D4AF37' }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                          <span className="font-inter text-white text-xs font-semibold">Add {ORDER_BUMP.name}</span>
                        </div>
                        <span className="font-barlow font-bold text-sm" style={{ color: '#D4AF37' }}>${ORDER_BUMP.price}</span>
                      </div>
                      <p className="font-inter text-[11px] mt-0.5" style={{ color: '#a0a0a0' }}>{ORDER_BUMP.description}</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-inter text-sm">
                    <span style={{ color: '#a0a0a0' }}>Subtotal</span>
                    <span className="text-white font-semibold">${total.toFixed(2)}</span>
                  </div>
                  {total >= FREE_SHIPPING_THRESHOLD && (
                    <div className="flex justify-between font-inter text-sm">
                      <span style={{ color: '#a0a0a0' }}>Shipping</span>
                      <span style={{ color: '#4ade80', fontWeight: 500 }}>FREE</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center font-inter font-black text-sm rounded uppercase tracking-wide transition-all duration-200"
                  style={{ background: '#D4AF37', color: '#0a0a0a', minHeight: '52px' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#c9a227'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,175,55,0.35)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  PROCEED TO CHECKOUT — ${total.toFixed(2)}
                </Link>

                <div className="flex items-center justify-center gap-1.5 font-inter text-[11px]" style={{ color: '#4a4a4a' }}>
                  <Lock className="w-3 h-3" style={{ color: '#4ade80' }} />
                  Secure checkout
                </div>

                <div>
                  <p className="text-center font-inter text-[10px] mb-2.5 uppercase tracking-wider" style={{ color: '#4a4a4a' }}>Accepted payments</p>
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {PAYMENT_METHODS.map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center justify-center px-3 rounded font-inter text-[10px] font-bold"
                        style={{ background: m.bg, color: m.color, minWidth: '56px', minHeight: '26px' }}
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 text-center">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs text-zinc-500 hover:text-yellow-500 transition-colors"
                  >
                    Have an account? <span className="text-yellow-500 underline">Sign in</span>
                  </button>
                </div>

                <AuthModal
                  isOpen={authModalOpen}
                  onClose={() => setAuthModalOpen(false)}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
