import { useState } from 'react'

// ── JWT helpers ───────────────────────────────────────────────────────────────

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded  = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  try {
    return decodeURIComponent(
      atob(padded).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
  } catch {
    return atob(padded)
  }
}

function decodeJWT(token) {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT — must have exactly 3 parts separated by "."')
  const headerRaw  = base64UrlDecode(parts[0])
  const payloadRaw = base64UrlDecode(parts[1])
  if (!headerRaw || !payloadRaw) throw new Error('Failed to decode — invalid base64url encoding')
  try {
    return { header: JSON.parse(headerRaw), payload: JSON.parse(payloadRaw), signature: parts[2] }
  } catch {
    throw new Error('Could not parse JSON inside header or payload')
  }
}

function fmtUnix(ts) {
  return new Date(ts * 1000).toLocaleString()
}

// ── Sub-components ────────────────────────────────────────────────────────────

function JsonPanel({ title, data, extra }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(data, null, 2)

  async function copy() {
    try { await navigator.clipboard.writeText(json) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">{title}</span>
        <div className="flex items-center gap-2">
          {extra}
          <button onClick={copy} className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-auto rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <pre className="whitespace-pre font-mono text-sm text-zinc-200">{json}</pre>
      </div>
    </div>
  )
}

export default function JwtDecoder() {
  const [input, setInput]   = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error, setError]   = useState('')

  function handleChange(value) {
    setInput(value)
    const trimmed = value.trim()
    if (!trimmed) { setDecoded(null); setError(''); return }
    try   { setDecoded(decodeJWT(trimmed)); setError('') }
    catch (e) { setDecoded(null); setError(e.message) }
  }

  const alg       = decoded?.header?.alg
  const exp       = decoded?.payload?.exp
  // eslint-disable-next-line react-hooks/purity
  const isExpired = exp && exp < Math.floor(Date.now() / 1000)

  const stdClaims = [
    { key: 'iss', label: 'Issuer',     fmt: (v) => v },
    { key: 'sub', label: 'Subject',    fmt: (v) => v },
    { key: 'aud', label: 'Audience',   fmt: (v) => Array.isArray(v) ? v.join(', ') : v },
    { key: 'iat', label: 'Issued At',  fmt: (v) => `${fmtUnix(v)}  (${v})` },
    { key: 'exp', label: 'Expires',    fmt: (v) => `${fmtUnix(v)}  (${v})` },
    { key: 'nbf', label: 'Not Before', fmt: (v) => `${fmtUnix(v)}  (${v})` },
  ].filter(({ key }) => decoded?.payload?.[key] !== undefined)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Input ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-medium uppercase tracking-widest text-zinc-500">JWT Token</label>
          {decoded && (
            <div className="flex flex-wrap items-center gap-2">
              {alg && (
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 font-mono text-xs font-medium text-zinc-300">
                  {alg}
                </span>
              )}
              {exp && (
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isExpired ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {isExpired ? `Expired · ${fmtUnix(exp)}` : `Valid · expires ${fmtUnix(exp)}`}
                </span>
              )}
            </div>
          )}
        </div>

        <textarea
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          placeholder="Paste your JWT here — decoded automatically as you type…&#10;&#10;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"
          className="h-28 w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
        />

        {error && (
          <p className="flex items-center gap-2 font-mono text-sm text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />{error}
          </p>
        )}
      </div>

      {/* ── Decoded output ───────────────────────────────────────────────────── */}
      {decoded ? (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <JsonPanel title="Header"  data={decoded.header} />
            <JsonPanel title="Payload" data={decoded.payload} />
          </div>

          {/* Signature */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Signature</span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-500">
                Not verified — requires secret
              </span>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-4">
              <p className="break-all font-mono text-sm text-zinc-500">{decoded.signature}</p>
            </div>
          </div>

          {/* Standard claims */}
          {stdClaims.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Standard Claims</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {stdClaims.map(({ key, label, fmt }) => (
                  <div key={key} className="flex items-start gap-3 rounded-lg border border-[#2a2a2a] bg-[#141414] px-4 py-3">
                    <span className="w-20 shrink-0 text-xs text-zinc-500">{label}</span>
                    <span className="truncate font-mono text-xs text-zinc-300">{fmt(decoded.payload[key])}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : !error && (
        <div className="rounded-xl border border-dashed border-[#2a2a2a] py-14 text-center">
          <p className="text-sm text-zinc-600">Paste a JWT token above to see it decoded</p>
        </div>
      )}

    </div>
  )
}
