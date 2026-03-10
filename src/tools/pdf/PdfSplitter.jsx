import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Parse page range string like "1,3,5-8,10" into sorted unique 0-based indices
function parseRanges(input, totalPages) {
  const indices = new Set()
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean)
  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number)
      for (let i = a; i <= b; i++) {
        if (i >= 1 && i <= totalPages) indices.add(i - 1)
      }
    } else {
      const n = Number(part)
      if (n >= 1 && n <= totalPages) indices.add(n - 1)
    }
  }
  return [...indices].sort((a, b) => a - b)
}

export default function PdfSplitter() {
  const [file, setFile]           = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [range, setRange]         = useState('')
  const [splitting, setSplitting] = useState(false)
  const [error, setError]         = useState('')
  const [dragOver, setDragOver]   = useState(false)

  async function loadFile(f) {
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setError('')
    try {
      const bytes  = await f.arrayBuffer()
      const doc    = await PDFDocument.load(bytes)
      setFile({ file: f, bytes })
      setPageCount(doc.getPageCount())
      setRange('')
    } catch {
      setError('Could not read this PDF. It may be encrypted or corrupted.')
    }
  }

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setDragOver(false)
    await loadFile(e.dataTransfer.files[0])
  }, [])

  async function handleSplit() {
    if (!file || !range.trim()) return
    const indices = parseRanges(range, pageCount)
    if (indices.length === 0) {
      setError(`No valid pages found. Enter numbers between 1 and ${pageCount}.`)
      return
    }
    setSplitting(true)
    setError('')
    try {
      const srcDoc = await PDFDocument.load(file.bytes)
      const outDoc = await PDFDocument.create()
      const pages  = await outDoc.copyPages(srcDoc, indices)
      pages.forEach((p) => outDoc.addPage(p))
      const outBytes = await outDoc.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `split-pages-${range.replace(/\s/g, '')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to split the PDF. It may be encrypted.')
    }
    setSplitting(false)
  }

  const previewIndices = range.trim() ? parseRanges(range, pageCount) : []

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Upload a PDF, enter the pages you want to extract, and download a new PDF with just those pages.
      </p>

      {/* Drop zone / file picker */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('pdf-splitter-input').click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors ${
            dragOver ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <span className="text-2xl">✂️</span>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-300">Drop a PDF here</p>
            <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
          </div>
          <input
            id="pdf-splitter-input"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => loadFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3">
          <span className="text-orange-400">📄</span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-zinc-300">{file.file.name}</p>
            <p className="text-xs text-zinc-600">{pageCount} pages · {formatSize(file.file.size)}</p>
          </div>
          <button
            onClick={() => { setFile(null); setPageCount(0); setRange(''); setError('') }}
            className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Page range input */}
      {file && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Pages to Extract
            </label>
            <input
              type="text"
              value={range}
              onChange={(e) => { setRange(e.target.value); setError('') }}
              placeholder={`e.g. 1,3,5-8  (1 to ${pageCount})`}
              className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            />
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'First half',  value: `1-${Math.floor(pageCount / 2)}` },
              { label: 'Second half', value: `${Math.floor(pageCount / 2) + 1}-${pageCount}` },
              { label: 'Odd pages',   value: Array.from({ length: pageCount }, (_, i) => i + 1).filter((n) => n % 2 !== 0).join(',') },
              { label: 'Even pages',  value: Array.from({ length: pageCount }, (_, i) => i + 1).filter((n) => n % 2 === 0).join(',') },
              { label: 'All pages',   value: `1-${pageCount}` },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setRange(value)}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-orange-500/40 hover:text-orange-400"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Preview */}
          {previewIndices.length > 0 && (
            <div className="rounded-lg border border-[#1e1e1e] bg-[#0d0d0d] px-4 py-3">
              <p className="text-xs text-zinc-600 mb-2">
                Extracting <span className="font-medium text-zinc-400">{previewIndices.length} page{previewIndices.length !== 1 ? 's' : ''}</span>:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {previewIndices.map((i) => (
                  <span key={i} className="rounded bg-orange-500/10 px-2 py-0.5 text-xs font-mono text-orange-400">
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSplit}
            disabled={!range.trim() || previewIndices.length === 0 || splitting}
            className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {splitting ? 'Splitting…' : `Extract ${previewIndices.length > 0 ? previewIndices.length : ''} Pages`}
          </button>
        </div>
      )}

      <p className="text-xs text-zinc-700">
        Files are processed entirely in your browser — nothing is uploaded to any server.
      </p>
    </div>
  )
}
