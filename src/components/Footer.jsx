import { Link } from 'react-router-dom'
import { Wrench, Mail } from '../lib/icons'
import { categories } from '../data/tools'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--surface-tint)] bg-[var(--page)]">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

          {/* ── Brand ──────────────────────────────────────────────────────── */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] transition-all group-hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] group-hover:ring-[color-mix(in_srgb,var(--accent)_50%,transparent)]">
                <Wrench size={15} className="text-[var(--accent)]" />
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--ink)]">
                Quick<span className="text-[var(--accent)]">Kit</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-body)]">
              Every tool you need, one place. Free, no signup, runs in your browser.
            </p>
            <p className="mt-5 text-xs text-[var(--ink-faint)]">
              © {year} QuickKit. All rights reserved.
            </p>
          </div>

          {/* ── Tool Labs ──────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--ink-body)]">Tool Labs</p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/${cat.slug}`}
                    className="text-sm text-[var(--ink-body)] transition-colors hover:text-[var(--accent)]"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ──────────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--ink-body)]">Legal</p>
            <ul className="space-y-3">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms',   label: 'Terms of Service' },
                { to: '/cookies', label: 'Cookie Policy' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-[var(--ink-body)] transition-colors hover:text-[var(--accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Open ───────────────────────────────────────────────────────── */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--ink-body)]">Contact</p>
            <a
              href="mailto:helloquickkit@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-[var(--ink-body)] transition-colors hover:text-[var(--accent)]"
            >
              <Mail size={14} />
              helloquickkit@gmail.com
            </a>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-hover)]" />
                Zero Tracking
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}
