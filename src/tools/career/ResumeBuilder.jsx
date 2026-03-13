import { useState, useMemo, useRef } from 'react'

// ---------- helpers ----------
let _id = 0
const uid = () => `rb-${++_id}`

const blankExp = () => ({
  id: uid(), company: '', role: '', location: '',
  start: '', end: '', current: false, bullets: '',
})
const blankEdu = () => ({
  id: uid(), school: '', degree: '', field: '', start: '', end: '',
})

// ---------- styles ----------
const inputCls =
  'w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-indigo-500/50 transition-colors'

const sectionCard = 'rounded-xl border border-[#2a2a2a] bg-[#141414] p-5'
const sectionHeader = 'text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-4'

// ---------- icon helpers (inline SVG) ----------
function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

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

// ---------- Field wrapper ----------
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

// ---------- Strength score ----------
function calcStrength(form) {
  const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
  const summaryWords = form.summary.trim().split(/\s+/).filter(Boolean).length
  const hasExpFilled = form.experience.some(e => e.company.trim() || e.role.trim())
  const hasEduFilled = form.education.some(e => e.school.trim() || e.degree.trim())
  const allBullets = form.experience.map(e => e.bullets).join('\n')
  const hasNumber = /\d/.test(allBullets)

  const criteria = [
    {
      label: 'Full name & job title filled',
      met: !!(form.fullName.trim() && form.jobTitle.trim()),
      warn: false,
      tip: 'Add your full name and the job title you are targeting.',
    },
    {
      label: 'Contact info (email + phone)',
      met: !!(form.email.trim() && form.phone.trim()),
      warn: !!(form.email.trim() || form.phone.trim()),
      tip: 'Fill in both your email address and phone number.',
    },
    {
      label: 'Summary 30+ words',
      met: summaryWords >= 30,
      warn: summaryWords >= 15 && summaryWords < 30,
      tip: summaryWords < 15
        ? 'Write a professional summary of at least 30 words.'
        : `Your summary is ${summaryWords} words. Aim for 30+ to pass ATS filters.`,
    },
    {
      label: '1+ work experience entry',
      met: hasExpFilled,
      warn: false,
      tip: 'Add at least one work experience entry with company and role.',
    },
    {
      label: 'Quantified achievement in bullets',
      met: hasNumber,
      warn: false,
      tip: 'Include a number in at least one bullet point (e.g. "increased sales by 30%").',
    },
    {
      label: '3+ skills listed',
      met: skills.length >= 3,
      warn: skills.length >= 1 && skills.length < 3,
      tip: 'Add at least 3 skills separated by commas.',
    },
    {
      label: 'Education filled',
      met: hasEduFilled,
      warn: false,
      tip: 'Add at least one education entry.',
    },
  ]

  const score = criteria.filter(c => c.met).length
  return { criteria, score, total: criteria.length }
}

// ---------- Strength card ----------
function StrengthCard({ form }) {
  const { criteria, score, total } = calcStrength(form)
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red'

  const colorMap = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  const barMap = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' }

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Resume Strength</p>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${colorMap[color]}`}>
          {score}/{total}
        </span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#1a1a1a]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barMap[color]}`}
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

// ---------- Live preview (white paper) ----------
function ResumePreview({ form }) {
  const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
  const certs = form.certifications.split('\n').map(s => s.trim()).filter(Boolean)

  const contactParts = [form.email, form.phone, form.location, form.linkedin].filter(Boolean)

  return (
    <div className="max-h-[680px] overflow-auto rounded-xl border border-[#2a2a2a] bg-white shadow-xl shadow-black/30">
      {/* Paper content */}
      <div className="p-8 text-[#1a1a1a] font-[Georgia,serif]" style={{ minWidth: 0 }}>

        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#111]">
            {form.fullName || <span className="text-gray-300">Your Name</span>}
          </h1>
          {form.jobTitle && (
            <p className="mt-0.5 text-sm font-medium text-gray-500">{form.jobTitle}</p>
          )}
          {contactParts.length > 0 && (
            <p className="mt-1.5 text-xs text-gray-500">{contactParts.join('  ·  ')}</p>
          )}
        </div>

        <div className="border-t border-gray-300 mb-4" />

        {/* Summary */}
        {form.summary.trim() && (
          <section className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Summary</p>
            <div className="border-t border-gray-200 mb-2" />
            <p className="text-xs leading-relaxed text-gray-700">{form.summary}</p>
          </section>
        )}

        {/* Experience */}
        {form.experience.some(e => e.company.trim() || e.role.trim()) && (
          <section className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Experience</p>
            <div className="border-t border-gray-200 mb-2" />
            {form.experience.map((exp) => {
              if (!exp.company.trim() && !exp.role.trim()) return null
              const dateRange = exp.current
                ? `${exp.start} – Present`
                : [exp.start, exp.end].filter(Boolean).join(' – ')
              const bullets = exp.bullets
                .split('\n')
                .map(b => b.replace(/^[-•]\s*/, '').trim())
                .filter(Boolean)

              return (
                <div key={exp.id} className="mb-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-bold text-[#111]">
                      {exp.role || <span className="text-gray-400">Role</span>}
                      {exp.company && <span className="font-normal text-gray-600"> · {exp.company}</span>}
                    </p>
                    {dateRange && <p className="text-xs text-gray-500 shrink-0 ml-2">{dateRange}</p>}
                  </div>
                  {exp.location && <p className="text-xs text-gray-500 mb-1">{exp.location}</p>}
                  {bullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5 pl-3">
                      {bullets.map((b, i) => (
                        <li key={i} className="text-xs leading-relaxed text-gray-700 list-disc">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </section>
        )}

        {/* Education */}
        {form.education.some(e => e.school.trim() || e.degree.trim()) && (
          <section className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Education</p>
            <div className="border-t border-gray-200 mb-2" />
            {form.education.map((edu) => {
              if (!edu.school.trim() && !edu.degree.trim()) return null
              const years = [edu.start, edu.end].filter(Boolean).join(' – ')
              return (
                <div key={edu.id} className="mb-2">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-bold text-[#111]">
                      {[edu.degree, edu.field].filter(Boolean).join(', ') || <span className="text-gray-400">Degree</span>}
                    </p>
                    {years && <p className="text-xs text-gray-500 shrink-0 ml-2">{years}</p>}
                  </div>
                  {edu.school && <p className="text-xs text-gray-500">{edu.school}</p>}
                </div>
              )
            })}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Skills</p>
            <div className="border-t border-gray-200 mb-2" />
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certs.length > 0 && (
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Certifications</p>
            <div className="border-t border-gray-200 mb-2" />
            <ul className="space-y-0.5 pl-3">
              {certs.map((c, i) => (
                <li key={i} className="text-xs text-gray-700 list-disc">{c}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state */}
        {!form.fullName && !form.jobTitle && !form.summary && (
          <p className="text-center text-xs text-gray-400 py-8">
            Fill in the form to see your resume preview here.
          </p>
        )}
      </div>
    </div>
  )
}

// ---------- PDF download ----------
async function downloadPdf(form) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 15
  const pageW = doc.internal.pageSize.getWidth()
  const contentW = pageW - margin * 2
  let y = margin

  function checkPage(needed = 8) {
    if (y + needed > 280) { doc.addPage(); y = margin }
  }

  // --- Header ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(17, 17, 17)
  doc.text(form.fullName || 'Resume', pageW / 2, y + 6, { align: 'center' })
  y += 10

  if (form.jobTitle) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(100, 100, 100)
    doc.text(form.jobTitle, pageW / 2, y + 4, { align: 'center' })
    y += 7
  }

  const contactParts = [form.email, form.phone, form.location, form.linkedin].filter(Boolean)
  if (contactParts.length) {
    doc.setFontSize(8.5)
    doc.setTextColor(120, 120, 120)
    doc.text(contactParts.join('   ·   '), pageW / 2, y + 3, { align: 'center' })
    y += 6
  }

  // divider
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(margin, y + 2, pageW - margin, y + 2)
  y += 7

  function sectionHeading(title) {
    checkPage(12)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(title.toUpperCase(), margin, y)
    y += 2
    doc.setDrawColor(210, 210, 210)
    doc.setLineWidth(0.2)
    doc.line(margin, y, pageW - margin, y)
    y += 4
  }

  // --- Summary ---
  if (form.summary.trim()) {
    sectionHeading('Summary')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const lines = doc.splitTextToSize(form.summary.trim(), contentW)
    lines.forEach(line => {
      checkPage()
      doc.text(line, margin, y)
      y += 5
    })
    y += 3
  }

  // --- Experience ---
  const expFilled = form.experience.filter(e => e.company.trim() || e.role.trim())
  if (expFilled.length) {
    sectionHeading('Experience')
    expFilled.forEach(exp => {
      checkPage(10)
      const role = exp.role || ''
      const company = exp.company || ''
      const dateRange = exp.current
        ? `${exp.start} – Present`
        : [exp.start, exp.end].filter(Boolean).join(' – ')

      // Role · Company + dates
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 17, 17)
      const leftText = [role, company].filter(Boolean).join(' · ')
      doc.text(leftText, margin, y)
      if (dateRange) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(120, 120, 120)
        doc.text(dateRange, pageW - margin, y, { align: 'right' })
      }
      y += 5

      // Location
      if (exp.location) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(140, 140, 140)
        doc.text(exp.location, margin, y)
        y += 4.5
      }

      // Bullets
      const bullets = exp.bullets
        .split('\n')
        .map(b => b.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean)

      bullets.forEach(b => {
        checkPage()
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(50, 50, 50)
        const bLines = doc.splitTextToSize(`• ${b}`, contentW - 4)
        bLines.forEach(l => {
          checkPage()
          doc.text(l, margin + 2, y)
          y += 4.5
        })
      })
      y += 3
    })
  }

  // --- Education ---
  const eduFilled = form.education.filter(e => e.school.trim() || e.degree.trim())
  if (eduFilled.length) {
    sectionHeading('Education')
    eduFilled.forEach(edu => {
      checkPage(10)
      const degreeField = [edu.degree, edu.field].filter(Boolean).join(', ')
      const years = [edu.start, edu.end].filter(Boolean).join(' – ')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(17, 17, 17)
      doc.text(degreeField || edu.school, margin, y)
      if (years) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(120, 120, 120)
        doc.text(years, pageW - margin, y, { align: 'right' })
      }
      y += 5

      if (edu.school && degreeField) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.setTextColor(140, 140, 140)
        doc.text(edu.school, margin, y)
        y += 4.5
      }
      y += 2
    })
  }

  // --- Skills ---
  const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean)
  if (skills.length) {
    sectionHeading('Skills')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const skillLine = skills.join(' · ')
    const sLines = doc.splitTextToSize(skillLine, contentW)
    sLines.forEach(l => {
      checkPage()
      doc.text(l, margin, y)
      y += 5
    })
    y += 3
  }

  // --- Certifications ---
  const certs = form.certifications.split('\n').map(s => s.trim()).filter(Boolean)
  if (certs.length) {
    sectionHeading('Certifications')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    certs.forEach(c => {
      checkPage()
      doc.text(`• ${c}`, margin + 2, y)
      y += 5
    })
  }

  const safeName = (form.fullName || 'resume').replace(/\s+/g, '-').toLowerCase()
  doc.save(`resume-${safeName}.pdf`)
}

// ---------- Main component ----------
export default function ResumeBuilder() {
  const [form, setForm] = useState({
    fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '',
    summary: '',
    experience: [blankExp()],
    education: [blankEdu()],
    skills: '',
    certifications: '',
  })

  const [mobileShowPreview, setMobileShowPreview] = useState(false)
  const previewRef = useRef(null)

  function setField(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  // Experience helpers
  function updateExp(id, field, value) {
    setForm(f => ({
      ...f,
      experience: f.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  }
  function addExp() {
    setForm(f => ({ ...f, experience: [...f.experience, blankExp()] }))
  }
  function removeExp(id) {
    setForm(f => ({ ...f, experience: f.experience.filter(e => e.id !== id) }))
  }

  // Education helpers
  function updateEdu(id, field, value) {
    setForm(f => ({
      ...f,
      education: f.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }))
  }
  function addEdu() {
    setForm(f => ({ ...f, education: [...f.education, blankEdu()] }))
  }
  function removeEdu(id) {
    setForm(f => ({ ...f, education: f.education.filter(e => e.id !== id) }))
  }

  // Progress bar (5 key sections)
  const progressSections = useMemo(() => {
    let filled = 0
    if (form.fullName.trim() && form.jobTitle.trim()) filled++
    if (form.email.trim() || form.phone.trim()) filled++
    if (form.summary.trim().split(/\s+/).filter(Boolean).length >= 15) filled++
    if (form.experience.some(e => e.company.trim() || e.role.trim())) filled++
    if (form.skills.trim()) filled++
    return filled
  }, [form])

  function handleMobilePreview() {
    setMobileShowPreview(true)
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // ---------- Form ----------
  const formSection = (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1a1a1a]">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(progressSections / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-600">{progressSections}/5 sections</span>
      </div>

      {/* Contact Info */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Contact Info</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" required>
            <input className={inputCls} placeholder="Jane Smith" value={form.fullName} onChange={setField('fullName')} />
          </Field>
          <Field label="Job Title / Target Role" required>
            <input className={inputCls} placeholder="Senior Product Designer" value={form.jobTitle} onChange={setField('jobTitle')} />
          </Field>
          <Field label="Email">
            <input className={inputCls} type="email" placeholder="jane@example.com" value={form.email} onChange={setField('email')} />
          </Field>
          <Field label="Phone">
            <input className={inputCls} placeholder="+1 555 000 1234" value={form.phone} onChange={setField('phone')} />
          </Field>
          <Field label="Location" hint="City, Country">
            <input className={inputCls} placeholder="New York, USA" value={form.location} onChange={setField('location')} />
          </Field>
          <Field label="LinkedIn" hint="optional">
            <input className={inputCls} placeholder="linkedin.com/in/janesmith" value={form.linkedin} onChange={setField('linkedin')} />
          </Field>
        </div>
      </div>

      {/* Summary */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Professional Summary</p>
        <textarea
          className={`${inputCls} resize-none`}
          rows={4}
          placeholder="Results-driven product designer with 6+ years of experience building user-centred digital products. Proven track record of..."
          value={form.summary}
          onChange={setField('summary')}
        />
        <p className="mt-1.5 text-xs text-zinc-600">
          {form.summary.trim().split(/\s+/).filter(Boolean).length} words — aim for 30+
        </p>
      </div>

      {/* Work Experience */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Work Experience</p>
        <div className="flex flex-col gap-6">
          {form.experience.map((exp, idx) => (
            <div key={exp.id} className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-zinc-500">Entry {idx + 1}</p>
                {form.experience.length > 1 && (
                  <button
                    onClick={() => removeExp(exp.id)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <TrashIcon />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Company">
                  <input className={inputCls} placeholder="Acme Corp" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                </Field>
                <Field label="Role / Title">
                  <input className={inputCls} placeholder="Software Engineer" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} />
                </Field>
                <Field label="Location" hint="optional">
                  <input className={inputCls} placeholder="Remote / New York" value={exp.location} onChange={e => updateExp(exp.id, 'location', e.target.value)} />
                </Field>
                <div className="flex gap-2">
                  <Field label="Start">
                    <input className={inputCls} placeholder="Jan 2022" value={exp.start} onChange={e => updateExp(exp.id, 'start', e.target.value)} />
                  </Field>
                  <Field label="End">
                    <input
                      className={`${inputCls} ${exp.current ? 'opacity-40 cursor-not-allowed' : ''}`}
                      placeholder="Dec 2024"
                      value={exp.end}
                      disabled={exp.current}
                      onChange={e => updateExp(exp.id, 'end', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  id={`current-${exp.id}`}
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => updateExp(exp.id, 'current', e.target.checked)}
                  className="h-3.5 w-3.5 rounded accent-indigo-500"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs text-zinc-500 cursor-pointer">
                  I currently work here
                </label>
              </div>
              <div className="mt-3">
                <Field label="Bullet Points" hint="one per line, no dash needed">
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={4}
                    placeholder={"Led a team of 5 engineers to deliver 3 major features on time\nReduced page load time by 40% through performance optimizations\nMentored 2 junior developers"}
                    value={exp.bullets}
                    onChange={e => updateExp(exp.id, 'bullets', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addExp}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-dashed border-[#2a2a2a] px-3 py-2 text-xs text-zinc-500 transition-colors hover:border-indigo-500/40 hover:text-indigo-400"
        >
          <PlusIcon />
          Add another experience
        </button>
      </div>

      {/* Education */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Education</p>
        <div className="flex flex-col gap-4">
          {form.education.map((edu, idx) => (
            <div key={edu.id} className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-zinc-500">Entry {idx + 1}</p>
                {form.education.length > 1 && (
                  <button
                    onClick={() => removeEdu(edu.id)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <TrashIcon />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="School / University">
                  <input className={inputCls} placeholder="MIT" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} />
                </Field>
                <Field label="Degree">
                  <input className={inputCls} placeholder="B.Sc." value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                </Field>
                <Field label="Field of Study">
                  <input className={inputCls} placeholder="Computer Science" value={edu.field} onChange={e => updateEdu(edu.id, 'field', e.target.value)} />
                </Field>
                <div className="flex gap-2">
                  <Field label="Start">
                    <input className={inputCls} placeholder="2018" value={edu.start} onChange={e => updateEdu(edu.id, 'start', e.target.value)} />
                  </Field>
                  <Field label="End">
                    <input className={inputCls} placeholder="2022" value={edu.end} onChange={e => updateEdu(edu.id, 'end', e.target.value)} />
                  </Field>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addEdu}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-dashed border-[#2a2a2a] px-3 py-2 text-xs text-zinc-500 transition-colors hover:border-indigo-500/40 hover:text-indigo-400"
        >
          <PlusIcon />
          Add another education entry
        </button>
      </div>

      {/* Skills */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Skills</p>
        <Field label="Skills" hint="comma-separated">
          <input
            className={inputCls}
            placeholder="React, TypeScript, Node.js, Figma, SQL"
            value={form.skills}
            onChange={setField('skills')}
          />
        </Field>
        {form.skills.trim() && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
              <span key={i} className="rounded-md border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 text-xs text-indigo-300">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className={sectionCard}>
        <p className={sectionHeader}>Certifications <span className="normal-case font-normal tracking-normal text-zinc-700">(optional)</span></p>
        <Field label="Certifications" hint="one per line">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder={"AWS Certified Solutions Architect\nGoogle Analytics Certified\nPMP — Project Management Professional"}
            value={form.certifications}
            onChange={setField('certifications')}
          />
        </Field>
      </div>

      {/* Mobile preview button */}
      <div className="lg:hidden">
        <button
          onClick={handleMobilePreview}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Preview Resume
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="min-w-0">
          {formSection}
        </div>

        {/* Right: Preview — desktop only, sticky */}
        <div className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4">
            <ResumePreview form={form} />
            <StrengthCard form={form} />
            <button
              onClick={() => downloadPdf(form)}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: preview + strength below form */}
      {mobileShowPreview && (
        <div ref={previewRef} className="lg:hidden flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
            <p className="text-sm font-medium text-indigo-400">Resume Preview</p>
            <button onClick={() => setMobileShowPreview(false)} className="text-xs text-zinc-500 underline hover:text-zinc-300">
              Hide
            </button>
          </div>
          <ResumePreview form={form} />
          <StrengthCard form={form} />
          <button
            onClick={() => downloadPdf(form)}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  )
}
