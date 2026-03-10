import { useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(d) {
  if (!d) return '—'
  // PDF dates: D:20240101120000+00'00'
  if (typeof d === 'string' && d.startsWith('D:')) {
    const s = d.slice(2)
    const year  = s.slice(0, 4)
    const month = s.slice(4, 6)
    const day   = s.slice(6, 8)
    const hour  = s.slice(8, 10) || '00'
    const min   = s.slice(10, 12) || '00'
    if (year) return `${year}-${month}-${day} ${hour}:${min}`
  }
  return String(d)
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-4 border-b border-[#1e1e1e] py-3 last:border-0">
      <span className="w-36 shrink-0 text-xs font-medium text-zinc-600">{label}</span>
      <span className="flex-1 break-words text-sm text-zinc-300">{value || '—'}</span>
    </div>
  )
}

export default function PdfMetadataViewer() {
  const [meta, setMeta]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')

  async function loadPdf(f) {
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setError('')
    setLoading(true)
    setFileName(f.name)
    setMeta(null)

    try {
      const bytes   = await f.arrayBuffer()
      const pdf     = await pdfjsLib.getDocument({ data: bytes }).promise
      const info    = await pdf.getMetadata()
      const rawInfo = info?.info || {}

      // Get page dimensions from first page
      const page    = await pdf.getPage(1)
      const vp      = page.getViewport({ scale: 1 })
      const widthPt  = Math.round(vp.width)
      const heightPt = Math.round(vp.height)

      setMeta({
        fileName: f.name,
        fileSize: f.size,
        pageCount: pdf.numPages,
        title:    rawInfo.Title || '',
        author:   rawInfo.Author || '',
        subject:  rawInfo.Subject || '',
        creator:  rawInfo.Creator || '',
        producer: rawInfo.Producer || '',
        created:  rawInfo.CreationDate || '',
        modified: rawInfo.ModDate || '',
        pdfVersion: rawInfo.PDFFormatVersion || '',
        pageSize: `${widthPt} × ${heightPt} pt`,
        encrypted: info?.contentDispositionFilename ? 'Yes' : 'No',
      })
    } catch {
      setError('Could not read this PDF. It may be corrupted or heavily encrypted.')
    }
    setLoading(false)
  }

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setDragOver(false)
    await loadPdf(e.dataTransfer.files[0])
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Upload any PDF to inspect its metadata — title, author, creator, page count, file size, and more.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('pdf-meta-input').click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors ${
          dragOver ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
          <span className="text-2xl">🔍</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">
            {fileName || 'Drop a PDF here'}
          </p>
          <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
        </div>
        <input
          id="pdf-meta-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => loadPdf(e.target.files[0])}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-orange-500" />
          <span className="text-xs text-zinc-600">Reading metadata…</span>
        </div>
      )}

      {/* Metadata table */}
      {meta && !loading && (
        <div className="flex flex-col gap-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Pages',     value: meta.pageCount },
              { label: 'File Size', value: formatSize(meta.fileSize) },
              { label: 'Page Size', value: meta.pageSize },
              { label: 'Version',   value: meta.pdfVersion ? `PDF ${meta.pdfVersion}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-3">
                <div className="text-lg font-bold text-orange-400">{value}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Full metadata */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4">
            <Row label="File Name"  value={meta.fileName} />
            <Row label="Title"      value={meta.title} />
            <Row label="Author"     value={meta.author} />
            <Row label="Subject"    value={meta.subject} />
            <Row label="Creator"    value={meta.creator} />
            <Row label="Producer"   value={meta.producer} />
            <Row label="Created"    value={formatDate(meta.created)} />
            <Row label="Modified"   value={formatDate(meta.modified)} />
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-700">
        Files are processed entirely in your browser — nothing is uploaded to any server.
      </p>
    </div>
  )
}
