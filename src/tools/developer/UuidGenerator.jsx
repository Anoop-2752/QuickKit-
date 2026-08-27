import { useState, useCallback } from 'react'

const COUNT_OPTIONS = [1, 5, 10, 25, 50]

function generate(count, uppercase) {
  return Array.from({ length: count }, () => {
    const id = crypto.randomUUID()
    return uppercase ? id.toUpperCase() : id
  })
}

export default function UuidGenerator() {
  const [count, setCount]           = useState(5)
  const [uppercase, setUppercase]   = useState(false)
  const [uuids, setUuids]           = useState(() => generate(5, false))
  const [copiedIdx, setCopiedIdx]   = useState(null)
  const [copiedAll, setCopiedAll]   = useState(false)

  function handleGenerate() {
    setUuids(generate(count, uppercase))
    setCopiedIdx(null)
    setCopiedAll(false)
  }

  function handleToggleCase(toUpper) {
    setUppercase(toUpper)
    setUuids((prev) => prev.map((id) => (toUpper ? id.toUpperCase() : id.toLowerCase())))
  }

  const copyOne = useCallback(async (uuid, idx) => {
    try {
      await navigator.clipboard.writeText(uuid)
    } catch {
      const el = document.createElement('textarea')
      el.value = uuid
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }, [])

  const copyAll = useCallback(async () => {
    const text = uuids.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }, [uuids])

  return (
    <div className="flex flex-col gap-5">

      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">

        {/* Count pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-body)]">Count</span>
          <div className="flex gap-1">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={[
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  count === n
                    ? 'bg-[var(--accent)] text-[var(--ink)]'
                    : 'border border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:text-[var(--ink)]',
                ].join(' ')}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Case toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--ink-body)]">Format</span>
          <div className="flex overflow-hidden rounded-lg border border-[var(--line)]">
            {[
              { label: 'lowercase', value: false },
              { label: 'UPPERCASE', value: true  },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleToggleCase(value)}
                className={[
                  'px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                  uppercase === value
                    ? 'bg-[var(--accent)] text-[var(--ink)]'
                    : 'bg-[var(--surface-tint)] text-[var(--ink-body)] hover:text-[var(--ink)]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={copyAll}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm font-medium text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
          >
            {copiedAll ? '✓ Copied all!' : 'Copy All'}
          </button>
          <button
            onClick={handleGenerate}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent)] active:bg-[var(--accent)]"
          >
            Generate
          </button>
        </div>
      </div>

      {/* ── UUID list ──────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-sunk)]">
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className={[
              'group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--surface-alt)]',
              idx !== 0 ? 'border-t border-[var(--surface-tint)]' : '',
            ].join(' ')}
          >
            <span className="select-all font-mono text-sm text-[var(--ink-strong)]">{uuid}</span>
            <button
              onClick={() => copyOne(uuid, idx)}
              className="ml-4 shrink-0 rounded px-2.5 py-1 text-xs font-medium text-[var(--ink-muted)] opacity-0 transition-all group-hover:opacity-100 hover:text-[var(--ink-strong)]"
            >
              {copiedIdx === idx ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--ink-faint)]">
        Uses <span className="font-mono text-[var(--ink-muted)]">crypto.randomUUID()</span> — cryptographically secure UUID v4, generated entirely in your browser.
      </p>

    </div>
  )
}
