// Second retheme pass: the accent hues the first pass didn't touch.
//
// Two treatments, because the hues mean different things:
//
//   DECORATIVE — indigo, blue, cyan, violet, purple, teal, pink, lime. These
//   were per-category accents or arbitrary highlights. They collapse to the
//   single brand accent.
//
//   MEANINGFUL — red, rose, amber, yellow, orange, emerald, green. These carry
//   information: ATS score bands, filler-word severity, required-field marks,
//   verb categories. The hue stays; only the shade moves, because -300/-400 is
//   tuned for a dark background and washes out on cream.
//
//   node scripts/retheme2.mjs --dry
import { readFileSync, writeFileSync, globSync } from 'node:fs'

const dry = process.argv.includes('--dry')

const DECORATIVE = ['indigo', 'blue', 'cyan', 'violet', 'purple', 'teal', 'pink', 'lime', 'sky', 'fuchsia']
const MEANINGFUL = ['red', 'rose', 'amber', 'yellow', 'orange', 'emerald']

// Light-theme shade for a dark-theme shade, per property.
const TEXT_SHADE = '700'
const SOLID_SHADE = '600'
const BG_FOR_OPACITY = (op) => (Number(op) >= 20 ? '100' : '50')
const BORDER_FOR_OPACITY = (op) => (Number(op) >= 50 ? '400' : Number(op) >= 30 ? '300' : '200')

const files = globSync('src/**/*.jsx')
let changed = 0
const transformed = []

for (const file of files) {
  const before = readFileSync(file, 'utf8')
  let s = before

  // ── Decorative hues → the brand accent ────────────────────────────────────
  const dec = DECORATIVE.join('|')
  s = s.replace(new RegExp(`\\b(bg|border|ring|text|from|to|fill|stroke)-(?:${dec})-\\d{2,3}\\/(\\d{1,3})\\b`, 'g'),
    (_m, prop, op) => `${prop}-[color-mix(in_srgb,var(--accent)_${op}%,transparent)]`)
  s = s.replace(new RegExp(`\\btext-(?:${dec})-\\d{2,3}\\b`, 'g'), 'text-[var(--accent)]')
  s = s.replace(new RegExp(`\\bbg-(?:${dec})-\\d{2,3}\\b`, 'g'), 'bg-[var(--accent)]')
  s = s.replace(new RegExp(`\\b(border|ring|from|to|fill|stroke)-(?:${dec})-\\d{2,3}\\b`, 'g'),
    (_m, prop) => `${prop}-[var(--accent)]`)

  // ── Meaningful hues → same hue, light-theme shade ─────────────────────────
  for (const hue of MEANINGFUL) {
    s = s.replace(new RegExp(`\\bbg-${hue}-\\d{2,3}\\/(\\d{1,3})\\b`, 'g'),
      (_m, op) => `bg-${hue}-${BG_FOR_OPACITY(op)}`)
    s = s.replace(new RegExp(`\\bborder-${hue}-\\d{2,3}\\/(\\d{1,3})\\b`, 'g'),
      (_m, op) => `border-${hue}-${BORDER_FOR_OPACITY(op)}`)
    s = s.replace(new RegExp(`\\b(text|ring|from|to|fill|stroke)-${hue}-\\d{2,3}\\/(\\d{1,3})\\b`, 'g'),
      (_m, prop) => `${prop}-${hue}-${TEXT_SHADE}`)
    s = s.replace(new RegExp(`\\btext-${hue}-\\d{2,3}\\b`, 'g'), `text-${hue}-${TEXT_SHADE}`)
    s = s.replace(new RegExp(`\\bbg-${hue}-\\d{2,3}\\b`, 'g'), `bg-${hue}-${SOLID_SHADE}`)
    s = s.replace(new RegExp(`\\b(border|ring)-${hue}-\\d{2,3}\\b`, 'g'),
      (_m, prop) => `${prop}-${hue}-300`)
  }

  transformed.push([file, s])
  if (s !== before) {
    changed++
    if (!dry) writeFileSync(file, s, 'utf8')
  }
}

console.log(`${dry ? '[dry run] ' : ''}${changed} files updated`)

const left = {}
for (const [, text] of transformed) {
  for (const m of text.matchAll(/\b(?:bg|text|border|ring|from|to|fill|stroke)-(indigo|blue|cyan|violet|purple|teal|pink|lime|sky|fuchsia|slate|stone|neutral|zinc|green)-\d{2,3}\b/g)) {
    left[m[1]] = (left[m[1]] || 0) + 1
  }
}
const entries = Object.entries(left).sort((a, b) => b[1] - a[1])
console.log(entries.length ? '\nstill decorative-hued (review): ' + entries.map(([h, n]) => `${h}:${n}`).join(', ')
                           : '\nno decorative hues left')
