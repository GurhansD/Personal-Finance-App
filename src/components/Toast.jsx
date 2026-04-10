import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, Zap, Trophy, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration }])
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const icons = {
    xp: <Zap className="w-4 h-4 text-yellow-400" />,
    achievement: <Trophy className="w-4 h-4 text-yellow-400" />,
    success: <CheckCircle2 className="w-4 h-4 text-brand-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    error: <AlertTriangle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  }

  const colors = {
    xp: 'border-yellow-500/30 bg-yellow-500/10',
    achievement: 'border-yellow-500/30 bg-yellow-500/10',
    success: 'border-brand-500/30 bg-brand-500/10',
    warning: 'border-orange-500/30 bg-orange-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  }

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl
        bg-slate-900/90 shadow-2xl max-w-sm w-full
        transition-all duration-300
        ${colors[toast.type] || colors.info}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="mt-0.5 flex-shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <div className="text-sm font-semibold text-white">{toast.title}</div>}
        {toast.message && <div className="text-xs text-slate-400 mt-0.5">{toast.message}</div>}
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
