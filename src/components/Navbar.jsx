import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Search } from '../lib/icons'
import SearchModal from './SearchModal'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)

  // Ctrl+K / Cmd+K to open search
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--surface-tint)] bg-[var(--page)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between py-3.5">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition-all group-hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] group-hover:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)]">
                <Wrench size={17} className="text-[var(--accent)]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[var(--ink)]">
                Quick<span className="text-[var(--accent)]">Kit</span>
              </span>
            </Link>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-alt)] px-3 py-1.5 text-xs text-[var(--ink-body)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] hover:text-[var(--accent)]"
            >
              <Search size={12} aria-hidden="true" />
              <span className="hidden sm:block">Search</span>
              <kbd className="hidden rounded border border-[var(--line-strong)] bg-[var(--surface)] px-1 py-0.5 text-xs text-[var(--ink-faint)] sm:block">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
