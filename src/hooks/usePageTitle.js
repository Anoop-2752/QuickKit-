import { useEffect } from 'react'

const BASE = 'QuickKit — Developer Tools & Utilities'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — QuickKit` : BASE
    return () => { document.title = BASE }
  }, [title])
}
