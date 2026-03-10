import { useState } from 'react'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function currency(n) {
  return Number(n || 0).toLocaleString('en-IN')
}

export default function OfferLetterGenerator() {
  const today = new Date().toISOString().split('T')[0]
  const [f, setF] = useState({
    companyName: '', companyAddress: '', hrName: '', hrTitle: 'HR Manager',
    candidateName: '', candidateAddress: '',
    role: '', department: '', reportingTo: '',
    ctc: '', joiningDate: '', offerExpiryDate: '',
    letterDate: today,
    probation: '6 months',
  })

  function field(key, val) { setF((p) => ({ ...p, [key]: val })) }

  const letter = `${f.letterDate || '[Date]'}

${f.candidateName || '[Candidate Name]'}
${f.candidateAddress || '[Candidate Address]'}

Dear ${f.candidateName || '[Candidate Name]'},

Subject: Offer of Employment — ${f.role || '[Role]'}

We are delighted to offer you the position of ${f.role || '[Role]'} in the ${f.department || '[Department]'} department at ${f.companyName || '[Company Name]'}.

Employment Details:
  Position       : ${f.role || '[Role]'}
  Department     : ${f.department || '[Department]'}
  Reporting To   : ${f.reportingTo || '[Manager Name]'}
  Date of Joining: ${f.joiningDate || '[Joining Date]'}
  CTC (Per Annum): ₹ ${f.ctc ? currency(f.ctc) : '[CTC]'}
  Probation Period: ${f.probation}

This offer is subject to satisfactory reference checks, background verification, and submission of required documents.

Please sign and return this letter as acceptance of the offer on or before ${f.offerExpiryDate || '[Offer Expiry Date]'}.

We look forward to welcoming you to ${f.companyName || '[Company Name]'} and are excited about the contributions you will make.

Yours sincerely,

${f.hrName || '[HR Name]'}
${f.hrTitle}
${f.companyName || '[Company Name]'}
${f.companyAddress || ''}

______________________________
Accepted by: ${f.candidateName || '[Candidate Name]'}
Date: ___________________________
Signature: _______________________`

  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(letter).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Offer Letter</title><style>
      body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:40px;line-height:1.7}
      pre{font-family:inherit;white-space:pre-wrap;margin:0}
    </style></head><body><pre>${escapeHtml(letter)}</pre></body></html>`)
    win.document.close()
    win.print()
  }

  const fields = [
    ['companyName','Company Name'],['companyAddress','Company Address'],
    ['hrName','HR Name'],['hrTitle','HR Title'],
    ['candidateName','Candidate Name'],['candidateAddress','Candidate Address'],
    ['role','Job Role / Position'],['department','Department'],['reportingTo','Reporting To (Manager)'],
    ['ctc','CTC Per Annum (₹)'],['joiningDate','Date of Joining'],
    ['offerExpiryDate','Offer Expiry Date'],['probation','Probation Period'],
    ['letterDate','Letter Date'],
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Fill in Details</label>
        {fields.map(([key, label]) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-600">{label}</span>
            <input
              type={['joiningDate','offerExpiryDate','letterDate'].includes(key) ? 'date' : key === 'ctc' ? 'number' : 'text'}
              value={f[key]}
              onChange={(e) => field(key, e.target.value)}
              placeholder={label}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none"
            />
          </div>
        ))}
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
