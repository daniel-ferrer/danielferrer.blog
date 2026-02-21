import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({ email: z.string().email(), password: z.string().min(1) })

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { email, password } = parsed.data
  const admin = await db.adminUser.findUnique({ where: { email } })
  const hash = admin?.passwordHash ?? '$2a$12$invalidhashfortimingnnnnnnnnnnnnnnnnnnnnn'
  const valid = await bcrypt.compare(password, hash)

  if (!admin || !valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const session = await getSession()
  session.adminId = admin.id
  session.isAdmin = true
  await session.save()
  return NextResponse.json({ ok: true })
}
