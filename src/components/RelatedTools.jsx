import { Link } from 'react-router-dom'
import { getIcon } from '../lib/icons'
import { getColors } from '../lib/colors'

export default function RelatedTools({ category, currentToolSlug }) {
  if (!category?.tools?.length) return null

  const related = category.tools
    .filter((t) => t.slug !== currentToolSlug)
    .slice(0, 3)

  if (!related.length) return null

  const colors = getColors(category.color)

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">
        More in {category.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((tool) => {
          const Icon = getIcon(tool.icon)
          return (
            <Link
              key={tool.id}
              to={`/${category.slug}/${tool.slug}`}
              className="group bg-[var(--surface-tint)] border border-[var(--line)] rounded-xl p-4 hover:border-[var(--line-strong)] transition"
            >
              <div className="flex items-center gap-3 mb-2">
                {Icon && (
                  <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                    <Icon className={`h-4 w-4 ${colors.iconColor}`} />
                  </div>
                )}
                <h3 className="text-sm font-medium text-[var(--ink)]">{tool.name}</h3>
              </div>
              <p className="text-sm text-[var(--ink-body)] line-clamp-2">
                {tool.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
