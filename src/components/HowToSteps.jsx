export default function HowToSteps({ steps }) {
  if (!steps?.length) return null
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-[var(--ink)]">How to Use</h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-xs font-bold text-[var(--accent)]">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--ink-strong)]">{step.title}</p>
              {step.detail && <p className="mt-0.5 text-sm text-[var(--ink-body)]">{step.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
