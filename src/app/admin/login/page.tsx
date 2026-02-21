'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) { router.push('/admin/dashboard') }
      else { setError((await res.json()).error ?? 'Login failed') }
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs text-ink-4 uppercase tracking-widest mb-2">Admin</p>
          <h1 className="font-serif text-3xl font-semibold text-ink tracking-tight">Sign in</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-paper-200 rounded-xl p-8 space-y-5">
          {error && <div className="text-sm font-mono text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}
          {[
            { label: 'Email',    type: 'email',    value: email,    set: setEmail,    auto: 'email' },
            { label: 'Password', type: 'password', value: password, set: setPassword, auto: 'current-password' },
          ].map(f => (
            <div key={f.label} className="space-y-1.5">
              <label className="font-mono text-xs text-ink-3 uppercase tracking-wider">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)}
                required autoComplete={f.auto}
                className="w-full font-sans text-sm text-ink border border-paper-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-paper-50 transition" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-ink text-white font-sans text-sm font-medium py-2.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
