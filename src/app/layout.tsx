import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: { template: '%s — Daniel Ferrer', default: 'Daniel Ferrer · Blog' },
  description: 'Technical deep dives, lessons learned, and perspectives on SRE and software engineering.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
