import { useState, useCallback, useMemo } from 'react'

// ── Filler word list ──────────────────────────────────────────────────────────

const DEFAULT_FILLERS = new Set([
  'um', 'uh', 'er', 'ah', 'eh',
  'basically', 'literally', 'actually', 'honestly', 'seriously',
  'obviously', 'clearly', 'definitely', 'absolutely', 'totally',
  'simply', 'just', 'really', 'very', 'quite', 'rather',
  'anyway', 'right', 'like', 'so', 'well', 'okay',
])

// ── Tokenise preserving whitespace ───────────────────────────────────────────

function tokenize(text, fillers) {
  // Split on word boundaries, keeping whitespace and punctuation as separate tokens
  const regex = /(\s+|[^\s]+)/g
  const tokens = []
  let match
  while ((match = regex.exec(text)) !== null) {
    const raw   = match[0]
    const clean = raw.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '').toLowerCase()
    tokens.push({ raw, isFiller: fillers.has(clean) && /[a-zA-Z]/.test(raw) })
  }
  return tokens
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FillerWordRemover() {
  const [input, setInput]     = useState('')
  const [view, setView]       = useState('highlight') // 'highlight' | 'cleaned'
  const [copied, setCopied]   = useState(false)

  const tokens = useMemo(() => tokenize(input, DEFAULT_FILLERS), [input])

  const fillerTokens  = tokens.filter((t) => t.isFiller)
  const fillerCount   = fillerTokens.length
  const uniqueFillers = [...new Set(fillerTokens.map((t) => t.raw.toLowerCase()))]

  const wordsBefore = input.trim() ? input.trim().split(/\s+/).length : 0

  const cleanedText = useMemo(
    () =>
      tokens
        .filter((t) => !t.isFiller)
        .map((t) => t.raw)
        .join('')
        // collapse double spaces left by removed words
        .replace(/  +/g, ' ')
        .replace(/\n /g, '\n')
        .trim(),
    [tokens]
  )

  const wordsAfter = cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0
  const reduction  = wordsBefore > 0 ? Math.round(((wordsBefore - wordsAfter) / wordsBefore) * 100) : 0

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(cleanedText) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [cleanedText])

  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* ── Left: input ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Input</label>
          {input && (
            <button
              onClick={() => setInput('')}
              className="text-xs text-zinc-600 transition-colors hover:text-red-400"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Paste your text here and filler words will be highlighted automatically…\n\nExample: "I basically just, um, wanted to literally say that…"'}
          className="h-72 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 lg:h-80"
        />

        {/* Stats */}
        {input && (
          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-center">
              <p className="text-lg font-bold text-red-400">{fillerCount}</p>
              <p className="text-xs text-zinc-500">fillers found</p>
            </div>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-center">
              <p className="text-lg font-bold text-white">{wordsBefore}</p>
              <p className="text-xs text-zinc-500">words before</p>
            </div>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-center">
              <p className="text-lg font-bold text-emerald-400">{wordsAfter}</p>
              <p className="text-xs text-zinc-500">words after</p>
            </div>
            {reduction > 0 && (
              <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-center">
                <p className="text-lg font-bold text-indigo-400">{reduction}%</p>
                <p className="text-xs text-zinc-500">reduction</p>
              </div>
            )}
          </div>
        )}

        {/* Found fillers as tags */}
        {uniqueFillers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {uniqueFillers.map((w) => (
              <span key={w} className="rounded-full bg-red-500/10 px-2.5 py-1 font-mono text-xs text-red-400">
                {w}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: output ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Output</label>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex overflow-hidden rounded-lg border border-[#2a2a2a]">
              {['highlight', 'cleaned'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={[
                    'px-3 py-1 text-xs font-medium capitalize transition-colors',
                    view === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#1a1a1a] text-zinc-400 hover:text-white',
                  ].join(' ')}
                >
                  {v}
                </button>
              ))}
            </div>
            {view === 'cleaned' && cleanedText && (
              <button
                onClick={handleCopy}
                className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-[#3a3a3a] hover:text-white"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>

        <div className="min-h-72 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 lg:min-h-80">
          {!input ? (
            <p className="text-sm text-zinc-700">Output will appear here…</p>
          ) : view === 'highlight' ? (
            /* Highlight mode: show filler words struck through */
            <p className="text-sm leading-relaxed text-zinc-200">
              {tokens.map((token, i) =>
                token.isFiller ? (
                  <span key={i} className="rounded bg-red-500/15 px-0.5 text-red-400 line-through decoration-red-500">
                    {token.raw}
                  </span>
                ) : (
                  <span key={i}>{token.raw}</span>
                )
              )}
            </p>
          ) : (
            /* Cleaned mode: filler words removed */
            <p className="text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">{cleanedText}</p>
          )}
        </div>

        <p className="text-xs text-zinc-700">
          Removes common filler words. Switch to <span className="text-zinc-600">Highlight</span> to preview before copying.
        </p>
      </div>

    </div>
  )
}
