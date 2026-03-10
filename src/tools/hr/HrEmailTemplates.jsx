import { useState } from 'react'

const TEMPLATES = [
  {
    id: 'interview-invite',
    label: 'Interview Invitation',
    fields: ['candidateName', 'role', 'companyName', 'interviewDate', 'interviewTime', 'interviewMode', 'interviewerName', 'hrName'],
    subject: (f) => `Interview Invitation — ${f.role} at ${f.companyName}`,
    body: (f) => `Dear ${f.candidateName},

Thank you for your interest in the ${f.role} position at ${f.companyName}. We were impressed by your profile and would like to invite you for an interview.

Interview Details:
  Date: ${f.interviewDate}
  Time: ${f.interviewTime}
  Mode: ${f.interviewMode}
  Interviewer: ${f.interviewerName}

Please confirm your availability by replying to this email. If you have any questions, feel free to reach out.

We look forward to speaking with you.

Best regards,
${f.hrName}
${f.companyName}`,
  },
  {
    id: 'rejection',
    label: 'Rejection Letter',
    fields: ['candidateName', 'role', 'companyName', 'hrName'],
    subject: (f) => `Application Update — ${f.role} at ${f.companyName}`,
    body: (f) => `Dear ${f.candidateName},

Thank you for taking the time to apply for the ${f.role} position at ${f.companyName} and for your interest in joining our team.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. This was a difficult decision as we had many qualified candidates.

We encourage you to apply for future openings that match your skills and experience. We wish you the very best in your job search.

Thank you once again for your interest in ${f.companyName}.

Kind regards,
${f.hrName}
${f.companyName}`,
  },
  {
    id: 'offer-acceptance',
    label: 'Offer Acceptance Confirmation',
    fields: ['candidateName', 'role', 'joiningDate', 'companyName', 'hrName'],
    subject: (f) => `Offer Acceptance Confirmed — ${f.role}`,
    body: (f) => `Dear ${f.candidateName},

We are delighted to confirm that you have accepted our offer for the position of ${f.role} at ${f.companyName}.

Your joining date is confirmed as ${f.joiningDate}. Please report to the HR department on your first day.

Documents to bring on Day 1:
  - Government-issued photo ID
  - Educational certificates (originals and copies)
  - Previous employment documents
  - Bank account details for payroll setup
  - Recent passport-size photographs

We are excited to have you join our team. Please do not hesitate to reach out if you have any questions before your start date.

Welcome aboard!

Warm regards,
${f.hrName}
${f.companyName}`,
  },
  {
    id: 'welcome',
    label: 'Welcome Onboarding Email',
    fields: ['employeeName', 'role', 'department', 'managerName', 'joiningDate', 'companyName', 'hrName'],
    subject: (f) => `Welcome to ${f.companyName}, ${f.employeeName}!`,
    body: (f) => `Dear ${f.employeeName},

Welcome to ${f.companyName}! We are thrilled to have you join us as ${f.role} in the ${f.department} department.

Your first day is ${f.joiningDate}. Your manager will be ${f.managerName}, who will guide you through your onboarding.

On your first day you can expect:
  - Office/system setup
  - Team introductions
  - HR orientation
  - Review of company policies and tools

If you have any questions before you start, please feel free to reach out to me directly.

Once again, welcome to the team — we're excited for the journey ahead!

Best regards,
${f.hrName}
HR Department, ${f.companyName}`,
  },
  {
    id: 'warning',
    label: 'Warning Letter',
    fields: ['employeeName', 'employeeId', 'department', 'issueDescription', 'issueDate', 'companyName', 'hrName'],
    subject: (f) => `Official Warning Letter — ${f.employeeName}`,
    body: (f) => `Dear ${f.employeeName},

This letter serves as a formal warning regarding the following matter:

Employee ID: ${f.employeeId}
Department: ${f.department}
Issue: ${f.issueDescription}
Date of Incident: ${f.issueDate}

This behaviour is in violation of company policy and is not acceptable. We expect an immediate improvement in your conduct.

Please be aware that further violations may result in more serious disciplinary action, up to and including termination of employment.

You are requested to acknowledge receipt of this letter by signing and returning a copy.

Regards,
${f.hrName}
HR Department, ${f.companyName}`,
  },
  {
    id: 'relieving',
    label: 'Last Day / Relieving Email',
    fields: ['employeeName', 'role', 'lastWorkingDate', 'companyName', 'hrName'],
    subject: (f) => `Last Working Day — ${f.employeeName}`,
    body: (f) => `Dear ${f.employeeName},

As discussed, today, ${f.lastWorkingDate}, is your last working day at ${f.companyName}.

We want to take this opportunity to thank you for your contributions and dedication during your tenure as ${f.role}. Your hard work has been valued and appreciated.

Please ensure all company assets, access cards, and equipment are returned to the IT/Admin team before you leave today. Your full and final settlement will be processed as per company policy.

We wish you all the best in your future endeavours. Please stay in touch!

Warm regards,
${f.hrName}
HR Department, ${f.companyName}`,
  },
]

const FIELD_LABELS = {
  candidateName: 'Candidate Name',
  employeeName: 'Employee Name',
  employeeId: 'Employee ID',
  role: 'Job Role / Position',
  department: 'Department',
  companyName: 'Company Name',
  interviewDate: 'Interview Date',
  interviewTime: 'Interview Time',
  interviewMode: 'Interview Mode (e.g. Video Call / In-person)',
  interviewerName: 'Interviewer Name',
  hrName: 'HR Name',
  joiningDate: 'Joining Date',
  managerName: 'Manager Name',
  lastWorkingDate: 'Last Working Date',
  issueDescription: 'Issue Description',
  issueDate: 'Date of Incident',
}

export default function HrEmailTemplates() {
  const [selected, setSelected] = useState(TEMPLATES[0])
  const [fields, setFields]     = useState({})
  const [copied, setCopied]     = useState(null)

  function handleSelect(tpl) {
    setSelected(tpl)
    setFields({})
    setCopied(null)
  }

  function handleField(key, val) {
    setFields((f) => ({ ...f, [key]: val }))
  }

  function filled(key) {
    return fields[key] || `[${FIELD_LABELS[key] || key}]`
  }

  const subject = selected.subject(new Proxy({}, { get: (_, k) => filled(k) }))
  const body    = selected.body(new Proxy({}, { get: (_, k) => filled(k) }))

  async function handleCopy(text, key) {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Template selector */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => handleSelect(tpl)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              selected.id === tpl.id
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tpl.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Fields */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Fill in Details</label>
          {selected.fields.map((key) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">{FIELD_LABELS[key] || key}</span>
              <input
                value={fields[key] || ''}
                onChange={(e) => handleField(key, e.target.value)}
                placeholder={FIELD_LABELS[key] || key}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Preview</label>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">Subject</span>
              <button
                onClick={() => handleCopy(subject, 'subject')}
                className="text-xs text-zinc-600 hover:text-rose-400 transition-colors"
              >
                {copied === 'subject' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-300">
              {subject}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">Email Body</span>
              <button
                onClick={() => handleCopy(body, 'body')}
                className="text-xs text-zinc-600 hover:text-rose-400 transition-colors"
              >
                {copied === 'body' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <pre className="h-72 overflow-auto rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-3 font-sans text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {body}
            </pre>
          </div>

          <button
            onClick={() => handleCopy(`Subject: ${subject}\n\n${body}`, 'all')}
            className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500"
          >
            {copied === 'all' ? '✓ Copied!' : 'Copy Full Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
