import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  postId: z.string().cuid(),
  author: z.string().min(1).max(80),
  email:  z.string().email().max(200),
  body:   z.string().min(1).max(5000),
})

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { postId, author, email, body } = parsed.data
  const post = await db.post.findUnique({ where: { id: postId, published: true }, select: { commentsEnabled: true } })

  if (!post)               return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  if (!post.commentsEnabled) return NextResponse.json({ error: 'Comments disabled' }, { status: 403 })

  await db.comment.create({ data: { postId, author, email, body, approved: false } })
  return NextResponse.json({ ok: true, message: 'Comment submitted — pending approval.' }, { status: 201 })
}
