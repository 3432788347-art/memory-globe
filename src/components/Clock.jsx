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
          className="bg-white/[0.08] backdrop-blur-xl rounded-2xl px-5 py-3 text-center border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          <div className="text-xs text-white/70 mb-1 font-medium">
            {tz.flag} {tz.name}
          </div>
          <div className="text-2xl font-mono text-white font-semibold tracking-widest drop-shadow-sm">{tz.time}</div>
          <div className="text-xs text-white/50 mt-1">{tz.date}</div>
        </div>
      ))}
    </div>
  )
}
