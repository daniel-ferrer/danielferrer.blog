import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Lora } from 'next/font/google'
import '../styles/globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-lora',
})

// next/font has no Fontshare support, so Cabinet Grotesk is a stylesheet link.
const CABINET_GROTESK_CSS = 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700&display=swap'

export const metadata: Metadata = {
  title: { template: '%s — Daniel Ferrer', default: 'Daniel Ferrer · Blog' },
  description: 'Technical deep dives, lessons learned, and perspectives on SRE and software engineering.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={CABINET_GROTESK_CSS} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
