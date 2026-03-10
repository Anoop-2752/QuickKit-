import { useState, useMemo, useCallback } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked — GFM (tables, strikethrough, etc.) + line breaks
marked.use({ gfm: true, breaks: true })

// ── Sample content ────────────────────────────────────────────────────────────

const SAMPLE = `# Markdown Previewer

Write **Markdown** on the left, see the live *preview* on the right.

## Features

- **Bold**, *italic*, \`inline code\`
- [Links](https://quickkit.dev)
- Tables, blockquotes, code blocks

## Code Example

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Table

| Tool | Category | Status |
|------|----------|--------|
| JSON Formatter | Developer | ✅ Done |
| Markdown Previewer | Text | ✅ Done |

> Blockquotes look great too.
> Use them for callouts or quotes.

---

## Task List (GFM)

- [x] Build the app
- [x] Add dark theme
- [ ] Add more tools
`

// ── Component ─────────────────────────────────────────────────────────────────

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE)
  const [copied, setCopied]     = useState(false)
  const [view, setView]         = useState('split') // 'split' | 'editor' | 'preview'

  const html = useMemo(() => DOMPurify.sanitize(marked.parse(markdown)), [markdown])

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0
  const lineCount = markdown.split('\n').length

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(markdown) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [markdown])

  const showEditor  = view === 'split' || view === 'editor'
  const showPreview = view === 'split' || view === 'preview'

  return (
    <div className="flex flex-col gap-4">

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {[
            { v: 'editor',  label: 'Editor'  },
            { v: 'split',   label: 'Split'   },
            { v: 'preview', label: 'Preview' },
          ].map(({ v, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                view === v
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600">{lineCount} lines · {wordCount} words</span>
          <button
            onClick={() => { setMarkdown('') }}
            className="text-xs text-zinc-600 transition-colors hover:text-red-400"
          >
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-[#3a3a3a] hover:text-white"
          >
            {copied ? '✓ Copied!' : 'Copy Markdown'}
          </button>
        </div>
      </div>

      {/* ── Panels ───────────────────────────────────────────────────────────── */}
      <div className={`grid gap-4 ${view === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>

        {/* Editor */}
        {showEditor && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Markdown</span>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              className="h-[32rem] w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 font-mono text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Preview</span>
            <div className="h-[32rem] overflow-auto rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-6">
              {markdown.trim() ? (
                <div
                  className="md-preview"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <p className="text-sm text-zinc-700">Start typing to see the preview…</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
