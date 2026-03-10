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
      <p className="text-xs text-zinc-600">
        HRA exemption is the <span className="text-zinc-400 font-medium">minimum</span> of 3 conditions as per Section 10(13A) of the Income Tax Act.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Basic Salary / Month (₹)', basic, setBasic, 'e.g. 50000'],
          ['Dearness Allowance / Month (₹)', da, setDa, 'e.g. 0'],
          ['HRA Received / Month (₹)', hra, setHra, 'e.g. 25000'],
          ['Rent Paid / Month (₹)', rent, setRent, 'e.g. 20000'],
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
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">City Type</label>
          <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
            {[[true,'Metro (50%)'], [false,'Non-Metro (40%)']].map(([val, label]) => (
              <button
                key={label}
                onClick={() => setMetro(val)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  metro === val ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-700">Metro: Delhi, Mumbai, Kolkata, Chennai</p>
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
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
                <p className="mb-1 text-xs text-zinc-500">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-amber-400' : 'text-zinc-200'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* 3 conditions breakdown */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] overflow-hidden">
            <div className="border-b border-[#2a2a2a] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">The 3 Conditions (Minimum is the Exemption)</p>
            </div>
            <div className="flex flex-col">
              {[
                { label: 'Condition 1', desc: 'Actual HRA received',                           val: result.limit1 },
                { label: 'Condition 2', desc: `${metro ? 50 : 40}% of Basic + DA (${metro ? 'Metro' : 'Non-Metro'})`, val: result.limit2 },
                { label: 'Condition 3', desc: 'Rent paid − 10% of Basic + DA',                 val: result.limit3 },
              ].map(({ label, desc, val }, i) => {
                const isMin = val === result.exemption
                return (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] ${isMin ? 'bg-amber-500/5' : ''}`}>
                    <div>
                      <p className={`text-xs font-medium ${isMin ? 'text-amber-400' : 'text-zinc-400'}`}>
                        {label} {isMin && '← Minimum (Exemption)'}
                      </p>
                      <p className="text-xs text-zinc-600">{desc}</p>
                    </div>
                    <p className={`text-sm font-semibold ${isMin ? 'text-amber-400' : 'text-zinc-300'}`}>
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
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Fill in the details above to calculate your HRA exemption
        </div>
      )}
    </div>
  )
}
