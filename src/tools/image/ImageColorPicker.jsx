import { useState, useRef, useCallback } from 'react'

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

export default function ImageColorPicker() {
  const [imageUrl, setImageUrl] = useState(null)
  const [color, setColor] = useState(null)   // { hex, rgb, hsl, x, y }
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(null)
  const canvasRef = useRef(null)
  const inputRef  = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setColor(null)
    setHistory([])
    const url = URL.createObjectURL(file)
    setImageUrl(url)
    // Draw on canvas after image loads
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
    }
    img.src = url
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const pickColor = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top)  * scaleY)
    const [r, g, b] = canvas.getContext('2d').getImageData(x, y, 1, 1).data
    const hex = rgbToHex(r, g, b)
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hsl = rgbToHsl(r, g, b)
    const picked = { hex, rgb, hsl, r, g, b }
    setColor(picked)
    setHistory((prev) => [picked, ...prev].slice(0, 12))
  }, [])

  async function handleCopy(text) {
    await navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      {!imageUrl && (
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#2a2a2a] bg-[#141414] py-12 transition-colors hover:border-violet-500/40"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-zinc-400">Drop an image here or <span className="text-violet-400">browse</span></p>
          <p className="text-xs text-zinc-600">JPEG · PNG · WebP · GIF</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      )}

      {imageUrl && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">Click anywhere on the image to pick a color</p>
            <button
              onClick={() => { setImageUrl(null); setColor(null); setHistory([]) }}
              className="text-xs text-zinc-500 underline hover:text-zinc-300"
            >
              Change image
            </button>
          </div>

          {/* Canvas */}
          <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
            <canvas
              ref={canvasRef}
              onClick={pickColor}
              className="w-full cursor-crosshair"
              style={{ display: 'block', maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>

          {/* Current color */}
          {color && (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 flex-shrink-0 rounded-xl border border-[#2a2a2a]"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex flex-1 flex-col gap-2">
                  {[
                    { label: 'HEX', value: color.hex },
                    { label: 'RGB', value: color.rgb },
                    { label: 'HSL', value: color.hsl },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-xs text-zinc-600">{label}</span>
                        <span className="font-mono text-sm text-zinc-300">{value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(value)}
                        className="text-xs text-zinc-500 transition-colors hover:text-violet-400"
                      >
                        {copied === value ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-zinc-500">Picked colors</p>
              <div className="flex flex-wrap gap-2">
                {history.map((c, i) => (
                  <button
                    key={i}
                    title={c.hex}
                    onClick={() => handleCopy(c.hex)}
                    className="h-8 w-8 rounded-lg border border-[#2a2a2a] transition-transform hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
