'use client'

import { useEffect, useState, useRef } from 'react'

interface HeartbeatVisualizationProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function HeartbeatVisualization({ score, size = 'lg' }: HeartbeatVisualizationProps) {
  const [pulseRate, setPulseRate] = useState(60)
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(1000)

  useEffect(() => {
    const newRate = (score / 100) * 120
    setPulseRate(Math.round(newRate))
  }, [score])

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      setPathLength(length)
    }
  }, [score]) // Recalculate when score changes (path may change)

  const sizeClasses = {
    sm: 'w-48 h-24',
    md: 'w-96 h-40',
    lg: 'w-[600px] h-48',
  }

  const getColor = () => {
    if (score >= 70) return '#10b981'
    if (score >= 40) return '#3b82f6'
    return '#ef4444'
  }


  // Calculate animation duration based on pulse rate
  // Use quadratic relationship for stronger speed difference
  // Lower BPM = significantly slower, Higher BPM = significantly faster
  const baseDuration = 10 // Base duration in seconds at 60 BPM
  const scrollDuration = pulseRate === 0
    ? 9999 // Very long duration (effectively static)
    : Math.pow(60 / pulseRate, 2) * baseDuration

  // Use straight line when score is 0, otherwise use ECG pattern
  const ecgPath = score === 0
    ? 'M0,24 L420,24' // Straight horizontal line for score 0
    : 'M0,24 L20,24 L25,10 L30,35 L35,5 L40,38 L45,24 L80,24 L85,10 L90,35 L95,5 L100,38 L105,24 L140,24 L145,10 L150,35 L155,5 L160,38 L165,24 L200,24 L205,10 L210,35 L215,5 L220,38 L225,24 L260,24 L265,10 L270,35 L275,5 L280,38 L285,24 L320,24 L325,10 L330,35 L335,5 L340,38 L345,24 L380,24 L385,10 L390,35 L395,5 L400,38 L405,24'

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="text-slate-400">
            <defs>
              <pattern id="grid" width="20" height="10" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* ECG Line */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 420 48"
          preserveAspectRatio="none"
        >
          {/* Animated ECG line */}
          <path
            ref={pathRef}
            d={ecgPath}
            fill="none"
            stroke={getColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pulseRate === 0 ? 'none' : pathLength}
            style={{
              ...(pulseRate > 0 && {
                animation: `ecg-scroll ${scrollDuration}s linear infinite`,
              }),
            }}
          />
        </svg>

        {/* Score display */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            {score}
          </div>
          <div className="text-left">
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Health Score
            </div>
            <div className="text-lg font-mono" style={{ color: getColor() }}>
              {pulseRate} BPM
            </div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
          Financial Heartbeat
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500">
          Real-time financial health monitoring
        </div>
      </div>
    </div>
  )
}
