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
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#2a2a2a] bg-[#141414] py-12 transition-colors hover:border-violet-500/40"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p className="text-sm text-zinc-400">Drop an image here or <span className="text-violet-400">browse</span></p>
        <p className="text-xs text-zinc-600">JPEG · PNG · WebP · GIF · SVG</p>
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
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <div className="flex items-start gap-4">
              <img src={preview.url} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white">{preview.name}</p>
                <p className="text-xs text-zinc-500">{preview.type} · {formatBytes(preview.size)}</p>
                {b64Size && <p className="text-xs text-zinc-500">Base64 output: {b64Size}</p>}
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
                    ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:border-[#3a3a3a]'
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
              className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 font-mono text-xs text-zinc-400 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white"
            >
              Download .txt
            </button>
          </div>
        </>
      )}
    </div>
  )
}
