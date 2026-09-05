import { useState } from 'react'
import './App.css'
import {Welcome , Home} from "./Pages/Index"
import AppRoutes from './Routes/AppRoutes'
import NewTask from './Components/NewTask'
import FilterCard from './Components/FilterCard'

function App() {
  return <AppRoutes />

}

export default App
