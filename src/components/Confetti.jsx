import { useEffect, useRef } from 'react'

const COLORS = ['#22c55e','#4ade80','#facc15','#fb923c','#60a5fa','#a78bfa','#f472b6','#34d399']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

export default function Confetti({ active, duration = 3000 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: randomBetween(0.2, 0.8) * canvas.width,
      y: -20,
      vx: randomBetween(-3, 3),
      vy: randomBetween(2, 8),
      size: randomBetween(6, 12),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.2, 0.2),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      opacity: 1,
    }))

    startRef.current = null

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const fadeStart = duration * 0.6
      const fadeProgress = elapsed > fadeStart ? (elapsed - fadeStart) / (duration - fadeStart) : 0

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, 1 - fadeProgress)

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      if (elapsed < duration) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [active, duration])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[200] pointer-events-none"
    />
  )
}
