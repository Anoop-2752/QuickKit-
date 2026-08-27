// ─────────────────────────────────────────────────────────────────────────────
// US tax constants — TAX YEAR 2026
//
// Figures below were verified against the sources listed on 2026-08-27.
// RE-CHECK EVERY YEAR when the IRS publishes new inflation adjustments.
//
// Verified 2026-08-27:
//   Standard deduction ..... IRS Rev. Proc. 2025-32 (16,100 / 32,200 / 24,150)
//   Federal brackets ....... IRS newsroom + Tax Foundation 2026 tables
//   37% threshold .......... 640,600 single / 768,700 joint (irs.gov)
//   Social Security base ... 184,500 (ssa.gov)
//   401(k) deferral ........ 24,500, catch-up 8,000 (irs.gov)
//
// One caveat: sources disagree on the head-of-household 24% ceiling —
// Tax Foundation says 201,775, NerdWallet says 201,750. We use 201,775
// because it matches the long-standing pattern where the single and HoH
// 24% ceilings are identical while their 32% ceilings differ slightly (as
// in 2025: both 197,300, with 32% ending at 250,525 vs 250,500). The
// difference affects tax by about $2, but confirm against Rev. Proc.
// 2025-32 Table 3 if you want certainty.
//
// Verify against:
//   Federal brackets & standard deduction .. IRS Rev. Proc. (annual inflation
//                                            adjustments), irs.gov
//   Social Security wage base .............. ssa.gov/oact/cola/cbb.html
//   Medicare rates & thresholds ............ irs.gov Topic No. 751
//   State income tax rates ................. each state's revenue department
//
// This file is deliberately the ONLY place tax figures live, so an annual
// update means editing one file and nothing else.
// ─────────────────────────────────────────────────────────────────────────────

export const TAX_YEAR = 2026

// Marginal federal income tax brackets. `upTo: null` means "and above".
export const FEDERAL_BRACKETS = {
  single: [
    { rate: 0.10, upTo: 12400 },
    { rate: 0.12, upTo: 50400 },
    { rate: 0.22, upTo: 105700 },
    { rate: 0.24, upTo: 201775 },
    { rate: 0.32, upTo: 256225 },
    { rate: 0.35, upTo: 640600 },
    { rate: 0.37, upTo: null },
  ],
  marriedJoint: [
    { rate: 0.10, upTo: 24800 },
    { rate: 0.12, upTo: 100800 },
    { rate: 0.22, upTo: 211400 },
    { rate: 0.24, upTo: 403550 },
    { rate: 0.32, upTo: 512450 },
    { rate: 0.35, upTo: 768700 },
    { rate: 0.37, upTo: null },
  ],
  headOfHousehold: [
    { rate: 0.10, upTo: 17700 },
    { rate: 0.12, upTo: 67450 },
    { rate: 0.22, upTo: 105700 },
    { rate: 0.24, upTo: 201775 },
    { rate: 0.32, upTo: 256200 },
    { rate: 0.35, upTo: 640600 },
    { rate: 0.37, upTo: null },
  ],
}

export const STANDARD_DEDUCTION = {
  single: 16100,
  marriedJoint: 32200,
  headOfHousehold: 24150,
}

export const FILING_STATUSES = [
  { id: 'single', label: 'Single' },
  { id: 'marriedJoint', label: 'Married filing jointly' },
  { id: 'headOfHousehold', label: 'Head of household' },
]

// FICA — Social Security and Medicare.
export const FICA = {
  socialSecurityRate: 0.062,
  // Wage base is inflation-indexed and changes every year.
  socialSecurityWageBase: 184500,
  medicareRate: 0.0145,
  // Additional Medicare tax. These thresholds are fixed in statute and are NOT
  // inflation-adjusted, so they rarely change.
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    single: 200000,
    marriedJoint: 250000,
    headOfHousehold: 200000,
  },
}

// 401(k) elective deferral limit (employee contributions).
export const RETIREMENT_LIMITS = {
  elective401k: 24500,
  catchUp50Plus: 8000,
}

export const PAY_FREQUENCIES = [
  { id: 'weekly', label: 'Weekly', periods: 52 },
  { id: 'biweekly', label: 'Bi-weekly', periods: 26 },
  { id: 'semimonthly', label: 'Semi-monthly', periods: 24 },
  { id: 'monthly', label: 'Monthly', periods: 12 },
  { id: 'annual', label: 'Annual', periods: 1 },
]

// State income tax on wages.
//
//   kind: 'none'  — no state income tax on wages
//   kind: 'flat'  — single statutory rate, applied to taxable wages
//   kind: 'est'   — state uses graduated brackets; `rate` is an APPROXIMATE
//                   effective rate for a typical middle income. Results for
//                   these states are labelled as estimates in the UI, because a
//                   single rate cannot reproduce a bracket system accurately.
//
// New Hampshire taxes interest and dividends only, so wages are untaxed here.
export const STATE_TAX = {
  AL: { name: 'Alabama', kind: 'est', rate: 0.050 },
  AK: { name: 'Alaska', kind: 'none' },
  AZ: { name: 'Arizona', kind: 'flat', rate: 0.025 },
  AR: { name: 'Arkansas', kind: 'est', rate: 0.039 },
  CA: { name: 'California', kind: 'est', rate: 0.060 },
  CO: { name: 'Colorado', kind: 'flat', rate: 0.044 },
  CT: { name: 'Connecticut', kind: 'est', rate: 0.050 },
  DE: { name: 'Delaware', kind: 'est', rate: 0.050 },
  DC: { name: 'District of Columbia', kind: 'est', rate: 0.065 },
  FL: { name: 'Florida', kind: 'none' },
  GA: { name: 'Georgia', kind: 'flat', rate: 0.0519 },
  HI: { name: 'Hawaii', kind: 'est', rate: 0.070 },
  ID: { name: 'Idaho', kind: 'flat', rate: 0.05695 },
  IL: { name: 'Illinois', kind: 'flat', rate: 0.0495 },
  IN: { name: 'Indiana', kind: 'flat', rate: 0.030 },
  IA: { name: 'Iowa', kind: 'flat', rate: 0.038 },
  KS: { name: 'Kansas', kind: 'est', rate: 0.0525 },
  KY: { name: 'Kentucky', kind: 'flat', rate: 0.040 },
  LA: { name: 'Louisiana', kind: 'flat', rate: 0.030 },
  ME: { name: 'Maine', kind: 'est', rate: 0.0675 },
  MD: { name: 'Maryland', kind: 'est', rate: 0.0475 },
  MA: { name: 'Massachusetts', kind: 'flat', rate: 0.050 },
  MI: { name: 'Michigan', kind: 'flat', rate: 0.0425 },
  MN: { name: 'Minnesota', kind: 'est', rate: 0.068 },
  MS: { name: 'Mississippi', kind: 'flat', rate: 0.044 },
  MO: { name: 'Missouri', kind: 'est', rate: 0.047 },
  MT: { name: 'Montana', kind: 'est', rate: 0.059 },
  NE: { name: 'Nebraska', kind: 'est', rate: 0.052 },
  NV: { name: 'Nevada', kind: 'none' },
  NH: { name: 'New Hampshire', kind: 'none' },
  NJ: { name: 'New Jersey', kind: 'est', rate: 0.055 },
  NM: { name: 'New Mexico', kind: 'est', rate: 0.049 },
  NY: { name: 'New York', kind: 'est', rate: 0.055 },
  NC: { name: 'North Carolina', kind: 'flat', rate: 0.0425 },
  ND: { name: 'North Dakota', kind: 'est', rate: 0.020 },
  OH: { name: 'Ohio', kind: 'est', rate: 0.035 },
  OK: { name: 'Oklahoma', kind: 'est', rate: 0.0475 },
  OR: { name: 'Oregon', kind: 'est', rate: 0.0875 },
  PA: { name: 'Pennsylvania', kind: 'flat', rate: 0.0307 },
  RI: { name: 'Rhode Island', kind: 'est', rate: 0.0475 },
  SC: { name: 'South Carolina', kind: 'est', rate: 0.062 },
  SD: { name: 'South Dakota', kind: 'none' },
  TN: { name: 'Tennessee', kind: 'none' },
  TX: { name: 'Texas', kind: 'none' },
  UT: { name: 'Utah', kind: 'flat', rate: 0.0455 },
  VT: { name: 'Vermont', kind: 'est', rate: 0.066 },
  VA: { name: 'Virginia', kind: 'est', rate: 0.0575 },
  WA: { name: 'Washington', kind: 'none' },
  WV: { name: 'West Virginia', kind: 'est', rate: 0.048 },
  WI: { name: 'Wisconsin', kind: 'est', rate: 0.053 },
  WY: { name: 'Wyoming', kind: 'none' },
}

export const STATE_OPTIONS = Object.entries(STATE_TAX)
  .map(([code, s]) => ({ code, ...s }))
  .sort((a, b) => a.name.localeCompare(b.name))

/** Progressive federal tax on an already-reduced taxable income. */
export function federalIncomeTax(taxableIncome, filingStatus) {
  if (taxableIncome <= 0) return 0
  const brackets = FEDERAL_BRACKETS[filingStatus] ?? FEDERAL_BRACKETS.single

  let tax = 0
  let lower = 0
  for (const { rate, upTo } of brackets) {
    const ceiling = upTo ?? Infinity
    if (taxableIncome <= lower) break
    tax += (Math.min(taxableIncome, ceiling) - lower) * rate
    lower = ceiling
  }
  return tax
}

/** Social Security + Medicare, including the additional Medicare surtax. */
export function ficaTax(grossIncome, filingStatus) {
  const socialSecurity =
    Math.min(grossIncome, FICA.socialSecurityWageBase) * FICA.socialSecurityRate

  const threshold =
    FICA.additionalMedicareThreshold[filingStatus] ??
    FICA.additionalMedicareThreshold.single
  const medicare =
    grossIncome * FICA.medicareRate +
    Math.max(0, grossIncome - threshold) * FICA.additionalMedicareRate

  return { socialSecurity, medicare, total: socialSecurity + medicare }
}

/** State income tax. Returns `estimated: true` for graduated-bracket states. */
export function stateIncomeTax(taxableIncome, stateCode) {
  const state = STATE_TAX[stateCode]
  if (!state || state.kind === 'none' || taxableIncome <= 0) {
    return { tax: 0, estimated: false }
  }
  return {
    tax: taxableIncome * state.rate,
    estimated: state.kind === 'est',
  }
}
