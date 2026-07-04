import { useState, useRef, useEffect } from 'react'

export default function CassetteSelector({ cassettes, onSelect, onClose, onSkip }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [previewPlaying, setPreviewPlaying] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const handlePreview = (cassette, index) => {
    if (!cassette.url) return

    if (previewPlaying?.id === cassette.id) {
      audioRef.current?.pause()
      setPreviewPlaying(null)
    } else {
      if (audioRef.current) {
        audioRef.current.src = cassette.url
        audioRef.current.play()
        setPreviewPlaying(cassette)
      }
    }
  }

  const handleSelect = (index) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setSelectedIndex(index)
    setTimeout(() => {
      onSelect(cassettes[index])
    }, 300)
  }

  const hasMusic = cassettes.some(c => c.url)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="text-center max-w-2xl p-4">
        <h2 className="text-2xl text-white mb-2 font-light">选择音乐</h2>
        <p className="text-slate-400 text-sm mb-8">点击预览或选择音乐</p>

        {hasMusic ? (
          <div className="flex gap-4 justify-center flex-wrap">
            {cassettes.map((cassette, index) => (
              cassette.url ? (
                <div
                  key={cassette.id || index}
                  onClick={() => handleSelect(index)}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedIndex === index ? 'scale-110 opacity-50' : 'hover:scale-105'
                  }`}
                >
                  <div className="w-28 h-36 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg overflow-hidden shadow-xl border border-slate-600 flex flex-col">
                    <div className="h-20 bg-slate-600 relative">
                      {cassette.cover ? (
                        <img src={cassette.cover} alt={cassette.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">🎵</div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreview(cassette, index)
                        }}
                        className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-400"
                      >
                        {previewPlaying?.id === cassette.id ? '⏸' : '▶'}
                      </button>
                    </div>
                    <div className="flex-1 p-2">
                      <p className="text-white text-xs truncate">{cassette.title}</p>
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        ) : (
          <p className="text-slate-400 mb-4">暂无音乐</p>
        )}

        <div className="flex justify-center gap-4 mt-8">
          {hasMusic && onSkip && (
            <button
              onClick={onSkip}
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
            >
              跳过
            </button>
          )}
          <button onClick={onClose} className="px-6 py-2 text-slate-400 hover:text-white">
            关闭
          </button>
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => setPreviewPlaying(null)} />
    </div>
  )
}
