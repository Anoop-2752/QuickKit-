import { useState, useCallback } from 'react'
import { diffLines, diffWords } from 'diff'

// ── Component ─────────────────────────────────────────────────────────────────

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name)
  return true
}

const users = ["Alice", "Bob", "Charlie"]
users.forEach(u => greet(u))
`

const SAMPLE_B = `function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!")
  return true
}

const users = ["Alice", "Bob", "Charlie", "Dave"]
users.forEach(u => greet(u))
`

export default function DiffChecker() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [mode, setMode]         = useState('lines')   // 'lines' | 'words'
  const [diffResult, setDiff]   = useState(null)
  const [copied, setCopied]     = useState(false)

  const handleCompare = useCallback(() => {
    const result = mode === 'lines'
      ? diffLines(original, modified)
      : diffWords(original, modified)
    setDiff(result)
  }, [original, modified, mode])

  const loadSample = () => {
    setOriginal(SAMPLE_A)
    setModified(SAMPLE_B)
    setDiff(null)
  }

  const handleCopy = useCallback(async () => {
    if (!diffResult) return
    const text = diffResult
      .map((p) => {
        const prefix = p.added ? '+ ' : p.removed ? '- ' : '  '
        if (mode === 'lines') {
          return p.value.split('\n').filter((_, i, a) => i < a.length - 1 || p.value.endsWith('\n') || p.value !== '\n')
            .map((line) => prefix + line).join('\n')
        }
        return prefix + p.value
      })
      .join(mode === 'lines' ? '\n' : '')
    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [diffResult, mode])

  // Stats
  const additions = diffResult ? diffResult.filter((p) => p.added).reduce((n, p) => n + (mode === 'lines' ? p.count ?? 0 : 1), 0) : 0
  const deletions = diffResult ? diffResult.filter((p) => p.removed).reduce((n, p) => n + (mode === 'lines' ? p.count ?? 0 : 1), 0) : 0
  const unchanged = diffResult ? diffResult.filter((p) => !p.added && !p.removed).reduce((n, p) => n + (mode === 'lines' ? p.count ?? 0 : 1), 0) : 0

  const hasChanges = diffResult && (additions > 0 || deletions > 0)
  const identical  = diffResult && !hasChanges

  return (
    <div className="flex flex-col gap-5">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Mode toggle */}
        <div className="flex gap-1">
          {[
            { v: 'lines', label: 'Line diff' },
            { v: 'words', label: 'Word diff' },
          ].map(({ v, label }) => (
            <button
              key={v}
              onClick={() => { setMode(v); setDiff(null) }}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                mode === v
                  ? 'bg-[var(--accent)] text-[var(--ink)]'
                  : 'border border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSample}
            className="text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
          >
            Load sample
          </button>
          <button
            onClick={() => { setOriginal(''); setModified(''); setDiff(null) }}
            className="text-xs text-[var(--ink-muted)] transition-colors hover:text-red-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ── Input panels ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Original</span>
          <textarea
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setDiff(null) }}
            placeholder="Paste original text here…"
            spellCheck={false}
            className="h-52 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 font-mono text-sm leading-relaxed text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Modified</span>
          <textarea
            value={modified}
            onChange={(e) => { setModified(e.target.value); setDiff(null) }}
            placeholder="Paste modified text here…"
            spellCheck={false}
            className="h-52 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 font-mono text-sm leading-relaxed text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
          />
        </div>
      </div>

      {/* ── Compare button ──────────────────────────────────────────────────── */}
      <button
        onClick={handleCompare}
        disabled={!original && !modified}
        className="self-start rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Compare
      </button>

      {/* ── Result ──────────────────────────────────────────────────────────── */}
      {diffResult && (
        <div className="flex flex-col gap-3">

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-3">
            {identical ? (
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-emerald-700">
                Files are identical
              </span>
            ) : (
              <>
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-emerald-700">
                  +{additions} addition{additions !== 1 ? 's' : ''}
                </span>
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-red-700">
                  -{deletions} deletion{deletions !== 1 ? 's' : ''}
                </span>
                <span className="rounded-full bg-[var(--surface-tint)] px-3 py-1 text-xs font-medium text-[var(--ink-body)]">
                  {unchanged} unchanged
                </span>
              </>
            )}

            <button
              onClick={handleCopy}
              className="ml-auto rounded-md border border-[var(--line)] bg-[var(--surface-tint)] px-2.5 py-1 text-xs font-medium text-[var(--ink-body)] transition-all hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              {copied ? '✓ Copied!' : 'Copy diff'}
            </button>
          </div>

          {/* Diff output */}
          <div className="overflow-auto rounded-xl border border-[var(--line)] bg-[var(--surface-sunk)] p-4 font-mono text-sm leading-relaxed">
            {mode === 'lines' ? (
              <LineDiff parts={diffResult} />
            ) : (
              <WordDiff parts={diffResult} />
            )}
          </div>
        </div>
      )}

    </div>
  )
}

// ── Line diff renderer ────────────────────────────────────────────────────────

function LineDiff({ parts }) {
  return (
    <div>
      {parts.map((part, pi) => {
        const lines = part.value.split('\n')
        // Remove trailing empty entry from split when value ends with \n
        if (lines[lines.length - 1] === '') lines.pop()
        return lines.map((line, li) => (
          <div
            key={`${pi}-${li}`}
            className={[
              'flex gap-3 px-2 py-0.5',
              part.added   ? 'bg-emerald-600' :
              part.removed ? 'bg-red-600' : '',
            ].join(' ')}
          >
            <span className={[
              'select-none w-3 shrink-0',
              part.added   ? 'text-emerald-700' :
              part.removed ? 'text-red-700' : 'text-[var(--ink-faint)]',
            ].join(' ')}>
              {part.added ? '+' : part.removed ? '-' : ' '}
            </span>
            <span className={
              part.added   ? 'text-emerald-700' :
              part.removed ? 'text-red-700' : 'text-[var(--ink-body)]'
            }>
              {line || '\u00A0'}
            </span>
          </div>
        ))
      })}
    </div>
  )
}

// ── Word diff renderer ────────────────────────────────────────────────────────

function WordDiff({ parts }) {
  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part.added
              ? 'rounded bg-emerald-600 text-emerald-700'
              : part.removed
              ? 'rounded bg-red-600 text-red-700 line-through'
              : 'text-[var(--ink-body)]'
          }
        >
          {part.value}
        </span>
      ))}
    </p>
  )
}
