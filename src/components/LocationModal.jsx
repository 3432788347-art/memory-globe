export default function LocationModal({ location, onClose }) {
  if (!location) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">{location.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {location.image && (
          <img
            src={location.image}
            alt={location.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <p className="text-slate-300 mb-4">{location.content}</p>

        {location.music && (
          <audio controls className="w-full">
            <source src={location.music} type="audio/mpeg" />
          </audio>
        )}

        <div className="text-sm text-slate-500 mt-4">
          坐标: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </div>
      </div>
    </div>
  )
}
