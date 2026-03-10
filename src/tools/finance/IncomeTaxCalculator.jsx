import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

// FY 2024-25 slabs
function calcOldRegime(taxableIncome) {
  let tax = 0
  if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30
  if (taxableIncome > 500000)  tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20
  if (taxableIncome > 250000)  tax += (Math.min(taxableIncome, 500000) - 250000) * 0.05
  // 87A rebate: if net taxable income ≤ 5L, tax = 0
  if (taxableIncome <= 500000) tax = 0
  return tax
}

function calcNewRegime(taxableIncome) {
  let tax = 0
  const slabs = [
    [300000,  700000,  0.05],
    [700000,  1000000, 0.10],
    [1000000, 1200000, 0.15],
    [1200000, 1500000, 0.20],
    [1500000, Infinity, 0.30],
  ]
  for (const [low, high, pct] of slabs) {
    if (taxableIncome > low) {
      tax += (Math.min(taxableIncome, high) - low) * pct
    }
  }
  // 87A rebate: if income ≤ 7L, tax = 0
  if (taxableIncome <= 700000) tax = 0
  return tax
}

function addSurcharge(tax, income) {
  let surcharge = 0
  if (income > 50000000)      surcharge = tax * 0.37
  else if (income > 20000000) surcharge = tax * 0.25
  else if (income > 10000000) surcharge = tax * 0.15
  else if (income > 5000000)  surcharge = tax * 0.10
  const cess = (tax + surcharge) * 0.04
  return tax + surcharge + cess
}

export default function IncomeTaxCalculator() {
  const [grossSalary, setGrossSalary]   = useState('')
  const [deductions80C, setDeductions80C] = useState('')
  const [nps, setNps]                   = useState('')
  const [hraExempt, setHraExempt]       = useState('')
  const [otherDeductions, setOther]     = useState('')

  const result = useMemo(() => {
    const gross = parseFloat(grossSalary) || 0
    if (!gross) return null

    const d80C     = Math.min(parseFloat(deductions80C) || 0, 150000)
    const npsAmt   = Math.min(parseFloat(nps) || 0, 50000)
    const hra      = parseFloat(hraExempt) || 0
    const other    = parseFloat(otherDeductions) || 0

    // Old Regime
    const oldStdDeduction = 50000
    const oldGross = Math.max(0, gross - hra - oldStdDeduction)
    const oldTaxable = Math.max(0, oldGross - d80C - npsAmt - other)
    const oldBaseTax = calcOldRegime(oldTaxable)
    const oldTotal = addSurcharge(oldBaseTax, oldTaxable)

    // New Regime
    const newStdDeduction = 75000
    const newTaxable = Math.max(0, gross - newStdDeduction)
    const newBaseTax = calcNewRegime(newTaxable)
    const newTotal = addSurcharge(newBaseTax, newTaxable)

    const saving = oldTotal - newTotal

    return {
      gross,
      oldTaxable, oldTotal, oldMonthly: oldTotal / 12,
      newTaxable, newTotal, newMonthly: newTotal / 12,
      saving,
      betterRegime: saving > 0 ? 'new' : saving < 0 ? 'old' : 'equal',
    }
  }, [grossSalary, deductions80C, nps, hraExempt, otherDeductions])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">FY 2024-25 · Includes 4% Health & Education Cess and surcharge where applicable.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Gross Annual Income (₹)', grossSalary, setGrossSalary, 'e.g. 1200000'],
          ['80C Deductions (₹, max 1.5L)', deductions80C, setDeductions80C, 'e.g. 150000'],
          ['NPS 80CCD(1B) (₹, max 50K)', nps, setNps, 'e.g. 50000'],
          ['HRA Exemption (₹) — Old Regime', hraExempt, setHraExempt, 'e.g. 120000'],
          ['Other Deductions (₹) — Old Regime', otherDeductions, setOther, 'e.g. 25000'],
        ].map(([label, val, setter, placeholder]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">{label}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {result && (
        <>
          {/* Recommendation banner */}
          <div className={`rounded-xl border px-5 py-4 ${
            result.betterRegime === 'new'
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-blue-500/30 bg-blue-500/5'
          }`}>
            <p className={`text-sm font-semibold ${result.betterRegime === 'new' ? 'text-amber-400' : 'text-blue-400'}`}>
              {result.betterRegime === 'equal'
                ? 'Both regimes result in the same tax.'
                : `${result.betterRegime === 'new' ? 'New Regime' : 'Old Regime'} saves you ₹ ${cur(Math.abs(result.saving))} per year`}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {result.betterRegime === 'equal' ? '' : `Choose the ${result.betterRegime} regime for lower tax outgo.`}
            </p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: 'Old Regime', taxable: result.oldTaxable, total: result.oldTotal, monthly: result.oldMonthly, best: result.betterRegime === 'old' },
              { label: 'New Regime', taxable: result.newTaxable, total: result.newTotal, monthly: result.newMonthly, best: result.betterRegime === 'new' },
            ].map(({ label, taxable, total, monthly, best }) => (
              <div key={label} className={`rounded-xl border p-5 flex flex-col gap-3 ${best ? 'border-amber-500/40 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-300">{label}</p>
                  {best && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400">Recommended</span>}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    ['Taxable Income', `₹ ${cur(taxable)}`],
                    ['Annual Tax', `₹ ${cur(total)}`],
                    ['Monthly Tax', `₹ ${cur(monthly)}`],
                    ['Effective Rate', `${total > 0 ? ((total / result.gross) * 100).toFixed(2) : 0}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-zinc-500">{k}</span>
                      <span className={`font-medium ${best ? 'text-amber-300' : 'text-zinc-300'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Slab table */}
          <div className="rounded-xl border border-[#2a2a2a] overflow-hidden">
            <div className="border-b border-[#2a2a2a] bg-[#141414] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">New Regime Tax Slabs — FY 2024-25</p>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-[#1e1e1e]">
                <th className="px-4 py-2 text-left font-normal text-zinc-600">Income Range</th>
                <th className="px-4 py-2 text-right font-normal text-zinc-600">Rate</th>
              </tr></thead>
              <tbody>
                {[
                  ['Up to ₹ 3,00,000','Nil'],['₹ 3L – ₹ 7L','5%'],['₹ 7L – ₹ 10L','10%'],
                  ['₹ 10L – ₹ 12L','15%'],['₹ 12L – ₹ 15L','20%'],['Above ₹ 15L','30%'],
                ].map(([range, rate]) => (
                  <tr key={range} className="border-b border-[#1a1a1a]">
                    <td className="px-4 py-2 text-zinc-400">{range}</td>
                    <td className="px-4 py-2 text-right text-zinc-300">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Enter your gross income above to compare tax regimes
        </div>
      )}
    </div>
  )
}
