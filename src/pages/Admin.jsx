import { useState, useEffect } from 'react'

const STORAGE_KEY = 'memory-globe-locations'
const ADMIN_PASSWORD = 'memory2024'

export default function Admin({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [locations, setLocations] = useState([])
  const [editingLocation, setEditingLocation] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setLocations(JSON.parse(saved))
    }
  }, [])

  const saveLocations = (newLocations) => {
    setLocations(newLocations)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocations))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('密码错误')
    }
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这个地点吗？')) {
      saveLocations(locations.filter((loc) => loc.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const locationData = {
      id: editingLocation?.id || Date.now(),
      name: formData.get('name'),
      lat: parseFloat(formData.get('lat')),
      lon: parseFloat(formData.get('lon')),
      content: formData.get('content'),
      image: formData.get('image'),
      music: formData.get('music'),
    }

    if (editingLocation) {
      saveLocations(
        locations.map((loc) =>
          loc.id === editingLocation.id ? locationData : loc
        )
      )
    } else {
      saveLocations([...locations, locationData])
    }

    setEditingLocation(null)
    setIsFormOpen(false)
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setIsFormOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">管理后台</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none mb-4"
          />
          {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            登录
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-3 text-slate-400 hover:text-white py-2 transition-colors"
          >
            返回
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">地点管理</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingLocation(null)
                setIsFormOpen(true)
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              添加地点
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              返回
            </button>
          </div>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {editingLocation ? '编辑地点' : '添加地点'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                name="name"
                defaultValue={editingLocation?.name}
                placeholder="地点名称"
                required
                className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                name="lat"
                type="number"
                step="0.0001"
                defaultValue={editingLocation?.lat}
                placeholder="纬度"
                required
                className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                name="lon"
                type="number"
                step="0.0001"
                defaultValue={editingLocation?.lon}
                placeholder="经度"
                required
                className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                name="image"
                defaultValue={editingLocation?.image}
                placeholder="图片 URL"
                className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                name="music"
                defaultValue={editingLocation?.music}
                placeholder="音乐 URL"
                className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <textarea
              name="content"
              defaultValue={editingLocation?.content}
              placeholder="回忆内容"
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false)
                  setEditingLocation(null)
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {locations.length === 0 ? (
            <p className="text-slate-400 text-center py-8">暂无地点，点击添加按钮创建</p>
          ) : (
            locations.map((location) => (
              <div
                key={location.id}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{location.name}</h3>
                  <p className="text-slate-400 text-sm">{location.content}</p>
                  <p className="text-slate-500 text-xs">
                    {location.lat}, {location.lon}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(location)}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
