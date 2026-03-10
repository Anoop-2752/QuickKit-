import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFoundPage() {
  const navigate = useNavigate()
  usePageTitle('Page Not Found')

  return (
    <div className="mx-auto max-w-6xl px-6 py-32 text-center">
      <p className="mb-4 text-7xl font-bold tracking-tight text-zinc-800">404</p>
      <h1 className="mb-3 text-2xl font-semibold text-white">Page not found</h1>
      <p className="mb-8 text-sm text-zinc-500">
        This page doesn't exist. The URL might be wrong, or the tool may have moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white"
      >
        ← Back to home
      </button>
    </div>
  )
}
