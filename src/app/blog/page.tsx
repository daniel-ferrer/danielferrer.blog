import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate, getReadingTime } from '@/lib/utils'
import { TagChip } from '@/components/blog/TagChip'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Technical deep dives, lessons learned, and perspectives on SRE and software engineering.',
}

export const revalidate = 60

type PostWithTags = Awaited<ReturnType<typeof getPosts>>[0]

async function getPosts() {
  return db.post.findMany({
    where:   { published: true },
    orderBy: { publishedAt: 'desc' },
    include: { tags: { include: { tag: true } } },
  })
}

export default async function BlogIndex() {
  const posts    = await getPosts()
  const featured = posts.find(p => p.featured) ?? posts[0]
  const rest     = posts.filter(p => p.id !== featured?.id)

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      <div className="mb-14 fade-up">
        <h1 className="font-serif text-4xl font-semibold text-ink tracking-tight mb-3">Writing</h1>
        <p className="font-sans text-ink-3 text-base leading-relaxed max-w-lg">
          Technical deep dives, lessons learned, evolving perspectives, and whatever else earns the time it takes to write it down.
        </p>
      </div>

      {featured && (
        <div className="mb-16 fade-up fade-up-1">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-4">Featured</p>
          {/* Overlay card pattern — avoids nested <a> tags */}
          <article className="relative border border-paper-200 rounded-xl p-8 bg-white hover:border-accent/30 hover:shadow-sm transition-all duration-200 group">
            <Link
              href={`/blog/${featured.slug}`}
              className="absolute inset-0 rounded-xl"
              aria-label={`Read: ${featured.title}`}
            />
            <div className="relative z-10 flex flex-wrap gap-2 mb-4">
              {featured.tags.map(({ tag }) => (
                <TagChip key={tag.id} name={tag.name} slug={tag.slug} />
              ))}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-tight mb-3 group-hover:text-accent transition-colors">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="font-sans text-ink-3 text-base leading-relaxed mb-5 line-clamp-3">
                {featured.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3 text-ink-4 font-mono text-xs">
              <time dateTime={featured.publishedAt?.toISOString()}>
                {formatDate(featured.publishedAt ?? featured.createdAt)}
              </time>
              <span>·</span>
              <span>{getReadingTime(featured.content)}</span>
            </div>
          </article>
        </div>
      )}

      {rest.length > 0 && (
        <div className="fade-up fade-up-2 divide-y divide-paper-200">
          {rest.map(post => <PostRow key={post.id} post={post} />)}
        </div>
      )}

      {posts.length === 0 && (
        <p className="text-center py-24 text-ink-4 font-mono text-sm">No posts yet. Check back soon.</p>
      )}

    </div>
  )
}

function PostRow({ post }: { post: PostWithTags }) {
  return (
    <div className="relative group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 py-5 hover:bg-paper-50 -mx-3 px-3 rounded-lg transition-colors">
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`Read: ${post.title}`}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-lg font-medium text-ink group-hover:text-accent transition-colors leading-snug mb-1.5 truncate">
          {post.title}
        </h3>
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          {post.tags.map(({ tag }) => (
            <TagChip key={tag.id} name={tag.name} slug={tag.slug} small />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-ink-4 font-mono text-xs flex-shrink-0 relative z-10">
        <time dateTime={post.publishedAt?.toISOString()}>
          {formatDate(post.publishedAt ?? post.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
        <span className="hidden sm:block">· {getReadingTime(post.content)}</span>
      </div>
    </div>
  )
}
