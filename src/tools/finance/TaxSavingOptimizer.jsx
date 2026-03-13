import { useState, useMemo } from 'react'

const inputCls =
  'w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-500/50 transition-colors'

function cur(n) {
  return Number(Math.round(n || 0)).toLocaleString('en-IN')
}

function calcOldTax(income) {
  if (income <= 250000) return 0
  if (income <= 500000) return (income - 250000) * 0.05
  if (income <= 1000000) return 12500 + (income - 500000) * 0.20
  return 12500 + 100000 + (income - 1000000) * 0.30
}

function calcNewTax(income) {
  // After ₹75,000 standard deduction applied to income before this fn
  if (income <= 300000) return 0
  if (income <= 700000) return (income - 300000) * 0.05
  if (income <= 1000000) return 20000 + (income - 700000) * 0.10
  if (income <= 1200000) return 50000 + (income - 1000000) * 0.15
  if (income <= 1500000) return 80000 + (income - 1200000) * 0.20
  return 140000 + (income - 1500000) * 0.30
}

function addCess(tax) {
  return tax + tax * 0.04
}

// Rebate u/s 87A: if taxable income ≤ 5L (old) or ≤ 7L (new), tax = 0
function applyRebate(tax, taxableIncome, regime) {
  const limit = regime === 'old' ? 500000 : 700000
  return taxableIncome <= limit ? 0 : tax
}

export default function TaxSavingOptimizer() {
  const [regime, setRegime] = useState('old')
  const [grossIncome, setGrossIncome] = useState('')

  // 80C
  const [epf, setEpf] = useState('')
  const [ppf, setPpf] = useState('')
  const [elss, setElss] = useState('')
  const [lic, setLic] = useState('')
  const [homeLoan, setHomeLoan] = useState('')
  const [tuitionFees, setTuitionFees] = useState('')
  const [nsc, setNsc] = useState('')
  const [ulip, setUlip] = useState('')
  const [sukanya, setSukanya] = useState('')

  // 80D
  const [healthSelf, setHealthSelf] = useState('')
  const [healthParents, setHealthParents] = useState('')
  const [parentsSenior, setParentsSenior] = useState(false)

  // 80CCD(1B)
  const [nps, setNps] = useState('')

  // 80TTA
  const [savingsInterest, setSavingsInterest] = useState('')

  // HRA
  const [hraExemption, setHraExemption] = useState('')

  const result = useMemo(() => {
    const gross = parseFloat(grossIncome) || 0
    if (!gross) return null

    // 80C
    const sec80c_raw =
      (parseFloat(epf) || 0) +
      (parseFloat(ppf) || 0) +
      (parseFloat(elss) || 0) +
      (parseFloat(lic) || 0) +
      (parseFloat(homeLoan) || 0) +
      (parseFloat(tuitionFees) || 0) +
      (parseFloat(nsc) || 0) +
      (parseFloat(ulip) || 0) +
      (parseFloat(sukanya) || 0)
    const sec80c_limit = 150000
    const sec80c = Math.min(sec80c_raw, sec80c_limit)
    const sec80c_room = Math.max(0, sec80c_limit - sec80c_raw)

    // 80D
    const healthSelfAmt = parseFloat(healthSelf) || 0
    const healthParentsAmt = parseFloat(healthParents) || 0
    const selfLimit = 25000
    const parentLimit = parentsSenior ? 50000 : 25000
    const sec80d = Math.min(healthSelfAmt, selfLimit) + Math.min(healthParentsAmt, parentLimit)

    // 80CCD(1B)
    const npsAmt = parseFloat(nps) || 0
    const sec80ccd1b = Math.min(npsAmt, 50000)

    // 80TTA
    const savingsInt = parseFloat(savingsInterest) || 0
    const sec80tta = Math.min(savingsInt, 10000)

    // HRA
    const hra = parseFloat(hraExemption) || 0

    if (regime === 'new') {
      const stdDeduction = 75000
      const taxableIncome = Math.max(0, gross - stdDeduction)
      const taxBeforeRebate = calcNewTax(taxableIncome)
      const taxAfterRebate = applyRebate(taxBeforeRebate, taxableIncome, 'new')
      const taxWithCess = addCess(taxAfterRebate)

      // Tax with no deductions (no std deduction either for comparison)
      const taxNoDeductions = addCess(applyRebate(calcNewTax(gross), gross, 'new'))

      return {
        regime: 'new',
        gross,
        stdDeduction,
        totalDeductions: stdDeduction,
        taxableIncome,
        estimatedTax: Math.round(taxWithCess),
        taxSaved: Math.round(Math.max(0, taxNoDeductions - taxWithCess)),
        sec80c_raw, sec80c, sec80c_limit, sec80c_room,
        sec80d: 0, sec80ccd1b: 0, sec80tta: 0, hra: 0,
        breakdown: [
          { label: 'Standard Deduction', amount: stdDeduction },
        ],
        recommendations: newRegimeRecommendations(taxableIncome),
      }
    }

    // Old regime
    const stdDeduction = 50000
    const totalDeductions = stdDeduction + sec80c + sec80d + sec80ccd1b + sec80tta + hra
    const taxableIncome = Math.max(0, gross - totalDeductions)
    const taxBeforeRebate = calcOldTax(taxableIncome)
    const taxAfterRebate = applyRebate(taxBeforeRebate, taxableIncome, 'old')
    const taxWithCess = addCess(taxAfterRebate)

    const taxNoDeductions = addCess(applyRebate(calcOldTax(gross), gross, 'old'))

    const breakdown = [
      { label: 'Standard Deduction', amount: stdDeduction },
      { label: 'Section 80C', amount: sec80c },
      { label: 'Section 80D', amount: sec80d },
      { label: 'Section 80CCD(1B) – NPS', amount: sec80ccd1b },
      { label: 'Section 80TTA – Savings Interest', amount: sec80tta },
      { label: 'HRA Exemption', amount: hra },
    ].filter((b) => b.amount > 0)

    const recs = oldRegimeRecommendations(sec80c_raw, sec80c_limit, sec80c_room, npsAmt, healthSelfAmt, taxableIncome)

    return {
      regime: 'old',
      gross,
      stdDeduction,
      totalDeductions,
      taxableIncome,
      estimatedTax: Math.round(taxWithCess),
      taxSaved: Math.round(Math.max(0, taxNoDeductions - taxWithCess)),
      sec80c_raw, sec80c, sec80c_limit, sec80c_room,
      sec80d, sec80ccd1b, sec80tta, hra,
      breakdown,
      recommendations: recs,
    }
  }, [
    regime, grossIncome, epf, ppf, elss, lic, homeLoan, tuitionFees, nsc, ulip, sukanya,
    healthSelf, healthParents, parentsSenior, nps, savingsInterest, hraExemption,
  ])

  function oldRegimeRecommendations(raw80c, limit, room, npsAmt, healthSelfAmt, taxable) {
    const recs = []
    if (room > 0) recs.push(`You can invest ₹${cur(room)} more under Section 80C (EPF, PPF, ELSS, LIC, etc.) to utilise the full ₹1,50,000 limit.`)
    if (npsAmt < 50000) recs.push(`Consider contributing ₹${cur(50000 - npsAmt)} more to NPS for an extra deduction under Section 80CCD(1B) — up to ₹50,000 over and above 80C.`)
    if (healthSelfAmt === 0) recs.push('Invest in a health insurance policy for yourself and family to claim up to ₹25,000 under Section 80D.')
    if (taxable > 0 && taxable <= 500000) recs.push('Your taxable income is within the ₹5 lakh rebate limit — your tax liability will be ₹0 after Section 87A rebate.')
    if (taxable > 500000 && taxable <= 700000) recs.push('You are just above the ₹5 lakh rebate limit. Increasing 80C or other deductions could bring your taxable income under ₹5 lakh and make your tax ₹0.')
    if (recs.length === 0) recs.push('You are utilising your deductions well. Review if switching to the New Regime would save more tax based on your slab.')
    return recs
  }

  function newRegimeRecommendations(taxable) {
    const recs = [
      'The New Regime does not allow 80C, 80D, or HRA deductions. It offers lower slab rates instead.',
      'The New Regime has a standard deduction of ₹75,000 for salaried individuals.',
    ]
    if (taxable <= 700000) recs.push('Your taxable income is within ₹7 lakh — you pay zero tax thanks to Section 87A rebate under the new regime.')
    recs.push('Compare with the Old Regime using the toggle above to see which saves you more overall.')
    return recs
  }

  const pct80c = result ? Math.min(100, (result.sec80c_raw / 150000) * 100) : 0

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ── LEFT: Inputs ── */}
      <div className="flex flex-col gap-5">

        {/* Regime Toggle */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-3 text-sm font-semibold text-white">Tax Regime (FY 2024-25)</h2>
          <div className="flex gap-2">
            {['old', 'new'].map((r) => (
              <button
                key={r}
                onClick={() => setRegime(r)}
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  regime === r
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:text-white'
                }`}
              >
                {r === 'old' ? 'Old Regime' : 'New Regime'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            {regime === 'old'
              ? 'Old regime: Standard deduction ₹50,000. 80C, 80D, HRA & other deductions available.'
              : 'New regime: Standard deduction ₹75,000. No 80C/80D deductions. Lower slab rates.'}
          </p>
        </section>

        {/* Income */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-3 text-sm font-semibold text-white">Annual Gross Income</h2>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Gross Income (₹)</label>
            <input
              type="number"
              className={inputCls}
              placeholder="e.g. 1200000"
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
            />
          </div>
        </section>

        {/* Section 80C — only old regime */}
        {regime === 'old' && (
          <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <h2 className="mb-1 text-sm font-semibold text-white">Section 80C <span className="text-xs font-normal text-zinc-500">(limit: ₹1,50,000)</span></h2>
            <p className="mb-3 text-xs text-zinc-600">Enter your existing investments — all are auto-summed and capped at ₹1,50,000.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'EPF Contribution', val: epf, set: setEpf },
                { label: 'PPF', val: ppf, set: setPpf },
                { label: 'ELSS / Mutual Funds', val: elss, set: setElss },
                { label: 'LIC Premium', val: lic, set: setLic },
                { label: 'Home Loan Principal', val: homeLoan, set: setHomeLoan },
                { label: 'Tuition Fees', val: tuitionFees, set: setTuitionFees },
                { label: 'NSC', val: nsc, set: setNsc },
                { label: 'ULIP', val: ulip, set: setUlip },
                { label: 'Sukanya Samriddhi', val: sukanya, set: setSukanya },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="mb-1 block text-xs text-zinc-500">{label}</label>
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="0"
                    min="0"
                    value={val}
                    onChange={(e) => set(e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 80D */}
        {regime === 'old' && (
          <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Section 80D — Health Insurance</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Self + Family Premium (limit: ₹25,000)</label>
                <input type="number" className={inputCls} placeholder="0" min="0" value={healthSelf} onChange={(e) => setHealthSelf(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Parents Premium (limit: ₹25,000 / ₹50,000 if senior)</label>
                <input type="number" className={inputCls} placeholder="0" min="0" value={healthParents} onChange={(e) => setHealthParents(e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentsSenior}
                  onChange={(e) => setParentsSenior(e.target.checked)}
                  className="accent-amber-500"
                />
                Parents are senior citizens (age 60+)
              </label>
            </div>
          </section>
        )}

        {/* 80CCD(1B) & 80TTA & HRA */}
        {regime === 'old' && (
          <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Other Deductions</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">NPS Contribution — 80CCD(1B) (limit: ₹50,000)</label>
                <input type="number" className={inputCls} placeholder="0" min="0" value={nps} onChange={(e) => setNps(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Savings Account Interest — 80TTA (limit: ₹10,000)</label>
                <input type="number" className={inputCls} placeholder="0" min="0" value={savingsInterest} onChange={(e) => setSavingsInterest(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">HRA Exemption</label>
                <input type="number" className={inputCls} placeholder="0" min="0" value={hraExemption} onChange={(e) => setHraExemption(e.target.value)} />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── RIGHT: Results ── */}
      <div className="flex flex-col gap-5">
        {!result ? (
          <div className="rounded-xl border border-dashed border-[#2a2a2a] bg-[#141414] p-8 text-center">
            <p className="text-sm text-zinc-600">Enter your gross income to see your tax estimate and saving opportunities.</p>
          </div>
        ) : (
          <>
            {/* 80C Progress — old regime only */}
            {result.regime === 'old' && (
              <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">80C Invested</span>
                  <span className="text-xs text-zinc-400">₹{cur(Math.min(result.sec80c_raw, 150000))} / ₹1,50,000</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#2a2a2a]">
                  <div
                    className="h-2 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${pct80c}%` }}
                  />
                </div>
                {result.sec80c_room > 0 ? (
                  <p className="mt-2 text-xs text-amber-400">₹{cur(result.sec80c_room)} more can be invested under 80C</p>
                ) : (
                  <p className="mt-2 text-xs text-green-400">80C limit fully utilised</p>
                )}
              </div>
            )}

            {/* Tax Summary */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Tax Summary</h3>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Gross Income</span>
                  <span className="text-zinc-200">₹{cur(result.gross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Deductions</span>
                  <span className="text-amber-400">– ₹{cur(result.totalDeductions)}</span>
                </div>
                <div className="flex justify-between border-t border-[#2a2a2a] pt-2">
                  <span className="text-zinc-400 font-medium">Taxable Income</span>
                  <span className="text-white font-medium">₹{cur(result.taxableIncome)}</span>
                </div>
                <div className="flex justify-between border-t border-[#2a2a2a] pt-2">
                  <span className="text-zinc-400 font-semibold">Estimated Tax (incl. 4% cess)</span>
                  <span className="text-red-400 font-bold">₹{cur(result.estimatedTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tax Saved vs No Deductions</span>
                  <span className="text-green-400 font-semibold">₹{cur(result.taxSaved)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            {result.breakdown.length > 0 && (
              <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">Deductions Breakdown</h3>
                <div className="flex flex-col gap-1.5">
                  {result.breakdown.map((b) => (
                    <div key={b.label} className="flex justify-between text-xs">
                      <span className="text-zinc-500">{b.label}</span>
                      <span className="text-zinc-300">₹{cur(b.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-[#2a2a2a] pt-2 text-xs font-medium">
                    <span className="text-zinc-400">Total</span>
                    <span className="text-amber-400">₹{cur(result.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <h3 className="mb-3 text-sm font-semibold text-amber-400">Recommendations</h3>
              <ul className="flex flex-col gap-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-xs text-zinc-400">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Slab Reference */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <h3 className="mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {result.regime === 'old' ? 'Old Regime Slabs' : 'New Regime Slabs'} (FY 2024-25)
              </h3>
              <div className="flex flex-col gap-1 text-xs">
                {result.regime === 'old' ? (
                  <>
                    <div className="flex justify-between text-zinc-500"><span>Up to ₹2.5L</span><span>0%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹2.5L – ₹5L</span><span>5%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹5L – ₹10L</span><span>20%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>Above ₹10L</span><span>30%</span></div>
                    <p className="mt-1.5 text-zinc-600">+ 4% Health & Education Cess. Rebate u/s 87A if income ≤ ₹5L.</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-zinc-500"><span>Up to ₹3L</span><span>0%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹3L – ₹7L</span><span>5%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹7L – ₹10L</span><span>10%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹10L – ₹12L</span><span>15%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>₹12L – ₹15L</span><span>20%</span></div>
                    <div className="flex justify-between text-zinc-500"><span>Above ₹15L</span><span>30%</span></div>
                    <p className="mt-1.5 text-zinc-600">+ 4% cess. Rebate u/s 87A if income ≤ ₹7L. Std deduction ₹75,000.</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
