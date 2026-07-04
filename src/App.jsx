import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Globe from './components/Globe'
import Clock from './components/Clock'
import Counter from './components/Counter'
import StarField from './components/StarField'
import Hero from './components/Hero'
import Boombox from './components/Boombox'
import MemoryFolder from './components/MemoryFolder'
import Admin from './pages/Admin'
import Diary from './pages/Diary'
import Archive from './pages/Archive'

const STORAGE_KEY = 'memory-globe-locations'

const DEFAULT_LOCATIONS = [
  { id: 1, name: 'Ningbo', lat: 29.8683, lon: 121.5440, photos: [], notes: [], cassettes: [] },
  { id: 2, name: 'Shanghai', lat: 31.2304, lon: 121.4737, photos: [], notes: [], cassettes: [] },
  { id: 3, name: 'Beijing', lat: 39.9042, lon: 116.4074, photos: [], notes: [], cassettes: [] },
]

const isEmbedCode = (cassette) => {
  return cassette?.url && (
    cassette.url.includes('iframe') ||
    cassette.url.includes('<embed') ||
    cassette.embedCode?.includes('iframe')
  )
}

// Simple mini player component
function MiniPlayer({ cassette, isPlaying, onPlay, onPause, onOpenFull }) {
  const isEmbed = isEmbedCode(cassette)

  // For embed codes, just show the button that toggles play state
  // The actual embed is rendered in the full Boombox
  return (
    <div className="fixed bottom-8 left-8 z-40">
      <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg p-3 shadow-lifted border-2 border-slate-600">
        <div className="flex gap-3 items-center">
          {/* Speakers with animation - hide for embed, show for audio */}
          {!isEmbed && (
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600">
                <div className={`w-6 h-6 rounded-full bg-slate-900 border border-slate-500 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600">
                <div className={`w-6 h-6 rounded-full bg-slate-900 border border-slate-500 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
            </div>
          )}

          {/* For embed, show music icon */}
          {isEmbed && (
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600">
              <span className="text-2xl">{isPlaying ? '🎵' : '🎶'}</span>
            </div>
          )}

          {/* Track info */}
          <div className="flex flex-col">
            <span className="text-archive-cream text-xs font-typewriter truncate max-w-[100px]">
              {cassette?.title || (isEmbed ? '🎵' : 'Tape')}
            </span>
            <span className="text-archive-yellow text-[10px] font-typewriter">
              {isPlaying ? '▶ Playing' : '○ Ready'}
            </span>
          </div>

          {/* Play/Pause button */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all ${
              isPlaying
                ? 'bg-archive-yellow-dark border-archive-yellow text-cosmic-black'
                : 'bg-green-600 border-green-400 text-white hover:bg-green-500'
            }`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Open full player */}
          <button
            onClick={onOpenFull}
            className="text-archive-cream/60 hover:text-archive-cream text-xl"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  )
}

function HomePage({ locations, loadLocations, globalCassette, setGlobalCassette, globalPlaying, setGlobalPlaying, globalAudioRef }) {
  const [view, setView] = useState('home')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showBoombox, setShowBoombox] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  // Get cassette from global state
  const currentCassette = globalCassette

  // Load cassette audio when selected
  useEffect(() => {
    if (!globalAudioRef.current) return
    if (!currentCassette?.url) return
    if (isEmbedCode(currentCassette)) return

    globalAudioRef.current.src = currentCassette.url
    globalAudioRef.current.load()
  }, [currentCassette, globalAudioRef])

  // Sync playing state with audio - runs whenever playing state changes
  useEffect(() => {
    if (!globalAudioRef.current) return
    if (!currentCassette?.url) return
    if (isEmbedCode(currentCassette)) return

    console.log('Sync audio: playing =', globalPlaying)

    if (globalPlaying) {
      globalAudioRef.current.play().catch(e => console.log('Play error:', e))
    } else {
      globalAudioRef.current.pause()
    }
  }, [globalPlaying, currentCassette, globalAudioRef])

  // Keep audio playing - always ensure audio is playing when globalPlaying is true
  useEffect(() => {
    if (!globalAudioRef.current) return
    if (!currentCassette?.url) return
    if (isEmbedCode(currentCassette)) return

    console.log('Checking audio: playing=', globalPlaying, 'paused=', globalAudioRef.current.paused, 'src=', globalAudioRef.current.src ? 'set' : 'none')

    // Always ensure audio state matches globalPlaying
    if (globalPlaying) {
      if (globalAudioRef.current.paused) {
        console.log('Starting playback')
        globalAudioRef.current.play().catch(e => console.log('Play error:', e))
      }
    } else {
      if (!globalAudioRef.current.paused) {
        console.log('Pausing playback')
        globalAudioRef.current.pause()
      }
    }
  }, [globalPlaying, currentCassette, showBoombox])

  // Extra protection: interval to keep audio playing
  useEffect(() => {
    if (!globalAudioRef.current) return
    if (!currentCassette?.url) return
    if (isEmbedCode(currentCassette)) return
    if (!globalPlaying) return

    const interval = setInterval(() => {
      if (globalAudioRef.current && globalAudioRef.current.paused && globalAudioRef.current.src) {
        console.log('Interval: restarting audio')
        globalAudioRef.current.play().catch(e => {})
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [globalPlaying, currentCassette])

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
    setFolderOpen(true)
    setAutoRotate(false)
    setGlobalPlaying(false)
    if (location.cassettes?.length > 0) {
      setGlobalCassette(location.cassettes[0])
    }
  }

  const handleSelectCassette = (cassette) => {
    setGlobalCassette(cassette)
    setGlobalPlaying(false)
  }

  const handlePlay = () => {
    if (!currentCassette?.url) return

    if (isEmbedCode(currentCassette)) {
      setGlobalPlaying(true)
      return
    }

    if (globalAudioRef.current) {
      globalAudioRef.current.play()
        .then(() => setGlobalPlaying(true))
        .catch(e => console.log('Play error:', e))
    }
  }

  const handlePause = () => {
    if (globalAudioRef.current) {
      globalAudioRef.current.pause()
    }
    setGlobalPlaying(false)
  }

  const handleNext = () => {
    if (!selectedLocation?.cassettes?.length) return
    const idx = selectedLocation.cassettes.findIndex(c => c.id === currentCassette?.id)
    const next = selectedLocation.cassettes[(idx + 1) % selectedLocation.cassettes.length]
    setGlobalCassette(next)
  }

  const handlePrev = () => {
    if (!selectedLocation?.cassettes?.length) return
    const idx = selectedLocation.cassettes.findIndex(c => c.id === currentCassette?.id)
    const prev = selectedLocation.cassettes[(idx - 1 + selectedLocation.cassettes.length) % selectedLocation.cassettes.length]
    setGlobalCassette(prev)
  }

  const handleCloseMemory = () => {
    setSelectedLocation(null)
    setShowBoombox(false)
    setFolderOpen(false)
    setAutoRotate(true)
  }

  const handleTabChange = (tab) => {
    if (tab === 'tape') setShowBoombox(true)
  }

  const allCassettes = locations.flatMap(loc => loc.cassettes || [])

  if (view === 'admin') {
    return <Admin onBack={() => { setView('home'); loadLocations(); }} />
  }

  return (
    <div className="min-h-screen relative">
      <StarField />
      <div className="relative z-10">
        {!folderOpen && !showBoombox && <Hero activeTab="archive" onTabChange={handleTabChange} />}

        {!folderOpen && !showBoombox && (
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Clock />
              <Counter />
              <button
                onClick={() => setView('admin')}
                className="text-archive-cream/60 hover:text-archive-cream text-sm px-3 py-1 border border-archive-cream/30 rounded hover:border-archive-cream/60 transition-colors font-typewriter"
              >
                ADMIN
              </button>
            </div>
          </div>
        )}

        {!folderOpen && (
          <main className="relative">
            <div className="h-[50vh] md:h-[600px] px-4">
              <Globe locations={locations} onLocationClick={handleLocationClick} autoRotate={autoRotate} />
            </div>
            {selectedLocation && (
              <div className="fixed bottom-2 left-2 text-xs font-typewriter text-archive-cream/50">
                ✦ {selectedLocation.name} | ♫ {selectedLocation.cassettes?.length || 0} | ◉ {selectedLocation.photos?.length || 0}
              </div>
            )}
          </main>
        )}

        {selectedLocation && folderOpen && (
          <MemoryFolder
            location={selectedLocation}
            onClose={handleCloseMemory}
            isOpen={folderOpen}
            onToggleOpen={() => setFolderOpen(!folderOpen)}
            onBackToMap={() => { setFolderOpen(false); setAutoRotate(true); }}
          />
        )}

        {selectedLocation && !folderOpen && (
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={() => setFolderOpen(true)}
              className="w-16 h-20 bg-archive-blue-folder rounded-lg shadow-folder flex flex-col items-center justify-center hover:bg-archive-blue-folder/80 transition-colors"
            >
              <span className="text-archive-cream text-xs">📁</span>
              <span className="text-archive-cream text-[10px]">Open</span>
            </button>
          </div>
        )}

        {showBoombox && (
          <Boombox
            cassettes={allCassettes.length > 0 ? allCassettes : selectedLocation?.cassettes || []}
            onSelect={handleSelectCassette}
            isOpen={showBoombox}
            onClose={() => setShowBoombox(false)}
            currentCassette={currentCassette}
            isPlaying={globalPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {/* Mini player - always show when cassette is selected and boombox is closed */}
        {currentCassette && !showBoombox && !folderOpen && (
          <MiniPlayer
            cassette={currentCassette}
            isPlaying={globalPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onOpenFull={() => setShowBoombox(true)}
          />
        )}
      </div>
    </div>
  )
}

function App() {
  const [locations, setLocations] = useState([])
  const [globalCassette, setGlobalCassette] = useState(null)
  const [globalPlaying, setGlobalPlaying] = useState(false)
  const globalAudioRef = useRef(null)

  const loadLocations = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      setLocations(saved ? JSON.parse(saved) : DEFAULT_LOCATIONS)
    } catch (e) {
      setLocations(DEFAULT_LOCATIONS)
    }
  }, [])

  useEffect(() => { loadLocations() }, [loadLocations])
  useEffect(() => { const t = setInterval(loadLocations, 1000); return () => clearInterval(t) }, [loadLocations])

  // Handle audio ended
  useEffect(() => {
    const audio = globalAudioRef.current
    if (!audio) return

    const handleEnded = () => setGlobalPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  // Global mini player for other pages
  const renderMiniPlayer = () => {
    if (!globalCassette) return null

    const handlePlay = () => {
      if (isEmbedCode(globalCassette)) {
        setGlobalPlaying(true)
        return
      }
      if (globalAudioRef.current) {
        globalAudioRef.current.play().then(() => setGlobalPlaying(true)).catch(e => console.log('Play error:', e))
      }
    }

    const handlePause = () => {
      if (globalAudioRef.current) globalAudioRef.current.pause()
      setGlobalPlaying(false)
    }

    return (
      <MiniPlayer
        cassette={globalCassette}
        isPlaying={globalPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onOpenFull={() => {}}
      />
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <HomePage
              locations={locations}
              loadLocations={loadLocations}
              globalCassette={globalCassette}
              setGlobalCassette={setGlobalCassette}
              globalPlaying={globalPlaying}
              setGlobalPlaying={setGlobalPlaying}
              globalAudioRef={globalAudioRef}
            />
          } />
          <Route path="/diary" element={
            <div className="min-h-screen relative">
              <StarField />
              <Diary />
              {renderMiniPlayer()}
            </div>
          } />
          <Route path="/archive" element={
            <div className="min-h-screen relative">
              <StarField />
              <Archive />
              {renderMiniPlayer()}
            </div>
          } />
        </Routes>
      </BrowserRouter>

      {/* Global audio element - outside Router so it persists */}
      <audio ref={globalAudioRef} />
    </>
  )
}

export default App
