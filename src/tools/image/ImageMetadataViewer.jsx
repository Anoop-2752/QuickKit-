import { useState, useRef } from 'react'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }

function getAspectRatio(w, h) {
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString()
}

// Read JPEG APP1 / EXIF marker without external library
// Returns a map of basic EXIF tags if found, or null
function readExifBasic(buffer) {
  const view = new DataView(buffer)
  // JPEG starts with FFD8
  if (view.getUint16(0) !== 0xFFD8) return null
  let offset = 2
  while (offset < view.byteLength - 2) {
    const marker = view.getUint16(offset)
    if (marker === 0xFFE1) {
      // APP1 marker — check for Exif header
      const len = view.getUint16(offset + 2)
      const exifHeader = String.fromCharCode(
        view.getUint8(offset + 4),
        view.getUint8(offset + 5),
        view.getUint8(offset + 6),
        view.getUint8(offset + 7),
      )
      if (exifHeader === 'Exif') return { hasExif: true, offset: offset + 10, len }
      return null
    }
    if ((marker & 0xFF00) !== 0xFF00) break
    offset += 2 + view.getUint16(offset + 2)
  }
  return null
}

function parseTiffTags(buffer, ifdOffset, littleEndian) {
  const view = new DataView(buffer)
  const tags = {}
  const TAG_MAP = {
    0x010F: 'Make',
    0x0110: 'Model',
    0x0112: 'Orientation',
    0x011A: 'XResolution',
    0x011B: 'YResolution',
    0x0128: 'ResolutionUnit',
    0x0131: 'Software',
    0x0132: 'DateTime',
    0x8769: 'ExifIFD',
    0x8825: 'GPSIFD',
    0xA002: 'PixelXDimension',
    0xA003: 'PixelYDimension',
    0x9003: 'DateTimeOriginal',
    0x9004: 'DateTimeDigitized',
    0x920A: 'FocalLength',
    0x829A: 'ExposureTime',
    0x829D: 'FNumber',
    0x8827: 'ISOSpeedRatings',
  }
  try {
    const count = view.getUint16(ifdOffset, littleEndian)
    for (let i = 0; i < count; i++) {
      const entryOffset = ifdOffset + 2 + i * 12
      const tag  = view.getUint16(entryOffset,     littleEndian)
      const type = view.getUint16(entryOffset + 2, littleEndian)
      const num  = view.getUint32(entryOffset + 4, littleEndian)
      const name = TAG_MAP[tag]
      if (!name) continue
      // Type 2 = ASCII string
      if (type === 2) {
        const strOffset = num > 4 ? view.getUint32(entryOffset + 8, littleEndian) : entryOffset + 8
        let str = ''
        for (let j = 0; j < num - 1; j++) {
          const c = view.getUint8(strOffset + j)
          if (c === 0) break
          str += String.fromCharCode(c)
        }
        tags[name] = str.trim()
      }
      // Type 3 = SHORT
      else if (type === 3) {
        tags[name] = view.getUint16(entryOffset + 8, littleEndian)
      }
      // Type 4 = LONG
      else if (type === 4) {
        tags[name] = view.getUint32(entryOffset + 8, littleEndian)
      }
      // Type 5 = RATIONAL (two LONGs: numerator / denominator)
      else if (type === 5) {
        const ratOffset = view.getUint32(entryOffset + 8, littleEndian)
        const num2 = view.getUint32(ratOffset,     littleEndian)
        const den  = view.getUint32(ratOffset + 4, littleEndian)
        tags[name] = den !== 0 ? (num2 / den).toFixed(2) : num2
      }
    }

    // Parse nested ExifIFD
    if (tags.ExifIFD) {
      const nested = parseTiffTags(buffer, tags.ExifIFD, littleEndian)
      Object.assign(tags, nested)
      delete tags.ExifIFD
    }
  } catch (_) { /* ignore malformed EXIF */ }
  return tags
}

function extractExif(buffer, exifInfo) {
  if (!exifInfo?.hasExif) return null
  try {
    const tiffStart = exifInfo.offset
    const view = new DataView(buffer)
    const byteOrder = view.getUint16(tiffStart)
    const littleEndian = byteOrder === 0x4949
    const ifdOffset = tiffStart + view.getUint32(tiffStart + 4, littleEndian)
    return parseTiffTags(buffer, ifdOffset, littleEndian)
  } catch (_) {
    return null
  }
}

const ORIENTATION_LABELS = {
  1: 'Normal',
  2: 'Mirrored horizontal',
  3: 'Rotated 180°',
  4: 'Mirrored vertical',
  5: 'Mirrored horizontal + rotated 90° CCW',
  6: 'Rotated 90° CW',
  7: 'Mirrored horizontal + rotated 90° CW',
  8: 'Rotated 90° CCW',
}

function MetaRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="flex-shrink-0 text-xs text-zinc-500">{label}</span>
      <span className="text-right font-mono text-xs text-zinc-300">{value}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">{title}</p>
      <div className="divide-y divide-[#1e1e1e]">{children}</div>
    </div>
  )
}

export default function ImageMetadataViewer() {
  const [meta, setMeta]   = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (preview) URL.revokeObjectURL(preview)

    const url = URL.createObjectURL(file)
    setPreview(url)

    const img = new Image()
    img.onload = () => {
      const base = {
        name: file.name,
        size: formatBytes(file.size),
        sizeBytes: file.size,
        type: file.type,
        lastModified: formatDate(file.lastModified),
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: getAspectRatio(img.naturalWidth, img.naturalHeight),
        megapixels: ((img.naturalWidth * img.naturalHeight) / 1_000_000).toFixed(2) + ' MP',
      }

      // Try to extract EXIF for JPEG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const reader = new FileReader()
        reader.onload = (e) => {
          const buffer  = e.target.result
          const exifInfo = readExifBasic(buffer)
          const exif    = extractExif(buffer, exifInfo)
          setMeta({ ...base, exif })
        }
        reader.readAsArrayBuffer(file)
      } else {
        setMeta({ ...base, exif: null })
      }
    }
    img.src = url
  }

  function handleDrop(e) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
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
        <p className="text-xs text-zinc-600">JPEG · PNG · WebP · GIF · BMP</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      </div>

      {meta && (
        <>
          {/* Preview */}
          <div className="flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#141414] p-4">
            <img src={preview} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-medium text-white">{meta.name}</p>
              <p className="text-xs text-zinc-500">{meta.type}</p>
            </div>
          </div>

          {/* File info */}
          <Section title="File">
            <MetaRow label="File name"     value={meta.name} />
            <MetaRow label="File size"     value={meta.size} />
            <MetaRow label="Format"        value={meta.type} />
            <MetaRow label="Last modified" value={meta.lastModified} />
          </Section>

          {/* Image dimensions */}
          <Section title="Dimensions">
            <MetaRow label="Width"        value={`${meta.width} px`} />
            <MetaRow label="Height"       value={`${meta.height} px`} />
            <MetaRow label="Aspect ratio" value={meta.aspectRatio} />
            <MetaRow label="Megapixels"   value={meta.megapixels} />
          </Section>

          {/* EXIF */}
          {meta.exif && Object.keys(meta.exif).length > 0 ? (
            <Section title="EXIF / Camera">
              <MetaRow label="Camera make"    value={meta.exif.Make} />
              <MetaRow label="Camera model"   value={meta.exif.Model} />
              <MetaRow label="Software"       value={meta.exif.Software} />
              <MetaRow label="Date taken"     value={meta.exif.DateTimeOriginal ?? meta.exif.DateTime} />
              <MetaRow label="Exposure time"  value={meta.exif.ExposureTime ? `1/${Math.round(1 / meta.exif.ExposureTime)}s` : null} />
              <MetaRow label="F-number"       value={meta.exif.FNumber ? `f/${meta.exif.FNumber}` : null} />
              <MetaRow label="ISO"            value={meta.exif.ISOSpeedRatings} />
              <MetaRow label="Focal length"   value={meta.exif.FocalLength ? `${meta.exif.FocalLength} mm` : null} />
              <MetaRow label="Orientation"    value={ORIENTATION_LABELS[meta.exif.Orientation]} />
              <MetaRow label="X Resolution"   value={meta.exif.XResolution ? `${meta.exif.XResolution} dpi` : null} />
              <MetaRow label="Y Resolution"   value={meta.exif.YResolution ? `${meta.exif.YResolution} dpi` : null} />
            </Section>
          ) : meta.type === 'image/jpeg' || meta.type === 'image/jpg' ? (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5 text-center text-xs text-zinc-600">
              No EXIF data found in this JPEG
            </div>
          ) : (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5 text-center text-xs text-zinc-600">
              EXIF metadata is only available in JPEG files
            </div>
          )}
        </>
      )}
    </div>
  )
}
