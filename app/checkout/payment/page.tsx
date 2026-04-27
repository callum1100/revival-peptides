'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Check, CircleAlert as AlertCircle, Loader as Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= 250 ? 0 : 9.99;
  const total = subtotal + shipping;

  useEffect(() => {
    const saved = sessionStorage.getItem('checkout_data');
    if (!saved) {
      router.push('/checkout');
      return;
    }
    setCheckoutData(JSON.parse(saved));
  }, [router]);

  async function handlePayment() {
    if (!checkoutData) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            email: checkoutData.email,
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            phone: checkoutData.phone,
          },
          shipping: {
            address1: checkoutData.address1,
            address2: checkoutData.address2,
            city: checkoutData.city,
            state: checkoutData.state,
            postcode: checkoutData.postcode,
            country: checkoutData.country || 'US',
          },
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      sessionStorage.removeItem('checkout_data');
      clearCart();
      window.location.href = data.paymentUrl;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(msg);
      setLoading(false);
    }
  }

  if (!checkoutData) return null;

  const shipTo = [
    `${checkoutData.firstName} ${checkoutData.lastName}`,
    checkoutData.address1,
    checkoutData.address2,
    `${checkoutData.city}, ${checkoutData.state} ${checkoutData.postcode}`,
    checkoutData.country || 'US',
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/image copy.png"
              alt="Revival Peptides"
              width={140}
              height={42}
              style={{ height: '40px', width: 'auto' }}
            />
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
            <span className="text-gray-500">Cart</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500">Information</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-semibold">Payment</span>
          </nav>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* LEFT — Payment section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-white font-bold text-base mb-5 pb-3 border-b border-[#1a1a1a]">
              Review &amp; Pay
            </h2>

            {/* Info recap */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl overflow-hidden mb-6">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</span>
                <button
                  onClick={() => router.push('/checkout')}
                  className="text-[#D4AF37] text-xs hover:underline transition-colors"
                >
                  Change
                </button>
              </div>
              <div className="px-5 py-3.5 text-sm text-white border-b border-[#1a1a1a]">
                {checkoutData.email}
              </div>

              <div className="px-5 py-3.5">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Ship to</div>
                <div className="text-sm text-white whitespace-pre-line leading-relaxed">
                  {shipTo}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/50 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-3 font-black text-[#0a0a0a] bg-[#D4AF37] hover:bg-[#F5D76E] transition-all duration-200 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] rounded-lg uppercase tracking-wider text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37] disabled:hover:shadow-none"
              style={{ minHeight: '56px' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Complete Payment — ${total.toFixed(2)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>256-bit SSL</span>
              </div>
              <div className="w-px h-3 bg-[#262626]" />
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Lock className="w-3 h-3 text-green-500" />
                <span>Secure checkout</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:sticky lg:top-6"
          >
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1a1a1a]">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">Order Summary</h2>
              </div>

              <div className="px-6 py-4">
                {items.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">Your cart is empty.</p>
                    <Link href="/shop" className="text-[#D4AF37] text-sm hover:underline mt-2 inline-block">Browse products</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedDosage}`} className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-lg bg-[#111111] border border-[#1e1e1e] overflow-hidden flex-shrink-0">
                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0a0a0a] text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium leading-snug truncate">{item.product.name}</p>
                          {item.selectedDosage && (
                            <p className="text-gray-600 text-xs mt-0.5">{item.selectedDosage}</p>
                          )}
                        </div>
                        <p className="text-[#D4AF37] font-semibold text-sm flex-shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 pb-4 space-y-2.5 border-t border-[#1a1a1a] pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-400 font-medium">FREE</span>
                  ) : (
                    <span className="text-white">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-black pt-2.5 border-t border-[#1e1e1e]">
                  <span className="text-white">Total</span>
                  <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="px-6 pb-5">
                <div className="flex gap-3 p-3 bg-[#111111] rounded-xl border border-[#1e1e1e] items-start">
                  <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-semibold">Satisfaction guaranteed</p>
                    <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">Lab-verified purity on every order. Questions? We&apos;re here 24/7.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
