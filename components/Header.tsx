'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  Sun,
  MapPin,
  Coffee,
  Calendar,
  Volume2,
  VolumeX,
  SlidersHorizontal,
} from 'lucide-react'
import { AmbientSoundPlayer } from './AmbientSoundPlayer'

interface HeaderProps {
  trayCount: number
  onOpenTray: () => void
  onOpenReserve: () => void
}

export function Header({ trayCount, onOpenTray, onOpenReserve }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cabuyaoTime, setCabuyaoTime] = useState('')
  const [isOpenNow, setIsOpenNow] = useState(true)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now)
      setCabuyaoTime(timeString)

      const manilaHours = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })).getHours()
      const open = manilaHours >= 10 || manilaHours < 1
      setIsOpenNow(open)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Top Neo-Brutalist Hazard / Status Bar */}
      <div className="border-b-3 border-black bg-[#FFE600] px-4 py-2 font-arcade text-[10px] text-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`inline-block size-2.5 border border-black ${isOpenNow ? 'bg-[#22C55E] animate-ping' : 'bg-[#EF4444]'}`} />
            <span className="font-bold">
              [{isOpenNow ? 'STATUS: ONLINE / BREWING' : 'STATUS: CLOSED'}]
            </span>
            <span className="hidden sm:inline">:: CABUYAO {cabuyaoTime || '10:00 AM — 1:00 AM'}</span>
          </div>

          <div className="flex items-center gap-3 font-silk">
            <span className="hidden md:inline bg-black text-[#FFE600] px-2 py-0.5 border border-black text-[9px]">
              LAGUNA DE BAY · RESORT SANCTUARY
            </span>
            <Link
              href="/admin"
              className="neo-btn bg-black text-[#FFE600] px-2 py-1 font-arcade text-[8px] hover:bg-[#FF3366] hover:text-white"
            >
              [ADMIN OS]
            </Link>
            <AmbientSoundPlayer />
          </div>

        </div>
      </div>

      {/* Main Sticky Neo Navigation */}
      <header className="sticky top-0 z-40 border-b-4 border-black bg-[#FFFDF0] py-3.5 shadow-[0_4px_0_0_#000]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          
          {/* Logo with RD Emblem */}
          <a href="#top" className="group flex items-center gap-3">
            <div className="size-11 overflow-hidden border-3 border-black bg-[#4E3629] shadow-[3px_3px_0_0_#000] transition-transform group-hover:rotate-6">
              <img
                src="/cafe_pic/10001.jpg"
                alt="Rora Dose RD Emblem"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-pixel text-2xl font-black leading-none tracking-tight text-black sm:text-3xl">
                RORA DOSE
              </span>
              <span className="font-arcade text-[8px] tracking-widest text-[#FF5722] mt-0.5">
                WATERFRONT COFFEE [PH]
              </span>
            </div>
          </a>

          {/* Desktop Links with Neo Hover Tabs */}
          <nav className="hidden items-center gap-2 font-silk text-xs lg:flex">
            <a
              href="#menu"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#FFE600] hover:shadow-[3px_3px_0_0_#000]"
            >
              [1] MENU
            </a>
            <a
              href="#spaces"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#00F0FF] hover:shadow-[3px_3px_0_0_#000]"
            >
              [2] SPACES
            </a>
            <a
              href="#craft"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#A3E635] hover:shadow-[3px_3px_0_0_#000]"
            >
              [3] CRAFT
            </a>
            <a
              href="#reserve"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#FF8A00] hover:shadow-[3px_3px_0_0_#000]"
            >
              [4] SUNSET TABLE
            </a>
            <a
              href="#rewards"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#D8B4FE] hover:shadow-[3px_3px_0_0_#000]"
            >
              [5] PASSPORT
            </a>
            <a
              href="#visit"
              className="border-2 border-transparent px-3 py-1 font-bold text-black transition-all hover:border-black hover:bg-[#FF3366] hover:text-white hover:shadow-[3px_3px_0_0_#000]"
            >
              [6] MAP & ACCESS
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Tray Action */}
            <button
              onClick={onOpenTray}
              className="neo-btn flex items-center gap-2 bg-[#00F0FF] px-3.5 py-2 font-arcade text-[10px] text-black"
              aria-label="Open tray"
            >
              <ShoppingBag className="size-3.5" />
              <span>TRAY</span>
              <span className="flex size-5 items-center justify-center border-2 border-black bg-[#FFE600] text-[9px] font-bold">
                {trayCount}
              </span>
            </button>

            {/* Reserve Action */}
            <button
              onClick={onOpenReserve}
              className="neo-btn hidden sm:flex items-center gap-1.5 bg-[#A3E635] px-3.5 py-2 font-arcade text-[10px] text-black"
            >
              <Calendar className="size-3.5" />
              <span>BOOK SEAT</span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="neo-btn flex size-9 items-center justify-center bg-[#FFE600] text-black lg:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="mt-3 border-t-3 border-black bg-[#FFFDF0] px-6 py-6 lg:hidden animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3 font-arcade text-xs">
              <a
                href="#menu"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [1] BROWSE MENU
              </a>
              <a
                href="#spaces"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [2] CAFE SPACES & POOL
              </a>
              <a
                href="#craft"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [3] BEAN SPECTRUM & CRAFT
              </a>
              <a
                href="#reserve"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [4] RESERVE SUNSET TABLE
              </a>
              <a
                href="#rewards"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [5] 8-STAMP PASSPORT
              </a>
              <a
                href="#visit"
                onClick={() => setMenuOpen(false)}
                className="border-2 border-black bg-white p-2.5 shadow-[3px_3px_0_0_#000]"
              >
                [6] DIRECTIONS & RESORT GATE
              </a>
            </nav>

            <button
              onClick={() => {
                setMenuOpen(false)
                onOpenReserve()
              }}
              className="neo-btn mt-5 w-full bg-[#A3E635] p-3 text-center font-arcade text-xs"
            >
              ★ RESERVE GOLDEN HOUR SEAT ★
            </button>
          </div>
        )}
      </header>
    </>
  )
}
