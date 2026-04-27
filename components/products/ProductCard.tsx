'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, clearCart } = useCart();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const hasVariants = product.dosage_options && product.dosage_options.length > 1;

  const handlePayNow = (e: React.MouseEvent) => {
    e.preventDefault();
    clearCart();
    addItem(product, 1);
    router.push('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: '#0f0f0f',
        border: hovered ? '1px solid rgba(212,175,55,0.4)' : '1px solid #1e1e1e',
        borderRadius: '0',
      }}
    >
      <Link href={`/shop/${product.slug}`} className="block relative">
        <div className="w-full bg-[#0a0a0a]" style={{ aspectRatio: '1 / 1' }}>
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              background: '#0a0a0a',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge_text && product.badge_text !== '' && (
            <span
              className="font-inter text-[10px] font-bold tracking-wide px-2 py-0.5 uppercase"
              style={{ background: 'rgba(10,10,10,0.85)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0' }}
            >
              {product.badge_text}
            </span>
          )}
          {product.is_new_arrival && (
            <span
              className="font-inter text-[10px] font-bold tracking-wide px-2 py-0.5 uppercase"
              style={{ background: 'rgba(10,10,10,0.85)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0' }}
            >
              New
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="font-inter text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: '#D4AF37' }}>
          LAB VERIFIED
        </p>

        <Link href={`/shop/${product.slug}`}>
          <h3
            className="font-barlow font-extrabold text-base leading-snug mb-2 uppercase transition-colors"
            style={{ color: hovered ? '#D4AF37' : '#ffffff' }}
          >
            {product.name}
          </h3>
        </Link>

        <p className="font-inter text-xs mb-3" style={{ color: '#606060' }}>
          COA Endotoxin + Purity, ID, Quantitation
        </p>

        <div className="mt-auto space-y-2">
          <p className="font-barlow font-extrabold text-lg leading-none" style={{ color: '#D4AF37' }}>
            {product.price_max
              ? `$${product.price.toFixed(0)} – $${product.price_max.toFixed(0)}`
              : `$${product.price.toFixed(2)}`}
          </p>
          <p className="font-inter text-[11px]" style={{ color: '#606060' }}>Ships in 24hrs</p>

          <div className="pt-1 space-y-1.5">
            {hasVariants ? (
              <Link
                href={`/shop/${product.slug}`}
                className="block w-full py-2.5 text-center font-inter font-bold text-xs uppercase tracking-wider transition-all duration-200"
                style={{ background: '#D4AF37', color: '#0a0a0a', borderRadius: '0' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#c9a227')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#D4AF37')}
              >
                Select Options
              </Link>
            ) : (
              <>
                <button
                  onClick={() => addItem(product)}
                  className="w-full py-2.5 font-inter font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ background: '#D4AF37', color: '#0a0a0a', borderRadius: '0' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#c9a227')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#D4AF37')}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
                <button
                  onClick={handlePayNow}
                  className="w-full py-2 font-inter font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ background: 'transparent', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
