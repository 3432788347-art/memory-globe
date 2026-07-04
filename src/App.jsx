import { useState, useEffect } from 'react'
import Globe from './components/Globe'
import LocationModal from './components/LocationModal'
import Clock from './components/Clock'
import Counter from './components/Counter'
import Admin from './pages/Admin'

const STORAGE_KEY = 'memory-globe-locations'

const DEFAULT_LOCATIONS = [
  { id: 1, name: '北京', lat: 39.9042, lon: 116.4074, content: '第一次相遇的地方', image: '', music: '' },
  { id: 2, name: '纽约', lat: 40.7128, lon: -74.0060, content: '共同的旅行回忆', image: '', music: '' },
  { id: 3, name: '伦敦', lat: 51.5074, lon: -0.1278, content: '未来的约定', image: '', music: '' },
]

function App() {
  const [view, setView] = useState('home')
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setLocations(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setLocations(JSON.parse(saved))
      }
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(() => {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setLocations(JSON.parse(saved))
      }
    }, 1000)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
  }

  const handleCloseModal = () => {
    setSelectedLocation(null)
  }

  if (view === 'admin') {
    return <Admin onBack={() => setView('home')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-center flex-1">回忆地球仪</h1>
          <button
            onClick={() => setView('admin')}
            className="text-slate-400 hover:text-white text-sm px-2 py-1"
          >
            管理
          </button>
        </div>
        <Clock />
      </header>
      <Counter />
      <main>
        <div className="h-[50vh] md:h-[600px]">
          <Globe locations={locations} onLocationClick={handleLocationClick} />
        </div>
      </main>
      <LocationModal location={selectedLocation} onClose={handleCloseModal} />
    </div>
  )
}

export default App
