// Third retheme pass: warm hues that were decoration, not meaning.
//
// amber/orange/yellow served two different jobs in this codebase. In score and
// severity tools they are the middle band of a traffic light and must keep
// their hue. Everywhere else — finance, PDF, SEO, most HR tools — they were
// simply that category's old accent colour, and should become the brand accent.
//
// A file that uses warm AND red/rose AND emerald together is a traffic light;
// anything else is decoration.
import { readFileSync, writeFileSync, globSync } from 'node:fs'

const dry = process.argv.includes('--dry')

const warm = /\b(?:bg|text|border|ring|from|to)-(?:amber|orange|yellow)-/
const danger = /\b(?:bg|text|border|ring|from|to)-(?:red|rose)-/
const success = /\b(?:bg|text|border|ring|from|to)-emerald-/

let files = 0
let edits = 0
const kept = []

for (const file of globSync('src/**/*.jsx')) {
  const before = readFileSync(file, 'utf8')
  if (!warm.test(before)) continue

  if (danger.test(before) && success.test(before)) {
    kept.push(file)
    continue
  }

  let s = before
  s = s.replace(/\btext-(?:amber|orange|yellow)-\d{2,3}\b/g, 'text-[var(--accent)]')
  s = s.replace(/\bbg-(?:amber|orange|yellow)-(?:50|100)\b/g, 'bg-[var(--accent-soft)]')
  s = s.replace(/\bbg-(?:amber|orange|yellow)-\d{2,3}\b/g, 'bg-[var(--accent)]')
  s = s.replace(/\b(border|ring|from|to)-(?:amber|orange|yellow)-\d{2,3}\b/g, (_m, p) => `${p}-[var(--accent)]`)

  if (s !== before) {
    edits += (before.match(/(?:amber|orange|yellow)-\d{2,3}/g) || []).length
    files++
    if (!dry) writeFileSync(file, s, 'utf8')
  }
}

console.log(`${dry ? '[dry run] ' : ''}${files} files, ${edits} warm-hue classes mapped to the accent`)
console.log(`${kept.length} traffic-light files left alone:`)
for (const f of kept) console.log('   ' + f)
