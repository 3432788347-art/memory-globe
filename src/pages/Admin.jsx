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

  // 表单状态
  const [name, setName] = useState('')
  const [latDirection, setLatDirection] = useState('N')
  const [latValue, setLatValue] = useState('')
  const [lonDirection, setLonDirection] = useState('E')
  const [lonValue, setLonValue] = useState('')
  const [photos, setPhotos] = useState([])
  const [notes, setNotes] = useState([])
  const [cassettes, setCassettes] = useState([])

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

  // 导出数据
  const handleExport = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'memory-globe-data.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // 导入数据
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          saveLocations(data)
          alert('导入成功！')
        } catch (err) {
          alert('导入失败，文件格式错误')
        }
      }
      reader.readAsText(file)
    }
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

  // 图片压缩函数 - 限制最大尺寸和质量
  const compressImage = (file, maxWidth = 800, quality = 0.5) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img

          // 缩放图片
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // 压缩为 JPEG
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  // 处理照片上传 - 支持添加新照片和更新现有照片
  const handlePhotoUpload = async (e, index = null) => {
    const file = e.target.files[0]
    if (file) {
      // 先压缩图片再保存
      const compressedUrl = await compressImage(file)
      const newPhoto = { url: compressedUrl, type: 'print', rotation: Math.random() * 20 - 10 }
      if (index !== null) {
        // 更新现有照片
        const newPhotos = [...photos]
        newPhotos[index] = newPhoto
        setPhotos(newPhotos)
      } else {
        // 添加新照片
        setPhotos([...photos, newPhoto])
      }
    }
  }

  // 处理音乐上传
  const handleMusicUpload = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newCassettes = [...cassettes]
        newCassettes[index].url = reader.result
        setCassettes(newCassettes)
      }
      reader.readAsDataURL(file)
    }
  }

  // 处理封面上传
  const handleCoverUpload = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newCassettes = [...cassettes]
        newCassettes[index].cover = reader.result
        setCassettes(newCassettes)
      }
      reader.readAsDataURL(file)
    }
  }

  const addPhoto = () => {
    setPhotos([...photos, { url: '', type: 'print', rotation: Math.random() * 20 - 10 }])
  }

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const addNote = () => {
    setNotes([...notes, { text: '', color: '#fef3c7', rotation: Math.random() * 10 - 5 }])
  }

  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index))
  }

  const addCassette = () => {
    setCassettes([...cassettes, { id: Date.now(), title: '', url: '', cover: '', embedCode: '' }])
  }

  const removeCassette = (index) => {
    setCassettes(cassettes.filter((_, i) => i !== index))
  }

  // 处理嵌入代码（网易云音乐等）
  const handleEmbedCode = (e, index) => {
    const code = e.target.value
    const newCassettes = [...cassettes]
    newCassettes[index].embedCode = code

    // 尝试提取标题
    let title = ''
    const titleMatch = code.match(/title="([^"]+)"/)
    if (titleMatch) {
      title = titleMatch[1]
    }

    // 尝试提取封面
    let cover = ''
    const coverMatch = code.match(/cover="([^"]+)"/)
    if (coverMatch) {
      cover = coverMatch[1]
    }

    // 保存嵌入代码
    newCassettes[index].url = code
    newCassettes[index].title = title || newCassettes[index].title
    newCassettes[index].cover = cover || newCassettes[index].cover

    setCassettes(newCassettes)
  }

  // 快速添加网易云音乐
  const quickAddNetEase = () => {
    const embedCode = prompt('请粘贴网易云音乐的外链嵌入代码（iframe）:')
    if (embedCode && embedCode.includes('iframe')) {
      setCassettes([...cassettes, { id: Date.now(), title: '网易云音乐', url: embedCode, cover: '', embedCode: embedCode }])
    }
  }

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    // 验证必填字段
    if (!name.trim()) {
      alert('请填写地点名称')
      return
    }
    if (!latValue || isNaN(parseFloat(latValue))) {
      alert('请填写有效纬度')
      return
    }
    if (!lonValue || isNaN(parseFloat(lonValue))) {
      alert('请填写有效经度')
      return
    }

    // 计算实际经纬度
    const latitude = latDirection === 'S' ? -Math.abs(parseFloat(latValue)) : Math.abs(parseFloat(latValue))
    const longitude = lonDirection === 'W' ? -Math.abs(parseFloat(lonValue)) : Math.abs(parseFloat(lonValue))

    // 过滤有效的照片
    const validPhotos = photos.filter(p => p.url)

    // 检查照片总大小 (localStorage 限制约5MB)
    const photosSize = new Blob([JSON.stringify(validPhotos)]).size
    if (photosSize > 4000000) {
      alert('照片总大小超出限制（约4MB），请减少照片数量或使用更小的图片')
      return
    }

    const locationData = {
      id: editingLocation?.id || Date.now(),
      name: name,
      lat: latitude,
      lon: longitude,
      photos: validPhotos,
      notes: notes.filter(n => n.text),
      // Save all cassettes that have a url (music file or embed code)
      cassettes: cassettes.filter(c => c.url)
    }

    try {
      if (editingLocation) {
        saveLocations(
          locations.map((loc) =>
            loc.id === editingLocation.id ? locationData : loc
          )
        )
      } else {
        saveLocations([...locations, locationData])
      }
      resetForm()
    } catch (error) {
      alert('保存失败: ' + error.message)
    }
  }

  const resetForm = () => {
    setEditingLocation(null)
    setIsFormOpen(false)
    setName('')
    setLatDirection('N')
    setLatValue('')
    setLonDirection('E')
    setLonValue('')
    setPhotos([])
    setNotes([])
    setCassettes([])
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setName(location.name)
    setLatDirection(location.lat >= 0 ? 'N' : 'S')
    setLatValue(Math.abs(location.lat).toString())
    setLonDirection(location.lon >= 0 ? 'E' : 'W')
    setLonValue(Math.abs(location.lon).toString())
    setPhotos(location.photos || [])
    setNotes(location.notes || [])
    setCassettes(location.cassettes || [])
    setIsFormOpen(true)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">管理后台</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-purple-500 focus:outline-none mb-4"
          />
          {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold">
            登录
          </button>
          <button type="button" onClick={onBack} className="w-full mt-3 text-slate-400 hover:text-white py-2">
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
            <button onClick={() => { resetForm(); setIsFormOpen(true) }} className="bg-purple-600 px-4 py-2 rounded-lg text-white font-bold">
              添加地点
            </button>
            <button onClick={handleExport} className="bg-green-600 px-4 py-2 rounded-lg text-white">
              导出数据
            </button>
            <label className="bg-blue-600 px-4 py-2 rounded-lg text-white cursor-pointer">
              导入数据
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button onClick={onBack} className="bg-slate-700 px-4 py-2 rounded-lg text-white">
              返回
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingLocation ? '编辑地点' : '添加地点'}
            </h3>

            {/* 地点名称 */}
            <div className="mb-4">
              <label className="text-white text-sm block mb-2">地点名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：北京、上海、纽约"
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
              />
            </div>

            {/* 经纬度 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white text-sm block mb-2">纬度</label>
                <div className="flex gap-2">
                  <select
                    value={latDirection}
                    onChange={(e) => setLatDirection(e.target.value)}
                    className="px-2 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                  >
                    <option value="N">N (北纬)</option>
                    <option value="S">S (南纬)</option>
                  </select>
                  <input
                    type="number"
                    step="0.0001"
                    value={latValue}
                    onChange={(e) => setLatValue(e.target.value)}
                    placeholder="例如：39.9042"
                    required
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-white text-sm block mb-2">经度</label>
                <div className="flex gap-2">
                  <select
                    value={lonDirection}
                    onChange={(e) => setLonDirection(e.target.value)}
                    className="px-2 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                  >
                    <option value="E">E (东经)</option>
                    <option value="W">W (西经)</option>
                  </select>
                  <input
                    type="number"
                    step="0.0001"
                    value={lonValue}
                    onChange={(e) => setLonValue(e.target.value)}
                    placeholder="例如：116.4074"
                    required
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* 照片 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm">照片</label>
                <label className="text-purple-400 text-sm cursor-pointer">
                  + 添加照片
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (!file) return
                      // 压缩图片
                      const compressedUrl = await compressImage(file)
                      setPhotos(prev => [...prev, { url: compressedUrl, type: 'print', rotation: Math.random() * 20 - 10 }])
                      // 清空input值，允许重复选择同一文件
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={photo.url} alt="" className="w-full h-16 object-cover rounded" />
                    <button type="button" onClick={() => removePhoto(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 便签 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm">便签</label>
                <button type="button" onClick={addNote} className="text-purple-400 text-sm">+ 添加便签</button>
              </div>
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={note.text}
                      onChange={(e) => {
                        const newNotes = [...notes]
                        newNotes[index].text = e.target.value
                        setNotes(newNotes)
                      }}
                      placeholder="便签内容"
                      className="flex-1 px-3 py-2 rounded bg-yellow-50 text-slate-800"
                    />
                    <input
                      type="color"
                      value={note.color}
                      onChange={(e) => {
                        const newNotes = [...notes]
                        newNotes[index].color = e.target.value
                        setNotes(newNotes)
                      }}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <button type="button" onClick={() => removeNote(index)} className="bg-red-500 text-white px-2 rounded">×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 音乐磁带 */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-white text-sm">音乐磁带</label>
                <div className="flex gap-2">
                  <button type="button" onClick={quickAddNetEase} className="text-green-400 text-sm">+ 网易云外链</button>
                  <button type="button" onClick={addCassette} className="text-purple-400 text-sm">+ 添加音乐</button>
                </div>
              </div>
              <div className="space-y-3">
                {cassettes.map((cassette, index) => (
                  <div key={index} className="flex gap-2 items-center bg-slate-700 p-2 rounded">
                    {/* 封面上传 */}
                    <label className="w-12 h-12 bg-slate-600 rounded overflow-hidden cursor-pointer flex-shrink-0">
                      {cassette.cover ? (
                        <img src={cassette.cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">封面</div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverUpload(e, index)} />
                    </label>

                    {/* 歌曲名称 */}
                    <input
                      type="text"
                      value={cassette.title}
                      onChange={(e) => {
                        const newCassettes = [...cassettes]
                        newCassettes[index].title = e.target.value
                        setCassettes(newCassettes)
                      }}
                      placeholder="歌曲名称"
                      className="flex-1 px-2 py-1 rounded bg-slate-600 text-white text-sm"
                    />

                    {/* 判断是嵌入代码还是上传文件 */}
                    {cassette.url && cassette.url.includes('iframe') ? (
                      <span className="text-green-400 text-xs">已嵌入</span>
                    ) : (
                      <label className="px-3 py-1 bg-slate-600 rounded text-white text-xs cursor-pointer">
                        {cassette.url ? '已上传' : '上传音乐'}
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleMusicUpload(e, index)} />
                      </label>
                    )}

                    {/* 或者粘贴嵌入代码 */}
                    <input
                      type="text"
                      value={cassette.embedCode || ''}
                      onChange={(e) => handleEmbedCode(e, index)}
                      placeholder="或粘贴嵌入代码"
                      className="flex-1 px-2 py-1 rounded bg-slate-600 text-white text-xs"
                    />

                    <button type="button" onClick={() => removeCassette(index)} className="bg-red-500 text-white px-2 rounded text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold">
                保存
              </button>
              <button type="button" onClick={resetForm} className="bg-slate-700 text-white px-6 py-2 rounded-lg">
                取消
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {locations.length === 0 ? (
            <p className="text-slate-400 text-center py-8">暂无地点，点击添加按钮创建</p>
          ) : (
            locations.map((location) => (
              <div key={location.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">{location.name}</h3>
                  <p className="text-slate-400 text-sm">
                    纬度: {location.lat > 0 ? 'N' : 'S'} {Math.abs(location.lat).toFixed(4)} |
                    经度: {location.lon > 0 ? 'E' : 'W'} {Math.abs(location.lon).toFixed(4)}
                  </p>
                  <p className="text-slate-500 text-xs">
                    照片: {location.photos?.length || 0} |
                    便签: {location.notes?.length || 0} |
                    音乐: {location.cassettes?.filter(c => c.url).length || 0}首
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(location)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg text-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(location.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm">
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
