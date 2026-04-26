'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronRight, Star, CircleCheck as CheckCircle2, FileText, MessageSquare, Minus, Plus, Shield, Truck, FlaskConical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/products/ProductCard';

const MOCK_REVIEWS = [
  { author: 'Dr. R. Mitchell', rating: 5, date: 'March 2025', body: 'Exceptional purity and consistency across multiple batches. The COA documentation is thorough and verifiable. This is my go-to source for research compounds.' },
  { author: 'J. Thornton, PhD', rating: 5, date: 'February 2025', body: 'Outstanding product quality. Arrived well-packaged with temperature integrity maintained throughout shipping. Results in our protocols have been highly reproducible.' },
  { author: 'Research Lab User', rating: 4, date: 'January 2025', body: 'Very good quality compound. Fast shipping and professional packaging. Will continue ordering for our ongoing research projects.' },
];

type TabType = 'description' | 'coa' | 'reviews';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDosage, setSelectedDosage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data: prod } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
      if (!prod) { setLoading(false); return; }
      setProduct(prod);
      setSelectedDosage(prod.dosage);

      if (prod.related_product_slugs?.length > 0) {
        const { data: related } = await supabase.from('products').select('*').in('slug', prod.related_product_slugs.slice(0, 4));
        setRelatedProducts(related || []);
      }

      const stored = localStorage.getItem('recentlyViewed');
      const viewed: string[] = stored ? JSON.parse(stored) : [];
      const others = viewed.filter((s) => s !== prod.slug).slice(0, 4);
      if (others.length > 0) {
        const { data: recent } = await supabase.from('products').select('*').in('slug', others);
        setRecentlyViewed(recent || []);
      }

      const newViewed = [prod.slug, ...viewed.filter((s) => s !== prod.slug)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(newViewed));

      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!addToCartRef.current) return;
      const rect = addToCartRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedDosage);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handlePayNow = () => {
    if (!product) return;
    clearCart();
    addItem(product, quantity, selectedDosage);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gold text-sm">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-lg font-bold">Product not found</p>
        <Link href="/shop" className="text-gold hover:underline text-sm">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-gold transition-colors">Peptides</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="overflow-hidden relative"
              style={{
                background: 'linear-gradient(160deg, #0f0f0f 0%, #0a0a0a 100%)',
                border: '1px solid rgba(212,175,55,0.1)',
                aspectRatio: '3 / 4',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 65%)' }}
              />
              <div className="w-full h-full flex items-center justify-center p-8">
                <div
                  className="w-full h-full relative"
                  style={{ filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(212,175,55,0.15))' }}
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Link href="/shop" className="text-gold/70 text-xs font-semibold tracking-widest uppercase hover:text-gold transition-colors">
              {product.category}
            </Link>
            <h1 className="font-barlow font-extrabold text-3xl md:text-4xl text-white mt-2 mb-2 tracking-tight uppercase">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold/30 text-gold/30" />
                ))}
              </div>
              <span className="text-gray-500 text-xs">(0 reviews)</span>
            </div>

            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-5">
                <p className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Highlights</p>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.dosage_options && product.dosage_options.length > 1 && (
              <div className="mb-5">
                <p className="text-white font-semibold text-xs uppercase tracking-wider mb-2">{product.name}</p>
                <div className="flex gap-2 flex-wrap">
                  {product.dosage_options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedDosage(opt)}
                      className={`px-4 py-2 rounded border text-sm font-medium transition-all ${selectedDosage === opt ? 'border-gold bg-gold/10 text-gold' : 'border-[#262626] text-gray-400 hover:border-gold/40 hover:text-white'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1.5">Clear</button>
              </div>
            )}

            <div className="text-3xl font-black text-gold mb-5">
              {product.price_max ? `$${product.price.toFixed(2)} – $${product.price_max.toFixed(2)}` : `$${product.price.toFixed(2)}`}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-[#262626] rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-gray-400 hover:text-gold hover:bg-white/5 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-white font-semibold w-10 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2.5 text-gray-400 hover:text-gold hover:bg-white/5 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                ref={addToCartRef}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 ${addedToCart ? 'bg-green-500 text-white' : 'bg-gold text-[#0a0a0a] hover:bg-gold-light hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)]'}`}
              >
                {addedToCart ? (
                  <><CheckCircle2 className="w-4 h-4" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                )}
              </button>
            </div>

            <button
              onClick={handlePayNow}
              className="text-sm text-zinc-500 hover:text-yellow-500 mt-3 mb-5 w-full transition"
            >
              Buy now → instant checkout
            </button>

            <div className="p-4 bg-[#111111] border border-[#262626] rounded-xl mb-5">
              <p className="text-gray-400 text-xs mb-2">Pay in 4 interest-free payments with <span className="text-[#003087] font-bold">Pay</span><span className="text-[#0070ba] font-bold">Pal</span>. <a href="#" className="text-[#0070ba] hover:underline">Learn more</a></p>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { label: 'PayPal', bg: '#003087', color: '#fff' },
                  { label: 'Apple Pay', bg: '#000', color: '#fff' },
                  { label: 'G Pay', bg: '#fff', color: '#000', border: true },
                  { label: 'Afterpay', bg: '#B2FCE4', color: '#000' },
                  { label: 'Shop Pay', bg: '#5A31F4', color: '#fff' },
                  { label: 'Klarna', bg: '#FFB3C7', color: '#000' },
                ].map((m) => (
                  <span key={m.label} style={{ backgroundColor: m.bg, color: m.color, border: m.border ? '1px solid #ddd' : 'none' }}
                    className="px-2.5 py-1 rounded text-[10px] font-bold">
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-500">
              {[
                { Icon: Shield, text: 'Lab Verified 99+%' },
                { Icon: Truck, text: 'Fast & Discreet Shipping' },
                { Icon: FlaskConical, text: 'COA Available' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  {text}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-600 border-t border-[#1a1a1a] pt-4">
              SKU: N/A &nbsp;·&nbsp; Category: <Link href={`/shop?category=${product.category}`} className="text-gold hover:underline">{product.category}</Link>
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <div className="flex border-b border-[#1e1e1e] mb-8">
            {([['description', 'Description'], ['coa', 'Certificate of Analysis (COA)'], ['reviews', `Reviews (${MOCK_REVIEWS.length})`]] as [TabType, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-colors relative ${activeTab === tab ? 'text-gold' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {label}
                {activeTab === tab && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">
              <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
              <div
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ border: '1px solid rgba(212,175,55,0.35)', background: 'rgba(212,175,55,0.04)' }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}
                >
                  <FileText className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-barlow font-extrabold text-white text-sm uppercase tracking-wide mb-1">Certificate of Analysis</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Third-party tested for purity and identity. COA available upon request —{' '}
                    <a
                      href="mailto:support@revivalpeptides.com"
                      className="text-gold hover:underline transition-colors"
                    >
                      contact support@revivalpeptides.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'coa' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <div className="p-6 bg-[#111111] border border-[#1e1e1e] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-barlow font-extrabold text-white uppercase">Certificate of Analysis</h3>
                    <p className="text-gray-500 text-xs">Third-party lab verification</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Every batch of {product.name} is tested by an independent, accredited third-party laboratory to verify purity, potency, and identity. Our COAs include HPLC purity analysis, mass spectrometry identity confirmation, and quantitation results.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Purity', value: '≥99+%' },
                    { label: 'Method', value: 'HPLC-UV' },
                    { label: 'Identity', value: 'MS Confirmed' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-3 bg-[#0d0d0d] rounded-lg border border-[#1e1e1e]">
                      <div className="text-gold font-bold text-base">{value}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-[#0a0a0a] font-bold text-sm rounded hover:bg-gold-light transition-colors">
                  <FileText className="w-4 h-4" />
                  Download COA (PDF)
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-5">
              {MOCK_REVIEWS.map((review, i) => (
                <div key={i} className="p-5 bg-[#111111] border border-[#1e1e1e] rounded-xl">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-gold text-gold' : 'fill-gold/20 text-gold/20'}`} />
                        ))}
                      </div>
                      <p className="text-white font-semibold text-sm">{review.author}</p>
                    </div>
                    <span className="text-gray-600 text-xs">{review.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{review.body}</p>
                </div>
              ))}

              <div className="p-5 bg-[#0d0d0d] border border-dashed border-[#262626] rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-gold" />
                  <h4 className="text-white font-semibold text-sm">Leave a Review</h4>
                </div>
                <p className="text-gray-500 text-sm">Have you used this compound in your research? Share your experience with other researchers.</p>
                <button className="mt-3 px-4 py-2 border border-gold/40 text-gold text-sm font-semibold rounded hover:bg-gold/10 transition-colors">
                  Write a Review
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t border-[#1a1a1a] pt-12 mb-12">
            <h2 className="font-barlow font-extrabold text-2xl text-white tracking-tight mb-6 uppercase">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="border-t border-[#1a1a1a] pt-12 pb-12">
            <h2 className="font-barlow font-extrabold text-xl text-white tracking-tight mb-6 uppercase">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
              {recentlyViewed.map((p, i) => (
                <div key={p.id} className="flex-shrink-0 w-48">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {showStickyBar && product && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{
              background: '#0f0f0f',
              borderTop: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="flex-shrink-0 w-10 h-10 relative"
                  style={{ background: 'transparent' }}
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-barlow font-extrabold text-white text-sm uppercase tracking-tight truncate">{product.name}</p>
                  <p className="font-barlow font-bold text-gold text-sm">
                    {product.price_max ? `$${product.price.toFixed(2)} – $${product.price_max.toFixed(2)}` : `$${product.price.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 font-inter font-bold text-sm uppercase tracking-wider transition-all duration-200"
                style={{ background: '#D4AF37', color: '#0a0a0a' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#c9a227'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#D4AF37'; }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
