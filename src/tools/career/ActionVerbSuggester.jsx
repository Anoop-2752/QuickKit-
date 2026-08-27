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
  blue:    { bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]',    text: 'text-[var(--accent)]',    badge: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-700', badge: 'bg-emerald-600 text-emerald-700 border-emerald-300' },
  purple:  { bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]',  text: 'text-[var(--accent)]',  badge: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' },
  orange:  { bg: 'bg-orange-600',  text: 'text-orange-700',  badge: 'bg-orange-600 text-orange-700 border-orange-300' },
  cyan:    { bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]',    text: 'text-[var(--accent)]',    badge: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' },
  pink:    { bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]',    text: 'text-[var(--accent)]',    badge: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' },
  amber:   { bg: 'bg-amber-600',   text: 'text-amber-700',   badge: 'bg-amber-600 text-amber-700 border-amber-300' },
  green:   { bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]',   text: 'text-[var(--accent)]',   badge: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' },
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
        <p className="text-xs text-[var(--ink-muted)] leading-relaxed">
          Click any verb to copy it. Use strong action verbs to start every resume bullet — they show impact and impress ATS systems.
        </p>

        {/* Weak verbs reference */}
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-4 py-3">
          <p className="mb-2 text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wider">Replace these weak verbs:</p>
          <div className="flex flex-wrap gap-2">
            {WEAK_VERBS.map((v) => (
              <span key={v} className="rounded bg-red-600 px-2 py-0.5 text-xs font-mono text-red-700">{v}</span>
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
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] px-4 py-2.5 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
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
                    isActive ? colors.badge : 'border-[var(--line)] text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
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
            <div key={category} className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
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
                        ? 'border-emerald-300 bg-emerald-600 text-emerald-700'
                        : `border-[var(--line)] text-[var(--ink-strong)] hover:border-[var(--line-strong)] hover:${colors.text} ${colors.bg}`
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
          <div className="rounded-xl border border-dashed border-[var(--line)] py-10 text-center">
            <p className="text-sm text-[var(--ink-muted)]">No verbs match "{search}"</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--ink-faint)]">
        Tip: always start each resume bullet with a past-tense action verb (Led, Built, Increased…).
      </p>
    </div>
  )
}
