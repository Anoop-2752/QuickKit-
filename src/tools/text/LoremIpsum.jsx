import { useState, useCallback } from 'react'

// ── Corpus ────────────────────────────────────────────────────────────────────

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  'Ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.',
  'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
  'Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.',
  'Quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
  'Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
  'Nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit.',
  'Facilis est et expedita distinctio, nam libero tempore cum soluta nobis eligendi.',
  'Quid est quod ita gestiat laetitia, nihil ut ad eam accedat beatitudinem quam tibi.',
  'Ista quidem antiqua et ab his communiter omnibus philosophiae studiis divisa ratio est.',
  'Duo reges construebant sibi quisque imperium, praeterquam quod idem adprobatur a multis.',
  'Li Europan lingues es membres del sam familie. Lor separat existentie es un myth.',
  'The European languages are members of the same family. Their separate existence is a myth.',
  'Ma quande lingues coalesce, li grammatica del resultant lingue es plu simplic e regulari.',
  'It va esser tam simplic quam Occidental in fact, it va esser Occidental.',
]

const WORDS = SENTENCES.join(' ')
  .replace(/[.,!?;:']/g, '')
  .split(/\s+/)
  .filter(Boolean)

function pick() {
  return SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
}

// ── Generators ────────────────────────────────────────────────────────────────

function genParagraphs(count, startClassic) {
  return Array.from({ length: count }, (_, i) => {
    const len = 4 + Math.floor(Math.random() * 3)
    const sentences = Array.from({ length: len }, (_, j) =>
      i === 0 && j === 0 && startClassic ? SENTENCES[0] : pick()
    )
    return sentences.join(' ')
  }).join('\n\n')
}

function genSentences(count, startClassic) {
  return Array.from({ length: count }, (_, i) =>
    i === 0 && startClassic ? SENTENCES[0] : pick()
  ).join(' ')
}

function genWords(count, startClassic) {
  const base = startClassic ? WORDS : [...WORDS].sort(() => Math.random() - 0.5)
  const out   = []
  while (out.length < count) out.push(...base)
  return out.slice(0, count).join(' ') + '.'
}

const GENERATORS = { paragraphs: genParagraphs, sentences: genSentences, words: genWords }

const MODES = ['paragraphs', 'sentences', 'words']
const DEFAULTS = { paragraphs: 3, sentences: 5, words: 50 }

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoremIpsum() {
  const [mode, setMode]           = useState('paragraphs')
  const [count, setCount]         = useState(3)
  const [startClassic, setClassic] = useState(true)
  const [output, setOutput]       = useState(() => genParagraphs(3, true))
  const [copied, setCopied]       = useState(false)

  function handleMode(m) {
    setMode(m)
    setCount(DEFAULTS[m])
    setOutput(GENERATORS[m](DEFAULTS[m], startClassic))
  }

  function handleGenerate() {
    const n = Math.max(1, Math.min(count || 1, 200))
    setCount(n)
    setOutput(GENERATORS[mode](n, startClassic))
    setCopied(false)
  }

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(output) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-5">

      {/* ── Controls ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">

        {/* Mode pills */}
        <div className="flex gap-1">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => handleMode(m)}
              className={[
                'rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors',
                mode === m
                  ? 'bg-indigo-600 text-white'
                  : 'border border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:text-white',
              ].join(' ')}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Count</span>
          <input
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="w-20 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-center text-sm text-zinc-200 focus:border-indigo-500/50 focus:outline-none"
          />
        </div>

        {/* Start with Lorem ipsum */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={startClassic}
            onChange={(e) => setClassic(e.target.checked)}
            className="accent-indigo-500"
          />
          Start with "Lorem ipsum"
        </label>

        <button
          onClick={handleGenerate}
          className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Generate
        </button>
      </div>

      {/* ── Output ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Output</label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600">{wordCount.toLocaleString()} words</span>
            <button
              onClick={handleCopy}
              className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-zinc-400 transition-all hover:border-[#3a3a3a] hover:text-white"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <textarea
          readOnly
          value={output}
          className="h-80 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 text-sm leading-relaxed text-zinc-200 focus:outline-none lg:h-96"
        />
      </div>

    </div>
  )
}
