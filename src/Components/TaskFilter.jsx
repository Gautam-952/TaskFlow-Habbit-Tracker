import React, { useState } from 'react'

function TaskFilter( {setActiveFilter , tasks , upcomingLength , todayLength , completedLength} ) {


    return (
        <div className='flex flex-row'>
            <div 
            onClick={ () => {
                setActiveFilter("all")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2  text-white font-bold text-sm  hover:scale-[1.04] border items-center flex justify-center rounded-xl hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-6'>All Tasks <span className='ml-2 bg-white/20 font-bold rounded-lg text-white px-1.5 py-0.4'>{tasks.length} </span> </div>
            <div 
            onClick={ () => {
                setActiveFilter("today")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2 text-white font-bold text-sm  hover:scale-[1.04] border items-center flex justify-center rounded-xl hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>Today <span className='ml-2 bg-white/20 font-bold rounded-lg text-white px-1.5 py-0.4'>{todayLength} </span></div>
            <div 
            onClick={ () => {
                setActiveFilter("upcoming")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2 text-white font-bold text-sm  hover:scale-[1.04] border items-center flex justify-center rounded-xl hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>Upcoming <span className='ml-2 bg-white/20 font-bold rounded-lg text-white px-1.5 py-0.4'>{upcomingLength} </span></div>
            <div 
            onClick={ () => {
                setActiveFilter("completed")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2 text-white font-bold text-sm  hover:scale-[1.04] border items-center flex justify-center rounded-xl hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>Completed <span className='ml-2 bg-white/20 font-bold rounded-lg text-white px-1.5 py-0.4'>{completedLength} </span></div>
        </div>
    )
}

export default TaskFilter
