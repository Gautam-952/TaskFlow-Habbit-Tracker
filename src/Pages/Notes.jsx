import React, { useState } from 'react'
import { Sidebar } from '../Components'

function Notes({ notes = [], setNotes }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  const openNewModal = () => {
    setEditingNote(null)
    setNoteTitle('')
    setNoteContent('')
    setIsOpen(true)
  }

  const openEditModal = (note) => {
    setEditingNote(note)
    setNoteTitle(note.title || '')
    setNoteContent(note.content || '')
    setIsOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!noteContent.trim()) return

    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, title: noteTitle.trim(), content: noteContent.trim(), date: 'Edited recently' }
            : n
        )
      )
    } else {
      const newEntry = {
        id: Date.now(),
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent.trim(),
        date: new Date().toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }),
      }
      setNotes((prev) => [newEntry, ...prev])
    }

    setIsOpen(false)
    setEditingNote(null)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="h-screen w-screen flex bg-[#EDE7DC] text-[#2C3328] font-sans overflow-hidden select-none">
      <Sidebar activeTab="Notes" />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (replaces old Navbar) */}
        <header className="flex items-center justify-between mb-2 ml-2 pl-6">
          <div>
            <h1 className="text-3xl font-serif font-medium mt-1">Notes</h1>
            <p className="text-black font-serif text-lg mb-2">Capture your thoughts and daily notes at one place.</p>
          </div>
        </header>

        {/* Full-Page Workspace */}
        <main className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
          <div
            className="w-full h-full flex flex-col rounded-3xl overflow-hidden shadow-xl"
            style={{
              backgroundColor: '#F5EFE4',
              boxShadow:
                '0 15px 35px -5px rgba(80, 60, 40, 0.18), 0 0 0 1px rgba(210, 195, 175, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Top Ribbon */}
            <header
              className="flex items-center justify-between px-8 py-4 border-b border-[#E3D6C1] shrink-0"
              style={{
                backgroundColor: '#EBE1D0',
                boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8C7D6B] tracking-wider uppercase">
                  All Notes
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DDCDB6] text-[#5C4F3F]">
                  {notes.length}
                </span>
              </div>

              {/* Metallic Gold Pill Button */}
              <button
                type="button"
                onClick={openNewModal}
                className="px-5 py-2 hover:scale-[1.04] rounded-full text-xs font-bold text-[#3B2912] cursor-pointer transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-md"
                style={{
                  background: 'linear-gradient(180deg, #D6AD66 0%, #B88942 50%, #9E702D 100%)',
                  boxShadow:
                    'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                  border: '1px solid #8C6226',
                  textShadow: '0 1px 0 rgba(255, 235, 195, 0.4)',
                }}
              >
                <span>+</span>
                <span>New Note</span>
              </button>
            </header>

            {/* Note Content Area */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
              <h1
                className="text-3xl font-serif font-bold text-[#1D3B2B] tracking-tight mb-5 shrink-0"
                style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
              >
                Notes
              </h1>

              {/* Full-width List of Inset Strips */}
              <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-3 pb-2">
                {notes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-[#9C8F7E] text-sm">
                    <p className="font-semibold">No notes written yet.</p>
                    <p className="text-xs mt-1 text-[#B0A392]">Click "New Note" to jot down your thoughts.</p>
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => openEditModal(note)}
                      className="group relative p-4 rounded-2xl cursor-pointer transition-all duration-150 shrink-0 hover:scale-[1.003]"
                      style={{
                        backgroundColor: '#E8DCB8',
                        boxShadow:
                          'inset 0 3px 6px rgba(90, 70, 45, 0.22), inset 0 1px 2px rgba(70, 50, 30, 0.15), 0 1px 0 rgba(255, 255, 255, 0.7)',
                        border: '1px solid #D8CA9F',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-sm font-bold text-[#2B2317] tracking-tight font-serif">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] font-medium text-[#7C6E5C]">{note.date}</span>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(note.id, e)}
                            title="Delete Note"
                            className="opacity-0 group-hover:opacity-100 text-[#8C3B30] hover:text-[#B91C1C] text-xs font-bold px-1 transition-opacity cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-[#423728] leading-relaxed mt-1.5">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Write / Edit Note */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF6ED]/30 backdrop-blur-md p-4">
          <div
            className="w-full max-w-lg rounded-3xl p-6 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-150 shadow-2xl"
            style={{
              backgroundColor: '#F5EFE4',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px #D8CA9F',
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-[#1D3B2B]">
                {editingNote ? 'Edit Note' : 'Write Note'}
              </h2>
              <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-[#8C3B30] hover:text-white hover:bg-[#B91C1C] transition-all cursor-pointer shadow-xs active:scale-90 shrink-0"
              >
              ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3.5">
              <input
                type="text"
                placeholder="Title (Optional)"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-xs font-semibold text-[#2C2317] placeholder-[#A09280] outline-none"
                style={{
                  backgroundColor: '#E8DCB8',
                  boxShadow: 'inset 0 2px 4px rgba(90, 70, 45, 0.15)',
                  border: '1px solid #D8CA9F',
                }}
              />

              <textarea
                rows={6}
                required
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full p-4 rounded-xl text-xs font-medium text-[#2C2317] placeholder-[#A09280] outline-none resize-none leading-relaxed"
                style={{
                  backgroundColor: '#E8DCB8',
                  boxShadow: 'inset 0 2px 4px rgba(90, 70, 45, 0.15)',
                  border: '1px solid #D8CA9F',
                }}
              />

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#6D5D4B] hover:bg-[#E8DCB8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#3B2912] transition-transform active:scale-95 cursor-pointer shadow-md"
                  style={{
                    background: 'linear-gradient(180deg, #D6AD66 0%, #B88942 50%, #9E702D 100%)',
                    boxShadow:
                      'inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(110, 75, 25, 0.25)',
                    border: '1px solid #8C6226',
                  }}
                >
                  {editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes