import { useState, useRef, useEffect } from 'react'

export default function CassettePlayer({
  cassette,
  onMinimize,
  isMinimized = false,
  playlist = [],
  currentIndex = 0,
  onNext,
  onPrev
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current && cassette?.url) {
      audioRef.current.src = cassette.url
      audioRef.current.load()
    }
  }, [cassette])

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Play error:', e))
    }
  }, [isPlaying, cassette])

  const togglePlay = () => {
    if (!audioRef.current || !cassette?.url) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (onNext) {
      onNext()
    } else {
      setIsPlaying(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 w-48 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-3 shadow-xl border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
            <span className="text-lg">{isPlaying ? '🎵' : '⏸'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{cassette?.title}</p>
            <p className="text-slate-400 text-xs">{isPlaying ? 'Playing' : 'Paused'}</p>
          </div>
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      </div>
    )
  }

  return (
    <div className="w-72 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl p-4 shadow-2xl border border-slate-600">
      {/* Cassette window */}
      <div className="bg-slate-900 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-center gap-4">
          {/* Left reel */}
          <div className={`w-12 h-12 rounded-full border-4 border-slate-600 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            <div className="w-4 h-4 bg-slate-400 rounded-full" />
          </div>
          {/* Tape */}
          <div className="flex-1 h-8 bg-amber-900 rounded" />
          {/* Right reel */}
          <div className={`w-12 h-12 rounded-full border-4 border-slate-600 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            <div className="w-4 h-4 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Cover art */}
      {cassette?.cover ? (
        <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
          <img src={cassette.cover} alt={cassette.title} className={`w-full h-full object-cover ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </div>
      ) : (
        <div className="w-20 h-20 mx-auto mb-4 rounded-lg bg-slate-600 flex items-center justify-center">
          <span className="text-2xl">🎵</span>
        </div>
      )}

      {/* Song title */}
      <p className="text-white text-center text-sm mb-2">{cassette?.title || '未选择音乐'}</p>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="mb-3">
          <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={onPrev} className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white hover:bg-slate-500">
          ⏮
        </button>
        <button onClick={stop} className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white hover:bg-slate-500">
          ⏹
        </button>
        <button
          onClick={togglePlay}
          disabled={!cassette?.url}
          className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={onNext} className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white hover:bg-slate-500">
          ⏭
        </button>
      </div>

      {/* Minimize button */}
      <button onClick={onMinimize} className="mt-4 w-full py-2 bg-slate-600 text-white rounded text-sm hover:bg-slate-500">
        缩小到旁
      </button>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  )
}
