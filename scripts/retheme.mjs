// One-shot codemod: replace hardcoded dark-theme colours across src/**/*.jsx
// with references to the design tokens in src/index.css.
//
//   node scripts/retheme.mjs --dry     # report only
//   node scripts/retheme.mjs           # apply
//
// This exists because the palette was hardcoded in ~2000 places across 74
// files. After this runs, the palette lives in one CSS block and this script
// has no further purpose — delete it once the redesign has settled.
import { readFileSync, writeFileSync } from 'node:fs'
import { globSync } from 'node:fs'

const dry = process.argv.includes('--dry')

// Order matters: longer, more specific patterns first so that (for example)
// #111111 is handled before #111.
const REPLACEMENTS = [
  // ── Surfaces (hex, usually inside Tailwind arbitrary values) ──────────────
  ['#0a0a0a', 'var(--page)'],
  ['#0f0f0f', 'var(--page)'],
  ['#0d0d0d', 'var(--surface-sunk)'],
  ['#111111', 'var(--surface)'],
  ['#111', 'var(--surface)'],
  ['#141414', 'var(--surface-alt)'],
  ['#1a1a1a', 'var(--surface-tint)'],

  // ── Borders ───────────────────────────────────────────────────────────────
  ['#1e1e1e', 'var(--line-subtle)'],
  ['#282828', 'var(--line-subtle)'],
  ['#2a2a2a', 'var(--line)'],
  ['#3a3a3a', 'var(--line-strong)'],

  // ── Text classes ──────────────────────────────────────────────────────────
  ['text-white', 'text-[var(--ink)]'],
  ['text-zinc-100', 'text-[var(--ink)]'],
  ['text-zinc-200', 'text-[var(--ink-strong)]'],
  ['text-zinc-300', 'text-[var(--ink-strong)]'],
  ['text-zinc-400', 'text-[var(--ink-body)]'],
  ['text-zinc-500', 'text-[var(--ink-body)]'],
  ['text-zinc-600', 'text-[var(--ink-muted)]'],
  ['text-zinc-700', 'text-[var(--ink-faint)]'],
  ['text-zinc-800', 'text-[var(--ink-faint)]'],
  ['placeholder:text-zinc-600', 'placeholder:text-[var(--ink-faint)]'],
  ['placeholder:text-zinc-700', 'placeholder:text-[var(--ink-faint)]'],

  // ── Neutral backgrounds expressed as zinc utilities ───────────────────────
  ['bg-zinc-800', 'bg-[var(--surface-tint)]'],
  ['bg-zinc-900', 'bg-[var(--surface-alt)]'],

  // ── Accent ────────────────────────────────────────────────────────────────
  ['text-green-300', 'text-[var(--accent)]'],
  ['text-green-400', 'text-[var(--accent)]'],
  ['text-green-500', 'text-[var(--accent)]'],
  ['bg-green-400', 'bg-[var(--accent-hover)]'],
  ['bg-green-500', 'bg-[var(--accent)]'],
  ['bg-green-600', 'bg-[var(--accent)]'],
  ['border-green-500', 'border-[var(--accent)]'],
  ['ring-green-500', 'ring-[var(--accent)]'],
  ['#22c55e', 'var(--accent)'],
  ['#4ade80', 'var(--accent)'],
  ['#86efac', 'var(--accent-hover)'],
]

// Tailwind opacity shorthand (bg-green-500/10) must keep its suffix, which the
// plain class replacements above would mangle — handle those first.
const OPACITY = [
  [/\b(bg|border|ring|text|from|to|shadow)-green-\d{3}\/(\d{1,3})\b/g,
    (_m, prop, op) => `${prop}-[color-mix(in_srgb,var(--accent)_${op}%,transparent)]`],
  [/\b(bg|border|ring|text)-zinc-\d{3}\/(\d{1,3})\b/g,
    (_m, prop, op) => `${prop}-[color-mix(in_srgb,var(--ink-muted)_${op}%,transparent)]`],
]

const files = globSync('src/**/*.jsx')
const transformed = []
let changedFiles = 0
let totalEdits = 0
const perFile = []

for (const file of files) {
  const before = readFileSync(file, 'utf8')
  let after = before

  for (const [re, fn] of OPACITY) after = after.replace(re, fn)
  for (const [from, to] of REPLACEMENTS) after = after.split(from).join(to)

  transformed.push([file, after])

  if (after !== before) {
    // Count edits crudely, for the report only.
    let edits = 0
    for (const [from] of REPLACEMENTS) {
      edits += before.split(from).length - 1
    }
    changedFiles++
    totalEdits += edits
    perFile.push([file, edits])
    if (!dry) writeFileSync(file, after, 'utf8')
  }
}

perFile.sort((a, b) => b[1] - a[1])
console.log(`${dry ? '[dry run] ' : ''}${changedFiles} files, ~${totalEdits} replacements`)
console.log('\nlargest:')
for (const [f, n] of perFile.slice(0, 8)) console.log(`  ${String(n).padStart(4)}  ${f}`)

// Anything left behind needs a human. Scan the TRANSFORMED text, so a dry run
// reports the residue the real run would leave rather than the original files.
const leftovers = []
for (const [file, text] of transformed) {
  for (const m of text.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\b(?:zinc|green|slate|gray|neutral)-\d{2,3}\b/g)) {
    leftovers.push(`${file}: ${m[0]}`)
  }
}
if (leftovers.length) {
  const counts = {}
  for (const l of leftovers) {
    const token = l.split(': ')[1]
    counts[token] = (counts[token] || 0) + 1
  }
  console.log('\nremaining hardcoded colours (review these):')
  for (const [token, n] of Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`  ${String(n).padStart(4)}  ${token}`)
  }
} else {
  console.log('\nno hardcoded colours left')
}
