'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function AuthDrawer() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      setEmail('');
      setPassword('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <div className="text-sm">
        <div className="text-gray-400 mb-2 text-xs">
          Signed in as <span className="text-white">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[#D4AF37] text-xs hover:underline transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2.5 bg-[#111111] border border-[#262626] rounded-lg text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
          required
        />
        <input
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2.5 bg-[#111111] border border-[#262626] rounded-lg text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
          required
          minLength={6}
        />
        {error && <p className="text-red-400 text-[11px]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F5D76E] text-[#0a0a0a] text-xs font-bold rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? '...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>
      <button
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
        className="text-[11px] text-gray-600 hover:text-[#D4AF37] mt-2.5 w-full text-center transition-colors"
      >
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}
