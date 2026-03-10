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
          <label className="text-xs text-zinc-500">Loan Amount (₹)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g. 5000000"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 8.5"
            step="0.1"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Loan Tenure</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 20"
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none"
            />
            <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
              {['years','months'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenureType(t)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    tenureType === t ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
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
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
                <p className="mb-1 text-xs text-zinc-500">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-amber-400' : 'text-zinc-200'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Principal ({(100 - parseFloat(interestPct)).toFixed(1)}%)</span>
              <span>Interest ({interestPct}%)</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${100 - parseFloat(interestPct)}%` }}
              />
            </div>
            <div className="flex gap-4 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" />Principal</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#1a1a1a] border border-zinc-700" />Interest</span>
            </div>
          </div>

          {/* Amortization toggle */}
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full rounded-lg border border-[#2a2a2a] py-2.5 text-sm text-zinc-400 transition-colors hover:border-amber-500/40 hover:text-amber-400"
          >
            {showTable ? 'Hide' : 'Show'} Full Amortization Schedule ({result.months} months)
          </button>

          {showTable && (
            <div className="overflow-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full text-xs">
                <thead className="border-b border-[#2a2a2a] bg-[#141414]">
                  <tr>
                    {['Month','EMI (₹)','Principal (₹)','Interest (₹)','Balance (₹)'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-b border-[#1a1a1a] hover:bg-[#141414]">
                      <td className="px-4 py-2 text-zinc-500">{row.month}</td>
                      <td className="px-4 py-2 text-zinc-300">{cur(row.emi)}</td>
                      <td className="px-4 py-2 text-amber-400">{cur(row.principal)}</td>
                      <td className="px-4 py-2 text-zinc-400">{cur(row.interest)}</td>
                      <td className="px-4 py-2 text-zinc-300">{cur(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Enter loan details above to calculate EMI
        </div>
      )}
    </div>
  )
}
