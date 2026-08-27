export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-indigo-500" />
          <p className="text-xs text-[var(--ink-muted)]">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--line)] border-t-indigo-500" />
        <p className="text-xs text-[var(--ink-muted)]">Loading…</p>
      </div>
    </div>
  )
}
