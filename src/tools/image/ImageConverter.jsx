import { useState, useRef } from 'react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const FORMATS = [
  { label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG',  mime: 'image/png',  ext: 'png' },
  { label: 'WebP', mime: 'image/webp', ext: 'webp' },
]

export default function ImageConverter() {
  const [original, setOriginal] = useState(null)
  const [targetFormat, setTargetFormat] = useState('image/webp')
  const [quality, setQuality] = useState(90)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (original) URL.revokeObjectURL(original.url)
    if (result)   URL.revokeObjectURL(result.url)
    setResult(null)
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size, type: file.type })
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  async function handleConvert() {
    if (!original) return
    setLoading(true)
    const img = new Image()
    img.src = original.url
    await new Promise((r) => { img.onload = r })
    const canvas = document.createElement('canvas')
    canvas.width  = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    // White background for JPEG (no alpha)
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0)
    canvas.toBlob(
      (blob) => {
        if (result) URL.revokeObjectURL(result.url)
        setResult({ blob, url: URL.createObjectURL(blob), size: blob.size })
        setLoading(false)
      },
      targetFormat,
      quality / 100,
    )
  }

  function handleDownload() {
    if (!result) return
    const fmt = FORMATS.find((f) => f.mime === targetFormat)
    const a = document.createElement('a')
    a.href = result.url
    a.download = `converted.${fmt.ext}`
    a.click()
  }

  const savings = result ? Math.round((1 - result.size / original.size) * 100) : null
  const lossless = targetFormat === 'image/png'

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
        <p className="text-xs text-zinc-600">JPEG · PNG · WebP · GIF · BMP</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {original && (
        <>
          {/* Original info */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <div className="flex items-center gap-4">
              <img src={original.url} alt="original" className="h-16 w-16 rounded-lg object-cover" />
              <div>
                <p className="text-sm text-white">{original.file.name}</p>
                <p className="text-xs text-zinc-500">{original.type} · {formatBytes(original.size)}</p>
              </div>
            </div>
          </div>

          {/* Target format */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <p className="mb-3 text-sm text-zinc-400">Convert to</p>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.mime}
                  onClick={() => setTargetFormat(f.mime)}
                  disabled={f.mime === original.type}
                  className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    targetFormat === f.mime
                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                      : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-400 hover:border-[#3a3a3a]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Quality slider — not relevant for PNG */}
            {!lossless && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-zinc-400">Quality</label>
                  <span className="text-sm font-semibold text-white">{quality}%</span>
                </div>
                <input
                  type="range" min={10} max={100} step={5} value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Converted — {formatBytes(result.size)}</p>
                  <p className="text-xs text-zinc-500">
                    {savings !== null && savings > 0
                      ? `${savings}% smaller than original`
                      : savings !== null && savings < 0
                        ? `${Math.abs(savings)}% larger (lossless format)`
                        : 'Same size as original'}
                  </p>
                </div>
                <img src={result.url} alt="converted" className="h-12 w-12 rounded-lg object-cover" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              disabled={loading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Converting…' : 'Convert'}
            </button>
            {result && (
              <button
                onClick={handleDownload}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-[#3a3a3a] hover:text-white"
              >
                Download
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
