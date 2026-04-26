'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Mail, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('exit-modal-dismissed')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !shown.current) {
        shown.current = true;
        setTimeout(() => setVisible(true), 200);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('exit-modal-dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_intent' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setCode(data.code);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full overflow-hidden rounded-2xl flex flex-col md:flex-row"
              style={{
                maxWidth: '680px',
                background: '#0d0d0d',
                border: '1px solid #1e1e1e',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              }}
            >
              <div className="hidden md:block relative" style={{ width: '280px', flexShrink: 0, minHeight: '400px' }}>
                <Image
                  src="/images/products/v2_bpc157.webp"
                  alt="BPC-157"
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, transparent 60%, #0d0d0d 100%)' }}
                />
                <div
                  className="absolute bottom-6 left-6 rounded-lg px-3 py-2"
                  style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <p className="font-barlow text-white font-bold text-xs">BPC-157 — 10mg</p>
                  <p className="font-inter text-[10px] mt-0.5" style={{ color: '#4ade80' }}>99+% Purity Verified</p>
                </div>
              </div>

              <div className="flex-1 p-8 relative">
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 p-1.5 rounded transition-colors"
                  style={{ color: '#a0a0a0' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                >
                  <X className="w-4 h-4" />
                </button>

                {!code ? (
                  <>
                    <div
                      className="inline-flex items-center gap-2 rounded-full font-inter text-[11px] font-semibold tracking-[0.18em] uppercase px-3.5 py-1.5 mb-5"
                      style={{ border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', background: 'rgba(212,175,55,0.06)' }}
                    >
                      Exclusive Offer
                    </div>

                    <h2 className="font-barlow font-extrabold mb-3 leading-tight uppercase" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ffffff' }}>
                      Get <span style={{ color: '#D4AF37' }}>5% Off</span><br />Your First Order
                    </h2>
                    <p className="font-inter text-sm leading-[1.75] mb-6" style={{ color: '#a0a0a0' }}>
                      Join thousands of researchers. Subscribe for exclusive deals, new product alerts, and research insights.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a0a0a0' }} />
                        <input
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg font-inter text-sm text-white placeholder:text-[#4a4a4a] focus:outline-none transition-colors"
                          style={{ background: '#141414', border: '1px solid #262626' }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
                        />
                      </div>
                      {error && <p className="text-red-400 text-xs">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-inter font-bold text-sm uppercase tracking-wide transition-all duration-200 disabled:opacity-60"
                        style={{ background: '#D4AF37', color: '#0a0a0a' }}
                        onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLElement).style.background = '#c9a227'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,175,55,0.4)'; } }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                      >
                        {loading ? 'Saving...' : 'Claim My 5% Discount'}
                      </button>
                    </form>

                    <button
                      onClick={dismiss}
                      className="w-full mt-3 font-inter text-xs py-2 transition-colors"
                      style={{ color: '#4a4a4a' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4a4a4a')}
                    >
                      No thanks, I prefer full price
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}
                    >
                      <Check className="w-7 h-7" style={{ color: '#D4AF37' }} />
                    </div>
                    <h3 className="font-barlow font-extrabold text-white text-2xl mb-2 uppercase">You&apos;re In!</h3>
                    <p className="font-inter text-sm mb-6" style={{ color: '#a0a0a0' }}>
                      Use this code at checkout for <span style={{ color: '#D4AF37', fontWeight: 600 }}>5% off</span> your first order:
                    </p>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-3 rounded-xl py-4 px-8 mb-3 transition-all duration-200 group"
                      style={{
                        background: 'rgba(212,175,55,0.08)',
                        border: '2px dashed rgba(212,175,55,0.6)',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#D4AF37')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.6)')}
                    >
                      <span className="font-mono font-bold text-3xl tracking-widest" style={{ color: '#D4AF37' }}>
                        {code}
                      </span>
                      <span className="transition-colors" style={{ color: copied ? '#4ade80' : '#a0a0a0' }}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </span>
                    </button>
                    <p className="font-inter text-xs" style={{ color: '#4a4a4a' }}>
                      {copied ? 'Copied!' : 'Click to copy'}
                    </p>
                    <button
                      onClick={dismiss}
                      className="mt-6 font-inter text-sm transition-colors"
                      style={{ color: '#D4AF37' }}
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
