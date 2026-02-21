'use client'
import { useRouter } from 'next/navigation'

export function CommentActions({ commentId, approved }: { commentId: string; approved: boolean }) {
  const router = useRouter()
  async function update(action: 'approve' | 'unapprove' | 'delete') {
    if (action === 'delete') {
      if (!confirm('Delete this comment?')) return
      await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
    } else {
      await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: action === 'approve' }),
      })
    }
    router.refresh()
  }
  return (
    <div className="flex flex-col gap-1.5 flex-shrink-0">
      {!approved ? (
        <button onClick={() => update('approve')} className="font-mono text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded hover:bg-green-100 transition-colors">
          Approve
        </button>
      ) : (
        <button onClick={() => update('unapprove')} className="font-mono text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded hover:bg-amber-100 transition-colors">
          Unapprove
        </button>
      )}
      <button onClick={() => update('delete')} className="font-mono text-xs text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded hover:bg-red-100 transition-colors">
        Delete
      </button>
    </div>
  )
}
