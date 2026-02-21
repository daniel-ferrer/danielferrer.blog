import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/session'

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { id } = await params
  const { approved } = await req.json()
  const comment = await db.comment.update({ where: { id }, data: { approved: Boolean(approved) } })
  return NextResponse.json(comment)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { id } = await params
  await db.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
