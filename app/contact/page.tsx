'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, MapPin, Send, CircleCheck as CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

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
            Contact
          </motion.h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Our expert team is ready to assist you with any research inquiries or order questions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-5"
          >
            <div>
              <h2 className="font-barlow font-extrabold text-white text-xl mb-1 uppercase">Get in Touch</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Whether you have questions about our compounds, need help with an order, or want to discuss research applications, our team is here to help.
              </p>
            </div>

            {[
              {
                Icon: Mail,
                title: 'Email Support',
                value: 'support@revivalpeptides.com',
                desc: 'Response within 2-4 hours',
              },
              {
                Icon: Clock,
                title: 'Support Hours',
                value: '24/7 Available',
                desc: 'Around-the-clock expert assistance',
              },
              {
                Icon: MapPin,
                title: 'Based In',
                value: 'United States',
                desc: 'Domestic & international shipping',
              },
            ].map(({ Icon, title, value, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 bg-[#111111] border border-[#1e1e1e] rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{title}</p>
                  <p className="text-white font-semibold text-sm">{value}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}

            <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
              <p className="text-gold font-semibold text-sm mb-1">Research Inquiries</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                For technical questions about specific compounds, COA documentation, or bulk research orders, please include your research institution or affiliation in your message for priority handling.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-barlow font-extrabold text-white text-2xl mb-2 uppercase">Message Sent!</h3>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Our support team will respond to your inquiry within 2-4 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Dr. Jane Smith"
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#262626] rounded-lg text-white text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select a subject...</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="order-support">Order Support</option>
                      <option value="coa-request">COA / Lab Documentation</option>
                      <option value="bulk-order">Bulk / Institutional Order</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      placeholder="Please describe your inquiry in detail..."
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#262626] rounded-lg text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/15 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" required id="disclaimer" className="mt-1 accent-[#D4AF37]" />
                    <label htmlFor="disclaimer" className="text-gray-500 text-xs leading-relaxed cursor-pointer">
                      I confirm that I am a researcher or licensed professional and understand that all products are for research purposes only and not for human or animal consumption.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-[#0a0a0a] font-bold text-sm rounded-lg uppercase tracking-wider hover:bg-gold-light transition-all duration-200 hover:shadow-[0_4px_20px_rgba(212,175,55,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
