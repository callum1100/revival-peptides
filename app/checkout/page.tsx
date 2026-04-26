'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Check, CircleAlert as AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { AddressAutocomplete } from '@/components/checkout/AddressAutocomplete';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
];

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

interface FormData {
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

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'US',
};

const inputClass =
  'w-full px-4 py-3 bg-[#111111] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors';

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  required,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
}: {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full px-4 py-3 bg-[#111111] border border-[#262626] rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer"
        >
          {children}
        </select>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none rotate-90" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= 250 ? 0 : 9.99;
  const total = subtotal + shipping;

  function handleField(name: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleAddressSelect = useCallback(
    (data: { address1: string; city: string; state: string; postcode: string; country: string }) => {
      setFormData((prev) => ({
        ...prev,
        address1: data.address1,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country || prev.country,
      }));
    },
    []
  );

  const handleAddressChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, address1: value }));
  }, []);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.address1 ||
      !formData.city ||
      !formData.state ||
      !formData.postcode
    ) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    sessionStorage.setItem('checkout_data', JSON.stringify(formData));
    router.push('/checkout/payment');
  }

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
            <span className="text-gray-400">Cart</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#D4AF37] font-semibold">Information</span>
            <ChevronRight className="w-3 h-3" />
            <span>Payment</span>
          </nav>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3.5 h-3.5 text-green-500" />
            <span>Secure checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* LEFT — Form */}
          <motion.form
            onSubmit={handleContinue}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-white font-bold text-base mb-5 pb-3 border-b border-[#1a1a1a]">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" name="firstName" placeholder="John" autoComplete="given-name" value={formData.firstName} onChange={handleField} required />
                <Field label="Last Name" name="lastName" placeholder="Doe" autoComplete="family-name" value={formData.lastName} onChange={handleField} required />
                <Field label="Email" name="email" type="email" placeholder="john@example.com" autoComplete="email" value={formData.email} onChange={handleField} required />
                <Field label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" value={formData.phone} onChange={handleField} required />
              </div>
            </div>

            {/* Shipping */}
            <div className="mb-8">
              <h2 className="text-white font-bold text-base mb-5 pb-3 border-b border-[#1a1a1a]">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Address Line 1
                  </label>
                  <AddressAutocomplete
                    value={formData.address1}
                    onChange={handleAddressChange}
                    onAddressSelect={handleAddressSelect}
                    placeholder="123 Research Blvd"
                    className={inputClass}
                  />
                </div>
                <Field label="Address Line 2" name="address2" placeholder="Suite, Apt, Unit (optional)" autoComplete="address-line2" value={formData.address2} onChange={handleField} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="City" name="city" placeholder="New York" autoComplete="address-level2" value={formData.city} onChange={handleField} required />
                  <SelectField label="State" name="state" value={formData.state} onChange={handleField}>
                    <option value="">Select state</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </SelectField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="ZIP / Postal Code" name="postcode" placeholder="10001" autoComplete="postal-code" value={formData.postcode} onChange={handleField} required />
                  <SelectField label="Country" name="country" value={formData.country} onChange={handleField}>
                    {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </SelectField>
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

            {/* CTA */}
            <button
              type="submit"
              disabled={items.length === 0}
              className="w-full flex items-center justify-center gap-3 font-black text-[#0a0a0a] bg-[#D4AF37] hover:bg-[#F5D76E] transition-all duration-200 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)] rounded-lg uppercase tracking-wider text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37] disabled:hover:shadow-none"
              style={{ minHeight: '56px' }}
            >
              <Lock className="w-4 h-4" />
              Continue to Payment — ${total.toFixed(2)}
            </button>
            <p className="text-center text-gray-600 text-xs mt-3 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-green-500" />
              Secure 256-bit SSL Checkout
            </p>
          </motion.form>

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
