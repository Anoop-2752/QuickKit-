import { useState } from 'react'

const inputCls = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors'

function CharBar({ value, max }) {
  const len = value.length
  const pct = Math.min((len / max) * 100, 100)
  const color = len > max ? 'bg-red-600' : len > max * 0.85 ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]'
  const textColor = len > max ? 'text-red-700' : len > max * 0.85 ? 'text-[var(--accent)]' : 'text-[var(--ink-body)]'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs tabular-nums ${textColor}`}>{len}/{max}</span>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[var(--ink-body)]">{label}</label>
      {children}
    </div>
  )
}

export default function MetaTagGenerator() {
  const [f, setF] = useState({
    title: '', description: '', keywords: '', author: '', canonical: '',
    ogTitle: '', ogDesc: '', ogImage: '', ogSiteName: '',
    twitterHandle: '', twitterCard: 'summary_large_image',
  })
  const [copied, setCopied] = useState(false)

  function set(k) { return (e) => setF(p => ({ ...p, [k]: e.target.value })) }

  function buildTags() {
    const lines = []
    if (f.title)       lines.push(`<title>${f.title}</title>`)
    if (f.description) lines.push(`<meta name="description" content="${f.description}" />`)
    if (f.keywords)    lines.push(`<meta name="keywords" content="${f.keywords}" />`)
    if (f.author)      lines.push(`<meta name="author" content="${f.author}" />`)
    if (f.canonical)   lines.push(`<link rel="canonical" href="${f.canonical}" />`)

    lines.push('')
    lines.push('<!-- Open Graph -->')
    lines.push(`<meta property="og:type" content="website" />`)
    if (f.ogTitle || f.title)      lines.push(`<meta property="og:title" content="${f.ogTitle || f.title}" />`)
    if (f.ogDesc || f.description) lines.push(`<meta property="og:description" content="${f.ogDesc || f.description}" />`)
    if (f.canonical)               lines.push(`<meta property="og:url" content="${f.canonical}" />`)
    if (f.ogSiteName)              lines.push(`<meta property="og:site_name" content="${f.ogSiteName}" />`)
    if (f.ogImage)                 lines.push(`<meta property="og:image" content="${f.ogImage}" />`)

    lines.push('')
    lines.push('<!-- Twitter / X -->')
    lines.push(`<meta name="twitter:card" content="${f.twitterCard}" />`)
    if (f.ogTitle || f.title)      lines.push(`<meta name="twitter:title" content="${f.ogTitle || f.title}" />`)
    if (f.ogDesc || f.description) lines.push(`<meta name="twitter:description" content="${f.ogDesc || f.description}" />`)
    if (f.ogImage)                 lines.push(`<meta name="twitter:image" content="${f.ogImage}" />`)
    if (f.twitterHandle)           lines.push(`<meta name="twitter:site" content="@${f.twitterHandle.replace('@', '')}" />`)

    return lines.join('\n')
  }

  const output = buildTags()

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Basic */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Basic SEO</p>
        <div className="flex flex-col gap-4">
          <Field label="Page Title">
            <input className={inputCls} placeholder="My Awesome Page — Brand Name" value={f.title} onChange={set('title')} />
            <CharBar value={f.title} max={60} />
          </Field>
          <Field label="Meta Description">
            <textarea className={`${inputCls} resize-none`} rows={3} placeholder="A compelling description of your page (under 160 characters)." value={f.description} onChange={set('description')} />
            <CharBar value={f.description} max={160} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Keywords (comma-separated)">
              <input className={inputCls} placeholder="seo, tools, meta tags" value={f.keywords} onChange={set('keywords')} />
            </Field>
            <Field label="Author">
              <input className={inputCls} placeholder="John Williams" value={f.author} onChange={set('author')} />
            </Field>
          </div>
          <Field label="Canonical URL">
            <input className={inputCls} placeholder="https://example.com/page" value={f.canonical} onChange={set('canonical')} />
          </Field>
        </div>
      </div>

      {/* Open Graph */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Open Graph (Social Sharing)</p>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="OG Title (defaults to Page Title)">
              <input className={inputCls} placeholder="Overrides page title on social" value={f.ogTitle} onChange={set('ogTitle')} />
            </Field>
            <Field label="Site Name">
              <input className={inputCls} placeholder="My Brand" value={f.ogSiteName} onChange={set('ogSiteName')} />
            </Field>
          </div>
          <Field label="OG Description (defaults to Meta Description)">
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Overrides description on social" value={f.ogDesc} onChange={set('ogDesc')} />
          </Field>
          <Field label="OG Image URL (1200×630 recommended)">
            <input className={inputCls} placeholder="https://example.com/og-image.jpg" value={f.ogImage} onChange={set('ogImage')} />
          </Field>
        </div>
      </div>

      {/* Twitter */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Twitter / X Card</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Twitter Handle">
            <input className={inputCls} placeholder="@yourbrand" value={f.twitterHandle} onChange={set('twitterHandle')} />
          </Field>
          <Field label="Card Type">
            <select className={inputCls} value={f.twitterCard} onChange={set('twitterCard')}>
              <option value="summary_large_image">Summary Large Image</option>
              <option value="summary">Summary</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)]">
        <div className="flex items-center justify-between border-b border-[var(--line-subtle)] px-4 py-3">
          <p className="text-xs text-[var(--ink-body)]">Generated HTML — paste into your <code className="text-[var(--accent)]">&lt;head&gt;</code></p>
          <button onClick={handleCopy} className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent)]">
            {copied ? '✓ Copied!' : 'Copy All'}
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-[var(--ink-body)] whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  )
}
