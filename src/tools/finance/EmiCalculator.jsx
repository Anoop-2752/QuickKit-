import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate]           = useState('')
  const [tenure, setTenure]       = useState('')
  const [tenureType, setTenureType] = useState('years') // years | months
  const [showTable, setShowTable] = useState(false)

  const result = useMemo(() => {
    const P = parseFloat(principal)
    const annualRate = parseFloat(rate)
    const t = parseFloat(tenure)
    if (!P || !annualRate || !t) return null

    const months = tenureType === 'years' ? t * 12 : t
    const r = annualRate / 12 / 100
    const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
    const totalPayment = emi * months
    const totalInterest = totalPayment - P

    // Amortization schedule
    let balance = P
    const schedule = []
    for (let m = 1; m <= months; m++) {
      const interest  = balance * r
      const principal = emi - interest
      balance -= principal
      schedule.push({
        month: m,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      })
    }

    return { emi, totalPayment, totalInterest, months, schedule }
  }, [principal, rate, tenure, tenureType])

  const interestPct = result ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Loan Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 5000000"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            step="0.1"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Loan Tenure</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 20"
              className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
            />
            <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
              {['years','months'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenureType(t)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    tenureType === t ? 'bg-[var(--accent)] text-[var(--accent-on)]' : 'text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                  }`}
                >
                  {t === 'years' ? 'Yr' : 'Mo'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Monthly EMI',      value: `₹ ${cur(result.emi)}`,           highlight: true },
              { label: 'Principal Amount', value: `₹ ${cur(parseFloat(principal))}` },
              { label: 'Total Interest',   value: `₹ ${cur(result.totalInterest)}` },
              { label: 'Total Payment',    value: `₹ ${cur(result.totalPayment)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}>
                <p className="mb-1 text-xs text-[var(--ink-body)]">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>Principal ({(100 - parseFloat(interestPct)).toFixed(1)}%)</span>
              <span>Interest ({interestPct}%)</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--accent-weak)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${100 - parseFloat(interestPct)}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs text-[var(--ink-muted)]">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />Principal</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-weak)]" />Interest</span>
            </div>
          </div>

          {/* Amortization toggle */}
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full rounded-lg border border-[var(--line)] py-2.5 text-sm text-[var(--ink-body)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {showTable ? 'Hide' : 'Show'} Full Amortization Schedule ({result.months} months)
          </button>

          {showTable && (
            <div className="overflow-auto rounded-xl border border-[var(--line)]">
              <table className="w-full text-xs">
                <thead className="border-b border-[var(--line)] bg-[var(--surface-alt)]">
                  <tr>
                    {['Month','EMI (₹)','Principal (₹)','Interest (₹)','Balance (₹)'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--ink-body)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-b border-[var(--surface-tint)] hover:bg-[var(--surface-alt)]">
                      <td className="px-4 py-2 text-[var(--ink-body)]">{row.month}</td>
                      <td className="px-4 py-2 text-[var(--ink-strong)]">{cur(row.emi)}</td>
                      <td className="px-4 py-2 text-[var(--accent)]">{cur(row.principal)}</td>
                      <td className="px-4 py-2 text-[var(--ink-body)]">{cur(row.interest)}</td>
                      <td className="px-4 py-2 text-[var(--ink-strong)]">{cur(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter loan details above to calculate EMI
        </div>
      )}
    </div>
  )
}
