import { useState, useEffect } from 'react'

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

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl px-5 py-3 text-center border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="text-2xl font-mono text-white font-semibold">{time}</div>
      </div>
    </div>
  )
}

function App() {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setLocations(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, #151d2e 0%, #0a0f1a 100%)' }}>
      <header className="p-4 text-white">
        <h1 className="text-2xl font-bold text-center">回忆地球仪</h1>
        <Clock />
      </header>
      <main className="flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading 3D Globe...</p>
        </div>
      </main>
    </div>
  )
}

export default App
