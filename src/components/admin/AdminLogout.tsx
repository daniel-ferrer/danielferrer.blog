'use client'
import { useRouter } from 'next/navigation'

export function AdminLogout() {
  const router = useRouter()
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  return (
    <button onClick={logout} className="font-mono text-xs text-white/50 hover:text-white transition-colors">
      Sign out
    </button>
  )
}
