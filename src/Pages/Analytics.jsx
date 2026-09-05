import React, { useMemo, useState } from 'react'
import { Sidebar , HeatMap } from '../Components'

function Analytics({ tasks = [], project = [], habit = [] }) {
  const [selectedRange] = useState('Last 365 Days')

  // =========================
  // Date helpers (LOCAL day)
  // =========================
  const pad2 = (n) => String(n).padStart(2, '0')
  const toLocalYYYYMMDD = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

  // Normalize many possible formats -> LOCAL YYYY-MM-DD
  const normalizeDateToDay = (val) => {
    if (!val) return null

    // already YYYY-MM-DD
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val

    // ISO string or any parsable date string
    if (typeof val === 'string') {
      const d = new Date(val)
      if (!Number.isNaN(d.getTime())) return toLocalYYYYMMDD(d)
      return null
    }

    // Firestore Timestamp-like { seconds, nanoseconds }
    if (val?.seconds) {
      const d = new Date(val.seconds * 1000)
      return toLocalYYYYMMDD(d)
    }

    // JS Date
    if (val instanceof Date) return toLocalYYYYMMDD(val)

    // numeric timestamp (seconds or ms) — this is what task.id / project.id are (Date.now())
    if (typeof val === 'number') {
      const ms = val < 1e12 ? val * 1000 : val
      const d = new Date(ms)
      if (!Number.isNaN(d.getTime())) return toLocalYYYYMMDD(d)
    }

    return null
  }

  // =========================================================
  // 1) Metrics (Tasks / Habits / Projects)
  // =========================================================
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const totalHabits = habit.length
  const totalProjects = project.length

  // Habit check-ins + 30-day completion rate
  const past30Days = useMemo(() => {
    const arr = []
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    for (let i = 0; i < 30; i++) {
      const x = new Date(d)
      x.setDate(d.getDate() - i)
      arr.push(toLocalYYYYMMDD(x))
    }
    return arr
  }, [])

  let totalHabitSlots = 0
  let completedHabitSlots = 0
  let totalHabitCheckIns = 0

  habit.forEach((h) => {
    // total check-ins — h.history is an object keyed by LOCAL date string: { "2026-08-30": { completed: true } }
    if (h.history && typeof h.history === 'object') {
      totalHabitCheckIns += Object.values(h.history).filter((entry) => entry?.completed).length
    }

    // 30-day slots
    past30Days.forEach((dateStr) => {
      const dayNum = new Date(dateStr + 'T00:00:00').getDay()
      if (h.activeDays?.includes(dayNum)) {
        totalHabitSlots++
        if (h.history?.[dateStr]?.completed) completedHabitSlots++
      }
    })
  })

  const habitCompletionRate = totalHabitSlots > 0 ? Math.round((completedHabitSlots / totalHabitSlots) * 100) : 0
  const longestStreak =
    habit.length > 0 ? Math.max(0, ...habit.map((h) => (h.bestStreak ?? h.currentStreak) || 0)) : 0

  const overallRate =
    totalTasks + totalHabitSlots > 0
      ? Math.round(((completedTasks + completedHabitSlots) / (totalTasks + totalHabitSlots)) * 100)
      : 0

  // =========================================================
  // 2) Project breakdown — real field names: t.project (string), p.projectName
  //    A project counts as "active" (not done) using computed rate, since
  //    p.status never actually holds "Completed"/"done" (only active/planning/none).
  // =========================================================
  const projectBreakdown = useMemo(() => {
    return project.map((p) => {
      const projTasks = tasks.filter((t) => t.project === p.projectName)
      const doneProjTasks = projTasks.filter((t) => t.completed).length
      const rate = projTasks.length > 0 ? Math.round((doneProjTasks / projTasks.length) * 100) : 0

      return {
        id: p.id,
        name: p.projectName || 'Untitled',
        rate,
        totalTasks: projTasks.length,
        doneTasks: doneProjTasks,
      }
    })
  }, [project, tasks])

  const activeProjects = projectBreakdown.filter((p) => p.rate < 100).length
  const completedProjectsCount = projectBreakdown.filter((p) => p.rate === 100).length
  const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjectsCount / totalProjects) * 100) : 0

  // =========================================================
  // 3) Contributions map
  // Rules:
  //   - Task create = contribution (task.id is a Date.now() ms timestamp — no createdAt exists)
  //   - Task complete = contribution (uses date/dueDate; falls back to creation id if neither exists)
  //   - Habit create = contribution (h.createdAt)
  //   - Habit check-in (completed) = contribution (h.history keys are already LOCAL date strings)
  //   - Project create = contribution (project.id is a Date.now() ms timestamp — no createdAt exists)
  //   - Project "complete" is NOT a reliable event yet (no completedAt field exists anywhere),
  //     so it's intentionally not counted as a separate contribution here.
  // =========================================================
  const activityByDate = useMemo(() => {
    const map = Object.create(null)
    const add = (dayStr, amount = 1) => {
      if (!dayStr) return
      map[dayStr] = (map[dayStr] || 0) + amount
    }

    // Habits
    habit.forEach((h) => {
      add(normalizeDateToDay(h.createdAt))

      if (h.history && typeof h.history === 'object') {
        Object.entries(h.history).forEach(([dateStr, entry]) => {
          if (entry?.completed) add(normalizeDateToDay(dateStr))
        })
      }
    })

    // Tasks
    tasks.forEach((t) => {
      add(normalizeDateToDay(t.id)) // creation — id is Date.now()

      if (t.completed) {
        const doneDay = normalizeDateToDay(t.completedAt) || normalizeDateToDay(t.id)
        add(doneDay)
        }
    })

    // Projects
    project.forEach((p) => {
      add(normalizeDateToDay(p.id)) // creation — id is Date.now()
    })

    return map
  }, [tasks, habit, project])

  // =========================================================
  // 4) Heatmap (last 365 days, aligned; contained; correct margins)
  // =========================================================
  const HEAT_CELL = 11
  const HEAT_GAP = 3
  const HEAT_STEP = HEAT_CELL + HEAT_GAP

  const HEAT_ROWS = 7
  const HEAT_DAYS = 365

  const heatmap = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(today)
    start.setDate(today.getDate() - (HEAT_DAYS - 1))

    // 0=Mon..6=Sun
    const startRow = (start.getDay() + 6) % 7
    const leadingBlanks = startRow

    const totalFilled = leadingBlanks + HEAT_DAYS
    const cols = Math.ceil(totalFilled / 7)
    const totalCells = cols * 7

    const cells = []
    for (let idx = 0; idx < totalCells; idx++) {
      const row = idx % 7
      const col = Math.floor(idx / 7)
      const dayIndex = idx - leadingBlanks // 0..364 are valid

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

      cells.push({
        blank: false,
        row,
        col,
        dateStr,
        total,
        color,
        isToday: dayIndex === HEAT_DAYS - 1,
      })
    }

    // Month labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthLabels = []
    const seen = new Set()
    for (let c = 0; c < cols; c++) {
      let cell = null
      for (let r = 0; r < 7; r++) {
        const found = cells.find((x) => !x.blank && x.col === c && x.row === r)
        if (found) {
          cell = found
          break
        }
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
  }, [activityByDate])

  // =========================================================
  // 5) Trend — % of days in each 7-day block having >= 1 contribution
  //    Points and gridlines now share the SAME scale function.
  // =========================================================
  // =========================================================
// Trend — real completion rate per week: (habit check-ins done + tasks completed)
// vs. (habit slots scheduled + tasks due) in that 7-day window.
// =========================================================
  const TREND_Y_TOP = 10    // y at 100%
  const TREND_Y_BOTTOM = 135 // y at 0%
  const yFromPct = (pct) => TREND_Y_BOTTOM - (pct / 100) * (TREND_Y_BOTTOM - TREND_Y_TOP)
  const trend = useMemo(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const blocks = [3, 2, 1, 0].map((weekOffset) => {
    const blockDates = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - (weekOffset * 7 + i))
      blockDates.push(toLocalYYYYMMDD(d))
    }
    const blockSet = new Set(blockDates)

    // Habits: slots scheduled vs completed this week
    let habitSlots = 0
    let habitDone = 0
    habit.forEach((h) => {
      blockDates.forEach((dateStr) => {
        const dayNum = new Date(dateStr + 'T00:00:00').getDay()
        if (h.activeDays?.includes(dayNum)) {
          habitSlots++
          if (h.history?.[dateStr]?.completed) habitDone++
        }
      })
    })

    // Tasks: due this week vs completed (regardless of when completed)
    let taskDue = 0
    let taskDone = 0
    tasks.forEach((t) => {
      const dueDay = normalizeDateToDay(t.date || t.dueDate)
      if (dueDay && blockSet.has(dueDay)) {
        taskDue++
        if (t.completed) taskDone++
      }
    })

    const totalSlots = habitSlots + taskDue
    return totalSlots > 0 ? Math.round(((habitDone + taskDone) / totalSlots) * 100) : 0
  })

  const points = [
    { x: 50, y: yFromPct(blocks[0]), label: 'Week 1', value: blocks[0] },
    { x: 200, y: yFromPct(blocks[1]), label: 'Week 2', value: blocks[1] },
    { x: 350, y: yFromPct(blocks[2]), label: 'Week 3', value: blocks[2] },
    { x: 500, y: yFromPct(blocks[3]), label: 'Current', value: blocks[3], active: true },
  ]
  const pathD = `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`

  return { blocks, points, pathD }
}, [activityByDate, tasks, habit])

  // =========================
  // UI constants for heatmap SVG
  // =========================
  const SVG_LEFT_PAD = 28
  const SVG_TOP_PAD = 18
  const SVG_RIGHT_PAD = 6
  const SVG_BOT_PAD = 6

  const HEAT_W = SVG_LEFT_PAD + heatmap.cols * HEAT_STEP + SVG_RIGHT_PAD
  const HEAT_H = SVG_TOP_PAD + HEAT_ROWS * HEAT_STEP + SVG_BOT_PAD

  const weekdayLabels = [
    { row: 0, label: 'Mon' },
    { row: 2, label: 'Wed' },
    { row: 4, label: 'Fri' },
  ]

  // Gridlines derived from the same scale as the trend points
  const trendGridlines = [100, 75, 50, 25, 0].map((pct) => ({ pct, y: yFromPct(pct) }))

  return (
    <div className="h-screen flex bg-[#FAF6ED] text-[#2C3328] font-sans overflow-hidden">
      <Sidebar activeTab="Analytics" />

      <main className="flex-1 flex flex-col pl-6 mr-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-2 ml-2">
          <div>
            <h1 className="text-3xl font-serif font-medium mt-1">Analytics</h1>
            <p className="text-black font-serif text-lg mb-2">Track tasks, projects, and habit consistency.</p>
          </div>
        </header>

        {/* Top 4 cards */}
        <section className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-white/90 border border-[#dad085] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-full border-4 border-[#C8DCB8] border-t-[#4D6B3C] flex items-center justify-center shrink-0 text-[10px] font-bold text-[#143022]">
              {overallRate}%
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#143022] leading-none">{overallRate}%</h3>
              <p className="text-xs font-semibold text-[#444C3D] mt-1">Overall Completion</p>
              <p className="text-[10px] text-[#4D6B3C] font-bold mt-0.5">Tasks & Habits combined</p>
            </div>
          </div>

          <div className="bg-white/90 border border-[#dad085] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E7] border border-[#F3DFC1] text-[#D97706] flex items-center justify-center text-lg shrink-0">
              🔥
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#143022] leading-none">{longestStreak} Days</h3>
              <p className="text-xs font-semibold text-[#444C3D] mt-1">Best Habit Streak</p>
              <p className="text-[10px] text-[#4D6B3C] font-bold mt-0.5">{totalHabits} active habits tracked</p>
            </div>
          </div>

          <div className="bg-white/90 border border-[#dad085] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#F5F8F2] border border-[#DCE8D5] text-[#4D6B3C] flex items-center justify-center text-lg shrink-0">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#143022] leading-none">{completedTasks} / {totalTasks}</h3>
              <p className="text-xs font-semibold text-[#444C3D] mt-1">Tasks Completed</p>
              <p className="text-[10px] text-[#4D6B3C] font-bold mt-0.5">{taskCompletionRate}% task rate</p>
            </div>
          </div>

          <div className="bg-white/90 border border-[#dad085] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#F7F4EC] border border-[#E8DFC8] text-[#8C6D3F] flex items-center justify-center text-lg shrink-0">
              📁
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#143022] leading-none">{activeProjects} / {totalProjects}</h3>
              <p className="text-xs font-semibold text-[#444C3D] mt-1">Active Projects</p>
              <p className="text-[10px] text-[#70766B] font-medium mt-0.5">{totalHabitCheckIns} total check-ins</p>
            </div>
          </div>
        </section>

        {/* Middle section */}
        <section className="grid grid-cols-2 gap-4 mb-2">
          {/* Heatmap */}
          <div className="bg-white border border-[#dad085] rounded-2xl p-4 shadow-xs overflow-hidden">
            <HeatMap tasks={tasks} project={project} habit={habit} days={365} />
          </div>

          {/* Trend */}
          <div className="bg-white border border-[#dad085] rounded-2xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#143022]">Completion Trend</h2>
              <span className="text-[11px] font-semibold text-gray-500">Past 4 Weeks</span>
            </div>

            <div className="relative w-full h-36 flex items-center">
              <div className="flex flex-col justify-between h-full text-[9px] font-semibold text-[#90988A] pr-2 select-none">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <div className="relative flex-1 h-full">
                <svg viewBox="0 0 560 140" className="w-full h-full overflow-visible">
                  {trendGridlines.map(({ pct, y }) => (
                    <line key={pct} x1="0" y1={y} x2="560" y2={y} stroke="#F0EAE1" strokeDasharray="3 3" />
                  ))}

                  <path d={trend.pathD} fill="none" stroke="#4D6B3C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

                  {trend.points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={p.active ? 5 : 4}
                      fill={p.active ? '#143022' : '#FFFFFF'}
                      stroke="#4D6B3C"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>

                <div
                  className="absolute bg-white border border-[#EDE7DC] rounded-lg px-2 py-1 shadow-md -translate-x-1/2 text-center pointer-events-none"
                  style={{ left: '89%', top: `${Math.max(5, trend.points[3].y - 35)}px` }}
                >
                  <p className="text-[9px] text-[#70766B] font-semibold">Current Week</p>
                  <p className="text-xs font-bold text-[#143022]">{trend.points[3].value}%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pl-8 text-[9px] font-semibold text-[#90988A] pt-1">
              {trend.points.map((p, i) => (
                <span key={i}>{p.label}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <section className="grid grid-cols-2 gap-4 mb-2">
          {/* Projects & Tasks Breakdown */}
<div className="bg-white border border-[#dad085] rounded-2xl p-4 shadow-xs">
  <h2 className="text-sm font-bold text-[#143022] mb-3">Projects & Tasks Breakdown</h2>

  <div className="flex items-center justify-around gap-4">
    {/* Task Donut */}
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path
            strokeWidth="3.8"
            stroke="#E7EDE1"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${taskCompletionRate}, 100`}
            strokeWidth="3.8"
            strokeLinecap="round"
            stroke="#143022"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-base font-extrabold text-[#143022] leading-none">{taskCompletionRate}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-[#444C3D]">Tasks Done</span>
    </div>

    {/* Project Donut */}
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <path
            strokeWidth="3.8"
            stroke="#E7EDE1"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${projectCompletionRate}, 100`}
            strokeWidth="3.8"
            strokeLinecap="round"
            stroke="#8C6D3F"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-base font-extrabold text-[#143022] leading-none">{projectCompletionRate}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-[#444C3D]">Projects Done</span>
    </div>
  </div>
</div>
          {/* Habit Streaks */}
          <div className="bg-white border border-[#dad085] rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#143022]">Habit Streaks</h2>
              <span className="text-xs font-semibold text-[#70766B]">{habit.length} Tracked</span>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-36">
              {habit.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No habits created yet.</p>
              ) : (
                habit.map((h, i) => (
                  <div key={h.habitId || i} className="flex items-center justify-between py-1 border-b border-[#F7F4EE] last:border-none">
                    <span className="text-xs font-semibold text-[#2C3328] truncate">{h.habitName}</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#143022]">
                      <span>{h.currentStreak || 0} days</span>
                      
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border border-[#dad085] rounded-2xl h-15 mb-4 pl-3 flex items-center justify-between shadow-xs mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EDE7DC] text-[#4D6B3C] flex items-center justify-center text-base">
              ⭐
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#143022]">
                {overallRate >= 70 ? "You're crushing it!" : 'Keep building momentum!'}
              </h4>
              <p className="text-[11px] text-[#70766B]">
                {completedTasks} tasks completed and {totalHabitCheckIns} total habit check-ins recorded so far.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Analytics    