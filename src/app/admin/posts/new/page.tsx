import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { PostEditor } from '@/components/admin/PostEditor'

export default async function NewPostPage() {
  const session = await getSession()
  if (!session.isAdmin) redirect('/admin/login')
  return (
    <div className="min-h-screen bg-paper-100">
      <header className="bg-ink text-white px-6 py-4 flex items-center gap-4">
        <a href="/admin/dashboard" className="font-mono text-xs text-white/50 hover:text-white transition-colors">← Dashboard</a>
        <span className="text-white/20">|</span>
        <span className="font-serif text-base font-medium">New Post</span>
      </header>
      <PostEditor mode="create" />
    </div>
  )
}
