import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

// Rough in-hand estimate: after PF and standard deduction, ~72% of CTC
function estimateInHand(ctc) {
  const monthly = ctc / 12
  const pf = Math.min(monthly * 0.4 * 0.12, 1800) // 12% of basic (40% of CTC), max ₹1800/mo
  const profTax = 200
  return monthly - pf - profTax
}

export default function SalaryHikeCalculator() {
  const [currentCtc, setCurrentCtc] = useState('')
  const [hikeMode, setHikeMode]     = useState('percent') // percent | amount
  const [hikePct, setHikePct]       = useState('')
  const [hikeAmt, setHikeAmt]       = useState('')
  const [multiHike, setMultiHike]   = useState(false)
  const [hike2, setHike2]           = useState('')
  const [hike3, setHike3]           = useState('')

  const result = useMemo(() => {
    const current = parseFloat(currentCtc) || 0
    if (!current) return null

    let newCtc
    if (hikeMode === 'percent') {
      const pct = parseFloat(hikePct) || 0
      if (!pct) return null
      newCtc = current * (1 + pct / 100)
    } else {
      const amt = parseFloat(hikeAmt) || 0
      if (!amt) return null
      newCtc = current + amt
    }

    const actualPct = ((newCtc - current) / current) * 100

    // Multi-year projections
    const projections = [
      { label: 'Current', ctc: current, inHand: estimateInHand(current) },
      { label: 'After Hike', ctc: newCtc, inHand: estimateInHand(newCtc), highlight: true },
    ]

    if (multiHike) {
      const p2 = parseFloat(hike2) || 0
      const p3 = parseFloat(hike3) || 0
      if (p2) {
        const ctc2 = newCtc * (1 + p2 / 100)
        projections.push({ label: 'Year 2', ctc: ctc2, inHand: estimateInHand(ctc2) })
        if (p3) {
          const ctc3 = ctc2 * (1 + p3 / 100)
          projections.push({ label: 'Year 3', ctc: ctc3, inHand: estimateInHand(ctc3) })
        }
      }
    }

    return {
      current, newCtc,
      increase: newCtc - current,
      actualPct,
      monthlyIncrease: (newCtc - current) / 12,
      projections,
    }
  }, [currentCtc, hikeMode, hikePct, hikeAmt, multiHike, hike2, hike3])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Current Annual CTC (₹)</label>
          <input type="number" value={currentCtc} onChange={(e) => setCurrentCtc(e.target.value)} placeholder="e.g. 800000"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Hike Type</label>
          <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
            {[['percent','Percentage'],['amount','Fixed Amount']].map(([val, label]) => (
              <button key={val} onClick={() => setHikeMode(val)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${hikeMode === val ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">
            {hikeMode === 'percent' ? 'Hike Percentage (%)' : 'Hike Amount (₹)'}
          </label>
          {hikeMode === 'percent' ? (
            <input type="number" value={hikePct} onChange={(e) => setHikePct(e.target.value)} placeholder="e.g. 25"
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
          ) : (
            <input type="number" value={hikeAmt} onChange={(e) => setHikeAmt(e.target.value)} placeholder="e.g. 200000"
              className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
          )}
        </div>
      </div>

      {/* Multi-year toggle */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setMultiHike(!multiHike)}
          className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${multiHike ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'}`}
        >
          {multiHike ? '✓ Multi-Year Projection' : '+ Add Multi-Year Projection'}
        </button>
        {multiHike && (
          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Year 2 Hike %</label>
              <input type="number" value={hike2} onChange={(e) => setHike2(e.target.value)} placeholder="e.g. 15"
                className="w-32 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Year 3 Hike %</label>
              <input type="number" value={hike3} onChange={(e) => setHike3(e.target.value)} placeholder="e.g. 12"
                className="w-32 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none" />
            </div>
          </div>
        )}
      </div>

      {result && (
        <>
          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'New Annual CTC',      value: `₹ ${cur(result.newCtc)}`,        highlight: true },
              { label: 'Hike Amount',         value: `₹ ${cur(result.increase)}` },
              { label: 'Hike %',              value: `${result.actualPct.toFixed(2)}%` },
              { label: 'Monthly Increase',    value: `₹ ${cur(result.monthlyIncrease)}` },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#2a2a2a] bg-[#141414]'}`}>
                <p className="mb-1 text-xs text-zinc-500">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-amber-400' : 'text-zinc-200'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Projection table */}
          <div className="rounded-xl border border-[#2a2a2a] overflow-hidden">
            <div className="border-b border-[#2a2a2a] bg-[#141414] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">CTC & In-Hand Comparison</p>
              <p className="mt-0.5 text-xs text-zinc-700">In-hand is an estimate after PF & professional tax deductions</p>
            </div>
            <table className="w-full text-xs">
              <thead className="border-b border-[#1e1e1e]">
                <tr>
                  {['','Annual CTC','Monthly CTC','Est. Monthly In-Hand'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.projections.map(({ label, ctc, inHand, highlight }) => (
                  <tr key={label} className={`border-b border-[#1a1a1a] ${highlight ? 'bg-amber-500/5' : ''}`}>
                    <td className={`px-4 py-2.5 font-medium ${highlight ? 'text-amber-400' : 'text-zinc-400'}`}>{label}</td>
                    <td className="px-4 py-2.5 text-zinc-300">₹ {cur(ctc)}</td>
                    <td className="px-4 py-2.5 text-zinc-300">₹ {cur(ctc / 12)}</td>
                    <td className={`px-4 py-2.5 font-medium ${highlight ? 'text-amber-300' : 'text-zinc-300'}`}>₹ {cur(inHand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Enter your current CTC and hike to see the impact
        </div>
      )}
    </div>
  )
}
