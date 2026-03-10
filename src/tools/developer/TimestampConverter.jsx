import { useState, useEffect, useCallback } from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function isMs(n) {
  // Values > 10 billion are almost certainly milliseconds (year 2001+ in ms)
  return n > 10_000_000_000
}

function parseTimestamp(raw) {
  const n = Number(raw.trim())
  if (isNaN(n) || !raw.trim()) throw new Error('Enter a valid number')
  return new Date(isMs(n) ? n : n * 1000)
}

function relativeTime(date) {
  const diff = Date.now() - date.getTime()
  const abs  = Math.abs(diff)
  const past = diff > 0
  const sfx  = past ? 'ago' : 'from now'
  if (abs <    60_000) return 'just now'
  if (abs < 3_600_000) { const m = Math.floor(abs / 60_000);     return `${m} minute${m !== 1 ? 's' : ''} ${sfx}` }
  if (abs < 86_400_000){ const h = Math.floor(abs / 3_600_000);  return `${h} hour${h !== 1 ? 's' : ''} ${sfx}` }
  const d = Math.floor(abs / 86_400_000)
  return `${d} day${d !== 1 ? 's' : ''} ${sfx}`
}

// ── Small reusable row ────────────────────────────────────────────────────────

function OutRow({ label, value, copiedKey, rowKey, onCopy }) {
  return (
    <div className="group flex items-center gap-3 border-b border-[#1a1a1a] py-2.5 last:border-0">
      <span className="w-24 shrink-0 text-xs text-zinc-500">{label}</span>
      <span className="flex-1 truncate font-mono text-sm text-zinc-200">{value}</span>
      <button
        onClick={() => onCopy(value, rowKey)}
        className="shrink-0 rounded px-2 py-0.5 text-xs text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:text-zinc-300"
      >
        {copiedKey === rowKey ? '✓' : 'Copy'}
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TimestampConverter() {
  const [now, setNow] = useState(new Date())

  // Unix → Date state
  const [tsInput, setTsInput]     = useState('')
  const [tsResult, setTsResult]   = useState(null)  // Date | null
  const [tsError, setTsError]     = useState('')

  // Date → Unix state
  const [dtInput, setDtInput]     = useState('')
  const [dtResult, setDtResult]   = useState(null)  // Date | null
  const [dtError, setDtError]     = useState('')

  // Shared copy state
  const [copiedKey, setCopiedKey] = useState(null)

  // Live ticker
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const copy = useCallback(async (value, key) => {
    try { await navigator.clipboard.writeText(value) } catch { /* ignore */ }
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }, [])

  // Unix → Date
  function handleTsConvert() {
    try {
      setTsResult(parseTimestamp(tsInput))
      setTsError('')
    } catch (e) {
      setTsResult(null)
      setTsError(e.message)
    }
  }

  // Date → Unix
  function handleDtConvert() {
    const d = new Date(dtInput.trim())
    if (!dtInput.trim() || isNaN(d.getTime())) {
      setDtResult(null)
      setDtError('Enter a valid date — e.g. 2024-01-01 or January 1 2024')
      return
    }
    setDtResult(d)
    setDtError('')
  }

  // ── Build rows for Unix → Date result ──────────────────────────────────────
  const tsRows = tsResult
    ? [
        { label: 'Unix (s)',    value: String(Math.floor(tsResult.getTime() / 1000)), key: 'ts_s' },
        { label: 'Unix (ms)',   value: String(tsResult.getTime()),                    key: 'ts_ms' },
        { label: 'UTC',         value: tsResult.toUTCString(),                        key: 'ts_utc' },
        { label: 'Local',       value: tsResult.toLocaleString(),                     key: 'ts_local' },
        { label: 'ISO 8601',    value: tsResult.toISOString(),                        key: 'ts_iso' },
        { label: 'Relative',    value: relativeTime(tsResult),                        key: 'ts_rel' },
      ]
    : []

  // ── Build rows for Date → Unix result ──────────────────────────────────────
  const dtRows = dtResult
    ? [
        { label: 'Unix (s)',   value: String(Math.floor(dtResult.getTime() / 1000)), key: 'dt_s' },
        { label: 'Unix (ms)',  value: String(dtResult.getTime()),                    key: 'dt_ms' },
        { label: 'UTC',        value: dtResult.toUTCString(),                        key: 'dt_utc' },
        { label: 'ISO 8601',   value: dtResult.toISOString(),                        key: 'dt_iso' },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">

      {/* ── Live current time ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Current Time</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-3xl font-bold text-white">
            {Math.floor(now.getTime() / 1000).toLocaleString()}
          </span>
          <span className="text-xs text-zinc-500">seconds</span>
          <button
            onClick={() => copy(String(Math.floor(now.getTime() / 1000)), 'now_s')}
            className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {copiedKey === 'now_s' ? '✓' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Unix ms', value: now.getTime().toLocaleString() },
            { label: 'UTC',     value: now.toUTCString().replace(' GMT', '') },
            { label: 'Local',   value: now.toLocaleString() },
            { label: 'ISO',     value: now.toISOString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-[#0d0d0d] px-3 py-2">
              <p className="mb-0.5 text-xs text-zinc-600">{label}</p>
              <p className="truncate font-mono text-xs text-zinc-400">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two conversion panels ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Unix → Date */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Unix Timestamp → Date
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={tsInput}
              onChange={(e) => { setTsInput(e.target.value); setTsError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleTsConvert()}
              placeholder="e.g. 1704067200"
              className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              onClick={() => { setTsInput(String(Math.floor(Date.now() / 1000))); setTsError('') }}
              className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
              title="Use current timestamp"
            >
              Now
            </button>
            <button
              onClick={handleTsConvert}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Convert
            </button>
          </div>

          <div className="min-h-[11rem] rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-1">
            {tsError ? (
              <p className="py-3 font-mono text-sm text-red-400">{tsError}</p>
            ) : tsRows.length ? (
              tsRows.map((r) => (
                <OutRow key={r.key} {...r} copiedKey={copiedKey} onCopy={copy} />
              ))
            ) : (
              <p className="py-3 text-sm text-zinc-700">Enter a timestamp and click Convert…</p>
            )}
          </div>
        </div>

        {/* Date → Unix */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Date → Unix Timestamp
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={dtInput}
              onChange={(e) => { setDtInput(e.target.value); setDtError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleDtConvert()}
              placeholder="e.g. 2024-01-01 or Jan 1 2024 12:00"
              className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              onClick={handleDtConvert}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Convert
            </button>
          </div>

          <div className="min-h-[11rem] rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-1">
            {dtError ? (
              <p className="py-3 font-mono text-sm text-red-400">{dtError}</p>
            ) : dtRows.length ? (
              dtRows.map((r) => (
                <OutRow key={r.key} {...r} copiedKey={copiedKey} onCopy={copy} />
              ))
            ) : (
              <p className="py-3 text-sm text-zinc-700">Enter a date string and click Convert…</p>
            )}
          </div>
        </div>

      </div>

      <p className="text-xs text-zinc-700">
        Tip: press <span className="font-mono text-zinc-600">Enter</span> to convert. Auto-detects seconds vs milliseconds based on value magnitude.
      </p>

    </div>
  )
}
