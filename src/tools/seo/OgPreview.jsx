import { useState } from 'react'

const inputCls = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors'

const PLATFORMS = ['Facebook', 'Twitter / X', 'LinkedIn']

function hostname(url) {
  try { return new URL(url.startsWith('http') ? url : 'https://' + url).hostname } catch { return url }
}

function FacebookCard({ title, description, image, url }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white font-sans">
      {image
        ? <img src={image} alt="" className="aspect-[1.91/1] w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
        : <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">1200 × 630</div>
      }
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
        <p className="text-xs uppercase text-gray-500">{url ? hostname(url) : 'example.com'}</p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-gray-900 line-clamp-2">{title || 'Page Title'}</p>
        <p className="mt-0.5 text-xs leading-snug text-gray-500 line-clamp-2">{description || 'Page description will appear here.'}</p>
      </div>
    </div>
  )
}

function TwitterCard({ title, description, image, url }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white font-sans">
      {image
        ? <img src={image} alt="" className="aspect-[1.91/1] w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
        : <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">1200 × 630</div>
      }
      <div className="px-3 py-2">
        <p className="text-sm font-bold leading-snug text-gray-900 line-clamp-1">{title || 'Page Title'}</p>
        <p className="mt-0.5 text-xs leading-snug text-gray-500 line-clamp-2">{description || 'Page description will appear here.'}</p>
        <p className="mt-1 text-xs text-gray-400">{url ? hostname(url) : 'example.com'}</p>
      </div>
    </div>
  )
}

function LinkedInCard({ title, image, siteName, url }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white font-sans">
      {image
        ? <img src={image} alt="" className="aspect-[1.91/1] w-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
        : <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-gray-100 text-xs text-gray-400">1200 × 630</div>
      }
      <div className="px-4 py-3">
        <p className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">{title || 'Page Title'}</p>
        <p className="mt-0.5 text-xs text-gray-500">{siteName || (url ? hostname(url) : 'example.com')}</p>
      </div>
    </div>
  )
}

const CARDS = { 'Facebook': FacebookCard, 'Twitter / X': TwitterCard, 'LinkedIn': LinkedInCard }

export default function OgPreview() {
  const [f, setF] = useState({ title: '', description: '', image: '', siteName: '', url: '' })
  const [active, setActive] = useState('Facebook')

  function set(k) { return (e) => setF(p => ({ ...p, [k]: e.target.value })) }

  const Card = CARDS[active]

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Open Graph Fields</p>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--ink-body)]">Title</label>
              <input className={inputCls} placeholder="My Page Title" value={f.title} onChange={set('title')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--ink-body)]">Site Name</label>
              <input className={inputCls} placeholder="My Brand" value={f.siteName} onChange={set('siteName')} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Description</label>
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder="A short description for social sharing." value={f.description} onChange={set('description')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Image URL <span className="text-[var(--ink-muted)]">(1200×630 recommended)</span></label>
            <input className={inputCls} placeholder="https://example.com/og-image.jpg" value={f.image} onChange={set('image')} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Page URL</label>
            <input className={inputCls} placeholder="https://example.com/page" value={f.url} onChange={set('url')} />
          </div>
        </div>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
              active === p
                ? 'border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                : 'border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:border-[var(--line-strong)]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">{active} Preview</p>
        <div className="mx-auto max-w-sm">
          <Card title={f.title} description={f.description} image={f.image} siteName={f.siteName} url={f.url} />
        </div>
        <p className="mt-3 text-xs text-[var(--ink-muted)] text-center">Preview is approximate — actual rendering varies by platform.</p>
      </div>
    </div>
  )
}
