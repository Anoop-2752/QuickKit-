import { useState } from 'react'

const VERB_DATA = {
  Leadership: {
    color: 'blue',
    verbs: ['Led', 'Directed', 'Managed', 'Oversaw', 'Supervised', 'Coordinated', 'Spearheaded', 'Championed', 'Orchestrated', 'Guided', 'Mentored', 'Coached', 'Inspired', 'Mobilised', 'Drove'],
  },
  Achievement: {
    color: 'emerald',
    verbs: ['Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained', 'Completed', 'Secured', 'Won', 'Earned', 'Reached', 'Boosted', 'Maximised', 'Grew', 'Expanded'],
  },
  Analysis: {
    color: 'purple',
    verbs: ['Analysed', 'Evaluated', 'Assessed', 'Identified', 'Investigated', 'Diagnosed', 'Researched', 'Examined', 'Reviewed', 'Audited', 'Benchmarked', 'Measured', 'Tracked', 'Monitored', 'Mapped'],
  },
  Building: {
    color: 'orange',
    verbs: ['Built', 'Developed', 'Designed', 'Created', 'Engineered', 'Architected', 'Launched', 'Established', 'Founded', 'Implemented', 'Deployed', 'Integrated', 'Configured', 'Programmed', 'Coded'],
  },
  Improvement: {
    color: 'cyan',
    verbs: ['Improved', 'Optimised', 'Streamlined', 'Reduced', 'Increased', 'Enhanced', 'Accelerated', 'Automated', 'Simplified', 'Upgraded', 'Transformed', 'Modernised', 'Refactored', 'Revamped', 'Strengthened'],
  },
  Collaboration: {
    color: 'pink',
    verbs: ['Collaborated', 'Partnered', 'Supported', 'Assisted', 'Contributed', 'Facilitated', 'Liaised', 'Aligned', 'Unified', 'Negotiated', 'Mediated', 'Advised', 'Consulted', 'Engaged', 'Interfaced'],
  },
  Communication: {
    color: 'amber',
    verbs: ['Presented', 'Authored', 'Wrote', 'Reported', 'Documented', 'Published', 'Communicated', 'Articulated', 'Pitched', 'Trained', 'Educated', 'Briefed', 'Proposed', 'Drafted', 'Translated'],
  },
  Finance: {
    color: 'green',
    verbs: ['Budgeted', 'Forecasted', 'Allocated', 'Generated', 'Saved', 'Reduced costs', 'Managed budgets', 'Negotiated contracts', 'Controlled expenses', 'Increased revenue', 'Cut costs', 'Funded', 'Invested', 'Procured', 'Sourced'],
  },
}

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-300',    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-300',  badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  orange:  { bg: 'bg-orange-500/10',  text: 'text-orange-300',  badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-300',    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  pink:    { bg: 'bg-pink-500/10',    text: 'text-pink-300',    badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-300',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  green:   { bg: 'bg-green-500/10',   text: 'text-green-300',   badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
}

const WEAK_VERBS = ['did', 'made', 'worked', 'helped', 'handled', 'was responsible for', 'assisted with', 'involved in', 'participated in', 'contributed to', 'responsible for', 'dealt with', 'took care of', 'worked on', 'did work']

export default function ActionVerbSuggester() {
  const [search, setSearch]       = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [copied, setCopied]       = useState(null)

  const filteredData = search.trim()
    ? Object.entries(VERB_DATA).reduce((acc, [cat, data]) => {
        const matches = data.verbs.filter((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
        if (matches.length) acc[cat] = { ...data, verbs: matches }
        return acc
      }, {})
    : activeCategory
    ? { [activeCategory]: VERB_DATA[activeCategory] }
    : VERB_DATA

  async function handleCopy(verb) {
    await navigator.clipboard.writeText(verb).catch(() => {})
    setCopied(verb)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-zinc-600 leading-relaxed">
          Click any verb to copy it. Use strong action verbs to start every resume bullet — they show impact and impress ATS systems.
        </p>

        {/* Weak verbs reference */}
        <div className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3">
          <p className="mb-2 text-xs font-medium text-zinc-600 uppercase tracking-wider">Replace these weak verbs:</p>
          <div className="flex flex-wrap gap-2">
            {WEAK_VERBS.map((v) => (
              <span key={v} className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-mono text-red-400">{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveCategory(null) }}
          placeholder="Search verbs… e.g. 'lead', 'build', 'improve'"
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
        />

        {!search && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(VERB_DATA).map(([cat, data]) => {
              const colors = COLOR_MAP[data.color]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    isActive ? colors.badge : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Verb grid */}
      <div className="flex flex-col gap-4">
        {Object.entries(filteredData).map(([category, data]) => {
          const colors = COLOR_MAP[data.color]
          return (
            <div key={category} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <h3 className={`mb-3 text-xs font-semibold uppercase tracking-widest ${colors.text}`}>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.verbs.map((verb) => (
                  <button
                    key={verb}
                    onClick={() => handleCopy(verb)}
                    title="Click to copy"
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      copied === verb
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : `border-[#2a2a2a] text-zinc-300 hover:border-[#3a3a3a] hover:${colors.text} ${colors.bg}`
                    }`}
                  >
                    {copied === verb ? '✓ Copied' : verb}
                  </button>
                ))}
              </div>
            </div>
          )
        })}

        {Object.keys(filteredData).length === 0 && (
          <div className="rounded-xl border border-dashed border-[#2a2a2a] py-10 text-center">
            <p className="text-sm text-zinc-600">No verbs match "{search}"</p>
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-700">
        Tip: always start each resume bullet with a past-tense action verb (Led, Built, Increased…).
      </p>
    </div>
  )
}
