'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) onClose();
    });
    return () => { listener.subscription.unsubscribe(); };
  }, [onClose]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-yellow-500 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-serif text-yellow-500 mb-6 text-center">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </h2>

        {user ? (
          <div className="text-center">
            <p className="text-zinc-400 mb-4">
              Signed in as <span className="text-white">{user.email}</span>
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-yellow-500 hover:underline text-sm"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-sm text-white placeholder:text-zinc-600 focus:border-yellow-500 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-sm text-white placeholder:text-zinc-600 focus:border-yellow-500 outline-none transition-colors"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded transition-colors disabled:opacity-50 uppercase tracking-wider text-sm"
            >
              {loading ? '...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-xs text-zinc-500 hover:text-yellow-500 w-full text-center transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
