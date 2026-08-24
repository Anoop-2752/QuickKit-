import { useCallback, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'quickkit_cookie_consent'

const listeners = new Set()
function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}
function emit() {
  for (const onChange of listeners) onChange()
}

// Fallback when localStorage is unavailable (private windows, blocked site
// data) so a choice still applies for the current session.
let sessionChoice = null

function read() {
  if (sessionChoice) return sessionChoice
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getSnapshot() {
  return read() ?? 'pending'
}

// Prerendered HTML must never contain the banner — whether this visitor has
// already chosen is only knowable in their browser.
function getServerSnapshot() {
  return 'accepted'
}

// Consent Mode v2 defaults to denied in index.html; this promotes or confirms
// that once the visitor decides.
function updateConsent(granted) {
  if (typeof window.gtag !== 'function') return
  const value = granted ? 'granted' : 'denied'
  window.gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  })
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const choose = useCallback((choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      sessionChoice = choice
    }
    updateConsent(choice === 'accepted')
    emit()
  }, [])

  if (consent !== 'pending') return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-zinc-400">
          We use cookies for ads and analytics. You can accept or decline — see our{' '}
          <Link
            to="/cookies"
            className="text-green-400 underline-offset-2 hover:underline"
          >
            cookie policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => choose('rejected')}
            className="rounded-lg border border-[#3a3a3a] px-4 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:border-[#4a4a4a] hover:text-zinc-200"
          >
            Decline
          </button>
          <button
            onClick={() => choose('accepted')}
            className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
