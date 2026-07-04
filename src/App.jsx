import { useState, useEffect } from 'react'
import Globe from './components/Globe'
import Clock from './components/Clock'
import Counter from './components/Counter'
import StarField from './components/StarField'
import CassetteSelector from './components/CassetteSelector'
import CassettePlayer from './components/CassettePlayer'
import MemoryFolder from './components/MemoryFolder'
import Admin from './pages/Admin'

const STORAGE_KEY = 'memory-globe-locations'

const DEFAULT_LOCATIONS = [
  {
    id: 1,
    name: '宁波',
    lat: 29.8683,
    lon: 121.5440,
    photos: [],
    notes: [],
    cassettes: [
      { id: 1, title: 'Song 1', url: '', cover: '' },
      { id: 2, title: 'Song 2', url: '', cover: '' },
      { id: 3, title: 'Song 3', url: '', cover: '' },
    ]
  },
]

function App() {
  const [view, setView] = useState('home')
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showCassetteSelector, setShowCassetteSelector] = useState(false)
  const [selectedCassette, setSelectedCassette] = useState(null)
  const [showCassettePlayer, setShowCassettePlayer] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setLocations(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setLocations(JSON.parse(saved))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
    setAutoRotate(false)
    setShowCassetteSelector(true)
    setShowCassettePlayer(false)
    setIsMinimized(false)
    setFolderOpen(false)
  }

  const handleCassetteSelect = (cassette) => {
    setSelectedCassette(cassette)
    setShowCassetteSelector(false)
    setShowCassettePlayer(true)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleCloseMemory = () => {
    setSelectedLocation(null)
    setShowCassetteSelector(false)
    setShowCassettePlayer(false)
    setIsMinimized(false)
    setFolderOpen(false)
    setAutoRotate(true)
  }

  if (view === 'admin') {
    return <Admin onBack={() => setView('home')} />
  }

  return (
    <div className="min-h-screen relative">
      <StarField />

      <div className="relative z-10">
        <header className="p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-center flex-1">回忆地球仪</h1>
            <button
              onClick={() => setView('admin')}
              className="text-white/60 hover:text-white text-sm px-2 py-1"
            >
              管理
            </button>
          </div>
          <Clock />
        </header>

        <Counter />

        <main>
          <div className="h-[50vh] md:h-[600px]">
            <Globe
              locations={locations}
              onLocationClick={handleLocationClick}
              autoRotate={autoRotate}
            />
          </div>
        </main>

        {/* Cassette Selector Modal */}
        {showCassetteSelector && selectedLocation && (
          <CassetteSelector
            cassettes={selectedLocation.cassettes || []}
            onSelect={handleCassetteSelect}
            onClose={handleCloseMemory}
          />
        )}

        {/* Cassette Player */}
        {showCassettePlayer && selectedCassette && (
          <div className="fixed bottom-8 right-8 z-40">
            <CassettePlayer
              cassette={selectedCassette}
              onMinimize={handleMinimize}
              isMinimized={isMinimized}
            />
          </div>
        )}

        {/* Memory Folder */}
        {selectedLocation && !showCassetteSelector && (
          <MemoryFolder
            location={selectedLocation}
            onClose={handleCloseMemory}
            isOpen={folderOpen}
            onToggleOpen={() => setFolderOpen(!folderOpen)}
          />
        )}
      </div>
    </div>
  )
}

export default App
