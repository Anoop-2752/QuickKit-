import { useNavigate } from 'react-router-dom'
import { ArrowRight, getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'

function CategoryIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={20} />
}

export default function CategoryCard({ category }) {
  const navigate = useNavigate()
  const colors = getColors(category.color)
  const previewTools = category.tools.slice(0, 4)

  return (
    <button
      onClick={() => navigate(`/${category.slug}`)}
      className={[
        'group w-full text-left rounded-2xl bg-[#111] p-5',
        'border border-[#1e1e1e] border-t-[#282828]',
        'transition-all duration-300 cursor-pointer',
        colors.hoverBorder,
        colors.hoverGlow,
      ].join(' ')}
    >
      {/* Top row: icon + badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <CategoryIcon
            name={category.icon}
            className={`transition-colors duration-300 ${colors.iconColor} ${colors.hoverIcon}`}
          />
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
          {category.tools.length} tools
        </span>
      </div>

      {/* Name */}
      <h2 className="mb-1 text-base font-semibold text-white">{category.name}</h2>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500">{category.description}</p>

      {/* Tool name pills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {previewTools.map((tool) => (
          <span
            key={tool.id}
            className="rounded-md border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-0.5 text-xs text-zinc-500"
          >
            {tool.name}
          </span>
        ))}
        {category.tools.length > 4 && (
          <span className="rounded-md border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-0.5 text-xs text-zinc-600">
            +{category.tools.length - 4} more
          </span>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex items-center gap-1 text-xs font-medium text-zinc-600 transition-colors duration-300 group-hover:text-green-400">
        <span>Open Laboratory</span>
        <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}
