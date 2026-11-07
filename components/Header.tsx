'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ShoppingBag,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { AmbientSoundPlayer } from './AmbientSoundPlayer'
import { BranchId } from '@/lib/types'

interface HeaderProps {
  trayCount: number
  onOpenTray: () => void
  onOpenReserve: () => void
  selectedBranch?: BranchId
  onSelectBranch?: (branch: BranchId) => void
}

export function Header({
  trayCount,
  onOpenTray,
  onOpenReserve,
  selectedBranch = 'lake',
  onSelectBranch,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [branchDropdown, setBranchDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3 gap-4">
        
        {/* Left: Brand Logo + Branch Selector Pill (Fixed spacing, cannot overlap) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a href="#top" className="flex flex-col select-none shrink-0 group">
            <span className="font-serif text-2xl sm:text-3xl font-black text-[#FF5500] tracking-tight leading-none group-hover:text-black transition-colors">
              Rora Dose
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] font-black tracking-widest text-neutral-600 uppercase mt-0.5 whitespace-nowrap">
              Specialty Coffee Co. · Waterfront
            </span>
          </a>

          <div className="h-6 w-0.5 bg-black/15 hidden sm:block shrink-0" />

          {/* Branch Switcher Pill */}
          <div className="relative shrink-0">
            <button
              onClick={() => setBranchDropdown(!branchDropdown)}
              className="flex items-center gap-1.5 rounded-full border-2 border-black bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-black uppercase text-black hover:bg-white transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer whitespace-nowrap"
            >
              <MapPin className="size-3.5 text-[#FF5500]" />
              <span>{selectedBranch === 'niugan' ? '🌿 NIUGAN' : '🌊 LAKEFRONT'}</span>
              <ChevronDown className="size-3 text-black stroke-[3]" />
            </button>

            {branchDropdown && (
              <div className="absolute left-0 mt-2 w-56 rounded-3xl border-3 border-black bg-white p-2.5 shadow-[6px_6px_0px_0px_#000] z-50 animate-in fade-in-50 zoom-in-95">
                <p className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-neutral-600">Select Your Branch</p>
                <button
                  onClick={() => {
                    if (onSelectBranch) onSelectBranch('lake')
                    setBranchDropdown(false)
                  }}
                  className={`w-full text-left rounded-2xl p-2.5 text-xs font-black transition-all cursor-pointer ${
                    selectedBranch === 'lake' ? 'bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]' : 'hover:bg-[#FAF8F5] text-black'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>🌊 Lakefront Branch</span>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-600 mt-0.5">Queen Aurora Resort · 10AM-1AM</p>
                </button>
                <button
                  onClick={() => {
                    if (onSelectBranch) onSelectBranch('niugan')
                    setBranchDropdown(false)
                  }}
                  className={`w-full text-left rounded-2xl p-2.5 text-xs font-black transition-all mt-1.5 cursor-pointer ${
                    selectedBranch === 'niugan' ? 'bg-[#22C55E] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]' : 'hover:bg-[#FAF8F5] text-black'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>🌿 Niugan Branch</span>
                  </div>
                  <p className="text-[10px] font-medium text-neutral-600 mt-0.5">Old National Hwy · 7AM-11PM</p>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-sans text-xs font-black tracking-wider text-black uppercase">
          <a href="#spaces" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
            Our Story
          </a>
          <a href="#menu" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
            Best Seller
          </a>
          <a href="#craft" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
            Our Blends
          </a>
          <a href="#testimonials" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
            Testimonials
          </a>
          <a href="#rewards" className="hover:text-[#FF5500] transition-colors whitespace-nowrap">
            Passport
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Contact Us Pill Button */}
          <button
            onClick={onOpenReserve}
            className="hidden sm:flex rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white border-2 border-black px-5 py-2 font-sans font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer whitespace-nowrap"
          >
            Book Table
          </button>

          {/* Cart Tray Button */}
          <button
            onClick={onOpenTray}
            className="relative flex items-center justify-center size-9 rounded-full border-2 border-black bg-white hover:bg-[#FAF8F5] text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
            aria-label="Open tasting tray"
          >
            <ShoppingBag className="size-4" />
            {trayCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full bg-[#FF5500] text-white border border-black text-[9px] font-black shadow-[1px_1px_0px_0px_#000]">
                {trayCount}
              </span>
            )}
          </button>

          <div className="hidden sm:block shrink-0">
            <AmbientSoundPlayer />
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex size-9 items-center justify-center rounded-full bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] lg:hidden cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="border-t-2 border-black bg-white px-6 py-5 lg:hidden animate-in slide-in-from-top-2">
          {/* Mobile Branch Selector */}
          <div className="mb-3 rounded-2xl border-2 border-black bg-[#FAF8F5] p-3 space-y-1.5 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-black uppercase text-neutral-600 block">Ordering From:</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-black">
              <button
                onClick={() => {
                  if (onSelectBranch) onSelectBranch('lake')
                  setMenuOpen(false)
                }}
                className={`py-2 px-2.5 rounded-xl text-center border-2 border-black transition-all ${
                  selectedBranch === 'lake' ? 'bg-[#FFE600] text-black shadow-[1px_1px_0px_0px_#000]' : 'bg-white text-black'
                }`}
              >
                🌊 Lakefront
              </button>
              <button
                onClick={() => {
                  if (onSelectBranch) onSelectBranch('niugan')
                  setMenuOpen(false)
                }}
                className={`py-2 px-2.5 rounded-xl text-center border-2 border-black transition-all ${
                  selectedBranch === 'niugan' ? 'bg-[#22C55E] text-black shadow-[1px_1px_0px_0px_#000]' : 'bg-white text-black'
                }`}
              >
                🌿 Niugan
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-2 font-sans text-xs font-black uppercase tracking-wider text-black">
            <a
              href="#spaces"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#FF5500]"
            >
              Our Story
            </a>
            <a
              href="#menu"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#FF5500]"
            >
              Best Seller
            </a>
            <a
              href="#craft"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#FF5500]"
            >
              Our Blends
            </a>
            <a
              href="#testimonials"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#FF5500]"
            >
              Testimonials
            </a>
            <a
              href="#rewards"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#FF5500]"
            >
              Passport
            </a>
          </nav>

          <button
            onClick={() => {
              setMenuOpen(false)
              onOpenReserve()
            }}
            className="mt-4 w-full rounded-2xl bg-[#FF5500] text-white border-2 border-black py-3 text-center font-sans font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000]"
          >
            Book Table
          </button>
        </div>
      )}
    </header>
  )
}
