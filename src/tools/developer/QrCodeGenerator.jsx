import { useState, useEffect, useRef, useCallback } from 'react'
import { Download, AlertTriangle } from 'lucide-react'

const inputCls =
  'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] transition-colors'

const SIZES = [128, 256, 512]
const EC_LEVELS = ['L', 'M', 'Q', 'H']

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://quickkit.in')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [ecLevel, setEcLevel] = useState('M')
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  const canvasRef = useRef(null)

  const renderQR = useCallback(async () => {
    if (!canvasRef.current) return
    const val = text.trim()
    if (!val) {
      setReady(false)
      setError(null)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      return
    }
    try {
      const QRCode = (await import('qrcode')).default
      await QRCode.toCanvas(canvasRef.current, val, {
        width: size,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
        margin: 2,
      })
      setReady(true)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to generate QR code.')
      setReady(false)
    }
  }, [text, size, fgColor, bgColor, ecLevel])

  useEffect(() => {
    renderQR()
  }, [renderQR])

  function handleDownload() {
    if (!canvasRef.current || !ready) return
    const url = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }

  const charCount = text.length
  const overLimit = charCount > 2000

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* ── LEFT: Controls ── */}
      <div className="flex flex-col gap-5">

        {/* Text input */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-semibold text-[var(--ink)]">Text / URL</label>
            <span className={`text-xs ${overLimit ? 'text-red-700' : 'text-[var(--ink-muted)]'}`}>
              {charCount} / 2000
            </span>
          </div>
          <textarea
            className={`${inputCls} resize-none mt-1`}
            rows={4}
            placeholder="https://example.com or any text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {overLimit && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-700">
              <AlertTriangle size={12} />
              Over 2000 characters — QR code may not scan reliably.
            </div>
          )}
        </section>

        {/* Size */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
          <label className="mb-3 block text-sm font-semibold text-[var(--ink)]">Size</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  size === s
                    ? 'border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:text-[var(--ink)]'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
          <label className="mb-3 block text-sm font-semibold text-[var(--ink)]">Colors</label>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs text-[var(--ink-body)]">Foreground</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] p-1"
                />
                <input
                  type="text"
                  className={inputCls}
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs text-[var(--ink-body)]">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-lg border border-[var(--line)] bg-[var(--surface-tint)] p-1"
                />
                <input
                  type="text"
                  className={inputCls}
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Error correction */}
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-5">
          <label className="mb-3 block text-sm font-semibold text-[var(--ink)]">Error Correction</label>
          <div className="flex gap-2">
            {EC_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setEcLevel(level)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  ecLevel === level
                    ? 'border-[color-mix(in_srgb,var(--accent)_50%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--surface-tint)] text-[var(--ink-body)] hover:text-[var(--ink)]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--ink-muted)]">
            L = 7% recovery · M = 15% · Q = 25% · H = 30% — Higher = more data, larger QR.
          </p>
        </section>
      </div>

      {/* ── RIGHT: Preview & Download ── */}
      <div className="flex flex-col items-center gap-5">
        <div className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-6 flex flex-col items-center gap-5">
          <p className="self-start text-sm font-semibold text-[var(--ink)]">Preview</p>

          <div
            className="flex items-center justify-center rounded-xl border border-[var(--line)] p-4"
            style={{ background: bgColor || '#ffffff' }}
          >
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              style={{ imageRendering: 'pixelated', maxWidth: '100%' }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-600 px-3 py-2 text-xs text-red-700">
              <AlertTriangle size={12} />
              {error}
            </div>
          )}

          {!text.trim() && (
            <p className="text-xs text-[var(--ink-muted)]">Enter text or a URL to generate your QR code.</p>
          )}

          <button
            onClick={handleDownload}
            disabled={!ready}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} />
            Download PNG
          </button>
        </div>

        <div className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-alt)] p-4">
          <p className="mb-2 text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider">Tips</p>
          <ul className="flex flex-col gap-1.5 text-xs text-[var(--ink-muted)]">
            <li>• Use Error Correction H for QR codes printed on uneven surfaces.</li>
            <li>• High contrast foreground/background gives better scannability.</li>
            <li>• URLs should start with https:// for immediate redirect on scan.</li>
            <li>• Keep text under 500 characters for smallest, most scannable QR.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
