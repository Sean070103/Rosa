'use client'

import { useState, useEffect } from 'react'

const EDITORIAL_STEPS = [
  { threshold: 0, text: 'SLOW ROASTING IN CABUYAO...' },
  { threshold: 22, text: 'WARMING THE CERAMIC POTS (93.5°C)...' },
  { threshold: 48, text: 'COARSE GRINDING BENGUET SINGLE ORIGIN...' },
  { threshold: 72, text: 'FRESH BATCH POURING BY THE BAY...' },
  { threshold: 92, text: 'PULLING WARM SOURDOUGH FROM THE OVEN...' },
  { threshold: 100, text: 'WELCOME TO ROSA DOSE ☕' },
]

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)

  const handleDismiss = () => {
    // Restore scroll immediately — do NOT rely on useEffect cleanup,
    // because <LoadingScreen> stays mounted in the layout tree even
    // after returning null, so the cleanup never fires.
    document.body.style.overflow = ''
    setIsLoaded(true)
    setTimeout(() => {
      setIsRemoved(true)
    }, 450)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const step = Math.floor(Math.random() * 15) + 8
        return Math.min(prev + step, 100)
      })
    }, 110)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (progress >= 100 && !isLoaded) {
      const exitTimer = setTimeout(() => {
        handleDismiss()
      }, 350)
      return () => clearTimeout(exitTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  if (isRemoved) return null

  const currentStep =
    [...EDITORIAL_STEPS].reverse().find((s) => progress >= s.threshold)?.text ||
    'BREWING ROSA DOSE...'

  return (
    <div
      aria-label="Loading Rosa Dose 70s Retro Editorial"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF4E8] bg-vintage-paper px-4 transition-all duration-500 ease-out ${
        isLoaded ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* 70s Top Editorial Badge */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5 border-2 border-[#341F14] bg-[#FBE48A] px-3.5 py-1.5 shadow-70s-sm">
        <span className="size-2 rounded-full bg-[#C8521A] animate-ping" />
        <span className="font-editorial text-xs italic font-bold tracking-wide text-[#341F14]">
          Vol. 74 · Waterfront Edition
        </span>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-6 right-6 retro-btn bg-[#FAF4E8] hover:bg-[#FBE48A] px-4 py-1.5 font-sans font-bold text-xs text-[#341F14] uppercase tracking-wider"
      >
        Skip [Esc] &rarr;
      </button>

      {/* Main 70s Editorial Centerpiece */}
      <div className="w-full max-w-md border-4 border-[#341F14] bg-[#FFFDF7] p-7 sm:p-9 shadow-70s-xl relative">
        
        {/* Retro Stamp Header */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-[#341F14]/40 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-[#C8521A]">
            <span>✿</span>
            <span>✿</span>
            <span>✿</span>
          </div>
          <span className="font-sans text-[11px] font-bold tracking-widest text-[#341F14]/75 uppercase">
            Laguna de Bay Waterfront Roastery
          </span>
        </div>

        {/* 70s Vintage Ceramic Diner Mug with Animated Steam */}
        <div className="flex flex-col items-center justify-center mb-6">
          {/* Swirling 70s Steam */}
          <div className="flex items-end justify-center gap-3.5 h-8 mb-1.5">
            <span className="w-2 h-5 bg-[#C8521A] rounded-full animate-retro-steam-1 opacity-80" />
            <span className="w-2.5 h-7 bg-[#341F14] rounded-full animate-retro-steam-2 opacity-70" />
            <span className="w-2 h-5 bg-[#D97736] rounded-full animate-retro-steam-3 opacity-80" />
          </div>

          {/* Arched Ceramic Mug */}
          <div className="relative">
            <div className="relative w-24 h-20 border-4 border-[#341F14] bg-[#FBE48A] rounded-b-2xl shadow-70s flex items-center justify-center overflow-hidden">
              {/* Coffee Liquid Filling */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-[#341F14] transition-all duration-150"
                style={{ height: `${Math.min(progress, 88)}%` }}
              >
                {/* Froth / Crema layer */}
                <div className="h-2 w-full bg-[#E8C08A]" />
              </div>

              {/* 70s Retro Emblem */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-editorial text-2xl font-black italic text-[#341F14]">
                  RD
                </span>
                <span className="font-script text-xs font-bold text-[#C8521A] -mt-1">
                  est. 2024
                </span>
              </div>
            </div>

            {/* Chunky Ceramic Handle */}
            <div className="absolute top-2.5 -right-4 w-5 h-11 border-4 border-[#341F14] rounded-r-2xl bg-[#FFFDF7] -z-10 shadow-70s-sm" />

            {/* Ceramic Saucer */}
            <div className="w-32 h-3 border-4 border-[#341F14] bg-[#FAF4E8] rounded-full -mt-1.5 mx-auto shadow-70s-sm" />
          </div>
        </div>

        {/* 70s Retro Editorial Masthead Title */}
        <div className="text-center mb-6">
          <p className="font-script text-lg text-[#C8521A] font-bold">
            Independent Bakery &amp; Waterfront Slow Bar
          </p>
          <h1 className="font-editorial text-4xl sm:text-5xl font-black tracking-tight text-[#341F14] italic">
            ROSA DOSE
          </h1>
          <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#341F14]/70 mt-1">
            Cabuyao, Laguna · Queen Aurora Resort
          </p>
        </div>

        {/* Vintage Groovy Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between font-editorial text-xs mb-2 font-bold">
            <span className="text-[#341F14] italic">Slow Batch Extraction</span>
            <span className="bg-[#341F14] text-[#FBE48A] px-2 py-0.5 border border-[#341F14] font-sans font-bold text-[11px]">
              {progress}%
            </span>
          </div>

          {/* Chunky Chocolate Border & Burnt Orange Fill */}
          <div className="h-6 w-full border-3 border-[#341F14] bg-[#FAF4E8] p-0.5 shadow-70s-sm">
            <div
              className="h-full bg-gradient-to-r from-[#FBE48A] via-[#D97736] to-[#C8521A] border-r-2 border-[#341F14] transition-all duration-150 flex items-center justify-end"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Editorial Status Note */}
        <div className="border-2 border-[#341F14] bg-[#FAF4E8] px-3.5 py-2.5 font-sans text-xs font-semibold text-[#341F14] flex items-center justify-between shadow-70s-sm">
          <span className="truncate">{currentStep}</span>
          <span className="text-[#C8521A] font-bold text-sm">✿</span>
        </div>

        {/* Vintage Footer Note */}
        <div className="mt-5 pt-3 border-t-2 border-dashed border-[#341F14]/30 flex items-center justify-between font-sans text-[11px] text-[#341F14]/70">
          <span className="italic">Open Daily 10 AM — 1 AM</span>
          <span className="font-bold text-[#C8521A]">[TAP TO ENTER]</span>
        </div>
      </div>

      {/* Gentle Footer Hint */}
      <p className="mt-6 font-editorial italic text-sm text-[#341F14]/75 tracking-wide">
        Press [Space] or click anywhere to step inside the veranda
      </p>
    </div>
  )
}
