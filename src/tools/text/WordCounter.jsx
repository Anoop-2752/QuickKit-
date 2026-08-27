import { useState } from 'react'

function analyze(text) {
  const words       = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars       = text.length
  const charsNoSp   = text.replace(/\s/g, '').length
  const sentences   = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0
  const paragraphs  = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const mins        = words / 200
  const readingTime = words === 0 ? '—' : mins < 1 ? '< 1 min' : `${Math.ceil(mins)} min`

  return { words, chars, charsNoSp, sentences, paragraphs, readingTime }
}

export default function WordCounter() {
  const [text, setText] = useState('')
  const s = analyze(text)

  const stats = [
    { label: 'Words',        value: s.words.toLocaleString() },
    { label: 'Characters',   value: s.chars.toLocaleString() },
    { label: 'No spaces',    value: s.charsNoSp.toLocaleString() },
    { label: 'Sentences',    value: s.sentences.toLocaleString() },
    { label: 'Paragraphs',   value: s.paragraphs.toLocaleString() },
    { label: 'Reading time', value: s.readingTime },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* ── Stats grid (updates live as you type) ──────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-4 text-center"
          >
            <span className="text-2xl font-bold tracking-tight text-[var(--ink)]">{value}</span>
            <span className="mt-1 text-xs text-[var(--ink-body)]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Textarea ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Text</label>
          {text && (
            <button
              onClick={() => setText('')}
              className="text-xs text-[var(--ink-muted)] transition-colors hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here — stats update live as you type…"
          className="h-72 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 text-sm leading-relaxed text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] lg:h-96"
        />
      </div>

    </div>
  )
}
