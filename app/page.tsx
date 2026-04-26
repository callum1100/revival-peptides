'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CircleCheck as CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';

const STATS = [
  { value: '99.9%', label: 'Purity' },
  { value: 'USA', label: 'Manufactured' },
  { value: '47', label: 'Countries Served' },
];

const ABOUT_FEATURES = [
  { title: 'Lab-Verified Quality', description: 'Third-party tested for purity and identity' },
  { title: 'Expert Support', description: 'Knowledgeable team available 24/7' },
  { title: 'Secure Packaging', description: 'Temperature-controlled delivery' },
  { title: 'Fast Shipping', description: 'Expedited delivery options' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase.from('products').select('*').eq('is_featured', true).limit(4);
      setFeaturedProducts(data || []);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="bg-[#0a0a0a]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', background: '#0a0a0a', overflowX: 'clip' }}
      >

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-0 items-center">

            {/* LEFT — text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="inline-flex items-center mb-7 font-inter text-[11px] font-semibold tracking-[0.15em] uppercase px-5 py-2"
                style={{
                  border: '1px solid #D4AF37',
                  color: '#D4AF37',
                  borderRadius: '9999px',
                  background: 'rgba(212,175,55,0.08)',
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                  style={{ background: '#D4AF37' }}
                />
                Premium Research Peptides
              </motion.div>

              <h1 className="leading-[0.92] mb-4 uppercase" style={{ letterSpacing: '0.02em' }}>
                <span
                  className="block font-barlow font-extrabold text-white"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', lineHeight: 1.05 }}
                >
                  RESEARCH-GRADE PEPTIDES.
                </span>
                <span
                  className="block font-barlow font-extrabold"
                  style={{
                    fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                    lineHeight: 1.05,
                    color: '#D4AF37',
                  }}
                >
                  LAB-VERIFIED PURITY.
                </span>
              </h1>

              <p
                className="font-barlow font-semibold italic mb-10"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.45rem)', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.01em' }}
              >
                Revive Your Potential.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Link
                  href="/shop"
                  className="font-inter inline-flex items-center gap-3 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 group"
                  style={{ background: '#D4AF37', color: '#0a0a0a', borderRadius: '9999px' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#b8911f'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; }}
                >
                  SHOP NOW
                  <span
                    className="inline-flex items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
                    style={{ width: '22px', height: '22px', background: 'rgba(0,0,0,0.18)' }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

            </motion.div>

            {/* RIGHT — hero image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-end mt-10 lg:mt-0"
              style={{ overflow: 'visible' }}
            >
              <img
                src="/hero_final_v2.png"
                alt="Revival Peptides research grade vials"
                style={{
                  width: '140%',
                  maxWidth: 'none',
                  objectFit: 'contain',
                  objectPosition: 'right center',
                  mixBlendMode: 'lighten',
                  transform: 'translateX(8%)',
                }}
              />
            </motion.div>
          </div>

          {/* Stats row — full-width centered */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center mt-12 pt-8 w-full"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <div className="flex-shrink-0 mx-10" style={{ width: '2px', height: '40px', background: '#D4AF37', opacity: 0.5 }} />
                )}
                <div className="text-center">
                  <div
                    className="font-barlow font-extrabold leading-none"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#D4AF37' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-inter font-medium uppercase tracking-[0.15em] mt-1.5"
                    style={{ fontSize: '11px', color: '#a0a0a0' }}
                  >
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────── */}
      <div
        style={{
          background: '#111111',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          height: '60px',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-full flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-0 w-full max-w-2xl">
            {[
              { text: '99.9% Purity Tested' },
              { text: 'Ships in 24 Hours' },
              { text: 'COA Included With Every Order' },
            ].map((item, i) => (
              <React.Fragment key={item.text}>
                {i > 0 && (
                  <div className="flex-shrink-0 mx-6" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)' }} />
                )}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span className="font-inter text-sm font-medium whitespace-nowrap" style={{ color: '#a0a0a0' }}>{item.text}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="bg-[#0a0a0a]" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <FadeIn>
            <div className="mb-14 text-center">
              <div
                className="inline-flex items-center mb-5 font-inter text-[11px] font-semibold tracking-[0.15em] uppercase px-4 py-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', borderRadius: '0' }}
              >
                Featured Products
              </div>
              <h2 className="font-barlow font-extrabold leading-tight tracking-tight uppercase" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', color: '#ffffff' }}>
                PREMIUM RESEARCH<br />
                <span style={{ color: '#D4AF37' }}>PEPTIDES</span>
              </h2>
              <p className="font-inter text-sm mt-4 max-w-xl mx-auto leading-[1.8]" style={{ color: '#a0a0a0' }}>
                Engineered for precision. Backed by research. Trusted by professionals worldwide.
              </p>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden animate-pulse"
                  style={{ background: '#111111', border: '1px solid #1e1e1e' }}
                >
                  <div className="bg-[#141414]" style={{ paddingBottom: '120%' }} />
                  <div className="p-4 space-y-2.5">
                    <div className="h-2.5 bg-[#1e1e1e] w-1/3" />
                    <div className="h-4 bg-[#1e1e1e] w-3/4" />
                    <div className="h-9 bg-[#1e1e1e] mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          <FadeIn delay={0.2} className="mt-12 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 font-inter font-bold text-sm uppercase tracking-widest transition-all duration-200"
              style={{ border: '1px solid #ffffff', color: '#ffffff', borderRadius: '0' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#ffffff'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
            >
              VIEW ALL PRODUCTS
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a]" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div>
                <div
                  className="inline-flex items-center mb-6 font-inter text-[11px] font-semibold tracking-[0.15em] uppercase px-4 py-1.5"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', borderRadius: '0' }}
                >
                  About Revival Peptides
                </div>
                <h2 className="font-barlow font-extrabold leading-tight tracking-tight uppercase mb-6" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}>
                  <span className="text-white block">CUTTING-EDGE</span>
                  <span className="text-white block">RESEARCH</span>
                  <span style={{ color: '#D4AF37' }}>COMPOUNDS.</span>
                </h2>
                <p className="font-inter text-sm leading-[1.85] mb-4" style={{ color: '#a0a0a0' }}>
                  Revival Peptides delivers cutting-edge research compounds for professionals who demand excellence. Our commitment to purity, precision, and scientific integrity sets us apart in the industry.
                </p>
                <p className="font-inter text-sm leading-[1.85] mb-10" style={{ color: '#a0a0a0' }}>
                  Every product undergoes rigorous third-party testing to ensure the highest standards of quality. We partner with certified laboratories to verify purity, potency, and consistency across every batch.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {ABOUT_FEATURES.map(({ title, description }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-4 transition-all duration-200"
                      style={{ background: '#141414', borderLeft: '3px solid #D4AF37' }}
                    >
                      <div>
                        <p className="font-inter text-white text-sm font-bold">{title}</p>
                        <p className="font-inter text-xs mt-0.5 leading-relaxed" style={{ color: '#a0a0a0' }}>{description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-inter font-bold text-sm uppercase tracking-wider transition-all duration-200 group"
                  style={{ border: '1px solid #D4AF37', color: '#D4AF37', padding: '12px 28px', borderRadius: '0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  LEARN MORE ABOUT US
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="relative overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.12)' }}>
                  <img
                    src="/stats_bg.png"
                    alt="Revival Peptides vial"
                    className="w-full object-cover object-center"
                    style={{ height: '480px' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 60%)' }} />
                </div>
                <div
                  className="absolute bottom-6 left-6 p-4 backdrop-blur-sm"
                  style={{ background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <div className="font-cinzel font-black text-3xl leading-none" style={{ color: '#D4AF37' }}>10,000+</div>
                  <div className="font-inter text-white text-sm font-semibold mt-1">Satisfied Researchers</div>
                  <div className="font-inter text-xs mt-0.5" style={{ color: '#a0a0a0' }}>Worldwide</div>
                </div>
                <div
                  className="absolute bottom-6 right-6 p-4 text-right backdrop-blur-sm"
                  style={{ background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <div className="font-cinzel font-black text-3xl leading-none" style={{ color: '#D4AF37' }}>99.9%</div>
                  <div className="font-inter text-white text-sm font-semibold mt-1">Avg. Purity</div>
                  <div className="font-inter text-xs mt-0.5" style={{ color: '#a0a0a0' }}>Third-party verified</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── LAB-VERIFIED BANNER ─────────────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background: '#0a0a0a',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 55%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <FadeIn>
              <div>
                <h2 className="font-barlow font-extrabold leading-tight tracking-tight uppercase" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#ffffff' }}>
                  Lab-Verified.<br />
                  <span style={{ color: '#D4AF37' }}>Trusted Worldwide.</span>
                </h2>
                <p className="font-inter text-sm mt-3 max-w-md leading-[1.75]" style={{ color: '#a0a0a0' }}>
                  Join thousands of researchers who trust Revival Peptides for their most critical work.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <Link
                href="/about"
                className="flex-shrink-0 font-inter font-bold text-sm uppercase tracking-wider flex items-center gap-2 group transition-all duration-200 px-8 py-4"
                style={{ background: '#D4AF37', color: '#0a0a0a', borderRadius: '0' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#c9a227'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; }}
              >
                EXPLORE OUR SCIENCE
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
