import { useState, useMemo } from 'react'

// Weak/filler phrases that hurt cover letters
const FILLER_RULES = [
  // Weak openers
  { phrase: 'i am writing to', category: 'Weak Opener', tip: 'Start with your value proposition instead.' },
  { phrase: 'i would like to', category: 'Weak Opener', tip: 'Be direct — say what you will do, not what you would like.' },
  { phrase: 'i am interested in', category: 'Weak Opener', tip: 'Show enthusiasm with specific reasons instead.' },
  { phrase: 'please find attached', category: 'Weak Opener', tip: 'Outdated phrase — omit it.' },
  { phrase: 'to whom it may concern', category: 'Weak Opener', tip: 'Research the hiring manager\'s name.' },

  // Filler hedges
  { phrase: 'i think', category: 'Hedge Word', tip: 'State it with confidence — remove "I think".' },
  { phrase: 'i believe', category: 'Hedge Word', tip: 'You either are or you aren\'t — remove the hedge.' },
  { phrase: 'i feel', category: 'Hedge Word', tip: 'Sounds uncertain. State facts instead.' },
  { phrase: 'i hope', category: 'Hedge Word', tip: 'Sounds passive. Be assertive.' },
  { phrase: 'hopefully', category: 'Hedge Word', tip: 'Removes certainty. Delete it.' },
  { phrase: 'maybe', category: 'Hedge Word', tip: 'Uncertain language weakens your case.' },
  { phrase: 'sort of', category: 'Hedge Word', tip: 'Vague. Be specific.' },
  { phrase: 'kind of', category: 'Hedge Word', tip: 'Vague. Be specific.' },
  { phrase: 'basically', category: 'Filler', tip: 'Usually adds nothing. Delete it.' },
  { phrase: 'essentially', category: 'Filler', tip: 'Often redundant. Delete it.' },
  { phrase: 'just', category: 'Filler', tip: '"Just" minimises your achievements. Remove it.' },
  { phrase: 'actually', category: 'Filler', tip: 'Usually redundant in formal writing.' },
  { phrase: 'very', category: 'Filler', tip: 'Weak intensifier. Use a stronger word instead.' },
  { phrase: 'really', category: 'Filler', tip: 'Weak intensifier. Be specific.' },

  // Clichés
  { phrase: 'hardworking', category: 'Cliché', tip: 'Show it with an example instead.' },
  { phrase: 'team player', category: 'Cliché', tip: 'Overused. Describe a specific collaboration.' },
  { phrase: 'detail-oriented', category: 'Cliché', tip: 'Prove it with a concrete example.' },
  { phrase: 'self-starter', category: 'Cliché', tip: 'Vague. Show an initiative you took.' },
  { phrase: 'go-getter', category: 'Cliché', tip: 'Meaningless. Replace with an achievement.' },
  { phrase: 'passionate about', category: 'Cliché', tip: 'Tell them what you\'ve actually done about it.' },
  { phrase: 'think outside the box', category: 'Cliché', tip: 'Old cliché. Describe an innovative thing you did.' },
  { phrase: 'fast learner', category: 'Cliché', tip: 'Prove it with a quick ramp-up story.' },
  { phrase: 'results-driven', category: 'Cliché', tip: 'Show results with numbers instead.' },
  { phrase: 'proven track record', category: 'Cliché', tip: 'Just state the track record.' },
  { phrase: 'synergy', category: 'Cliché', tip: 'Overused buzzword. Be specific.' },
  { phrase: 'leverage', category: 'Cliché', tip: 'Buzzword. Use "use" or "apply".' },

  // Unnecessary phrases
  { phrase: 'as per', category: 'Formal Filler', tip: 'Use "as" or "according to".' },
  { phrase: 'due to the fact that', category: 'Formal Filler', tip: 'Replace with "because".' },
  { phrase: 'in order to', category: 'Formal Filler', tip: 'Replace with "to".' },
  { phrase: 'at this point in time', category: 'Formal Filler', tip: 'Replace with "now".' },
  { phrase: 'in terms of', category: 'Formal Filler', tip: 'Usually removable. Rewrite the sentence.' },
]

const CATEGORY_COLORS = {
  'Weak Opener':   { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
  'Hedge Word':    { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  'Filler':        { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  'Cliché':        { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Formal Filler': { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
}

const SAMPLE = `Dear Hiring Manager,

I am writing to express my interest in the Software Engineer position at your company. I am a hardworking, detail-oriented, and self-starter individual who is passionate about technology.

I think I would be a great fit for your team. I believe my skills in React and Node.js will hopefully allow me to contribute effectively. I am basically a team player who works well in collaborative environments and I feel I can leverage my experience to drive results.

I would really like to discuss how my proven track record of delivering results-driven solutions can add synergy to your team. In order to demonstrate my abilities, please find attached my resume.

I hope to hear from you soon.

Best regards`

export default function CoverLetterFillerChecker() {
  const [text, setText] = useState('')

  const findings = useMemo(() => {
    if (!text.trim()) return []
    const lower = text.toLowerCase()
    return FILLER_RULES.filter((rule) => lower.includes(rule.phrase))
  }, [text])

  const score = text.trim()
    ? Math.max(0, 100 - findings.length * 8)
    : null

  const scoreColor =
    score === null ? ''
    : score >= 80 ? 'text-emerald-400'
    : score >= 50 ? 'text-amber-400'
    : 'text-red-400'

  const grouped = findings.reduce((acc, f) => {
    acc[f.category] = acc[f.category] || []
    acc[f.category].push(f)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
          Paste your cover letter below. We'll flag weak phrases, clichés, and filler words that hurt your chances.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => { setText(SAMPLE) }}
            className="text-xs text-zinc-600 transition-colors hover:text-indigo-400"
          >
            Load sample
          </button>
          <button
            onClick={() => setText('')}
            className="text-xs text-zinc-600 transition-colors hover:text-red-400"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your cover letter here…"
        spellCheck={false}
        className="h-64 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
      />

      {text.trim() && (
        <div className="flex flex-col gap-4">
          {/* Score */}
          <div className="flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <div className="flex flex-col items-center min-w-[4rem]">
              <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-xs text-zinc-600">quality score</span>
            </div>
            <div className="h-10 w-px bg-[#2a2a2a]" />
            <div>
              {findings.length === 0 ? (
                <p className="text-sm font-medium text-emerald-400">Excellent! No weak phrases found.</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">{findings.length} issue{findings.length !== 1 ? 's' : ''} found</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Fix these to strengthen your cover letter.</p>
                </>
              )}
            </div>
          </div>

          {/* Grouped findings */}
          {Object.entries(grouped).map(([category, items]) => {
            const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Filler']
            return (
              <div key={category} className={`rounded-xl border p-4 ${colors.border} bg-[#141414]`}>
                <h3 className={`mb-3 text-xs font-semibold uppercase tracking-widest ${colors.text}`}>
                  {category} ({items.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.phrase} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-mono font-medium ${colors.bg} ${colors.text}`}>
                          "{item.phrase}"
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 pl-1">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {findings.length === 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-sm text-emerald-400 font-medium">Your cover letter is clean!</p>
              <p className="text-xs text-zinc-600 mt-1">No weak phrases, clichés, or filler words detected.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
