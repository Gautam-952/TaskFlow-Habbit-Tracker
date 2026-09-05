import React, { useState } from 'react'
import { Navbar , Sidebar, ProjectCard , ProjectFilter, Toolbar } from '../Components'
import NewProject from '../Components/NewProject'
import { useNavigate } from 'react-router-dom'

function Project({ tasks=[] , project=[] , setProject}) {

    const navigate = useNavigate()

    const [isOpen , setIsOpen] = useState(false)
    const [editingProject , setEditingProject] = useState(null)
    const [activeFilter , setActiveFilter] = useState("all")
    const [focusedProject, setFocusedProject] = useState(null)
    let filteredProject = project
    const today = new Date()
    const todayDate = today.toISOString().split("T")[0]

    const [currentPage , setCurrentPage] = useState(1)

    const getProjectProgress = (projName) => {
        const projectTasks = tasks.filter( (t) => t.project === projName)
        if (projectTasks.length === 0) return 0
        const completedTasks = projectTasks.filter( (t) => t.completed).length
        return Math.round( (completedTasks / projectTasks.length) * 100 )
    }

    if (activeFilter === "completed") {
    filteredProject = project.filter((p) => getProjectProgress(p.projectName) === 100)
    } else if (activeFilter === "active") {
        filteredProject = project.filter((p) => {
            const prog = getProjectProgress(p.projectName)
            return p.status?.toLowerCase() === "active" && prog < 100
        })
    } else if (activeFilter === "planning") {
        filteredProject = project.filter((p) => {
            const s = p.status?.toLowerCase()
            const prog = getProjectProgress(p.projectName)
            return (s === "planning" || s === "in planning") && prog < 100
        })
    }

    // Search-selected project overrides any active filter — show only this one
    if (focusedProject) {
        filteredProject = project.filter((p) => p.id === focusedProject.id)
    }

    //  Pagination calci

    const projectPerPage = 6
    const totalPage = Math.ceil(filteredProject.length / projectPerPage) || 1
    const indexOfFirstProject = (currentPage - 1) * projectPerPage
    const indexOfLastProject = currentPage * projectPerPage
    const currentProject = filteredProject.slice(indexOfFirstProject , indexOfLastProject)


    // for length of arrays

    const completedLength = project.filter((p) => getProjectProgress(p.projectName) === 100).length
    const activeLength = project.filter((p) => p.status?.toLowerCase() === "active" && getProjectProgress(p.projectName) < 100).length
    const planningLength = project.filter((p) => (p.status?.toLowerCase() === "planning" || p.status?.toLowerCase() === "in planning") && getProjectProgress(p.projectName) < 100).length

    const toogleComplete = (id) => {
        setProject(project.map( (project) => {
            if (project.id == id){
                return {...project , 
                    completed: !project.completed,
            }
            }
            return project    
        }))
    }
    
    const deleteProject = (id) => {
        setProject(project.filter( (project)=> {
            if (project.id != id){
                return project
            }
        }))
    }

    const editProject = ( project) =>{
        setEditingProject(project)
        setIsOpen(true)
    }

    return (
        
        <div className='h-screen flex bg-[#FAF6ED]'>
            <Sidebar />
            <div className='flex flex-col w-full'>
                <div className='flex'>
                    <Navbar
                        title="Project"
                        para="Manage all your project in one place."
                        tasks={tasks}
                        project={project}
                        searchScope="projects"
                        onSelectResult={(type, item) => {
                            if (type === 'project') {
                                setFocusedProject(item)
                                setCurrentPage(1)
                            }
                        }}
                        onOpenSettings={() => navigate('/settings')}
                    />

                </div>
                

                {/* Main content is here */}
                
                <div className='flex-1 flex flex-col ' >
                    <div className='h-14 w-full flex justify-between'>

                        < ProjectFilter setActiveFilter={setActiveFilter} activeFilter={activeFilter} project={project} planningLength={planningLength} activeLength={activeLength} completedLength={completedLength} />
                        <div className='flex flex-row'>
                            <div 
                            style={{
                                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                boxShadow:
                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                border: '1px solid #76C457',
                                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                            }}
                            className='w-28 h-10 mb-2 mt-2 mr-6 hover:scale-[1.04] text-white font-bold text-sm  border items-center flex justify-center rounded-2xl ml-2 hover:bg-lime-300 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer' 
                            onClick={ () => {
                                setIsOpen(true)
                            }}
                            >New Project
                            </div>
                            {isOpen ? <NewProject setIsOpen={setIsOpen} setProject={setProject} editingProject={editingProject}  setEditingProject={setEditingProject}/> : null}

                        </div>
                    </div>

                    {/* Focused-project banner, only shows when a search result was picked */}
                    {focusedProject && (
                        <div className='flex items-center gap-3 ml-6 mr-6 mt-2'>
                            <button
                                onClick={() => { setFocusedProject(null); setCurrentPage(1) }}
                                className='text-sm text-[#6b8f5f] font-medium hover:underline cursor-pointer'
                            >
                                ← Back to all projects
                            </button>
                            <span className='text-sm text-[#8a8578]'>
                                Showing result for "{focusedProject.projectName}"
                            </span>
                        </div>
                    )}

                    {/* Here should be all project */}

                    <div className=' flex flex-1 flex-col'>
                        {/* In this below we have project */}
                        <div className='border bg-[#F5EFE4] border-[#dad085] h-134 rounded-xl mt-4 ml-6 mr-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                                {
                                currentProject.map( (project) => (
                                    <ProjectCard key={project.id} project={project} tasks={tasks} deleteProject={deleteProject} editProject={editProject} />
                                ))
                                }
                            </div>
                        </div>
                        <div className=' mt-2 ml-6 mr-6 h-8'>
                            <div className='flex flex-row justify-between'>
                                <div className='text-sm mr-1 mt-3 text-black'>Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject , filteredProject.length)} of {filteredProject.length}</div>
                                <div className='flex flex-row mt-1'>
                                    <div 
                                    onClick={ () => {
                                        if (currentPage > 1){
                                            setCurrentPage(currentPage - 1)
                                        }
                                    }}
                                    className='w-8 h-7 border hover:scale-[1.04] text-white font-bold text-sm pb-1 items-center flex justify-center rounded-lg ml-2 cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                    style={{
                                        background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                        boxShadow:
                                            'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                        border: '1px solid #76C457',
                                        textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',}}
                                    >-</div>
                                    <div className='w-8 h-7 text-white font-bold text-sm border items-center flex justify-center rounded-lg ml-2'
                                    style={{
                                        backgroundColor: '#8C7B4E',
                                        color: '#FAF6ED',
                                        boxShadow:
                                            'inset 0 2px 3px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                                        border: '1px solid #6f6038',
                                    }}
                                    >{currentPage}</div>
                                    <div
                                    onClick={ () => {
                                        if ( currentPage < totalPage ){
                                            setCurrentPage(currentPage + 1)
                                        }
                                    }}
                                    className='w-8 h-7 hover:scale-[1.04] border text-white font-bold text-sm pb-1 items-center flex justify-center rounded-lg ml-2 cursor-pointer shadow-md transition-all duration-150 active:scale-95'
                                    style={{
                                        background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                        boxShadow:
                                            'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                        border: '1px solid #76C457',
                                        textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',}}
                                    >+</div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Project