import React from 'react'

    const UNIVERSAL_DOODLES = [
  // 1. Stack / Layers
  {
    bg: '#E2ECE9', stroke: '#3B4D47',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 L20 7.5 L12 11.5 L4 7.5 Z" />
        <path d="M4.5 12 L12 16 L19.5 12" />
        <path d="M4.5 16.5 L12 20.5 L19.5 16.5" />
      </svg>
    )
  },
  // 2. Sparkle / Star
  {
    bg: '#F5E3DB', stroke: '#4E3A33',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2 C12.8 7.5 15.5 10.2 19.8 11 C15.5 11.8 12.8 14.5 12 18.8 C11.2 14.5 8.5 11.8 4.2 11 C8.5 10.2 11.2 7.5 12 3.2 Z" />
      </svg>
    )
  },
  // 3. Focus Target
  {
    bg: '#C1A9B4', stroke: '#382B33',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5 L12 5.5" />
        <path d="M12 18.5 L12 21.5" />
        <path d="M2.5 12 L5.5 12" />
        <path d="M18.5 12 L21.5 12" />
      </svg>
    )
  },
  // 4. Growth Sprout
  {
    bg: '#E8C5C8', stroke: '#4A3437',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21 V10" />
        <path d="M12 14 C8.5 14 6 10.5 6 6 C10.5 6 12 9.5 12 14 Z" />
        <path d="M12 11 C14.5 9 17.5 7.5 19.5 8.5 C20 11.5 17 14 12 14" />
      </svg>
    )
  },
  // 5. Compass
  {
    bg: '#D6E2E9', stroke: '#2F434E',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <polygon points="14.8,9.2 13.2,14.8 9.2,14.8 10.8,9.2" fill={`${c}22`} />
        <line x1="12" y1="3.5" x2="12" y2="6.5" />
      </svg>
    )
  },
  // 6. Isometric Cube
  {
    bg: '#EBDCB9', stroke: '#473C26',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z" />
        <path d="M12 12 L20 7.5" />
        <path d="M12 12 V21" />
        <path d="M12 12 L4 7.5" />
      </svg>
    )
  },
  // 7. Lightbulb / Idea
  {
    bg: '#FFF2C6', stroke: '#4D4321',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z" />
        <path d="M12 7v3" />
      </svg>
    )
  },
  // 8. Lightning / Speed
  {
    bg: '#E8E3F5', stroke: '#3C344D',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 L4.5 13.5 L11.5 13.5 L10.5 22 L19.5 10.5 L12.5 10.5 Z" />
      </svg>
    )
  },
  // 9. Milestone Flag
  {
    bg: '#DCECE7', stroke: '#324740',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21V3" />
        <path d="M5 4c3-1.5 6-1.5 9 0s5 1 5 1v8s-2-1-5-1-6 1.5-9 0" />
        <circle cx="5" cy="21" r="1" fill={c} />
      </svg>
    )
  },
  // 10. Diamond / Quality
  {
    bg: '#F5DCDA', stroke: '#4F3331',
    svg: (c) => (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3.5h12l4 5.5-10 11.5L2 9z" />
        <path d="M10.5 3.5L8 9l4 10.5L16 9l-2.5-5.5" />
        <path d="M2 9h20" />
      </svg>
    )
  }
];
    export function getUniversalDoodle(identifier = "") {
    let hash = 0
    const str = String(identifier)
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % UNIVERSAL_DOODLES.length
    return UNIVERSAL_DOODLES[index]
}



function ProjectCard({ project, tasks = [], deleteProject, editProject }) {
    // Dynamic progress calculation
    const projectTasks = tasks.filter((t) => t.project === project.projectName)
    const total = projectTasks.length
    const completed = projectTasks.filter((t) => t.completed).length
    const progress = total === 0 ? (project.progress || 0) : Math.round((completed / total) * 100)
    const doodle = getUniversalDoodle(project.id || project.projectName)

    return (
        <div className='border border-[#dad085] bg-white rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-60'>
            <div className='flex flex-col'>

    <div className='flex justify-between items-center w-full'>
        <div className='flex items-center gap-2.5'>
            <div 
                style={{
                backgroundColor: doodle.bg,
                border: `1.5px solid ${doodle.stroke}25`,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03), inset 0 -2px 0px rgba(0,0,0,0.04)'
                }}
                className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0'
                >
                {doodle.svg(doodle.stroke)}
                </div>                        
                    <h3 className='text-xl font-serif font-medium text-gray-900 leading-none'>
                        {project.projectName}
                    </h3>
                </div>

                <select 
                    value=""
                    className='text-gray-500 hover:text-gray-800 cursor-pointer outline-none bg-transparent appearance-none text-base font-bold'
                    onChange={(e) => {
                        if (e.target.value === "delete") deleteProject(project.id)
                        if (e.target.value === "edit") editProject(project)
                    }}
                    >
                    <option value="" disabled>•••</option>
                    <option value="edit" className="text-black">Edit</option>
                    <option value="delete" className="text-black">Delete</option>
                    </select>
                </div>

                <p className='text-gray-600 text-sm mt-2 line-clamp-2'>
                    {project.description?.length > 60
                        ? project.description.slice(0, 60) + "..."
                        : project.description || "No description"}
                </p>
            </div>

            <div className='w-full my-3'>
                <div className='flex justify-between items-center mb-1 text-xs'>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                        progress === 100 
                            ? "bg-green-100 text-green-800"
                            : project.status?.toLowerCase() === "active" 
                                ? "bg-emerald-100 text-emerald-800" 
                                : "bg-amber-100 text-amber-800"
                    }`}>
                        {progress === 100 ? "Completed" : project.status || "None"}
                    </span>
                    
                    <span className='font-semibold text-gray-600'>{progress}%</span>
                </div>
                <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div 
                        className='h-full bg-emerald-800 rounded-full transition-all duration-300'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className='flex justify-between items-center text-xs text-gray-500 border-t pt-2'>
                <span>Tasks: {total}</span>
                <span>Target: {project.targetDate ? project.targetDate.split("T")[0] : "No Deadline"}</span>
            </div>
        </div>
    )
}

export default ProjectCard