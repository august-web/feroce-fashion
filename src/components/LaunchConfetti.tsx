'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  w: number
  h: number
  color: string
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

const GOLD_COLORS = ['#D4AF37', '#C5A028', '#E8C547', '#B8962A', '#F0D060']

export function LaunchConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    if (typeof window === 'undefined') return

    const hasSeen = sessionStorage.getItem('feroce-launch-confetti')
    if (hasSeen) return

    hasRun.current = true
    sessionStorage.setItem('feroce-launch-confetti', '1')

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []
    const count = 120

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      })
    }

    let frame = 0
    const maxFrames = 180 // ~3 seconds at 60fps

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = 0
      for (const p of particles) {
        if (p.opacity <= 0) continue
        alive++

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05 // gravity
        p.vx *= 0.99 // drag
        p.rotation += p.rotationSpeed

        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.02
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      frame++
      if (alive > 0 && frame < maxFrames + 30) {
        requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    // Start after 800ms so the page loads first
    const timer = setTimeout(() => requestAnimationFrame(animate), 800)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
