import { useState } from 'react'

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default function ResignationLetterGenerator() {
  const today = new Date().toISOString().split('T')[0]
  const [f, setF] = useState({
    yourName: '', role: '', department: '',
    managerName: '', managerTitle: 'Manager',
    companyName: '',
    lastWorkingDate: '',
    letterDate: today,
    tone: 'formal',
    reason: '',
  })

  function field(key, val) { setF((p) => ({ ...p, [key]: val })) }

  function fmt(dateStr) {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const reasonLine = f.reason
    ? `\nI am resigning to ${f.reason}.\n`
    : ''

  const toneClosing = {
    formal: `I am grateful for the opportunities for professional growth that ${f.companyName || '[Company Name]'} has provided me. I have enjoyed working here and will always look back fondly on my time with the team.

I will do my utmost to ensure a smooth handover and will complete all pending tasks before my last day.`,
    brief: `Thank you for the opportunity to be part of ${f.companyName || '[Company Name]'}.

I will ensure a smooth transition of my responsibilities before my last day.`,
    warm: `Working at ${f.companyName || '[Company Name]'} has been a truly rewarding experience. The support and mentorship I have received here have shaped me professionally, and I am deeply grateful.

I am committed to making this transition as smooth as possible and will do everything I can to hand over my responsibilities effectively.`,
  }

  const letter = `${fmt(f.letterDate) || '[Date]'}

${f.managerName || '[Manager Name]'}
${f.managerTitle}
${f.companyName || '[Company Name]'}

Dear ${f.managerName || '[Manager Name]'},

Subject: Resignation — ${f.role || '[Role]'}

I am writing to formally inform you of my resignation from the position of ${f.role || '[Role]'}${f.department ? ` in the ${f.department} department` : ''} at ${f.companyName || '[Company Name]'}, effective ${fmt(f.lastWorkingDate) || '[Last Working Date]'}.
${reasonLine}
${toneClosing[f.tone]}

Please let me know how I can assist during the transition period.

Yours sincerely,

${f.yourName || '[Your Name]'}
${f.role || '[Role]'}
${f.companyName || '[Company Name]'}`

  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(letter).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handlePrint() {
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Resignation Letter</title><style>
      body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:40px;line-height:1.7}
      pre{font-family:inherit;white-space:pre-wrap;margin:0}
    </style></head><body><pre>${escapeHtml(letter)}</pre></body></html>`)
    win.document.close()
    win.print()
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Fill in Details</label>

        {[
          ['yourName','Your Name'],['role','Your Job Role / Position'],['department','Department (optional)'],
          ['managerName','Manager / Recipient Name'],['managerTitle','Manager Title'],['companyName','Company Name'],
        ].map(([key, label]) => (
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

        {[['lastWorkingDate','Last Working Date'],['letterDate','Letter Date']].map(([key, label]) => (
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
          <span className="text-xs text-zinc-600">Reason (optional — e.g. "pursue a new opportunity")</span>
          <input
            type="text"
            value={f.reason}
            onChange={(e) => field('reason', e.target.value)}
            placeholder="pursue a new opportunity"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-600">Tone</span>
          <div className="flex gap-2">
            {[['formal','Formal'],['warm','Warm'],['brief','Brief']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => field('tone', val)}
                className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${
                  f.tone === val
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                    : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
