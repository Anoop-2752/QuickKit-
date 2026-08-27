import { useState } from 'react'

function cur(n) {
  return Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export default function CtcBreakupCalculator() {
  const [ctc, setCtc]             = useState('')
  const [basicPct, setBasicPct]   = useState(40)
  const [metro, setMetro]         = useState(true)
  const [includePf, setIncludePf] = useState(true)
  const [includeGratuity, setIncludeGratuity] = useState(true)
  const [profTax, setProfTax]     = useState(200)

  const annualCtc = parseFloat(ctc) || 0

  // Core components
  const basic    = Math.round(annualCtc * (basicPct / 100))
  const hra      = Math.round(basic * (metro ? 0.5 : 0.4))
  const pfEmployer   = includePf      ? Math.round(basic * 0.12) : 0
  const gratuity     = includeGratuity ? Math.round(basic * 0.0481) : 0
  const profTaxAnnual = Math.round(profTax * 12)

  // Special allowance = what's left after reserving PF employer + gratuity from CTC
  const specialAllowance = Math.max(0, annualCtc - basic - hra - pfEmployer - gratuity)

  // Gross salary = what employee sees before deductions (excludes employer PF & gratuity)
  const gross = basic + hra + specialAllowance

  // Employee deductions
  const pfEmployee = includePf ? Math.round(basic * 0.12) : 0
  const totalDeductions = pfEmployee + profTaxAnnual

  // In-hand (take-home)
  const inHand = gross - totalDeductions

  const hasCtc = annualCtc > 0

  const earnings = [
    { label: 'Basic Salary',        annual: basic,            note: `${basicPct}% of CTC` },
    { label: 'HRA',                 annual: hra,              note: `${metro ? 50 : 40}% of Basic` },
    { label: 'Special Allowance',   annual: specialAllowance, note: 'Balancing component' },
  ]

  const employerContribs = [
    ...(includePf      ? [{ label: 'PF (Employer 12%)',  annual: pfEmployer }]  : []),
    ...(includeGratuity ? [{ label: 'Gratuity (4.81%)',  annual: gratuity }]     : []),
  ]

  const deductions = [
    ...(includePf ? [{ label: 'PF (Employee 12%)', annual: pfEmployee }] : []),
    { label: 'Professional Tax',  annual: profTaxAnnual },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* CTC */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Annual CTC (₹)</label>
          <input
            type="number"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            placeholder="e.g. 1200000"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-rose-300 focus:outline-none"
          />
        </div>

        {/* Basic % */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Basic Salary %</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={30} max={60} step={5}
              value={basicPct}
              onChange={(e) => setBasicPct(Number(e.target.value))}
              className="flex-1 accent-rose-500"
            />
            <span className="w-10 text-right text-sm text-[var(--ink-strong)]">{basicPct}%</span>
          </div>
        </div>

        {/* Professional Tax */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Professional Tax (₹/month)</label>
          <input
            type="number"
            value={profTax}
            onChange={(e) => setProfTax(Number(e.target.value))}
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] focus:border-rose-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-3">
        {[
          ['metro',          metro,          setMetro,          'Metro City HRA (50%)',   'Non-Metro HRA (40%)'],
          ['pf',             includePf,      setIncludePf,      'PF Included',            'PF Excluded'],
          ['gratuity',       includeGratuity, setIncludeGratuity, 'Gratuity Included',    'Gratuity Excluded'],
        ].map(([key, val, setter, onLabel, offLabel]) => (
          <button
            key={key}
            onClick={() => setter(!val)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              val
                ? 'border-rose-300 bg-rose-600 text-rose-700'
                : 'border-[var(--line)] text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
            }`}
          >
            {val ? onLabel : offLabel}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      {hasCtc && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Annual CTC',       value: `₹ ${cur(annualCtc)}` },
            { label: 'Gross Salary',     value: `₹ ${cur(gross)}` },
            { label: 'Monthly In-Hand',  value: `₹ ${cur(Math.round(inHand / 12))}`, highlight: true },
            { label: 'Annual In-Hand',   value: `₹ ${cur(inHand)}` },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 ${highlight ? 'border-rose-300 bg-rose-600' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}
            >
              <p className="mb-1 text-xs text-[var(--ink-body)]">{label}</p>
              <p className={`text-base font-semibold ${highlight ? 'text-rose-700' : 'text-[var(--ink-strong)]'}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Detailed breakdown */}
      {hasCtc && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Earnings */}
          <BreakupTable title="Earnings" rows={earnings} total={gross} totalCtc={annualCtc} />

          {/* Employer Contributions */}
          {employerContribs.length > 0 && (
            <BreakupTable title="Employer Contributions" rows={employerContribs} total={pfEmployer + gratuity} totalCtc={annualCtc} note="Part of CTC, not in gross" />
          )}

          {/* Deductions */}
          <BreakupTable title="Deductions" rows={deductions} total={totalDeductions} totalCtc={annualCtc} accent="red" />
        </div>
      )}

      {!hasCtc && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter your Annual CTC above to see the breakup
        </div>
      )}

      <p className="text-xs text-[var(--ink-faint)]">
        Calculations are indicative and based on standard Indian payroll structure. Actual figures may vary by company and state.
      </p>
    </div>
  )
}

function BreakupTable({ title, rows, total, note, accent }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] overflow-hidden">
      <div className="border-b border-[var(--line)] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">{title}</p>
        {note && <p className="mt-0.5 text-xs text-[var(--ink-faint)]">{note}</p>}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[var(--line-subtle)]">
            <th className="px-4 py-2 text-left text-[var(--ink-muted)] font-normal">Component</th>
            <th className="px-4 py-2 text-right text-[var(--ink-muted)] font-normal">Monthly</th>
            <th className="px-4 py-2 text-right text-[var(--ink-muted)] font-normal">Annual</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, annual, note: rowNote }) => (
            <tr key={label} className="border-b border-[var(--surface-tint)]">
              <td className="px-4 py-2.5 text-[var(--ink-body)]">
                {label}
                {rowNote && <span className="ml-1 text-[var(--ink-faint)]">({rowNote})</span>}
              </td>
              <td className="px-4 py-2.5 text-right text-[var(--ink-strong)]">₹ {cur(Math.round(annual / 12))}</td>
              <td className="px-4 py-2.5 text-right text-[var(--ink-strong)]">₹ {cur(annual)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`border-t border-[var(--line)] ${accent === 'red' ? 'bg-red-600' : 'bg-rose-600'}`}>
            <td className={`px-4 py-2.5 font-medium ${accent === 'red' ? 'text-red-700' : 'text-rose-700'}`}>
              Total
            </td>
            <td className={`px-4 py-2.5 text-right font-medium ${accent === 'red' ? 'text-red-700' : 'text-rose-700'}`}>
              ₹ {cur(Math.round(total / 12))}
            </td>
            <td className={`px-4 py-2.5 text-right font-medium ${accent === 'red' ? 'text-red-700' : 'text-rose-700'}`}>
              ₹ {cur(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
