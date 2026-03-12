import { useState, useMemo, useRef, useEffect } from 'react'

const TONES = [
  { value: 'professional', label: 'Professional', desc: 'Formal and polished' },
  { value: 'enthusiastic', label: 'Enthusiastic', desc: 'Warm and energetic' },
  { value: 'concise',      label: 'Concise',      desc: 'Short and direct' },
]

// --- Stop words for JD keyword extraction ---
const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','shall','should','may','might','must','can',
  'could','to','of','in','for','on','with','at','by','from','as','into','through',
  'during','before','after','above','below','between','out','off','over','under',
  'again','further','then','once','here','there','when','where','why','how','all',
  'each','every','both','few','more','most','other','some','such','no','nor','not',
  'only','own','same','so','than','too','very','just','about','also','and','but',
  'or','if','while','because','until','although','since','unless','that','this',
  'these','those','i','me','my','myself','we','our','ours','ourselves','you','your',
  'yours','yourself','yourselves','he','him','his','himself','she','her','hers',
  'herself','it','its','itself','they','them','their','theirs','themselves','what',
  'which','who','whom','whose','am','up','down','s','t','re','ve','ll','d','m',
  'don','didn','doesn','isn','aren','wasn','weren','won','wouldn','couldn','shouldn',
  'haven','hasn','hadn','including','etc','e','g','ie','eg','us','get','got',
  'able','across','well','new','one','two','much','many','make','like','need',
  'want','look','use','find','give','tell','work','first','last','long','great',
  'little','right','big','high','different','small','large','next','early','young',
  'important','public','bad','good',
])

const GENERIC_JD_WORDS = new Set([
  'team','company','role','position','candidate','candidates','responsibilities',
  'responsibility','requirement','requirements','qualifications','qualification',
  'opportunity','opportunities','apply','application','applications','job','jobs',
  'salary','benefits','benefit','description','experience','year','years','day',
  'days','week','weeks','month','months','time','part','full','working','based',
  'ability','strong','excellent','preferred','required','minimum','plus','bonus',
  'equal','employer','employment','hire','hiring','interview','resume','cover',
  'letter','please','submit','deadline','date','location','remote','onsite',
  'office','department','manager','report','reporting','level','senior','junior',
  'mid','lead','staff','member','members','environment','culture','diverse',
  'diversity','inclusion','inclusive','competitive','comprehensive','package',
  'offer','offers','providing','provided','seeking','looking','join','joining',
  'ideal','successful','passionate','driven','motivated','self','detail',
  'oriented','focused','committed','dedicated',
])

const SKILL_PATTERNS = [
  /(?:experience\s+(?:with|in)\s+)([^,.;]+)/gi,
  /(?:proficiency\s+in\s+)([^,.;]+)/gi,
  /(?:knowledge\s+of\s+)([^,.;]+)/gi,
  /(?:skills?\s+in\s+)([^,.;]+)/gi,
  /(?:familiar(?:ity)?\s+with\s+)([^,.;]+)/gi,
  /(?:expertise\s+in\s+)([^,.;]+)/gi,
  /(?:proficient\s+(?:with|in)\s+)([^,.;]+)/gi,
  /(?:understanding\s+of\s+)([^,.;]+)/gi,
  /(?:background\s+in\s+)([^,.;]+)/gi,
  /(?:hands-on\s+(?:experience\s+)?(?:with|in)\s+)([^,.;]+)/gi,
  /(?:working\s+knowledge\s+of\s+)([^,.;]+)/gi,
]

function extractKeywords(text) {
  if (!text.trim()) return []

  const keywordScores = new Map()

  function addKw(kw, score) {
    const key = kw.toLowerCase().trim()
    if (key.length < 2) return
    const words = key.split(/\s+/)
    if (words.every(w => STOP_WORDS.has(w) || GENERIC_JD_WORDS.has(w))) return
    if (words.length === 1 && (STOP_WORDS.has(key) || GENERIC_JD_WORDS.has(key))) return
    keywordScores.set(key, (keywordScores.get(key) || 0) + score)
  }

  // 1) Extract from skill patterns (high weight)
  for (const pattern of SKILL_PATTERNS) {
    pattern.lastIndex = 0
    let match
    while ((match = pattern.exec(text)) !== null) {
      const phrase = match[1].trim()
      // Split on "and", "/", "&", "or" to get individual skills
      const parts = phrase.split(/\s*(?:,|\band\b|\/|&|\bor\b)\s*/)
      for (const part of parts) {
        const clean = part.trim().replace(/^(?:a|an|the)\s+/i, '')
        if (clean.length >= 2) addKw(clean, 5)
      }
    }
  }

  // 2) Extract capitalized multi-word phrases (e.g., "React Native", "Google Cloud")
  const capitalizedPattern = /\b([A-Z][a-zA-Z+#]*(?:\s+[A-Z][a-zA-Z+#.]*)+)\b/g
  let capMatch
  while ((capMatch = capitalizedPattern.exec(text)) !== null) {
    const phrase = capMatch[1].trim()
    if (phrase.length >= 3) addKw(phrase, 4)
  }

  // 3) Single capitalized words that look like tech terms
  const techTermPattern = /\b([A-Z][a-zA-Z+#.]{1,20})\b/g
  let techMatch
  while ((techMatch = techTermPattern.exec(text)) !== null) {
    const word = techMatch[1]
    // Skip if it starts a sentence (preceded by . or start of line)
    const idx = techMatch.index
    if (idx > 0) {
      const prev = text.substring(Math.max(0, idx - 3), idx).trim()
      if (prev.endsWith('.') || prev.endsWith(':') || prev.endsWith('\n')) continue
    } else {
      continue
    }
    if (!STOP_WORDS.has(word.toLowerCase()) && !GENERIC_JD_WORDS.has(word.toLowerCase())) {
      addKw(word, 2)
    }
  }

  // 4) Word frequency analysis (single words that appear often)
  const words = text.toLowerCase().replace(/[^a-z0-9+#\s-]/g, ' ').split(/\s+/)
  const freq = new Map()
  for (const w of words) {
    if (w.length < 3) continue
    if (STOP_WORDS.has(w) || GENERIC_JD_WORDS.has(w)) continue
    freq.set(w, (freq.get(w) || 0) + 1)
  }
  for (const [word, count] of freq) {
    if (count >= 2) addKw(word, count)
  }

  // Sort by score, deduplicate overlapping phrases, return top 20
  const sorted = [...keywordScores.entries()]
    .sort((a, b) => b[1] - a[1])

  const seen = new Set()
  const result = []
  for (const [kw] of sorted) {
    if (result.length >= 20) break
    // Skip if a longer phrase already includes this keyword
    const isDuplicate = [...seen].some(existing =>
      existing.includes(kw) || kw.includes(existing)
    )
    if (isDuplicate && kw.split(/\s+/).length <= 1) continue
    // If this is a longer phrase that includes an existing shorter one, replace
    const shorter = [...seen].find(existing => kw.includes(existing) && kw !== existing)
    if (shorter) seen.delete(shorter)
    seen.add(kw)
    result.push(kw)
  }

  // Capitalize nicely for display
  return result.map(kw => {
    // Preserve original casing if it looks like a proper noun/tech term
    const originalMatch = text.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
    return originalMatch ? originalMatch[0] : kw
  })
}

// --- Build letter (enhanced with JD keywords) ---
function buildLetter({ fullName, email, phone, jobTitle, companyName, hiringManager, currentRole, yearsExp, skills, achievement, whyCompany, tone, jdKeywords }) {
  const manager    = hiringManager.trim() || 'Hiring Manager'
  const today      = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  const skillList  = skills.split('\n').map(s => s.trim()).filter(Boolean)
  const skillStr   = skillList.length === 0
    ? 'relevant skills'
    : skillList.length === 1
      ? skillList[0]
      : skillList.slice(0, -1).join(', ') + ' and ' + skillList[skillList.length - 1]
  const expPhrase  = yearsExp ? `${yearsExp} year${Number(yearsExp) !== 1 ? 's' : ''} of` : 'extensive'
  const role       = currentRole.trim() || jobTitle

  const openers = {
    professional: `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. Having spent ${expPhrase} experience as a ${role}, I am confident my background and skills make me an excellent fit for your team.`,
    enthusiastic: `I was genuinely excited to come across the ${jobTitle} opening at ${companyName}! With ${expPhrase} experience as a ${role}, I believe I can make a meaningful impact at your organisation from day one.`,
    concise:      `I am applying for the ${jobTitle} role at ${companyName}. With ${expPhrase} experience as a ${role}, I bring the skills and focus your team needs.`,
  }

  const body2 = {
    professional: `Throughout my career, I have built strong expertise in ${skillStr}. I am known for delivering high-quality work with attention to detail and a collaborative approach that helps teams move faster and smarter.`,
    enthusiastic: `I have honed my expertise in ${skillStr} and truly love what I do. I thrive in fast-paced environments and enjoy solving complex problems with creative, practical solutions.`,
    concise:      `My expertise spans ${skillStr}. I focus on delivering results efficiently and work well both independently and in teams.`,
  }

  const achievementPara = achievement.trim()
    ? `\nA recent achievement I am proud of: ${achievement.trim()}\n`
    : ''

  // Weave in JD keywords if available
  let jdPara = ''
  if (jdKeywords && jdKeywords.length > 0) {
    const relevantKws = jdKeywords.filter(kw =>
      !skillList.some(s => s.toLowerCase().includes(kw.toLowerCase()))
    ).slice(0, 5)
    if (relevantKws.length > 0) {
      const kwStr = relevantKws.length === 1
        ? relevantKws[0]
        : relevantKws.slice(0, -1).join(', ') + ' and ' + relevantKws[relevantKws.length - 1]
      jdPara = `\nI also bring experience with ${kwStr}, which I understand are important to this role.\n`
    }
  }

  const whyPara = whyCompany.trim()
    ? `\nWhat excites me most about ${companyName} is ${whyCompany.trim()}. I am eager to contribute to your mission and grow alongside such a strong team.\n`
    : ''

  const closers = {
    professional: `I would welcome the opportunity to discuss how my experience aligns with your team's goals. Thank you for your time and consideration — I look forward to hearing from you.`,
    enthusiastic: `I would love the chance to chat about how I can contribute to ${companyName}. Thank you so much for considering my application — I can't wait to connect!`,
    concise:      `I am happy to discuss my background further at your convenience. Thank you for your consideration.`,
  }

  const contact = [email.trim(), phone.trim()].filter(Boolean).join('  |  ')

  return `${today}

Dear ${manager},

${openers[tone]}

${body2[tone]}
${achievementPara}${jdPara}${whyPara}
${closers[tone]}

Sincerely,
${fullName}${contact ? `\n${contact}` : ''}`
}

// --- Strength score calculation ---
function calcStrength(form, letterText) {
  const wordCount = letterText.trim().split(/\s+/).filter(Boolean).length
  const skillList = form.skills.split('\n').map(s => s.trim()).filter(Boolean)
  const hasNumber = /\d/.test(form.achievement)

  const criteria = [
    {
      label: 'Word count 250-400',
      met: wordCount >= 250 && wordCount <= 400,
      warn: wordCount >= 150 && wordCount < 250 || wordCount > 400 && wordCount <= 500,
      tip: wordCount < 250 ? 'Your letter is a bit short. Add more detail to your skills or achievement.' : wordCount > 400 ? 'Consider trimming some content for a more focused letter.' : '',
    },
    {
      label: 'Quantified achievement',
      met: hasNumber,
      warn: false,
      tip: 'Add a specific number to your achievement (e.g., "increased sales by 30%").',
    },
    {
      label: 'Company name mentioned',
      met: !!form.companyName.trim(),
      warn: false,
      tip: 'Fill in the company name to personalise your letter.',
    },
    {
      label: '"Why this company" filled',
      met: !!form.whyCompany.trim(),
      warn: false,
      tip: 'Explain why you want to work at this company specifically.',
    },
    {
      label: '3+ skills listed',
      met: skillList.length >= 3,
      warn: skillList.length >= 1 && skillList.length < 3,
      tip: 'List at least 3 key skills (one per line) to strengthen your letter.',
    },
  ]

  const score = criteria.filter(c => c.met).length
  return { criteria, score, total: criteria.length }
}

// --- Sub-components ---
function Field({ label, required, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-1">
        <label className="text-xs text-zinc-400">
          {label}{required && <span className="ml-0.5 text-rose-400">*</span>}
        </label>
        {hint && <span className="text-xs text-zinc-600">— {hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputCls = 'rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-green-500/50 transition-colors'

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  )
}

function StrengthCard({ form, letterText }) {
  const { criteria, score, total } = calcStrength(form, letterText)
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red'
  const colorMap = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  const barColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Letter Strength</p>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${colorMap[color]}`}>
          {score}/{total}
        </span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#1a1a1a]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0">
              {c.met ? <CheckIcon /> : c.warn ? <WarnIcon /> : <XIcon />}
            </span>
            <div className="min-w-0">
              <p className={`text-xs ${c.met ? 'text-zinc-300' : 'text-zinc-500'}`}>{c.label}</p>
              {!c.met && c.tip && <p className="text-xs text-zinc-600">{c.tip}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LivePreview({ letterText, form, onCopy, copied, onDownloadPdf, onDownloadDocx, onLetterChange }) {
  const wordCount = letterText.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Paper preview */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] shadow-xl shadow-black/20">
        <div className="border-b border-[#2a2a2a] px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Live Preview</p>
          <p className="text-xs text-zinc-600">{wordCount} words</p>
        </div>
        <textarea
          value={letterText}
          onChange={(e) => onLetterChange(e.target.value)}
          rows={20}
          className="w-full resize-none bg-transparent p-5 text-sm leading-7 text-zinc-200 outline-none font-[system-ui]"
          placeholder="Fill in the form fields to see your cover letter build here in real time..."
        />
      </div>

      {/* Strength score */}
      <StrengthCard form={form} letterText={letterText} />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onCopy}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-500"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={onDownloadPdf}
          className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:border-rose-500/40 hover:text-rose-400"
        >
          PDF
        </button>
        <button
          onClick={onDownloadDocx}
          className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:border-blue-500/40 hover:text-blue-400"
        >
          Word
        </button>
      </div>
    </div>
  )
}

// --- Main Component ---
export default function CoverLetterGenerator() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    jobTitle: '', companyName: '', hiringManager: '',
    currentRole: '', yearsExp: '',
    skills: '', achievement: '', whyCompany: '',
    tone: 'professional',
  })
  const [jobDescription, setJobDescription] = useState('')
  const [extractedKeywords, setExtractedKeywords] = useState([])
  const [addedJdKeywords, setAddedJdKeywords] = useState([])
  const [jdOpen, setJdOpen] = useState(false)
  const [letter, setLetter] = useState('')
  const [copied, setCopied] = useState(false)
  const [mobileShowPreview, setMobileShowPreview] = useState(false)
  const mobilePreviewRef = useRef(null)

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  // Build live letter whenever form changes
  const canGenerate = form.fullName.trim() && form.jobTitle.trim() && form.companyName.trim()

  const liveLetter = useMemo(() => {
    if (!canGenerate) return ''
    return buildLetter({ ...form, jdKeywords: addedJdKeywords })
  }, [form, addedJdKeywords, canGenerate])

  // Keep letter in sync with live letter (but allow manual edits)
  const [manualEdit, setManualEdit] = useState(false)
  useEffect(() => {
    if (!manualEdit) {
      setLetter(liveLetter)
    }
  }, [liveLetter, manualEdit])

  // Reset manual edit when form changes
  useEffect(() => {
    setManualEdit(false)
  }, [form, addedJdKeywords])

  function handleLetterChange(text) {
    setLetter(text)
    setManualEdit(true)
  }

  // JD keyword extraction
  function handleJdChange(e) {
    const text = e.target.value
    setJobDescription(text)
    if (text.trim().length > 30) {
      setExtractedKeywords(extractKeywords(text))
    } else {
      setExtractedKeywords([])
    }
  }

  function addKeywordToSkills(keyword) {
    // Add to skills textarea
    setForm(f => {
      const current = f.skills.trim()
      const lines = current.split('\n').map(s => s.trim()).filter(Boolean)
      if (lines.some(l => l.toLowerCase() === keyword.toLowerCase())) return f
      const newSkills = current ? current + '\n' + keyword : keyword
      return { ...f, skills: newSkills }
    })
    // Track as added JD keyword for letter weaving
    setAddedJdKeywords(prev => {
      if (prev.some(k => k.toLowerCase() === keyword.toLowerCase())) return prev
      return [...prev, keyword]
    })
  }

  function handleMobileGenerate() {
    if (!canGenerate) return
    setLetter(buildLetter({ ...form, jdKeywords: addedJdKeywords }))
    setMobileShowPreview(true)
    setTimeout(() => {
      mobilePreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  async function handleCopy() {
    const text = letter || liveLetter
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function fileName() {
    return `cover-letter-${form.companyName.replace(/\s+/g, '-').toLowerCase() || 'draft'}`
  }

  async function handleDownloadPdf() {
    const text = letter || liveLetter
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const margin = 20
    const pageW = doc.internal.pageSize.getWidth()
    const maxW  = pageW - margin * 2
    const lineH = 7

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(form.fullName || 'Cover Letter', margin, margin + 4)

    const contact = [form.email, form.phone].filter(Boolean).join('   |   ')
    if (contact) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(100)
      doc.text(contact, margin, margin + 10)
    }

    doc.setDrawColor(200)
    doc.line(margin, margin + 14, pageW - margin, margin + 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30)
    let y = margin + 22

    const lines = doc.splitTextToSize(text, maxW)
    lines.forEach((line) => {
      if (y > 277) { doc.addPage(); y = margin }
      doc.text(line, margin, y)
      y += lineH
    })

    doc.save(`${fileName()}.pdf`)
  }

  async function handleDownloadDocx() {
    const text = letter || liveLetter
    const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx')
    const paragraphs = text.split('\n').map((line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
        alignment: AlignmentType.LEFT,
        spacing: { after: line.trim() === '' ? 0 : 160 },
      })
    )

    const header = new Paragraph({
      children: [new TextRun({ text: form.fullName || 'Cover Letter', bold: true, size: 32, font: 'Calibri' })],
      spacing: { after: 80 },
    })

    const contactLine = [form.email, form.phone].filter(Boolean).join('   |   ')
    const contactPara = contactLine
      ? new Paragraph({
          children: [new TextRun({ text: contactLine, size: 20, color: '555555', font: 'Calibri' })],
          spacing: { after: 240 },
        })
      : null

    const doc = new Document({
      sections: [{
        properties: {},
        children: [header, ...(contactPara ? [contactPara] : []), ...paragraphs],
      }],
    })

    const blob = await Packer.toBlob(doc)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${fileName()}.docx`
    a.click()
  }

  const filledCount = [form.fullName, form.email, form.jobTitle, form.companyName, form.currentRole, form.skills, form.achievement, form.whyCompany].filter(v => v.trim()).length
  const totalFields = 8

  // Check which extracted keywords are already in skills
  const currentSkillsLower = form.skills.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean)

  // --- FORM SECTION ---
  const formSection = (
    <div className="flex flex-col gap-6">
      {/* Progress hint */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${(filledCount / totalFields) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-600">{filledCount}/{totalFields} fields</span>
      </div>

      {/* Smart Mode: Job Description */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414]">
        <button
          onClick={() => setJdOpen(!jdOpen)}
          className="flex w-full items-center justify-between p-5"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-green-500/10 text-xs text-green-400">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Smart Mode</span>
            <span className="text-xs text-zinc-600">— Paste a job description to extract keywords</span>
          </div>
          <svg
            className={`h-4 w-4 text-zinc-500 transition-transform ${jdOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {jdOpen && (
          <div className="border-t border-[#2a2a2a] p-5 pt-4">
            <textarea
              className={`${inputCls} w-full resize-none`}
              rows={5}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={handleJdChange}
            />
            {extractedKeywords.length > 0 && (
              <div className="mt-3">
                <p className="mb-2 text-xs text-zinc-500">
                  Extracted keywords — click <span className="text-green-400">+</span> to add to skills:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedKeywords.map((kw, i) => {
                    const alreadyAdded = currentSkillsLower.some(s => s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s))
                    return (
                      <button
                        key={i}
                        onClick={() => !alreadyAdded && addKeywordToSkills(kw)}
                        disabled={alreadyAdded}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                          alreadyAdded
                            ? 'border-green-500/20 bg-green-500/5 text-green-400/60 cursor-default'
                            : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-300 hover:border-green-500/40 hover:text-green-400'
                        }`}
                      >
                        {kw}
                        {alreadyAdded ? (
                          <svg className="h-3 w-3 text-green-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {jobDescription.trim().length > 0 && jobDescription.trim().length <= 30 && (
              <p className="mt-2 text-xs text-zinc-600">Keep pasting — need more text to extract keywords.</p>
            )}
          </div>
        )}
      </div>

      {/* Personal info */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Your Details</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Full Name" required>
            <input className={inputCls} placeholder="John Williams" value={form.fullName} onChange={set('fullName')} />
          </Field>
          <Field label="Email">
            <input className={inputCls} placeholder="john@example.com" value={form.email} onChange={set('email')} />
          </Field>
          <Field label="Phone">
            <input className={inputCls} placeholder="+1 555 000 1234" value={form.phone} onChange={set('phone')} />
          </Field>
        </div>
      </div>

      {/* Job info */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Job Details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Job Title Applying For" required>
            <input className={inputCls} placeholder="Frontend Developer" value={form.jobTitle} onChange={set('jobTitle')} />
          </Field>
          <Field label="Company Name" required>
            <input className={inputCls} placeholder="Acme Corp" value={form.companyName} onChange={set('companyName')} />
          </Field>
          <Field label="Hiring Manager Name" hint="leave blank for 'Hiring Manager'">
            <input className={inputCls} placeholder="Ms. Sarah Chen" value={form.hiringManager} onChange={set('hiringManager')} />
          </Field>
          <Field label="Your Current / Last Role">
            <input className={inputCls} placeholder="Software Engineer" value={form.currentRole} onChange={set('currentRole')} />
          </Field>
        </div>
        <div className="mt-4 w-32">
          <Field label="Years of Experience">
            <input className={inputCls} type="number" min={0} placeholder="3" value={form.yearsExp} onChange={set('yearsExp')} />
          </Field>
        </div>
      </div>

      {/* Highlights */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">Highlights</p>
        <div className="flex flex-col gap-4">
          <Field label="Key Skills" hint="one per line">
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder={"React & TypeScript\nREST API integration\nAgile / Scrum"}
              value={form.skills}
              onChange={set('skills')}
            />
          </Field>
          <Field label="One Key Achievement" hint="optional — numbers make it stronger">
            <input
              className={inputCls}
              placeholder="Reduced deployment time by 60% by introducing CI/CD pipelines."
              value={form.achievement}
              onChange={set('achievement')}
            />
          </Field>
          <Field label="Why This Company?" hint="optional — personalises the letter">
            <input
              className={inputCls}
              placeholder="your commitment to developer experience and open-source culture"
              value={form.whyCompany}
              onChange={set('whyCompany')}
            />
          </Field>
        </div>
      </div>

      {/* Tone */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">Tone</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {TONES.map((t) => (
            <button
              key={t.value}
              onClick={() => setForm((f) => ({ ...f, tone: t.value }))}
              className={`rounded-lg border p-3 text-left transition-colors ${
                form.tone === t.value
                  ? 'border-green-500/40 bg-green-500/10'
                  : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]'
              }`}
            >
              <p className={`text-sm font-medium ${form.tone === t.value ? 'text-green-400' : 'text-zinc-300'}`}>{t.label}</p>
              <p className="mt-0.5 text-xs text-zinc-600">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button — mobile only */}
      <div className="lg:hidden">
        <button
          onClick={handleMobileGenerate}
          disabled={!canGenerate}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {canGenerate ? 'Generate Cover Letter' : 'Fill in Name, Job Title & Company to generate'}
        </button>
      </div>
    </div>
  )

  // --- PREVIEW PLACEHOLDER for desktop when form not ready ---
  const desktopPreviewPlaceholder = (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] shadow-xl shadow-black/20">
        <div className="border-b border-[#2a2a2a] px-5 py-3">
          <p className="text-xs text-zinc-500">Live Preview</p>
        </div>
        <div className="p-5 min-h-[400px]">
          <p className="text-sm leading-7 text-zinc-600">
            <span className="text-zinc-500">[Date]</span>
          </p>
          <p className="mt-4 text-sm leading-7 text-zinc-600">Dear Hiring Manager,</p>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            Fill in <span className="text-green-500/60">Full Name</span>, <span className="text-green-500/60">Job Title</span>, and <span className="text-green-500/60">Company Name</span> to see your cover letter build here in real time.
          </p>
          <p className="mt-6 text-sm leading-7 text-zinc-600">Your letter will appear as you type, with a strength score below to help you improve it.</p>
          <p className="mt-8 text-sm leading-7 text-zinc-600">Sincerely,</p>
          <p className="text-sm leading-7 text-zinc-600"><span className="text-zinc-500">[Your Name]</span></p>
        </div>
      </div>
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Letter Strength</p>
        <p className="mt-2 text-xs text-zinc-600">Complete the required fields to see your score.</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Two-column layout for lg screens */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="min-w-0">
          {formSection}
        </div>

        {/* Right: Live preview — desktop only */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {canGenerate && liveLetter ? (
              <LivePreview
                letterText={letter || liveLetter}
                form={form}
                onCopy={handleCopy}
                copied={copied}
                onDownloadPdf={handleDownloadPdf}
                onDownloadDocx={handleDownloadDocx}
                onLetterChange={handleLetterChange}
              />
            ) : (
              desktopPreviewPlaceholder
            )}
          </div>
        </div>
      </div>

      {/* Mobile: preview section below form */}
      {mobileShowPreview && (letter || liveLetter) && (
        <div ref={mobilePreviewRef} className="lg:hidden flex flex-col gap-4">
          {/* Header bar */}
          <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-green-400">Cover letter ready</p>
              <p className="text-xs text-zinc-500">{form.jobTitle} at {form.companyName} · {TONES.find(t => t.value === form.tone)?.label} tone</p>
            </div>
            <button onClick={() => setMobileShowPreview(false)} className="text-xs text-zinc-500 underline hover:text-zinc-300">
              Hide Preview
            </button>
          </div>

          <LivePreview
            letterText={letter || liveLetter}
            form={form}
            onCopy={handleCopy}
            copied={copied}
            onDownloadPdf={handleDownloadPdf}
            onDownloadDocx={handleDownloadDocx}
            onLetterChange={handleLetterChange}
          />
        </div>
      )}
    </div>
  )
}
