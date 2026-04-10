import { useEffect, useRef } from 'react'

const SYMBOLS = ['💵', '💰', '🪙', '💎', '⭐', '✨', '🌟', '🎉']

export default function MoneyRain({ duration = 4000, count = 40 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = Array.from({ length: count }, (_, i) => {
      const el = document.createElement('div')
      el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      el.style.cssText = `
        position: fixed;
        top: -60px;
        left: ${Math.random() * 100}vw;
        font-size: ${16 + Math.random() * 24}px;
        z-index: 9999;
        pointer-events: none;
        animation: moneyFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 2}s forwards;
        transform: rotate(${Math.random() * 360}deg);
        user-select: none;
      `
      document.body.appendChild(el)
      return el
    })

    const style = document.createElement('style')
    style.textContent = `
      @keyframes moneyFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(110vh) rotate(${Math.random() > 0.5 ? '' : '-'}${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    const cleanup = () => {
      particles.forEach(p => p.parentNode?.removeChild(p))
      style.parentNode?.removeChild(style)
    }

    const timer = setTimeout(cleanup, duration + 3000)
    return () => {
      clearTimeout(timer)
      cleanup()
    }
  }, [count, duration])

  return <div ref={containerRef} />
}
