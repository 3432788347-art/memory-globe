import { useState } from 'react'

export default function CassetteSelector({ cassettes, onSelect, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const handleSelect = (index) => {
    setSelectedIndex(index)
    setTimeout(() => {
      onSelect(cassettes[index])
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="text-center">
        <h2 className="text-2xl text-white mb-8 font-light">选择一首音乐</h2>
        <div className="flex gap-6 justify-center">
          {cassettes.map((cassette, index) => (
            <div
              key={cassette.id}
              onClick={() => handleSelect(index)}
              className={`cursor-pointer transition-all duration-300 ${
                selectedIndex === index
                  ? 'scale-110 opacity-0'
                  : 'hover:scale-105'
              }`}
            >
              <div className="w-32 h-20 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg overflow-hidden shadow-xl border border-slate-600">
                {cassette.cover ? (
                  <img
                    src={cassette.cover}
                    alt={cassette.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    🎵
                  </div>
                )}
              </div>
              <p className="text-white text-sm mt-2 truncate w-32">{cassette.title}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 text-slate-400 hover:text-white transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  )
}
