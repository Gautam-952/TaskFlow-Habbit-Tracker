import React from 'react'

function Header() {
    return (
        <div className='bg-white flex justify-between text-black h-18 pl-6'>
            <div className='text-3xl font-serif font-medium mt-1'>Good morning, Gautam 🌿
                <div className='text-black font-serif text-lg mb-2'>Focus on one thing today.</div>
            
                    </div>
                        <div className='flex flex-row pt-4 pr-3 gap-6'>
                        <div className='w-70 h-10 items-center justify-center rounded-4xl  border flex'>Search tasks, projects...</div>
                        <div className='w-10 rounded-full h-10 border'></div>
                        <div className='w-10 rounded-full h-10 border'></div>
                        <div className='w-50 rounded-4xl h-10 border mr-2'></div>
                    </div>
        </div>
    )
}

export default Header;