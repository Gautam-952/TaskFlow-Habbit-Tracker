import React, { useState , useEffect } from 'react'
import { Sidebar } from '../Components/index'

function FlipUnit({ value, prevValue }) {
    return (
        <div className='flip-unit shadow-md'>
            <div className='flip-face top'><span>{value}</span></div>
            <div className='flip-face bottom'><span>{value}</span></div>

            {prevValue !== value && (
                <>
                    <div key={`top-${value}`} className='flip-flap fold-down'>
                        <span>{prevValue}</span>
                    </div>
                    <div key={`bottom-${value}`} className='flip-flap fold-up'>
                        <span>{value}</span>
                    </div>
                </>
            )}
        </div>
    )
}

function Calendar( {tasks = [] , project = []}) {

    const [currentDate , setCurrentDate] = useState(new Date())
    const [selectedDateStr , setSelectedDateStr] =useState(new Date().toISOString().split("T")[0])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const nextMonth = () => setCurrentDate(new Date(year , month + 1 , 1))
    const prevMonth = () => setCurrentDate(new Date(year , month - 1 , 1))
    const firstDayIndex = new Date(year , month , 1).getDay()
    const dayInMonth = new Date(year , month + 1 , 0).getDate()
    const totalCells = firstDayIndex + dayInMonth
    const remainingEmptyCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    const monthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const weekDays = [ "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const selectedDayTasks = tasks.filter(t => {
        const taskDate = t.date || t.dueDate || t.targetDate
        return taskDate && String(taskDate).startsWith(selectedDateStr)
    })
    const selectedDayProjects = project.filter( p => p.targetDate && p.targetDate.startsWith(selectedDateStr) )
    const [now, setNow] = useState(new Date())
    const [prevTime, setPrevTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setPrevTime(now)
            setNow(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [now])

    const pad = (n) => String(n).padStart(2, '0')
    const hh = pad(now.getHours() % 12 || 12)
    const mm = pad(now.getMinutes())
    const ss = pad(now.getSeconds())
    const prevHh = pad(prevTime.getHours() % 12 || 12)
    const prevMm = pad(prevTime.getMinutes())
    const prevSs = pad(prevTime.getSeconds())

    return (
            <div className='h-screen flex bg-[#FAF6ED] '> 
            <style>{`
                .flip-unit {
                    position: relative;
                    width: 46px;
                    height: 64px;
                    perspective: 300px;
                    font-family: serif;
                }
                .flip-face {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    overflow: hidden;
                    background: #E8DCB8;
                    border: 1px solid #D8CA9F;
                    color: #5b4636;
                }
                .flip-face span {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 64px;
                    line-height: 64px;
                    font-size: 2rem;
                    text-align: center;
                    font-weight: 600;
                }
                .flip-face.top { top: 0; border-radius: 6px 6px 0 0; }
                .flip-face.top span { top: 0; }
                .flip-face.bottom { bottom: 0; border-radius: 0 0 6px 6px; }
                .flip-face.bottom span { top: -32px; }
                .flip-flap {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 50%;
                    overflow: hidden;
                    background: #E8DCB8;
                    border: 1px solid #D8CA9F;
                    color: #5b4636;
                    backface-visibility: hidden;
                    z-index: 2;
                }
                .flip-flap.fold-down {
                    top: 0;
                    border-radius: 6px 6px 0 0;
                    transform-origin: bottom;
                    animation: foldDown 0.45s ease-in forwards;
                }
                .flip-flap.fold-down span {
                    top: 0; height: 64px; line-height: 64px; font-size: 2rem;
                    text-align: center; position: absolute; width: 100%; font-weight: 600;
                }
                .flip-flap.fold-up {
                    bottom: 0;
                    border-radius: 0 0 6px 6px;
                    transform-origin: top;
                    transform: rotateX(90deg);
                    animation: foldUp 0.45s ease-out 0.45s forwards;
                }
                .flip-flap.fold-up span {
                    top: -32px; height: 64px; line-height: 64px; font-size: 2rem;
                    text-align: center; position: absolute; width: 100%; font-weight: 600;
                }
                @keyframes foldDown {
                    0%   { transform: rotateX(0deg); }
                    100% { transform: rotateX(-90deg); }
                }
                @keyframes foldUp {
                    0%   { transform: rotateX(90deg); }
                    100% { transform: rotateX(0deg); }
                }
            `}</style>
                <Sidebar />
                <div className='flex flex-col w-full'>

                    {/* Header (replaces old Navbar) */}
                    <header className="flex items-center justify-between ml-2 pl-6">
                    <div>
                        <h1 className="text-3xl font-serif font-medium mt-1">Calendar</h1>
                        <p className="text-black font-serif text-lg mb-2">Manage all your Dates at one place.</p>
                    </div>
                    </header>

                    {/* Main Content start from here. */}
                    <div className='flex flex-1 flex-row border border-b-0 border-l-0 border-r-0 border-[#c5a051]'>
                        <div className=' w-7/2 bg-[#FAF6ED] '>
                            <div className='flex w-full h-20'> 
                                <div className='flex justify-between w-full'>
                                    <div className='flex flex-col'>
                                        <div className='text-[#9E702D] font-bold ml-6 mt-1 text-2xl font-serif'>{monthName[month]} {year}</div>
                                        <div className='flex'>
                                            <button
                                            onClick={prevMonth}
                                            className="border text-white hover:scale-[1.04] font-bold text-sm font-serif h-8 rounded-xl w-18 ml-6 mr-1 mt-1 cursor-pointer shadow-md transition-all duration-150 active:scale-95"
                                            style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                                            }}
                                            >
                                            <span>← Prev</span>
                                        </button>
                                            <button
                                            onClick={nextMonth}
                                            className='border text-white hover:scale-[1.04] font-bold text-sm font-serif h-8 rounded-xl w-18 ml-2 mr-1 mt-1 cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                            style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                                            }}>Next →</button>
                                            <div 
                                            onClick={ () => {
                                                const today = new Date()
                                                setCurrentDate(today)
                                                setSelectedDateStr(today.toISOString().split("T")[0])
                                            }}
                                            className='border text-white hover:scale-[1.04] font-bold text-sm font-serif items-center flex h-8 rounded-xl w-16 justify-center ml-2 mt-1 cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                            style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                                            }}>Today</div> 
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <select 
                                            value={year}
                                            onChange={(e) => setCurrentDate(new Date(Number(e.target.value), month, 1))}
                                            className='text-lg text-white hover:scale-[1.04] font-bold font-serif mr-4 border mt-5 h-12 w-20 pl-2 pr-2 flex items-center justify-center rounded-xl cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                            style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                                            }}
                                        >
                                            {Array.from({ length: 11 }, (_, i) => year - 5 + i).map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>

                                        <select 
                                            value={month}
                                            onChange={(e) => setCurrentDate(new Date(year, Number(e.target.value), 1))}
                                            className='text-lg hover:scale-[1.04] text-white font-bold font-serif mr-4 border h-12 w-32 pl-2 mt-5 flex items-center justify-center rounded-xl cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                            style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                                            }}
                                        >
                                            {monthName.map((name, index) => (
                                                <option key={name} value={index}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>   
                            </div>
                            <div className='grid grid-cols-7 ml-6 mr-6 mb-2 mt-1 text-center  '>
                                {weekDays.map((day) => (
                                    <span key={day} className='text-base font-serif font-lg'>
                                        {day}
                                    </span>
                                ))}
                            </div>
                            <div className='ml-6 mr-6 rounded-xl overflow-hidden mb-2 h-131 bg-[#F2E9D0]/30 border-[#c5a051] border '>
                                <div className='h-full grid grid-cols-7 auto-rows-fr'>

                                    {Array.from({ length: firstDayIndex }).map((_, index) => {
                                        const day = prevMonthLastDay - firstDayIndex + index + 1
                                        return (
                                            <div key={`prev-${index}`} className='border border-[#c5a051] p-2 font-serif font-bold bg-[#76C457]/30'>
                                                <span>{day}</span>
                                            </div>
                                        )
                                    })}

                                    {Array.from({ length: dayInMonth }).map((_, index) => {
                                        const dayNum = index + 1
                                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
                                        return (
                                            <div 
                                                key={dateKey} 
                                                onClick={() => setSelectedDateStr(dateKey)}
                                                className={`border font-serif font-bold border-[#c5a051] p-2 flex flex-col justify-between cursor-pointer shadow-md transition-all duration-50 active:scale-95 ${
                                                    selectedDateStr === dateKey ? 'bg-[#654520]/80 border border-[#c5a051] border-solid shadow-md font-bold text-[#FAF6ED] text-[21px] ' : ''
                                                }`}
                                            >
                                                <span>{dayNum}</span>
                                            </div>
                                        )
                                    })}

                                    {Array.from({ length: remainingEmptyCells }).map((_, index) => (
                                        <div key={`next-${index}`} className='border font-serif font-bold border-[#c5a051] p-2 bg-[#76C457]/30'>
                                            <span>{index + 1}</span>
                                        </div>
                                    ))}
                                    
                                </div>

                            </div>
                        </div>
                        <div className='border-l border-[#dad085] w-full'>
                            <div className='flex flex-col'> 
                                <div className='mt-7 ml-2 mr-1  text-xl font-serif border-2 rounded-lg pt-2 pb-2 pl-1 pr-1'
                                style={{
                                    backgroundColor: '#8C7B4E',
                                    color: '#FAF6ED',
                                    boxShadow:
                                        'inset 0 2px 3px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                                    border: '1px solid #6f6038',
                                }}>
                                    <span>Day Summmary : </span>
                                    <span>{selectedDateStr}</span>
                                </div>
                                <div
                                style={{
                                    backgroundColor: '#F2E9D0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    border: '1.5px solid #B8A56D',
                                }}
                                className='border ml-5  border-[#dad085]  mr-5 mt-7 h-min-30 pb-8 pl-4 font-serif w-62 flex pt-2 rounded-lg text-lg flex-col'>Target Project : 
                                    <div>{selectedDayProjects.length === 0 ? (
                                        <p className='text-sm italic mt-2 mb-2'>No Projects Scheduled</p>
                                    ) : (
                                        <ul className='list-disc list-inside space-y-1'>
                                            {selectedDayProjects.map( (p , idx) => (
                                            <li className='mb-2 mt-2 text-sm italic' key={p.id || idx}>
                                                <span className='font-medium'>{p.projectName}</span> » <span className='text-xs uppercase'>{p.status}</span>
                                            </li>
                                            ))}  
                                        </ul>
                                    )}</div>
                                </div>
                                <div
                                style={{
                                    backgroundColor: '#F2E9D0',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    border: '1.5px solid #B8A56D',
                                }}
                                className='border ml-5 mr-5 mt-7 h-min-30 pb-9 border-[#dad085] pl-4 font-serif w-62 flex pt-2 rounded-lg text-lg flex-col'>Target Task : 
                                    <div>{selectedDayTasks.length === 0 ? (
                                        <p className='text-sm italic mt-2 mb-2'>No Tasks Scheduled</p>
                                    ) : (
                                        <ul className='list-disc list-inside space-y-1'>
                                            <ul className='list-disc list-inside space-y-1'>
                                                {selectedDayTasks.map((t, idx) => (
                                                    <li className='mb-2 mt-2 text-sm italic' key={t.id || idx}>
                                                        <span className='font-medium'>{t.title || 'Untitled Task'}</span>
                                                        {t.project && <> » <span className='text-xs uppercase'>{t.project}</span></>}
                                                        {t.priority && <> ┃ <span className='text-xs uppercase'>{t.priority}</span></>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </ul>
                                    )}</div>
                                </div>
                                <div
                                    style={{
                                        backgroundColor: '#F2E9D0',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                        border: '1.5px solid #B8A56D',
                                    }}
                                    className='border ml-5 mr-5 mt-7 mb-7 pb-6 border-[#dad085] pl-4 pr-4 font-serif w-62 flex pt-2 rounded-lg text-lg flex-col items-center'
                                >
                                    <span className='self-start pt-2 pb-1'>The Hourglass :</span>
                                    <div className='flex items-center gap-2 mt-3'>
                                        <FlipUnit value={hh} prevValue={prevHh} />
                                        <span className='text-2xl font-serif'>:</span>
                                        <FlipUnit value={mm} prevValue={prevMm} />
                                        <span className='text-2xl font-serif'>:</span>
                                        <FlipUnit value={ss} prevValue={prevSs} />
                                    </div>
                                    <span className='text-xs italic mt-2 pt-2'>
                                        {now.getHours() >= 12 ? 'PM' : 'AM'} · {now.toLocaleDateString('en-US', { weekday: 'long' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Calendar