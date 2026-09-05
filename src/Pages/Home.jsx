import React, { useState } from 'react'
import { CheckCircle2, Flame } from 'lucide-react';
import {Sidebar , Header , HeatMap , Focus, Navbar} from "../Components"
import { useNavigate } from 'react-router-dom'
import { useUserName } from '../Components/useUserName';


function Home( {tasks = [], project = [], habit = [], setHabit , setTasks}) {

     const [isFocusOpen , setIsFocusOpen] = useState(false)
     const navigate = useNavigate()
     const userName = useUserName()

    return (
        <div className='h-screen flex'>
            
            <Sidebar />

            <div className='h-screen flex-1 bg-[#fffefc] '>
                <div className='flex flex-col h-full'>
                   <div className="[&>nav]:bg-transparent [&>div]:bg-transparent">
                        <Navbar
                        title={`Good morning, ${userName} 🌿`}
                        para="Focus on one thing today."
                        showSearch={false}
                        onOpenSettings={() => navigate('/settings')}
                    />
                   </div>

                    <div className=' h-[28%] flex flex-row pl-4 pr-1 '>
                        
                        <div className='relative flex-row justify-between bg-[#f6eee4] border-[#EDE8E0] h-47 shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transition-all ease-out transform-3d flex w-[65%] border mr-2 ml-3 rounded-xl overflow-hidden m-1 '>
                                <div className='flex flex-col pl-6'>
                                        <div className='text-xs pt-3 pb-2 text-lime-600 font-semibold '>TODAY'S FOCUS</div>
                                        <div className='font-medium text-4xl pb-3 text-black'>Build TaskFlow UI</div>
                                        <div className='flex flex-row'>
                                                <div className='text-xs font-light text-black'>📆︎ Due Today . </div>
                                                <div className='text-xs font-light text-red-600 ml-2'>High Priority</div>
                                        </div>
                                            <button 
                                            onClick={() => setIsFocusOpen(true)}
                                            className='text-xl rounded-2xl flex border text-white border-[#dad085] shadow-md cursor-pointer transition-all duration-150 active:scale-95 hover:scale-[1.04] bg-lime-700 hover:bg-lime-600  w-40 items-center justify-center mt-5 h-14'>▷  Start Focus
                                            </button>
                                            {isFocusOpen && <Focus onClose={() => setIsFocusOpen(false)} />}
                                </div>
                                <div className='absolute bottom-0 -top-3 left-[40%] h-12'>
                                    <img src="./icons/lotus6.png" alt="lotus" />
                                </div>
                        </div>

                        {(() => {
                            // 1. Date helper avoiding UTC shifts
                            const toLocalStr = (d) =>
                                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                            const today = new Date();
                            const todayStr = toLocalStr(today);

                            const yesterday = new Date(today);
                            yesterday.setDate(today.getDate() - 1);
                            const yesterdayStr = toLocalStr(yesterday);

                            // 2. Comprehensive score computation across Habit, Task, and Project
                            const calculateScore = (targetDate, dateStr) => {
                                const dayOfWeek = targetDate.getDay();
                                let totalWeight = 0;
                                let completedWeight = 0;

                                // --- HABITS ---
                                habit.forEach((h) => {
                                    const isActive = !h.activeDays || h.activeDays.includes(dayOfWeek);
                                    if (isActive) {
                                        totalWeight++;
                                        if (h.history?.[dateStr]?.completed) completedWeight++;
                                    }
                                });

                                // --- TASKS ---
                                tasks.forEach((t) => {
                                    const taskDate = (t.date || t.dueDate || '').split('T')[0];
                                    if (taskDate === dateStr) {
                                        totalWeight++;
                                        if (t.completed) completedWeight++;
                                    }
                                });

                                // --- PROJECTS ---
                                project.forEach((p) => {
                                    const projDate = (p.targetDate || p.dueDate || p.date || '').split('T')[0];

                                    // Direct due-date match
                                    if (projDate === dateStr) {
                                        totalWeight += 2; // Extra weight for project deadlines
                                        const isDone = Boolean(p.completed || p.status === 'completed');
                                        if (isDone) completedWeight += 2;
                                    } else if (p.progress !== undefined) {
                                        // If the project is actively in progress
                                        totalWeight += 1;
                                        completedWeight += Math.min(1, Math.max(0, p.progress / 100));
                                    }
                                });

                                return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
                            };

                            const score = calculateScore(today, todayStr);
                            const yesterdayScore = calculateScore(yesterday, yesterdayStr);
                            const diff = score - yesterdayScore;

                            // 3. SVG Ring math
                            const radius = 48;
                            const circumference = 2 * Math.PI * radius;
                            const offset = circumference - (score / 100) * circumference;

                            return (
                                <div className='flex flex-1 ml-3 mr-4 h-52 pl-1 pr-4'>
                                    <div className='flex flex-col pl-6 border h-47 mt-1 pr-4 border-[#EDE8E0] shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d rounded-xl w-full bg-[#f6eee4] justify-between'>
                                        <div className='text-base font-mono pt-1 text-black'>FOCUS SCORE</div>

                                        <div className='flex flex-col justify-center items-center relative'>
                                            <svg width='110' height='110' className='-rotate-90'>
                                                {/* Background track circle */}
                                                <circle
                                                    cx='56'
                                                    cy='56'
                                                    r={radius}
                                                    fill='none'
                                                    stroke='#e5e7eb' /* subtle gray track */
                                                    strokeWidth='8'
                                                />
                                                {/* Progress fill circle */}
                                                <circle
                                                    cx='56'
                                                    cy='56'
                                                    r={radius}
                                                    fill='none'
                                                    stroke='#52c723' /* solid vibrant green */
                                                    strokeWidth='8'
                                                    strokeLinecap='round'
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={offset}
                                                    className='transition-all duration-700 ease-out'
                                                />
                                            </svg>

                                            {/* Score centered directly inside ring */}
                                            <div className='absolute flex flex-col items-center justify-center pointer-events-none'>
                                                <span className='text-2xl text-black font-bold pb-6 pl-2'>{score}%</span>
                                            </div>

                                            <div className='text-sm font-medium text-black'>
                                                {score === 100 ? 'All done for today!' : score >= 50 ? 'Keep it going!' : 'Ready to begin?'}
                                            </div>
                                        </div>

                                        <div className='text-xs text-lime-600 pt-0.5 pb-1 border-t border-gray-400 flex items-center justify-between'>
                                            <span>
                                                {diff >= 0 ? `+${diff}%` : `${diff}%`} from yesterday
                                            </span>
                                            <span className='text-[10px] text-black'>Tasks • Habits • Projects</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className=' h-[31%]'>
                        <div className='flex flex-row h-full pl-4 pr-4 '>
                            <div className='bg-[#f6eee4] border-[#EDE8E0] h-52 shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d flex flex-col w-[45%] border rounded-2xl ml-3 mr-3 m-1 overflow-hidden'>
                                <div className='h-8 w-full   justify-between flex flex-row pl-5'>
                                    <div className=' font-mono text-black text-base flex items-center'>TODAY'S HABITS</div>
                                    <img className='w-8 mr-4 h-8 pt-1' src="./logo/logo2.png" alt="lotus" />
                                </div>
                                <div className='flex flex-col pl-4 pr-4 overflow-y-auto'>
                                    {habit.length === 0 ? (
                                        <div className='text-base text-gray-400 py-4 text-center'>No habits yet.</div>
                                    ) : (
                                        habit.map((item) => {
                                        const todayStr = new Date().toISOString().split('T')[0]
                                        const isDoneToday = Boolean(item.history && item.history[todayStr]?.completed)

                                        return (
                                            <div key={item.habitId} className='flex items-center text-base font-thin text-black justify-between py-2 border-b border-gray-600 last:border-none'>
                                            <div className='flex items-center gap-2.5 pb-1'>
                                                <button
                                                type='button'
                                                onClick={() => {
                                                    setHabit((prev) =>
                                                    prev.map((h) => {
                                                        if (h.habitId !== item.habitId) return h
                                                        const done = Boolean(h.history && h.history[todayStr]?.completed)
                                                        if (done) {
                                                        const updatedHistory = { ...h.history }
                                                        delete updatedHistory[todayStr]
                                                        return { ...h, currentStreak: Math.max(0, h.currentStreak - 1), history: updatedHistory }
                                                        } else {
                                                        const nextStreak = h.currentStreak + 1
                                                        return {
                                                            ...h,
                                                            currentStreak: nextStreak,
                                                            bestStreak: Math.max(h.bestStreak, nextStreak),
                                                            history: { ...h.history, [todayStr]: { completed: true } },
                                                        }
                                                        }
                                                    })
                                                    )
                                                }}
                                                className={`w-6 h-6 rounded-full flex items-center  justify-center transition-all ${
                                                    isDoneToday ? 'bg-bltext-black text-white  bg-lime-500 shadow-sm' : 'border-2 border-gray-300 hover:border-lime-400 bg-white'
                                                }`}
                                                >
                                                {isDoneToday && <span className='text-[10px] font-bold'>✓</span>}
                                                </button>
                                                <span className='text-sm font-semibold truncate'>{item.habitName}</span>
                                            </div>

                                            <span className={`text-xs font-semibold ${isDoneToday ? 'text-[#3d6924] bg-lime-200 rounded-lg w-11 pl-2 h-4' : 'text-[#d16341] bg-pink-200 w-13 rounded-lg pl-1 h-4'}`}>
                                                {isDoneToday ? 'Done' : 'Pending'}
                                            </span>
                                            </div>
                                        )
                                        })
                                    )}
                                    </div>
                            </div>
                            <div className='bg-[#f6eee4] pl-1  border-[#EDE8E0] shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d flex flex-col flex-1 ml-4 border rounded-2xl m-1 mr-4 overflow-hidden'>
                                {/* Header */}
                                {(() => {
                                    const today = new Date();
                                    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                    const todaysTasks = tasks.filter((t) => (t.date || t.dueDate || '').split('T')[0] === todayDate);

                                    return (
                                        <div className='h-8 w-full justify-between flex flex-row items-center px-5 shrink-0 border-b border-gray-100'>
                                        <div className='font-mono text-black text-base flex items-center'>TODAY'S TASKS</div>
                                        <div className='font-mono text-black text-xs items-center flex'>
                                            {todaysTasks.length === 0 ? 'No Remaining Tasks' : `Remaining Tasks ${todaysTasks.length}`}
                                        </div>
                                        </div>
                                    );
                                })()}

                                {/* Scrollable Tasks List */}
                                <div className='flex flex-col flex-1 overflow-y-auto px-6'>
                                    {(() => {
                                        const today = new Date();
                                        const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                        const todaysTasks = tasks.filter((t) => (t.date || t.dueDate || '').split('T')[0] === todayDate);

                                        if (todaysTasks.length === 0) {
                                            return <div className='text-sm text-gray-400 py-4 text-center'>No tasks for today.</div>;
                                        }

                                        return todaysTasks.map((task) => (
                                            <div key={task.id} className='flex items-center text-black justify-between py-2 border-b border-gray-200 last:border-none'>
                                                <div className='flex items-center gap-2.5 min-w-0'>
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setTasks((prev) =>
                                                                prev.map((t) => {
                                                                    if (t.id !== task.id) return t;
                                                                    const nowCompleted = !t.completed;
                                                                    return {
                                                                        ...t,
                                                                        completed: nowCompleted,
                                                                        completedAt: nowCompleted ? new Date().toISOString() : null,
                                                                    };
                                                                })
                                                            );
                                                        }}
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                            task.completed ? 'bg-lime-500 text-white shadow-sm' : 'border-2 border-gray-300 hover:border-lime-400 bg-white'
                                                        }`}
                                                    >
                                                        {task.completed && <span className='text-[10px] font-bold'>✓</span>}
                                                    </button>
                                                    <span className='text-sm font-semibold truncate'>{task.title}</span>
                                                </div>

                                                <span className={`text-xs font-semibold shrink-0 text-center py-0.5 px-2 rounded-lg ${task.completed ? 'text-[#3d6924] bg-lime-200' : 'text-[#d16341] bg-pink-200'}`}>
                                                    {task.completed ? 'Done' : 'Pending'}
                                                </span>
                                            </div>
                                        ));
                                    })()}
                                </div>

                                {/* Pinned Bottom Link */}
                                <div
                                    type='button' 
                                    className='h-8 border-t border-gray-200 text-xs font-mono pt-2 pl-4 text-lime-500'
                                >
                                    View All Tasks →
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' h-[34%] pt-2'>
                        <div className='flex flex-row h-full pl-4'>
                            <div className='w-[36%] '>
                                <div className='flex flex-col border border-[#EDE8E0] shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d bg-[#f6eee4] rounded-2xl m-1 ml-3 mr-3 h-53 overflow-hidden'>
                                <div className='h-8 w-full justify-between flex flex-row items-center pl-5 pr-4 border-b border-[#F2ECE1]'>
                                    <div className='font-mono text-black text-base flex items-center'>FOCUS HEATMAP</div>
                                    <div className='font-mono text-black text-xs items-center flex'>THIS YEAR</div>
                                </div>

                               <div className='flex flex-1 items-center justify-center p-2
                                    [&_svg_g:not(:nth-last-child(-n+9))]:hidden
                                    [&_.react-calendar-heatmap-week:not(:nth-last-child(-n+9))]:hidden'
                                >
                                    <HeatMap tasks={tasks} project={project} habit={habit} />
                                </div>

                            </div>
                            </div>
                            <div className='w-[26%] '>
                                <div className='flex-col flex border border-[#EDE8E0] bg-[#f6eee4]  shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d rounded-2xl m-1 ml-3 mr-3 h-53 overflow-hidden'>
                                    <div className='h-8 w-full justify-between flex flex-row'>
                                        <div className=' font-mono text-black text-base flex items-center border-b border-gray-300 w-full'><span className='pl-5'>UPCOMING</span></div>
                                    </div>
                                    <div className='flex flex-col h-38 pl-4 pr-4 overflow-y-auto'>
                                        {(() => {
                                            const today = new Date()
                                            today.setHours(0, 0, 0, 0)
                                            
                                            const endOfWeek = new Date(today)
                                            // Sunday boundary fix: ensures Sunday (0) ends on the current day, not next week
                                            const currentDay = today.getDay()
                                            const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay
                                            endOfWeek.setDate(today.getDate() + daysUntilSunday)
                                            endOfWeek.setHours(23, 59, 59, 999)

                                            const upcomingTasks = (tasks || [])
                                            .filter((t) => !t.completed)
                                            .filter((t) => {
                                                const d = t.date || t.dueDate
                                                if (!d) return false
                                                const taskDate = new Date(d)
                                                return taskDate >= today && taskDate <= endOfWeek
                                            })
                                            .map((t) => ({
                                                id: `task-${t.id}`,
                                                title: t.title,
                                                date: t.date || t.dueDate,
                                                type: 'Task',
                                            }))

                                            const upcomingProjects = (project || [])
                                            .filter((p) => {
                                                if (!p.targetDate) return false
                                                const pDate = new Date(p.targetDate)
                                                return pDate >= today && pDate <= endOfWeek
                                            })
                                            .map((p) => ({
                                                id: `project-${p.id}`,
                                                title: p.projectName,
                                                date: p.targetDate,
                                                type: 'Project',
                                            }))

                                            const combined = [...upcomingTasks, ...upcomingProjects].sort(
                                            (a, b) => new Date(a.date) - new Date(b.date)
                                            )

                                            if (combined.length === 0) {
                                            return <div className='text-sm text-gray-400 py-4 text-center'>Nothing upcoming this week.</div>
                                            }

                                            const TaskDoodle = () => (
                                            <div className='w-8 h-8 rounded-lg bg-[#EBF3E5] flex items-center justify-center shrink-0'>
                                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#4D6B3C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            )

                                            const ProjectDoodle = () => (
                                            <div className='w-8 h-8 rounded-lg bg-[#F7F1E0] flex items-center justify-center shrink-0'>
                                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#8C6D3F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                                                </svg>
                                            </div>
                                            )

                                            return combined.map((item) => (
                                            <div key={item.id} className='flex items-center justify-between py-2 border-b border-[#F7F4EE] last:border-none'>
                                                <div className='flex items-center gap-2.5 min-w-0 pr-2'>
                                                {item.type === 'Task' ? <TaskDoodle /> : <ProjectDoodle />}
                                                <div className='flex flex-col min-w-0'>
                                                    <span className='text-sm text-black truncate font-medium'>{item.title}</span>
                                                    <span className='text-[10px] text-gray-400'>{item.type}</span>
                                                </div>
                                                </div>
                                                <span className='text-xs font-semibold text-[#d16341] bg-pink-200 w-12 rounded-lg pl-2 shrink-0'>
                                                {new Date(item.date).toLocaleDateString('default', { weekday: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            ))
                                        })()}
                                        </div>

                                    <div
                                    type='button' 
                                    className='h-6 border-t border-gray-200 text-xs font-mono pt-1 pl-4 text-lime-500'
                                >
                                    View All Tasks →
                                </div>
                                </div>
                            </div>
                            <div className='w-[37%]'>
                                <div className='flex flex-col border border-[#EDE8E0] rounded-2xl m-1 ml-3 mr-4 h-53 overflow-hidden shadow-[0_2px_5px_0.5px_rgba(0,0,0,0.4)] transform-3d bg-[#f6eee4]'>
                                    <div className='h-8 w-full justify-between flex flex-row pl-5'>
                                        <div className=' font-mono text-black text-base flex items-center'>PRODUCTIVITY OVERVIEW</div>
                                        <div className='font-mono text-black text-xs items-center flex pr-4'>THIS WEEK</div>
                                    </div>
                                    <div className='flex flex-col pl-4'>
                                        {(() => {
                                            const today = new Date()
                                            today.setHours(0, 0, 0, 0)
                                            const startOfWeek = new Date(today)
                                            startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
                                            if (today.getDay() === 0) startOfWeek.setDate(startOfWeek.getDate() - 7)

                                            const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                            const toLocalStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

                                            const weekData = weekDayLabels.map((label, i) => {
                                            const d = new Date(startOfWeek)
                                            d.setDate(startOfWeek.getDate() + i)
                                            const dateStr = toLocalStr(d)

                                            let slots = 0
                                            let done = 0

                                            habit.forEach((h) => {
                                                const dayNum = d.getDay()
                                                if (h.activeDays?.includes(dayNum)) {
                                                slots++
                                                if (h.history?.[dateStr]?.completed) done++
                                                }
                                            })

                                            tasks.forEach((t) => {
                                                const taskDate = (t.date || t.dueDate || '').split('T')[0]
                                                if (taskDate === dateStr) {
                                                slots++
                                                if (t.completed) done++
                                                }
                                            })

                                            const pct = slots > 0 ? Math.round((done / slots) * 100) : 0
                                            return { label, pct, isToday: dateStr === toLocalStr(today) }
                                            })

                                            const tasksDoneThisWeek = tasks.filter((t) => {
                                            if (!t.completed || !t.completedAt) return false
                                            const d = new Date(t.completedAt)
                                            return d >= startOfWeek
                                            }).length

                                            const bestStreak = habit.length > 0 ? Math.max(...habit.map((h) => h.currentStreak || 0), 0) : 0

                                            return (
                                            <>
                                                <div className='flex items-end gap-3 h-28 mb-1'>
                                                    {/* Y-axis labels */}
                                                    <div className='flex flex-col justify-between h-24 text-[9px] font-semibold text-[#90988A] pr-1 select-none shrink-0'>
                                                        <span>100%</span>
                                                        <span>75%</span>
                                                        <span>50%</span>
                                                        <span>25%</span>
                                                        <span>0%</span>
                                                    </div>

                                                    {/* Chart area with gridlines + bars sharing the same coordinate space */}
                                                    <div className='relative flex-1 h-24'>
                                                        {/* Gridlines */}
                                                        {[0, 25, 50, 75, 100].map((pct) => (
                                                        <div
                                                            key={pct}
                                                            className='absolute left-0 right-0 border-t border-dashed border-[#E5DFD2]'
                                                            style={{ bottom: `${pct}%` }}
                                                        />
                                                        ))}

                                                        {/* Bars */}
                                                        <div className='absolute inset-0 flex items-end justify-between gap-2 px-1'>
                                                        {weekData.map((d) => (
                                                            <div key={d.label} className='flex flex-col items-center flex-1 h-full justify-end'>
                                                            <div
                                                                className={`w-2.5 rounded-full transition-all ${d.isToday ? 'bg-[#41dc03]' : 'bg-[#52c723]'}`}
                                                                style={{ height: `${Math.max(d.pct, 4)}%` }}
                                                            />
                                                            </div>
                                                        ))}
                                                        </div>
                                                    </div>
                                                    </div>

                                                    {/* Day labels below chart */}
                                                    <div className='flex gap-3 mb-2'>
                                                    <div className='w-6 shrink-0' /> {/* spacer matching y-axis label width */}
                                                    <div className='flex-1 flex justify-between gap-2 px-1'>
                                                        {weekData.map((d) => (
                                                        <span key={d.label} className='flex-1 text-center text-[9px] text-gray-400 font-medium'>{d.label}</span>
                                                        ))}
                                                    </div>
                                                    </div>

                                                <div className='flex items-center gap-2 pr-2 pb-1'>
                                                    <div className='flex-1 h-10 border border-[#dad085] rounded-2xl flex items-center justify-center gap-2 px-2'>
                                                        <div className='w-6 h-6 rounded-full bg-[#e8f5e9] flex items-center justify-center shrink-0'>
                                                            <CheckCircle2 className='w-4 h-4 text-[#4a7c59]' />
                                                        </div>
                                                        <div className='flex flex-row items-start'>
                                                            <span className='text-sm pl-2 font-bold text-[#143022] leading-tight'>{tasksDoneThisWeek}</span>
                                                            <span className='text-sm pl-1 text-gray-500 leading-tight'>Tasks Done</span>
                                                        </div>
                                                    </div>
                                                    <div className='flex-1 h-10 border border-[#dad085] rounded-2xl flex items-center justify-center gap-2 px-2'>
                                                        <div className='w-6 h-6 rounded-full bg-[#fdecea] flex items-center justify-center shrink-0'>
                                                            <Flame className='w-4 h-4 text-[#e07a5f]' />
                                                        </div>
                                                        <div className='flex flex-row items-start'>
                                                            <span className='text-sm pl-2 font-bold text-[#143022] leading-tight'>{bestStreak}</span>
                                                            <span className='text-sm pl-1 text-gray-500 leading-tight'>Streak</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            )
                                        })()}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
