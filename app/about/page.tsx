'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle2, FlaskConical, Shield, Truck, Headphones, Award, Users, Beaker } from 'lucide-react';
import Link from 'next/link';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { Icon: Shield, title: 'Lab-Verified Quality', description: 'Third-party tested for purity' },
  { Icon: Headphones, title: 'Expert Support', description: 'Knowledgeable team available 24/7' },
  { Icon: Truck, title: 'Secure Packaging', description: 'Temperature-controlled delivery' },
  { Icon: FlaskConical, title: 'Fast Shipping', description: 'Expedited delivery options' },
];

const STATS = [
  { Icon: Users, value: '10,000+', label: 'Satisfied Researchers' },
  { Icon: Beaker, value: '18+', label: 'Research Compounds' },
  { Icon: Award, value: '99.9%', label: 'Average Purity' },
  { Icon: Shield, value: '100%', label: 'Third-Party Verified' },
];

const TIMELINE = [
  { year: '2018', title: 'Founded', description: 'Revival Peptides was founded with a mission to supply the highest-quality research peptides to scientists and researchers worldwide.' },
  { year: '2020', title: 'Lab Partnerships', description: 'Established partnerships with multiple ISO-certified, third-party analytical laboratories to ensure rigorous batch testing on every product.' },
  { year: '2022', title: 'Expanded Catalog', description: 'Expanded our research catalog to include the latest compounds being studied in metabolic, nootropic, and regenerative research.' },
  { year: '2025', title: 'Global Trust', description: 'Now serving over 10,000 researchers in more than 40 countries, with an unwavering commitment to quality and scientific integrity.' },
];

export default function AboutPage() {
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
            className="font-barlow font-extrabold text-4xl md:text-5xl text-gold tracking-widest uppercase"
          >
            About
          </motion.h1>
        </div>
      </div>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1400')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full text-gold text-xs font-semibold tracking-widest uppercase mb-6 bg-gold/5">
                  About Revival Peptides
                </div>
                <h2 className="font-barlow font-extrabold text-4xl md:text-5xl leading-tight tracking-tight mb-5 uppercase">
                  <span className="text-white">CUTTING-EDGE</span><br />
                  <span className="text-gold">RESEARCH COMPOUNDS</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Revival Peptides delivers cutting-edge research compounds for professionals who demand excellence. Our commitment to purity, precision, and scientific integrity sets us apart in the industry.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Every product undergoes rigorous third-party testing to ensure the highest standards of quality. We partner with certified laboratories to verify purity, potency, and consistency—because your research deserves nothing less than perfection.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEATURES.map(({ Icon, title, description }) => (
                    <div key={title} className="flex items-start gap-3 p-4 bg-[#111111] border border-[#1e1e1e] rounded-xl hover:border-[rgba(212,175,55,0.2)] transition-colors">
                      <Icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-semibold text-sm">{title}</p>
                        <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gold/5 rounded-2xl blur-xl" />
                <div className="relative rounded-2xl overflow-hidden border border-[#262626] shadow-2xl">
                  <img
                    src="/about_lab_3.png"
                    alt="Revival Peptides researcher"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-5 right-5 bg-[#0a0a0a]/90 border border-gold/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="text-gold text-2xl font-black">10,000+</div>
                    <div className="text-white text-sm font-semibold">Satisfied Researchers</div>
                    <div className="text-gray-500 text-xs">Worldwide</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#080808] border-y border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ Icon, value, label }, i) => (
              <FadeIn key={label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="text-3xl font-black text-gold mb-1">{value}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="font-barlow font-extrabold text-3xl md:text-4xl text-white tracking-tight mb-3 uppercase">
                OUR <span className="text-gold">JOURNEY</span>
              </h2>
              <p className="text-gray-500 text-sm">Building trust through science since 2018</p>
            </div>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-gold/20 to-transparent" />
            <div className="space-y-10">
              {TIMELINE.map(({ year, title, description }, i) => (
                <FadeIn key={year} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center text-gold font-black text-xs">
                        {year.slice(2)}
                      </div>
                    </div>
                    <div className="pb-8">
                      <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-1">{year}</div>
                      <h3 className="font-barlow font-extrabold text-white text-xl mb-2 uppercase">{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#080808] border-t border-b border-[#D4AF37]/20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(ellipse at 15% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)` }}
        />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <FadeIn>
            <h2 className="font-barlow font-extrabold text-3xl md:text-4xl leading-tight uppercase" style={{ color: '#F5D76E' }}>
              Ready to advance your research?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link href="/shop" className="flex-shrink-0 px-8 py-4 bg-[#D4AF37] text-[#0a0a0a] font-bold text-sm rounded uppercase tracking-wider hover:bg-[#F5D76E] transition-all duration-200 hover:shadow-[0_6px_25px_rgba(212,175,55,0.35)]">
              Browse All Products
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
