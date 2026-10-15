# danielferrer.blog

Personal blog — technical deep dives, lessons learned, evolving perspectives.

Built with Next.js 16, SQLite (Prisma), react-markdown, and Tailwind CSS 4.

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

After the October 2026 move to Tailwind CSS 4, `npm audit` reports 7 findings
(5 high, 2 moderate, 0 critical), down from 10 (7 high, 3 moderate). Tailwind 4
no longer depends on chokidar, fast-glob, postcss-nested or postcss-selector-parser,
so those paths are gone. npm counts one finding per package in each remaining
chain:

- [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
  has no patched release (5 high: braces, micromatch, fast-glob and the two
  packages below). It reaches the Next.js ESLint preset through
  `eslint-config-next` → `@next/eslint-plugin-next` → fast-glob → micromatch.
  It is a lint-time dependency only and is not part of the built site.
- [postcss-selector-parser CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)
  remains (2 moderate: the parser and typography) because
  `@tailwindcss/typography` 0.5.20, the latest release, pins
  postcss-selector-parser 6.0.10. It runs at build time only.

npm's only proposed fixes are downgrading the Next.js ESLint preset to 14.x
or typography to 0.5.4. These are deliberately deferred rather than applying
`npm audit fix --force`. Recheck with `npm audit` as upstream fixes become available.
