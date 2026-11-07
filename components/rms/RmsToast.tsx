'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-3xl shadow-[5px_5px_0px_0px_#000] border-3 border-black flex items-start gap-3.5 transition-all duration-200 animate-in slide-in-from-bottom-5 bg-white text-black ${
              t.type === 'success'
                ? 'border-black'
                : t.type === 'error'
                ? 'border-black'
                : t.type === 'warning'
                ? 'border-black'
                : 'border-black'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#FF5500] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-black">{t.title}</p>
              {t.message && <p className="text-xs font-medium text-neutral-600 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="border-2 border-black rounded-xl p-1 bg-white hover:bg-neutral-100 text-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      toast: (title: string, message?: string) => {
        console.log(`[Toast] ${title}: ${message}`)
      },
    }
  }
  return context
}
