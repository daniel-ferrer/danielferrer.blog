# danielferrer.blog

Personal blog — technical deep dives, lessons learned, evolving perspectives.

Built with Next.js 16, SQLite (Prisma), react-markdown, and Tailwind CSS.

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
npm run lint         # ESLint (Next.js + TypeScript rules)
npm run db:push      # Sync schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Create admin account + welcome post
```

## Local checks

```bash
npm ci
npx prisma generate
npm run lint
npx tsc --noEmit
```

The production build reads the database while generating pages. To check it
without using your configured database, run these steps in a shell:

```bash
(
  set -e
  build_db_dir=$(mktemp -d)
  trap 'rm -rf -- "$build_db_dir"' EXIT
  export DATABASE_URL="file:$build_db_dir/build.db"
  npx prisma db push --skip-generate
  npm run build
)
```

This creates an empty SQLite database in a temporary directory and removes it
after the build. Run database setup and the build as separate commands;
`--skip-generate` is an option for `prisma db push`. There is no test script
configured in this project.

## Dependency audit

After the October 2026 dependency refresh, `npm audit` reports 10 findings
(7 high, 3 moderate, 0 critical). These remain in the Tailwind 3 and Next.js
ESLint dependency trees:

- [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
  has no patched release. It propagates through chokidar, micromatch and
  fast-glob into Tailwind and the Next.js ESLint preset.
- [postcss-selector-parser CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)
  affects the parser versions used by Tailwind, postcss-nested and typography.

Compatible dependency updates have been applied. The remaining npm proposals
include migrating to Tailwind 4 and downgrading typography or the Next.js ESLint
preset; these are deliberately deferred rather than applying
`npm audit fix --force`. Recheck with `npm audit` as upstream fixes become available.
