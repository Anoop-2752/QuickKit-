import { useState, useMemo } from 'react'

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

function getWorkingDays(start, end) {
  let count = 0
  const cur = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

export default function NoticePeriodCalculator() {
  const [resignDate, setResignDate]     = useState('')
  const [noticeUnit, setNoticeUnit]     = useState('months')
  const [noticeValue, setNoticeValue]   = useState('')
  const [skipWeekends, setSkipWeekends] = useState(false)

  const result = useMemo(() => {
    if (!resignDate || !noticeValue || Number(noticeValue) <= 0) return null
    const start = new Date(resignDate)
    let lastDay

    if (skipWeekends) {
      // Add working days only
      let workDaysLeft = noticeUnit === 'days'
        ? Number(noticeValue)
        : noticeUnit === 'weeks'
        ? Number(noticeValue) * 5
        : Number(noticeValue) * 22 // approx working days per month
      const cur = new Date(start)
      cur.setDate(cur.getDate() + 1) // start counting from next day
      while (workDaysLeft > 0) {
        const day = cur.getDay()
        if (day !== 0 && day !== 6) workDaysLeft--
        if (workDaysLeft > 0) cur.setDate(cur.getDate() + 1)
      }
      lastDay = cur
    } else {
      if (noticeUnit === 'days')   lastDay = addDays(start, Number(noticeValue))
      if (noticeUnit === 'weeks')  lastDay = addDays(start, Number(noticeValue) * 7)
      if (noticeUnit === 'months') lastDay = addMonths(start, Number(noticeValue))
    }

    const totalDays   = daysBetween(start, lastDay)
    const workingDays = getWorkingDays(start, lastDay)

    return { lastDay, totalDays, workingDays }
  }, [resignDate, noticeUnit, noticeValue, skipWeekends])

  const dayOfWeek = result ? result.lastDay.toLocaleDateString('en-GB', { weekday: 'long' }) : ''
  const isWeekend = result ? [0, 6].includes(result.lastDay.getDay()) : false

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-zinc-600">
        Enter your resignation date and notice period to calculate your last working day.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Resignation date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500">Resignation / Notice Start Date</label>
          <input
            type="date"
            value={resignDate}
            onChange={(e) => setResignDate(e.target.value)}
            className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-2.5 text-sm text-zinc-200 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
          />
        </div>

        {/* Notice period */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500">Notice Period</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={noticeValue}
              onChange={(e) => setNoticeValue(e.target.value)}
              placeholder="e.g. 1"
              className="w-24 rounded-xl border border-[#2a2a2a] bg-[#141414] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
            />
            <select
              value={noticeUnit}
              onChange={(e) => setNoticeUnit(e.target.value)}
              className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#141414] px-3 py-2.5 text-sm text-zinc-200 focus:border-rose-500/50 focus:outline-none"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skip weekends toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={skipWeekends}
            onChange={(e) => setSkipWeekends(e.target.checked)}
            className="sr-only"
          />
          <div className={`h-5 w-9 rounded-full transition-colors ${skipWeekends ? 'bg-rose-500' : 'bg-[#2a2a2a]'}`} />
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${skipWeekends ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm text-zinc-400">Count working days only (exclude weekends)</span>
      </label>

      {/* Result */}
      {result && (
        <div className="flex flex-col gap-4">
          <div className={`rounded-xl border p-6 text-center ${isWeekend ? 'border-amber-500/30 bg-amber-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
            <p className="text-xs text-zinc-600 mb-2">Your last working day</p>
            <p className="text-3xl font-bold text-white">{formatDate(result.lastDay)}</p>
            <p className={`mt-1 text-sm font-medium ${isWeekend ? 'text-amber-400' : 'text-rose-400'}`}>
              {dayOfWeek}{isWeekend && ' — falls on a weekend, check with HR'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Calendar Days', value: result.totalDays },
              { label: 'Working Days', value: result.workingDays },
              { label: 'Weekends', value: result.totalDays - result.workingDays },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-3 text-center">
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-700">
            Note: This does not account for public holidays. Confirm your exact last day with your HR department.
          </p>
        </div>
      )}
    </div>
  )
}
