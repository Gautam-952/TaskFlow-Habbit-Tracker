import React, { useState } from 'react'
import { Sidebar, Navbar, NewHabit } from '../Components'
import { useNavigate } from 'react-router-dom'

const HABIT_DOODLES = [
  // 1. Coding / DSA (Code Brackets)
  {
    bg: '#EBE5FC', stroke: '#5B4296',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  // 2. Gym / Workout (Dumbbell)
  {
    bg: '#E2F8EB', stroke: '#2D754E',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M6 12h12" />
        <rect x="3" y="8" width="3" height="8" rx="1.5" />
        <rect x="18" y="8" width="3" height="8" rx="1.5" />
      </svg>
    )
  },
  // 3. Typing / Keyboard Practice
  {
    bg: '#FFF0D9', stroke: '#B25E00',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2.5" />
        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
      </svg>
    )
  },
  // 4. Reading / Study (Book)
  {
    bg: '#FCE7F0', stroke: '#A22C5C',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  },
  // 5. Hydration / Drink Water (Water Droplet)
  {
    bg: '#E0F2FE', stroke: '#0369A1',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    )
  },
  // 6. Meditation / Mindfulness (Lotus / Zen)
  {
    bg: '#EDE9FE', stroke: '#6D28D9',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c2.5 4 4.5 9 0 16-4.5-7-2.5-12 0-16z" />
        <path d="M12 14c3.5-1.5 7.5.5 8 4-3.5 1-6.5-.5-8-4z" />
        <path d="M12 14c-3.5-1.5-7.5.5-8 4 3.5 1 6.5-.5 8-4z" />
      </svg>
    )
  },
  // 7. Sleep / Rest (Moon & Stars)
  {
    bg: '#E2E8F0', stroke: '#334155',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )
  },
  // 8. Outdoor / Running (Shoe / Step)
  {
    bg: '#FEF3C7', stroke: '#92400E',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17h16" />
        <path d="M7 17l-3-6 2-1 3 3 5-7 6 5-2 6" />
      </svg>
    )
  },
  // 9. Journaling / Writing (Pen & Pad)
  {
    bg: '#F3E8FF', stroke: '#7E22CE',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    )
  },
  // 10. Healthy Eating / Nutrition (Apple)
  {
    bg: '#FEE2E2', stroke: '#B91C1C',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.5c-4.5 0-7.5-3.5-7.5-8a6.5 6.5 0 0 1 6.5-6.5c1 0 2 .5 2 1s1-1 2-1a6.5 6.5 0 0 1 6.5 6.5c0 4.5-3 8-7.5 8z" />
        <path d="M12 6V3c1-1 2-1 3-1" />
      </svg>
    )
  }
]

function Habbit( {habit , setHabit ,  tasks=[] , project=[]}) {

  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [focusedHabit, setFocusedHabit] = useState(null)
  const toLocalDateStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const weekDays = [
    { label: 'M', num: 1 },
    { label: 'T', num: 2 },
    { label: 'W', num: 3 },
    { label: 'T', num: 4 },
    { label: 'F', num: 5 },
    { label: 'S', num: 6 },
    { label: 'S', num: 0 },
  ]

  const getDoodleForHabit = (name = '') => {
    const text = name.toLowerCase()
    if (text.includes('code') || text.includes('dsa') || text.includes('dev') || text.includes('program')) return HABIT_DOODLES[0]
    if (text.includes('gym') || text.includes('workout') || text.includes('exercise') || text.includes('lift')) return HABIT_DOODLES[1]
    if (text.includes('type') || text.includes('typing') || text.includes('keyboard')) return HABIT_DOODLES[2]
    if (text.includes('read') || text.includes('book') || text.includes('study') || text.includes('learn')) return HABIT_DOODLES[3]
    if (text.includes('water') || text.includes('drink') || text.includes('hydrat')) return HABIT_DOODLES[4]
    if (text.includes('meditat') || text.includes('zen') || text.includes('breathe')) return HABIT_DOODLES[5]
    if (text.includes('sleep') || text.includes('bed') || text.includes('rest')) return HABIT_DOODLES[6]
    if (text.includes('run') || text.includes('walk') || text.includes('jog') || text.includes('step')) return HABIT_DOODLES[7]
    if (text.includes('journal') || text.includes('write') || text.includes('diary')) return HABIT_DOODLES[8]
    if (text.includes('eat') || text.includes('diet') || text.includes('food') || text.includes('fruit')) return HABIT_DOODLES[9]
    const charCodeSum = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return HABIT_DOODLES[charCodeSum % HABIT_DOODLES.length]
  }

  const toggleHabitToday = (habitId) => {
    const todayStr = new Date().toISOString().split('T')[0]

    setHabit((prevHabits) =>
      prevHabits.map((h) => {
        if (h.habitId !== habitId) return h

        const isCompletedToday = Boolean(h.history && h.history[todayStr]?.completed)

        if (isCompletedToday) {
          const updatedHistory = { ...h.history }
          delete updatedHistory[todayStr]

          return {
            ...h,
            currentStreak: Math.max(0, h.currentStreak - 1),
            history: updatedHistory,
          }
        } else {
          const nextStreak = h.currentStreak + 1
          const updatedHistory = {
            ...h.history,
            [todayStr]: { completed: true },
          }

          return {
            ...h,
            currentStreak: nextStreak,
            bestStreak: Math.max(h.bestStreak, nextStreak),
            history: updatedHistory,
          }
        }
      })
    )
  }

  // 1. Delete handler
  const deleteHabit = (habitId) => {
    setHabit((prev) => prev.filter((h) => h.habitId !== habitId))
  }

  // 2. Open edit modal
  const startEditHabit = (item) => {
    setEditingHabit(item)
    setIsOpen(true)
  }

  // 3. Save edited habit
  const saveEditedHabit = (updatedItem) => {
    setHabit((prev) =>
      prev.map((h) => (h.habitId === updatedItem.habitId ? updatedItem : h))
    )
    setEditingHabit(null)
    setIsOpen(false)
  }

  // Dynamic Stats Calculations
  const todayDateStr = toLocalDateStr()
  const currentDayOfWeek = new Date().getDay()

  // 1. Completed Today vs Total Scheduled Today
  const todayHabitsList = habit.filter((h) => h.activeDays && h.activeDays.includes(currentDayOfWeek))
  const completedTodayCount = todayHabitsList.filter((h) => Boolean(h.history && h.history[todayDateStr]?.completed)).length
  const totalTodayCount = todayHabitsList.length

  // 2. Streaks
  const maxCurrentStreak = habit.length > 0 ? Math.max(...habit.map((h) => h.currentStreak || 0), 0) : 0
  const maxBestStreak = habit.length > 0 ? Math.max(...habit.map((h) => h.bestStreak || 0), 0) : 0

  // 3. Weekly Completion %
  const past7Days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return toLocalDateStr(d)
  })
  let totalWeeklySlots = 0
  let completedWeeklySlots = 0
  habit.forEach((h) => {
    past7Days.forEach((dateString) => {
      const dayNum = new Date(dateString).getDay()
      if (h.activeDays && h.activeDays.includes(dayNum)) {
        totalWeeklySlots++
        if (h.history && h.history[dateString]?.completed) {
          completedWeeklySlots++
        }
      }
    })
  })
  const weeklyRate = totalWeeklySlots > 0 ? Math.round((completedWeeklySlots / totalWeeklySlots) * 100) : 0

  // 16 Weeks (112 days) aligned to standard Sunday-to-Saturday columns
  const totalWeeks = 16
  const today = new Date()
  const currentDayOfWeekIndex = today.getDay()
  const totalDays = totalWeeks * 7

  const heatmapDays = Array.from({ length: totalDays }, (_, i) => {
    const offset = totalDays - 1 - (6 - currentDayOfWeekIndex) - i
    const d = new Date()
    d.setDate(today.getDate() - offset)
    const dateStr = toLocalDateStr(d)
    const dayCount = habit.filter((h) => Boolean(h.history && h.history[dateStr]?.completed)).length
    return {
      dateStr,
      count: dayCount,
      dayOfWeek: d.getDay(),
      month: d.toLocaleString('default', { month: 'short' }),
      dateNum: d.getDate(),
    }
  })

  // Milestone Progress (0 to 365)
  const milestoneProgress = Math.min(100, Math.max(0, Math.round((maxCurrentStreak / 365) * 100)))
  const habitsToRender = focusedHabit
    ? habit.filter((h) => h.habitId === focusedHabit.habitId)
    : habit

  return (
    <div className='h-screen flex bg-[#FAF6ED]'>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <div className='flex'>
          <Navbar
          title="Habit"
          para="Manage all you Habits at one place"
          tasks={tasks}
          project={project}
          habit={habit}
          searchScope="habits"
          searchPlaceholder="Search Habits..."
          onSelectResult={(type, item) => {
            if (type === 'habit') setFocusedHabit(item)
          }}
          onOpenSettings={() => navigate('/settings')}
        />
        </div>

        {/* Top 5 Stat Boxes (White Background) */}
        <div className="w-full px-6 py-3 ">
          <div className="grid grid-cols-5 gap-3.5">
            {/* Box 1: Completed Today */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#A855F7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                  <path d="M12 3a9 9 0 0 1 9 9" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none">
                  {completedTodayCount} <span className="text-xs font-normal text-gray-500">/ {totalTodayCount}</span>
                </h4>
                <p className="text-[11px] text-gray-500 mt-1">Completed Today</p>
              </div>
            </div>

            {/* Box 2: Current Streak */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none">{maxCurrentStreak}</h4>
                <p className="text-[11px] text-gray-500 mt-1">Current Streak</p>
              </div>
            </div>

            {/* Box 3: Best Streak */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 19h12" />
                  <path d="M5 16l-2-9 5 3 4-5 4 5 5-3-2 9H5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none">{maxBestStreak}</h4>
                <p className="text-[11px] text-gray-500 mt-1">Best Streak</p>
              </div>
            </div>

            {/* Box 4: Weekly Completion */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none">{weeklyRate}%</h4>
                <p className="text-[11px] text-gray-500 mt-1">Weekly Completion</p>
              </div>
            </div>

            {/* Box 5: Active Habits */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 leading-none">{habit.length}</h4>
                <p className="text-[11px] text-gray-500 mt-1">Active Habits</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex h-screen flex-row overflow-hidden'>
          <div className='flex flex-col w-2/3 '>
            <div className='border m-1 mt-2 ml-6 rounded-xl h-full mb-2 mr-2 overflow-hidden border-[#dad085] bg-[#fefefb] flex flex-col'>
              <div className='w-full h-11 flex justify-between shrink-0 relative'>
                <div className='font-serif text-lg ml-4 mt-2'>Today's Habits</div>
                <button
                type="button"
                onClick={() => {
                    setEditingHabit(null)
                    setIsOpen(true)
                  }} 
                className="px-5 py-2 h-9 w-29 hover:scale-[1.04] mt-2 mb-1 mr-2 rounded-full text-xs font-bold text-[#3B2912] cursor-pointer transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-md"
                style={{
                  background: 'linear-gradient(180deg, #E8DCB8 0%, #E8DCB8 50%, #E8DCB8 100%)',
                  boxShadow:
                    'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                  border: '1px solid #E8DCB8',
                  textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                }}
              >
                <span>+</span>
                <span>New Habit</span>
              </button>
                {isOpen && (
                  <NewHabit
                    setIsOpen={(open) => {
                      setIsOpen(open)
                      if (!open) setEditingHabit(null)
                    }}
                    habit={habit}
                    setHabit={setHabit}
                    editingHabit={editingHabit}
                    saveEditedHabit={saveEditedHabit}
                  />
                )}
              </div>

              {/* Habits List */}
              <div className="flex flex-col flex-1 min-h-0 overflow-y-auto gap-2 p-2 bg-white ">
                {habit.length === 0 ? (
                  <div className="text-gray-600 text-center py-6 text-sm">
                    No habits yet. Click "+ New Habit" to create one!
                  </div>
                ) : (
                  
                  habitsToRender.map((item) => (
                    <div>{focusedHabit && (
                        <div className='flex items-center gap-3 px-2 pb-2'>
                            <button
                                onClick={() => setFocusedHabit(null)}
                                className='text-sm text-[#6b8f5f] font-medium hover:underline cursor-pointer'
                            >
                                ← Back to all habits
                            </button>
                            <span className='text-sm text-[#8a8578]'>
                                Showing result for "{focusedHabit.habitName}"
                            </span>
                        </div>
                    )}
                    
                    <div
                      key={item.habitId}
                      className="shrink-0 flex items-center justify-between border border-[#dad085] p-3 rounded-xl bg-[#FAF6ED]/30 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {(() => {
                          const doodle = getDoodleForHabit(item.habitName)
                          return (
                            <div
                              style={{ backgroundColor: doodle.bg }}
                              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                            >
                              {doodle.svg(doodle.stroke)}
                            </div>
                          )
                        })()}

                        {/* Habit Name & Schedule */}
                        <div className="w-36 truncate">
                          <h3 className="font-semibold text-base truncate" title={item.habitName}>
                            {item.habitName}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize truncate">
                            {item.scheduleType}
                          </p>
                        </div>

                        {/* M T W Badges -> Green */}
                        <div className="ml-4 flex items-center gap-1.5">
                          {weekDays.map((d, index) => {
                            const todayDayNum = new Date().getDay()
                            const todayStr = new Date().toISOString().split('T')[0]
                            const isDoneToday = Boolean(item.history && item.history[todayStr]?.completed)
                            const isScheduled = Boolean(item.activeDays && item.activeDays.includes(d.num))
                            const isHighlighted = isScheduled && (d.num === todayDayNum ? isDoneToday : false)

                            return (
                              <span
                                key={index}
                                className={`w-8 h-8 ml-2 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                  isHighlighted
                                    ? 'bg-lime-500 text-white shadow-lg border-amber-200/80 border'
                                    : 'bg-black/10 text-gray-400'
                                }`}
                              >
                                {d.label}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => startEditHabit(item)}
                          className="w-7 h-7 rounded-lg hover:scale-[1.04] text-gray-600 hover:text-emerald-600 hover:bg-white/60 flex items-center justify-center transition-colors"
                          title="Edit Habit"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => deleteHabit(item.habitId)}
                          className="w-7 h-7 rounded-lg hover:scale-[1.04] text-gray-600 hover:text-red-500 hover:bg-white/60 flex items-center justify-center transition-colors"
                          title="Delete Habit"
                        >
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>

                        {/* Checkbox Button -> Green */}
                        {(() => {
                          const todayStr = new Date().toISOString().split('T')[0]
                          const isDoneToday = Boolean(item.history && item.history[todayStr]?.completed)

                          return (
                            <button
                              type="button"
                              onClick={() => toggleHabitToday(item.habitId)}
                              className={`w-6 h-6 rounded-lg flex items-center hover:scale-[1.04] justify-center cursor-pointer transition-all ${
                                isDoneToday
                                  ? 'bg-lime-500 text-white shadow-lg border border-amber-200/80'
                                  : 'border-2 border-gray-400 hover:border-lime-400 bg-white'
                              }`}
                            >
                              {isDoneToday && <span className="text-xs font-bold">✓</span>}
                            </button>
                          )
                        })()}
                      </div>
                    </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* Right Side Column Panels */}
          <div className='flex flex-1 flex-col '>
            
            {/* 1. Top Box (h-40): Current Streak & Milestone (0 to 365) */}
            <div className='border m-1 ml-2 mt-2 rounded-xl h-40 mb-2 mr-4 bg-white/88 border-[#dad085] p-3 flex flex-col justify-between overflow-hidden'>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">Current Streak</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base">🔥</span>
                    <span className="text-lg font-extrabold text-gray-900">{maxCurrentStreak}</span>
                    <span className="text-xs text-gray-600 font-medium">Days</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">Keep it up!</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-amber-300 flex items-center justify-center text-lg shadow-xs">
                  🏆
                </div>
              </div>

              {/* Milestone Tracker */}
              <div className="w-full">
                <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-lime-500 rounded-full transition-all duration-300"
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-semibold text-gray-500 mt-1.5 px-0.5">
                  <span className={maxCurrentStreak >= 0 ? 'text-emerald-700 font-bold' : ''}>0</span>
                  <span className={maxCurrentStreak >= 7 ? 'text-emerald-700 font-bold' : ''}>7</span>
                  <span className={maxCurrentStreak >= 30 ? 'text-emerald-700 font-bold' : ''}>30</span>
                  <span className={maxCurrentStreak >= 100 ? 'text-emerald-700 font-bold' : ''}>100</span>
                  <span className={maxCurrentStreak >= 365 ? 'text-emerald-700 font-bold' : ''}>365</span>
                </div>
              </div>
            </div>

            {/* 2. Middle Box (h-60): Activity Heatmap (Green Theme) */}
            <div className='border h-60 mb-2 ml-2 rounded-xl mr-4 bg-white/88 border-[#dad085] p-3.5 flex flex-col justify-between overflow-hidden shadow-xs'>
              
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-gray-800">365-Day Activity</h3>
                  <p className="text-[10px] text-gray-400">Consistency tracker</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {heatmapDays.reduce((acc, d) => acc + d.count, 0)} Contributions
                </span>
              </div>

              {/* Heatmap Matrix */}
              <div className="flex items-center justify-center gap-2 py-1 w-full overflow-hidden">
                <div className="flex flex-col justify-between text-[9px] font-medium text-gray-600 pr-1 select-none py-0.5" style={{ height: '98px' }}>
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>

                <div 
                  className="grid grid-flow-col grid-rows-7 gap-[2.5px] overflow-x-auto"
                  style={{ gridAutoColumns: '12px', gridAutoRows: '12px' }}
                >
                  {heatmapDays.map((day, idx) => {
                    let cellColor = '#E5E7EB'
                    if (day.count === 1) cellColor = '#86EFAC'
                    else if (day.count === 2) cellColor = '#22C55E'
                    else if (day.count >= 3) cellColor = '#15803D'

                    return (
                      <div
                        key={idx}
                        title={`${day.dateStr}: ${day.count} completed`}
                        style={{
                          backgroundColor: cellColor,
                          width: '12px',
                          height: '12px',
                          borderRadius: '2.5px',
                        }}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    )
                  })}
                </div>
              </div>

              {/* Footer Legend in Green */}
              <div className="flex items-center justify-between text-[9px] text-gray-500  font-medium pt-1 border-t border-gray-200">
                <span>Recent 16 weeks</span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#E5E7EB', borderRadius: '2px' }} />
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#86EFAC', borderRadius: '2px' }} />
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#22C55E', borderRadius: '2px' }} />
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#15803D', borderRadius: '2px' }} />
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* 3. Bottom Box (h-25): Weekly Trend Sparkline (Green Score & Green Wave) */}
            <div className='border h-25 mb-2 ml-2 rounded-xl mr-4 bg-white/88 border-[#dad085] p-3 flex items-center justify-between overflow-hidden'>
              <div>
                <h3 className="text-xs font-bold text-gray-800">This Week</h3>
                <h4 className="text-xl font-extrabold text-lime-500 leading-none mt-1">{weeklyRate}%</h4>
                <p className="text-[10px] text-lime-500 font-bold mt-1">▲ Consistent</p>
              </div>

              {/* Green Sparkline Curve */}
              <div className="w-28 h-10 flex items-center justify-center">
                <svg viewBox="0 0 120 40" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="greenWaveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0 32 C 20 32, 35 28, 50 18 C 65 8, 80 26, 95 12 C 105 4, 115 15, 120 8 L 120 40 L 0 40 Z" 
                    fill="url(#greenWaveGradient)" 
                  />
                  <path 
                    d="M 0 32 C 20 32, 35 28, 50 18 C 65 8, 80 26, 95 12 C 105 4, 115 15, 120 8" 
                    fill="none" 
                    stroke="#059669" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>
        <div className='border bg-white/88 border-[#dad085] h-16 mb-2 ml-6 rounded-xl mr-4 mt-2 text-lg italic items-center justify-center flex leading-normal'><span className='text-2xl'>“</span> Discipline is the bridge between goals and accomplishment.  <span className='text-lg font-serif'>- Jim Rohn</span></div>

      </div>
    </div>
  )
}

export default Habbit