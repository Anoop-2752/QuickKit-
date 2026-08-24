import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False during prerender and during the hydration pass, true afterwards.
 *
 * Lets a component render identical markup on the server and on the client's
 * first pass — required for hydration — then swap in browser-only content on
 * the next render.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
