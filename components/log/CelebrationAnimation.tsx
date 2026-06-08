'use client'

import { useEffect, useRef } from 'react'
import { DOMAINS } from '@/lib/domains'
import { Card } from '@/components/ui/card'

interface CelebrationAnimationProps {
  entries: Array<{
    domain: string
    activityDescription: string
    hoursSpent: number
  }>
  totalHours: number
}

export function CelebrationAnimation({ entries, totalHours }: CelebrationAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create confetti effect
    const confetti = () => {
      const particles: Array<{
        x: number
        y: number
        vx: number
        vy: number
        life: number
        color: string
      }> = []

      const colors = ['#6366f1', '#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']

      // Create particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 5 + 3,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.1 // gravity
          p.life -= 0.015

          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }

          ctx.globalAlpha = p.life
          ctx.fillStyle = p.color
          ctx.fillRect(p.x, p.y, 4, 4)
        }

        if (particles.length > 0) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    confetti()
  }, [])

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={400}
        className="w-full h-96 pointer-events-none"
      />

      <div className="text-center space-y-4">
        <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Amazing!
        </div>
        <p className="text-slate-300 text-lg">You&apos;ve logged {totalHours.toFixed(1)} hours of learning today!</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 p-6 space-y-4">
        <h3 className="font-semibold text-slate-100">Today&apos;s Summary</h3>
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            const domain = DOMAINS.find((d) => d.name === entry.domain)
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <div className="pt-1">
                  {domain?.icon && <domain.icon className="w-5 h-5" style={{ color: `hsl(var(--color-${domain.color}))` }} />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{entry.domain}</div>
                  <p className="text-sm text-slate-400">{entry.activityDescription}</p>
                  <div className="mt-2 text-xs font-semibold text-slate-300">
                    {entry.hoursSpent.toFixed(1)} hours
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="text-center text-sm text-slate-400">
        Keep up this momentum! Every hour brings you closer to mastery.
      </div>
    </div>
  )
}
