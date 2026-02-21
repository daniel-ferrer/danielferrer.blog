import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'
import { makeSlug } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  title:           z.string().min(1).max(300),
  excerpt:         z.string().max(600).default(''),
  content:         z.string().min(1),
  published:       z.boolean().default(false),
  commentsEnabled: z.boolean().default(true),
  featured:        z.boolean().default(false),
  tags:            z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { tags, published, ...rest } = parsed.data
  let slug = makeSlug(rest.title), n = 0
  while (await db.post.findUnique({ where: { slug } })) slug = `${makeSlug(rest.title)}-${++n}`

  const tagRecords = await Promise.all(tags.map(name => {
    const s = makeSlug(name)
    return db.tag.upsert({ where: { slug: s }, update: {}, create: { name: name.toLowerCase(), slug: s } })
  }))

  const post = await db.post.create({
    data: {
      ...rest, slug, published,
      publishedAt: published ? new Date() : null,
      tags: { create: tagRecords.map(t => ({ tagId: t.id })) },
    },
  })
  return NextResponse.json(post, { status: 201 })
}
