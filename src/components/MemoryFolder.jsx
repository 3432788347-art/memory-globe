import { useState } from 'react'
import Draggable from 'react-draggable'

export default function MemoryFolder({ location, onClose, isOpen, onToggleOpen }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const { photos = [], notes = [] } = location || {}

  return (
    <>
      <Draggable handle=".folder-handle">
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30">
          {/* Folder */}
          <div className="w-80 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg shadow-2xl border border-slate-500">
            {/* Handle */}
            <div className="folder-handle cursor-move p-3 border-b border-slate-500">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{location?.name}</span>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Folder content */}
            <div
              className={`p-4 transition-all duration-500 overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {/* Photos */}
              {photos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-slate-400 text-xs mb-2">Photos</h4>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedPhoto(photo)}
                        className="cursor-pointer transform hover:rotate-0 transition-transform"
                        style={{ transform: `rotate(${photo.rotation || (index * 5 - 10)}deg)` }}
                      >
                        <div className="bg-white p-1 rounded shadow">
                          <img
                            src={photo.url}
                            alt=""
                            className={`w-20 h-16 object-cover ${photo.type === 'polaroid' ? 'bg-white' : ''}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {notes.length > 0 && (
                <div>
                  <h4 className="text-slate-400 text-xs mb-2">Notes</h4>
                  <div className="space-y-2">
                    {notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-2 text-sm"
                        style={{
                          backgroundColor: note.color || '#fef3c7',
                          transform: `rotate(${note.rotation || (index * 3 - 6)}deg)`
                        }}
                      >
                        <p className="text-slate-800">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Open/Close button */}
            <button
              onClick={onToggleOpen}
              className="w-full py-2 bg-slate-500 text-white text-sm rounded-b-lg hover:bg-slate-400"
            >
              {isOpen ? '收起文件夹' : '打开文件夹'}
            </button>
          </div>
        </div>
      </Draggable>

      {/* Photo viewer modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto.url}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  )
}
