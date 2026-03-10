import { useState } from 'react'

const ATS_LIMITS = {
  bullet: { chars: 200, label: '200 chars recommended per bullet' },
  total:  { words: 700, label: '500–700 words for most resumes' },
}

function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0
}

function BulletRow({ bullet, index }) {
  const chars = bullet.length
  const words = countWords(bullet)
  const isLong = chars > ATS_LIMITS.bullet.chars

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${
      isLong ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#1e1e1e] bg-[#0d0d0d]'
    }`}>
      <span className="mt-0.5 min-w-[1.2rem] text-xs font-mono text-zinc-700">{index + 1}</span>
      <span className="flex-1 text-zinc-300 break-words">{bullet}</span>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className={`text-xs font-medium ${isLong ? 'text-amber-400' : 'text-zinc-500'}`}>
          {chars}c
        </span>
        <span className="text-xs text-zinc-700">{words}w</span>
      </div>
    </div>
  )
}

const SAMPLE = `Results-driven Software Engineer with 4+ years of experience building scalable web applications.
Developed and maintained 3 React-based dashboards used by 10,000+ daily active users.
Led a team of 4 engineers to deliver a payment integration project 2 weeks ahead of schedule.
Reduced API response time by 40% through query optimization and caching strategies.
Collaborated with product and design teams to implement 15+ new features per quarter.
Built automated CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.
Mentored 2 junior developers through code reviews and pair programming sessions.`

export default function ResumeCharacterCounter() {
  const [input, setInput] = useState('')

  const bullets = input
    .split('\n')
    .map((l) => l.replace(/^[\s•\-*>]+/, '').trim())
    .filter((l) => l.length > 0)

  const totalWords  = countWords(input)
  const totalChars  = input.replace(/\s/g, '').length
  const longBullets = bullets.filter((b) => b.length > ATS_LIMITS.bullet.chars).length

  const wordStatus =
    totalWords === 0 ? 'empty'
    : totalWords <= 700 ? 'good'
    : 'long'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
          Paste your resume bullets (one per line). Long bullets get flagged — ATS systems and recruiters prefer concise entries under 200 characters.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => { setInput(SAMPLE) }}
            className="text-xs text-zinc-600 transition-colors hover:text-indigo-400"
          >
            Load sample
          </button>
          <button
            onClick={() => setInput('')}
            className="text-xs text-zinc-600 transition-colors hover:text-red-400"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Words',   value: totalWords, sub: ATS_LIMITS.total.label, warn: wordStatus === 'long' },
          { label: 'Total Chars',   value: totalChars, sub: 'no spaces' },
          { label: 'Bullets',       value: bullets.length, sub: 'lines detected' },
          { label: 'Long Bullets',  value: longBullets, sub: `>${ATS_LIMITS.bullet.chars} chars`, warn: longBullets > 0 },
        ].map(({ label, value, sub, warn }) => (
          <div key={label} className={`rounded-xl border p-3 ${warn && value > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
            <div className={`text-2xl font-bold ${warn && value > 0 ? 'text-amber-400' : 'text-white'}`}>
              {value.toLocaleString()}
            </div>
            <div className="mt-0.5 text-xs font-medium text-zinc-400">{label}</div>
            <div className="text-xs text-zinc-700">{sub}</div>
          </div>
        ))}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Paste resume bullets here, one per line:\n\n• Developed React dashboards used by 10,000+ users\n• Reduced API response time by 40% through caching\n• Led team of 4 engineers to deliver project ahead of schedule`}
        spellCheck={false}
        className="h-52 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
      />

      {/* Per-bullet breakdown */}
      {bullets.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              Per-Bullet Breakdown
            </span>
            <div className="h-px flex-1 bg-[#1e1e1e]" />
            {longBullets > 0 && (
              <span className="text-xs text-amber-400">{longBullets} too long</span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
            {bullets.map((b, i) => (
              <BulletRow key={i} bullet={b} index={i} />
            ))}
          </div>
          <p className="text-xs text-zinc-700 mt-1">
            Amber = over {ATS_LIMITS.bullet.chars} characters. Try to trim these for better ATS readability.
          </p>
        </div>
      )}
    </div>
  )
}
