import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

export default function GratuityCalculator() {
  const [basic, setBasic]   = useState('')
  const [da, setDa]         = useState('')
  const [years, setYears]   = useState('')
  const [months, setMonths] = useState('')
  const [covered, setCovered] = useState(true) // Covered under Gratuity Act

  const result = useMemo(() => {
    const b = parseFloat(basic) || 0
    const d = parseFloat(da) || 0
    const y = parseFloat(years) || 0
    const m = parseFloat(months) || 0
    if (!b || !y) return null

    const lastSalary = b + d

    // Round up service years: if months >= 6, round up
    const effectiveYears = m >= 6 ? y + 1 : y

    // Formula:
    // Covered under Act: (Last Salary × 15 / 26) × Years
    // Not covered: (Last Salary × 15 / 30) × Years
    const divisor = covered ? 26 : 30
    const gratuity = (lastSalary * 15 / divisor) * effectiveYears

    // Max gratuity exempt from tax: ₹20 lakhs
    const taxExempt = Math.min(gratuity, 2000000)
    const taxable   = Math.max(0, gratuity - 2000000)

    return { gratuity, lastSalary, effectiveYears, taxExempt, taxable }
  }, [basic, da, years, months, covered])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Gratuity is payable after completing 5 years of continuous service. Max tax exemption: ₹ 20,00,000.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Last Basic Salary / Month (₹)</label>
          <input type="number" value={basic} onChange={(e) => setBasic(e.target.value)} placeholder="e.g. 50000"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Dearness Allowance / Month (₹)</label>
          <input type="number" value={da} onChange={(e) => setDa(e.target.value)} placeholder="e.g. 0"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Years of Service</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g. 7"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Additional Months</label>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="e.g. 8"
            min={0} max={11}
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
          <span className="text-xs text-zinc-700">If ≥ 6 months, service rounds up to next year</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Coverage</label>
          <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
            {[[true,'Covered under Act'],[false,'Not Covered']].map(([val, label]) => (
              <button key={label} onClick={() => setCovered(val)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${covered === val ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-700">
            {covered ? 'Formula: (Salary × 15/26) × Years' : 'Formula: (Salary × 15/30) × Years'}
          </span>
        </div>
      </div>

      {result && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Gratuity Amount',    value: `₹ ${cur(result.gratuity)}`,   highlight: true },
              { label: 'Service (effective)',value: `${result.effectiveYears} yrs` },
              { label: 'Tax Exempt',         value: `₹ ${cur(result.taxExempt)}` },
              { label: 'Taxable Amount',     value: `₹ ${cur(result.taxable)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
                <p className="mb-1 text-xs text-zinc-500">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-amber-400' : 'text-zinc-200'}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Calculation Breakdown</p>
            <div className="flex flex-col gap-2 text-xs">
              {[
                ['Last Drawn (Basic + DA)', `₹ ${cur(result.lastSalary)}/month`],
                ['Effective Service', `${result.effectiveYears} years`],
                ['Formula', `(₹ ${cur(result.lastSalary)} × 15 / ${covered ? 26 : 30}) × ${result.effectiveYears}`],
                ['Gratuity', `₹ ${cur(result.gratuity)}`],
                ['Tax-free limit (Sec 10(10))', '₹ 20,00,000'],
                ['Taxable Gratuity', `₹ ${cur(result.taxable)}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-zinc-500">{k}</span>
                  <span className="text-zinc-300">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Enter salary and service duration to calculate gratuity
        </div>
      )}
    </div>
  )
}
