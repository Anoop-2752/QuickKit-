import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'
import { getCategoryBySlug } from '../data/tools'
import SEO from '../components/SEO'
import ToolCard from '../components/ToolCard'
import CategorySeoContent from '../components/CategorySeoContent'

function CategoryIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={20} />
}

function NotFound({ onBack }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <SEO title="Category Not Found" noindex />
      <p className="mb-2 text-4xl">🔍</p>
      <h1 className="mb-3 text-2xl font-semibold text-[var(--ink)]">Category not found</h1>
      <p className="mb-8 text-sm text-[var(--ink-body)]">
        The category you're looking for doesn't exist or may have moved.
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
      >
        ← Back to home
      </button>
    </div>
  )
}

export default function CategoryPage() {
  const { category: slug } = useParams()
  const navigate = useNavigate()
  const category = getCategoryBySlug(slug)
  const colors = getColors(category?.color)

  if (!category) return <NotFound onBack={() => navigate('/')} />

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      <SEO
        title={`${category.name} — Free Online Tools`}
        description={`Free online ${category.name.toLowerCase()}. ${category.description} No signup, no install, works instantly in your browser.`}
        keywords={`${category.name.toLowerCase()}, free online tools, browser tools, ${category.tools.map(t => t.name.toLowerCase()).join(', ')}`}
        path={`/${category.slug}`}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
        <Link to="/" className="transition-colors hover:text-[var(--ink-strong)]">
          Home
        </Link>
        <ChevronRight size={11} className="text-[var(--ink-faint)]" />
        <span className="text-[var(--ink-body)]">{category.name}</span>
      </nav>

      {/* Category header — compact */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.iconBg}`}>
            <CategoryIcon name={category.icon} className={colors.iconColor} />
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
            {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>
        <h1 className="font-display mb-1.5 text-[42px] leading-[1.1] tracking-tight text-[var(--ink)]">{category.name}</h1>
        <p className="text-sm text-[var(--ink-body)]">{category.description}</p>
      </header>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-widest text-[var(--ink-faint)]">Tools</span>
        <div className="h-px flex-1 bg-[var(--surface-tint)]" />
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} categoryColor={category.color} showCategory={false} />
        ))}
      </div>

      <CategorySeoContent slug={category.slug} />
    </div>
  )
}
