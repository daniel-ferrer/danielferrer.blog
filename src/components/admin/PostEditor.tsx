'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PostData {
  id: string; title: string; slug: string; excerpt: string;
  content: string; published: boolean; commentsEnabled: boolean;
  featured: boolean; tags: string[];
}

interface Props {
  mode: 'create' | 'edit'
  post?: PostData
}

type Tab = 'write' | 'preview'

export function PostEditor({ mode, post }: Props) {
  const router  = useRouter()
  const [tab, setTab]                   = useState<Tab>('write')
  const [title, setTitle]               = useState(post?.title ?? '')
  const [excerpt, setExcerpt]           = useState(post?.excerpt ?? '')
  const [content, setContent]           = useState(post?.content ?? '')
  const [tags, setTags]                 = useState(post?.tags.join(', ') ?? '')
  const [published, setPublished]       = useState(post?.published ?? false)
  const [commentsOn, setCommentsOn]     = useState(post?.commentsEnabled ?? true)
  const [featured, setFeatured]         = useState(post?.featured ?? false)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [PreviewComponent, setPreview]  = useState<React.ComponentType<{content: string}> | null>(null)

  // Lazy-load preview renderer
  async function loadPreview() {
    if (tab === 'preview') { setTab('write'); return }
    if (!PreviewComponent) {
      const { MarkdownRenderer } = await import('@/components/blog/MarkdownRenderer')
      setPreview(() => MarkdownRenderer)
    }
    setTab('preview')
  }

  async function save(publish?: boolean) {
    setSaving(true); setError('')
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
    const body = {
      title, excerpt, content, tags: tagArr,
      published: publish !== undefined ? publish : published,
      commentsEnabled: commentsOn,
      featured,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/posts' : `/api/posts/${post!.id}`,
        { method: mode === 'create' ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      )
      if (!res.ok) { setError((await res.json()).error ?? 'Save failed'); setSaving(false); return }
      router.push('/admin/dashboard')
    } catch { setError('Network error'); setSaving(false) }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const charCount = content.length

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {error && <div className="mb-4 font-mono text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Main editor */}
        <div className="space-y-4">
          {/* Title */}
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full font-serif text-3xl font-semibold text-ink bg-transparent border-0 border-b-2 border-paper-200 focus:outline-none focus:border-accent pb-3 placeholder:text-ink-5 transition"
          />

          {/* Excerpt */}
          <textarea
            value={excerpt} onChange={e => setExcerpt(e.target.value)}
            placeholder="Brief excerpt shown in post listings (optional)…"
            rows={2}
            className="w-full font-sans text-sm text-ink-2 bg-white border border-paper-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 placeholder:text-ink-4 resize-none transition"
          />

          {/* Write / Preview tabs */}
          <div className="bg-white border border-paper-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2">
              <div className="flex gap-1">
                <button onClick={() => setTab('write')}
                  className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${tab === 'write' ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink hover:bg-paper-100'}`}>
                  Write
                </button>
                <button onClick={loadPreview}
                  className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${tab === 'preview' ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink hover:bg-paper-100'}`}>
                  Preview
                </button>
              </div>
              <div className="font-mono text-xs text-ink-4">
                {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
              </div>
            </div>

            {tab === 'write' ? (
              <textarea
                value={content} onChange={e => setContent(e.target.value)}
                placeholder={`Write in Markdown…\n\n# Heading\n\nParagraph text.\n\n\`\`\`python\n# code block\n\`\`\``}
                className="w-full font-mono text-sm text-ink bg-transparent px-5 py-4 focus:outline-none placeholder:text-ink-5 resize-none min-h-[500px] leading-relaxed"
                style={{ minHeight: '500px' }}
              />
            ) : (
              <div className="px-5 py-4 min-h-[500px]">
                {PreviewComponent && content
                  ? <PreviewComponent content={content} />
                  : <p className="font-mono text-sm text-ink-4">Nothing to preview yet.</p>
                }
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-white border border-paper-200 rounded-xl p-4 space-y-3">
            <p className="font-mono text-xs text-ink-4 uppercase tracking-wider">Publish</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => save(true)} disabled={saving || !title || !content}
                className="w-full bg-ink text-white font-sans text-sm font-medium py-2.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-40">
                {saving ? 'Saving…' : published ? 'Update' : 'Publish now'}
              </button>
              <button onClick={() => save(false)} disabled={saving || !title || !content}
                className="w-full bg-paper-100 text-ink-2 font-sans text-sm py-2.5 rounded-lg hover:bg-paper-200 transition-colors disabled:opacity-40">
                Save as draft
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-paper-200 rounded-xl p-4 space-y-2">
            <label className="font-mono text-xs text-ink-4 uppercase tracking-wider block">Tags</label>
            <input
              type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="sre, reliability, career"
              className="w-full font-mono text-sm text-ink border border-paper-200 rounded-lg px-3 py-2 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 bg-paper-50 placeholder:text-ink-4 transition"
            />
            <p className="font-mono text-xs text-ink-5">Comma-separated. Used as hashtag footer.</p>
          </div>

          {/* Settings */}
          <div className="bg-white border border-paper-200 rounded-xl p-4 space-y-3">
            <p className="font-mono text-xs text-ink-4 uppercase tracking-wider">Settings</p>
            {[
              { label: 'Published',         val: published,  set: setPublished  },
              { label: 'Comments enabled',  val: commentsOn, set: setCommentsOn },
              { label: 'Featured post',     val: featured,   set: setFeatured   },
            ].map(s => (
              <label key={s.label} className="flex items-center justify-between cursor-pointer group">
                <span className="font-sans text-sm text-ink-2 group-hover:text-ink transition-colors">{s.label}</span>
                <button
                  type="button"
                  onClick={() => s.set(!s.val)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${s.val ? 'bg-accent' : 'bg-paper-300'}`}
                  role="switch" aria-checked={s.val}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${s.val ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </label>
            ))}
          </div>

          {/* Markdown cheatsheet */}
          <div className="bg-paper-100 border border-paper-200 rounded-xl p-4">
            <p className="font-mono text-xs text-ink-4 uppercase tracking-wider mb-2">Markdown</p>
            <div className="font-mono text-xs text-ink-3 space-y-1 leading-relaxed">
              {[
                ['# H1, ## H2, ### H3'],
                ['**bold**, *italic*'],
                ['`inline code`'],
                ['``` code block ```'],
                ['> blockquote'],
                ['- list item'],
                ['[text](url)'],
                ['---  (divider)'],
              ].map(([ex]) => <p key={ex}>{ex}</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
