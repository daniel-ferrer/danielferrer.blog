import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ✏️  SET YOUR PASSWORD BEFORE RUNNING
  const ADMIN_EMAIL    = 'ferrdan2506@gmail.com'
  const ADMIN_PASSWORD = 'change-me-before-running'

  const existing = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } })
  if (existing) {
    console.log('Admin account already exists — skipping.')
    return
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await prisma.adminUser.create({ data: { email: ADMIN_EMAIL, passwordHash: hash } })

  await prisma.post.create({
    data: {
      title: 'Hello, World.',
      slug: 'hello-world',
      excerpt: 'The obligatory first post.',
      published: true,
      publishedAt: new Date(),
      commentsEnabled: true,
      featured: true,
      content: `# Hello, World.

Welcome to **danielferrer.blog**.

This is where I write about technical deep dives, lessons learned, evolving perspectives on reliability engineering, and whatever else earns the time it takes to write it down.

## What to expect

- Long-form technical posts on SRE, observability, and platform engineering
- Honest takes on incidents and what I actually learned from them
- Career reflections — what worked, what didn't, what I'd do differently
- The occasional personal post, because engineers are humans first

## A note on code

Code blocks render beautifully here:

\`\`\`python
def mttr(incidents):
    """Mean time to recovery. Keep this small."""
    if not incidents:
        return 0
    return sum(i.duration_minutes for i in incidents) / len(incidents)
\`\`\`

And inline code like \`commentsEnabled = true\` renders cleanly too.

More soon.

— Daniel`,
      tags: {
        create: [
          { tag: { connectOrCreate: { where: { slug: 'meta' }, create: { name: 'meta', slug: 'meta' } } } },
        ],
      },
    },
  })

  console.log('✓ Admin account created')
  console.log('✓ Welcome post created')
}

main().catch(console.error).finally(() => prisma.$disconnect())
