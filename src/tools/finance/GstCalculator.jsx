import { useState } from 'react'

function cur(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const GST_RATES = [3, 5, 12, 18, 28]

export default function GstCalculator() {
  const [amount, setAmount]   = useState('')
  const [rate, setRate]       = useState(18)
  const [mode, setMode]       = useState('add')   // add | remove
  const [txType, setTxType]   = useState('intra') // intra | inter

  const base = parseFloat(amount) || 0

  let netAmount, gstAmount, grossAmount
  if (mode === 'add') {
    netAmount   = base
    gstAmount   = base * rate / 100
    grossAmount = base + gstAmount
  } else {
    grossAmount = base
    netAmount   = base / (1 + rate / 100)
    gstAmount   = base - netAmount
  }

  const cgst = txType === 'intra' ? gstAmount / 2 : 0
  const sgst = txType === 'intra' ? gstAmount / 2 : 0
  const igst = txType === 'inter' ? gstAmount : 0

  const hasAmount = base > 0

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="rounded-lg border border-[var(--line)] bg-[var(--surface-sunk)] px-3 py-2 text-sm text-[var(--ink-strong)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* GST Rate */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[var(--ink-body)]">GST Rate</label>
          <div className="flex flex-wrap gap-2">
            {GST_RATES.map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  rate === r
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                    : 'border-[var(--line)] text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Mode + Type */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Mode</label>
            <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
              {[['add','Add GST'],['remove','Remove GST']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    mode === val ? 'bg-[var(--accent)] text-[var(--accent-on)]' : 'text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[var(--ink-body)]">Transaction Type</label>
            <div className="flex rounded-lg border border-[var(--line)] overflow-hidden">
              {[['intra','Intra-State'],['inter','Inter-State']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTxType(val)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    txType === val ? 'bg-[var(--accent)] text-[var(--accent-on)]' : 'text-[var(--ink-body)] hover:text-[var(--ink-strong)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {hasAmount ? (
        <div className="flex flex-col gap-3">
          {/* Main cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">Net Amount (excl. GST)</p>
              <p className="text-lg font-semibold text-[var(--ink-strong)]">₹ {cur(netAmount)}</p>
            </div>
            <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">GST Amount ({rate}%)</p>
              <p className="text-lg font-semibold text-[var(--accent)]">₹ {cur(gstAmount)}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
              <p className="mb-1 text-xs text-[var(--ink-body)]">Gross Amount (incl. GST)</p>
              <p className="text-lg font-semibold text-[var(--ink-strong)]">₹ {cur(grossAmount)}</p>
            </div>
          </div>

          {/* Tax split */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Tax Breakdown</p>
            <div className="flex flex-col gap-2">
              {txType === 'intra' ? (
                <>
                  <TaxRow label={`CGST (${rate / 2}%)`} value={cgst} />
                  <TaxRow label={`SGST / UTGST (${rate / 2}%)`} value={sgst} />
                </>
              ) : (
                <TaxRow label={`IGST (${rate}%)`} value={igst} />
              )}
              <div className="border-t border-[var(--line)] pt-2">
                <TaxRow label="Total GST" value={gstAmount} bold />
              </div>
            </div>
          </div>

          {/* Invoice summary */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-sunk)] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--ink-body)]">Invoice Summary</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--ink-body)]">Taxable Value</span>
                <span className="text-[var(--ink-strong)]">₹ {cur(netAmount)}</span>
              </div>
              {txType === 'intra' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-body)]">Add: CGST @ {rate / 2}%</span>
                    <span className="text-[var(--ink-strong)]">₹ {cur(cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--ink-body)]">Add: SGST @ {rate / 2}%</span>
                    <span className="text-[var(--ink-strong)]">₹ {cur(sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-[var(--ink-body)]">Add: IGST @ {rate}%</span>
                  <span className="text-[var(--ink-strong)]">₹ {cur(igst)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--line)] pt-1.5 font-medium">
                <span className="text-[var(--ink-strong)]">Total Invoice Amount</span>
                <span className="text-[var(--accent)]">₹ {cur(grossAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--ink-muted)]">
          Enter an amount above to calculate GST
        </div>
      )}
    </div>
  )
}

function TaxRow({ label, value, bold }) {
  return (
    <div className={`flex justify-between text-xs ${bold ? 'font-medium' : ''}`}>
      <span className="text-[var(--ink-body)]">{label}</span>
      <span className={bold ? 'text-[var(--accent)]' : 'text-[var(--ink-strong)]'}>₹ {cur(value)}</span>
    </div>
  )
}
