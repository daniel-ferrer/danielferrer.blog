'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Props { postId: string; published: boolean; commentsEnabled: boolean }

export function AdminPostActions({ postId, published, commentsEnabled }: Props) {
  const router = useRouter()

  async function toggle(field: string, value: boolean) {
    await fetch(`/api/posts/${postId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
    router.refresh()
  }

  async function deletePost() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/posts/${postId}`}
        className="font-mono text-xs text-ink-3 hover:text-accent transition-colors px-2 py-1 rounded hover:bg-paper-100">
        Edit
      </Link>
      <button onClick={() => toggle('published', !published)}
        className={`font-mono text-xs px-2 py-1 rounded transition-colors ${published ? 'text-amber-700 hover:bg-amber-50' : 'text-green-700 hover:bg-green-50'}`}>
        {published ? 'Unpublish' : 'Publish'}
      </button>
      <button onClick={() => toggle('commentsEnabled', !commentsEnabled)}
        className="font-mono text-xs text-ink-4 hover:text-ink-2 px-2 py-1 rounded hover:bg-paper-100 transition-colors">
        {commentsEnabled ? 'Disable comments' : 'Enable comments'}
      </button>
      <button onClick={deletePost}
        className="font-mono text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
        Delete
      </button>
    </div>
  )
}
