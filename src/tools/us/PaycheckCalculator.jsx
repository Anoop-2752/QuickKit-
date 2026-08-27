import { useMemo, useState } from 'react'
import {
  FILING_STATUSES,
  PAY_FREQUENCIES,
  RETIREMENT_LIMITS,
  STANDARD_DEDUCTION,
  STATE_OPTIONS,
  TAX_YEAR,
  federalIncomeTax,
  ficaTax,
  stateIncomeTax,
} from './usTaxData'

function usd(n) {
  return Number(n).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function usdCents(n) {
  return Number(n).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const inputClass =
  'rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:outline-none'

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[var(--ink-body)]">{label}</label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-[var(--ink-faint)]">{hint}</p>}
    </div>
  )
}

function Row({ label, value, tone = 'default', note }) {
  const toneClass = {
    default: 'text-[var(--ink-strong)]',
    deduction: 'text-rose-700',
    muted: 'text-[var(--ink-body)]',
  }[tone]

  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-sm text-[var(--ink-body)]">
        {label}
        {note && <span className="ml-1.5 text-[11px] text-[var(--ink-faint)]">{note}</span>}
      </span>
      <span className={`text-sm font-medium tabular-nums ${toneClass}`}>{value}</span>
    </div>
  )
}

export default function PaycheckCalculator() {
  const [salary, setSalary] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [stateCode, setStateCode] = useState('CA')
  const [frequency, setFrequency] = useState('biweekly')
  const [retirementPct, setRetirementPct] = useState('')
  const [preTaxOther, setPreTaxOther] = useState('')

  const result = useMemo(() => {
    const gross = parseFloat(salary) || 0
    if (gross <= 0) return null

    const pct = Math.min(Math.max(parseFloat(retirementPct) || 0, 0), 100)
    const retirement = Math.min(gross * (pct / 100), RETIREMENT_LIMITS.elective401k)
    const otherPreTax = Math.max(parseFloat(preTaxOther) || 0, 0)

    // Pre-tax deferrals reduce income tax but NOT Social Security or Medicare.
    const preTaxTotal = retirement + otherPreTax
    const wagesAfterPreTax = Math.max(gross - preTaxTotal, 0)

    const deduction = STANDARD_DEDUCTION[filingStatus] ?? STANDARD_DEDUCTION.single
    const federalTaxable = Math.max(wagesAfterPreTax - deduction, 0)

    const federal = federalIncomeTax(federalTaxable, filingStatus)
    const fica = ficaTax(gross, filingStatus)
    const state = stateIncomeTax(wagesAfterPreTax, stateCode)

    const totalTax = federal + fica.total + state.tax
    const takeHome = Math.max(gross - totalTax - preTaxTotal, 0)

    const periods =
      PAY_FREQUENCIES.find((f) => f.id === frequency)?.periods ?? 26

    return {
      gross,
      retirement,
      otherPreTax,
      preTaxTotal,
      deduction,
      federal,
      socialSecurity: fica.socialSecurity,
      medicare: fica.medicare,
      stateTax: state.tax,
      stateEstimated: state.estimated,
      totalTax,
      takeHome,
      periods,
      perPeriod: takeHome / periods,
      effectiveRate: (totalTax / gross) * 100,
      hitDeferralCap: pct > 0 && gross * (pct / 100) > RETIREMENT_LIMITS.elective401k,
    }
  }, [salary, filingStatus, stateCode, frequency, retirementPct, preTaxOther])

  const stateName = STATE_OPTIONS.find((s) => s.code === stateCode)?.name ?? ''

  return (
    <div className="flex flex-col gap-6">
      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Annual gross salary ($)">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="85000"
            className={inputClass}
          />
        </Field>

        <Field label="Filing status">
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value)}
            className={inputClass}
          >
            {FILING_STATUSES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="State">
          <select
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
            className={inputClass}
          >
            {STATE_OPTIONS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Pay frequency">
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={inputClass}
          >
            {PAY_FREQUENCIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="401(k) contribution (%)"
          hint={`Capped at ${usd(RETIREMENT_LIMITS.elective401k)} for ${TAX_YEAR}.`}
        >
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            value={retirementPct}
            onChange={(e) => setRetirementPct(e.target.value)}
            placeholder="6"
            className={inputClass}
          />
        </Field>

        <Field
          label="Other pre-tax deductions ($/yr)"
          hint="Health premiums, HSA, FSA."
        >
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={preTaxOther}
            onChange={(e) => setPreTaxOther(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </Field>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      {!result ? (
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface-sunk)] py-14 text-center">
          <p className="text-sm text-[var(--ink-muted)]">
            Enter your annual salary to see your take-home pay.
          </p>
        </div>
      ) : (
        <>
          {/* Headline */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">Take-home per paycheck</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                {usdCents(result.perPeriod)}
              </p>
              <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
                {result.periods}× per year
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">Annual take-home</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--ink)]">
                {usd(result.takeHome)}
              </p>
              <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
                after taxes and deductions
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">Effective tax rate</p>
              <p className="text-2xl font-bold tabular-nums text-[var(--ink)]">
                {result.effectiveRate.toFixed(1)}%
              </p>
              <p className="mt-1 text-[11px] text-[var(--ink-muted)]">
                {usd(result.totalTax)} total tax
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <h3 className="mb-1 text-sm font-semibold text-[var(--ink)]">
              Annual breakdown
            </h3>
            <p className="mb-3 text-xs text-[var(--ink-muted)]">Tax year {TAX_YEAR}</p>

            <div className="divide-y divide-[var(--line-subtle)]">
              <Row label="Gross salary" value={usd(result.gross)} />

              {result.preTaxTotal > 0 && (
                <>
                  {result.retirement > 0 && (
                    <Row
                      label="401(k) contribution"
                      value={`− ${usd(result.retirement)}`}
                      tone="deduction"
                      note={result.hitDeferralCap ? '(capped)' : undefined}
                    />
                  )}
                  {result.otherPreTax > 0 && (
                    <Row
                      label="Other pre-tax deductions"
                      value={`− ${usd(result.otherPreTax)}`}
                      tone="deduction"
                    />
                  )}
                </>
              )}

              <Row
                label="Standard deduction"
                value={usd(result.deduction)}
                tone="muted"
                note="(reduces federal taxable income)"
              />
              <Row
                label="Federal income tax"
                value={`− ${usd(result.federal)}`}
                tone="deduction"
              />
              <Row
                label="Social Security"
                value={`− ${usd(result.socialSecurity)}`}
                tone="deduction"
              />
              <Row
                label="Medicare"
                value={`− ${usd(result.medicare)}`}
                tone="deduction"
              />
              <Row
                label={`${stateName} state tax`}
                value={`− ${usd(result.stateTax)}`}
                tone="deduction"
                note={result.stateEstimated ? '(estimated)' : undefined}
              />
            </div>

            <div className="mt-3 flex items-baseline justify-between border-t border-[var(--line)] pt-3">
              <span className="text-sm font-medium text-[var(--ink)]">
                Annual take-home pay
              </span>
              <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
                {usd(result.takeHome)}
              </span>
            </div>
          </div>

          {result.stateEstimated && (
            <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
              <span className="text-[var(--ink-body)]">Note:</span> {stateName} uses
              graduated tax brackets. The state figure above is an approximation
              based on a typical effective rate, so your actual state withholding
              will differ. Federal, Social Security and Medicare amounts use full
              bracket calculations.
            </p>
          )}

          <p className="text-xs leading-relaxed text-[var(--ink-faint)]">
            This is an estimate for planning purposes, not tax advice. It assumes
            the standard deduction and does not account for credits, local or
            city taxes, additional withholding elected on your Form W-4, or
            employer-specific benefits. Consult a tax professional for advice
            about your situation.
          </p>
        </>
      )}
    </div>
  )
}
