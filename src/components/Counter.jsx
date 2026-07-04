import { useState, useEffect } from 'react'

const START_DATE = new Date('2024-08-20')

export default function Counter() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date()
      const diffTime = Math.abs(now - START_DATE)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
    }

    calculateDays()
    const interval = setInterval(calculateDays, 1000 * 60 * 60) // Update every hour
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center py-4">
      <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 rounded-full px-6 py-2 text-white font-bold shadow-lg">
        他在杜克的第 <span className="text-2xl">{days}</span> 天
      </div>
    </div>
  )
}
