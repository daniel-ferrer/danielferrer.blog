import slugify from 'slugify'
import readingTime from 'reading-time'

export function makeSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true })
}

export function getReadingTime(content: string): string {
  return readingTime(content).text
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', ...opts }).format(new Date(date))
}

export function cn(...cls: (string | undefined | false | null)[]): string {
  return cls.filter(Boolean).join(' ')
}
