import React, { useState } from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import { Focus } from '../Components/index'

function Sidebar() {

    const [isOpen , setIsOpen] = useState(false)

    const data = [{name: "Home", location: "/home", icon: "🏠︎"},{name: "Task", location: "/task", icon: "🗹"},{name: "Projects", location: "/projects", icon: "🗀"},{name: "Calendar", location: "/calendar", icon: "📆︎"},{name: "Habits", location: "/habits", icon: "◎"},{name: "Analytics", location: "/analytics", icon: "📈︎"},{name: "Notes", location: "/notes", icon: "🗏︎"},{name : "Settings", location: "/settings", icon: "⛭"}]

    const currpath = useLocation()
    const navigate = useNavigate()

    return (
        <div>
            <div 
            className='h-screen w-64 bg-linear-to-br from-[#0f3739] to-[#051e1c] flex flex-col overflow-y-auto '>

                <div className='flex flex-row py-4 px-4'>
                    <div> <img src="./logo/logo.png" className='w-15 h-14 color' /></div>
                    <div className='max-w-md text-white text-2xl font-bold font-serif px-2'>Task Flow
                        <div className='text-amber-200 font-serif  font-normal text-sm '>Focus. Plan. Flow.</div>
                    </div>
                </div>
            
                <div className='flex flex-col gap-3 px-4' >
                        {data.map( (item) => {
                                return (<div
                                className={ item.location == currpath.pathname ? 'text-amber-50 text-lg flex items-center pl-6 cursor-pointer transition-all duration-300 rounded-2xl shadow-md shadow-lime-400/30 hover:scale-[1.02] border border-lime-300 translate-x-1 bg-lime-700 py-2 ' : 'text-amber-50 text-lg flex items-center pl-6 py-2 cursor-pointer hover:bg-lime-700 transition-colors duration-300 rounded-2xl hover:scale-[1.02] hover:border hover:border-lime-300  '}
                                onClick= {() => {
                                    navigate(item.location)
                                }}
                                >
                                    <span 
                                        className='text-amber-200 mr-4'>{item.icon}
                                    </span>
                                    {item.name}
                                    </div>)
                            
                        })}
                </div>

                <div className='relative flex flex-col self-center px-4 border border-white/5 bg-linear-to-br from-[#0f3739] to-[#072724] w-[90%] py-4 mt-3 rounded-2xl'>
                    <img src="./logo/logo.png" className='absolute h-16 w-20 opacity-60 bottom-2 pr-1 right-0' alt='lotus' />
                    <div className='text-amber-50 text-lg'>Focus Mode 
                        <div className='max-w-md text-amber-200 text-sm'>Eliminate Distraction and get things done.</div>
                        <button 
                        onClick={() => setIsOpen(true)}
                        className='text-white border-[#dad085] border bg-lime-700 mt-3 rounded-2xl h-12 hover:bg-lime-600 transition-all duration-150 shadow-md shadow-lime-400/30 hover:scale-[1.02] w-32'> ▷  Start Focus</button>
                        {isOpen && <Focus onClose={() => setIsOpen(false)} />}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar
