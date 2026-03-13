import { useState, useRef } from 'react'
import { Trash2, Plus, Download } from 'lucide-react'

const TODAY = new Date().toISOString().split('T')[0]
const DUE_DEFAULT = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const GST_RATES = [0, 5, 12, 18, 28]

function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function newItem() {
  return { id: Date.now(), description: '', qty: '', rate: '' }
}

const inputCls =
  'w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-500/50 transition-colors'

export default function InvoiceGenerator() {
  // Business info
  const [bizName, setBizName] = useState('')
  const [bizAddress, setBizAddress] = useState('')
  const [bizEmail, setBizEmail] = useState('')
  const [bizPhone, setBizPhone] = useState('')
  const [bizGst, setBizGst] = useState('')

  // Client info
  const [clientName, setClientName] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientGst, setClientGst] = useState('')

  // Invoice details
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001')
  const [invoiceDate, setInvoiceDate] = useState(TODAY)
  const [dueDate, setDueDate] = useState(DUE_DEFAULT)

  // Line items
  const [items, setItems] = useState([newItem()])

  // Tax
  const [gstRate, setGstRate] = useState(18)
  const [useIgst, setUseIgst] = useState(false)

  // Notes
  const [notes, setNotes] = useState('')

  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef(null)

  function addItem() {
    setItems((prev) => [...prev, newItem()])
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateItem(id, field, value) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const subtotal = items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0
    const rate = parseFloat(item.rate) || 0
    return sum + qty * rate
  }, 0)

  const gstAmount = (subtotal * gstRate) / 100
  const total = subtotal + gstAmount

  async function handleDownload() {
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()
      const margin = 40
      let y = margin

      // Header background
      doc.setFillColor(251, 191, 36) // amber-400
      doc.rect(0, 0, pageW, 70, 'F')

      // Business name
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(15, 15, 15)
      doc.text(bizName || 'Your Business', margin, 30)

      // INVOICE label
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      if (bizEmail) doc.text(bizEmail, margin, 48)
      if (bizPhone) doc.text(bizPhone, margin + 200, 48)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(24)
      doc.setTextColor(15, 15, 15)
      doc.text('INVOICE', pageW - margin, 40, { align: 'right' })

      y = 90

      // Invoice meta
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text(`Invoice No: ${invoiceNumber}`, pageW - margin, y, { align: 'right' })
      doc.text(`Date: ${invoiceDate}`, pageW - margin, y + 16, { align: 'right' })
      doc.text(`Due Date: ${dueDate}`, pageW - margin, y + 32, { align: 'right' })

      // Business address
      doc.setTextColor(60, 60, 60)
      doc.text(bizAddress || '', margin, y, { maxWidth: 220 })
      if (bizGst) doc.text(`GSTIN: ${bizGst}`, margin, y + 36)

      y = 165

      // Bill To
      doc.setFillColor(245, 245, 245)
      doc.rect(margin, y, pageW - 2 * margin, 65, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('BILL TO', margin + 10, y + 14)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(20, 20, 20)
      doc.text(clientName || 'Client Name', margin + 10, y + 28)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      if (clientAddress) doc.text(clientAddress, margin + 10, y + 42, { maxWidth: 220 })
      if (clientGst) doc.text(`GSTIN: ${clientGst}`, margin + 10, y + 56)

      y = 245

      // Items table header
      doc.setFillColor(30, 30, 30)
      doc.rect(margin, y, pageW - 2 * margin, 24, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      const colW = { desc: 240, qty: 60, rate: 90, amount: 90 }
      doc.text('Description', margin + 10, y + 15)
      doc.text('Qty', margin + colW.desc + 10, y + 15)
      doc.text('Rate (₹)', margin + colW.desc + colW.qty + 10, y + 15)
      doc.text('Amount (₹)', pageW - margin - 10, y + 15, { align: 'right' })

      y += 24

      // Items rows
      items.forEach((item, idx) => {
        const qty = parseFloat(item.qty) || 0
        const rate = parseFloat(item.rate) || 0
        const amount = qty * rate
        const bg = idx % 2 === 0 ? [255, 255, 255] : [249, 249, 249]
        doc.setFillColor(...bg)
        doc.rect(margin, y, pageW - 2 * margin, 22, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(40, 40, 40)
        doc.text(item.description || '—', margin + 10, y + 14, { maxWidth: colW.desc - 15 })
        doc.text(String(qty), margin + colW.desc + 10, y + 14)
        doc.text(fmt(rate), margin + colW.desc + colW.qty + 10, y + 14)
        doc.text(fmt(amount), pageW - margin - 10, y + 14, { align: 'right' })
        y += 22
      })

      // Totals
      y += 12
      const totalsX = pageW - margin - 160
      doc.setDrawColor(200, 200, 200)
      doc.line(totalsX, y, pageW - margin, y)
      y += 14

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.text('Subtotal', totalsX, y)
      doc.text(`₹${fmt(subtotal)}`, pageW - margin, y, { align: 'right' })
      y += 16

      if (gstRate > 0) {
        if (useIgst) {
          doc.text(`IGST (${gstRate}%)`, totalsX, y)
          doc.text(`₹${fmt(gstAmount)}`, pageW - margin, y, { align: 'right' })
          y += 16
        } else {
          const half = gstAmount / 2
          doc.text(`CGST (${gstRate / 2}%)`, totalsX, y)
          doc.text(`₹${fmt(half)}`, pageW - margin, y, { align: 'right' })
          y += 14
          doc.text(`SGST (${gstRate / 2}%)`, totalsX, y)
          doc.text(`₹${fmt(half)}`, pageW - margin, y, { align: 'right' })
          y += 16
        }
      }

      doc.setDrawColor(200, 200, 200)
      doc.line(totalsX, y, pageW - margin, y)
      y += 14

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(20, 20, 20)
      doc.text('Total', totalsX, y)
      doc.text(`₹${fmt(total)}`, pageW - margin, y, { align: 'right' })

      // Notes
      if (notes) {
        y += 36
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text('NOTES', margin, y)
        y += 12
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(60, 60, 60)
        doc.text(notes, margin, y, { maxWidth: pageW - 2 * margin })
      }

      // Footer
      const pageH = doc.internal.pageSize.getHeight()
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(160, 160, 160)
      doc.text('Generated with QuickKit — quickkit.in', pageW / 2, pageH - 20, { align: 'center' })

      doc.save(`${invoiceNumber || 'invoice'}.pdf`)
    } catch (err) {
      console.error(err)
    }
    setDownloading(false)
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ── LEFT: Form ── */}
      <div className="flex flex-col gap-5">

        {/* Business Info */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Your Business</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Business Name</label>
              <input className={inputCls} placeholder="Acme Pvt Ltd" value={bizName} onChange={(e) => setBizName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Address</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder="123, MG Road, Bengaluru - 560001"
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Email</label>
                <input className={inputCls} placeholder="you@example.com" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Phone</label>
                <input className={inputCls} placeholder="+91 98765 43210" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">GST Number (optional)</label>
              <input className={inputCls} placeholder="22AAAAA0000A1Z5" value={bizGst} onChange={(e) => setBizGst(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Client Info */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Bill To</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Client Name</label>
              <input className={inputCls} placeholder="Client Name / Company" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Client Address</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder="456, Park Street, Mumbai - 400001"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Client GST (optional)</label>
              <input className={inputCls} placeholder="27BBBBB1111B1Z5" value={clientGst} onChange={(e) => setClientGst(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Invoice Details */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Invoice Details</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Invoice No.</label>
              <input className={inputCls} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Invoice Date</label>
              <input type="date" className={inputCls} value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Due Date</label>
              <input type="date" className={inputCls} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Line Items</h2>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_64px_96px_80px] gap-2 px-1">
              <span className="text-xs text-zinc-600">Description</span>
              <span className="text-xs text-zinc-600">Qty</span>
              <span className="text-xs text-zinc-600">Rate (₹)</span>
              <span className="text-xs text-zinc-600 text-right">Amount</span>
            </div>
            {items.map((item) => {
              const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)
              return (
                <div key={item.id} className="grid grid-cols-[1fr_64px_96px_80px] items-center gap-2">
                  <input
                    className={inputCls}
                    placeholder="Service description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="1"
                    min="0"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                  />
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="0"
                    min="0"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                  />
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs text-zinc-300">₹{fmt(amount)}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <button
            onClick={addItem}
            className="mt-3 flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            <Plus size={14} /> Add Item
          </button>
        </section>

        {/* Tax */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Tax</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">GST Rate</label>
              <div className="flex gap-1.5">
                {GST_RATES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setGstRate(r)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      gstRate === r
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">Tax Type</label>
              <div className="flex gap-1.5">
                {['CGST + SGST', 'IGST'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setUseIgst(type === 'IGST')}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      (type === 'IGST') === useIgst
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Notes (optional)</h2>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Payment due within 30 days. Bank details: ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400 disabled:opacity-60"
        >
          <Download size={16} />
          {downloading ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </div>

      {/* ── RIGHT: Preview ── */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <p className="mb-3 text-xs text-zinc-600 uppercase tracking-widest">Preview</p>
          <div
            ref={previewRef}
            className="rounded-xl border border-[#2a2a2a] bg-white p-8 text-[#111] shadow-2xl"
            style={{ fontFamily: 'sans-serif', minHeight: 600 }}
          >
            {/* Invoice header */}
            <div className="mb-6 flex items-start justify-between border-b-2 border-amber-400 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#111]">{bizName || 'Your Business'}</h2>
                {bizAddress && <p className="mt-0.5 text-xs text-gray-500 whitespace-pre-line">{bizAddress}</p>}
                {bizEmail && <p className="text-xs text-gray-500">{bizEmail}</p>}
                {bizPhone && <p className="text-xs text-gray-500">{bizPhone}</p>}
                {bizGst && <p className="text-xs text-gray-500">GSTIN: {bizGst}</p>}
              </div>
              <div className="text-right">
                <p className="text-2xl font-black tracking-wide text-amber-500">INVOICE</p>
                <p className="mt-1 text-xs text-gray-500">No: <span className="font-medium text-gray-700">{invoiceNumber}</span></p>
                <p className="text-xs text-gray-500">Date: <span className="font-medium text-gray-700">{invoiceDate}</span></p>
                <p className="text-xs text-gray-500">Due: <span className="font-medium text-gray-700">{dueDate}</span></p>
              </div>
            </div>

            {/* Bill to */}
            <div className="mb-5 rounded-lg bg-gray-50 px-4 py-3">
              <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-400">Bill To</p>
              <p className="font-semibold text-[#111]">{clientName || 'Client Name'}</p>
              {clientAddress && <p className="text-xs text-gray-500 whitespace-pre-line">{clientAddress}</p>}
              {clientGst && <p className="text-xs text-gray-500">GSTIN: {clientGst}</p>}
            </div>

            {/* Items table */}
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="bg-[#111] text-white">
                  <th className="py-2 px-2 text-left font-semibold">Description</th>
                  <th className="py-2 px-2 text-right font-semibold">Qty</th>
                  <th className="py-2 px-2 text-right font-semibold">Rate</th>
                  <th className="py-2 px-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)
                  return (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-1.5 px-2 text-gray-700">{item.description || '—'}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">{item.qty || '—'}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">₹{fmt(parseFloat(item.rate) || 0)}</td>
                      <td className="py-1.5 px-2 text-right text-gray-700">₹{fmt(amount)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="ml-auto w-56 text-xs border-t border-gray-200 pt-2">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{fmt(subtotal)}</span>
              </div>
              {gstRate > 0 && !useIgst && (
                <>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">CGST ({gstRate / 2}%)</span>
                    <span className="font-medium">₹{fmt(gstAmount / 2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">SGST ({gstRate / 2}%)</span>
                    <span className="font-medium">₹{fmt(gstAmount / 2)}</span>
                  </div>
                </>
              )}
              {gstRate > 0 && useIgst && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">IGST ({gstRate}%)</span>
                  <span className="font-medium">₹{fmt(gstAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-300 pt-2 mt-1">
                <span className="font-bold text-[#111]">Total</span>
                <span className="font-bold text-amber-600">₹{fmt(total)}</span>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-400">Notes</p>
                <p className="text-xs text-gray-600 whitespace-pre-line">{notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
