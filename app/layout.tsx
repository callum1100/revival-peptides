import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cinzel, Barlow_Condensed } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ExitIntentModal from '@/components/modals/ExitIntentModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400', '600', '700', '900'] });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], variable: '--font-barlow', weight: ['700', '800'] });

export const metadata: Metadata = {
  title: 'Revival Peptides — Premium Research Compounds',
  description: 'Lab-tested, science-backed research peptides. 99+% purity guaranteed. USA manufactured. Trusted by researchers worldwide.',
  openGraph: {
    title: 'Revival Peptides — Premium Research Compounds',
    description: 'Lab-tested, science-backed research peptides. 99+% purity guaranteed.',
    images: [{ url: '/hero_final_v2.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${barlowCondensed.variable}`}>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <ExitIntentModal />
        </CartProvider>
      </body>
    </html>
  );
}
