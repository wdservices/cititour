import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRegion } from '@/contexts/RegionContext'

// Rotates through region/location names in a loop with smooth transitions
const AnimatedRegionTitle = () => {
  const { locationName } = useRegion()

  // Base rotation list; current location prioritized and with safe fallback
  const baseLocations = useMemo(() => ['Lagos', 'Port Harcourt', 'Abuja', 'Kano', 'Owerri', 'Kaduna'], [])
  const currentLocation = locationName || 'Your City'
  const orderedLocations = useMemo(
    () => [currentLocation, ...baseLocations.filter(l => l !== currentLocation)],
    [baseLocations, currentLocation]
  )

  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % orderedLocations.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [orderedLocations])

  return (
    <div className="inline-flex items-baseline gap-3">
      <span className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">Tour</span>
      <div className="h-10 md:h-14 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={orderedLocations[index]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="block text-3xl md:text-5xl font-bold text-primary"
          >
            {orderedLocations[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AnimatedRegionTitle