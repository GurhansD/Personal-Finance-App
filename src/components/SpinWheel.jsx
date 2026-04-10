import { useState, useRef, useEffect } from 'react'

const SEGMENTS = [
  { label: '+50 XP',   value: { type: 'xp', amount: 50 },   color: '#22c55e', emoji: '⚡' },
  { label: '+100 XP',  value: { type: 'xp', amount: 100 },  color: '#3b82f6', emoji: '🌟' },
  { label: '+25 XP',   value: { type: 'xp', amount: 25 },   color: '#f59e0b', emoji: '✨' },
  { label: '2× Next',  value: { type: 'multiplier', amount: 2 }, color: '#8b5cf6', emoji: '🚀' },
  { label: '+150 XP',  value: { type: 'xp', amount: 150 },  color: '#ec4899', emoji: '💎' },
  { label: '+75 XP',   value: { type: 'xp', amount: 75 },   color: '#06b6d4', emoji: '🎯' },
  { label: '+50 XP',   value: { type: 'xp', amount: 50 },   color: '#ef4444', emoji: '🔥' },
  { label: '+200 XP',  value: { type: 'xp', amount: 200 },  color: '#fbbf24', emoji: '🏆' },
]

const SEG_COUNT = SEGMENTS.length
const ANGLE = 360 / SEG_COUNT

function drawWheel(canvas, rotation) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const cx = w / 2
  const cy = w / 2
  const r = w / 2 - 4

  ctx.clearRect(0, 0, w, w)

  SEGMENTS.forEach((seg, i) => {
    const startAngle = (i * ANGLE - 90 + rotation) * (Math.PI / 180)
    const endAngle = ((i + 1) * ANGLE - 90 + rotation) * (Math.PI / 180)

    // Segment fill
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = seg.color
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2
    ctx.stroke()

    // Text
    const midAngle = (startAngle + endAngle) / 2
    const textRadius = r * 0.65
    const tx = cx + Math.cos(midAngle) * textRadius
    const ty = cy + Math.sin(midAngle) * textRadius

    ctx.save()
    ctx.translate(tx, ty)
    ctx.rotate(midAngle + Math.PI / 2)
    ctx.fillStyle = 'white'
    ctx.font = `bold ${w * 0.055}px system-ui`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 4
    ctx.fillText(seg.label, 0, 0)
    ctx.restore()

    // Emoji
    const emojiRadius = r * 0.85
    const ex = cx + Math.cos(midAngle) * emojiRadius
    const ey = cy + Math.sin(midAngle) * emojiRadius
    ctx.font = `${w * 0.065}px system-ui`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(seg.emoji, ex, ey)
  })

  // Center circle
  ctx.beginPath()
  ctx.arc(cx, cy, w * 0.08, 0, Math.PI * 2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3
  ctx.stroke()

  // Center star
  ctx.font = `${w * 0.08}px system-ui`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('⭐', cx, cy)
}

export default function SpinWheel({ onResult, canSpin }) {
  const canvasRef = useRef(null)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const animRef = useRef(null)

  useEffect(() => {
    drawWheel(canvasRef.current, rotation)
  }, [rotation])

  const spin = () => {
    if (spinning || !canSpin) return
    setSpinning(true)
    setResult(null)

    const extraSpins = 5 + Math.floor(Math.random() * 5) // 5-9 full rotations
    const segmentIndex = Math.floor(Math.random() * SEG_COUNT)
    // Land in the middle of the winning segment (pointer at top = 270deg natural)
    const targetAngle = 360 * extraSpins + (360 - segmentIndex * ANGLE - ANGLE / 2)

    const startRotation = rotation
    const totalDelta = targetAngle
    const duration = 3500 // ms
    const start = performance.now()

    const easeOut = (t) => 1 - Math.pow(1 - t, 4)

    const animate = (now) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const easedT = easeOut(t)
      const currentRotation = startRotation + totalDelta * easedT

      setRotation(currentRotation)
      drawWheel(canvasRef.current, currentRotation)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        const winner = SEGMENTS[segmentIndex]
        setResult(winner)
        onResult?.(winner.value)
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wheel container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '24px solid #fbbf24',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
            }} />
        </div>

        {/* Glow ring */}
        <div className={`absolute -inset-2 rounded-full transition-all duration-300 ${spinning ? 'opacity-60' : 'opacity-20'}`}
          style={{ background: 'radial-gradient(circle, #fbbf2440, transparent 70%)' }} />

        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-full cursor-pointer"
          onClick={spin}
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning || !canSpin}
        className={`px-8 py-3 font-black text-sm rounded-xl transition-all
          ${spinning
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : canSpin
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-lg hover:shadow-yellow-500/30 hover:scale-105'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }
        `}
      >
        {spinning ? '🌀 Spinning...' : canSpin ? '🎰 SPIN!' : '⏰ Come back tomorrow'}
      </button>

      {/* Result */}
      {result && (
        <div className="text-center animate-bounce-in">
          <div className="text-3xl mb-1">{result.emoji}</div>
          <div className="text-lg font-black text-white">{result.label}</div>
          {result.value.type === 'multiplier'
            ? <div className="text-sm text-purple-400">Next XP reward doubled!</div>
            : <div className="text-sm text-yellow-400">Added to your account!</div>
          }
        </div>
      )}
    </div>
  )
}
