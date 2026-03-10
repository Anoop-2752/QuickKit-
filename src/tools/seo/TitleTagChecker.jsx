import { useState } from 'react'

// Approximate pixel widths — Helvetica 20px for title, 14px for desc
// Google title cutoff ~580px, desc ~920px
const TITLE_MAX_PX   = 580
const DESC_MAX_PX    = 920
const CHAR_PX_TITLE  = 7.8   // avg px per char at ~20px font
const CHAR_PX_DESC   = 6.2   // avg px per char at ~14px font

function pixelWidth(str, pxPerChar) {
  return str.length * pxPerChar
}

function StatusBadge({ px, max, label }) {
  const pct = Math.min((px / max) * 100, 100)
  const over = px > max
  const warn = px > max * 0.88

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className={over ? 'text-red-400' : warn ? 'text-amber-400' : 'text-cyan-400'}>
          ~{Math.round(px)}px / {max}px
          {over ? ' — Too long' : warn ? ' — Close to limit' : ' — Good'}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#2a2a2a]">
        <div
          className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-cyan-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function TitleTagChecker() {
  const [title, setTitle] = useState('')
  const [desc,  setDesc]  = useState('')
  const [url,   setUrl]   = useState('https://example.com/page')

  const titlePx = pixelWidth(title, CHAR_PX_TITLE)
  const descPx  = pixelWidth(desc,  CHAR_PX_DESC)
  const displayUrl = url || 'https://example.com/page'

  // Trim title/desc for display like Google does
  function trimToPixels(str, pxPerChar, maxPx) {
    const maxChars = Math.floor(maxPx / pxPerChar)
    if (str.length <= maxChars) return str
    return str.slice(0, maxChars - 1) + '…'
  }

  const displayTitle = title ? trimToPixels(title, CHAR_PX_TITLE, TITLE_MAX_PX) : 'Page Title — Your Brand'
  const displayDesc  = desc  ? trimToPixels(desc,  CHAR_PX_DESC,  DESC_MAX_PX)  : 'Your meta description will appear here. Write a compelling summary that makes users want to click.'

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Page Details</p>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Page Title</label>
            <input
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="My Awesome Page — Brand Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <StatusBadge px={titlePx} max={TITLE_MAX_PX} label="Title pixel width" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Meta Description</label>
            <textarea
              className="w-full resize-none rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              rows={3}
              placeholder="A compelling description that makes users want to click through."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <StatusBadge px={descPx} max={DESC_MAX_PX} label="Description pixel width" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Page URL (for preview)</label>
            <input
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-cyan-500/50 transition-colors"
              placeholder="https://example.com/your-page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SERP Preview */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Google Search Preview</p>
        <div className="rounded-xl border border-[#1e1e1e] bg-white p-5">
          {/* Favicon + URL row */}
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800 leading-none">{new URL(displayUrl.startsWith('http') ? displayUrl : 'https://' + displayUrl).hostname}</p>
              <p className="mt-0.5 text-xs text-gray-500 leading-none truncate max-w-sm">{displayUrl}</p>
            </div>
          </div>
          {/* Title */}
          <p className="mt-1 text-xl font-medium leading-snug text-blue-700 hover:underline cursor-pointer" style={{ fontFamily: 'arial, sans-serif' }}>
            {displayTitle}
          </p>
          {/* Description */}
          <p className="mt-1 text-sm leading-snug text-gray-600" style={{ fontFamily: 'arial, sans-serif' }}>
            {displayDesc}
          </p>
        </div>
        <p className="mt-2 text-xs text-zinc-600">Preview is approximate — actual rendering varies by browser and query.</p>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">SEO Tips</p>
        <ul className="flex flex-col gap-2">
          {[
            ['Title', 'Keep under 580px (~60 chars). Put the primary keyword near the start.'],
            ['Description', 'Keep under 920px (~160 chars). Include a call-to-action or benefit.'],
            ['Uniqueness', 'Every page should have a unique title and description.'],
            ['Brand', 'Append your brand name at the end of the title: "Page — Brand".'],
          ].map(([k, v]) => (
            <li key={k} className="flex gap-2 text-xs text-zinc-500">
              <span className="font-semibold text-cyan-400 flex-shrink-0">{k}:</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
