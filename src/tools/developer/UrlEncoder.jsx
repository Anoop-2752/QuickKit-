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
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Input</label>

        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); clearStatus() }}
          spellCheck={false}
          placeholder={'Paste a URL or value…\n\nhttps://example.com/search?q=hello world&lang=en'}
          className="h-64 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 lg:h-80"
        />

        <div className="flex flex-wrap gap-2">
          {ACTIONS.map(({ label, fn, primary }) => (
            <button
              key={label}
              onClick={() => run(fn, label)}
              className={
                primary
                  ? 'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700'
                  : 'rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white'
              }
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="ml-auto rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:border-red-900/60 hover:text-red-400"
          >
            Clear
          </button>
        </div>

        {/* Hints */}
        <div className="flex flex-col gap-1">
          {ACTIONS.map(({ label, hint }) => (
            <p key={label} className="text-xs text-zinc-700">
              <span className="text-zinc-600">{label}:</span> {hint}
            </p>
          ))}
        </div>
      </div>

      {/* ── Output ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Output</label>

          {isSuccess && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {mode}
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Error
            </span>
          )}
        </div>

        <div
          className={[
            'relative flex h-64 w-full flex-col rounded-xl border bg-[#0d0d0d] lg:h-80',
            isError   ? 'border-red-500/40'
            : isSuccess ? 'border-emerald-500/20'
            : 'border-[#2a2a2a]',
          ].join(' ')}
        >
          {output && (
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 z-10 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-[#3a3a3a] hover:text-white"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          )}

          <div className="flex-1 overflow-auto p-4">
            {isError ? (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-500">Error</p>
                <p className="font-mono text-sm text-red-400">{errorMsg}</p>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-zinc-200">
                {output}
              </pre>
            ) : (
              <p className="font-mono text-sm text-zinc-700">Output will appear here…</p>
            )}
          </div>

          {output && !isError && (
            <div className="border-t border-[#1e1e1e] px-4 py-2">
              <span className="text-xs text-zinc-600">{output.length.toLocaleString()} chars</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
