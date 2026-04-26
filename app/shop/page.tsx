'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = ['All', 'Peptides'];

const COMPOUND_FILTERS = [
  { label: 'GLP Agonists', slugs: ['glp-3r', 'glp-2t'] },
  { label: 'Repair Peptides', slugs: ['bpc-157-10mg', 'tb-500', 'bpc-157-tb500-combo', 'ghk-cu-50mg'] },
  { label: 'Growth Hormone', slugs: ['sermorelin-5mg', 'tesa-10mg', 'aod-9604-5mg', 'cjc-1295-ipamorelin'] },
  { label: 'Nootropic', slugs: ['semax-10mg', 'selank-10mg', 'pt-141-10mg'] },
  { label: 'Metabolic', slugs: ['nad-plus', 'mots-c-10mg', 'klow-80mg'] },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCompound, setSelectedCompound] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: true });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedCompound) {
      const filter = COMPOUND_FILTERS.find((f) => f.label === selectedCompound);
      if (filter) result = result.filter((p) => filter.slugs.includes(p.slug));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [products, selectedCategory, selectedCompound, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedCompound(null);
    setSearchQuery('');
    setSortBy('default');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedCompound !== null || searchQuery !== '';

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-gold font-bold text-xs tracking-[0.2em] uppercase mb-3 pb-2 border-b border-gold/25 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gold" />
          Category
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSelectedCompound(null); }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${selectedCategory === cat ? 'bg-gold/15 text-gold border border-gold/30 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1e1e1e] pt-5">
        <h3 className="text-gold font-bold text-xs tracking-[0.2em] uppercase mb-3 pb-2 border-b border-gold/25">Compound Type</h3>
        <div className="space-y-1.5">
          {COMPOUND_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setSelectedCompound(selectedCompound === f.label ? null : f.label)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${selectedCompound === f.label ? 'bg-gold/15 text-gold border border-gold/30 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="border-t border-[#1e1e1e] pt-4">
          <button onClick={clearFilters} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gold transition-colors">
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative py-16 bg-[#080808] border-b border-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-barlow font-extrabold text-4xl md:text-5xl text-gold tracking-widest uppercase mb-3"
          >
            Shop
          </motion.h1>
          <p className="text-gray-500 text-sm">Premium research compounds, lab-verified for purity and potency</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full text-gold text-xs font-semibold tracking-widest uppercase bg-gold/5">
          Featured Products
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-barlow font-extrabold text-4xl md:text-5xl text-white mb-3 tracking-tight uppercase">
            PREMIUM RESEARCH <span className="text-gold">PEPTIDES</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Engineered for precision. Backed by research. Trusted by professionals worldwide.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-[#111111] border border-[#262626] rounded-lg text-gray-300 text-sm focus:outline-none focus:border-gold/40 transition-colors cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#262626] rounded-lg text-gray-300 text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasActiveFilters && <span className="bg-gold text-[#0a0a0a] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">!</span>}
          </button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-56 flex-shrink-0">
            <FilterSidebar />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
                {hasActiveFilters && <span className="ml-2 text-gold text-xs font-medium">(filtered)</span>}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gold transition-colors">
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-[#1a1a1a]" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-[#1a1a1a] rounded w-1/2" />
                      <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
                      <div className="h-9 bg-[#1a1a1a] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full border border-[#262626] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium mb-2">No products found</p>
                <p className="text-gray-600 text-sm mb-4">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="px-5 py-2 bg-gold text-[#0a0a0a] text-sm font-bold rounded">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-[#0d0d0d] border-r border-[#262626] z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  );
}
