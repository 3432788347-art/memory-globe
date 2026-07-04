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
      <div className="inline-block bg-white/[0.08] backdrop-blur-xl rounded-full px-6 py-2 text-white font-bold shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.15]">
        他在杜克的第 <span className="text-2xl text-white">{days}</span> 天
      </div>
    </div>
  )
}
