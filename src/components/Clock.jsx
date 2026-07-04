import { useState, useEffect } from 'react'

const TIMEZONES = [
  { name: '中国', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
  { name: '美国', timezone: 'America/New_York', flag: '🇺🇸' },
  { name: '英国', timezone: 'Europe/London', flag: '🇬🇧' },
]

function getTimeInTimezone(timezone) {
  return new Date().toLocaleTimeString('zh-CN', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function getDateInTimezone(timezone) {
  return new Date().toLocaleDateString('zh-CN', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

export default function Clock() {
  const [times, setTimes] = useState(
    TIMEZONES.map((tz) => ({
      ...tz,
      time: getTimeInTimezone(tz.timezone),
      date: getDateInTimezone(tz.timezone),
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimes((prev) =>
        prev.map((tz) => ({
          ...tz,
          time: getTimeInTimezone(tz.timezone),
          date: getDateInTimezone(tz.timezone),
        }))
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {times.map((tz) => (
        <div
          key={tz.name}
          className="bg-slate-800/80 backdrop-blur-sm rounded-lg px-4 py-2 text-center border border-slate-700"
        >
          <div className="text-sm text-slate-400 mb-1">
            {tz.flag} {tz.name}
          </div>
          <div className="text-2xl font-mono text-white font-bold">{tz.time}</div>
          <div className="text-xs text-slate-500">{tz.date}</div>
        </div>
      ))}
    </div>
  )
}
