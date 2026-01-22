'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

interface HeartbeatVisualizationProps {
  score: number // 0-100
  size?: 'sm' | 'md' | 'lg'
}

export function HeartbeatVisualization({ score, size = 'lg' }: HeartbeatVisualizationProps) {
  const [pulseRate, setPulseRate] = useState(60)

  useEffect(() => {
    // Calculate pulse rate based on score (60-120 bpm)
    // Higher score = higher pulse rate (healthier)
    const newRate = 60 + (score / 100) * 60
    setPulseRate(Math.round(newRate))
  }, [score])

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
  }

  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  }

  // Determine color based on score
  const getColor = () => {
    if (score >= 70) return 'text-emerald-500'
    if (score >= 40) return 'text-blue-500'
    return 'text-red-500'
  }

  const getGlowColor = () => {
    if (score >= 70) return 'shadow-emerald-500/50'
    if (score >= 40) return 'shadow-blue-500/50'
    return 'shadow-red-500/50'
  }

  const getBgGradient = () => {
    if (score >= 70) return 'from-emerald-500/20 to-emerald-600/10'
    if (score >= 40) return 'from-blue-500/20 to-blue-600/10'
    return 'from-red-500/20 to-red-600/10'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer glow rings */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${getBgGradient()} animate-pulse-glow blur-xl`}
          style={{
            animationDuration: `${60 / pulseRate}s`,
          }}
        />
        <div
          className={`absolute inset-0 rounded-full ${getGlowColor()} shadow-2xl animate-pulse-glow`}
          style={{
            animationDuration: `${60 / pulseRate}s`,
          }}
        />
        
        {/* Glass card background */}
        <div className="absolute inset-0 glass-card rounded-full" />
        
        {/* Heart icon */}
        <div
          className={`relative flex items-center justify-center ${sizeClasses[size]} ${getColor()}`}
          style={{
            animation: `heartbeat ${60 / pulseRate}s ease-in-out infinite`,
          }}
        >
          <Heart className={`${iconSizes[size]} fill-current drop-shadow-lg`} />
        </div>
      </div>
      
      {/* Score display */}
      <div className="text-center space-y-2">
        <div className="text-5xl font-heading font-bold text-slate-900 dark:text-slate-50">
          {score}
        </div>
        <div className="text-lg font-medium text-slate-600 dark:text-slate-400">
          Financial Health Score
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-500 font-mono">
          {pulseRate} BPM
        </div>
      </div>
    </div>
  )
}
