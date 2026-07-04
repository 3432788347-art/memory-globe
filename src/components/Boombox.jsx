import { useState, useRef, useEffect } from 'react'

// Check if cassette is an embed code
const isEmbedCode = (cassette) => {
  return cassette?.url && (
    cassette.url.includes('iframe') ||
    cassette.url.includes('<embed') ||
    cassette.embedCode?.includes('iframe')
  )
}

// Get the embed code
const getEmbedCode = (cassette) => {
  return cassette?.embedCode || cassette?.url || ''
}

// Modify embed code to add autoplay
const getEmbedCodeWithAutoplay = (cassette, shouldAutoplay) => {
  if (!shouldAutoplay) return getEmbedCode(cassette)

  const code = getEmbedCode(cassette)
  if (!code.includes('iframe')) return code

  // Add autoplay parameter to iframe src
  return code.replace(/src="([^"]*)"/, (match, src) => {
    const separator = src.includes('?') ? '&' : '?'
    return `src="${src}${separator}autoplay=1"`
  })
}

// Illustrated 1980s Boombox Component
export default function Boombox({
  cassettes = [],
  onSelect,
  isOpen = false,
  onClose,
  currentCassette,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
}) {
  const [showTapeList, setShowTapeList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const embedContainerRef = useRef(null)

  // Check if current cassette is an embed
  const isEmbed = isEmbedCode(currentCassette)

  // Handle embed autoplay when isPlaying changes
  useEffect(() => {
    if (!isEmbed || !embedContainerRef.current) return

    const iframe = embedContainerRef.current.querySelector('iframe')
    if (!iframe) return

    if (isPlaying) {
      // Add autoplay to iframe src
      const src = iframe.src || iframe.getAttribute('src')
      if (src && !src.includes('autoplay')) {
        const separator = src.includes('?') ? '&' : '?'
        iframe.src = src + separator + 'autoplay=1'
      }
    } else {
      // Remove autoplay and pause by reloading without autoplay
      const src = iframe.src || iframe.getAttribute('src')
      if (src) {
        iframe.src = src.replace(/[?&]autoplay=1/, '')
      }
    }
  }, [isPlaying, isEmbed])

  // Toggle play/pause - just call the parent's handlers
  const togglePlay = () => {
    if (isPlaying) {
      onPause()
    } else {
      onPlay()
    }
  }

  // Handle tape selection - load tape but don't play
  const handleTapeSelect = (cassette) => {
    // If something is playing, stop it first
    if (isPlaying) {
      onPause()
    }

    // Clear previous embed
    if (embedContainerRef.current) {
      embedContainerRef.current.innerHTML = ''
    }

    setIsLoading(true)
    setTimeout(() => {
      onSelect(cassette)
      setShowTapeList(false)
      setIsLoading(false)
    }, 500)
  }

  const handleEnded = () => {
    onPause()
    if (onNext) onNext()
  }

  // Compact version when minimized
  if (!isOpen) {
    return (
      <div className="fixed bottom-8 left-8 z-40">
        <div className="relative">
          <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg p-4 shadow-lifted border-2 border-slate-600 hover:border-archive-yellow transition-colors">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600">
                <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-500 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600">
                <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-500 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            <p className="text-center text-archive-cream text-xs mt-2 font-typewriter">
              {currentCassette?.title || (isEmbed ? '🎵' : 'TAPES')}
            </p>
          </div>
          {/* Play button overlay */}
          <button
            onClick={togglePlay}
            className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all shadow-lg ${
              isPlaying
                ? 'bg-archive-yellow-dark border-archive-yellow text-cosmic-black'
                : 'bg-green-600 border-green-400 text-white hover:bg-green-500'
            }`}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          {/* Click to open hint */}
          <button
            onClick={onClose}
            className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-cosmic-black px-3 py-1 rounded text-archive-cream text-xs whitespace-nowrap"
          >
            Click to open
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-b from-slate-600 to-slate-800 rounded-2xl p-8 shadow-2xl border-4 border-slate-500 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 rounded-full text-white font-bold shadow-lg hover:bg-red-600 transition-colors"
        >
          ×
        </button>

        {/* Main boombox body */}
        <div className="bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl p-6 border-2 border-slate-500">

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl text-archive-cream italic tracking-wider">COSMIC AUDIO</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-archive-tan to-transparent mx-auto mt-2" />
          </div>

          {/* Display area - either embed or cassette */}
          {isEmbed ? (
            /* Embed code display */
            <div className="mb-6">
              <div className="bg-slate-900 rounded-lg p-4 border-2 border-slate-600">
                <p className="text-center text-archive-yellow text-xs font-typewriter mb-3">
                  {currentCassette?.title || 'Music Embed'}
                </p>
                <div
                  ref={embedContainerRef}
                  className="w-full flex justify-center"
                  dangerouslySetInnerHTML={{ __html: getEmbedCodeWithAutoplay(currentCassette, isPlaying) }}
                />
              </div>
            </div>
          ) : (
            /* Normal cassette display */
            <div className="flex justify-center gap-8 mb-6">
              {/* Left speaker */}
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-slate-800 border border-slate-600 ${isPlaying ? 'animate-cassette' : ''}`} style={{ animationDuration: '1.5s' }}>
                      <div className="w-3 h-3 bg-slate-600 rounded-full m-auto mt-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right speaker */}
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-slate-800 border border-slate-600 ${isPlaying ? 'animate-cassette' : ''}`} style={{ animationDuration: '1.5s' }}>
                      <div className="w-3 h-3 bg-slate-600 rounded-full m-auto mt-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cassette deck (for non-embed only) */}
          {!isEmbed && (
            <div className="flex justify-center mb-6">
              <div className="bg-slate-900 rounded-lg p-4 w-64 border-2 border-slate-600">
                <div className="bg-cosmic-black rounded p-2 mb-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center ${isPlaying ? 'animate-cassette' : ''}`} style={{ animationDuration: '2s' }}>
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                    <div className="flex-1 h-6 bg-amber-900/50 rounded" />
                    <div className={`w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center ${isPlaying ? 'animate-cassette' : ''}`} style={{ animationDuration: '2s' }}>
                      <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-archive-yellow text-xs font-typewriter truncate">
                  {currentCassette?.title || '— NO TAPE —'}
                </p>
                {currentCassette && !isPlaying && (
                  <p className="text-center text-green-400 text-xs font-typewriter mt-1">READY</p>
                )}
                {isPlaying && (
                  <p className="text-center text-archive-yellow text-xs font-typewriter mt-1">PLAYING</p>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={onPrev}
              className="w-12 h-12 rounded-full bg-slate-600 border-2 border-slate-500 flex items-center justify-center text-archive-cream hover:bg-slate-500 transition-colors shadow-card"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              disabled={!currentCassette?.url}
              className={`
                w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl transition-colors shadow-lifted
                ${currentCassette?.url
                  ? isPlaying
                    ? 'bg-archive-yellow-dark border-archive-yellow text-cosmic-black hover:bg-archive-yellow'
                    : 'bg-green-600 border-green-400 text-white hover:bg-green-500'
                  : 'bg-slate-600 border-slate-500 text-slate-400 opacity-50 cursor-not-allowed'
                }
              `}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={onNext}
              className="w-12 h-12 rounded-full bg-slate-600 border-2 border-slate-500 flex items-center justify-center text-archive-cream hover:bg-slate-500 transition-colors shadow-card"
            >
              ⏭
            </button>
          </div>

          {/* Volume knob */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs">VOL</span>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isPlaying ? 'bg-red-600 border-red-400 animate-pulse shadow-lg shadow-red-500/50' : 'bg-slate-600 border-slate-500'}`}>
                <div className={`w-4 h-4 rounded-full ${isPlaying ? 'bg-red-300' : 'bg-slate-400'}`} style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tape selection */}
        <button
          onClick={() => setShowTapeList(!showTapeList)}
          className="mt-4 w-full py-2 bg-archive-tan/30 text-archive-cream text-sm font-typewriter rounded hover:bg-archive-tan/50 transition-colors"
        >
          {showTapeList ? '▲ Close Tape List' : '▼ Load New Tape'}
        </button>

        {/* Tape list */}
        {showTapeList && (
          <div className="mt-4 max-h-48 overflow-y-auto bg-cosmic-black/50 rounded-lg p-2">
            {cassettes.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-4">No tapes available</p>
            ) : (
              <div className="space-y-2">
                {cassettes.map((cassette, index) => {
                  const isThisEmbed = isEmbedCode(cassette)
                  return (
                    <button
                      key={cassette.id || index}
                      onClick={() => handleTapeSelect(cassette)}
                      disabled={isLoading}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded transition-colors
                        ${currentCassette?.id === cassette.id
                          ? 'bg-archive-blue-folder/50 border border-archive-blue-folder'
                          : 'hover:bg-slate-700'
                        }
                      `}
                    >
                      <div className="w-10 h-6 bg-slate-700 rounded flex-shrink-0 flex items-center justify-center">
                        {isThisEmbed ? (
                          <span className="text-green-400 text-xs">🎵</span>
                        ) : cassette.cover ? (
                          <img src={cassette.cover} alt="" className="w-full h-full object-cover rounded" />
                        ) : (
                          <span className="text-slate-500 text-[8px]">TAPE</span>
                        )}
                      </div>
                      <span className="text-archive-cream text-sm truncate flex-1 text-left">
                        {cassette.title || `Tape ${index + 1}`}
                      </span>
                      {currentCassette?.id === cassette.id && (
                        <span className="text-archive-yellow text-xs">
                          {isPlaying ? '▶ Playing' : '○ Ready'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-cosmic-black/50 flex items-center justify-center rounded-2xl">
            <div className="text-archive-cream font-typewriter animate-pulse">Loading tape...</div>
          </div>
        )}
      </div>
    </div>
  )
}
