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
          <label className="text-xs text-zinc-500">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        {/* GST Rate */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">GST Rate</label>
          <div className="flex flex-wrap gap-2">
            {GST_RATES.map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  rate === r
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-[#2a2a2a] text-zinc-500 hover:text-zinc-300'
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
            <label className="text-xs text-zinc-500">Mode</label>
            <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
              {[['add','Add GST'],['remove','Remove GST']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    mode === val ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">Transaction Type</label>
            <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
              {[['intra','Intra-State'],['inter','Inter-State']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTxType(val)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    txType === val ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
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
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-1 text-xs text-zinc-500">Net Amount (excl. GST)</p>
              <p className="text-lg font-semibold text-zinc-200">₹ {cur(netAmount)}</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="mb-1 text-xs text-zinc-500">GST Amount ({rate}%)</p>
              <p className="text-lg font-semibold text-amber-400">₹ {cur(gstAmount)}</p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-1 text-xs text-zinc-500">Gross Amount (incl. GST)</p>
              <p className="text-lg font-semibold text-zinc-200">₹ {cur(grossAmount)}</p>
            </div>
          </div>

          {/* Tax split */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Tax Breakdown</p>
            <div className="flex flex-col gap-2">
              {txType === 'intra' ? (
                <>
                  <TaxRow label={`CGST (${rate / 2}%)`} value={cgst} />
                  <TaxRow label={`SGST / UTGST (${rate / 2}%)`} value={sgst} />
                </>
              ) : (
                <TaxRow label={`IGST (${rate}%)`} value={igst} />
              )}
              <div className="border-t border-[#2a2a2a] pt-2">
                <TaxRow label="Total GST" value={gstAmount} bold />
              </div>
            </div>
          </div>

          {/* Invoice summary */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Invoice Summary</p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Taxable Value</span>
                <span className="text-zinc-300">₹ {cur(netAmount)}</span>
              </div>
              {txType === 'intra' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Add: CGST @ {rate / 2}%</span>
                    <span className="text-zinc-300">₹ {cur(cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Add: SGST @ {rate / 2}%</span>
                    <span className="text-zinc-300">₹ {cur(sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Add: IGST @ {rate}%</span>
                  <span className="text-zinc-300">₹ {cur(igst)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#2a2a2a] pt-1.5 font-medium">
                <span className="text-zinc-300">Total Invoice Amount</span>
                <span className="text-amber-400">₹ {cur(grossAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-[#2a2a2a] text-sm text-zinc-600">
          Enter an amount above to calculate GST
        </div>
      )}
    </div>
  )
}

function TaxRow({ label, value, bold }) {
  return (
    <div className={`flex justify-between text-xs ${bold ? 'font-medium' : ''}`}>
      <span className="text-zinc-500">{label}</span>
      <span className={bold ? 'text-amber-400' : 'text-zinc-300'}>₹ {cur(value)}</span>
    </div>
  )
}
