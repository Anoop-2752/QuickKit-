import { Link } from 'react-router-dom'
import { Wrench, Mail } from '../lib/icons'
import { categories } from '../data/tools'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

          {/* ── Brand ──────────────────────────────────────────────────────── */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10 ring-1 ring-green-500/30 transition-all group-hover:bg-green-500/20 group-hover:ring-green-500/50">
                <Wrench size={15} className="text-green-400" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Quick<span className="text-green-400">Kit</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Every tool you need, one place. Free, no signup, runs in your browser.
            </p>
            <p className="mt-5 text-xs text-zinc-700">
              © {year} QuickKit. All rights reserved.
            </p>
          </div>

          {/* ── Tool Labs ──────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Tool Labs</p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/${cat.slug}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-green-400"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ──────────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Legal</p>
            <ul className="space-y-3">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms',   label: 'Terms of Service' },
                { to: '/cookies', label: 'Cookie Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-zinc-500 transition-colors hover:text-green-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Open ───────────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Contact</p>
            <a
              href="mailto:helloquickkit@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-green-400"
            >
              <Mail size={14} />
              helloquickkit@gmail.com
            </a>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/5 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Zero Tracking
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}
