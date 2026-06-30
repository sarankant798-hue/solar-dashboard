import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function AnimatedNumber({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    prev.current = value
    return controls.stop
  }, [value])

  return <>{display.toFixed(decimals)}</>
}

function ProgressBar({ value, max, color = '#ff9d3d' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#1a1f2e' }}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, #ffc857)` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'linear' }}
      />
    </div>
  )
}

export default function PanelCard({ id, data, index }) {
  const { voltage = 0, current = 0, power = 0, timestamp, location, material } = data
  const computedPower = power || (voltage * current)

  const timeAgo = timestamp
    ? (() => {
        const s = Math.floor((Date.now() - timestamp) / 1000)
        if (s < 5) return 'just now'
        if (s < 60) return `${s}s ago`
        return `${Math.floor(s / 60)}m ago`
      })()
    : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 0 24px rgba(255,157,61,0.2)' }}
      className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
      style={{ background: '#1a1f2e', border: '1px solid #2a2f3e', transition: 'border-color 0.3s' }}
      onHoverStart={e => e.target.style && (e.currentTarget.style.borderColor = '#ff9d3d55')}
      onHoverEnd={e => e.target.style && (e.currentTarget.style.borderColor = '#2a2f3e')}
    >
      {/* Card header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-white font-semibold text-lg capitalize">
            {id.replace(/-/g, ' ')}
          </h2>
          {location && <p className="text-gray-500 text-xs mt-0.5">📍 {location}</p>}
          {material && <p className="text-gray-500 text-xs">⚡ {material}</p>}
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#0f1419', color: '#ff9d3d' }}>
          {timeAgo}
        </span>
      </div>

      {/* Power highlight */}
      <motion.div
        key={computedPower}
        className="text-center py-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, #1f1208, #2a1a08)' }}
        animate={{ boxShadow: ['0 0 0px #ff9d3d00', '0 0 16px #ff9d3d44', '0 0 0px #ff9d3d00'] }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <div className="text-gray-500 text-xs mb-1">POWER</div>
        <div className="text-4xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ff9d3d' }}>
          <AnimatedNumber value={computedPower} decimals={1} />
          <span className="text-xl ml-1" style={{ color: '#ffc857' }}>W</span>
        </div>
      </motion.div>

      {/* Voltage */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-gray-400 text-sm">Voltage</span>
          <span className="font-bold text-lg" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ffffff' }}>
            <AnimatedNumber value={voltage} decimals={2} />
            <span className="text-sm ml-1 text-gray-400">V</span>
          </span>
        </div>
        <ProgressBar value={voltage} max={36} />
        <div className="text-right text-xs text-gray-600 mt-0.5">{((voltage / 36) * 100).toFixed(0)}% of 36V</div>
      </div>

      {/* Current */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-gray-400 text-sm">Current</span>
          <span className="font-bold text-lg" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ffffff' }}>
            <AnimatedNumber value={current} decimals={3} />
            <span className="text-sm ml-1 text-gray-400">A</span>
          </span>
        </div>
        <ProgressBar value={current} max={10} color="#ffc857" />
        <div className="text-right text-xs text-gray-600 mt-0.5">{((current / 10) * 100).toFixed(0)}% of 10A</div>
      </div>
    </motion.div>
  )
}
