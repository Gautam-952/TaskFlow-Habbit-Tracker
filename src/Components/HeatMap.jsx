// Components/HeatMap.jsx
import React, { useMemo } from 'react'

const pad2 = (n) => String(n).padStart(2, '0')
const toLocalYYYYMMDD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

const normalizeDateToDay = (val) => {
  if (!val) return null
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val
  if (typeof val === 'string') {
    const d = new Date(val)
    if (!Number.isNaN(d.getTime())) return toLocalYYYYMMDD(d)
    return null
  }
  if (val?.seconds) return toLocalYYYYMMDD(new Date(val.seconds * 1000))
  if (val instanceof Date) return toLocalYYYYMMDD(val)
  if (typeof val === 'number') {
    const ms = val < 1e12 ? val * 1000 : val
    const d = new Date(ms)
    if (!Number.isNaN(d.getTime())) return toLocalYYYYMMDD(d)
  }
  return null
}

function HeatMap({ tasks = [], project = [], habit = [], days = 365, compact = false }) {

    const safeTasks = Array.isArray(tasks) ? tasks : []
const safeProject = Array.isArray(project) ? project : []
const safeHabit = Array.isArray(habit) ? habit : []
  const HEAT_CELL = compact ? 9 : 15
const HEAT_GAP = compact ? 2 : 3
  const HEAT_STEP = HEAT_CELL + HEAT_GAP
  const HEAT_ROWS = 7
  const HEAT_DAYS = days

  const activityByDate = useMemo(() => {
    const map = Object.create(null)
    const add = (dayStr, amount = 1) => {
      if (!dayStr) return
      map[dayStr] = (map[dayStr] || 0) + amount
    }

    habit.forEach((h) => {
      add(normalizeDateToDay(h.createdAt))
      if (h.history && typeof h.history === 'object') {
        Object.entries(h.history).forEach(([dateStr, entry]) => {
          if (entry?.completed) add(normalizeDateToDay(dateStr))
        })
      }
    })

    tasks.forEach((t) => {
      add(normalizeDateToDay(t.id))
      if (t.completed) {
        const doneDay = normalizeDateToDay(t.completedAt) || normalizeDateToDay(t.id)
        add(doneDay)
      }
    })

    project.forEach((p) => {
      add(normalizeDateToDay(p.id))
    })

    return map
  }, [tasks, habit, project])

  const heatmap = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(today)
    start.setDate(today.getDate() - (HEAT_DAYS - 1))

    const startRow = (start.getDay() + 6) % 7
    const leadingBlanks = startRow

    const totalFilled = leadingBlanks + HEAT_DAYS
    const cols = Math.ceil(totalFilled / 7)
    const totalCells = cols * 7

    const cells = []
    for (let idx = 0; idx < totalCells; idx++) {
      const row = idx % 7
      const col = Math.floor(idx / 7)
      const dayIndex = idx - leadingBlanks

      if (dayIndex < 0 || dayIndex >= HEAT_DAYS) {
        cells.push({ blank: true, row, col })
        continue
      }

      const d = new Date(start)
      d.setDate(start.getDate() + dayIndex)
      const dateStr = toLocalYYYYMMDD(d)
      const total = activityByDate[dateStr] || 0

      let color = '#E8EDE2'
      if (total === 1) color = '#B6CCA1'
      else if (total === 2) color = '#7DA863'
      else if (total >= 3) color = '#4A6B38'

      cells.push({ blank: false, row, col, dateStr, total, color, isToday: dayIndex === HEAT_DAYS - 1 })
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthLabels = []
    const seen = new Set()
    for (let c = 0; c < cols; c++) {
      let cell = null
      for (let r = 0; r < 7; r++) {
        const found = cells.find((x) => !x.blank && x.col === c && x.row === r)
        if (found) { cell = found; break }
      }
      if (!cell) continue
      const dt = new Date(cell.dateStr + 'T00:00:00')
      const key = `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}`
      if (!seen.has(key)) {
        seen.add(key)
        monthLabels.push({ col: c, label: monthNames[dt.getMonth()] })
      }
    }

    const contributionsInRange = cells.reduce((s, c) => s + (c.total || 0), 0)
    return { cells, cols, monthLabels, contributionsInRange }
  }, [activityByDate, HEAT_DAYS])

  const SVG_LEFT_PAD = compact ? 0 : 28
  const SVG_TOP_PAD = compact ? 4 : 18
  const SVG_RIGHT_PAD = 6
  const SVG_BOT_PAD = 6

  const HEAT_W = SVG_LEFT_PAD + heatmap.cols * HEAT_STEP + SVG_RIGHT_PAD
  const HEAT_H = SVG_TOP_PAD + HEAT_ROWS * HEAT_STEP + SVG_BOT_PAD

  const weekdayLabels = [
    { row: 0, label: 'Mon' },
    { row: 2, label: 'Wed' },
    { row: 4, label: 'Fri' },
  ]

  return (
    <div className="w-full bg-white">
      {!compact && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-[#143022]">{HEAT_DAYS}-Day Combined Activity</h2>
            <span className="text-gray-400 text-xs">ⓘ</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            {heatmap.contributionsInRange} Contributions
          </span>
        </div>
      )}

      <svg viewBox={`0 0 ${HEAT_W} ${HEAT_H}`} width="100%" preserveAspectRatio="xMinYMin meet" style={{ display: 'block' }}>
        {!compact && heatmap.monthLabels.map(({ col, label }) => (
          <text key={`${label}-${col}`} x={SVG_LEFT_PAD + col * HEAT_STEP + HEAT_CELL / 2} y={SVG_TOP_PAD - 5}
            fontSize="8" fontWeight="600" fill="#70766B" textAnchor="middle">{label}</text>
        ))}

        {!compact && weekdayLabels.map(({ row, label }) => (
          <text key={label} x={SVG_LEFT_PAD - 4} y={SVG_TOP_PAD + row * HEAT_STEP + HEAT_CELL / 2 + 3}
            fontSize="8" fontWeight="600" fill="#70766B" textAnchor="end">{label}</text>
        ))}

        {heatmap.cells.map((cell, idx) => {
          if (cell.blank) return null
          const x = SVG_LEFT_PAD + cell.col * HEAT_STEP
          const y = SVG_TOP_PAD + cell.row * HEAT_STEP
          return (
            <rect key={idx} x={x} y={y} width={HEAT_CELL} height={HEAT_CELL} rx="2" ry="2" fill={cell.color}>
              <title>{cell.dateStr}: {cell.total} contribution{cell.total !== 1 ? 's' : ''}</title>
            </rect>
          )
        })}

        {(() => {
          const tc = heatmap.cells.find((c) => c.isToday)
          if (!tc) return null
          return (
            <rect
              x={SVG_LEFT_PAD + tc.col * HEAT_STEP - 1}
              y={SVG_TOP_PAD + tc.row * HEAT_STEP - 1}
              width={HEAT_CELL + 2} height={HEAT_CELL + 2} rx="3" ry="3"
              fill="none" stroke="#143022" strokeWidth="1.5"
            />
          )
        })()}
      </svg>

{!compact && (
  <div className="flex items-center justify-start gap-1.5 text-[9px] text-[#70766B] font-medium pt-2 border-t border-[#F2ECE1] mt-2">
  <span>Less</span>
  <div className="w-3 h-3 rounded-xs bg-[#E8EDE2]" />
  <div className="w-3 h-3 rounded-xs bg-[#B6CCA1]" />
  <div className="w-3 h-3 rounded-xs bg-[#7DA863]" />
  <div className="w-3 h-3 rounded-xs bg-[#4A6B38]" />
  <span>More</span>
</div>
)}
    </div>
  )
}

export default HeatMap;