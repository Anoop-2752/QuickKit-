import { useState, useRef } from 'react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function ImageToBase64() {
  const [preview, setPreview]   = useState(null)  // { url, name, size, type }
  const [b64, setB64]           = useState('')
  const [copied, setCopied]     = useState(false)
  const [format, setFormat]     = useState('datauri')  // 'datauri' | 'raw'
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setPreview({ url: URL.createObjectURL(file), name: file.name, size: file.size, type: file.type })
    const reader = new FileReader()
    reader.onload = (e) => setB64(e.target.result)
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const output = format === 'raw' ? b64.replace(/^data:[^;]+;base64,/, '') : b64

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([output], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${preview?.name ?? 'image'}.base64.txt`
    a.click()
  }

  const b64Size = b64 ? formatBytes(new Blob([output]).size) : null

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--surface-alt)] py-12 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-sm text-[var(--ink-body)]">Drop an image here or <span className="text-[var(--accent)]">browse</span></p>
        <p className="text-xs text-[var(--ink-muted)]">JPEG · PNG · WebP · GIF · SVG</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <>
          {/* Image preview + meta */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
            <div className="flex items-start gap-4">
              <img src={preview.url} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[var(--ink)]">{preview.name}</p>
                <p className="text-xs text-[var(--ink-body)]">{preview.type} · {formatBytes(preview.size)}</p>
                {b64Size && <p className="text-xs text-[var(--ink-body)]">Base64 output: {b64Size}</p>}
              </div>
            </div>
          </div>

          {/* Format toggle */}
          <div className="flex gap-2">
            {['datauri', 'raw'].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  format === f
                    ? 'border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:border-[var(--line-strong)]'
                }`}
              >
                {f === 'datauri' ? 'Data URI (with prefix)' : 'Raw Base64'}
              </button>
            ))}
          </div>

          {/* Output box */}
          <div className="relative">
            <textarea
              readOnly
              value={output}
              rows={6}
              className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4 font-mono text-xs text-[var(--ink-body)] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent)]"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-4 py-2.5 text-sm text-[var(--ink-strong)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
            >
              Download .txt
            </button>
          </div>
        </>
      )}
    </div>
  )
}
