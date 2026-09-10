'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      router.push('/admin/dashboard');
    } catch {
      setError('Şifre hatalı.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="bg-paper rounded-lg p-8 w-full max-w-sm">
        <h1 className="font-display text-xl font-bold mb-1">Ülmez İnşaat — Yönetim</h1>
        <p className="text-sm text-charcoal/60 mb-6">Devam etmek için şifrenizi girin.</p>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-charcoal/20 rounded px-3 py-2.5 text-sm mb-4"
        />
        {error && <p className="text-goldtext text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brick hover:bg-brickdark text-charcoal font-medium text-sm py-2.5 rounded disabled:opacity-60"
        >
          {loading ? '...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
