'use client'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface Comment {
  id:        string
  author:    string
  body:      string
  createdAt: string   // ISO string — serialized from server
  approved:  boolean
}

interface Props {
  postId:          string
  comments:        Comment[]
  commentsEnabled: boolean
}

export function CommentSection({ postId, comments: init, commentsEnabled }: Props) {
  const [author,  setAuthor]  = useState('')
  const [email,   setEmail]   = useState('')
  const [body,    setBody]    = useState('')
  const [status,  setStatus]  = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [errMsg,  setErrMsg]  = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setErrMsg('')
    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postId, author, email, body }),
      })
      if (res.ok) {
        setStatus('success')
        setAuthor(''); setEmail(''); setBody('')
      } else {
        setErrMsg((await res.json()).error ?? 'Something went wrong')
        setStatus('error')
      }
    } catch {
      setErrMsg('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <section className="border-t border-paper-200 pt-12">
      <h2 className="font-serif text-2xl font-semibold text-ink tracking-tight mb-8">
        {init.length > 0
          ? `${init.length} Comment${init.length !== 1 ? 's' : ''}`
          : 'Comments'}
      </h2>

      {/* Existing approved comments */}
      {init.length > 0 && (
        <div className="space-y-6 mb-12">
          {init.map(c => (
            <div key={c.id} className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-paper-200 flex items-center justify-center flex-shrink-0 font-serif text-ink-3 text-sm font-semibold">
                {c.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="font-sans text-sm font-medium text-ink">{c.author}</span>
                  <time className="font-mono text-xs text-ink-4">
                    {formatDate(c.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>
                <p className="font-sans text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form or disabled notice */}
      {commentsEnabled ? (
        status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 font-sans text-sm text-green-700">
            Comment submitted — it'll appear once approved. Thanks!
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-ink">Leave a comment</h3>

            {status === 'error' && (
              <p className="font-mono text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {errMsg}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-ink-3 uppercase tracking-wider">Name *</label>
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  required maxLength={80} placeholder="Your name"
                  className="w-full font-sans text-sm text-ink border border-paper-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-paper-50 placeholder:text-ink-4 transition" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-ink-3 uppercase tracking-wider">
                  Email * <span className="normal-case text-ink-4">(not published)</span>
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required placeholder="you@example.com"
                  className="w-full font-sans text-sm text-ink border border-paper-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-paper-50 placeholder:text-ink-4 transition" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-ink-3 uppercase tracking-wider">Comment *</label>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                required rows={5} maxLength={5000} placeholder="What's on your mind?"
                className="w-full font-sans text-sm text-ink border border-paper-200 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-paper-50 placeholder:text-ink-4 resize-y transition" />
              <p className="font-mono text-xs text-ink-5 text-right">{body.length}/5000</p>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <button type="submit" disabled={status === 'loading'}
                className="font-sans text-sm font-medium bg-ink text-white px-6 py-2.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
                {status === 'loading' ? 'Submitting…' : 'Submit comment'}
              </button>
              <p className="font-mono text-xs text-ink-4">Moderated — appears once approved.</p>
            </div>
          </form>
        )
      ) : (
        <p className="font-mono text-xs text-ink-4 bg-paper-100 border border-paper-200 rounded-lg px-4 py-3">
          Comments are disabled for this post.
        </p>
      )}
    </section>
  )
}
