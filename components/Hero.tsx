'use client'

import { MenuItem } from '@/lib/types'

interface HeroProps {
  onQuickAdd: (item: MenuItem) => void
  onOpenReserve: () => void
  featuredItem: MenuItem
}

export function Hero({ onOpenReserve }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F4EFE6] flex flex-col justify-between pt-6 sm:pt-8 pb-0">
      
      {/* ── Top Pill Badge ── */}
      <div className="relative z-20 flex justify-center pb-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1A3B2F] text-[#F4EFE6] px-5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
          <span className="text-[#D25427] text-xs">✦</span>
          <span>SPECIALTY COFFEE CO. · EST. 2024</span>
          <span className="text-[#D25427] text-xs">✦</span>
        </span>
      </div>

      {/* ── Main Hero Stage: Split Typography + Centered Natural Hand & Cup ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] px-4 sm:px-8 select-none">
        
        {/* Layer 1: Highly Readable Split Typography (Behind Cup) */}
        <div className="relative z-0 w-full max-w-6xl mx-auto flex flex-col justify-center">
          
          {/* Top Line: GOOD [cup in middle] COFFEE. */}
          <div className="flex items-center justify-between w-full font-bebas text-[#1A3B2F] tracking-tight leading-[0.88]">
            <span
              className="text-left font-black"
              style={{ fontSize: 'clamp(3.5rem, 11.5vw, 10rem)' }}
            >
              GOOD
            </span>
            <span
              className="text-right font-black"
              style={{ fontSize: 'clamp(3.5rem, 11.5vw, 10rem)' }}
            >
              COFFEE.
            </span>
          </div>

          {/* Bottom Line: GOOD [cup in middle] MOOD. */}
          <div className="flex items-center justify-between w-full font-bebas text-[#D25427] tracking-tight leading-[0.88] -mt-2 sm:-mt-5">
            <span
              className="text-left font-black"
              style={{ fontSize: 'clamp(3.5rem, 11.5vw, 10rem)' }}
            >
              GOOD
            </span>
            <span
              className="text-right font-black"
              style={{ fontSize: 'clamp(3.5rem, 11.5vw, 10rem)' }}
            >
              MOOD.
            </span>
          </div>

        </div>

        {/* Layer 2: Ultra HD Centered Hand with Natural Skin Tone (In Front of Text) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-6 sm:pt-10">
          <img
            src="/hero-cup-cutout.png"
            alt="Rosa Dose Hand Holding Specialty Coffee Cup"
            className="h-[400px] sm:h-[480px] lg:h-[540px] w-auto object-contain filter drop-shadow-[0_24px_36px_rgba(26,59,47,0.28)]"
          />
        </div>

        {/* Layer 3: Clean Pill CTA Buttons */}
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-3.5 mt-8 sm:mt-12 pointer-events-auto">
          <a
            href="#menu"
            className="rounded-full bg-[#D25427] text-[#FAF4E8] px-8 sm:px-10 py-3.5 font-sans font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-[#b8431c] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            ORDER NOW
          </a>
          <button
            onClick={onOpenReserve}
            className="rounded-full bg-[#F4EFE6] text-[#1A3B2F] border-2 border-[#1A3B2F] px-8 sm:px-10 py-3.5 font-sans font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-white hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            SHOP BEST SELLERS
          </button>
        </div>

      </div>

      {/* ── Bottom Dark Green Editorial Ticker Ribbon ── */}
      <div className="relative z-20 w-full bg-[#1A3B2F] text-[#F4EFE6] py-3 sm:py-3.5 overflow-hidden select-none border-t border-[#1A3B2F] mt-4">
        <div className="animate-marquee flex items-center whitespace-nowrap font-bebas text-sm sm:text-base tracking-widest uppercase">
          {[
            'FRESHLY ROASTED',
            'SMALL BATCH',
            'DELIVERED FAST',
            'WATERFRONT BREWED',
            '100% PHILIPPINE SPECIALTY',
            'LAGUNA DE BAY VERANDA',
            'OPEN DAILY 10 AM — 1 AM',
            'ARTISANAL BAKERY',
          ].concat([
            'FRESHLY ROASTED',
            'SMALL BATCH',
            'DELIVERED FAST',
            'WATERFRONT BREWED',
            '100% PHILIPPINE SPECIALTY',
            'LAGUNA DE BAY VERANDA',
            'OPEN DAILY 10 AM — 1 AM',
            'ARTISANAL BAKERY',
          ]).map((phrase, i) => (
            <div key={i} className="flex items-center mx-5 gap-4">
              <span>{phrase}</span>
              <span className="text-[#D25427] text-xs">✦</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
