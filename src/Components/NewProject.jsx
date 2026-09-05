import React, {useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function NewProject( {setIsOpen , setProject , editingProject ,setEditingProject} ) {

    const [projectName , setProjectName] = useState("")
    const [description , setDescription] = useState("")
    const [status , setStatus] = useState("")
    const [targetDate , setTargetDate] = useState("")

    useEffect( ( ) => {
        if (editingProject) {
            setProjectName(editingProject.projectName || "")
            setDescription(editingProject.description || "") 
            setStatus(editingProject.status || "")
            setTargetDate(editingProject.targetDate || "")
        }
    }, [editingProject])

    const createProject = () => {

        if (!projectName.trim()){
            alert("Project Name is required: ")
            return;
        }
       
        if (editingProject) {
            setProject( prev => prev.map((task) => {
                if ( task.id === editingProject.id) {
                    return {...task,
                        projectName: projectName,
                        description: description,
                        status: status,
                        targetDate: targetDate,
                    }
                }
                return task
            }))
            setEditingProject(null)
            setIsOpen(false)
            return
        } else {
            setProjectName("")
            setDescription("")
            setStatus("")
            setTargetDate("")
        }

        const newProject = {
            id: Date.now(),
            projectName: projectName,
            description: description,
            status: status || "None",
            targetDate: targetDate,
            completed: false,
        }
        setProject(prev => [...prev,newProject])
        setIsOpen(false)
        return
    }

    return (
        <div className='h-screen w-full bg-[#FAF6ED]/30 backdrop-blur-md inset-0 z-40 fixed '>
            <div className='flex h-full items-center justify-center'>
                <div className='flex h-4/7 w-1/4 bg-linear-to-br from-[#0f3739] to-[#051e1c] border-[#dad085] border-2 rounded-xl overflow-hidden'>
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-col h-25'>
                            <div>
                                <img 
                                className='flex w-10 h-8 mt-2 absolute left-1/2 -translate-x-1/2 '
                                src="./logo/logo.png" alt="lotus2" />
                                <div 
                                className='justify-end flex pr-4 pt-3 cursor-pointer text-white text-xl '
                                onClick={ () => {
                                    setEditingProject(null)
                                    setIsOpen(false)
                                }}
                                >✗</div>
                            </div>
                            <div className='flex justify-center pt-2  text-white font-serif text-2xl '>New Project</div>
                            
                        </div>
                        <div className='h-full flex w-full flex-col'>
                            <div className=' h-20  w-full '>
                                <div className='text-base text-white  ml-5 '>🗎 Project Name <span className='text-red-500'>*</span></div>
                                <div className='border border-[#dad085] rounded-lg h-10 text-sm items-center flex w-85 mt-1 mr-4 ml-5'>
                                    <input type="text"  
                                    className='pl-2 text-white w-full h-full focus:outline-none'
                                    placeholder='Enter Project Name....'
                                    value={projectName}
                                    onChange={ (e) => {
                                        setProjectName(e.target.value)
                                    }}
                                    required
                                    ></input>
                                </div>
                            </div>
                            <div className=' h-25  w-full '>
                                <div className='text-base text-white ml-5 '>☰: Description</div>
                                <div className='border border-[#dad085] h-15 rounded-lg text-sm flex w-85 mt-1 mr-4 ml-5  hf'>
                                    <textarea 
                                    value={description}
                                    onChange={ (e) => {
                                        setDescription(e.target.value)
                                    }}
                                    placeholder='Enter Project Description....'
                                    className='w-full h-full overflow-y-auto resize-none pl-2 text-white pt-1'></textarea>
                                </div>
                            </div>
                            <div className=' h-20  w-full '>
                                <div className='flex flex-row'>
                                    <div>
                                        <div className='text-base text-white ml-5 '>⚐ Status</div>
                                        <div className='border border-[#dad085] h-10 rounded-lg text-sm items-center flex w-32 mt-1 mr-2 ml-5'>
                                            <div className='pl-4 text-white'>
                                                <select 
                                                value={status}
                                                onChange={ (e) => {
                                                    setStatus(e.target.value)
                                                }}
                                                >
                                                    <option value="" disabled className='text-black'>Select Status</option>
                                                    <option className='text-black' >Active</option>
                                                    <option className='text-black' >Planning</option>
                                                    <option className='text-black'>None</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-base text-white ml-4 '>📆︎ Target Date</div>
                                        <div className='border border-[#dad085] h-10 text-sm rounded-lg items-center flex w-49 mt-1 mr-4 ml-2'>
                                            <input 
                                            value={targetDate}
                                            onChange={ (e) => { 
                                                setTargetDate(e.target.value)
                                            }}
                                            type="datetime-local" className='pl-0 h-full outline-none text-white w-full min-w-0 overflow-x-auto'></ input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className=' flex-1 pt-2  w-full '>
                                <div className='flex flex-row justify-between'>
                                    <div className='flex'>
                                        <button
                                        className=' text-base text-white ml-5 mt-1 pb-1 border-2 rounded-lg hover:transition-all shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] border-lime-300 bg-lime-600 w-22 items-center  cursor-pointer justify-center h-10 hover:bg-lime-300'
                                        onClick={ () => {
                                            setIsOpen(false)
                                        }}
                                        >Cancel</button>
                                    </div>
                                    <div>
                                        <div 
                                        className='pl-3 text-base text-white mr-5 mt-1 pt-1 border-2 rounded-lg hover:transition-all shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] border-lime-300 bg-lime-600 w-40 items-center justify-center h-10 pr-2 hover:bg-lime-300 cursor-pointer'
                                        onClick={ () => {
                                            createProject()
                                        }}
                                        >{editingProject ? "✎ Save Changes" : "✎ Create Project"}</div>
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

export default NewProject
