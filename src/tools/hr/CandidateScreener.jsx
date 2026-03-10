import { useState, useRef } from 'react'
import { removeStopwords, eng } from 'stopword'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

// ── Keyword extraction (shared logic) ────────────────────────────────────────

const JOB_FILLER = new Set([
  'candidate', 'candidates', 'applicant', 'applicants', 'position', 'positions',
  'company', 'looking', 'seeking', 'hiring', 'join', 'help', 'ensure', 'support',
  'opportunity', 'responsibilities', 'requirements', 'qualifications', 'minimum',
  'preferred', 'bonus', 'year', 'years', 'plus', 'please', 'note', 'role', 'roles',
  'ideal', 'ideally', 'ability', 'strong', 'knowledge', 'experience', 'familiarity',
  'understanding', 'excellent', 'demonstrated', 'proven', 'background', 'work',
  'working', 'skills', 'skill', 'include', 'including', 'responsible', 'required',
  'require', 'collaborate', 'fast', 'good', 'great', 'best', 'effective', 'efficient',
  'passion', 'passionate', 'motivated', 'drive', 'driven', 'based', 'across',
  'within', 'toward', 'various', 'related', 'relevant',
])

const TECH_NORMALIZE = [
  [/\.net\b/gi,        'dotnet'],
  [/c\+\+/gi,          'cplusplus'],
  [/c#/gi,             'csharp'],
  [/node\.js/gi,       'nodejs'],
  [/vue\.js/gi,        'vuejs'],
  [/react\.js/gi,      'reactjs'],
  [/next\.js/gi,       'nextjs'],
  [/express\.js/gi,    'expressjs'],
  [/nuxt\.js/gi,       'nuxtjs'],
  [/\.js\b/gi,         'js'],
  [/ci\/cd/gi,         'cicd'],
  [/rest\s*api/gi,     'restapi'],
]

function normalize(text) {
  let out = text
  for (const [pattern, replacement] of TECH_NORMALIZE) {
    out = out.replace(pattern, ` ${replacement} `)
  }
  return out
}

function detectTechTerms(text) {
  const terms = new Set()
  for (const [m] of text.matchAll(/\b([A-Z][A-Z0-9#+]{1,})\b/g)) terms.add(m.toLowerCase())
  for (const [m] of text.matchAll(/\b([A-Z][a-z]+(?:[A-Z][a-z0-9]*)+)\b/g)) terms.add(m.toLowerCase())
  for (const sentence of text.split(/[.\n!?]/)) {
    const words = sentence.trim().split(/\s+/)
    for (let i = 1; i < words.length; i++) {
      const clean = words[i].replace(/[^a-zA-Z0-9]/g, '')
      if (clean.length >= 3 && /^[A-Z]/.test(clean)) terms.add(clean.toLowerCase())
    }
  }
  return terms
}

function stem(word) {
  return word
    .replace(/ment$/, '').replace(/tion$/, '').replace(/ing$/, '')
    .replace(/ness$/, '').replace(/ity$/, '').replace(/ies$/, 'y')
    .replace(/ed$/, '').replace(/er$/, '').replace(/s$/, '')
}

function tokenize(text) {
  return normalize(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 2)
}

function extractKeywords(text) {
  const techTerms = detectTechTerms(text)
  const tokens  = tokenize(text)
  const cleaned = removeStopwords(tokens, eng).filter(w => !JOB_FILLER.has(w))
  const freq = {}
  for (const w of cleaned) freq[w] = (freq[w] || 0) + 1
  const keywords = {}
  for (const [word, count] of Object.entries(freq)) {
    if (techTerms.has(word) || count >= 2) keywords[word] = count
  }
  return keywords
}

function isMatched(jdWord, resumeFreq) {
  if (resumeFreq[jdWord]) return true
  const jdStem = stem(jdWord)
  if (jdStem.length >= 4) return Object.keys(resumeFreq).some(rw => stem(rw) === jdStem)
  return false
}

// ── Experience level detection ────────────────────────────────────────────────

function detectExperienceLevel(resumeText) {
  const text = resumeText.toLowerCase()
  // Look for "X years" or "X+ years" patterns
  const matches = [...text.matchAll(/(\d+)\+?\s*(?:to\s*\d+\s*)?years?\s*(?:of)?\s*(?:experience|exp)?/g)]
  const years = matches.map(m => parseInt(m[1])).filter(n => n <= 40)
  if (years.length === 0) return { level: 'Unknown', years: null }
  const maxYears = Math.max(...years)
  if (maxYears <= 2) return { level: 'Junior', years: maxYears }
  if (maxYears <= 5) return { level: 'Mid-level', years: maxYears }
  return { level: 'Senior', years: maxYears }
}

// ── Verdict logic ─────────────────────────────────────────────────────────────

function getVerdict(score) {
  if (score >= 70) return { label: 'Shortlist', color: 'emerald', emoji: '✅' }
  if (score >= 40) return { label: 'Maybe',     color: 'amber',   emoji: '🟡' }
  return             { label: 'Reject',          color: 'red',     emoji: '❌' }
}

function getInterviewTip(score, missing, expLevel) {
  if (score >= 70) {
    return `Strong match. ${expLevel.level !== 'Unknown' ? `Candidate appears ${expLevel.level.toLowerCase()}.` : ''} Proceed to technical interview.`
  }
  if (score >= 40) {
    const top = missing.slice(0, 3).join(', ')
    return `Partial match. Verify these gaps in interview${top ? `: ${top}` : ''}. May suit a junior variant of the role.`
  }
  const top = missing.slice(0, 3).join(', ')
  return `Low match. Key skills missing${top ? `: ${top}` : ''}. Consider only if role requirements are flexible.`
}

// ── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_JD = `We are looking for a Senior Frontend Developer with 4+ years of experience in React and TypeScript.
The candidate must have strong knowledge of JavaScript, CSS, HTML, and REST APIs.
Experience with Git, Agile methodologies, and testing frameworks like Jest is required.
Familiarity with AWS or any cloud platform is a plus. Strong communication skills essential.`

const SAMPLE_RESUME = `Frontend Developer with 5 years of experience building scalable web applications.
Proficient in React, JavaScript, TypeScript, HTML, CSS and responsive design.
Extensive experience with REST APIs, Git version control, and Agile workflows.
Worked with Jest for unit testing and deployed apps on AWS.
Strong communicator with a record of on-time delivery.`

// ── Component ─────────────────────────────────────────────────────────────────

export default function CandidateScreener() {
  const [jobDesc,  setJobDesc]  = useState('')
  const [resume,   setResume]   = useState('')
  const [result,   setResult]   = useState(null)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileError,   setFileError]   = useState('')
  const fileInputRef = useRef(null)

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')
    setFileLoading(true)
    setResult(null)
    try {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setResume(await file.text())
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const bytes = await file.arrayBuffer()
        const pdf   = await pdfjsLib.getDocument({ data: bytes }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page    = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map(item => item.str).join(' ') + '\n'
        }
        setResume(text.trim())
      } else {
        setFileError('Only .txt and .pdf files are supported.')
      }
    } catch {
      setFileError('Could not read the file. Try pasting the text instead.')
    } finally {
      setFileLoading(false)
      e.target.value = ''
    }
  }

  function handleScreen() {
    if (!jobDesc.trim() || !resume.trim()) return

    const jdFreq     = extractKeywords(jobDesc)
    const resumeFreq = extractKeywords(resume)
    const jdKeywords = Object.keys(jdFreq).sort((a, b) => jdFreq[b] - jdFreq[a])

    const matched = []
    const missing = []
    for (const kw of jdKeywords) {
      if (isMatched(kw, resumeFreq)) matched.push(kw)
      else missing.push(kw)
    }

    const score      = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0
    const verdict    = getVerdict(score)
    const expLevel   = detectExperienceLevel(resume)
    const interviewTip = getInterviewTip(score, missing, expLevel)

    setResult({ matched, missing, score, total: jdKeywords.length, verdict, expLevel, interviewTip })
  }

  function handleSample() {
    setJobDesc(SAMPLE_JD)
    setResume(SAMPLE_RESUME)
    setResult(null)
  }

  function handleClear() {
    setJobDesc('')
    setResume('')
    setResult(null)
    setFileError('')
  }

  const verdictStyles = !result ? {} : {
    emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   bar: 'bg-amber-500'   },
    red:     { border: 'border-red-500/30',      bg: 'bg-red-500/10',     text: 'text-red-400',     bar: 'bg-red-500'     },
  }[result?.verdict?.color] ?? {}

  return (
    <div className="flex flex-col gap-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-600">Paste a job description and candidate resume to screen fit.</p>
        <div className="flex gap-3">
          <button onClick={handleSample} className="text-xs text-zinc-600 transition-colors hover:text-rose-400">Load sample</button>
          <button onClick={handleClear}  className="text-xs text-zinc-600 transition-colors hover:text-red-400">Clear</button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Job Description</label>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description here…"
            spellCheck={false}
            className="h-56 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Candidate Resume</label>
            <div className="flex items-center gap-2">
              {fileLoading && <span className="text-xs text-zinc-600">Reading file…</span>}
              <input ref={fileInputRef} type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={fileLoading}
                className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs text-zinc-500 transition-colors hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-40"
              >
                Upload .txt / .pdf
              </button>
            </div>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste candidate resume text here, or upload a .txt / .pdf file…"
            spellCheck={false}
            className="h-56 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
          />
          {fileError && <p className="text-xs text-red-400">{fileError}</p>}
          <p className="text-xs text-zinc-700">🔒 Resume is read locally — never uploaded to any server.</p>
        </div>
      </div>

      <button
        onClick={handleScreen}
        disabled={!jobDesc.trim() || !resume.trim()}
        className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Screen Candidate
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">

          {/* Verdict card */}
          <div className={`flex items-center gap-5 rounded-xl border p-5 ${verdictStyles.border} bg-[#141414]`}>
            <div className={`flex flex-col items-center justify-center rounded-xl px-5 py-3 ${verdictStyles.bg}`}>
              <span className="text-2xl">{result.verdict.emoji}</span>
              <span className={`mt-1 text-sm font-bold ${verdictStyles.text}`}>{result.verdict.label}</span>
            </div>
            <div className="h-14 w-px bg-[#2a2a2a]" />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${verdictStyles.text}`}>{result.score}%</span>
                <span className="text-xs text-zinc-600">fit score</span>
              </div>
              <div className="flex gap-5 text-sm">
                <span><span className="font-semibold text-emerald-400">{result.matched.length}</span><span className="ml-1 text-zinc-600">matched</span></span>
                <span><span className="font-semibold text-red-400">{result.missing.length}</span><span className="ml-1 text-zinc-600">missing</span></span>
                <span><span className="font-semibold text-zinc-300">{result.total}</span><span className="ml-1 text-zinc-600">total</span></span>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e1e1e]">
            <div className={`h-full rounded-full transition-all duration-500 ${verdictStyles.bar}`} style={{ width: `${result.score}%` }} />
          </div>

          {/* Experience level + Interview tip */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Experience Level</p>
              <p className="text-sm font-semibold text-white">{result.expLevel.level}</p>
              {result.expLevel.years !== null && (
                <p className="mt-0.5 text-xs text-zinc-600">{result.expLevel.years}+ years detected in resume</p>
              )}
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Interview Recommendation</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{result.interviewTip}</p>
            </div>
          </div>

          {/* Skill breakdown */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {result.missing.length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-[#141414] p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-red-400">
                  Missing Skills ({result.missing.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing.map(kw => (
                    <span key={kw} className="rounded-md bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {result.matched.length > 0 && (
              <div className="rounded-xl border border-emerald-500/20 bg-[#141414] p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Matched Skills ({result.matched.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched.map(kw => (
                    <span key={kw} className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-700">
            Tip: 70%+ fit → Shortlist · 40–69% → Evaluate further · Below 40% → Likely not a match.
          </p>
        </div>
      )}
    </div>
  )
}
