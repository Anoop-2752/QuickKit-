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
      <p className="text-xs text-[var(--ink-muted)]">FY 2024-25 · Includes 4% Health & Education Cess and surcharge where applicable.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Gross Annual Income (₹)', grossSalary, setGrossSalary, 'e.g. 1200000'],
          ['80C Deductions (₹, max 1.5L)', deductions80C, setDeductions80C, 'e.g. 150000'],
          ['NPS 80CCD(1B) (₹, max 50K)', nps, setNps, 'e.g. 50000'],
          ['HRA Exemption (₹) — Old Regime', hraExempt, setHraExempt, 'e.g. 120000'],
          ['Other Deductions (₹) — Old Regime', otherDeductions, setOther, 'e.g. 25000'],
        ].map(([label, val, setter, placeholder]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">{label}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {result && (
        <>
          {/* Recommendation banner */}
          <div className={`rounded-xl border px-5 py-4 ${
            result.betterRegime === 'new'
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : 'border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]'
          }`}>
            <p className={`text-sm font-semibold ${result.betterRegime === 'new' ? 'text-[var(--accent)]' : 'text-[var(--accent)]'}`}>
              {result.betterRegime === 'equal'
                ? 'Both regimes result in the same tax.'
                : `${result.betterRegime === 'new' ? 'New Regime' : 'Old Regime'} saves you ₹ ${cur(Math.abs(result.saving))} per year`}
            </p>
            <p className="mt-0.5 text-xs text-[var(--ink-body)]">
              {result.betterRegime === 'equal' ? '' : `Choose the ${result.betterRegime} regime for lower tax outgo.`}
            </p>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: 'Old Regime', taxable: result.oldTaxable, total: result.oldTotal, monthly: result.oldMonthly, best: result.betterRegime === 'old' },
              { label: 'New Regime', taxable: result.newTaxable, total: result.newTotal, monthly: result.newMonthly, best: result.betterRegime === 'new' },
            ].map(({ label, taxable, total, monthly, best }) => (
              <div key={label} className={`rounded-xl border p-5 flex flex-col gap-3 ${best ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--ink-strong)]">{label}</p>
                  {best && <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-[var(--accent-on)]">Recommended</span>}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    ['Taxable Income', `₹ ${cur(taxable)}`],
                    ['Annual Tax', `₹ ${cur(total)}`],
                    ['Monthly Tax', `₹ ${cur(monthly)}`],
                    ['Effective Rate', `${total > 0 ? ((total / result.gross) * 100).toFixed(2) : 0}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-[var(--ink-body)]">{k}</span>
                      <span className={`font-medium ${best ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Slab table */}
          <div className="rounded-xl border border-[var(--line)] overflow-hidden">
            <div className="border-b border-[var(--line)] bg-[var(--surface-alt)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">New Regime Tax Slabs — FY 2024-25</p>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-[var(--line-subtle)]">
                <th className="px-4 py-2 text-left font-normal text-[var(--ink-muted)]">Income Range</th>
                <th className="px-4 py-2 text-right font-normal text-[var(--ink-muted)]">Rate</th>
              </tr></thead>
              <tbody>
                {[
                  ['Up to ₹ 3,00,000','Nil'],['₹ 3L – ₹ 7L','5%'],['₹ 7L – ₹ 10L','10%'],
                  ['₹ 10L – ₹ 12L','15%'],['₹ 12L – ₹ 15L','20%'],['Above ₹ 15L','30%'],
                ].map(([range, rate]) => (
                  <tr key={range} className="border-b border-[var(--surface-tint)]">
                    <td className="px-4 py-2 text-[var(--ink-body)]">{range}</td>
                    <td className="px-4 py-2 text-right text-[var(--ink-strong)]">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter your gross income above to compare tax regimes
        </div>
      )}
    </div>
  )
}
