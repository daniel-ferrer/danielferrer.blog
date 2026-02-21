import Link from 'next/link'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-paper-200 bg-paper-50/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-baseline gap-2.5 group">
            <span className="font-serif text-lg font-semibold text-ink tracking-tight group-hover:text-accent transition-colors">Daniel Ferrer</span>
            <span className="font-mono text-xs text-ink-4 tracking-widest uppercase hidden sm:block">blog</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/blog" className="text-sm font-sans text-ink-3 hover:text-ink px-3 py-1.5 rounded-md hover:bg-paper-100 transition-colors">Writing</Link>
            <Link href="/blog/tags" className="text-sm font-sans text-ink-3 hover:text-ink px-3 py-1.5 rounded-md hover:bg-paper-100 transition-colors">Topics</Link>
            <a href="https://danielferrer.dev" target="_blank" rel="noopener noreferrer"
               className="ml-2 text-xs font-mono text-ink-3 hover:text-accent px-3 py-1.5 border border-paper-200 rounded-md hover:border-accent/30 transition-colors">
              ← Portfolio
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-paper-200 mt-24">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-serif text-sm text-ink-3">Daniel Ferrer-Sosa</p>
            <p className="font-mono text-xs text-ink-4 mt-0.5">Software Engineer · SRE Product</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: 'GitHub',    href: 'https://github.com/daniel-ferrer' },
              { label: 'LinkedIn',  href: 'https://linkedin.com/in/daniel-ferrer-sosa' },
              { label: 'Portfolio', href: 'https://danielferrer.dev' },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                 className="font-mono text-xs text-ink-4 hover:text-accent transition-colors">{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
