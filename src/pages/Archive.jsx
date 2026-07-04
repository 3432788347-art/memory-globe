import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'memory-globe-locations'

export default function Archive() {
  const [locations, setLocations] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setLocations(JSON.parse(saved))
    }
  }, [])

  // Collect all items from all locations
  const allItems = locations.flatMap(loc => {
    const photos = (loc.photos || []).map(p => ({ ...p, locationName: loc.name, type: 'photo' }))
    const notes = (loc.notes || []).map(n => ({ ...n, locationName: loc.name, type: 'note' }))
    return [...photos, ...notes]
  })

  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-archive-cream italic mb-2">ARCHIVE</h1>
          <p className="font-typewriter text-cosmic-steel">
            {allItems.length} memories collected
          </p>
        </div>

        {/* Back to map button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-archive-cream/60 hover:text-archive-cream font-typewriter text-sm"
          >
            ← Back to Map
          </button>
        </div>

        {/* Items grid */}
        {allItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-typewriter text-cosmic-steel">No memories in archive yet.</p>
            <p className="font-typewriter text-cosmic-steel/60 text-sm mt-2">
              Add photos and notes from the map!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className="group cursor-pointer"
              >
                {item.type === 'photo' ? (
                  <div className="polaroid group-hover:-translate-y-2 transition-transform">
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                    <p className="font-typewriter text-xs text-gray-500 mt-2 text-center truncate">
                      {item.locationName}
                    </p>
                  </div>
                ) : (
                  <div
                    className="sticky-note group-hover:-translate-y-2 transition-transform"
                    style={{ backgroundColor: item.color || '#fef3c7' }}
                  >
                    <p className="font-handwritten text-sm text-gray-800 line-clamp-4">
                      {item.text}
                    </p>
                    <p className="font-typewriter text-xs text-gray-500 mt-2">
                      {item.locationName}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Item detail modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-cosmic-black/95 flex items-center justify-center p-8"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'photo' ? (
                <img
                  src={selectedItem.url}
                  alt=""
                  className="max-w-full max-h-[80vh] object-contain polaroid"
                />
              ) : (
                <div
                  className="sticky-note p-8 max-w-lg"
                  style={{ backgroundColor: selectedItem.color || '#fef3c7' }}
                >
                  <p className="font-handwritten text-xl text-gray-800 leading-relaxed">
                    {selectedItem.text}
                  </p>
                  <p className="font-typewriter text-sm text-gray-500 mt-4">
                    — {selectedItem.locationName}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-archive-cream text-2xl hover:text-archive-yellow"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
