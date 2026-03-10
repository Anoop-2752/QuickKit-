import { useState, useMemo } from 'react'

const QUESTION_BANK = {
  general: {
    label: 'General / Behavioural',
    color: 'rose',
    questions: {
      junior:  ['Tell me about yourself.', 'Why do you want to work here?', 'What are your strengths and weaknesses?', 'Where do you see yourself in 5 years?', 'Why are you leaving your current job?', 'Describe a challenge you faced and how you overcame it.', 'What motivates you at work?', 'How do you handle feedback and criticism?', 'Tell me about a time you worked in a team.', 'What do you know about our company?'],
      mid:     ['Describe a time you led a project under pressure.', 'How do you prioritise competing deadlines?', 'Tell me about a conflict with a colleague and how you resolved it.', 'Describe your biggest professional failure and what you learned.', 'How do you stay updated in your field?', 'Tell me about a time you influenced a decision without authority.', 'How do you handle ambiguity?', 'Describe a time you had to adapt quickly to change.', 'What is your management style?', 'Give an example of a time you went above and beyond.'],
      senior:  ['How do you build and maintain high-performing teams?', 'Describe your approach to strategic planning.', 'Tell me about a time you drove significant organisational change.', 'How do you handle underperforming team members?', 'What is your philosophy on mentoring and developing talent?', 'Describe a time you had to make a difficult decision with limited information.', 'How do you align team goals with company objectives?', 'Tell me about a time you managed multiple stakeholders with conflicting interests.', 'What metrics do you use to measure team success?', 'How do you foster a culture of innovation?'],
    },
  },
  engineering: {
    label: 'Software Engineering',
    color: 'blue',
    questions: {
      junior:  ['What is the difference between a stack and a queue?', 'Explain REST APIs in simple terms.', 'What is version control and why is it important?', 'What is the difference between SQL and NoSQL?', 'Explain what a design pattern is.', 'What is the difference between GET and POST requests?', 'What is object-oriented programming?', 'Explain what Big O notation means.', 'What is the difference between frontend and backend?', 'How would you debug a production issue?'],
      mid:     ['Explain SOLID principles with examples.', 'What is CI/CD and how have you implemented it?', 'How do you approach database query optimisation?', 'What is microservices architecture and when would you use it?', 'Explain the CAP theorem.', 'How do you ensure code quality in your team?', 'What is your approach to writing tests?', 'Describe a system you designed and the trade-offs you made.', 'How do you handle technical debt?', 'What is Docker and how does containerisation help?'],
      senior:  ['How do you design a system to handle 10 million daily users?', 'Describe your approach to system architecture decisions.', 'How do you evaluate build vs buy decisions?', 'What is your approach to API versioning and backward compatibility?', 'How do you handle distributed system failures?', 'Describe your experience with event-driven architecture.', 'How do you approach security in system design?', 'What is your approach to on-call and incident management?', 'How do you evaluate new technologies for adoption?', 'Describe how you have grown engineering culture in a team.'],
    },
  },
  marketing: {
    label: 'Marketing',
    color: 'purple',
    questions: {
      junior:  ['What digital marketing channels are you familiar with?', 'What is SEO and how does it work?', 'Explain what a marketing funnel is.', 'What metrics would you track for a social media campaign?', 'What is the difference between organic and paid traffic?', 'How do you define a target audience?', 'What tools have you used for email marketing?', 'What is A/B testing?', 'Describe a successful campaign you ran.', 'How do you measure marketing ROI?'],
      mid:     ['How do you build a content marketing strategy from scratch?', 'Describe your experience with performance marketing.', 'How do you manage a marketing budget across channels?', 'What is your approach to brand positioning?', 'How do you use data to drive marketing decisions?', 'Describe a campaign that underperformed and what you learned.', 'How do you align marketing efforts with sales goals?', 'What is your experience with marketing automation?', 'How do you approach influencer marketing?', 'Describe how you would launch a new product.'],
      senior:  ['How do you build a marketing department from scratch?', 'Describe your approach to brand strategy at a company level.', 'How do you evaluate and allocate large marketing budgets?', 'What is your approach to building a demand generation engine?', 'How do you measure and prove marketing attribution?', 'Describe how you have managed agency relationships.', 'How do you align marketing strategy with business objectives?', 'What is your experience with international/global marketing?', 'How do you build a data-driven marketing culture?', 'Describe how you have led marketing through a company rebrand.'],
    },
  },
  sales: {
    label: 'Sales',
    color: 'green',
    questions: {
      junior:  ['How do you handle rejection from a prospect?', 'What is your sales process?', 'How do you qualify a lead?', 'Describe your experience with cold calling.', 'What CRM tools have you used?', 'How do you prepare for a sales call?', 'What is your biggest sales achievement?', 'How do you build rapport with a potential client?', 'What do you do when a prospect goes silent?', 'How do you stay motivated in sales?'],
      mid:     ['Describe your full sales cycle from lead to close.', 'How do you manage a large pipeline?', 'What is your approach to negotiation?', 'How do you handle an objection about price?', 'Describe a deal you saved from falling through.', 'How do you build long-term client relationships?', 'What is your upselling and cross-selling strategy?', 'How do you forecast sales accurately?', 'Describe how you have hit or exceeded quota.', 'How do you collaborate with marketing?'],
      senior:  ['How do you build and scale a sales team?', 'Describe your approach to sales strategy.', 'How do you manage enterprise accounts?', 'What is your experience with channel or partner sales?', 'How do you define and track sales KPIs?', 'Describe how you have entered a new market.', 'How do you build a sales playbook?', 'What is your approach to sales enablement?', 'How do you handle a declining sales team performance?', 'Describe how you have driven revenue growth.'],
    },
  },
  design: {
    label: 'Design (UX/UI)',
    color: 'amber',
    questions: {
      junior:  ['Walk me through your design process.', 'What design tools do you use?', 'What is the difference between UX and UI?', 'How do you conduct user research?', 'What is a wireframe and when do you use it?', 'How do you handle feedback on your designs?', 'Describe a project in your portfolio.', 'What is accessibility in design?', 'How do you approach mobile-first design?', 'What design trends are you following?'],
      mid:     ['How do you balance user needs with business goals?', 'Describe your end-to-end design process on a recent project.', 'How do you present and defend your design decisions?', 'What is your approach to usability testing?', 'How do you work with developers to ensure design accuracy?', 'Describe a time you redesigned a product and the outcome.', 'How do you build and maintain a design system?', 'What metrics do you use to measure design success?', 'How do you handle stakeholder disagreements on design?', 'Describe how you have contributed to the product roadmap.'],
      senior:  ['How do you build and lead a design team?', 'Describe your approach to design strategy.', 'How do you establish design maturity in an organisation?', 'What is your approach to design operations (DesignOps)?', 'How do you align design goals with business strategy?', 'Describe how you have influenced product direction.', 'How do you build a user-centred culture in a company?', 'What is your experience with design at scale?', 'How do you hire and develop designers?', 'Describe how you have navigated design in a startup vs enterprise.'],
    },
  },
  finance: {
    label: 'Finance / Accounting',
    color: 'cyan',
    questions: {
      junior:  ['What is the difference between debit and credit?', 'Explain accounts receivable vs accounts payable.', 'What is a balance sheet?', 'What is cash flow and why is it important?', 'What accounting software have you used?', 'What is depreciation?', 'Explain the difference between gross profit and net profit.', 'What is a journal entry?', 'How do you reconcile accounts?', 'What is the difference between GAAP and IFRS?'],
      mid:     ['How do you approach financial forecasting?', 'Describe your experience with budgeting and variance analysis.', 'How do you handle month-end close?', 'What is your experience with financial reporting?', 'How do you identify and report financial risks?', 'Describe your experience with audits.', 'How do you ensure compliance with financial regulations?', 'What is working capital management?', 'Describe how you have improved a financial process.', 'How do you communicate financial data to non-finance stakeholders?'],
      senior:  ['How do you build a financial planning and analysis function?', 'Describe your experience with M&A due diligence.', 'How do you manage investor relations?', 'What is your approach to capital allocation?', 'How do you lead a company through a financial restructuring?', 'Describe your experience with fundraising.', 'How do you build financial controls and governance?', 'What is your approach to treasury management?', 'How do you align financial strategy with business objectives?', 'Describe your experience reporting to a board.'],
    },
  },
}

const LEVEL_LABELS = { junior: 'Junior', mid: 'Mid-level', senior: 'Senior' }
const COLOR_MAP = {
  rose:   'border-rose-500/20 bg-rose-500/10 text-rose-400',
  blue:   'border-blue-500/20 bg-blue-500/10 text-blue-400',
  purple: 'border-purple-500/20 bg-purple-500/10 text-purple-400',
  green:  'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  amber:  'border-amber-500/20 bg-amber-500/10 text-amber-400',
  cyan:   'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',
}

export default function InterviewQuestionGenerator() {
  const [category, setCategory] = useState('general')
  const [level, setLevel]       = useState('mid')
  const [copied, setCopied]     = useState(null)

  const questions = useMemo(() =>
    QUESTION_BANK[category]?.questions[level] || [],
    [category, level]
  )

  async function handleCopy(text, key) {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleCopyAll() {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
    await handleCopy(text, 'all')
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-zinc-600">
        Select a job category and seniority level to get curated interview questions.
      </p>

      {/* Category selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Job Category</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(QUESTION_BANK).map(([key, val]) => {
            const colorClass = COLOR_MAP[val.color] || COLOR_MAP.rose
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  category === key ? colorClass : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {val.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Level selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">Seniority Level</label>
        <div className="flex gap-2">
          {Object.entries(LEVEL_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                level === key
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                  : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {questions.length} Questions — {QUESTION_BANK[category].label} · {LEVEL_LABELS[level]}
          </span>
          <button
            onClick={handleCopyAll}
            className="text-xs text-zinc-600 hover:text-rose-400 transition-colors"
          >
            {copied === 'all' ? '✓ Copied all' : 'Copy all'}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-3 group"
            >
              <span className="mt-0.5 min-w-[1.5rem] text-xs font-mono font-medium text-zinc-700">{i + 1}.</span>
              <span className="flex-1 text-sm text-zinc-300">{q}</span>
              <button
                onClick={() => handleCopy(q, i)}
                className="shrink-0 text-xs text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all"
              >
                {copied === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
