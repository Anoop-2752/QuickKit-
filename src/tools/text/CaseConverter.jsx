import { useState, useCallback } from 'react'

// Split any casing style into clean word array
function toWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')         // camelCase → camel Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')   // ABCDef → ABC Def
    .replace(/[_-]+/g, ' ')                        // snake/kebab → spaces
    .split(/\s+/)
    .filter(Boolean)
}

const cap  = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
const low  = (w) => w.toLowerCase()
const up   = (w) => w.toUpperCase()

const CONVERSIONS = [
  { label: 'UPPERCASE',     fn: (s) => s.toUpperCase() },
  { label: 'lowercase',     fn: (s) => s.toLowerCase() },
  { label: 'Title Case',    fn: (s) => toWords(s).map(cap).join(' ') },
  { label: 'Sentence case', fn: (s) => { const l = s.toLowerCase(); return l.charAt(0).toUpperCase() + l.slice(1) } },
  { label: 'camelCase',     fn: (s) => toWords(s).map((w, i) => i === 0 ? low(w) : cap(w)).join('') },
  { label: 'PascalCase',    fn: (s) => toWords(s).map(cap).join('') },
  { label: 'snake_case',    fn: (s) => toWords(s).map(low).join('_') },
  { label: 'kebab-case',    fn: (s) => toWords(s).map(low).join('-') },
  { label: 'CONSTANT_CASE', fn: (s) => toWords(s).map(up).join('_') },
]

export default function CaseConverter() {
  const [input, setInput]       = useState('')
  const [output, setOutput]     = useState('')
  const [activeMode, setActive] = useState(null)
  const [copied, setCopied]     = useState(false)

  function handleConvert(label, fn) {
    if (!input) return
    setOutput(fn(input))
    setActive(label)
    setCopied(false)
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

  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* ── Left: input + conversion buttons ──────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Input</label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here…"
          className="h-40 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
        />

        {/* 3×3 button grid */}
        <div className="grid grid-cols-3 gap-2">
          {CONVERSIONS.map(({ label, fn }) => (
            <button
              key={label}
              onClick={() => handleConvert(label, fn)}
              className={[
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeMode === label
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[#2a2a2a] bg-[#1a1a1a] text-zinc-300 hover:border-[#3a3a3a] hover:text-white',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: output ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Output</label>
          {activeMode && (
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
              {activeMode}
            </span>
          )}
        </div>

        <div className="relative flex min-h-[13rem] flex-col rounded-xl border border-[#2a2a2a] bg-[#0d0d0d]">
          {output && (
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 z-10 rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-[#3a3a3a] hover:text-white"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          )}

          <div className="flex-1 p-4">
            {output ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-200">
                {output}
              </p>
            ) : (
              <p className="text-sm text-zinc-700">Select a conversion above…</p>
            )}
          </div>

          {output && (
            <div className="border-t border-[#1e1e1e] px-4 py-2">
              <span className="text-xs text-zinc-600">{output.length.toLocaleString()} chars</span>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
