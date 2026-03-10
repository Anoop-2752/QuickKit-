import { useState, useEffect } from 'react'

const STORAGE_KEY = 'quickkit_job_tracker'

const STATUSES = [
  { value: 'applied',    label: 'Applied',    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { value: 'interview',  label: 'Interview',  color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { value: 'offer',      label: 'Offer',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { value: 'rejected',   label: 'Rejected',   color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
  { value: 'ghosted',    label: 'Ghosted',    color: 'text-zinc-500',    bg: 'bg-zinc-500/10',    border: 'border-zinc-500/20' },
  { value: 'withdrawn',  label: 'Withdrawn',  color: 'text-zinc-600',    bg: 'bg-zinc-800/50',    border: 'border-zinc-700/30' },
]

function getStatusStyle(value) {
  return STATUSES.find((s) => s.value === value) || STATUSES[0]
}

function newJob(overrides = {}) {
  return {
    id: Date.now().toString(),
    company: '',
    role: '',
    url: '',
    status: 'applied',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ...overrides,
  }
}

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export default function JobApplicationTracker() {
  const [jobs, setJobs]         = useState(loadJobs)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [form, setForm]         = useState(newJob())
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => { saveJobs(jobs) }, [jobs])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return

    if (editId) {
      setJobs((prev) => prev.map((j) => j.id === editId ? { ...form, id: editId } : j))
      setEditId(null)
    } else {
      setJobs((prev) => [{ ...form, id: Date.now().toString() }, ...prev])
    }
    setForm(newJob())
    setShowForm(false)
  }

  function handleEdit(job) {
    setForm({ ...job })
    setEditId(job.id)
    setShowForm(true)
    setExpandedId(null)
  }

  function handleDelete(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function handleStatusChange(id, status) {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, status } : j))
  }

  function handleCancel() {
    setShowForm(false)
    setEditId(null)
    setForm(newJob())
  }

  const filtered = filterStatus === 'all'
    ? jobs
    : jobs.filter((j) => j.status === filterStatus)

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.value] = jobs.filter((j) => j.status === s.value).length
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(filterStatus === s.value ? 'all' : s.value)}
              className={`rounded-lg border p-2.5 text-center transition-all ${
                filterStatus === s.value ? `${s.border} ${s.bg}` : 'border-[#2a2a2a] bg-[#141414] hover:border-[#3a3a3a]'
              }`}
            >
              <div className={`text-xl font-bold ${s.color}`}>{counts[s.value] || 0}</div>
              <div className="text-xs text-zinc-600">{s.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(newJob()) }}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#2a2a2a] py-3 text-sm text-zinc-600 transition-all hover:border-indigo-500/40 hover:text-indigo-400"
        >
          <span className="text-lg leading-none">+</span> Add Application
        </button>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-indigo-500/30 bg-[#141414] p-5 flex flex-col gap-4"
        >
          <h3 className="text-sm font-semibold text-white">
            {editId ? 'Edit Application' : 'New Application'}
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Company *</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="e.g. Google"
                required
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Role *</label>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Frontend Engineer"
                required
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500/50 focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Date Applied</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-zinc-500">Job URL</label>
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://…"
                className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-zinc-500">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Interview notes, contacts, follow-up reminders…"
                rows={2}
                className="resize-none rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-indigo-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              {editId ? 'Save Changes' : 'Add Application'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Job list */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filterStatus !== 'all' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600">
                Showing {filtered.length} {filterStatus} application{filtered.length !== 1 ? 's' : ''}
              </span>
              <button onClick={() => setFilterStatus('all')} className="text-xs text-indigo-400 hover:text-indigo-300">
                Show all
              </button>
            </div>
          )}
          {filtered.map((job) => {
            const style    = getStatusStyle(job.status)
            const isExpanded = expandedId === job.id
            return (
              <div key={job.id} className="rounded-xl border border-[#2a2a2a] bg-[#141414] overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : job.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{job.company}</span>
                      <span className="text-zinc-600 text-xs">—</span>
                      <span className="text-sm text-zinc-400 truncate">{job.role}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-zinc-700">{job.date}</div>
                  </div>

                  <select
                    value={job.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none ${style.border} ${style.bg} ${style.color} bg-transparent`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value} className="bg-[#1a1a1a] text-zinc-200">
                        {s.label}
                      </option>
                    ))}
                  </select>

                  <span className="text-zinc-700 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </div>

                {isExpanded && (
                  <div className="border-t border-[#1e1e1e] px-4 py-3 flex flex-col gap-3">
                    {job.notes && (
                      <p className="text-xs text-zinc-500 whitespace-pre-wrap">{job.notes}</p>
                    )}
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 underline hover:text-indigo-300 break-all"
                      >
                        {job.url}
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-red-900/60 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : jobs.length > 0 ? (
        <div className="rounded-xl border border-dashed border-[#2a2a2a] py-10 text-center">
          <p className="text-sm text-zinc-600">No {filterStatus} applications.</p>
          <button onClick={() => setFilterStatus('all')} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300">
            Show all
          </button>
        </div>
      ) : !showForm ? (
        <div className="rounded-xl border border-dashed border-[#2a2a2a] py-14 text-center">
          <p className="text-sm font-medium text-zinc-500">No applications yet</p>
          <p className="mt-1 text-xs text-zinc-700">
            Add your first application above. Everything is saved in your browser.
          </p>
        </div>
      ) : null}

      {jobs.length > 0 && (
        <p className="text-xs text-zinc-700">
          All data is stored locally in your browser. Nothing is sent to any server.
        </p>
      )}
    </div>
  )
}
