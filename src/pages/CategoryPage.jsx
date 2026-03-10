import { useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'
import { getCategoryBySlug } from '../data/tools'
import { usePageTitle } from '../hooks/usePageTitle'
import SEO from '../components/SEO'
import ToolCard from '../components/ToolCard'

function CategoryIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={20} />
}

function NotFound({ onBack }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="mb-2 text-4xl">🔍</p>
      <h1 className="mb-3 text-2xl font-semibold text-white">Category not found</h1>
      <p className="mb-8 text-sm text-zinc-500">
        The category you're looking for doesn't exist or may have moved.
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white"
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

  usePageTitle(category?.name)

  if (!category) return <NotFound onBack={() => navigate('/')} />

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-8">
      <SEO
        title={`${category.name} — Free Online Tools`}
        description={`Free online ${category.name.toLowerCase()}. ${category.description} No signup, no install, works instantly in your browser.`}
        keywords={`${category.name.toLowerCase()}, free online tools, browser tools, ${category.tools.map(t => t.name.toLowerCase()).join(', ')}`}
        path={`/${category.slug}`}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-zinc-600">
        <button onClick={() => navigate('/')} className="transition-colors hover:text-zinc-300">
          Home
        </button>
        <ChevronRight size={11} className="text-zinc-700" />
        <span className="text-zinc-400">{category.name}</span>
      </nav>

      {/* Category header — compact */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.iconBg}`}>
            <CategoryIcon name={category.icon} className={colors.iconColor} />
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
            {category.tools.length} tools
          </span>
        </div>
        <h1 className="mb-1.5 text-3xl font-bold tracking-tight text-white">{category.name}</h1>
        <p className="text-sm text-zinc-500">{category.description}</p>
      </header>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-700">Tools</span>
        <div className="h-px flex-1 bg-[#1a1a1a]" />
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} categoryColor={category.color} />
        ))}
      </div>
    </div>
  )
}
