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
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-3.5">
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/30 transition-all group-hover:bg-green-500/20 group-hover:ring-green-500/50">
                <Wrench size={17} className="text-green-400" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Quick<span className="text-green-400">Kit</span>
              </span>
            </Link>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-green-500/40 hover:text-green-400"
            >
              <Search size={12} />
              <span className="hidden sm:block">Search</span>
              <kbd className="hidden rounded border border-[#3a3a3a] bg-[#111] px-1 py-0.5 text-xs text-zinc-700 sm:block">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
