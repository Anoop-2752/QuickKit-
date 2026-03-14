export default function HowToSteps({ steps }) {
  if (!steps?.length) return null
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-semibold text-white">How to Use</h2>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-zinc-200">{step.title}</p>
              {step.detail && <p className="mt-0.5 text-sm text-zinc-500">{step.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
