import React from 'react'
import FilterCard from './FilterCard'

function Toolbar( {sortBy , setSortBy , filterOpen , setFilterOpen , filters , setFilters , projectList , tagList , setCurrentPage}) {

    return (
        <div className=' flex flex-row'>
            <div 
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-30 h-10 mb-2 mt-2  border items-center flex justify-center rounded-2xl shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] cursor-pointer text-white font-bold text-sm ml-2'>
                <select name=""
                onChange={ (e) => {
                    setSortBy(e.target.value)
                }}
                >
                    <option className='text-black font-semibold font-serif bg-[#FAF6ED]'value="default">Sort By</option>
                    <option className='text-black font-semibold font-serif bg-[#FAF6ED]' value="dueDate">Due Date</option>
                    <option className='text-black font-semibold font-serif bg-[#FAF6ED]' value="priority">Priority</option>
                    <option className='text-black font-semibold font-serif bg-[#FAF6ED]' value="newest">Newest</option>
                </select>    
            </div>
            <div 
            onClick={ () => {
                setFilterOpen(!filterOpen)
            }}
            style={{
                background: 'linear-gradient(180deg, #76C457 0%, #76C457 50%, #76C457 100%)',
                boxShadow:
                'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                border: '1px solid #76C457',
                textshadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
            }}
            className='w-15 h-10 mb-2 mt-2 border items-center flex justify-center rounded-2xl ml-2 mr-6 shadow-md transition-all duration-150 active:scale-95 pb-1 cursor-pointer hover:scale-[1.04] text-white font-extrabold'>= </div>
            {filterOpen && (
                <div className='fixed inset-0 flex w-full h-full items-center justify-center z-50 '>
                    < FilterCard setCurrentPage={setCurrentPage} filters={filters} setFilters={setFilters} filterOpen={filterOpen} setFilterOpen={setFilterOpen} projectList={projectList} tagList={tagList} />
                </div>
            )}
        </div>
    )
}

export default Toolbar
