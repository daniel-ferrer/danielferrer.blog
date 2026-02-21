import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { formatDate, getReadingTime } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await db.tag.findUnique({ where: { slug } })
  return tag ? { title: `#${tag.name}` } : {}
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params

  const tag = await db.tag.findUnique({
    where:   { slug },
    include: {
      posts: {
        where:   { post: { published: true } },
        include: { post: true },
        orderBy: { post: { publishedAt: 'desc' } },
      },
    },
  })

  if (!tag) notFound()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-3 fade-up">
        <Link href="/blog/tags" className="font-mono text-xs text-ink-4 hover:text-accent transition-colors">
          ← All topics
        </Link>
      </div>
      <div className="mb-12 fade-up fade-up-1">
        <h1 className="font-serif text-4xl font-semibold text-ink tracking-tight mb-2">#{tag.name}</h1>
        <p className="font-mono text-xs text-ink-4">
          {tag.posts.length} {tag.posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>
      <div className="divide-y divide-paper-200 fade-up fade-up-2">
        {tag.posts.map(({ post }) => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 py-5 hover:bg-paper-50 -mx-3 px-3 rounded-lg transition-colors">
            <h3 className="font-serif text-lg font-medium text-ink group-hover:text-accent transition-colors leading-snug">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 text-ink-4 font-mono text-xs flex-shrink-0">
              <time>{formatDate(post.publishedAt ?? post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</time>
              <span className="hidden sm:block">· {getReadingTime(post.content)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
