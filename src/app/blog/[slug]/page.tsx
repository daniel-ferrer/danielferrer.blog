import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate, getReadingTime } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer'
import { CommentSection } from '@/components/blog/CommentSection'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.post.findUnique({ where: { slug } })
  if (!post?.published) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title:         post.title,
      description:   post.excerpt || undefined,
      type:          'article',
      publishedTime: post.publishedAt?.toISOString(),
    },
  }
}

export const revalidate = 60

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  const post = await db.post.findUnique({
    where:   { slug },
    include: {
      tags:     { include: { tag: true } },
      comments: { where: { approved: true }, orderBy: { createdAt: 'asc' } },
    },
  })

  if (!post?.published) notFound()

  // Serialize Date objects before passing to client components
  const serializedComments = post.comments.map(c => ({
    id:        c.id,
    author:    c.author,
    body:      c.body,
    approved:  c.approved,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* Back */}
      <div className="mb-10 fade-up">
        <Link href="/blog" className="font-mono text-xs text-ink-4 hover:text-accent transition-colors inline-flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          All posts
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12 fade-up fade-up-1">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/blog/tags/${tag.slug}`}
                className="font-mono text-xs text-accent bg-accent/5 border border-accent/20 px-2.5 py-1 rounded hover:bg-accent/10 transition-colors">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-ink tracking-tight leading-tight mb-5">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-sans text-ink-3 text-lg leading-relaxed mb-6 max-w-2xl">{post.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-ink-4 pb-8 border-b border-paper-200">
          <span>Daniel Ferrer-Sosa</span>
          <span>·</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt ?? post.createdAt)}
          </time>
          <span>·</span>
          <span>{getReadingTime(post.content)}</span>
        </div>
      </header>

      {/* Body */}
      <article className={`fade-up fade-up-2 ${post.featured ? 'drop-cap' : ''}`}>
        <MarkdownRenderer content={post.content} />
      </article>

      {/* Tags footer */}
      {post.tags.length > 0 && (
        <div className="mt-14 pt-8 border-t border-paper-200">
          <p className="font-mono text-xs text-ink-4 uppercase tracking-widest mb-3">Tagged</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/blog/tags/${tag.slug}`}
                className="font-mono text-sm text-ink-3 hover:text-accent border border-paper-200 hover:border-accent/30 rounded px-3 py-1.5 transition-colors">
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="mt-16">
        <CommentSection
          postId={post.id}
          comments={serializedComments}
          commentsEnabled={post.commentsEnabled}
        />
      </div>

    </div>
  )
}
