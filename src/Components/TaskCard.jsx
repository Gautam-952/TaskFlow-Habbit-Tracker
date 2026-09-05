import React from 'react'
import { getUniversalDoodle } from '../Components/ProjectCard'

function TaskCard( {task , toogleComplete , deleteTask , editTask , project = []} ) {

    const getDateInfo = (date) => {
        const taskDate = new Date(date)
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)

        const isSameDay = (d1, d2) =>
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()

        if (isSameDay(taskDate, today)) return { label: "Due Today", color: "text-red-500 text-xs font-bold" }
        if (isSameDay(taskDate, tomorrow)) return { label: "Due Tomorrow", color: "text-orange-400 text-xs font-semibold" }

        return {
            label: taskDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            color: "" // no color, keep default
        }
    }

    const getProjectDoodle = (projectName) => {
        const matchedProject = project.find(p => p.projectName === projectName)
        const identifier = matchedProject?.id || projectName
        return getUniversalDoodle(identifier)
    }

    return (
        <div className='border h-25 mb-2 rounded-xl bg-white border-[#dad085]'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row'>
                    <div 
                        onClick={() => {
                            toogleComplete(task.id)
                        }}
                        className={`w-8 h-8 mt-4 border items-center flex justify-center rounded-xl ml-6 mr-4 cursor-pointer transition-colors duration-150 ${
                            task.completed 
                                ? 'bg-[#76C457] border-[#dad085] font-bold text-white' 
                                : 'bg-white border-gray-400'
                        }`} 
                    >
                        {task.completed ? "✓" : ""}
                    </div>
                        <div className='flex flex-col'>
                            <div className='text-[21px] font-bold font-mono mt-4'>{task.title}</div>
                            <div className='text-gray-600 font-serif text-sm'>{task.summary ?.length > 60
                                ? task.summary.slice(0,60) + "" 
                                : task.summary}</div>
                            <div className=' h-6 flex text-gray-500 ml-2 text-xs'>{task.tag && task.tag.split(" ").map( (tag,index) => (
                                <span key={index} className='text-xs mt-1 mr-2'>#{tag}</span>
                            )) 
                            }</div>
                        </div>
                        </div>
                            <div className='flex flex-row'>
                                <div className={`w-12 h-8 mt-7 font-serif border items-center flex justify-center rounded-lg ml-2 text-xs mr-16 ${
                                    task.priority === 'Urgent' ? 'bg-red-100/80 border-red-300 text-red-500 font-bold' :
                                    task.priority === 'High' ? 'bg-orange-100/80 border-orange-300 text-orange-500 font-bold' :
                                    task.priority === 'Medium' ? 'bg-yellow-100/80 border-yellow-300 text-yellow-500 font-bold' :
                                    task.priority === 'Low' ? 'bg-green-100/80 border-green-300 text-green-500 font-bold' :
                                    'bg-gray-100/80 border-gray-300 text-gray-500 font-bold'
                                }`}>
                                    {task.priority || "None"}
                                </div>
                                <div className='w-27 h-12 mt-6 items-center font-serif flex justify-center ml-2 text-xs mr-16 text-center'>
                                {task.date ? (
                                    (() => {
                                        const { label, color } = getDateInfo(task.date)
                                        return (
                                            <span>
                                                <span className='text-black font-serif'>📆︎</span> <span className={color}>{label}</span>
                                                <br />
                                                <span className='text-black'>
                                                    {task.completed 
                                                        ? "Completed" 
                                                        : new Date(task.date).toLocaleTimeString("en-US",{
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })
                                                    }
                                                </span>
                                            </span>
                                        )
                                    })()
                                ) : (
                                    "None"
                                )}
                            </div>
                                {(() => {
                                    const doodle = getProjectDoodle(task.project)
                                    return (
                                        <div 
                                            className='w-24 h-8 bg-gray-200/20 mt-7 ml-2 mr-16 flex items-center gap-1.5 rounded-lg px-2 shrink-0'
                                        >
                                            <div 
                                                style={{
                                                    backgroundColor: doodle.bg,
                                                    border: `1.5px solid ${doodle.stroke}25`,
                                                }}
                                                className='w-5 h-5 rounded-md flex items-center justify-center shrink-0'
                                            >
                                                {doodle.svg(doodle.stroke)}
                                            </div>
                                            <span className='text-green-600 font-bold font-serif text-xs truncate'>
                                                {task.project || "None"}
                                            </span>
                                        </div>
                                    )
                                })()}
                        <div className='w-12 h-10 mt-7 items-center flex justify-center ml-2 text-xs mr-8'>
                        <select 
                            value=""
                            className='w-full pl-4 pr-2 appearance-none font-light bg-transparent outline-none cursor-pointer text-center text-base'
                            onChange={ (e) => {
                                if (e.target.value === "delete"){
                                    deleteTask(task.id)
                                }
                                else {
                                    editTask(task)
                                }
                            }}
                        >
                            <option value="" disabled>•••</option>
                            <option value="edit">Edit</option>
                            <option value="delete">Delete</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskCard
