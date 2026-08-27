import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-32 text-center">
      <SEO
        title="Page Not Found"
        description="This page doesn't exist. Browse QuickKit's free online tools for developers, HR, finance, career, SEO, image, PDF and text."
        noindex
      />
      <p className="mb-4 text-7xl font-bold tracking-tight text-[var(--ink-faint)]">404</p>
      <h1 className="mb-3 text-2xl font-semibold text-[var(--ink)]">Page not found</h1>
      <p className="mb-8 text-sm text-[var(--ink-body)]">
        This page doesn't exist. The URL might be wrong, or the tool may have moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2 text-sm text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
      >
        ← Back to home
      </Link>
    </div>
  )
}
