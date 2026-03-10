import { useState, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PdfToText() {
  const [file, setFile]         = useState(null)
  const [text, setText]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [copied, setCopied]     = useState(false)

  async function extractText(f) {
    if (!f || f.type !== 'application/pdf') {
      setError('Please select a valid PDF file.')
      return
    }
    setFile(f)
    setText('')
    setError('')
    setLoading(true)
    setProgress(0)

    try {
      const bytes  = await f.arrayBuffer()
      const pdf    = await pdfjsLib.getDocument({ data: bytes }).promise
      const total  = pdf.numPages
      setPageCount(total)

      let fullText = ''
      for (let i = 1; i <= total; i++) {
        const page    = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => item.str).join(' ')
        fullText += `--- Page ${i} ---\n${pageText}\n\n`
        setProgress(Math.round((i / total) * 100))
      }

      setText(fullText.trim())
    } catch {
      setError('Could not extract text. The PDF may be image-based, encrypted, or corrupted.')
    }
    setLoading(false)
  }

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setDragOver(false)
    await extractText(e.dataTransfer.files[0])
  }, [])

  async function handleCopy() {
    if (!text) return
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!text) return
    const blob = new Blob([text], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = (file?.name?.replace('.pdf', '') || 'extracted') + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0
  const charCount = text.length

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Upload a PDF to extract all readable text. Works best with text-based PDFs. Scanned/image PDFs won't have extractable text.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('pdf-text-input').click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 cursor-pointer transition-colors ${
          dragOver ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
          <span className="text-2xl">📝</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">
            {file ? file.name : 'Drop a PDF here'}
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            {file ? formatSize(file.size) : 'or click to browse'}
          </p>
        </div>
        <input
          id="pdf-text-input"
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => extractText(e.target.files[0])}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Progress bar */}
      {loading && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <span>Extracting text…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e1e1e]">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Output */}
      {text && !loading && (
        <div className="flex flex-col gap-3">
          {/* Stats + actions */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-4 text-xs text-zinc-600">
              <span><span className="font-medium text-zinc-400">{pageCount}</span> pages</span>
              <span><span className="font-medium text-zinc-400">{wordCount.toLocaleString()}</span> words</span>
              <span><span className="font-medium text-zinc-400">{charCount.toLocaleString()}</span> chars</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-500"
              >
                Download .txt
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={text}
            className="h-96 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 font-mono text-xs leading-relaxed text-zinc-300 focus:outline-none"
          />
        </div>
      )}

      <p className="text-xs text-zinc-700">
        Files are processed entirely in your browser — nothing is uploaded to any server.
      </p>
    </div>
  )
}
