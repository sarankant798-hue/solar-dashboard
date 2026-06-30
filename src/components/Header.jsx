import { motion } from 'framer-motion'

export default function Header({ panelCount, totalPower }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 50%, #1a1208 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,157,61,0.15) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl mb-3"
        >☀️</motion.div>

        <h1 className="text-4xl font-bold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>
          Solar Panel Monitor
        </h1>
        <p className="text-gray-400 text-base mb-6">
          Live data from Firebase · Updates every second
        </p>

        {/* Stats bar */}
        <div className="flex justify-center gap-8 flex-wrap">
          <Stat label="Panels Online" value={panelCount} unit="" />
          <Stat label="Total Power" value={totalPower.toFixed(1)} unit="W" />
          <Stat label="Data Source" value="Firebase" unit="" isText />
        </div>
      </div>
    </motion.header>
  )
}

function Stat({ label, value, unit, isText }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold" style={{
        fontFamily: isText ? 'Inter, sans-serif' : 'JetBrains Mono, monospace',
        color: '#ff9d3d'
      }}>
        {value}{unit && <span className="text-lg ml-1" style={{ color: '#ffc857' }}>{unit}</span>}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
