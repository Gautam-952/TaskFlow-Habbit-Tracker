import React , {useState , useEffect, useDebugValue} from 'react'
import { HashRouter, Routes, Route } from "react-router-dom"
import {Welcome , Home , Task , Project , Calendar , Habbit , Analytics , Notes , Settings}  from "../Pages/Index"

function AppRoutes() {

    const [tasks , setTasks] = useState( () => {
        const savedTasks = localStorage.getItem("app_tasks")
        return savedTasks ? JSON.parse(savedTasks) : []
    })

    const [project , setProject] = useState( () => {
        const savedProjects = localStorage.getItem("app_projects")
        return savedProjects ? JSON.parse(savedProjects) : []
    })

    const [habit , setHabit] = useState( () => {
        const savedHabits = localStorage.getItem("app_habits")
        return savedHabits ? JSON.parse(savedHabits) : []
    })

    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem("app_notes")
        return savedNotes ? JSON.parse(savedNotes) : []
    })

    useEffect( () => {
        localStorage.setItem("app_tasks" , JSON.stringify(tasks))
    }, [tasks])

    useEffect( () => {
        localStorage.setItem("app_projects" , JSON.stringify(project))
    } , [project])

    useEffect( () => {
        localStorage.setItem("app_habits", JSON.stringify(habit))
    } , [habit])

    useEffect(() => {
        localStorage.setItem("app_notes", JSON.stringify(notes))
    }, [notes])
    
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Welcome/>} /> 
                <Route path='/home' element={<Home tasks={tasks} project={project} habit={habit} setHabit={setHabit} setTasks={setTasks}/>} />
                <Route path='/task' element={<Task tasks={tasks} project={project} setTasks={setTasks}/>} />
                <Route path='/projects' element={<Project tasks={tasks} project={project} setProject={setProject}/>} />
                <Route path='/calendar' element={<Calendar tasks={tasks} project={project} />} />
                <Route path='/habits' element={<Habbit habit={habit} setHabit={setHabit}/>} />
                <Route path='/analytics' element={<Analytics habit={habit} tasks={tasks} project={project} />} />
                <Route path='/notes' element={<Notes notes={notes} setNotes={setNotes} />} />
                <Route path='/settings' element={<Settings tasks={tasks} project={project} habit={habit} notes={notes}/>} />
            </Routes>
        </HashRouter>
    )
}

export default AppRoutes
