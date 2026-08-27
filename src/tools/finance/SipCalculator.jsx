import { useState, useMemo } from 'react'

function cur(n) {
  return Number(Math.round(n)).toLocaleString('en-IN')
}

function calcSip(monthly, annualRate, years) {
  const r = annualRate / 12 / 100
  const n = years * 12
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
}

function calcStepUpSip(monthly, annualRate, years, stepUpPct) {
  const r = annualRate / 12 / 100
  let totalValue = 0
  let currentSip = monthly
  for (let y = 0; y < years; y++) {
    const monthsLeft = (years - y) * 12
    totalValue += currentSip * ((Math.pow(1 + r, monthsLeft) - 1) / r) * (1 + r)
    currentSip *= (1 + stepUpPct / 100)
  }
  return totalValue
}

function totalInvested(monthly, years, stepUpPct) {
  if (!stepUpPct) return monthly * years * 12
  let total = 0
  let sip = monthly
  for (let y = 0; y < years; y++) {
    total += sip * 12
    sip *= (1 + stepUpPct / 100)
  }
  return total
}

export default function SipCalculator() {
  const [monthly, setMonthly]     = useState('')
  const [rate, setRate]           = useState('')
  const [years, setYears]         = useState('')
  const [stepUp, setStepUp]       = useState('')
  const [inflation, setInflation] = useState('')

  const result = useMemo(() => {
    const p = parseFloat(monthly)
    const r = parseFloat(rate)
    const y = parseFloat(years)
    if (!p || !r || !y) return null

    const stepUpPct = parseFloat(stepUp) || 0
    const inflationPct = parseFloat(inflation) || 0

    const maturity = stepUpPct > 0 ? calcStepUpSip(p, r, y, stepUpPct) : calcSip(p, r, y)
    const invested = totalInvested(p, y, stepUpPct)
    const gains    = maturity - invested

    // Inflation-adjusted value
    const realValue = inflationPct > 0
      ? maturity / Math.pow(1 + inflationPct / 100, y)
      : null

    // Year-wise summary
    const yearWise = []
    for (let yi = 1; yi <= y; yi++) {
      const val = stepUpPct > 0 ? calcStepUpSip(p, r, yi, stepUpPct) : calcSip(p, r, yi)
      const inv = totalInvested(p, yi, stepUpPct)
      yearWise.push({ year: yi, value: val, invested: inv, gains: val - inv })
    }

    return { maturity, invested, gains, realValue, yearWise, gainsRatio: (gains / invested) * 100 }
  }, [monthly, rate, years, stepUp, inflation])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Monthly SIP Amount (₹)', monthly, setMonthly, 'e.g. 10000'],
          ['Expected Annual Return (%)', rate, setRate, 'e.g. 12'],
          ['Investment Period (Years)', years, setYears, 'e.g. 20'],
          ['Annual Step-Up % (optional)', stepUp, setStepUp, 'e.g. 10'],
          ['Inflation Rate % (optional)', inflation, setInflation, 'e.g. 6'],
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Maturity Value',    value: `₹ ${cur(result.maturity)}`,  highlight: true },
              { label: 'Amount Invested',   value: `₹ ${cur(result.invested)}` },
              { label: 'Wealth Gained',     value: `₹ ${cur(result.gains)}` },
              { label: 'Gains',             value: `${result.gainsRatio.toFixed(1)}%` },
              ...(result.realValue ? [{ label: 'Inflation-Adj. Value', value: `₹ ${cur(result.realValue)}` }] : []),
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl border p-4 ${highlight ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--line)] bg-[var(--surface-alt)]'}`}>
                <p className="mb-1 text-xs text-[var(--ink-body)]">{label}</p>
                <p className={`text-base font-semibold ${highlight ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Bar visual */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>Invested ({(100 - result.gainsRatio / (1 + result.gainsRatio / 100)).toFixed(0)}%)</span>
              <span>Gains ({result.gainsRatio.toFixed(1)}%)</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--accent)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${(result.invested / result.maturity) * 100}%` }}
              />
            </div>
          </div>

          {/* Year-wise table */}
          <div className="overflow-auto rounded-xl border border-[var(--line)]">
            <table className="w-full text-xs">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-alt)]">
                <tr>
                  {['Year','Invested (₹)','Value (₹)','Gains (₹)'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--ink-body)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.yearWise.map((row) => (
                  <tr key={row.year} className="border-b border-[var(--surface-tint)] hover:bg-[var(--surface-alt)]">
                    <td className="px-4 py-2 text-[var(--ink-body)]">{row.year}</td>
                    <td className="px-4 py-2 text-[var(--ink-strong)]">{cur(row.invested)}</td>
                    <td className="px-4 py-2 text-[var(--accent)]">{cur(row.value)}</td>
                    <td className="px-4 py-2 text-[var(--ink-body)]">{cur(row.gains)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!result && (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter SIP details above to see your returns
        </div>
      )}
    </div>
  )
}
