import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, allTools, getCategoryBySlug } from '../data/tools'
import { Search, Braces, Binary, CreditCard, Percent, Receipt, ScanSearch, Combine, AlignLeft, ShieldCheck, Check, Sparkles } from '../lib/icons'
import SEO from '../components/SEO'
import CategoryCard from '../components/CategoryCard'
import ToolCard from '../components/ToolCard'

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
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <SEO
        title="Free Online Tools — Developer, HR, Finance, PDF & More"
        description={`QuickKit — ${allTools.length}+ free online tools for developers, HR, finance, career, SEO, image, PDF, and text. No signup, runs in your browser.`}
        keywords="free online tools, EMI calculator, GST calculator, salary slip generator, PDF merger, ATS keyword checker, income tax calculator, HR tools, developer tools"
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="pb-10 pt-14 text-center">

        {/* Headline */}
        <h1 className="font-display mt-2 text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-[68px]">
          Every calculation you need,{' '}
          <em className="italic text-[var(--accent)]">in one place.</em>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-[var(--ink-body)] sm:text-lg">
          Free tools for finance, HR, career, developers and more — all running in your browser. No account, no uploads, nothing you type leaves your device.
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-7 max-w-lg">
          <div className="relative flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 transition-all focus-within:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] focus-within:ring-1 focus-within:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)]">
            <Search size={14} className="shrink-0 text-[var(--ink-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools… JSON, Base64, UUID, EMI…"
              className="flex-1 bg-transparent text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-muted)] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink-body)]"
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Hot commands */}
        {!isSearching && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[var(--ink-faint)]">Try:</span>
            {HOT_COMMANDS.map((cmd) => (
              <Link
                key={cmd.slug}
                to={`/${cmd.category}/${cmd.slug}`}
                className="rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-1 text-xs text-[var(--ink-body)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] hover:text-[var(--accent)]"
              >
                {cmd.label}
              </Link>
            ))}
          </div>
        )}

        {/* Trust line — the reason to use a salary or tax tool here rather
            than one that uploads what you type. */}
        {!isSearching && (
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[var(--line-subtle)] pt-7 text-sm text-[var(--ink-body)]">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--accent)]" />
              Nothing you enter leaves your browser
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-[var(--accent)]" />
              No account, no upload, no install
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-[var(--accent)]" />
              Free — every tool, every time
            </span>
          </div>
        )}
      </section>

      {/* ── Search results ───────────────────────────────────────────────────── */}
      {isSearching ? (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'} for "${query.trim()}"`
                : `No results for "${query.trim()}"`}
            </h2>
            <div className="h-px flex-1 bg-[var(--line-subtle)]" />
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
            <div className="rounded-xl border border-dashed border-[var(--line)] py-14 text-center">
              <p className="text-sm text-[var(--ink-muted)]">
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
              <h2 className="font-display text-xl text-[var(--ink)]">Popular right now</h2>
              <div className="h-px flex-1 bg-[var(--line-subtle)]" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {POPULAR_PILLS.map(({ label, category, slug, Icon: PillIcon }) => {
                const Ic = PillIcon
                return (
                  <Link
                    key={slug}
                    to={`/${category}/${slug}`}
                    className="group flex shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-alt)] px-4 py-2 text-sm text-[var(--ink-body)] transition-all hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] hover:text-[var(--accent)]"
                  >
                    <Ic size={13} className="text-[var(--ink-muted)] transition-colors group-hover:text-[var(--accent)]" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </section>

          {/* ── Browse by category ───────────────────────────────────────── */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="font-display text-2xl text-[var(--ink)]">Browse by category</h2>
              <div className="h-px flex-1 bg-[var(--line-subtle)]" />
            </div>

            {/* Category tabs */}
            <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={[
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'all'
                    ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink-strong)]',
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
                      ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink-strong)]',
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
          <section className="mt-16 rounded-2xl bg-[var(--accent)] px-6 py-12 text-center">
            <h2 className="font-display mb-2 text-3xl text-[var(--accent-on)]">Missing a tool?</h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-[color-mix(in_srgb,var(--accent-on)_75%,transparent)]">
              Tell us what you need — we read every suggestion and build the most-requested tools first.
            </p>
            <a
              href="https://forms.gle/qrPLgu6MvQEnoSUL9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-on)] px-6 py-3 text-sm font-semibold text-[var(--accent-hover)] transition-opacity hover:opacity-90"
            >
              Request a tool →
            </a>
          </section>
        </>
      )}
    </div>
  )
}
