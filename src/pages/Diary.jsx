import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const DIARY_KEY = 'memory-globe-diary'

export default function Diary() {
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [newEntry, setNewEntry] = useState('')
  const [isWriting, setIsWriting] = useState(false)
  const textareaRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(DIARY_KEY)
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  const saveEntries = (newEntries) => {
    setEntries(newEntries)
    localStorage.setItem(DIARY_KEY, JSON.stringify(newEntries))
  }

  const handleSave = () => {
    if (!newEntry.trim()) return

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
      content: newEntry,
      timestamp: new Date().toISOString()
    }

    saveEntries([entry, ...entries])
    setNewEntry('')
    setIsWriting(false)
  }

  const handleDelete = (id) => {
    if (confirm('Delete this entry?')) {
      saveEntries(entries.filter(e => e.id !== id))
      setSelectedEntry(null)
    }
  }

  const handleStartWriting = () => {
    setIsWriting(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back button at top - glass style */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.1] backdrop-blur-sm border border-white/[0.15] text-archive-cream/70 hover:text-archive-cream hover:bg-white/[0.15] rounded-lg font-typewriter text-sm transition-all"
          >
            <span>←</span> Back to Map
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-archive-cream italic mb-2">DIARY</h1>
          <p className="font-typewriter text-cosmic-steel">{today}</p>
        </div>

        {/* Glass writing area - always visible when writing */}
        <div className="mb-6">
          <div className="relative">
            {/* Glass container with blur */}
            <div className="bg-white/[0.12] backdrop-blur-xl rounded-2xl border border-white/[0.2] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">

              {/* Top bar */}
              <div className="bg-white/[0.05] px-4 py-2 border-b border-white/[0.1] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-archive-cream/50 text-xs font-typewriter">New Entry</span>
              </div>

              {/* Text area with cursor */}
              <div className="p-4 min-h-[200px]">
                <textarea
                  ref={textareaRef}
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="Start writing..."
                  className="w-full h-40 bg-transparent border-none outline-none font-handwritten text-xl text-archive-cream resize-none placeholder:text-archive-cream/30"
                  onFocus={() => setIsWriting(true)}
                />

                {/* Cursor blink effect when focused */}
                {isWriting && newEntry === '' && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="font-handwritten text-archive-cream/70 text-lg">Start writing</span>
                    <span className="inline-block w-0.5 h-6 bg-archive-cream animate-pulse" />
                  </div>
                )}
              </div>

              {/* Bottom bar with save button */}
              <div className="bg-white/[0.05] px-4 py-3 border-t border-white/[0.1] flex justify-end gap-3">
                <button
                  onClick={() => { setIsWriting(false); setNewEntry(''); }}
                  className="px-4 py-2 text-archive-cream/60 font-typewriter hover:text-archive-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!newEntry.trim()}
                  className="px-6 py-2 bg-archive-blue-folder/80 text-archive-cream rounded font-typewriter hover:bg-archive-blue-folder disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New entry button - alternative */}
        {!isWriting && (
          <button
            onClick={handleStartWriting}
            className="w-full mb-6 py-4 bg-white/[0.05] border-2 border-dashed border-archive-cream/20 rounded-lg text-archive-cream font-typewriter hover:bg-white/[0.1] hover:border-archive-cream/40 transition-all"
          >
            + New Entry
          </button>
        )}

        {/* Entries list */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-typewriter text-cosmic-steel">No entries yet. Start writing!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white/[0.05] backdrop-blur-sm rounded-lg p-4 border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] hover:border-white/[0.15] transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-typewriter text-archive-olive text-sm">{entry.date}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                    className="text-archive-cream/40 hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
                <p className="font-handwritten text-archive-cream text-lg line-clamp-3">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Entry detail modal */}
        {selectedEntry && (
          <div
            className="fixed inset-0 z-50 bg-cosmic-black/90 flex items-center justify-center p-8"
            onClick={() => setSelectedEntry(null)}
          >
            <div
              className="bg-white/[0.12] backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/[0.2]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <p className="font-typewriter text-archive-olive">{selectedEntry.date}</p>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-archive-cream/60 hover:text-archive-cream text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="font-handwritten text-archive-cream text-xl leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
