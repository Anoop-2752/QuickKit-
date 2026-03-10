import { useState, useRef } from 'react'

function currency(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function SalarySlipGenerator() {
  const printRef = useRef()
  const today = new Date()

  const [info, setInfo] = useState({
    companyName: '', companyAddress: '',
    employeeName: '', employeeId: '', designation: '', department: '',
    bankName: '', accountNo: '', panNo: '',
    month: MONTHS[today.getMonth()], year: String(today.getFullYear()),
    workingDays: '26', presentDays: '26',
  })

  const [earnings, setEarnings] = useState([
    { label: 'Basic Salary', amount: '' },
    { label: 'HRA', amount: '' },
    { label: 'Transport Allowance', amount: '' },
    { label: 'Medical Allowance', amount: '' },
  ])

  const [deductions, setDeductions] = useState([
    { label: 'Provident Fund (PF)', amount: '' },
    { label: 'Professional Tax', amount: '' },
    { label: 'Income Tax (TDS)', amount: '' },
  ])

  function setField(key, val) {
    setInfo((f) => ({ ...f, [key]: val }))
  }

  function updateEarning(i, key, val) {
    setEarnings((prev) => prev.map((e, idx) => idx === i ? { ...e, [key]: val } : e))
  }
  function updateDeduction(i, key, val) {
    setDeductions((prev) => prev.map((d, idx) => idx === i ? { ...d, [key]: val } : d))
  }
  function addEarning() { setEarnings((p) => [...p, { label: '', amount: '' }]) }
  function addDeduction() { setDeductions((p) => [...p, { label: '', amount: '' }]) }
  function removeEarning(i) { setEarnings((p) => p.filter((_, idx) => idx !== i)) }
  function removeDeduction(i) { setDeductions((p) => p.filter((_, idx) => idx !== i)) }

  const totalEarnings   = earnings.reduce((s, e) => s + Number(e.amount || 0), 0)
  const totalDeductions = deductions.reduce((s, d) => s + Number(d.amount || 0), 0)
  const netSalary       = totalEarnings - totalDeductions

  function handlePrint() {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Salary Slip</title><style>
      body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:0;padding:24px}
      h2{text-align:center;margin:0 0 4px}
      .center{text-align:center}
      .header{border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:12px}
      table{width:100%;border-collapse:collapse;margin-bottom:12px}
      td,th{border:1px solid #ccc;padding:6px 10px;font-size:12px}
      th{background:#f5f5f5;font-weight:600}
      .total td{font-weight:700;background:#f0f0f0}
      .net td{font-weight:700;font-size:14px;background:#e8f5e9}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-bottom:12px;font-size:12px}
      .info-grid span{color:#555}
    </style></head><body>${content}</body></html>`)
    win.document.close()
    win.print()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Company info */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Company Info</p>
          {[
            ['companyName', 'Company Name'],
            ['companyAddress', 'Company Address'],
          ].map(([key, label]) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">{label}</span>
              <input value={info[key]} onChange={(e) => setField(key, e.target.value)} placeholder={label}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">Month</span>
              <select value={info.month} onChange={(e) => setField('month', e.target.value)}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:outline-none">
                {MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">Year</span>
              <input value={info.year} onChange={(e) => setField('year', e.target.value)} placeholder="2025"
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Employee info */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Employee Info</p>
          {[
            ['employeeName','Employee Name'],['employeeId','Employee ID'],
            ['designation','Designation'],['department','Department'],
            ['bankName','Bank Name'],['accountNo','Account Number'],
            ['panNo','PAN Number'],
          ].map(([key, label]) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-xs text-zinc-600">{label}</span>
              <input value={info[key]} onChange={(e) => setField(key, e.target.value)} placeholder={label}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2">
            {[['workingDays','Working Days'],['presentDays','Days Present']].map(([key, label]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs text-zinc-600">{label}</span>
                <input type="number" value={info[key]} onChange={(e) => setField(key, e.target.value)}
                  className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:outline-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings & Deductions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Earnings */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Earnings</p>
            <button onClick={addEarning} className="text-xs text-zinc-600 hover:text-emerald-400">+ Add</button>
          </div>
          {earnings.map((e, i) => (
            <div key={i} className="flex gap-2">
              <input value={e.label} onChange={(ev) => updateEarning(i, 'label', ev.target.value)} placeholder="Component"
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none" />
              <input type="number" value={e.amount} onChange={(ev) => updateEarning(i, 'amount', ev.target.value)} placeholder="0"
                className="w-24 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:outline-none" />
              <button onClick={() => removeEarning(i)} className="text-zinc-700 hover:text-red-400 text-xs px-1">✕</button>
            </div>
          ))}
          <div className="flex justify-between border-t border-[#2a2a2a] pt-2 text-sm font-semibold">
            <span className="text-zinc-400">Total Earnings</span>
            <span className="text-emerald-400">₹ {currency(totalEarnings)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Deductions</p>
            <button onClick={addDeduction} className="text-xs text-zinc-600 hover:text-red-400">+ Add</button>
          </div>
          {deductions.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input value={d.label} onChange={(ev) => updateDeduction(i, 'label', ev.target.value)} placeholder="Deduction"
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none" />
              <input type="number" value={d.amount} onChange={(ev) => updateDeduction(i, 'amount', ev.target.value)} placeholder="0"
                className="w-24 rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:outline-none" />
              <button onClick={() => removeDeduction(i)} className="text-zinc-700 hover:text-red-400 text-xs px-1">✕</button>
            </div>
          ))}
          <div className="flex justify-between border-t border-[#2a2a2a] pt-2 text-sm font-semibold">
            <span className="text-zinc-400">Total Deductions</span>
            <span className="text-red-400">₹ {currency(totalDeductions)}</span>
          </div>
        </div>
      </div>

      {/* Net salary summary */}
      <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/5 px-5 py-4">
        <span className="text-sm font-semibold text-zinc-300">Net Salary (Take Home)</span>
        <span className="text-2xl font-bold text-rose-400">₹ {currency(netSalary)}</span>
      </div>

      <button
        onClick={handlePrint}
        className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-500"
      >
        Print / Download Salary Slip
      </button>

      {/* Hidden print template */}
      <div className="hidden">
        <div ref={printRef}>
          <div className="header">
            <h2>{info.companyName || 'Company Name'}</h2>
            <p className="center" style={{margin:'2px 0',color:'#555',fontSize:'12px'}}>{info.companyAddress}</p>
            <p className="center" style={{margin:'8px 0 0',fontWeight:'bold',fontSize:'14px'}}>
              Salary Slip — {info.month} {info.year}
            </p>
          </div>
          <div className="info-grid">
            <div><span>Employee Name: </span><strong>{info.employeeName}</strong></div>
            <div><span>Employee ID: </span><strong>{info.employeeId}</strong></div>
            <div><span>Designation: </span><strong>{info.designation}</strong></div>
            <div><span>Department: </span><strong>{info.department}</strong></div>
            <div><span>Bank Name: </span><strong>{info.bankName}</strong></div>
            <div><span>Account No: </span><strong>{info.accountNo}</strong></div>
            <div><span>PAN: </span><strong>{info.panNo}</strong></div>
            <div><span>Working Days: </span><strong>{info.workingDays} | Present: {info.presentDays}</strong></div>
          </div>
          <table>
            <thead><tr><th>Earnings</th><th>Amount (₹)</th><th>Deductions</th><th>Amount (₹)</th></tr></thead>
            <tbody>
              {Array.from({ length: Math.max(earnings.length, deductions.length) }).map((_, i) => (
                <tr key={i}>
                  <td>{earnings[i]?.label || ''}</td>
                  <td>{earnings[i]?.amount ? currency(earnings[i].amount) : ''}</td>
                  <td>{deductions[i]?.label || ''}</td>
                  <td>{deductions[i]?.amount ? currency(deductions[i].amount) : ''}</td>
                </tr>
              ))}
              <tr className="total">
                <td>Total Earnings</td><td>{currency(totalEarnings)}</td>
                <td>Total Deductions</td><td>{currency(totalDeductions)}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr className="net">
                <td colSpan={2} style={{textAlign:'center'}}>
                  Net Salary (Take Home): ₹ {currency(netSalary)}
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{fontSize:'11px',color:'#888',marginTop:'16px',textAlign:'center'}}>
            This is a computer-generated salary slip and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  )
}
