import { useState, useRef, useEffect } from 'react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export default function ImageResizer() {
  const [original, setOriginal] = useState(null)  // { file, url, w, h }
  const [result, setResult]     = useState(null)  // { blob, url }
  const [width, setWidth]       = useState('')
  const [height, setHeight]     = useState('')
  const [lockAspect, setLockAspect] = useState(true)
  const [loading, setLoading]   = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (original) URL.revokeObjectURL(original.url)
    if (result)   URL.revokeObjectURL(result.url)
    setResult(null)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginal({ file, url, w: img.naturalWidth, h: img.naturalHeight })
      setWidth(String(img.naturalWidth))
      setHeight(String(img.naturalHeight))
    }
    img.src = url
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  function handleWidthChange(val) {
    setWidth(val)
    if (lockAspect && original && val !== '') {
      const ratio = original.h / original.w
      setHeight(String(Math.round(Number(val) * ratio)))
    }
  }

  function handleHeightChange(val) {
    setHeight(val)
    if (lockAspect && original && val !== '') {
      const ratio = original.w / original.h
      setWidth(String(Math.round(Number(val) * ratio)))
    }
  }

  async function handleResize() {
    if (!original || !width || !height) return
    setLoading(true)
    const w = Math.max(1, parseInt(width, 10))
    const h = Math.max(1, parseInt(height, 10))
    const img = new Image()
    img.src = original.url
    await new Promise((r) => { img.onload = r })
    const canvas = document.createElement('canvas')
    canvas.width  = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    const mimeType = original.file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    canvas.toBlob((blob) => {
      if (result) URL.revokeObjectURL(result.url)
      setResult({ blob, url: URL.createObjectURL(blob), w, h, size: blob.size })
      setLoading(false)
    }, mimeType, 0.92)
  }

  function handleDownload() {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    const ext = original.file.type === 'image/png' ? 'png' : 'jpg'
    a.download = `resized-${result.w}x${result.h}.${ext}`
    a.click()
  }

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
          {/* Dimension inputs */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
            <p className="mb-4 text-xs text-zinc-500">
              Original: {original.w} × {original.h} px — {formatBytes(original.file.size)}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-zinc-500">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  min={1}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>
              <button
                onClick={() => setLockAspect(!lockAspect)}
                title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                className={`mt-5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                  lockAspect
                    ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                    : 'border-[#2a2a2a] bg-[#1a1a1a] text-zinc-500 hover:border-[#3a3a3a]'
                }`}
              >
                {lockAspect ? '🔒' : '🔓'}
              </button>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-zinc-500">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  min={1}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
          </div>

          {/* Preview row */}
          {result && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <p className="mb-2 text-xs text-zinc-500">Original — {original.w}×{original.h}</p>
                <img src={original.url} alt="original" className="max-h-48 w-full rounded-lg object-contain" />
              </div>
              <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
                <p className="mb-2 text-xs text-zinc-500">Resized — {result.w}×{result.h} — {formatBytes(result.size)}</p>
                <img src={result.url} alt="resized" className="max-h-48 w-full rounded-lg object-contain" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleResize}
              disabled={loading || !width || !height}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? 'Resizing…' : 'Resize'}
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
