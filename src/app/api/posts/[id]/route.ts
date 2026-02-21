import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { makeSlug } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  title:           z.string().min(1).max(300).optional(),
  excerpt:         z.string().max(600).optional(),
  content:         z.string().min(1).optional(),
  published:       z.boolean().optional(),
  commentsEnabled: z.boolean().optional(),
  featured:        z.boolean().optional(),
  tags:            z.array(z.string()).optional(),
})

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { id } = await params
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { tags, published, ...rest } = parsed.data
  const current = await db.post.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const publishedAt =
    published === true  && !current.published ? new Date()
    : published === false                     ? null
    : undefined

  if (tags !== undefined) {
    await db.postTag.deleteMany({ where: { postId: id } })
    const recs = await Promise.all(tags.map(name => {
      const s = makeSlug(name)
      return db.tag.upsert({ where: { slug: s }, update: {}, create: { name: name.toLowerCase(), slug: s } })
    }))
    await db.postTag.createMany({ data: recs.map(t => ({ postId: id, tagId: t.id })) })
  }

  const post = await db.post.update({
    where: { id },
    data: {
      ...rest,
      ...(published  !== undefined && { published }),
      ...(publishedAt !== undefined && { publishedAt }),
    },
  })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { id } = await params
  await db.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
