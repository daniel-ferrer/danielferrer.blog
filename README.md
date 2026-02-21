# danielferrer.blog

Personal blog — technical deep dives, lessons learned, evolving perspectives.

Built with Next.js 14, SQLite (Prisma), react-markdown, and Tailwind CSS.

---

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
Edit `.env.local` and set a strong `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the output as your `SESSION_SECRET`.

### 3. Create the database
```bash
npm run db:push
```

### 4. Create your admin account
Open `prisma/seed.ts` and set your password, then:
```bash
npm run db:seed
```

### 5. Run locally
```bash
npm run dev
# → http://localhost:3000
```

---

## URLs

| URL | What it is |
|-----|------------|
| `/blog` | Public blog homepage |
| `/blog/[slug]` | Individual post |
| `/blog/tags` | All topics |
| `/blog/tags/[slug]` | Posts by topic |
| `/admin/login` | Admin sign in |
| `/admin/dashboard` | Manage all posts |
| `/admin/posts/new` | Write a new post |
| `/admin/posts/[id]` | Edit a post |
| `/admin/comments` | Moderate comments |

---

## Writing posts

1. Go to `/admin/login`
2. Sign in with your credentials from the seed step
3. Click **+ New post**
4. Write in Markdown — full syntax supported including code blocks, tables, task lists
5. Add comma-separated tags in the sidebar (these appear as #hashtags in the post footer)
6. Toggle **Published** to make it live, or **Save as draft** to come back later
7. **Comments enabled** can be toggled at any time — existing comments are preserved

---

## Deploying

### Vercel (recommended)
```bash
# Push to GitHub, then connect repo in Vercel dashboard
# Add environment variables in Vercel project settings:
#   DATABASE_URL=file:./blog.db  (or use Turso/PlanetScale for prod)
#   SESSION_SECRET=your-secret
#   NEXT_PUBLIC_SITE_URL=https://danielferrer.blog
```

### SQLite in production
For a personal blog, SQLite on a persistent volume works fine. On Vercel, the filesystem is ephemeral — use **Turso** (SQLite on the edge, free tier) or switch `DATABASE_URL` to a Postgres instance. The Prisma schema change is a one-liner.

To switch to Turso:
1. Install `@libsql/client` and `prisma-adapter-libsql`
2. Change `provider = "sqlite"` to `provider = "libsql"` in schema.prisma
3. Set `DATABASE_URL` to your Turso connection string

---

## Useful commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Sync schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Create admin account + welcome post
```
