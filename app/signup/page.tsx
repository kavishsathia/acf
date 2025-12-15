"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email: email || undefined }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      window.location.href = '/signin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-swiss-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h1 className="font-display text-5xl uppercase mb-2">Sign Up</h1>
          <div className="h-1 w-16 bg-swiss-red"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-white border-2 border-swiss-red p-4">
              <p className="text-swiss-red font-mono text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block font-mono text-xs uppercase tracking-widest mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs uppercase tracking-widest mb-2"
            >
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs uppercase tracking-widest mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors"
              disabled={loading}
            />
            <p className="mt-2 font-mono text-xs text-swiss-black/60">
              Minimum 8 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-mono text-xs uppercase tracking-widest mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-white border-2 border-swiss-black p-4 font-mono focus:outline-none focus:border-swiss-red transition-colors"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-swiss-black text-white font-display text-xl uppercase p-4 hover:bg-swiss-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-mono text-sm text-swiss-black/60">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-swiss-red hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center font-mono text-sm text-swiss-black/60 hover:text-swiss-red transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
