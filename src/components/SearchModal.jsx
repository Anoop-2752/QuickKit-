import { useState, useEffect, useRef, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, getIcon } from '../lib/icons'
import { allTools, getCategoryBySlug } from '../data/tools'
import { getColors } from '../lib/colors'

function ToolIcon({ name, className }) {
  const Icon = getIcon(name)
  if (!Icon) return null
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} size={14} aria-hidden="true" />
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const titleId = useId()

  const trimmed = query.trim().toLowerCase()
  const results = trimmed.length > 1
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(trimmed) ||
          t.description.toLowerCase().includes(trimmed) ||
          t.category.toLowerCase().includes(trimmed)
      ).slice(0, 8)
    : []

  // Focus input when modal opens; reset query when reopened
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Return focus to whatever opened the dialog, so keyboard users are not
  // dropped back at the top of the document on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    return () => {
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open])

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes?.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function go(tool) {
    navigate(`/${tool.category}/${tool.slug}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]">
      {/* Backdrop — dismisses on click, but is not itself a control */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-2xl"
      >
        <h2 id={titleId} className="sr-only">Search tools</h2>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-3.5">
          <Search size={15} className="shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            aria-label="Search tools"
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
          <kbd className="hidden rounded border border-[#3a3a3a] bg-[#1e1e1e] px-1.5 py-0.5 text-xs text-zinc-600 sm:block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="max-h-72 overflow-y-auto py-1">
            {results.map((tool) => {
              const cat = getCategoryBySlug(tool.category)
              const colors = getColors(cat?.color)
              return (
                <li key={tool.id}>
                  <button
                    onClick={() => go(tool)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#1e1e1e]"
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}>
                      <ToolIcon name={tool.icon} className={colors.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200">{tool.name}</p>
                      <p className="truncate text-xs text-zinc-600">{tool.description}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${colors.badge}`}>
                      {cat?.name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {trimmed.length > 1 ? `${results.length} results` : ''}
        </p>

        {trimmed.length > 1 && results.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-zinc-600">
            No tools found for &quot;{query.trim()}&quot;
          </p>
        )}

        {trimmed.length <= 1 && (
          <p className="px-4 py-4 text-xs text-zinc-700">
            Type at least 2 characters to search {allTools.length} tools…
          </p>
        )}
      </div>
    </div>
  )
}
