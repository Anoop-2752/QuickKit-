import { useState } from 'react'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function ExperienceLetterGenerator() {
  const today = new Date().toISOString().split('T')[0]
  const [f, setF] = useState({
    companyName: '', companyAddress: '', hrName: '', hrTitle: 'HR Manager',
    employeeName: '', employeeId: '', role: '', department: '',
    joiningDate: '', lastWorkingDate: '',
    letterDate: today,
    conduct: 'good',
  })

  function field(key, val) { setF((p) => ({ ...p, [key]: val })) }

  function fmt(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  function tenure() {
    if (!f.joiningDate || !f.lastWorkingDate) return null
    const ms = new Date(f.lastWorkingDate) - new Date(f.joiningDate)
    if (ms <= 0) return null
    const days   = Math.floor(ms / 86400000)
    const years  = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    const parts  = []
    if (years)  parts.push(`${years} year${years !== 1 ? 's' : ''}`)
    if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`)
    return parts.length ? parts.join(' and ') : `${days} days`
  }

  const conductMap = {
    good:      'good conduct and dedication',
    excellent: 'excellent conduct, professionalism, and dedication',
    satisfactory: 'satisfactory conduct during the tenure',
  }

  const letter = `${fmt(f.letterDate) || '[Date]'}

To Whom It May Concern,

Subject: Experience Letter — ${f.employeeName || '[Employee Name]'}

This is to certify that ${f.employeeName || '[Employee Name]'}${f.employeeId ? ` (Employee ID: ${f.employeeId})` : ''} was employed with ${f.companyName || '[Company Name]'} as ${f.role || '[Role]'}${f.department ? ` in the ${f.department} department` : ''}.

${f.employeeName || '[Employee Name]'} joined our organisation on ${fmt(f.joiningDate) || '[Joining Date]'} and served until ${fmt(f.lastWorkingDate) || '[Last Working Date]'}${tenure() ? `, a tenure of ${tenure()}` : ''}.

During this period, ${f.employeeName || '[Employee Name]'} demonstrated ${conductMap[f.conduct]}. We found them to be a sincere and hardworking individual who contributed positively to the team.

We wish ${f.employeeName || '[Employee Name]'} all the best in their future endeavours and would be happy to serve as a reference.

Yours sincerely,

${f.hrName || '[HR Name]'}
${f.hrTitle}
${f.companyName || '[Company Name]'}
${f.companyAddress || ''}`

  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(letter).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Experience Letter</title><style>
      body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:40px;line-height:1.7}
      pre{font-family:inherit;white-space:pre-wrap;margin:0}
    </style></head><body><pre>${escapeHtml(letter)}</pre></body></html>`)
    win.document.close()
    win.print()
  }

  const textFields = [
    ['companyName','Company Name'],['companyAddress','Company Address'],
    ['hrName','HR Name'],['hrTitle','HR Title'],
    ['employeeName','Employee Name'],['employeeId','Employee ID (optional)'],
    ['role','Job Role / Position'],['department','Department (optional)'],
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Fill in Details</label>

        {textFields.map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600">{label}</span>
            <input
              type="text"
              value={f[key]}
              onChange={(e) => field(key, e.target.value)}
              placeholder={label}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none"
            />
          </div>
        ))}

        {[['joiningDate','Date of Joining'],['lastWorkingDate','Last Working Date'],['letterDate','Letter Date']].map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600">{label}</span>
            <input
              type="date"
              value={f[key]}
              onChange={(e) => field(key, e.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:border-rose-500/50 focus:outline-none"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-600">Employee Conduct</span>
          <select
            value={f.conduct}
            onChange={(e) => field('conduct', e.target.value)}
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:border-rose-500/50 focus:outline-none"
          >
            <option value="good">Good</option>
            <option value="excellent">Excellent</option>
            <option value="satisfactory">Satisfactory</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Preview</label>
          <button onClick={handleCopy} className="text-xs text-zinc-600 hover:text-rose-400 transition-colors">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre className="flex-1 min-h-96 overflow-auto rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 font-sans text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
          {letter}
        </pre>
        <button onClick={handlePrint} className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500">
          Print / Download
        </button>
      </div>
    </div>
  )
}
