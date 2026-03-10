import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { categories, allTools, getCategoryBySlug } from '../data/tools'
import { Search, Braces, Binary, CreditCard, Percent, Receipt, ScanSearch, Combine, AlignLeft } from '../lib/icons'
import { usePageTitle } from '../hooks/usePageTitle'
import SEO from '../components/SEO'
import CategoryCard from '../components/CategoryCard'
import ToolCard from '../components/ToolCard'

const STRUCTURED_DATA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'QuickKit',
  url: 'https://quickkit.dev',
  description: 'Free online tools for developers, HR professionals, finance, career, and more.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://quickkit.dev/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
})

const POPULAR_PILLS = [
  { label: 'JSON Formatter',    category: 'developer', slug: 'json-formatter',      Icon: Braces   },
  { label: 'Base64',            category: 'developer', slug: 'base64',              Icon: Binary   },
  { label: 'EMI Calculator',    category: 'finance',   slug: 'emi-calculator',      Icon: CreditCard },
  { label: 'GST Calculator',    category: 'finance',   slug: 'gst-calculator',      Icon: Percent  },
  { label: 'Salary Slip',       category: 'hr',        slug: 'salary-slip-generator', Icon: Receipt  },
  { label: 'ATS Checker',       category: 'career',    slug: 'ats-keyword-checker', Icon: ScanSearch },
  { label: 'PDF Merger',        category: 'pdf',       slug: 'pdf-merger',          Icon: Combine  },
  { label: 'Word Counter',      category: 'text',      slug: 'word-counter',        Icon: AlignLeft },
]

const HOT_COMMANDS = [
  { label: 'JSON Formatter', category: 'developer', slug: 'json-formatter' },
  { label: 'Base64',         category: 'developer', slug: 'base64' },
  { label: 'EMI Calculator', category: 'finance',   slug: 'emi-calculator' },
  { label: 'Salary Slip',    category: 'hr',        slug: 'salary-slip-generator' },
  { label: 'ATS Checker',    category: 'career',    slug: 'ats-keyword-checker' },
]

export default function HomePage() {
  const [query, setQuery]       = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const navigate = useNavigate()
  usePageTitle(null)

  const trimmed    = query.trim().toLowerCase()
  const isSearching = trimmed.length > 0
  const results    = isSearching
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(trimmed) ||
          t.description.toLowerCase().includes(trimmed)
      )
    : []

  const visibleCategories = activeTab === 'all' ? categories : categories.filter((c) => c.slug === activeTab)

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <SEO
        title="Free Online Tools — Developer, HR, Finance, PDF & More"
        description={`QuickKit — ${allTools.length}+ free online tools for developers, HR managers, job seekers, and finance. EMI calculator, GST, salary slip, PDF merger, ATS checker and more. No signup, runs in your browser.`}
        keywords="free online tools, EMI calculator, GST calculator, salary slip generator, PDF merger, ATS keyword checker, income tax calculator, HR tools, developer tools"
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{STRUCTURED_DATA}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pb-10 pt-14 text-center">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-green-500/5 blur-3xl"
        />

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-xs font-medium text-green-300">
            {allTools.length}+ FREE BROWSER TOOLS — NO SIGNUP
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-2 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          Every Tool You Need,{' '}
          <em className="not-italic text-green-400">One Place.</em>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-zinc-400 sm:text-lg">
          Free tools for developers, HR teams, job seekers, and finance — all running in your browser. No account, no ads, no cost.
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-7 max-w-lg">
          <div className="relative flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 transition-all focus-within:border-green-500/40 focus-within:ring-1 focus-within:ring-green-500/20">
            <Search size={14} className="shrink-0 text-zinc-600" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools… JSON, Base64, UUID, EMI…"
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-zinc-600 hover:text-zinc-400"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Hot commands */}
        {!isSearching && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-zinc-700">Try:</span>
            {HOT_COMMANDS.map((cmd) => (
              <button
                key={cmd.slug}
                onClick={() => navigate(`/${cmd.category}/${cmd.slug}`)}
                className="rounded-full border border-[#2a2a2a] bg-[#141414] px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-green-500/30 hover:text-green-400"
              >
                {cmd.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Search results ───────────────────────────────────────────────────── */}
      {isSearching ? (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'} for "${query.trim()}"`
                : `No results for "${query.trim()}"`}
            </h2>
            <div className="h-px flex-1 bg-[#1e1e1e]" />
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((tool) => {
                const cat = getCategoryBySlug(tool.category)
                return (
                  <ToolCard key={tool.id} tool={tool} categoryColor={cat?.color} />
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#2a2a2a] py-14 text-center">
              <p className="text-sm text-zinc-600">
                Try "EMI", "GST", "Salary Slip", or "PDF".
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ── Popular Tools pill strip ──────────────────────────────────── */}
          <section className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-600">Popular Right Now</h2>
              <div className="h-px flex-1 bg-[#1e1e1e]" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {POPULAR_PILLS.map(({ label, category, slug, Icon: PillIcon }) => {
                const Ic = PillIcon
                return (
                  <button
                    key={slug}
                    onClick={() => navigate(`/${category}/${slug}`)}
                    className="group flex shrink-0 items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-4 py-2 text-sm text-zinc-400 transition-all hover:border-green-500/40 hover:bg-green-500/5 hover:text-green-400"
                  >
                    <Ic size={13} className="text-zinc-600 transition-colors group-hover:text-green-400" />
                    {label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Browse Labs ──────────────────────────────────────────────── */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-600">Browse Labs</h2>
              <div className="h-px flex-1 bg-[#1e1e1e]" />
            </div>

            {/* Category tabs */}
            <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={[
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'all'
                    ? 'bg-green-500/15 text-green-400'
                    : 'text-zinc-600 hover:text-zinc-300',
                ].join(' ')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(activeTab === cat.slug ? 'all' : cat.slug)}
                  className={[
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    activeTab === cat.slug
                      ? 'bg-green-500/15 text-green-400'
                      : 'text-zinc-600 hover:text-zinc-300',
                  ].join(' ')}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────────────────── */}
          <section className="mt-16 rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] px-6 py-10 text-center">
            <h2 className="mb-2 text-xl font-semibold text-white">Missing a tool?</h2>
            <p className="mb-5 text-sm text-zinc-500">
              Tell us what you need — we read every suggestion and build the most-requested tools.
            </p>
            <a
              href="https://forms.gle/qrPLgu6MvQEnoSUL9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-400"
            >
              Request a tool →
            </a>
          </section>
        </>
      )}
    </div>
  )
}
