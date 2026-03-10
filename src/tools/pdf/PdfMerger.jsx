import { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PdfMerger() {
  const [files, setFiles]       = useState([])
  const [merging, setMerging]   = useState(false)
  const [error, setError]       = useState('')
  const [dragOver, setDragOver] = useState(false)

  function addFiles(incoming) {
    const pdfs = Array.from(incoming).filter((f) => f.type === 'application/pdf')
    if (pdfs.length < incoming.length) {
      setError('Only PDF files are accepted.')
    } else {
      setError('')
    }
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size))
      const fresh = pdfs.filter((f) => !existing.has(f.name + f.size))
      return [...prev, ...fresh]
    })
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function moveFile(from, to) {
    setFiles((prev) => {
      const arr = [...prev]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      return arr
    })
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }, [])

  async function handleMerge() {
    if (files.length < 2) return
    setMerging(true)
    setError('')
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes  = await file.arrayBuffer()
        const srcDoc = await PDFDocument.load(bytes)
        const pages  = await merged.copyPages(srcDoc, srcDoc.getPageIndices())
        pages.forEach((p) => merged.addPage(p))
      }
      const outBytes = await merged.save()
      const blob = new Blob([outBytes], { type: 'application/pdf' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to merge. One or more PDFs may be encrypted or corrupted.')
    }
    setMerging(false)
  }

  const totalSize = files.reduce((s, f) => s + f.size, 0)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Add PDF files, reorder them using the arrows, then click Merge. Files never leave your device.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 transition-colors cursor-pointer ${
          dragOver ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
        }`}
        onClick={() => document.getElementById('pdf-merger-input').click()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
          <span className="text-2xl">📄</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">Drop PDF files here</p>
          <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
        </div>
        <input
          id="pdf-merger-input"
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              {files.length} file{files.length !== 1 ? 's' : ''} · {formatSize(totalSize)} total
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-zinc-700 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          {files.map((file, i) => (
            <div key={file.name + file.size + i} className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2.5">
              <span className="text-orange-400 text-sm">📄</span>
              <span className="flex-1 truncate text-sm text-zinc-300">{file.name}</span>
              <span className="text-xs text-zinc-700 shrink-0">{formatSize(file.size)}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => moveFile(i, i - 1)}
                  disabled={i === 0}
                  className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:text-zinc-300 disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveFile(i, i + 1)}
                  disabled={i === files.length - 1}
                  className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:text-zinc-300 disabled:opacity-20"
                >
                  ▼
                </button>
                <button
                  onClick={() => removeFile(i)}
                  className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={files.length < 2 || merging}
        className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {merging ? 'Merging…' : `Merge ${files.length > 0 ? files.length : ''} PDFs`}
      </button>

      {files.length === 1 && (
        <p className="text-center text-xs text-zinc-700">Add at least one more PDF to merge.</p>
      )}

      <p className="text-xs text-zinc-700">
        Your files are processed entirely in your browser — nothing is uploaded to any server.
      </p>
    </div>
  )
}
