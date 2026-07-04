import { useLocation, useNavigate } from 'react-router-dom'

const NAV_TABS = [
  { key: 'tape', label: 'TAPE', icon: '◉', path: null }, // Special - opens boombox
  { key: 'archive', label: 'ARCHIVE', icon: '▤', path: '/' },
  { key: 'diary', label: 'DIARY', icon: '✎', path: '/diary' },
]

export default function Hero({ activeTab, onTabChange }) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (tab) => {
    if (tab.path === null) {
      // TAPE is active when on home page
      return location.pathname === '/'
    }
    return location.pathname === tab.path
  }

  const handleClick = (tab) => {
    if (tab.path) {
      navigate(tab.path)
    } else {
      // TAPE - trigger boombox via onTabChange
      onTabChange(tab.key)
    }
  }

  return (
    <header className="relative w-full overflow-hidden">
      {/* Space panoramic background */}
      <div className="absolute inset-0 bg-space-orbit">
        {/* Stars layer */}
        <div className="absolute inset-0 opacity-60">
          <div className="stars-small absolute top-10 left-20 w-1 h-1 bg-white rounded-full" style={{ animation: 'twinkle 3s ease-in-out infinite' }} />
          <div className="stars-small absolute top-20 right-32 w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'twinkle 4s ease-in-out infinite 1s' }} />
          <div className="stars-small absolute top-40 left-1/4 w-1 h-1 bg-white rounded-full" style={{ animation: 'twinkle 2.5s ease-in-out infinite 0.5s' }} />
          <div className="stars-small absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full" style={{ animation: 'twinkle 3.5s ease-in-out infinite 1.5s' }} />
          <div className="stars-small absolute top-80 left-40 w-1.5 h-1.5 bg-white rounded-full" style={{ animation: 'twinkle 2s ease-in-out infinite 2s' }} />
          <div className="stars-small absolute top-96 right-20 w-1 h-1 bg-white rounded-full" style={{ animation: 'twinkle 4.5s ease-in-out infinite 0.8s' }} />
        </div>

        {/* Subtle nebula effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/15 rounded-full blur-3xl" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 px-6 py-8">
        {/* Navigation tabs */}
        <nav className="flex justify-center gap-8 mb-8">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleClick(tab)}
              className={`
                flex items-center gap-2 px-4 py-2 font-typewriter text-sm tracking-widest
                transition-all duration-300 border-b-2
                ${isActive(tab)
                  ? 'text-archive-cream border-archive-yellow-dark'
                  : 'text-cosmic-steel-light border-transparent hover:text-archive-cream hover:border-cosmic-steel'
                }
              `}
            >
              <span className="text-xs opacity-70">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Title section */}
        <div className="text-center relative">
          {/* Sparkle star decoration */}
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 sparkle-star glow-blue hidden lg:block" />

          {/* Chinese subtitle */}
          <p className="font-typewriter text-cosmic-steel-light text-lg tracking-widest mb-2">
            和星星有关的一切
          </p>

          {/* English title */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-archive-cream italic tracking-wide drop-shadow-lg">
            Everything of the stars
          </h1>

          {/* Sparkle star (mirrored) */}
          <div className="absolute -right-16 top-1/2 -translate-y-1/2 sparkle-star glow-blue hidden lg:block" style={{ transform: 'scaleX(-1)' }} />
        </div>

        {/* Decorative line */}
        <div className="flex justify-center mt-6">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cosmic-steel to-transparent" />
        </div>
      </div>

      {/* Inline keyframes for stars */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </header>
  )
}
