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
          <label className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">
            Input JSON
          </label>
          <button
            onClick={handleSample}
            className="text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--accent)]"
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
          className="h-80 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 font-mono text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] lg:h-96"
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFormat}
            disabled={isProcessing}
            title="Format (Ctrl+Enter)"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent)] active:bg-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
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
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm font-medium text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
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

        <p className="text-xs text-[var(--ink-faint)]">Tip: press Ctrl+Enter to format</p>
      </div>

      {/* ── RIGHT: Output panel ───────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">
            Output
          </label>

          {isValid && (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Valid JSON
            </span>
          )}
          {isError && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-medium text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              Invalid JSON
            </span>
          )}
        </div>

        {/* Output box */}
        <div
          className={[
            'relative flex h-80 w-full flex-col rounded-xl border bg-[var(--surface-sunk)] lg:h-96',
            isError
              ? 'border-red-300'
              : isValid
              ? 'border-emerald-300'
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

          <div className="flex-1 overflow-auto p-4 pt-3">
            {isError ? (
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-700">
                  Parse Error
                </p>
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
            <div className="flex items-center gap-4 border-t border-[var(--line-subtle)] px-4 py-2">
              <span className="text-xs text-[var(--ink-muted)]">
                {outputLines.toLocaleString()} {outputLines === 1 ? 'line' : 'lines'}
              </span>
              <span className="text-xs text-[var(--ink-muted)]">
                {outputChars.toLocaleString()} chars
              </span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
