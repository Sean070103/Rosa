'use client'

import { useState } from 'react'
import {
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react'
import { AmbientSoundPlayer } from './AmbientSoundPlayer'

interface HeaderProps {
  trayCount: number
  onOpenTray: () => void
  onOpenReserve: () => void
}

export function Header({ trayCount, onOpenTray, onOpenReserve }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[#F4EFE6] border-b border-[#1A3B2F]/15 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        
        {/* Left Links */}
        <nav className="hidden items-center gap-7 lg:flex font-sans text-xs font-bold tracking-wider text-[#1A3B2F] uppercase">
          <a href="#spaces" className="hover:text-[#D25427] transition-colors">
            Our Story
          </a>
          <a href="#menu" className="hover:text-[#D25427] transition-colors">
            Best Seller
          </a>
          <a href="#craft" className="hover:text-[#D25427] transition-colors">
            Our Blends
          </a>
        </nav>

        {/* Center Vintage Script Logo */}
        <a href="#top" className="flex flex-col items-center group select-none">
          <span className="font-script text-3xl sm:text-4xl font-bold text-[#1A3B2F] tracking-wide leading-none group-hover:text-[#D25427] transition-colors">
            Rosa Dose
          </span>
          <span className="font-sans text-[8px] sm:text-[9px] font-extrabold tracking-[0.25em] text-[#1A3B2F]/70 uppercase mt-0.5">
            Specialty Coffee Co. · Waterfront
          </span>
        </a>

        {/* Right Links & Action */}
        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-7 font-sans text-xs font-bold tracking-wider text-[#1A3B2F] uppercase">
            <a href="#testimonials" className="hover:text-[#D25427] transition-colors">
              Testimonials
            </a>
            <a href="#rewards" className="hover:text-[#D25427] transition-colors">
              Passport
            </a>
          </nav>

          {/* Contact Us Pill Button */}
          <button
            onClick={onOpenReserve}
            className="rounded-full bg-[#D25427] text-[#FAF4E8] px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#b8431c] transition-colors shadow-sm"
          >
            Contact Us
          </button>

          {/* Cart Tray Button */}
          <button
            onClick={onOpenTray}
            className="relative flex items-center justify-center size-9 rounded-full border border-[#1A3B2F]/30 bg-white hover:bg-[#F4EFE6] text-[#1A3B2F] transition-colors"
            aria-label="Open tasting tray"
          >
            <ShoppingBag className="size-4" />
            {trayCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#D25427] text-white text-[9px] font-black">
                {trayCount}
              </span>
            )}
          </button>

          <AmbientSoundPlayer />
        </div>

        {/* Mobile Hamburger & Cart */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenTray}
            className="relative flex items-center justify-center size-9 rounded-full border border-[#1A3B2F]/30 bg-white text-[#1A3B2F]"
            aria-label="Open tray"
          >
            <ShoppingBag className="size-4" />
            {trayCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#D25427] text-white text-[9px] font-black">
                {trayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex size-9 items-center justify-center rounded-full bg-[#1A3B2F] text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="border-t border-[#1A3B2F]/15 bg-[#F4EFE6] px-6 py-5 lg:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 font-sans text-xs font-bold uppercase tracking-wider text-[#1A3B2F]">
            <a
              href="#spaces"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Our Story
            </a>
            <a
              href="#menu"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Best Seller
            </a>
            <a
              href="#craft"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Our Blends
            </a>
            <a
              href="#testimonials"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Testimonials
            </a>
            <a
              href="#rewards"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Passport
            </a>
            <a
              href="#visit"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 hover:text-[#D25427]"
            >
              Location &amp; Hours
            </a>
          </nav>

          <button
            onClick={() => {
              setMenuOpen(false)
              onOpenReserve()
            }}
            className="mt-4 w-full rounded-full bg-[#D25427] text-[#FAF4E8] py-3 text-center font-sans font-bold text-xs uppercase tracking-wider"
          >
            Contact Us &amp; Reserve
          </button>
        </div>
      )}
    </header>
  )
}
