import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { AdminPostActions } from '@/components/admin/AdminPostActions'
import { AdminLogout } from '@/components/admin/AdminLogout'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session.isAdmin) redirect('/admin/login')

  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: { include: { tag: true } }, _count: { select: { comments: true } } },
  })
  const pending = await db.comment.count({ where: { approved: false } })

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="bg-ink text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/blog" className="font-mono text-xs text-white/50 hover:text-white transition-colors">← View blog</Link>
          <span className="text-white/20">|</span>
          <span className="font-serif text-base font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {pending > 0 && (
            <Link href="/admin/comments" className="font-mono text-xs bg-accent text-white px-3 py-1.5 rounded-full hover:bg-accent/80 transition-colors">
              {pending} pending {pending === 1 ? 'comment' : 'comments'}
            </Link>
          )}
          <AdminLogout />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total',     value: posts.length },
            { label: 'Published', value: posts.filter(p => p.published).length },
            { label: 'Pending',   value: pending },
          ].map(s => (
            <div key={s.label} className="bg-white border border-paper-200 rounded-xl px-5 py-4">
              <p className="font-mono text-xs text-ink-4 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-serif text-3xl font-semibold text-ink">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold text-ink">Posts</h2>
          <Link href="/admin/posts/new" className="font-sans text-sm font-medium bg-ink text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors">
            + New post
          </Link>
        </div>

        <div className="bg-white border border-paper-200 rounded-xl overflow-hidden">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-ink-4 font-mono text-sm">
              No posts yet. <Link href="/admin/posts/new" className="text-accent hover:underline">Write your first one.</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-paper-200 bg-paper-50">
                <tr>
                  {['Title', 'Tags', 'Status', 'Comments', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left font-mono text-xs text-ink-4 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-100">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-paper-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/posts/${post.id}`} className="font-serif text-sm font-medium text-ink hover:text-accent transition-colors line-clamp-1 max-w-[200px] block">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map(({ tag }) => (
                          <span key={tag.id} className="font-mono text-[0.6rem] text-ink-4 bg-paper-100 px-1.5 py-0.5 rounded">#{tag.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-xs px-2 py-1 rounded-full border ${post.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-paper-100 text-ink-4 border-paper-200'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-3">
                      {post._count.comments} · <span className={post.commentsEnabled ? 'text-green-600' : 'text-ink-5 line-through'}>{post.commentsEnabled ? 'on' : 'off'}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-4 whitespace-nowrap">
                      {formatDate(post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <AdminPostActions postId={post.id} published={post.published} commentsEnabled={post.commentsEnabled} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
