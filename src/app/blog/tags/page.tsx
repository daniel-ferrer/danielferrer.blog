import Link from 'next/link'
import { db } from '@/lib/db'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Topics' }

export default async function TagsPage() {
  const tags = await db.tag.findMany({
    include: { _count: { select: { posts: { where: { post: { published: true } } } } } },
    orderBy: { name: 'asc' },
  })
  const active = tags.filter(t => t._count.posts > 0)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12 fade-up">
        <h1 className="font-serif text-4xl font-semibold text-ink tracking-tight mb-3">Topics</h1>
        <p className="font-sans text-ink-3 text-base">Browse posts by topic.</p>
      </div>
      <div className="flex flex-wrap gap-3 fade-up fade-up-1">
        {active.map(tag => (
          <Link key={tag.id} href={`/blog/tags/${tag.slug}`}
            className="group flex items-baseline gap-2 font-mono text-sm text-ink-2 border border-paper-200 rounded-lg px-4 py-2.5 bg-white hover:border-accent/30 hover:text-accent transition-all">
            <span>#{tag.name}</span>
            <span className="text-xs text-ink-4 group-hover:text-accent/60">{tag._count.posts}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
