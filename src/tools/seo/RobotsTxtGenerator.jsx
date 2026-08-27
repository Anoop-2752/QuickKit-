import { useState } from 'react'

const PRESETS = {
  'Allow All':      { blocked: [], customRules: '', sitemap: '' },
  'Block All':      { blocked: ['*'], customRules: '', sitemap: '' },
  'Block AI Bots':  { blocked: ['GPTBot', 'CCBot', 'anthropic-ai', 'Claude-Web', 'Google-Extended', 'cohere-ai', 'Amazonbot'], customRules: '', sitemap: '' },
  'Custom':         null,
}

const BOTS = [
  { name: 'Googlebot',        desc: 'Google Search' },
  { name: 'Bingbot',          desc: 'Bing Search' },
  { name: 'Slurp',            desc: 'Yahoo Search' },
  { name: 'DuckDuckBot',      desc: 'DuckDuckGo' },
  { name: 'GPTBot',           desc: 'OpenAI GPT crawler' },
  { name: 'Claude-Web',       desc: 'Anthropic Claude' },
  { name: 'anthropic-ai',     desc: 'Anthropic AI' },
  { name: 'Google-Extended',  desc: 'Google AI training' },
  { name: 'CCBot',            desc: 'Common Crawl' },
  { name: 'cohere-ai',        desc: 'Cohere AI' },
  { name: 'Amazonbot',        desc: 'Amazon Alexa' },
  { name: 'FacebookBot',      desc: 'Facebook scraper' },
  { name: 'Twitterbot',       desc: 'Twitter card fetcher' },
  { name: 'LinkedInBot',      desc: 'LinkedIn preview' },
]

function buildRobots({ blocked, customRules, sitemapUrl }) {
  const lines = []

  // All-allow rule first
  const hasBlockAll = blocked.includes('*')
  if (hasBlockAll) {
    lines.push('User-agent: *')
    lines.push('Disallow: /')
  } else {
    lines.push('User-agent: *')
    lines.push('Allow: /')
  }

  // Individual bot blocks
  const specificBots = blocked.filter(b => b !== '*')
  if (specificBots.length > 0) {
    specificBots.forEach(bot => {
      lines.push('')
      lines.push(`User-agent: ${bot}`)
      lines.push('Disallow: /')
    })
  }

  // Custom rules
  if (customRules.trim()) {
    lines.push('')
    lines.push(customRules.trim())
  }

  // Sitemap
  if (sitemapUrl.trim()) {
    lines.push('')
    lines.push(`Sitemap: ${sitemapUrl.trim()}`)
  }

  return lines.join('\n')
}

export default function RobotsTxtGenerator() {
  const [preset, setPreset]       = useState('Allow All')
  const [blocked, setBlocked]     = useState([])
  const [customRules, setCustom]  = useState('')
  const [sitemapUrl, setSitemap]  = useState('')
  const [copied, setCopied]       = useState(false)

  function applyPreset(name) {
    setPreset(name)
    if (name !== 'Custom' && PRESETS[name]) {
      setBlocked(PRESETS[name].blocked)
      setCustom(PRESETS[name].customRules)
    }
  }

  function toggleBot(name) {
    setPreset('Custom')
    setBlocked(prev => prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name])
  }

  const output = buildRobots({ blocked, customRules, sitemapUrl })

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([output], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'robots.txt'
    a.click()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Presets */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className={`rounded-lg border py-2 text-sm transition-colors ${
                preset === name
                  ? 'border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                  : 'border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:border-[var(--line-strong)]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Bot checkboxes */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Block Specific Bots</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {BOTS.map(({ name, desc }) => (
            <label key={name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--line-subtle)] bg-[var(--surface-tint)] px-3 py-2 transition-colors hover:border-[var(--line)]">
              <input
                type="checkbox"
                checked={blocked.includes(name)}
                onChange={() => toggleBot(name)}
                className="accent-cyan-500"
              />
              <div>
                <p className="text-xs font-medium text-[var(--ink-strong)]">{name}</p>
                <p className="text-xs text-[var(--ink-muted)]">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom rules + sitemap */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Additional Options</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Sitemap URL</label>
            <input
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors"
              placeholder="https://example.com/sitemap.xml"
              value={sitemapUrl}
              onChange={(e) => setSitemap(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Custom Rules <span className="text-[var(--ink-muted)]">(add manually, one per line)</span></label>
            <textarea
              className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 font-mono text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors"
              rows={4}
              placeholder={"User-agent: *\nDisallow: /admin/\nDisallow: /private/"}
              value={customRules}
              onChange={(e) => { setCustom(e.target.value); setPreset('Custom') }}
            />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)]">
        <div className="flex items-center justify-between border-b border-[var(--line-subtle)] px-4 py-3">
          <p className="text-xs text-[var(--ink-body)]">robots.txt output</p>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent)]">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-1.5 text-xs text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]">
              Download
            </button>
          </div>
        </div>
        <pre className="p-4 font-mono text-sm leading-relaxed text-[var(--ink-strong)] whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  )
}
