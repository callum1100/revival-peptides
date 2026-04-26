'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, Instagram } from 'lucide-react';

const SHOP_LINKS = [
  { label: 'All Products', href: '/shop' },
  { label: 'Peptides', href: '/shop?category=Peptides' },
  { label: 'Serums', href: '/shop?category=Serums' },
  { label: 'New Arrivals', href: '/shop?new=true' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Lab Results', href: '/lab-results' },
];

const SUPPORT_LINKS = [
  { label: 'FAQs', href: '/faqs' },
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a]" style={{ borderTop: '1px solid #D4AF37' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-14">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-5">
              <Image
                src="/image copy.png"
                alt="Revival Peptides"
                width={160}
                height={48}
                style={{ height: '44px', width: 'auto' }}
              />
            </Link>
            <p className="font-inter text-sm leading-[1.75] mb-6" style={{ color: '#a0a0a0' }}>
              Premium research peptides engineered for precision. Lab-tested, science-backed, and trusted by professionals worldwide.
            </p>
            <div className="flex gap-2.5">
              {[{ Icon: Facebook, href: '#' }, { Icon: Youtube, href: '#' }, { Icon: Instagram, href: '#' }].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                  style={{ border: '1px solid #2a2a2a', color: '#a0a0a0' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#a0a0a0'; (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-barlow font-extrabold text-white text-xs tracking-[0.2em] uppercase mb-5">Shop</h4>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-sm transition-colors"
                    style={{ color: '#a0a0a0' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-barlow font-extrabold text-white text-xs tracking-[0.2em] uppercase mb-5">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-sm transition-colors"
                    style={{ color: '#a0a0a0' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-barlow font-extrabold text-white text-xs tracking-[0.2em] uppercase mb-5">Support</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-sm transition-colors"
                    style={{ color: '#a0a0a0' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-inter text-xs" style={{ color: '#4a4a4a' }}>
            &copy; 2025 Revival Peptides. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[['Returns Policy', '/returns'], ['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-inter text-xs transition-colors"
                style={{ color: '#4a4a4a' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#a0a0a0')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#4a4a4a')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
