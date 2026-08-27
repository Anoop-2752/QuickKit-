import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

const COMPOUNDING = [
  { label: 'Monthly',    n: 12 },
  { label: 'Quarterly',  n: 4  },
  { label: 'Half-Yearly',n: 2  },
  { label: 'Yearly',     n: 1  },
]

export default function FdRdCalculator() {
  const [mode, setMode]       = useState('fd')  // fd | rd
  const [principal, setPrincipal] = useState('')
  const [rate, setRate]       = useState('')
  const [years, setYears]     = useState('')
  const [months, setMonths]   = useState('')
  const [compFreq, setCompFreq] = useState(4) // quarterly
  const [senior, setSenior]   = useState(false)
  const SENIOR_BONUS = 0.5 // 0.5% extra for senior citizens

  const result = useMemo(() => {
    const P  = parseFloat(principal) || 0
    const baseRate = parseFloat(rate) || 0
    const y  = parseFloat(years) || 0
    const m  = parseFloat(months) || 0
    if (!P || !baseRate || (!y && !m)) return null

    const r  = baseRate + (senior ? SENIOR_BONUS : 0)
    const t  = y + m / 12 // total years
    const n  = compFreq

    if (mode === 'fd') {
      const maturity = P * Math.pow(1 + r / (n * 100), n * t)
      const interest = maturity - P
      return { maturity, interest, principal: P, type: 'FD', rate: r, t }
    } else {
      // RD: each monthly deposit compounds for remaining period
      const totalMonths = Math.round(t * 12)
      let maturity = 0
      for (let i = 1; i <= totalMonths; i++) {
        const remainingYears = (totalMonths - i + 1) / 12
        maturity += P * Math.pow(1 + r / (n * 100), n * remainingYears)
      }
      const invested = P * totalMonths
      const interest = maturity - invested
      return { maturity, interest, principal: invested, type: 'RD', rate: r, t }
    }
  }, [principal, rate, years, months, compFreq, senior, mode])

  return (
    <div className="flex flex-col gap-6">
      {/* Mode selector */}
      <div className="flex gap-2">
        {[['fd','Fixed Deposit (FD)'],['rd','Recurring Deposit (RD)']].map(([val, label]) => (
          <button key={val} onClick={() => setMode(val)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              mode === val ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]' : 'border-[var(--line)] text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">
            {mode === 'fd' ? 'Principal Amount (₹)' : 'Monthly Deposit (₹)'}
          </label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)}
            placeholder={mode === 'fd' ? 'e.g. 100000' : 'e.g. 5000'}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Annual Interest Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 7.5" step="0.1"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none" />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[var(--ink-body)]">Years</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 5"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[var(--ink-body)]">Months</label>
            <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="e.g. 6"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none" />
          </div>
        </div>

        {mode === 'fd' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Compounding Frequency</label>
            <div className="flex flex-wrap gap-2">
              {COMPOUNDING.map(({ label, n }) => (
                <button key={n} onClick={() => setCompFreq(n)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    compFreq === n ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]' : 'border-[var(--line)] text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Account Type</label>
          <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
            {[[false,'Regular'],[true,'Senior Citizen (+0.5%)']].map(([val, label]) => (
              <button key={label} onClick={() => setSenior(val)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${senior === val ? 'bg-[var(--accent)] text-[var(--accent-on)]' : 'text-[var(--ink-body)] hover:text-[var(--ink-strong)]'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'Maturity Amount',   value: `₹ ${cur(result.maturity)}`,  highlight: true },
              { label: mode === 'fd' ? 'Principal' : 'Total Invested', value: `₹ ${cur(result.principal)}` },
              { label: 'Interest Earned',   value: `₹ ${cur(result.interest)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}>
                <p className="mb-1 text-xs text-[var(--ink-body)]">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--accent)]">
              <div className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${(result.principal / result.maturity) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>Principal — {((result.principal / result.maturity) * 100).toFixed(1)}%</span>
              <span>Interest — {((result.interest / result.maturity) * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 text-xs">
            <p className="mb-2 text-[var(--ink-body)] font-medium">Note</p>
            <p className="text-[var(--ink-muted)]">TDS is deducted at 10% on interest above ₹40,000/year (₹50,000 for senior citizens). Submit Form 15G/15H if income is below taxable limit to avoid TDS.</p>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter deposit details above to calculate maturity amount
        </div>
      )}
    </div>
  )
}
