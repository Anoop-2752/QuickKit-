import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'quickkit_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-zinc-400">
          We use cookies for ads and analytics. By using QuickKit you accept our{' '}
          <Link
            to="/cookies"
            className="text-green-400 underline-offset-2 hover:underline"
          >
            cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/cookies"
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Learn more
          </Link>
          <button
            onClick={accept}
            className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
