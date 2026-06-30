import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db, ref, onValue } from './utils/firebase'
import Header from './components/Header'
import PanelCard from './components/PanelCard'
import Footer from './components/Footer'

const DEMO_PANELS = {
  'panel-1': { voltage: 18.5, current: 2.8, power: 51.8, timestamp: Date.now(), location: 'Colombo (Coastal)', material: 'Monocrystalline' },
  'panel-2': { voltage: 19.2, current: 2.9, power: 55.7, timestamp: Date.now(), location: 'Kandy (Hills)', material: 'Polycrystalline' },
  'panel-3': { voltage: 17.8, current: 2.6, power: 46.3, timestamp: Date.now(), location: 'Galle (South)', material: 'Thin-Film' },
}

export default function App() {
  const [panels, setPanels] = useState(null)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const dbUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL
    if (!dbUrl || dbUrl.includes('your_project')) {
      setIsDemo(true)
      setPanels(DEMO_PANELS)
      return
    }
    try {
      const panelsRef = ref(db, 'panels')
      const unsub = onValue(
        panelsRef,
        (snapshot) => {
          const data = snapshot.val()
          setPanels(data || {})
          setError(null)
        },
        (err) => {
          setError(err.message)
          setIsDemo(true)
          setPanels(DEMO_PANELS)
        }
      )
      return () => unsub()
    } catch (err) {
      setError(err.message)
      setIsDemo(true)
      setPanels(DEMO_PANELS)
    }
  }, [])

  const panelEntries = panels ? Object.entries(panels) : []
  const totalPower = panelEntries.reduce((sum, [, d]) => sum + (d.power || d.voltage * d.current || 0), 0)

  return (
    <div className="min-h-screen" style={{ background: '#0f1419', color: '#ffffff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-15px); }
        }
      `}</style>

      <Header panelCount={panelEntries.length} totalPower={totalPower} />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {isDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-xl text-sm text-center"
            style={{ background: '#1a1208', border: '1px solid #ff9d3d55', color: '#ffc857' }}>
            ⚡ Demo mode — add your Firebase config to <code className="mx-1 px-1 rounded" style={{ background: '#0f1419' }}>.env</code> to show live data
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 px-4 py-3 rounded-xl text-sm text-center"
            style={{ background: '#1a0808', border: '1px solid #e74c3c55', color: '#e74c3c' }}>
            🔥 Firebase error: {error}
          </motion.div>
        )}

        {panels === null && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="text-4xl">☀️</motion.div>
            <p className="text-gray-500">Connecting to Firebase...</p>
          </div>
        )}

        {panels !== null && panelEntries.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📡</div>
            <p className="text-gray-400 text-lg">No panels found in database</p>
            <p className="text-gray-600 text-sm mt-2">Send data from your ESP32 to Firebase under <code>panels/</code></p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {panelEntries.map(([id, data], i) => (
              <PanelCard key={id} id={id} data={data} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}
