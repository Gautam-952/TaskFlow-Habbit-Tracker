import React, { useState } from 'react'
import { Navbar , Sidebar, TaskCard , TaskFilter, Toolbar } from '../Components'
import NewTask from '../Components/NewTask'
import { useNavigate } from 'react-router-dom'

function Task( {setTasks, tasks=[] , project=[]}) {

    const navigate = useNavigate()

    const [isOpen , setIsOpen] = useState(false)
    const [editingTask , setEditingTask] = useState(null)
    const [activeFilter , setActiveFilter] = useState("all")
    const [focusedTask, setFocusedTask] = useState(null)
    let filteredTasks = tasks
    const today = new Date()
    const todayDate = today.toISOString().split("T")[0]
    const [sortBy , setSortBy] = useState("default")
    const [filterOpen , setFilterOpen] = useState(false)
    const [filters , setFilters] = useState({
        status: "all",
        priority: "all",
        project: "all",
        dueDate: "all",
        tag: "all",
    })  
    let filterCardTask = tasks

    const [currentPage , setCurrentPage] = useState(1)

    if (activeFilter === "completed"){
        filteredTasks = tasks.filter( (task) => {
            if(task.completed === true){
                return true
            }
            return false    
        })
    }else if (activeFilter === "active"){
        filteredTasks = tasks.filter( (task) => {
            if(task.completed === false){
                return true
            }
            return false    
        })
    }else if (activeFilter === "today"){
        filteredTasks = tasks.filter( (task) => {
            if ((task.date || task.dueDate || "").split("T")[0] === todayDate){
                return true
            }
            return false
        })
    } else if (activeFilter === "upcoming"){
        filteredTasks = tasks.filter( (task) => {
            if ((task.date || task.dueDate || "").split("T")[0] > todayDate){
                return true
            }
            return false
        })
    }

    // for the values in filterCard


    filterCardTask = filteredTasks.filter( (task) => {

        let priorityMatch = false
        if (filters.priority === "all" || filters.priority === (task.priority || "").toLowerCase()) {
            priorityMatch = true
        } else if (filters.priority === "none" && (!task.priority || task.priority === "None" || task.priority === "none")) {
            priorityMatch = true
        }
        let statusMatch = false
        if ( filters.status === "all" || filters.status === task.status ){
            statusMatch = true
        }
        if ( filters.status === "completed" && task.completed === true){
            statusMatch = true
        }
        if ( filters.status === "active" && ( task.completed === false || !task.completed)){
            statusMatch = true
        }
        let projectMatch = false
        if (filters.project === "all" || filters.project === task.project){
            projectMatch = true
        }
        let dueDateMatch = false
        let taskDate = (task.dueDate || task.date || "").split("T")[0]
        
        if (filters.dueDate === "all") {
            dueDateMatch = true
        } else if (filters.dueDate === "nodate" && (taskDate === "" || (!task.dueDate && !task.date))) {
            dueDateMatch = true
        } else if (filters.dueDate === "today" && taskDate === todayDate) {
            dueDateMatch = true
        } else if (filters.dueDate === "upcoming" && taskDate > todayDate) {
            dueDateMatch = true
        } else if (filters.dueDate === "overdue" && taskDate < todayDate && taskDate !== "") {
            dueDateMatch = true
        } else if (filters.dueDate === taskDate) {
            dueDateMatch = true
        }
        let tagMatch = false
        if (filters.tag === "all" || filters.tag === task.tag){
            tagMatch = true
        } else if (filters.tag === "none" && (!task.tag || task.tag === "none" || task.tag === "")){
            tagMatch = true
        }

        return projectMatch && statusMatch && priorityMatch && dueDateMatch && tagMatch
    })

    // for sorting

    let sortedTasks = [...filterCardTask]

    const rank = {
        urgent: 1,
        high: 2,
        medium: 3,
        low: 4,
        none: 5
    }

    if (sortBy === "priority") {
        sortedTasks.sort((a, b) => {
            const aPri = (a.priority || "none").toLowerCase()
            const bPri = (b.priority || "none").toLowerCase()
            const aRank = rank[aPri] || 5
            const bRank = rank[bPri] || 5
            return aRank - bRank
        })
    } else if (sortBy === "dueDate") {
        sortedTasks.sort((a, b) => {
            const aDate = a.date || a.dueDate || ""
            const bDate = b.date || b.dueDate || ""

            if (!aDate && !bDate) return 0
            if (!aDate) return 1
            if (!bDate) return -1

            return new Date(aDate).getTime() - new Date(bDate).getTime()
        })
    } else if (sortBy === "newest") {
        sortedTasks.sort((a, b) => Number(b.id) - Number(a.id))
    }

    // Search-selected task overrides everything — show only this one
    if (focusedTask) {
        sortedTasks = tasks.filter((t) => t.id === focusedTask.id)
    }

    //  Pagination calci

    const taskPerPage = 5
    const totalPage = Math.ceil(sortedTasks.length / taskPerPage) || 1
    const indexOfFirstTask = (currentPage - 1) * taskPerPage
    const indexOfLastTask = currentPage * taskPerPage
    const curentTasks = sortedTasks.slice((currentPage - 1) * 5 , currentPage * 5)


    // for length of arrays

    const completedTasks = tasks.filter( (task) => {
            if(task.completed === true){

                return true
            }
            return false    
        })
    const completedLength = completedTasks.length

    const todayTasks = tasks.filter((task) => {
    const d = (task.date || task.dueDate || "").split("T")[0]
    if (d === todayDate) {
                return true
            }
            return false
        })
    const todayLength = todayTasks.length

    const upcomingTasks = tasks.filter((task) => {
    const d = (task.date || task.dueDate || "").split("T")[0]
    if (d > todayDate) {
                return true
            }
            return false
        })
    const upcomingLength = upcomingTasks.length

    const toogleComplete = (id) => {
    setTasks(tasks.map( (task) => {
        if (task.id == id){
            const nowCompleted = !task.completed
            return {...task,
                completed: nowCompleted,
                completedAt: nowCompleted ? new Date().toISOString() : null,
            }
        }
        return task
    }))
}
    
    const deleteTask = (id) => {
        setTasks(tasks.filter( (task)=> {
            if (task.id != id){
                return task
            }
        }))
    }

    const editTask = ( task) =>{
        setEditingTask(task)
        setIsOpen(true)
    }

    // The name of dropdown

    let projectList = [...new Set([
    ...project.map(p => p.projectName).filter(Boolean),
    ...tasks.map(t => t.project).filter(Boolean)
    ])]

    let tagList = []
    tasks.forEach( (task) => {
        if (task.tag && !tagList.includes(task.tag)){
            tagList.push(task.tag)
        }
    })  

    let taskToRender = curentTasks

    return (
        
        <div className='h-screen flex bg-[#FAF6ED]'>
            <Sidebar />
            <div className='flex flex-col w-full'>
                <div className='flex'>
                   <Navbar
                    title="Task"
                    para="Manage all your tasks in one place."
                    tasks={tasks}
                    project={project}
                    searchScope="tasks"
                    searchPlaceholder="Search Tasks..."
                    onOpenSettings={() => navigate('/settings')}
                    onSelectResult={(type, item) => {
                        if (type === 'task') {
                            setFocusedTask(item)
                            setCurrentPage(1)
                        }
                    }}
                />
                </div>
                

                {/* Main content is here */}
                
                <div className='flex-1 flex flex-col' >
                    <div className='h-14 w-full flex justify-between '>
                        {/* here should be taskfilter */}
                        < TaskFilter setActiveFilter={setActiveFilter} activeFilter={activeFilter} tasks={tasks} upcomingLength={upcomingLength} todayLength={todayLength} completedLength={completedLength} />
                        <div className='flex flex-row'>
                            <div 
                            style={{
                                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                boxShadow:
                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                border: '1px solid #76C457',
                                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                            }}
                            className='shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] cursor-pointer text-white font-bold w-25 h-10 mb-2 mt-2  border items-center flex justify-center rounded-2xl ml-2 hover:bg-lime-300 hover:transition-all' 
                            onClick={ () => {
                                setIsOpen(true)
                            }}
                            >New Task
                            </div>
                            {isOpen ? <NewTask setIsOpen={setIsOpen} setTasks={setTasks} editingTask={editingTask}  setEditingTask={setEditingTask} project={project}/> : null}
                             
                            {/*  here should be toolbar */}
                            < Toolbar setCurrentPage={setCurrentPage} sortBy={sortBy} setSortBy={setSortBy} filterOpen={filterOpen} setFilterOpen={setFilterOpen} filters={filters} setFilters={setFilters} projectList={projectList} tagList={tagList}/>

                        </div>
                    </div>

                    {/* Focused-task banner */}
                    {focusedTask && (
                        <div className='flex items-center gap-3 ml-6 mr-6 mt-1'>
                            <button
                                onClick={() => { setFocusedTask(null); setCurrentPage(1) }}
                                className='text-sm text-[#6b8f5f] font-medium hover:underline cursor-pointer'
                            >
                                ← Back to all tasks
                            </button>
                            <span className='text-sm text-[#8a8578]'>
                                Showing result for "{focusedTask.title}"
                            </span>
                        </div>
                    )}

                    {/* Here should be all tasks */}

                    <div className=' flex flex-1 flex-col'>
                        {/* In this below we have tasks */}
                        <div className='h-134 mt-4 ml-6 mr-6'>
                            <div className='flex flex-col'>
                                {
                                taskToRender.map( (task) => (
                                    <TaskCard key={task.id} task={task}  project={project} toogleComplete={toogleComplete} deleteTask={deleteTask} editTask={editTask} />
                                ))
                                }
                            </div>
                        </div>
                        <div className='mt-2 ml-6 mr-6 h-8'>
                            <div className='flex flex-row justify-between'>
                                <div className='text-sm text-black mr-1 mt-2'>Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask , sortedTasks.length)} of {sortedTasks.length}</div>
                                <div className='flex flex-row'>
                                    <div 
                                    onClick={ () => {
                                        if (currentPage > 1){
                                            setCurrentPage(currentPage - 1)
                                        }
                                    }}
                                    style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',}}
                                    className='w-8 h-7 hover:scale-[1.04] text-white font-bold text-sm pb-1 shadow-md cursor-pointer transition-all duration-150 active:scale-95 border items-center flex justify-center rounded-lg ml-2'>-</div>
                                    <div 
                                    style={{
                                            backgroundColor: '#8C7B4E',
                                            color: '#FAF6ED',
                                            boxShadow:
                                                'inset 0 2px 3px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                                            border: '1px solid #6f6038',
                                        }}
                                    className='w-8 h-7 pb-1 border text-white font-bold text-sm items-center flex justify-center rounded-lg ml-2'>{currentPage}</div>
                                    <div
                                    onClick={ () => {
                                        if ( currentPage < totalPage ){
                                            setCurrentPage(currentPage + 1)
                                        }
                                    }}
                                    style={{
                                            background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                                            boxShadow:
                                                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                                            border: '1px solid #76C457',
                                            textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',}}
                                    className='w-8 h-7 hover:scale-[1.04] text-white font-bold text-sm pb-1 shadow-md cursor-pointer transition-all duration-150 active:scale-95 border items-center flex justify-center rounded-lg ml-2'>+</div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Task