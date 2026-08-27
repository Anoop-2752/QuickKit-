import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

export default function HraCalculator() {
  const [basic, setBasic]   = useState('')
  const [da, setDa]         = useState('')
  const [hra, setHra]       = useState('')
  const [rent, setRent]     = useState('')
  const [metro, setMetro]   = useState(true)

  const result = useMemo(() => {
    const b = parseFloat(basic) || 0
    const d = parseFloat(da) || 0
    const h = parseFloat(hra) || 0
    const r = parseFloat(rent) || 0
    if (!b || !h || !r) return null

    const basicPlusDa = b + d

    // HRA exemption = minimum of these 3
    const limit1 = h                                      // Actual HRA received
    const limit2 = metro ? basicPlusDa * 0.5 : basicPlusDa * 0.4  // 50% or 40% of basic+DA
    const limit3 = Math.max(0, r - basicPlusDa * 0.1)   // Rent - 10% of basic+DA

    const exemption = Math.min(limit1, limit2, limit3)
    const taxableHra = h - exemption

    return { h, limit1, limit2, limit3, exemption, taxableHra, basicPlusDa }
  }, [basic, da, hra, rent, metro])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-[var(--ink-muted)]">
        HRA exemption is the <span className="text-[var(--ink-body)] font-medium">minimum</span> of 3 conditions as per Section 10(13A) of the Income Tax Act.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Basic Salary / Month (₹)', basic, setBasic, 'e.g. 50000'],
          ['Dearness Allowance / Month (₹)', da, setDa, 'e.g. 0'],
          ['HRA Received / Month (₹)', hra, setHra, 'e.g. 25000'],
          ['Rent Paid / Month (₹)', rent, setRent, 'e.g. 20000'],
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
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">City Type</label>
          <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
            {[[true,'Metro (50%)'], [false,'Non-Metro (40%)']].map(([val, label]) => (
              <button
                key={label}
                onClick={() => setMetro(val)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  metro === val ? 'bg-[var(--accent)] text-[var(--accent-on)]' : 'text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--ink-faint)]">Metro: Delhi, Mumbai, Kolkata, Chennai</p>
        </div>
      </div>

      {result && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'HRA Exemption / Month',  value: `₹ ${cur(result.exemption)}`,  highlight: true },
              { label: 'Taxable HRA / Month',    value: `₹ ${cur(result.taxableHra)}` },
              { label: 'Annual HRA Exemption',   value: `₹ ${cur(result.exemption * 12)}` },
              { label: 'Annual Taxable HRA',     value: `₹ ${cur(result.taxableHra * 12)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}>
                <p className="mb-1 text-xs text-[var(--ink-body)]">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* 3 conditions breakdown */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] overflow-hidden">
            <div className="border-b border-[var(--line)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">The 3 Conditions (Minimum is the Exemption)</p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'Condition 1', desc: 'Actual HRA received',                           val: result.limit1 },
                { label: 'Condition 2', desc: `${metro ? 50 : 40}% of Basic + DA (${metro ? 'Metro' : 'Non-Metro'})`, val: result.limit2 },
                { label: 'Condition 3', desc: 'Rent paid − 10% of Basic + DA',                 val: result.limit3 },
              ].map(({ label, desc, val }, i) => {
                const isMin = val === result.exemption
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-[var(--surface-tint)] ${isMin ? 'bg-[var(--accent)]' : ''}`}>
                    <div>
                      <p className={`text-xs font-medium ${isMin ? 'text-[var(--accent)]' : 'text-[var(--ink-body)]'}`}>
                        {label} {isMin && '← Minimum (Exemption)'}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)]">{desc}</p>
                    </div>
                    <p className={`text-sm font-semibold ${isMin ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>
                      ₹ {cur(val)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Fill in the details above to calculate your HRA exemption
        </div>
      )}
    </div>
  )
}
