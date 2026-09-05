import React, { useState, useEffect } from 'react'
import { Sidebar } from '../Components'

function Settings({ 
  tasks = [], 
  project = [], 
  habit = [], 
  notes = [] 
}) {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('app_user_name') || ''
  })
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(userName)
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light'
  })
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('app_user_name', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('app_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications))
  }, [notifications])

  const handleNameSave = () => {
    if (tempName.trim()) {
        setUserName(tempName.trim())
    }
    setIsEditingName(false)
}

useEffect(() => {
    localStorage.setItem('app_user_name', userName)
    window.dispatchEvent(new Event('app_user_name_updated'))
}, [userName])
  // --- Export JSON ---
  const handleExportJSON = () => {
    const fullData = {
      user: userName,
      exportedAt: new Date().toISOString(),
      tasks,
      project,
      habit,
      notes,
    }
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `taskflow-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // --- Export CSV ---
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Category,Title/Name,Status/Details,Date\n'
    
    tasks.forEach((t) => {
      const status = t.completed ? 'Completed' : 'Pending'
      csvContent += `Task,"${(t.title || 'Untitled').replace(/"/g, '""')}","${status}","${t.date || ''}"\n`
    })

    habit.forEach((h) => {
      csvContent += `Habit,"${(h.habitName || 'Untitled').replace(/"/g, '""')}","${h.currentStreak || 0} days streak",""\n`
    })

    project.forEach((p) => {
      csvContent += `Project,"${(p.projectName || 'Untitled').replace(/"/g, '""')}","${p.status || 'Active'}",""\n`
    })

    notes.forEach((n) => {
      csvContent += `Note,"${(n.title || 'Untitled').replace(/"/g, '""')}","${(n.content || '').substring(0, 30).replace(/"/g, '""')}...","${n.date || ''}"\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `taskflow-data-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="h-screen w-screen flex bg-[#EDE7DC] text-[#2C3328] font-sans overflow-hidden select-none">
      <Sidebar activeTab="Settings" />

      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header (replaces old Navbar) */}
        <header className="flex items-center justify-between ml-2 pl-6">
          <div>
            <h1 className="text-3xl font-serif font-medium mt-1">Settings</h1>
            <p className="text-black font-serif text-lg mb-2">Manage your preferences and app settings.</p>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 flex flex-col justify-between px-8 py-4 h-full overflow-hidden">
          
          {/* Settings Cards Container — bigger p-7/gap-7, bigger icons & text so it actually reads as "bigger" not just padded */}
          <section className="flex flex-col gap-4.5 my-1 max-w-7xl w-full">
            
            {/* Card 1: Name */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-6 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#143022] text-[#a8b815] flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#143022]">Name</h3>
                  <p className="text-sm text-[#70766B] mt-0.5">Customize your display name.</p>
                </div>
              </div>

              {/* Editable Name Field */}
              <div className="flex items-center bg-[#FAF7F2] border border-[#EDE7DC] rounded-xl px-4 py-2 gap-3 min-w-65 justify-between shadow-inner">
                {isEditingName ? (
                  <input
                    type="text"
                    autoFocus
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameSave}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="bg-transparent text-sm font-semibold text-[#143022] outline-none w-full"
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#143022]">{userName}</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingName) handleNameSave()
                    else {
                      setTempName(userName)
                      setIsEditingName(true)
                    }
                  }}
                  className="text-sm text-[#70766B] hover:scale-[1.04] hover:text-[#143022] transition-colors cursor-pointer"
                  title="Edit Name"
                >
                  ✏️
                </button>
              </div>
            </div>

            {/* Card 2: Theme */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-6 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#143022] text-[#a8b815] flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#143022]">Theme</h3>
                  <p className="text-sm text-[#70766B] mt-0.5">Choose your preferred theme.</p>
                </div>
              </div>

              {/* Segmented Light/Dark Toggle */}
              <div className="flex items-center border border-[#EDE7DC] rounded-xl p-1 bg-[#FAF7F2]">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-4  hover:scale-[1.04] font-serif py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-[#BA9F64] text-white shadow-xs font-bold'
                      : 'text-[#70766B] hover:text-[#143022]'
                  }`}
                >
                  <span>☀️</span>
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-4 py-2 hover:scale-[1.04] rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#143022] text-[#A3E635] shadow-xs font-bold'
                      : 'text-[#70766B] hover:text-[#143022]'
                  }`}
                >
                  <span>🌙</span>
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Card 3: Push Notifications */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-6 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#143022] text-[#a8b815] flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#143022] font-serif">Push Notifications</h3>
                  <p className="text-sm text-[#70766B] mt-0.5">Enable or disable push notifications.</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-colors hover:scale-[1.04] relative cursor-pointer focus:outline-none ${
                  notifications ? 'bg-[#8C9B6E]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md hover:scale-[1.04] transition-transform absolute top-1 ${
                    notifications ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Card 4: Export Data */}
            <div className="bg-[#fefefb] border border-[#dad085] rounded-2xl p-6 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#143022] text-[#a8b815] flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-[#143022]">Export Data</h3>
                  <p className="text-sm text-[#70766B] mt-0.5">Export your data in CSV or JSON format.</p>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                  background: 'linear-gradient(180deg, #E8DCB8 0%, #E8DCB8 50%, #E8DCB8 100%)',
                  boxShadow:
                    'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                  border: '1px solid #E8DCB8',
                  textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                }}
                  className="flex items-center hover:scale-[1.04] gap-1.5 px-4 py-2 rounded-xl font-serif border border-[#2C3328] text-sm font-semibold text-[#143022] hover:bg-[#FAF7F2] active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <span>📄</span>
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJSON}
                  style={{
                  background: 'linear-gradient(180deg, #E8DCB8 0%, #E8DCB8 50%, #E8DCB8 100%)',
                  boxShadow:
                    'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                  border: '1px solid #E8DCB8',
                  textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                }}
                  className="flex items-center font-serif gap-1.5 hover:scale-[1.04] px-4 py-2 rounded-xl border border-[#2C3328] text-sm font-semibold text-[#143022] hover:bg-[#FAF7F2] active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <span>&#123;&#125;</span>
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Card 5: Your Data is Safe */}
            <div className="bg-[#fefefb] border font-serif border-[#dad085] rounded-2xl p-6 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#143022] text-[#a8b815] flex items-center justify-center shrink-0 shadow-xs">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#143022]">Your Data is Safe</h3>
                  <p className="text-sm text-[#70766B] mt-0.5">
                    All your data is stored locally on your device. We never access or share your information.
                  </p>
                </div>
              </div>

              {/* Shield / Lock Emblem */}
              <div className="w-14 h-14 rounded-xl bg-[#143022] flex items-center justify-center text-xl shadow-xs shrink-0">
                🔒
              </div>
            </div>

          </section>


        </main>
      </div>
    </div>
  )
}

export default Settings