import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react'
import { useUserName } from './useUserName'

const DAY_MS = 24 * 60 * 60 * 1000

function getInitials(name) {
    if (!name || !name.trim()) return '?'
    const parts = name.trim().split(/\s+/)
    const first = parts[0]?.[0] || ''
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
    return (first + last).toUpperCase()
}

function Navbar({
    title,
    para,
    tasks = [],
    project = [],
    habit = [],
    searchScope = 'all',
    searchPlaceholder = 'Search tasks, projects...',
    onSelectResult,
    onOpenSettings,
    showSearch = true,
}) {
    const [query, setQuery] = useState('')
    const [dark, setDark] = useState(false)
    const [openMenu, setOpenMenu] = useState(null) // 'notif' | 'profile' | 'search' | null
    const menuAreaRef = useRef(null)

    // Read the saved display name, same key Settings.jsx writes to
   const userName = useUserName()

    // Stores { [notifId]: readAtTimestamp }
    const [readMap, setReadMap] = useState(() => {
        const saved = localStorage.getItem('app_notif_read')
        return saved ? JSON.parse(saved) : {}
    })

    useEffect(() => {
        localStorage.setItem('app_notif_read', JSON.stringify(readMap))
    }, [readMap])

    // Prune entries older than 24h so localStorage doesn't grow forever
    useEffect(() => {
        const now = Date.now()
        setReadMap(prev => {
            const cleaned = Object.fromEntries(
                Object.entries(prev).filter(([, readAt]) => now - readAt < DAY_MS)
            )
            return Object.keys(cleaned).length === Object.keys(prev).length ? prev : cleaned
        })
    }, [])

    // Close any open menu when the user clicks anywhere outside the
    // search/bell/profile area.
    useEffect(() => {
        if (!openMenu) return

        function handleClickOutside(e) {
            if (menuAreaRef.current && !menuAreaRef.current.contains(e.target)) {
                setOpenMenu(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openMenu])

    // Tasks due today or overdue, not completed
    const dueTasks = useMemo(() => {
        const today = new Date().toDateString()
        return tasks
            .filter(t => {
                if (t.completed) return false
                if (!t.date) return false
                const due = new Date(t.date)
                return due.toDateString() === today
            })
            .map(t => ({ id: `task-${t.id}`, label: t.title, due: t.date, type: 'Task' }))
    }, [tasks])

    // Projects due today or overdue, not completed
    const dueProjects = useMemo(() => {
        const today = new Date().toDateString()
        return project
            .filter(p => {
                if (p.completed) return false
                if (!p.targetDate) return false
                const due = new Date(p.targetDate)
                return due.toDateString() === today
            })
            .map(p => ({ id: `project-${p.id}`, label: p.projectName, due: p.targetDate, type: 'Project' }))
    }, [project])

    const dueSoon = useMemo(() => [...dueTasks, ...dueProjects], [dueTasks, dueProjects])

    const now = Date.now()

    // Visible unless dismissed more than 24h ago
    const visibleNotifs = dueSoon.filter(item => {
        const readAt = readMap[item.id]
        if (!readAt) return true
        return now - readAt < DAY_MS
    })

    const unreadCount = visibleNotifs.filter(item => !readMap[item.id]).length

    const toggleMenu = (name) => {
        setOpenMenu(prev => (prev === name ? null : name))
        if (name === 'notif') {
            const stamp = Date.now()
            setReadMap(prev => {
                const next = { ...prev }
                dueSoon.forEach(item => {
                    if (!next[item.id]) next[item.id] = stamp
                })
                return next
            })
        }
    }

    const searchResults = useMemo(() => {
        if (!query.trim()) return { matchedTasks: [], matchedProjects: [], matchedHabits: [] }
        const q = query.toLowerCase()
        return {
            matchedTasks: (searchScope === 'all' || searchScope === 'tasks')
                ? tasks.filter(t => t.title?.toLowerCase().includes(q))
                : [],
            matchedProjects: (searchScope === 'all' || searchScope === 'projects')
                ? project.filter(p => p.projectName?.toLowerCase().includes(q))
                : [],
            matchedHabits: (searchScope === 'all' || searchScope === 'habits')
                ? habit.filter(h => h.habitName?.toLowerCase().includes(q))
                : [],
        }
    }, [query, tasks, project, habit, searchScope])

    const hasQuery = query.trim().length > 0
    const noResults =
        hasQuery &&
        searchResults.matchedTasks.length === 0 &&
        searchResults.matchedProjects.length === 0 &&
        searchResults.matchedHabits.length === 0

    return (
        <div className='flex gap-6 bg-[#FAF6ED] h-18 pl-6 w-full relative'>
            <div className='flex flex-row justify-between items-center w-full'>
                <div className='pl-3 flex flex-col'>
                    <h1 className='text-3xl font-serif font-medium mt-1'>{title}</h1>
                    <p className='text-black font-serif text-lg mb-2'>{para}</p>
                </div>

                <div ref={menuAreaRef} className='flex flex-row pt-4 pr-4 gap-6 mb-4 items-center'>

                    {/* Search */}
                    {showSearch && (
                        <div className='relative'>
                            <div className='w-70 h-10 rounded-4xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center px-4 gap-2'>
                                <Search size={16} className='text-[#8a8578] shrink-0' />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setOpenMenu('search')}
                                    placeholder={searchPlaceholder}
                                    className='bg-transparent outline-none text-sm w-full'
                                />
                            </div>

                            {openMenu === 'search' && hasQuery && (
                                <div className='absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-lg p-2 z-20 max-h-80 overflow-y-auto'>
                                    {noResults && <p className='text-sm p-2 text-[#8a8578]'>No matches for "{query}"</p>}

                                    {searchResults.matchedTasks.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => {
                                                onSelectResult?.('task', t)
                                                setQuery('')
                                                setOpenMenu(null)
                                            }}
                                            className='p-2 rounded-lg hover:bg-[#FAF6ED] cursor-pointer text-sm'
                                        >
                                            {t.title}
                                        </div>
                                    ))}

                                    {searchResults.matchedProjects.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                onSelectResult?.('project', p)
                                                setQuery('')
                                                setOpenMenu(null)
                                            }}
                                            className='p-2 rounded-lg hover:bg-[#FAF6ED] cursor-pointer text-sm'
                                        >
                                            {p.projectName}
                                        </div>
                                    ))}

                                    {searchResults.matchedHabits.length > 0 && (
                                        <div>
                                            <p className='text-xs font-semibold text-[#8a8578] px-2 pt-1'>Habits</p>
                                            {searchResults.matchedHabits.map(h => (
                                                <div
                                                    key={h.habitId}
                                                    onClick={() => {
                                                        onSelectResult?.('habit', h)
                                                        setQuery('')
                                                        setOpenMenu(null)
                                                    }}
                                                    className='p-2 rounded-lg hover:bg-[#FAF6ED] cursor-pointer text-sm'
                                                >
                                                    {h.habitName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bell */}
                    <div className='relative'>
                        <button
                            onClick={() => toggleMenu('notif')}
                            className='w-10 h-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center relative'
                        >
                            <Bell size={17} />
                            {unreadCount > 0 && (
                                <span className='absolute -top-1 -right-1 bg-[#d9704f] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center'>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {openMenu === 'notif' && (
                            <div className='absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-lg p-2 z-20'>
                                {visibleNotifs.length === 0 ? (
                                    <p className='text-sm p-2 text-[#8a8578]'>Nothing due — you're clear.</p>
                                ) : (
                                    visibleNotifs.map(item => (
                                        <div key={item.id} className='p-2 rounded-lg hover:bg-[#FAF6ED] cursor-pointer'>
                                            <p className='text-sm font-medium'>{item.label}</p>
                                            <p className='text-xs text-[#8a8578]'>
                                                {item.type} · Due {new Date(item.due).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Dark mode */}
                    <button
                        onClick={() => setDark(!dark)}
                        className='w-10 h-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center'
                    >
                        {dark ? <Moon size={17} /> : <Sun size={17} />}
                    </button>

                    {/* Profile */}
                    <div className='relative'>
                        <button
                            onClick={() => toggleMenu('profile')}
                            className='w-50 h-10 rounded-4xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center gap-2 pl-1.5 pr-3'
                        >
                            <div className='w-7 h-7 rounded-full bg-[#6b8f5f] text-white text-xs font-semibold flex items-center justify-center'>
                                {getInitials(userName)}
                            </div>
                            <span className='text-sm font-medium truncate'>{userName}</span>
                            <ChevronDown size={14} className='ml-auto text-[#8a8578]' />
                        </button>
                        {openMenu === 'profile' && (
                            <div className='absolute right-0 top-12 w-40 bg-white rounded-2xl shadow-lg p-2 z-20'>
                                <div
                                    onClick={() => {
                                        onOpenSettings?.()
                                        setOpenMenu(null)
                                    }}
                                    className='p-2 text-sm hover:bg-[#FAF6ED] rounded-lg cursor-pointer'
                                >
                                    Settings
                                </div>
                                <div className='p-2 text-sm hover:bg-[#FAF6ED] rounded-lg cursor-pointer'>Sign out</div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar