import React, { useState } from 'react'

function NewHabit({ setIsOpen, habit, setHabit, editingHabit, saveEditedHabit }) {

    const [habitName, setHabitName] = useState(editingHabit ? editingHabit.habitName : "")
    const [scheduleType, setScheduleType] = useState(editingHabit ? editingHabit.scheduleType : "everyday")
    const [customDays, setCustomDays] = useState(editingHabit ? editingHabit.activeDays : [1, 2, 3, 4, 5, 6])

    const toggleDays = (dayIndex) => {
        if (customDays.includes(dayIndex)) {
            if (customDays.length > 1) {
                setCustomDays(customDays.filter(d => d !== dayIndex))
            }
        } else {
            setCustomDays([...customDays, dayIndex].sort())
        }
    }
    
    const handleCreateHabit = (e) => {
        e.preventDefault()

        if (!habitName.trim()) {
            alert("Please enter a habit name!")
            return
        }

        let activeDayArray = []
        if (scheduleType === 'everyday') {
            activeDayArray = [0, 1, 2, 3, 4, 5, 6]
        } else if (scheduleType === 'weekdays') {
            activeDayArray = [1, 2, 3, 4, 5]
        } else {
            activeDayArray = [...customDays].sort()
        }

        if (editingHabit) {
            saveEditedHabit({
                ...editingHabit,
                habitName: habitName.trim(),
                scheduleType: scheduleType,
                activeDays: activeDayArray
            })
        } else {
            const NewHabit = {
                habitId: Date.now().toString(),
                habitName: habitName.trim(),
                scheduleType: scheduleType,
                currentStreak: 0,
                bestStreak: 0,
                activeDays: activeDayArray,
                history: {},
                archived: false,
                createdAt: new Date().toISOString().split("T")[0]
            }
            setHabit(prev => [...prev, NewHabit])
            setIsOpen(false)
        }
    }

    return (
        <div className="h-screen w-full bg-[#FAF6ED]/30 backdrop-blur-md inset-0 z-40 fixed">
            <div className="flex h-full items-center justify-center">
                <div className="flex h-[50%] w-1/4 bg-linear-to-br from-[#0f3739] to-[#051e1c] border-[#dad085] border-2 rounded-xl overflow-hidden">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col h-25 relative">
                            <div>
                                <img className="flex w-10 h-8 mt-2 absolute left-1/2 -translate-x-1/2" src="./logo/logo.png" alt="lotus2" />
                                <div 
                                    onClick={() => {
                                        setIsOpen(false)
                                    }}
                                    className="justify-end flex pr-4 pt-3 cursor-pointer text-white text-xl"
                                >
                                    ✗
                                </div>
                            </div>
                            <div className="flex justify-center pt-2 font-serif text-2xl text-white">
                                {editingHabit ? 'Edit Habit' : 'New Habit'}
                            </div>
                        </div>
                        <div className="h-full flex w-full flex-col">
                            <div className=" h-20 w-full">
                                <div className="text-base text-white ml-6">🗎 Habit Name <span className="text-red-500">*</span></div>
                                <div className="border border-[#dad085] rounded-lg h-10 text-sm items-center flex w-[90%] mt-1 mr-4 ml-5">
                                    <input 
                                        type="text" 
                                        value={habitName}
                                        className="pl-2 text-white w-full h-full bg-transparent focus:outline-none" 
                                        placeholder="Enter Habit Name...."
                                        onChange={(e) => {
                                            setHabitName(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className=" h-20 w-full">
                                <div className="flex flex-row">
                                    <div className="ml-4 w-[92%]">
                                        <label className="text-base text-white ml-3">⚐ Habit Schedule</label>
                                        
                                        <div className="grid grid-cols-3 gap-1 mt-1 bg-black/20 p-1 rounded-xl border border-[#dad085]">
                                            <button 
                                                type="button"
                                                onClick={() => setScheduleType('everyday')}
                                                className={`py-2 text-xs font-medium rounded-lg transition-all ${scheduleType === 'everyday' ? 'bg-white text-amber-500 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                            >
                                                Everyday
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setScheduleType('weekdays')}
                                                className={`py-2 text-xs font-medium rounded-lg transition-all ${scheduleType === 'weekdays' ? 'bg-white text-amber-500 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                            >
                                                Weekdays
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setScheduleType('custom')}
                                                className={`py-2 text-xs font-medium rounded-lg transition-all ${scheduleType === 'custom' ? 'bg-white text-amber-500 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                            >
                                                Custom Date
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 min-h-10">
                                {scheduleType === 'custom' ? (
                                    <div className="flex justify-between px-6 py-1">
                                        {[
                                            { label: 'M', num: 1 },
                                            { label: 'T', num: 2 },
                                            { label: 'W', num: 3 },
                                            { label: 'T', num: 4 },
                                            { label: 'F', num: 5 },
                                            { label: 'S', num: 6 },
                                            { label: 'S', num: 0 },
                                        ].map((day, idx) => {
                                            const isSelected = customDays.includes(day.num)
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => toggleDays(day.num)}
                                                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                                                        isSelected ? 'bg-white text-amber-600 shadow' : 'bg-black/20 text-white/50 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {day.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-xs text-white text-center italic pt-2">
                                        Repeats {scheduleType === 'everyday' ? 'every day (Mon - Sun)' : 'Monday through Friday'}.
                                    </div>
                                )}
                            </div>
                            <div className=" flex-1 pt-2 w-full">
                                <div className="flex flex-row justify-between">
                                    <div>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setIsOpen(false)
                                            }}
                                            className="text-base text-white ml-5 mt-1 pb-1 border-2 rounded-lg hover:transition-all shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] border-lime-300 bg-lime-600 w-22 items-center cursor-pointer justify-center h-10 "
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button 
                                            type='button'
                                            onClick={handleCreateHabit}
                                            className="pl-3 text-base text-white mr-5 mt-1 pb-1 border-2 rounded-lg w-40 items-center justify-center h-10 pr-2 hover:transition-all shadow-md transition-all duration-150 active:scale-95 hover:scale-[1.04] border-lime-300 bg-lime-600"
                                        >
                                            {editingHabit ? '✎ Save Habit' : '✎ Create Habit'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default NewHabit