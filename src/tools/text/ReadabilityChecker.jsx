import { useState, useMemo } from 'react'

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  // Remove silent e at end
  const cleaned = w.replace(/e$/, '')
  // Count vowel groups
  const matches = cleaned.match(/[aeiou]+/g)
  return Math.max(1, matches ? matches.length : 1)
}

function analyzeText(text) {
  if (!text.trim()) return null

  // Paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const paragraphCount = Math.max(1, paragraphs.length)

  // Sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const sentenceCount = Math.max(1, sentences.length)

  // Words
  const words = text.match(/\b[a-zA-Z']+\b/g) || []
  const wordCount = words.length
  if (wordCount === 0) return null

  // Characters (letters only, no spaces)
  const charCount = text.replace(/[^a-zA-Z]/g, '').length

  // Syllables
  let totalSyllables = 0
  let complexWords = 0
  words.forEach(word => {
    const s = countSyllables(word)
    totalSyllables += s
    if (s >= 3) complexWords++
  })

  const avgWordsPerSentence = wordCount / sentenceCount
  const syllablesPerWord = totalSyllables / wordCount
  const charsPerWord = charCount / wordCount

  // Flesch Reading Ease
  const fleschEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * syllablesPerWord

  // Flesch-Kincaid Grade Level
  const fkGrade = 0.39 * avgWordsPerSentence + 11.8 * syllablesPerWord - 15.59

  // Gunning Fog Index
  const fogIndex = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount))

  // Automated Readability Index
  const ari = 4.71 * charsPerWord + 0.5 * avgWordsPerSentence - 21.43

  // Reading time at 200 wpm
  const readingMinutes = wordCount / 200
  const readingTime = readingMinutes < 1
    ? `${Math.ceil(readingMinutes * 60)} sec`
    : `${Math.round(readingMinutes)} min`

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
    readingTime,
    fleschEase: Math.max(0, Math.min(100, fleschEase)),
    fkGrade: Math.max(0, fkGrade),
    fogIndex: Math.max(0, fogIndex),
    ari: Math.max(0, ari),
  }
}

function getFleschLabel(score) {
  if (score >= 90) return { label: 'Very Easy', grade: '5th grade', color: 'text-emerald-700', bg: 'bg-emerald-600 border-emerald-300' }
  if (score >= 70) return { label: 'Easy', grade: '6th grade', color: 'text-[var(--accent)]', bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' }
  if (score >= 60) return { label: 'Standard', grade: '7th–8th grade', color: 'text-[var(--accent)]', bg: 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] border-[color-mix(in_srgb,var(--accent)_20%,transparent)]' }
  if (score >= 50) return { label: 'Fairly Difficult', grade: 'High school', color: 'text-yellow-700', bg: 'bg-yellow-600 border-yellow-300' }
  if (score >= 30) return { label: 'Difficult', grade: 'College', color: 'text-orange-700', bg: 'bg-orange-600 border-orange-300' }
  return { label: 'Very Confusing', grade: 'Professional', color: 'text-red-700', bg: 'bg-red-600 border-red-300' }
}

function getGradeColor(grade) {
  if (grade <= 6) return 'text-emerald-700'
  if (grade <= 8) return 'text-[var(--accent)]'
  if (grade <= 10) return 'text-yellow-700'
  if (grade <= 12) return 'text-orange-700'
  return 'text-red-700'
}

function ScoreCard({ title, score, subtitle, color, bg, description }) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color}`}>{typeof score === 'number' ? score.toFixed(1) : score}</span>
        {subtitle && <span className="text-xs text-[var(--ink-body)]">{subtitle}</span>}
      </div>
      {description && <p className="mt-1.5 text-xs text-[var(--ink-body)]">{description}</p>}
    </div>
  )
}

export default function ReadabilityChecker() {
  const [text, setText] = useState('')

  const result = useMemo(() => analyzeText(text), [text])

  const flesch = result ? getFleschLabel(result.fleschEase) : null

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
        <label className="mb-2 block text-xs text-[var(--ink-body)]">Paste your text below</label>
        <textarea
          className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] p-3 text-sm leading-relaxed text-[var(--ink-strong)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors"
          rows={10}
          placeholder="Paste an article, essay, email, or any text here to analyse its readability…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {result && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: 'Words', value: result.wordCount },
              { label: 'Sentences', value: result.sentenceCount },
              { label: 'Paragraphs', value: result.paragraphCount },
              { label: 'Avg Words/Sentence', value: result.avgWordsPerSentence },
              { label: 'Reading Time', value: result.readingTime, wide: true },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] py-4 px-2 text-center">
                <span className="text-2xl font-bold text-[var(--ink)]">{value}</span>
                <span className="mt-1 text-xs text-[var(--ink-body)]">{label}</span>
              </div>
            ))}
          </div>

          {/* Flesch Reading Ease — featured */}
          <div className={`rounded-xl border p-5 ${flesch.bg}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--ink-body)]">Flesch Reading Ease</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-bold ${flesch.color}`}>{result.fleschEase.toFixed(1)}</span>
                  <div>
                    <p className={`text-lg font-semibold ${flesch.color}`}>{flesch.label}</p>
                    <p className="text-xs text-[var(--ink-body)]">{flesch.grade}</p>
                  </div>
                </div>
              </div>
              <div className="text-xs text-[var(--ink-body)] max-w-xs">
                Scale: 0 (hardest) → 100 (easiest). Score of 60+ is considered comfortable for most readers.
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.fleschEase >= 70 ? 'bg-[var(--accent)]' :
                  result.fleschEase >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${Math.max(2, result.fleschEase)}%` }}
              />
            </div>
          </div>

          {/* Other scores */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScoreCard
              title="Flesch-Kincaid Grade Level"
              score={result.fkGrade}
              subtitle="grade"
              color={getGradeColor(result.fkGrade)}
              bg="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4"
              description={`Equivalent to US grade ${result.fkGrade.toFixed(1)} reading level`}
            />
            <ScoreCard
              title="Gunning Fog Index"
              score={result.fogIndex}
              subtitle="grade"
              color={getGradeColor(result.fogIndex)}
              bg="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4"
              description={`${result.fogIndex <= 8 ? 'Easy to read' : result.fogIndex <= 12 ? 'Acceptable' : 'Consider simplifying'}`}
            />
            <ScoreCard
              title="Automated Readability Index"
              score={result.ari}
              subtitle="grade"
              color={getGradeColor(result.ari)}
              bg="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4"
              description={`${result.ari <= 6 ? 'Elementary level' : result.ari <= 12 ? 'High school level' : 'College / professional'}`}
            />
          </div>

          {/* Score interpretation */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">Flesch Reading Ease Scale</p>
            <div className="flex flex-col gap-1.5">
              {[
                { range: '90–100', label: 'Very Easy', grade: '5th grade', color: 'text-emerald-700' },
                { range: '70–90', label: 'Easy', grade: '6th grade', color: 'text-[var(--accent)]' },
                { range: '60–70', label: 'Standard', grade: '7th–8th grade', color: 'text-[var(--accent)]' },
                { range: '50–60', label: 'Fairly Difficult', grade: 'High school', color: 'text-yellow-700' },
                { range: '30–50', label: 'Difficult', grade: 'College', color: 'text-orange-700' },
                { range: '0–30', label: 'Very Confusing', grade: 'Professional', color: 'text-red-700' },
              ].map(({ range, label, grade, color }) => (
                <div
                  key={range}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    result.fleschEase >= parseInt(range) && result.fleschEase < (parseInt(range.split('–')[1]) + 1)
                      ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] border border-[color-mix(in_srgb,var(--accent)_20%,transparent)]'
                      : ''
                  }`}
                >
                  <span className="w-14 text-xs font-mono text-[var(--ink-muted)]">{range}</span>
                  <span className={`w-32 font-medium ${color}`}>{label}</span>
                  <span className="text-xs text-[var(--ink-body)]">{grade}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
