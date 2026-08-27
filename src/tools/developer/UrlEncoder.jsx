import { useState, useCallback } from 'react'

const ACTIONS = [
  {
    label: 'Encode Component',
    fn: encodeURIComponent,
    primary: true,
    hint: 'Encodes everything — use for query string values',
  },
  {
    label: 'Encode URL',
    fn: encodeURI,
    hint: 'Preserves :, /, ?, & — use for full URLs',
  },
  {
    label: 'Decode',
    fn: decodeURIComponent,
    hint: 'Decodes %XX sequences back to characters',
  },
]

export default function UrlEncoder() {
  const [input, setInput]      = useState('')
  const [output, setOutput]    = useState('')
  const [status, setStatus]    = useState(null) // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied]    = useState(false)
  const [mode, setMode]        = useState(null)

  function clearStatus() {
    setStatus(null)
    setErrorMsg('')
  }

  function run(fn, label) {
    if (!input.trim()) {
      setStatus('error')
      setErrorMsg('Input is empty.')
      setOutput('')
      return
    }
    try {
      setOutput(fn(input))
      setStatus('success')
      setErrorMsg('')
      setMode(label)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message)
      setOutput('')
    }
  }

  function handleClear() {
    setInput('')
    setOutput('')
    clearStatus()
    setCopied(false)
    setMode(null)
  }

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      const el = document.createElement('textarea')
      el.value = output
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const isError   = status === 'error'
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Input</label>

        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); clearStatus() }}
          spellCheck={false}
          placeholder={'Paste a URL or value…\n\nhttps://example.com/search?q=hello world&lang=en'}
          className="h-64 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 font-mono text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] lg:h-80"
        />

        <div className="flex flex-wrap gap-2">
          {ACTIONS.map(({ label, fn, primary }) => (
            <button
              key={label}
              onClick={() => run(fn, label)}
              className={
                primary
                  ? 'rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent)] active:bg-[var(--accent)]'
                  : 'rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm font-medium text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]'
              }
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="ml-auto rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm font-medium text-[var(--ink-body)] transition-colors hover:border-red-300 hover:text-red-700"
          >
            Clear
          </button>
        </div>

        {/* Hints */}
        <div className="flex flex-col gap-1">
          {ACTIONS.map(({ label, hint }) => (
            <p key={label} className="text-xs text-[var(--ink-faint)]">
              <span className="text-[var(--ink-muted)]">{label}:</span> {hint}
            </p>
          ))}
        </div>
      </div>

      {/* ── Output ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Output</label>

          {isSuccess && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              {mode}
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              Error
            </span>
          )}
        </div>

        <div
          className={[
            'relative flex h-64 w-full flex-col rounded-xl border bg-[var(--surface-sunk)] lg:h-80',
            isError   ? 'border-red-300'
            : isSuccess ? 'border-emerald-300'
            : 'border-[var(--line)]',
          ].join(' ')}
        >
          {output && (
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 z-10 rounded-md border border-[var(--line)] bg-[var(--surface-tint)] px-2.5 py-1 text-xs font-medium text-[var(--ink-body)] transition-all hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          )}

          <div className="flex-1 overflow-auto p-4">
            {isError ? (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-700">Error</p>
                <p className="font-mono text-sm text-red-700">{errorMsg}</p>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-[var(--ink-strong)]">
                {output}
              </pre>
            ) : (
              <p className="font-mono text-sm text-[var(--ink-faint)]">Output will appear here…</p>
            )}
          </div>

          {output && !isError && (
            <div className="border-t border-[var(--line-subtle)] px-4 py-2">
              <span className="text-xs text-[var(--ink-muted)]">{output.length.toLocaleString()} chars</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
