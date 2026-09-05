import React, {useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function NewTask( {setIsOpen , setTasks , editingTask ,setEditingTask , project=[]} ) {

    const [title , setTitle] = useState("")
    const [summary , setSummary] = useState("")
    const [priority , setPriority] = useState("")
    const [date , setDate] = useState("")
    const [selectedProject , setSelectedProject] = useState("")
    const [tag , setTag] = useState("")

    useEffect( ( ) => {
        if (editingTask) {
            setTitle(editingTask.title)
            setSummary(editingTask.summary)
            setPriority(editingTask.priority)
            setDate(editingTask.date)
            setSelectedProject(editingTask.selectedProject || "")
            setTag(editingTask.tag)
        }
    }, [editingTask])

    const createTask = () => {

        if (!title.trim()){
            alert("Title is required: ")
            return;
        }
       
        if (editingTask) {
            setTasks( prev => prev.map((task) => {
                if ( task.id === editingTask.id) {
                    return {...task,
                        title: title,
                        summary: summary,
                        priority: priority,
                        date: date,
                        project: selectedProject,
                        tag: tag
                    }
                }
                return task
            }))
            setEditingTask(null)
            setIsOpen(false)
            return
        } else {
            setTitle("")
            setSummary("")
            setPriority("")
            setDate("")
            setSelectedProject("")
            setTag("")
        }

        const newTask = {
            id: Date.now(),
            title: title,
            summary: summary,
            priority: priority,
            date: date,
            project: selectedProject,
            tag: tag,
            completed: false,
        }
        setTasks(prev => [...prev,newTask])
        setIsOpen(false)
        return
    }

    return (
        <div className='h-screen w-full bg-[#FAF6ED]/30 backdrop-blur-md inset-0 z-40 fixed '>
            <div className='flex h-full items-center justify-center'>
                <div className='flex h-4/6 w-1/4 bg-linear-to-br from-[#0f3739] to-[#051e1c] border-[#dad085] border-2 rounded-xl overflow-hidden'>
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-col h-25'>
                            <div>
                                <img 
                                className='flex w-10 h-8 mt-2 absolute left-1/2  -translate-x-1/2 '
                                src="./logo/logo.png" alt="lotus2" />
                                <div 
                                className='justify-end flex pr-4 pt-3 cursor-pointer text-white font-bold text-xl'
                                onClick={ () => {
                                    setEditingTask(null)
                                    setIsOpen(false)
                                }}
                                >✗</div>
                            </div>
                            <div className='flex justify-center pt-2 font bold text-white font-serif text-2xl '>New Task</div>
                            
                        </div>
                        <div className='h-full flex w-full flex-col'>
                            <div className=' h-20  w-full '>
                                <div className='text-base text-white ml-5 '>🗎 Title <span className='text-red-500'>*</span></div>
                                <div className='border border-[#dad085] rounded-lg h-10 text-sm items-center flex w-85 mt-1 mr-4 ml-5'>
                                    <input type="text"  
                                    className='pl-2 text-white w-full h-full focus:outline-none'
                                    placeholder='Enter task title....'
                                    value={title}
                                    onChange={ (e) => {
                                        setTitle(e.target.value)
                                    }}
                                    required
                                    ></input>
                                </div>
                            </div>
                            <div className=' h-25  w-full '>
                                <div className='text-base text-white ml-5 '>☰: Summary</div>
                                <div className='border border-[#dad085] h-15 rounded-lg text-sm flex w-85 mt-1 mr-4 ml-5  hf'>
                                    <textarea 
                                    value={summary}
                                    onChange={ (e) => {
                                        setSummary(e.target.value)
                                    }}
                                    placeholder='Enter task summary....'
                                    className='w-full h-full overflow-y-auto resize-none pl-2 text-white pt-1'></textarea>
                                </div>
                            </div>
                            <div className=' h-20  w-full '>
                                <div className='flex flex-row'>
                                    <div>
                                        <div className='text-base text-white ml-5 '>⚐ Priority</div>
                                        <div className='border border-[#dad085] h-10 rounded-lg text-sm items-center flex w-32 mt-1 mr-2 ml-5'>
                                            <div className='pl-4 text-white'>
                                                <select 
                                                value={priority}
                                                onChange={ (e) => {
                                                    setPriority(e.target.value)
                                                }}
                                                >
                                                    <option value="" className='text-black' disabled>Select Priority</option>
                                                    <option className='text-black' >Low</option>
                                                    <option className='text-black' >Medium</option>
                                                    <option className='text-black' >High</option>
                                                    <option className='text-black' >Urgent</option>
                                                    <option className='text-black'>None</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-base text-white ml-5 '>📆︎ Due Date</div>
                                        <div className='border border-[#dad085] h-10 text-sm rounded-lg items-center flex w-48 mt-1 mr-4 ml-2'>
                                            <input 
                                            value={date}
                                            onChange={ (e) => { 
                                                setDate(e.target.value)
                                            }}
                                            type="datetime-local" className='pl-0 h-full outline-none text-white w-full min-w-0 overflow-x-auto'></ input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='  flex-1  w-full '>
                                <div className='flex flex-row'>
                                    <div>
                                        <div className='text-base text-white ml-5 '>🗀 Project</div>
                                        <div className='border-[#dad085] border h-10 text-sm items-center rounded-lg flex w-40 mt-1 mr-2 ml-5'>
                                            <div className='pl-6 text-white'>
                                               <select 
                                                value={selectedProject}
                                                onChange={(e) => setSelectedProject(e.target.value)}
                                                className="outline-none bg-transparent text-white w-full"
                                                >
                                                <option value="" disabled className="text-black">Select project</option>
                                                {project.map((p) => (
                                                    <option key={p.id || p.projectName} value={p.projectName} className="text-black">
                                                        {p.projectName}
                                                    </option>
                                                ))}
                                                <option value="None" className="text-black">None</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-base text-white ml-5 '>𖤘 Tags</div>
                                        <div className='border-[#dad085] border h-10 text-sm items-center flex w-41 rounded-lg mt-1 mr-4 ml-3'>
                                            <input 
                                            value={tag}
                                            onChange={ (e) => {
                                                setTag(e.target.value)
                                            }}
                                            type="text" className='pl-2 text-white outline-none' placeholder='Add tags(e.g. work)'></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=' flex-1 pt-2  w-full '>
                                <div className='flex flex-row justify-between'>
                                    <div className='flex'>
                                        <button
                                        className=' text-base text-white font-bold  hover:scale-[1.04] border ml-5 mt-1 pb-1  rounded-lg border-lime-300 bg-lime-600 w-22 items-center  cursor-pointer justify-center h-10  hover:transition-all shadow-md transition-all duration-150 active:scale-95'
                                        onClick={ () => {
                                            setIsOpen(false)
                                        }}
                                        >Cancel</button>
                                    </div>
                                    <div>
                                        <div 
                                        className='pl-3 text-base text-white font-bold  hover:scale-[1.04] mr-5 mt-1 pt-1 border-2 rounded-lg border-lime-300 bg-lime-600 w-38 items-center justify-center h-10 pr-2  hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer'
                                        onClick={ () => {
                                            createTask()
                                        }}
                                        >{editingTask ? "✎ Save Changes" : "✎ Create Task"}</div>
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

export default NewTask
