import { useState, useCallback } from 'react'

const INDENT = 2

// Yield to browser before heavy sync work so the disabled state renders first
function defer(fn) {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), 0))
}

const SAMPLE_JSON = JSON.stringify(
  {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    address: { street: '123 Main St', city: 'New York', zip: '10001' },
    tags: ['developer', 'designer'],
    active: true,
    score: null,
  },
  null,
  INDENT
)

function lineCount(str) {
  return str ? str.split('\n').length : 0
}

export default function JsonFormatter() {
  const [input, setInput]       = useState('')
  const [output, setOutput]     = useState('')
  const [status, setStatus]     = useState(null) // null | 'valid' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied]     = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // ── helpers ────────────────────────────────────────────────────────────────

  function clearStatus() {
    setStatus(null)
    setErrorMsg('')
  }

  function setError(msg) {
    setStatus('error')
    setErrorMsg(msg)
    setOutput('')
  }

  function parseInput() {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Input is empty. Paste some JSON to get started.')
      return null
    }
    try {
      return JSON.parse(trimmed)
    } catch (e) {
      setError(e.message)
      return null
    }
  }

  // ── actions ────────────────────────────────────────────────────────────────

  async function handleFormat() {
    setIsProcessing(true)
    await defer(() => {
      const parsed = parseInput()
      if (parsed !== null) {
        setOutput(JSON.stringify(parsed, null, INDENT))
        setStatus('valid')
        setErrorMsg('')
      }
    })
    setIsProcessing(false)
  }

  async function handleMinify() {
    setIsProcessing(true)
    await defer(() => {
      const parsed = parseInput()
      if (parsed !== null) {
        setOutput(JSON.stringify(parsed))
        setStatus('valid')
        setErrorMsg('')
      }
    })
    setIsProcessing(false)
  }

  async function handleValidate() {
    setIsProcessing(true)
    await defer(() => {
      const trimmed = input.trim()
      if (!trimmed) { setError('Input is empty.'); return }
      try {
        JSON.parse(trimmed)
        setStatus('valid')
        setErrorMsg('')
        setOutput(trimmed)
      } catch (e) {
        setError(e.message)
      }
    })
    setIsProcessing(false)
  }

  function handleClear() {
    setInput('')
    setOutput('')
    clearStatus()
    setCopied(false)
  }

  function handleSample() {
    setInput(SAMPLE_JSON)
    setOutput('')
    clearStatus()
  }

  // Ctrl+Enter (or Cmd+Enter on Mac) triggers Format
  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleFormat()
    }
  }

  // Auto-format when pasting valid JSON into an empty textarea
  function handlePaste(e) {
    if (input.trim()) return // only auto-format into empty input
    const pasted = e.clipboardData.getData('text')
    try {
      const parsed = JSON.parse(pasted.trim())
      e.preventDefault()
      const formatted = JSON.stringify(parsed, null, INDENT)
      setInput(formatted)
      setOutput(formatted)
      setStatus('valid')
      setErrorMsg('')
    } catch {
      // Not valid JSON — let the browser handle the paste normally
    }
  }

  const handleCopy = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers that block clipboard without focus
      const el = document.createElement('textarea')
      el.value = output
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [output])

  // ── derived display values ─────────────────────────────────────────────────

  const outputLines = lineCount(output)
  const outputChars = output.length
  const isError = status === 'error'
  const isValid = status === 'valid'

  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* ── LEFT: Input panel ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Input JSON
          </label>
          <button
            onClick={handleSample}
            className="text-xs text-zinc-600 transition-colors hover:text-indigo-400"
          >
            Load sample
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); clearStatus() }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          spellCheck={false}
          placeholder={'Paste your JSON here…\n\n{\n  "name": "QuickKit",\n  "type": "tool"\n}'}
          className="h-80 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 lg:h-96"
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFormat}
            disabled={isProcessing}
            title="Format (Ctrl+Enter)"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? 'Processing…' : 'Format'}
          </button>

          {[
            { label: 'Minify',   action: handleMinify   },
            { label: 'Validate', action: handleValidate },
          ].map(({ label, action }) => (
            <button
              key={label}
              onClick={action}
              disabled={isProcessing}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

        <p className="text-xs text-zinc-700">Tip: press Ctrl+Enter to format</p>
      </div>

      {/* ── RIGHT: Output panel ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Output
          </label>

          {isValid && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Valid JSON
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Invalid JSON
            </span>
          )}
        </div>

        {/* Output box */}
        <div
          className={[
            'relative flex h-80 w-full flex-col rounded-xl border bg-[#0d0d0d] lg:h-96',
            isError
              ? 'border-red-500/40'
              : isValid
              ? 'border-emerald-500/20'
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

          <div className="flex-1 overflow-auto p-4 pt-3">
            {isError ? (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-500">
                  Parse Error
                </p>
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
            <div className="flex items-center gap-4 border-t border-[#1e1e1e] px-4 py-2">
              <span className="text-xs text-zinc-600">
                {outputLines.toLocaleString()} {outputLines === 1 ? 'line' : 'lines'}
              </span>
              <span className="text-xs text-zinc-600">
                {outputChars.toLocaleString()} chars
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
