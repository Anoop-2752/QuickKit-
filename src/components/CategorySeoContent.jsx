import { categorySeoData } from '../data/categorySeoData'

export default function CategorySeoContent({ slug }) {
  const data = categorySeoData[slug]
  if (!data) return null
  return (
    <section className="mt-16 border-t border-[var(--surface-tint)] pt-12">
      <h2 className="mb-3 text-xl font-semibold text-[var(--ink)]">{data.headline}</h2>
      <p className="mb-6 text-sm leading-relaxed text-[var(--ink-body)]">{data.intro}</p>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {data.features.map((f, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[var(--ink-body)]">
            <span className="mt-0.5 text-[var(--accent)]">✓</span>
            <span>{f}</span>
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[var(--ink-body)]">{data.whyUse}</p>
    </section>
  )
}
