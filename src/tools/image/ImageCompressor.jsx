import { useState, useRef } from 'react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function compressImage(file, quality) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          resolve(blob)
        },
        mimeType,
        quality / 100,
      )
    }
    img.src = url
  })
}

export default function ImageCompressor() {
  const [original, setOriginal] = useState(null)   // { file, url, size }
  const [result, setResult]     = useState(null)   // { blob, url, size }
  const [quality, setQuality]   = useState(80)
  const [loading, setLoading]   = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (original) URL.revokeObjectURL(original.url)
    if (result)   URL.revokeObjectURL(result.url)
    setResult(null)
    setOriginal({ file, url: URL.createObjectURL(file), size: file.size })
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  async function handleCompress() {
    if (!original) return
    setLoading(true)
    const blob = await compressImage(original.file, quality)
    setResult({ blob, url: URL.createObjectURL(blob), size: blob.size })
    setLoading(false)
  }

  function handleDownload() {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    const ext = original.file.type === 'image/png' ? 'png' : 'jpg'
    a.download = `compressed.${ext}`
    a.click()
  }

  const savings = result ? Math.round((1 - result.size / original.size) * 100) : 0

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
        <p className="text-xs text-zinc-600">JPEG · PNG · WebP · GIF</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {original && (
        <>
          {/* Preview row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-2 text-xs text-zinc-500">Original — {formatBytes(original.size)}</p>
              <img src={original.url} alt="original" className="max-h-48 w-full rounded-lg object-contain" />
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
              <p className="mb-2 text-xs text-zinc-500">
                {result
                  ? `Compressed — ${formatBytes(result.size)} (${savings}% smaller)`
                  : 'Compressed — press Compress'}
              </p>
              {result
                ? <img src={result.url} alt="compressed" className="max-h-48 w-full rounded-lg object-contain" />
                : <div className="flex h-48 items-center justify-center rounded-lg bg-[#1a1a1a] text-xs text-zinc-600">Preview here</div>
              }
            </div>
          </div>

          {/* Quality slider */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm text-zinc-400">Quality</label>
              <span className="text-sm font-semibold text-white">{quality}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="mt-1 flex justify-between text-xs text-zinc-600">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCompress}
              disabled={loading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Compressing…' : 'Compress'}
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
