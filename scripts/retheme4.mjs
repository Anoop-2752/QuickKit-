// Fourth retheme pass: rescue text that became invisible.
//
// The earlier passes mapped foregrounds and backgrounds independently, so a
// selected-state control that used to be "tinted background + coloured text"
// (bg-amber-500 + text-amber-400) collapsed to accent-on-accent — a solid green
// block with an unreadable label. Wherever a single class list sets both the
// accent background and accent text, the text becomes the on-accent colour.
import { readFileSync, writeFileSync, globSync } from 'node:fs'

const dry = process.argv.includes('--dry')

// Match a single-line quoted class list — className="…" or one branch of a
// ternary — and repair it as a unit. Newlines are excluded deliberately: a
// multi-line template literal can hold several unrelated class lists plus
// ordinary code, and repairing those together would rewrite the wrong things.
const QUOTED = /(["'])([^"'\n]*?)\1/g

const SOLID_BG = /\bbg-\[var\(--accent(?:-hover)?\)\]/
const ACCENT_TEXT = /\btext-\[var\(--accent\)\]/g

let files = 0
let fixes = 0
const examples = []

for (const file of globSync('src/**/*.jsx')) {
  const before = readFileSync(file, 'utf8')

  const after = before.replace(QUOTED, (whole, quote, body) => {
    if (!SOLID_BG.test(body) || !ACCENT_TEXT.test(body)) return whole
    const repaired = body.replace(ACCENT_TEXT, 'text-[var(--accent-on)]')
    if (repaired === body) return whole
    fixes++
    if (examples.length < 6) examples.push(`${file}: …${repaired.slice(0, 90)}…`)
    return quote + repaired + quote
  })

  if (after !== before) {
    files++
    if (!dry) writeFileSync(file, after, 'utf8')
  }
}

console.log(`${dry ? '[dry run] ' : ''}${fixes} unreadable accent-on-accent labels fixed across ${files} files`)
for (const e of examples) console.log('   ' + e)
