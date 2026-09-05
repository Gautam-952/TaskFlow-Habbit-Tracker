import React, { useEffect, useState } from 'react'

function FilterCard({ filters , setFilters , filterOpen , setFilterOpen , projectList , tagList , setCurrentPage}) {

    
    const [draftFilters , setDraftFilters] = useState(filters)

    const valueOfPriority = draftFilters.priority
    const valueOfStatus = draftFilters.status
    const valueOfDueDate = draftFilters.dueDate

    useEffect( () => {
        setDraftFilters(filters)
    }, [filterOpen , filters])

    return (
        <div className='h-screen w-full bg-[#FAF6ED]/30 backdrop-blur-md'>
            <div className='flex h-full items-center justify-center'>
                <div className='flex flex-col h-126 w-110 bg-linear-to-br from-[#0f3739] to-[#051e1c] border-[#dad085] border rounded-xl overflow-hidden'>
                    <div className='h-10 w-full flex justify-between'>
                        <div className='text-xl font bold text-white font-serif ml-50 mt-2'>Filters</div>
                        <div 
                        onClick={ () => {
                            setFilterOpen(false)
                        }}
                        className='mr-4 mt-2 cursor-pointer text-white hover:bg-[#B91C1C] pl-1 w-6 h-8 font-bold text-xl'>✗</div>
                    </div>


                    <div className='flex flex-col'>
                        <div className='ml-4 mt-2 font bold text-white font-serif'>Status</div>
                        <div className='mt-2 mb-2 flex flex-row '>
                            <div
                            onClick={ () => {
                                setDraftFilters( {...draftFilters, status: "all"})
                            }}
                            className={ valueOfStatus === "all" ? 'cursor-pointer border p-0 bg-lime-400/40 border-[#dad085] h-8 w-10 flex text-sm rounded-md items-center justify-center text-white ml-4' : 'border cursor-pointer border-[#dad085] h-8 w-12 flex text-sm rounded-md items-center justify-center text-white ml-4'}><span className={ valueOfStatus === "all" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-white w-2 pr-1'}> </span>All</div>
                            <div
                            onClick={ () => {
                                setDraftFilters( {...draftFilters, status: "active"})
                            }}
                            className={ valueOfStatus === "active" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 h-8 w-20 flex text-sm rounded-md items-center justify-center text-red-600 ml-2' : 'border cursor-pointer border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center text-red-600 ml-2'}><span className={ valueOfStatus === "active" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-red-600 w-2 pr-1'}> </span>Active</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters, status: "completed"})
                            }}
                            className={ valueOfStatus === "completed" ? 'border h-8 w-25 cursor-pointer bg-lime-400/40 border-[#dad085] flex text-sm rounded-md items-center justify-center text-orange-400 ml-2' : ' cursor-pointer border h-8 w-25 border-[#dad085] flex text-sm rounded-md items-center justify-center text-orange-400 ml-2'}><span className={ valueOfStatus === "completed" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-orange-400 w-2 pr-1'}> </span>Completed</div>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='ml-4 mt-2 font bold text-white font-serif'>⚐ Priority</div>
                        <div className='mt-2 mb-2 flex flex-row '>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "all"})
                            }}
                            className={ valueOfPriority === "all" ? 'border cursor-pointer border-[#dad085] h-8 w-10 flex bg-lime-400/40 text-sm rounded-md items-center justify-center text-white ml-4' : 'border cursor-pointer border-[#dad085] h-8 w-10 flex text-sm rounded-md items-center justify-center text-white ml-4' }>All</div>
                            <div
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "urgent"})
                            }}
                            className={ valueOfPriority === "urgent" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 h-8 w-20 flex text-sm rounded-md items-center justify-center text-red-600 ml-1' : 'border cursor-pointer border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center text-red-600 ml-1'}><span className={ valueOfPriority === "urgent" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-red-600 w-2 pr-1' }> </span>Urgent</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "high"})
                            }}
                            className={ valueOfPriority === "high" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 h-8 w-20 flex text-sm rounded-md items-center justify-center text-orange-600 ml-1' : 'border cursor-pointer border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center text-orange-600 ml-1'}><span className={ valueOfPriority === "high" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-orange-400 w-2 pr-1' }> </span>High</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "medium"})
                            }}
                            className={ valueOfPriority === "medium" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 h-8 w-20 flex text-sm rounded-md items-center justify-center text-yellow-600 ml-1' : 'border cursor-pointer border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center text-yellow-600 ml-1'}><span className={ valueOfPriority === "medium" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-yellow-400 w-2 pr-1' }> </span>Medium</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "low"})
                            }}
                            className={ valueOfPriority === "low" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 h-8 w-20 flex text-sm rounded-md items-center justify-center text-green-400 ml-1' : 'border cursor-pointer border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center text-green-400 ml-1'}><span className={ valueOfPriority === "low" ? 'h-2 mr-1 rounded-full bg-lime-200 w-2 pr-1' : 'h-2 mr-1 rounded-full bg-green-400 w-2 pr-1' }> </span>Low</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters( {...draftFilters , priority: "none"})
                            }}
                            className={ valueOfPriority === "none" ? ' ml-1 border cursor-pointer border-[#dad085] h-8 w-12 flex bg-lime-400/40 text-sm rounded-md items-center justify-center text-white mr-4' : ' ml-1 border cursor-pointer border-[#dad085] h-8 w-12 flex text-sm rounded-md items-center justify-center text-white mr-4' }>None</div>
                        </div>
                    </div>


                    <div className='flex flex-col'>
                        <div className='ml-4  mb-2 font bold text-white font-serif'>🗀 Project</div>
                        <div className=' ml-4 border rounded-xl border-[#dad085] mr-4 '>
                            <select
                            value={draftFilters.project}
                            onChange={ (e) => {
                                setDraftFilters({...draftFilters, project: e.target.value})
                            }}
                            name="" id="" className='pl-4 mt-2 mb-2 w-full text-white cursor-pointer'>
                                <option value="all" className='text-black'>🗀 All Projects</option> 
                                {projectList.map( (projectName) => {
                                    return <option value={projectName} className='text-black' key={projectName}>{projectName}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    {/* <div className='w-102 mr-4 h-0 flex ml-4 border border-[#dad085]/40 mt-4 mb-2'></div> */}

                    <div className='flex flex-col'>
                        <div className='ml-4 mt-1 mb-2 font bold text-white font-serif '>📆︎ Due Date</div>
                        <div className=' mb-1 flex flex-row'>
                            <div 
                            onClick={ () => {
                                setDraftFilters({...draftFilters, dueDate: "all"})
                            }}
                            className={ valueOfDueDate === "all" ? 'cursor-pointer border border-[#dad085] bg-lime-400/40 text-white  h-8 w-10 flex text-sm rounded-md items-center justify-center ml-4' : 'border cursor-pointer text-white border-[#dad085] h-8 w-10 flex text-sm rounded-md items-center justify-center ml-4'}>All</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters({...draftFilters, dueDate: "today"})
                            }}
                            className={ valueOfDueDate === "today" ? 'border cursor-pointer border-[#dad085] bg-lime-400/40 text-white  h-8 w-20 flex text-sm rounded-md items-center justify-center ml-2' : 'border cursor-pointer text-white border-[#dad085] h-8 w-20 flex text-sm rounded-md items-center justify-center ml-2'}>Today</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters({...draftFilters, dueDate: "upcoming"})
                            }}
                            className={ valueOfDueDate === "upcoming" ? 'border h-8 w-22 cursor-pointer  border-[#dad085] bg-lime-400/40 text-white  flex text-sm rounded-md items-center justify-center ml-2' : 'border cursor-pointer text-white h-8 w-22 border-[#dad085] flex text-sm rounded-md items-center justify-center ml-2'}>Upcoming</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters({...draftFilters, dueDate: "overdue"})
                            }}
                            className={ valueOfDueDate === "overdue" ? 'border h-8 w-22 cursor-pointer border-[#dad085] bg-lime-400/40 text-white  flex text-sm rounded-md items-center justify-center ml-2' : 'cursor-pointer text-white border h-8 w-22 border-[#dad085] flex text-sm rounded-md items-center justify-center ml-2'}>Overdue</div>
                            <div 
                            onClick={ () => {
                                setDraftFilters({...draftFilters, dueDate: "nodate"})
                            }}
                            className={ valueOfDueDate === "nodate" ? 'border h-8 w-18 cursor-pointer  border-[#dad085] bg-lime-400/40 text-white  flex text-sm rounded-md items-center justify-center  ml-2' : ' cursor-pointer text-white border h-8 w-18  border-[#dad085] flex text-sm rounded-md items-center justify-center  ml-2'}>No Date</div>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <div className='ml-4 mb-2 font bold text-white font-serif'>𖤘 Tags</div>
                        <div className='mt-1 ml-4 border rounded-xl border-[#dad085] mr-4 '>
                            <select 
                                value={draftFilters.tag}
                                onChange={ (e) => {
                                    setDraftFilters( {...draftFilters , tag: e.target.value} )
                                }}
                                name="" id="" className='pl-4 mt-2 mb-2 w-full text-white cursor-pointer'>
                                <option value="all" className='text-black'>🗀 All Tags</option> 
                                {tagList.map( (tagName) => {
                                    return <option value={tagName} className='text-black' key={tagName}>{tagName}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col mt-6 ml-4'>
                        <div className=' flex justify-between'>
                            <div 
                            onClick={ () => {
                                const defaultFilters = {
                                    status: "all",
                                    priority: "all",
                                    project: "all",
                                    dueDate: "all",
                                    tag: "all",
                                }
                                setDraftFilters(defaultFilters)
                            }}
                            className='cursor-pointer border rounded-xl border-lime-300 bg-lime-600 hover:transition-all shadow-md transition-all duration-150 active:scale-95 font bold hover:scale-[1.04] text-white font-serif h-12 w-35 text-lg flex justify-center items-center'>Clear</div>
                            <div 
                            onClick={ () => {
                                setFilters(draftFilters)
                                if (setCurrentPage) setCurrentPage(1)
                                setFilterOpen(false)
                            }}
                            className='border cursor-pointer rounded-xl border-lime-300 bg-lime-600 hover:transition-all shadow-md transition-all duration-150 active:scale-95 font bold hover:scale-[1.04] text-white font-serif h-12 w-35 text-lg flex justify-center items-center mr-4 ml-4'>Apply Filter</div>
                        </div>

                        {/* <div className='text-base flex items-center justify-center mt-2 text-white'>Multiple filters will work together.</div> */}
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default FilterCard
