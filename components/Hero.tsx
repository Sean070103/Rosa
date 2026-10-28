'use client'

import { ArrowRight, Star, Sparkles, MapPin, Coffee, Zap, Plus } from 'lucide-react'
import { MenuItem } from '@/lib/types'

interface HeroProps {
  onQuickAdd: (item: MenuItem) => void
  onOpenReserve: () => void
  featuredItem: MenuItem
}

export function Hero({ onQuickAdd, onOpenReserve, featuredItem }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#FFFDF0] bg-neo-grid pt-8 pb-16 lg:pt-14 lg:pb-24 border-b-4 border-black">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Pixel Headline & Neo Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Sticker Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="-rotate-1 border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
                📍 QUEEN AURORA RESORT · CABUYAO
              </span>
              <span className="rotate-2 border-2 border-black bg-[#00F0FF] px-2.5 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
                ⚡ 10:00 AM — 1:00 AM DAILY
              </span>
              <span className="-rotate-2 border-2 border-black bg-[#A3E635] px-2.5 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
                ★ WATERFRONT VERANDA
              </span>
            </div>

            {/* Giant Pixel Title */}
            <div className="space-y-1">
              <h1 className="font-pixel text-5xl font-black leading-tight tracking-tight text-black sm:text-7xl lg:text-8xl">
                LAKE BREEZE.
                <br />
                <span className="bg-[#FFE600] px-2 border-3 border-black shadow-[4px_4px_0_0_#000] inline-block mt-1">
                  SLOW COFFEE.
                </span>
              </h1>
              <p className="font-arcade text-xs text-[#FF5722] pt-2 tracking-wider">
                &gt;&gt; HAND-PULLED BENGUET ESPRESSO &amp; POOLSIDE KWENTUHAN &lt;&lt;
              </p>
            </div>

            {/* Description */}
            <p className="max-w-xl font-mono text-sm leading-relaxed text-black/85 bg-white border-3 border-black p-4 shadow-[4px_4px_0_0_#000]">
              Tucked along the scenic shores of Laguna de Bay inside Queen Aurora Garden Resort. Pull up a chair for morning pour-overs, golden hour sunsets, or late-night study sessions that stretch until 1:00 AM.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1 font-silk text-xs">
              <a
                href="#menu"
                className="neo-btn flex items-center gap-2 bg-[#FFE600] px-6 py-3.5 font-bold text-black"
              >
                <span>[▶] EXPLORE THE MENU</span>
                <ArrowRight className="size-4" />
              </a>

              <button
                onClick={onOpenReserve}
                className="neo-btn flex items-center gap-2 bg-[#00F0FF] px-6 py-3.5 font-bold text-black"
              >
                <Sparkles className="size-4" />
                <span>[★] RESERVE SUNSET SEAT</span>
              </button>
            </div>

            {/* Neo Stats Ticker */}
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="border-3 border-black bg-white p-3 shadow-[3px_3px_0_0_#000]">
                <p className="font-arcade text-lg font-black text-[#FF3366]">1,650M</p>
                <p className="font-silk text-[10px] text-black/70 mt-1">BENGUET HIGH PEAKS</p>
              </div>
              <div className="border-3 border-black bg-[#A3E635] p-3 shadow-[3px_3px_0_0_#000]">
                <p className="font-arcade text-lg font-black text-black">BAY VIEW</p>
                <p className="font-silk text-[10px] text-black/70 mt-1">SUNSET VERANDA</p>
              </div>
              <div className="border-3 border-black bg-[#D8B4FE] p-3 shadow-[3px_3px_0_0_#000]">
                <p className="font-arcade text-lg font-black text-black">1:00 AM</p>
                <p className="font-silk text-[10px] text-black/70 mt-1">NIGHT SANCTUARY</p>
              </div>
            </div>

          </div>

          {/* Right Column: Layered Neo Photo Showcase with Real Cafe Images */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Picture Frame (10004.jpg - Ribbed Glass Cold Brew Trio) */}
            <div className="relative border-4 border-black bg-[#FFE600] p-3 shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center justify-between border-b-3 border-black pb-2 mb-2 font-arcade text-[10px] text-black">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 bg-black inline-block" />
                  RORA_DOSE_INTERIOR.JPG
                </span>
                <span className="bg-black text-[#00F0FF] px-2 py-0.5 font-silk">
                  LIVE SHOT
                </span>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden border-3 border-black bg-black">
                <img
                  src="/cafe_pic/10004.jpg"
                  alt="Rora Dose Cold Brew Glasses inside cafe"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between font-arcade text-[9px] text-black">
                <span>RIBBED GLASS ICED SERIES</span>
                <span>★ 4.9 RATING ★</span>
              </div>
            </div>

            {/* Floating Poolside Picture Frame (10018.jpg - Iced Drinks by the Resort Pool) */}
            <div className="absolute -bottom-8 -left-4 sm:-left-8 max-w-[240px] border-3 border-black bg-[#00F0FF] p-2.5 shadow-[6px_6px_0_0_#000] rotate-2 transition-transform hover:rotate-0">
              <div className="aspect-square w-full overflow-hidden border-2 border-black bg-black mb-2">
                <img
                  src="/cafe_pic/10018.jpg"
                  alt="Iced drinks by Queen Aurora Resort pool"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="font-arcade text-[9px] text-black leading-tight">
                POOLSIDE VERANDA
              </p>
              <p className="font-mono text-[10px] text-black/80 mt-0.5">
                Chilled sips by the water.
              </p>
            </div>

            {/* Floating Flagship Drink Pill (10005.jpg - Hot Latte Art) */}
            <div className="absolute -top-6 -right-4 max-w-[210px] border-3 border-black bg-white p-2.5 shadow-[6px_6px_0_0_#000] -rotate-3 transition-transform hover:rotate-0">
              <div className="flex items-center gap-2.5">
                <div className="size-12 shrink-0 border-2 border-black overflow-hidden bg-black">
                  <img
                    src="/cafe_pic/10005.jpg"
                    alt="Honey Sea Salt Latte"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-arcade text-[8px] text-[#FF5722]">FLAGSHIP</p>
                  <p className="font-pixel text-xs font-bold text-black truncate leading-tight">
                    Honey Sea Salt
                  </p>
                  <button
                    onClick={() => onQuickAdd(featuredItem)}
                    className="mt-1 flex items-center gap-1 bg-[#FFE600] border border-black px-2 py-0.5 font-arcade text-[8px] hover:bg-black hover:text-white"
                  >
                    <Plus className="size-2.5" />
                    <span>ADD ₱185</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
