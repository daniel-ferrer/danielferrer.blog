'use client'
import Link from 'next/link'

interface Props {
  name:  string
  slug:  string
  small?: boolean
}

export function TagChip({ name, slug, small }: Props) {
  return (
    <Link
      href={`/blog/tags/${slug}`}
      className={`relative z-10 font-mono text-ink-3 bg-paper-100 hover:bg-accent/10 hover:text-accent border border-paper-200 rounded transition-colors ${
        small ? 'text-[0.62rem] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}
    >
      #{name}
    </Link>
  )
}
