import type { Config } from 'tailwindcss'

// Loaded from src/styles/globals.css via @config. The colors and fonts live in
// the @theme block there; this file only holds the `prose-blog` typography
// variant, which the typography plugin reads from the JS theme.
//
// Under Tailwind 3, theme('fontFamily.*') returned an array here, which became
// one font-family declaration per entry; the last one won, so posts rendered
// in the generic `serif` and `monospace` fonts rather than Lora and Geist Mono. Those generic values
// are kept as literals so posts look the same as before the upgrade.
const proseSerif = 'serif'
const proseMono = 'monospace'

const config: Config = {
  theme: {
    extend: {
      typography: ({ theme }: { theme: (s: string) => string }) => ({
        blog: {
          css: {
            '--tw-prose-body':          theme('colors.ink.2'),
            '--tw-prose-headings':      theme('colors.ink.DEFAULT'),
            '--tw-prose-links':         theme('colors.accent.DEFAULT'),
            '--tw-prose-bold':          theme('colors.ink.DEFAULT'),
            '--tw-prose-counters':      theme('colors.ink.3'),
            '--tw-prose-bullets':       theme('colors.ink.4'),
            '--tw-prose-hr':            theme('colors.paper.200'),
            '--tw-prose-quote-borders': theme('colors.accent.DEFAULT'),
            '--tw-prose-captions':      theme('colors.ink.3'),
            '--tw-prose-pre-code':      '#cdd6f4',
            '--tw-prose-pre-bg':        '#1e1e2e',
            fontSize:   '1.125rem',
            lineHeight: '1.85',
            fontFamily: proseSerif,
            maxWidth:   '70ch',
            'h1,h2,h3,h4': { fontFamily: proseSerif, fontWeight: '600', letterSpacing: '-0.02em' },
            h2: { marginTop: '2.5em', fontSize: '1.55em' },
            h3: { marginTop: '2em',   fontSize: '1.25em' },
            p:  { marginTop: '1.4em', marginBottom: '1.4em' },
            a: {
              textDecoration: 'underline',
              textDecorationColor: 'rgba(192,57,43,0.35)',
              textUnderlineOffset: '3px',
              fontWeight: 'inherit',
              '&:hover': { color: theme('colors.accent.DEFAULT'), textDecorationColor: theme('colors.accent.DEFAULT') },
            },
            code: {
              fontFamily: proseMono,
              fontSize: '0.875em',
              background: theme('colors.paper.100'),
              padding: '0.15em 0.35em',
              borderRadius: '3px',
              fontWeight: '400',
              '&::before': { content: 'none' },
              '&::after':  { content: 'none' },
            },
            pre: { fontFamily: proseMono, fontSize: '0.875em', lineHeight: '1.7', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' },
            'pre code': { background: 'none', padding: '0', fontSize: 'inherit' },
            blockquote: { fontStyle: 'italic', borderLeftWidth: '2px', borderLeftColor: theme('colors.accent.DEFAULT'), paddingLeft: '1.25em', color: theme('colors.ink.2') },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after':   { content: 'none' },
            hr: { borderColor: theme('colors.paper.200'), marginTop: '3em', marginBottom: '3em' },
            'ul > li::marker': { color: theme('colors.accent.DEFAULT') },
          },
        },
      }),
    },
  },
}
export default config
