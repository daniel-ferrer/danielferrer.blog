import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { PostEditor } from '@/components/admin/PostEditor'

interface Props { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const session = await getSession()
  if (!session.isAdmin) redirect('/admin/login')

  const { id } = await params
  const post = await db.post.findUnique({
    where:   { id },
    include: { tags: { include: { tag: true } } },
  })
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="bg-ink text-white px-6 py-4 flex items-center gap-4">
        <a href="/admin/dashboard" className="font-mono text-xs text-white/50 hover:text-white transition-colors">
          ← Dashboard
        </a>
        <span className="text-white/20">|</span>
        <span className="font-serif text-base font-medium">Edit Post</span>
        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
           className="ml-auto font-mono text-xs text-white/40 hover:text-white transition-colors">
          View live ↗
        </a>
      </header>
      <PostEditor mode="edit" post={{
        id:              post.id,
        title:           post.title,
        slug:            post.slug,
        excerpt:         post.excerpt,
        content:         post.content,
        published:       post.published,
        commentsEnabled: post.commentsEnabled,
        featured:        post.featured,
        tags:            post.tags.map(pt => pt.tag.name),
      }} />
    </div>
  )
}
