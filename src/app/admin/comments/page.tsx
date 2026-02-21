import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { CommentActions } from '@/components/admin/CommentActions'

type CommentWithPost = {
  id:        string
  author:    string
  email:     string
  body:      string
  approved:  boolean
  createdAt: Date
  post: { title: string; slug: string }
}

export default async function CommentsPage() {
  const session = await getSession()
  if (!session.isAdmin) redirect('/admin/login')

  const comments = await db.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { title: true, slug: true } } },
  }) as CommentWithPost[]

  const pending  = comments.filter(c => !c.approved)
  const approved = comments.filter(c =>  c.approved)

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="bg-ink text-white px-6 py-4 flex items-center gap-4">
        <Link href="/admin/dashboard" className="font-mono text-xs text-white/50 hover:text-white transition-colors">
          ← Dashboard
        </Link>
        <span className="text-white/20">|</span>
        <span className="font-serif text-base font-medium">Comments</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {pending.length > 0 && (
          <section>
            <h2 className="font-serif text-lg font-semibold text-ink mb-4">
              Pending approval{' '}
              <span className="font-mono text-sm text-accent">({pending.length})</span>
            </h2>
            <div className="space-y-3">
              {pending.map(c => <CommentCard key={c.id} comment={c} />)}
            </div>
          </section>
        )}

        {approved.length > 0 && (
          <section>
            <h2 className="font-serif text-lg font-semibold text-ink mb-4">Approved</h2>
            <div className="space-y-3">
              {approved.map(c => <CommentCard key={c.id} comment={c} />)}
            </div>
          </section>
        )}

        {comments.length === 0 && (
          <p className="text-center py-16 font-mono text-sm text-ink-4">No comments yet.</p>
        )}
      </div>
    </div>
  )
}

function CommentCard({ comment }: { comment: CommentWithPost }) {
  return (
    <div className="bg-white border border-paper-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-sans text-sm font-medium text-ink">{comment.author}</span>
            <span className="font-mono text-xs text-ink-4">{comment.email}</span>
            <span className="font-mono text-xs text-ink-5">·</span>
            <span className="font-mono text-xs text-ink-4">
              {formatDate(comment.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <Link href={`/blog/${comment.post.slug}`} target="_blank"
            className="font-mono text-xs text-accent hover:underline mb-2 block">
            {comment.post.title} ↗
          </Link>
          <p className="font-sans text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
            {comment.body}
          </p>
        </div>
        <CommentActions commentId={comment.id} approved={comment.approved} />
      </div>
    </div>
  )
}
