import React, { useState } from 'react'

function ProjectFilter( {setActiveFilter , project , planningLength , activeLength , completedLength} ) {


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
            className='w-30 h-10 mb-2 hover:scale-[1.04] mt-2 shadow-md transition-all duration-150 active:scale-95  border items-center flex justify-center rounded-xl text-white font-bold text-sm hover:bg-lime-700 hover:transition-all  cursor-pointer ml-6'>All Projects <span className='ml-2 bg-white/20 font-bold text-white rounded-lg px-1.5 py-0.2'>{project.length} </span> </div>
            <div 
            onClick={ () => {
                setActiveFilter("active")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-25 h-10 mb-2 mt-2 hover:scale-[1.04] border items-center flex justify-center rounded-xl text-white font-bold text-sm hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>Active <span className='ml-2 bg-white/20 font-bold text-white rounded-lg px-1.5 py-0.2'>{activeLength} </span></div>
            <div 
            onClick={ () => {
                setActiveFilter("planning")
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2 hover:scale-[1.04] border items-center flex justify-center rounded-xl text-white font-bold text-sm hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>In Planning <span className='ml-2 bg-white/20 font-bold text-white rounded-lg px-1.5 py-0.2'>{planningLength} </span></div>
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
            className='w-30 h-10 mb-2 mt-2 hover:scale-[1.04] border items-center flex justify-center rounded-xl text-white font-bold text-sm hover:bg-lime-700 hover:transition-all shadow-md transition-all duration-150 active:scale-95  cursor-pointer ml-2'>Completed <span className='ml-2 bg-white/20 font-bold rounded-lg text-white px-1.5 py-0.2'>{completedLength} </span></div>
        </div>
    )
}

export default ProjectFilter
