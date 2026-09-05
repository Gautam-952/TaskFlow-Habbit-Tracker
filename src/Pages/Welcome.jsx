import React from 'react'
import { useNavigate } from 'react-router-dom'
import Home from './Home'

function Welcome() {

    const navigate = useNavigate()

    return (
        <div className='h-screen bg-linear-to-br from-[#0f3739] to-[#051e1c] flex flex-col'>
            <div className='h-20 flex items-center px-8 justify-between'>
                <div className='flex items-center gap-3'> 
                    <img src="./logo/logo.png"
                    className='w-15 h-13'/>
                    <p className='text-white font-serif text-base'>TaskFlow</p>
                </div>
                <div className='text-base text-white font-serif'>Foucs. Plan. Flow</div>
            </div>

            <div className='flex flex-1'>
                <div 
                className='w-2/2 items-center flex'
                >
               <div className='p-10 flex-col flex gap-7'>
                    <p className='text-amber-400 text-3xl'>Welcome to</p>
                    <h1 className='text-white text-8xl font-serif '>TaskFlow</h1>
                    <p className='text-amber-400 text-2xl'>Focus. Plan. Flow.</p>
                    <p className='text-white text-lg max-w-md'>Organize your task, plan your day and stay consistency with clarity.</p>
                    <button 
                    className='w-50 h-15 text-lg rounded-xl bg-lime-300 font-serif cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-100 border-[#dad085] border hover:bg-lime-200'
                    onClick={ () => {
                        navigate("/home")
                    }}
                    >Get Started → </button>
                </div>
                
                </div>
                <div className='w-3/2 flex justify-center items-end overflow-hidden pb-0 '>
                    <img src="./icons/lotus.png" className='w-full' alt='lotus' />
                </div>
            </div>

        </div>
    )
}

export default Welcome
