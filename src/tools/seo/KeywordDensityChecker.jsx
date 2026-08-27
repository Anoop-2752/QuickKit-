import { useState, useMemo } from 'react'

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','it','its','i','me','my','we','our','you','your','he','she','they','them','their','as','if','so','not','no','nor','yet','both','either','each','any','all','most','more','some','such','than','then','just','also','very','too','up','out','about','into','through','during','before','after','above','below','between','against','while'])

function tokenize(text) {
  return text.toLowerCase().match(/\b[a-z]{2,}\b/g) || []
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function KeywordDensityChecker() {
  const [content, setContent] = useState('')
  const [keyword, setKeyword] = useState('')

  const analysis = useMemo(() => {
    if (!content.trim()) return null
    const words   = tokenize(content)
    const total   = words.length
    if (total === 0) return null

    // Keyword density
    const kw = keyword.trim().toLowerCase()
    const kwCount = kw
      ? words.filter(w => w === kw).length
      : 0
    const density = kw && total > 0 ? ((kwCount / total) * 100).toFixed(2) : null

    // Top words (excluding stop words)
    const freq = {}
    words.forEach(w => {
      if (!STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1
    })
    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Sentences
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length

    return { total, kwCount, density, topWords, sentences }
  }, [content, keyword])

  // Highlight keyword in content preview
  const highlighted = useMemo(() => {
    if (!content || !keyword.trim()) return null
    const parts = content.split(new RegExp(`(${escapeRegex(keyword.trim())})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.trim().toLowerCase()
        ? <mark key={i} className="rounded bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-[var(--accent)] px-0.5">{part}</mark>
        : part
    )
  }, [content, keyword])

  const densityColor = analysis?.density
    ? Number(analysis.density) > 5 ? 'text-red-700'
    : Number(analysis.density) > 3 ? 'text-[var(--accent)]'
    : Number(analysis.density) > 0 ? 'text-[var(--accent)]'
    : 'text-[var(--ink-body)]'
    : 'text-[var(--ink-body)]'

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Content / Page Text</label>
            <textarea
              className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] p-3 text-sm leading-relaxed text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors"
              rows={10}
              placeholder="Paste your article, blog post, or page content here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Target Keyword <span className="text-[var(--ink-muted)]">(single word)</span></label>
            <input
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors"
              placeholder="e.g. seo"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total Words',  value: analysis.total },
              { label: 'Sentences',    value: analysis.sentences },
              { label: 'Keyword Hits', value: keyword.trim() ? analysis.kwCount : '—' },
              { label: 'Density',      value: analysis.density ? `${analysis.density}%` : '—', color: densityColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] py-4">
                <span className={`text-2xl font-bold ${color || 'text-[var(--ink)]'}`}>{value}</span>
                <span className="mt-1 text-xs text-[var(--ink-body)]">{label}</span>
              </div>
            ))}
          </div>

          {/* Density feedback */}
          {analysis.density !== null && (
            <div className={`rounded-xl border p-4 text-sm ${
              Number(analysis.density) > 5
                ? 'border-red-300 bg-red-600 text-red-700'
                : Number(analysis.density) > 3
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                  : Number(analysis.density) > 0
                    ? 'border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--surface-alt)] text-[var(--ink-body)]'
            }`}>
              {Number(analysis.density) > 5
                ? `Keyword density is ${analysis.density}% — too high. Over 5% may be seen as keyword stuffing.`
                : Number(analysis.density) > 3
                  ? `Keyword density is ${analysis.density}% — slightly high. 1–3% is the sweet spot.`
                  : Number(analysis.density) > 0
                    ? `Keyword density is ${analysis.density}% — good. This is within the recommended 1–3% range.`
                    : `Keyword "${keyword}" not found in the content.`}
            </div>
          )}

          {/* Top words */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Top 10 Words (excluding stop words)</p>
            <div className="flex flex-col gap-2">
              {analysis.topWords.map(([word, count], i) => {
                const pct = Math.round((count / analysis.topWords[0][1]) * 100)
                return (
                  <div key={word} className="flex items-center gap-3">
                    <span className="w-4 text-xs text-[var(--ink-muted)] text-right">{i + 1}</span>
                    <span className="w-28 text-sm text-[var(--ink-strong)]">{word}</span>
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                      <div className="h-full rounded-full bg-[color-mix(in_srgb,var(--accent)_60%,transparent)]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-right text-xs text-[var(--ink-body)]">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Highlighted preview */}
          {keyword.trim() && analysis.kwCount > 0 && (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                Keyword Highlights ({analysis.kwCount} occurrence{analysis.kwCount !== 1 ? 's' : ''})
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-body)] whitespace-pre-wrap">{highlighted}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
