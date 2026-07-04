import { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'

// Draggable item component - 长按拖动，单击放大
function DraggableItem({ item, onSelect, zIndex, onBringToFront }) {
  const nodeRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLongPress, setIsLongPress] = useState(false)
  const longPressTimer = useRef(null)
  const rotation = item.rotation || (Math.random() * 6 - 3)

  const handleMouseDown = () => {
    // 长按 300ms 后开始拖动
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true)
    }, 300)
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    // 如果没有进入拖动状态，则视为单击
    if (!isLongPress) {
      onSelect(item)
    }
    setIsLongPress(false)
  }

  const handleDragStart = () => {
    setIsDragging(true)
    onBringToFront()
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleDragStop = (e, data) => {
    setIsDragging(false)
    setIsLongPress(false)
    // 检查是否真的移动了（而不是点击）
    if (Math.abs(data.x) < 5 && Math.abs(data.y) < 5) {
      // 移动距离太小，视为单击
      onSelect(item)
    }
  }

  const baseStyle = {
    position: 'absolute',
    transform: `rotate(${rotation}deg)`,
    cursor: isDragging ? 'grabbing' : 'pointer',
    transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
    zIndex,
  }

  if (item.type === 'photo' || item.type === 'polaroid') {
    return (
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragStop}
      >
        <div
          ref={nodeRef}
          style={baseStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-400/40 backdrop-blur-sm rotate-[-2deg] z-10 pointer-events-none" />
          <div className="polaroid">
            <img src={item.url} alt="" className="w-40 h-32 object-cover pointer-events-none" />
            {item.caption && (
              <p className="font-handwritten text-gray-600 text-sm mt-3 text-center pointer-events-none">{item.caption}</p>
            )}
          </div>
        </div>
      </Draggable>
    )
  }

  if (item.type === 'note' || item.type === 'sticky') {
    return (
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragStop}
      >
        <div
          ref={nodeRef}
          style={baseStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <div
            className="sticky-note w-40"
            style={{ backgroundColor: item.color || '#fef3c7' }}
          >
            <p className="font-handwritten text-gray-800 text-base leading-relaxed">{item.text}</p>
          </div>
        </div>
      </Draggable>
    )
  }

  if (item.type === 'tape') {
    return (
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragStop}
      >
        <div
          ref={nodeRef}
          style={baseStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg p-2 shadow-card">
            <div className="w-28 h-16 bg-slate-900 rounded flex items-center justify-center">
              {item.cover ? (
                <img src={item.cover} alt="" className="w-full h-full object-cover rounded pointer-events-none" />
              ) : (
                <span className="text-slate-500 text-xs">TAPE</span>
              )}
            </div>
            <p className="text-white text-xs text-center mt-1 truncate pointer-events-none">{item.title}</p>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

// Main Folder Component
export default function MemoryFolder({ location, onClose, isOpen, onToggleOpen, onBackToMap }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [zIndexCounter, setZIndexCounter] = useState(10)
  const [items, setItems] = useState(() => {
    const photos = (location?.photos || []).map((p, i) => ({ ...p, type: 'polaroid', id: `photo-${i}` }))
    const notes = (location?.notes || []).map((n, i) => ({ ...n, type: 'sticky', id: `note-${i}` }))
    const tapes = (location?.cassettes || []).map((c, i) => ({ ...c, type: 'tape', id: `tape-${i}` }))
    return { photos, notesAndTapes: [...notes, ...tapes] }
  })

  useEffect(() => {
    const photos = (location?.photos || []).map((p, i) => ({ ...p, type: 'polaroid', id: `photo-${i}` }))
    const notes = (location?.notes || []).map((n, i) => ({ ...n, type: 'sticky', id: `note-${i}` }))
    const tapes = (location?.cassettes || []).map((c, i) => ({ ...c, type: 'tape', id: `tape-${i}` }))
    setItems({ photos, notesAndTapes: [...notes, ...tapes] })
    setZIndexCounter(10)
  }, [location])

  const bringToFront = () => {
    setZIndexCounter(prev => prev + 1)
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item)
  }

  const closeViewer = () => {
    setSelectedItem(null)
  }

  // Full-screen folder view
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-30 flex flex-col">
        {/* Glass background overlay */}
        <div className="absolute inset-0 bg-cosmic-deep-blue/80 backdrop-blur-md" />

        {/* Header with back button - glass effect */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.1] bg-white/[0.05] backdrop-blur-md">
          <button
            onClick={onBackToMap}
            className="px-4 py-2 bg-archive-blue-folder/80 text-archive-cream rounded font-typewriter text-sm hover:bg-archive-blue-folder transition-colors backdrop-blur-sm"
          >
            ← Back to Map
          </button>
          <h2 className="font-typewriter text-archive-cream text-lg">{location?.name || 'Memory Archive'}</h2>
          <button
            onClick={onClose}
            className="text-archive-cream/70 hover:text-archive-cream text-2xl"
          >
            ×
          </button>
        </div>

        {/* Folder container */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-4xl">
            {/* Binder clip */}
            <div className="flex justify-center mb-2">
              <div className="binder-clip w-24 h-10 flex items-center justify-center">
                <div className="w-20 h-2 bg-gray-500 rounded" />
              </div>
            </div>

            {/* Glass folder container */}
            <div className="bg-white/[0.1] backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden border border-white/[0.15]">
              {/* Folder tab */}
              <div className="bg-white/[0.05] h-6 rounded-t-lg border-b border-white/[0.08]" />

              {/* Folder front with glass effect */}
              <div className="bg-white/[0.08] backdrop-blur-md">
                {/* Content - Two page layout */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left page - Notes - glass effect */}
                    <div className="bg-white/[0.05] backdrop-blur-sm p-4 rounded-lg border border-white/[0.1] min-h-[300px]">
                      <h4 className="font-typewriter text-archive-cream/70 text-sm tracking-wide mb-4">▤ NOTES</h4>

                      {/* Draggable notes board */}
                      <div
                        className="relative h-64 bg-gradient-to-br from-white/[0.1] to-white/[0.05] rounded border border-white/[0.15] backdrop-blur-sm"
                        style={{ minHeight: '250px', overflow: 'visible' }}
                      >
                        {items.notesAndTapes.length === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center text-archive-cream/40">
                            <span className="font-typewriter">No Notes</span>
                          </div>
                        ) : (
                          items.notesAndTapes.map((item, index) => (
                            <DraggableItem
                              key={item.id}
                              item={item}
                              onSelect={handleItemSelect}
                              zIndex={index + 1}
                              onBringToFront={bringToFront}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right page - Photos - glass effect */}
                    <div className="bg-white/[0.05] backdrop-blur-sm p-4 rounded-lg border border-white/[0.1] min-h-[300px]">
                      <h4 className="font-typewriter text-archive-cream/70 text-sm tracking-wide mb-4">◉ PHOTOS</h4>

                      {/* Draggable photos board */}
                      <div
                        className="relative h-64 bg-gradient-to-br from-white/[0.1] to-white/[0.05] rounded border border-white/[0.15] backdrop-blur-sm"
                        style={{ minHeight: '250px', overflow: 'visible' }}
                      >
                        {items.photos.length === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center text-archive-cream/40">
                            <span className="font-typewriter">No Photos</span>
                          </div>
                        ) : (
                          items.photos.map((item, index) => (
                            <DraggableItem
                              key={item.id}
                              item={item}
                              onSelect={handleItemSelect}
                              zIndex={index + 1}
                              onBringToFront={bringToFront}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={onToggleOpen}
                    className="w-full mt-6 py-3 bg-white/[0.1] text-archive-cream/70 font-typewriter rounded hover:bg-white/[0.15] transition-colors border border-white/[0.1]"
                  >
                    {isOpen ? '▲ Collapse Folder' : '▼ Expand Archive'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full screen viewer */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-cosmic-black/95 flex items-center justify-center p-8" onClick={closeViewer}>
            <div className="max-w-4xl max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              {selectedItem.type === 'polaroid' || selectedItem.type === 'photo' ? (
                <>
                  <img src={selectedItem.url} alt="" className="max-w-full max-h-[70vh] object-contain polaroid transform scale-110" />
                  {selectedItem.caption && (
                    <p className="font-handwritten text-gray-600 text-xl mt-4">{selectedItem.caption}</p>
                  )}
                </>
              ) : selectedItem.type === 'sticky' ? (
                <div className="sticky-note p-8 max-w-lg transform scale-125" style={{ backgroundColor: selectedItem.color || '#fef3c7' }}>
                  <p className="font-handwritten text-xl text-gray-800 leading-relaxed">{selectedItem.text}</p>
                </div>
              ) : selectedItem.type === 'tape' ? (
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg p-4">
                  <div className="w-48 h-32 bg-slate-900 rounded flex items-center justify-center">
                    {selectedItem.cover ? (
                      <img src={selectedItem.cover} alt="" className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-slate-500">TAPE</span>
                    )}
                  </div>
                  <p className="text-white text-center mt-2">{selectedItem.title}</p>
                </div>
              ) : null}
            </div>
            <button onClick={closeViewer} className="absolute top-4 right-4 text-archive-cream text-3xl hover:text-archive-yellow">×</button>
          </div>
        )}
      </div>
    )
  }

  // Collapsed folder (mini view)
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30">
      <div className="w-64 bg-white/[0.1] backdrop-blur-md rounded-lg shadow-folder border border-white/[0.15]">
        <div className="bg-archive-blue-folder/80 backdrop-blur-sm px-4 py-2 flex justify-between items-center rounded-t-lg">
          <span className="font-typewriter text-archive-cream text-sm">{location?.name || 'Memory'}</span>
          <button onClick={onClose} className="text-archive-cream/70 hover:text-archive-cream">×</button>
        </div>
        <div className="p-3 bg-white/[0.05]">
          <p className="text-archive-cream/60 text-xs font-typewriter">
            {(location?.photos?.length || 0) + (location?.notes?.length || 0)} items
          </p>
        </div>
        <button
          onClick={onToggleOpen}
          className="w-full py-2 bg-white/[0.1] text-archive-cream/70 text-sm font-typewriter rounded-b-lg hover:bg-white/[0.15]"
        >
          Open
        </button>
      </div>
    </div>
  )
}
