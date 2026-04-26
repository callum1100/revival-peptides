'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, FlaskConical } from 'lucide-react';
import Link from 'next/link';

const FAQ_SECTIONS = [
  {
    section: 'Products & Research',
    faqs: [
      {
        q: 'What are research peptides?',
        a: 'Research peptides are synthetic amino acid chains that are used exclusively for scientific and laboratory research purposes. They are not intended for human or animal consumption. Our peptides are supplied to researchers, scientists, and professionals for in-vitro and preclinical research applications.',
      },
      {
        q: 'Are your peptides intended for human use?',
        a: 'Absolutely not. All products sold by Revival Peptides are strictly for research purposes only and are not intended for human or animal use, consumption, or medical treatment. This is clearly stated on all of our product labels and documentation.',
      },
      {
        q: 'How do you ensure product purity?',
        a: 'Every batch of our peptides is tested by an independent, accredited third-party laboratory. We use High-Performance Liquid Chromatography (HPLC) to verify purity at ≥99.9%, and Mass Spectrometry (MS) to confirm the identity and molecular structure of each compound. Certificates of Analysis (COA) are available for every product.',
      },
      {
        q: 'Where can I find the Certificate of Analysis (COA)?',
        a: 'The COA for each product is available directly on the product detail page under the "Certificate of Analysis" tab. You can download the PDF directly. Our COAs include the lab name, testing methodology, purity percentage, identity confirmation, and batch number for full traceability.',
      },
    ],
  },
  {
    section: 'Shipping & Delivery',
    faqs: [
      {
        q: 'What are your shipping options?',
        a: 'We offer standard and expedited shipping options. All orders are shipped in discreet packaging to protect both product integrity and your privacy. Temperature-sensitive compounds are shipped with appropriate cold-packs and insulated packaging when required.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! We offer free shipping on all orders over $250. This applies automatically at checkout—no coupon code required. For orders under $250, standard shipping rates apply based on your location.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping typically takes 3-5 business days within the continental United States. Expedited options are available at checkout for faster delivery. International shipping times vary by destination. Once your order ships, you will receive a tracking number via email.',
      },
      {
        q: 'Is your packaging discreet?',
        a: 'Yes. All orders are shipped in plain, unmarked packaging with no external branding or product information that would indicate the contents. The sender name on shipping labels is generic to ensure complete discretion.',
      },
    ],
  },
  {
    section: 'Orders & Payments',
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept PayPal (including Pay in 4 interest-free installments), Apple Pay, Google Pay, Shop Pay, Afterpay, and Klarna. All transactions are processed through secure, encrypted payment gateways to protect your financial information.',
      },
      {
        q: 'Can I pay in installments?',
        a: 'Yes! We support buy-now-pay-later options through PayPal Pay in 4, Afterpay, and Klarna. These options allow you to split your purchase into 4 interest-free installments. Select your preferred option at checkout to see if you qualify.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order has been processed and shipped, you will receive an email confirmation with your tracking number and a link to track your package in real time. You can also contact our support team for order status updates.',
      },
      {
        q: 'What is your return policy?',
        a: 'Due to the nature of our research compounds, we are unable to accept returns on opened or used products. If you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery with photos of the issue, and we will resolve it promptly.',
      },
    ],
  },
  {
    section: 'Handling & Storage',
    faqs: [
      {
        q: 'How should I store research peptides?',
        a: 'Lyophilized (freeze-dried) peptides should be stored in a cool, dry place away from direct light. For long-term storage, we recommend keeping them in a freezer at -20°C or below. Once reconstituted, peptides should be stored at 4°C (refrigerator temperature) and used within an appropriate timeframe.',
      },
      {
        q: 'What is Bacteriostatic Water and why might I need it?',
        a: 'Bacteriostatic Water (BAC Water) is sterile water containing 0.9% benzyl alcohol, which prevents bacterial growth. It is commonly used in laboratory settings for reconstituting lyophilized peptides and other compounds. We offer BAC Water as an add-on in our cart to make your research setup complete.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1e1e1e] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className={`text-sm font-semibold transition-colors ${open ? 'text-gold' : 'text-white'}`}>{q}</span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#262626] flex items-center justify-center text-gray-400">
          {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="px-5 pb-5 border-t border-[#1a1a1a]">
              <p className="text-gray-400 text-sm leading-relaxed pt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="relative py-20 bg-[#080808] border-b border-[#1a1a1a] overflow-hidden">
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
            FAQs
          </motion.h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Common questions about our research compounds, shipping, and ordering process.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {FAQ_SECTIONS.map(({ section, faqs }, si) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: si * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center">
                  <FlaskConical className="w-3.5 h-3.5 text-gold" />
                </div>
                <h2 className="font-barlow font-extrabold text-white text-base uppercase tracking-[0.2em]">{section}</h2>
              </div>
              <div className="space-y-3">
                {faqs.map(({ q, a }) => (
                  <FaqItem key={q} q={q} a={a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-[#111111] border border-gold/20 rounded-2xl text-center"
        >
          <h3 className="font-barlow font-extrabold text-white text-xl mb-2 uppercase">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-5">Our expert team is available around the clock to help with any research-related inquiries.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-[#0a0a0a] font-bold text-sm rounded uppercase tracking-wider hover:bg-gold-light transition-colors">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
