'use client'

import { useState } from 'react'
import { SPACES_DATA } from '@/lib/menu-data'

export function AmbianceSection() {
  const [activeSpaceId, setActiveSpaceId] = useState(SPACES_DATA[0].id)
  const activeSpace = SPACES_DATA.find((s) => s.id === activeSpaceId) || SPACES_DATA[0]

  return (
    <section id="spaces" className="border-b-4 border-[#341F14] bg-[#FBE48A] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* 70s Editorial Header */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 border-2 border-[#341F14] bg-[#C8521A] px-3.5 py-1 text-xs font-bold text-[#FAF4E8] shadow-70s-sm uppercase tracking-wider">
            ✿ Section 02 // The Sanctuary Map ✿
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight">
            Spaces Designed to Linger.
          </h2>
          <p className="font-sans text-sm text-[#341F14]/90 leading-relaxed max-w-xl">
            Inside Queen Aurora Garden Resort in Cabuyao, Laguna. Find your zone—by the poolside, at our high-speed study desks, or deep in late-night kwentuhan by the bay.
          </p>
        </div>

        {/* Space Navigation Tabs — 70s Pill Style */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {SPACES_DATA.map((space) => (
            <button
              key={space.id}
              onClick={() => setActiveSpaceId(space.id)}
              className={`retro-btn whitespace-nowrap px-5 py-2.5 font-editorial italic text-xs font-bold transition-all ${
                activeSpaceId === space.id
                  ? 'bg-[#341F14] text-[#FBE48A]'
                  : 'bg-[#FFFDF7] text-[#341F14] hover:bg-[#FAF4E8]'
              }`}
            >
              {space.name}
            </button>
          ))}
        </div>

        {/* Active Space Display Card */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center border-4 border-[#341F14] bg-[#FFFDF7] p-6 sm:p-8 shadow-70s-xl">
          
          {/* Visual Side — Warm Textured Photography */}
          <div className="relative lg:col-span-7 aspect-[4/3] overflow-hidden border-4 border-[#341F14] rounded-t-[50px] bg-[#341F14]">
            <img
              src={activeSpace.image}
              alt={activeSpace.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 border-2 border-[#341F14] bg-[#FBE48A] px-3 py-1 font-editorial italic text-xs font-bold text-[#341F14] shadow-70s-sm">
              ✿ {activeSpace.tag}
            </div>
          </div>

          {/* Details Side */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="font-script text-base text-[#C8521A] font-bold">
                {activeSpace.subtitle}
              </p>
              <h3 className="font-editorial text-3xl font-black italic text-[#341F14] mt-1 leading-tight">
                {activeSpace.name}
              </h3>
            </div>

            <p className="font-sans text-sm leading-relaxed text-[#341F14]/85">
              {activeSpace.description}
            </p>

            {/* Atmosphere Specs Grid */}
            <div className="grid grid-cols-2 gap-3 border-3 border-[#341F14] bg-[#FAF4E8] p-4 shadow-70s-sm">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#341F14]/60">Best Time</p>
                <p className="font-editorial italic font-bold text-[#341F14] text-sm mt-0.5">{activeSpace.stats.bestTime}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#341F14]/60">Seating</p>
                <p className="font-editorial italic font-bold text-[#341F14] text-sm mt-0.5">{activeSpace.stats.capacity}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#341F14]/60">Bay Breeze</p>
                <p className="font-editorial italic font-bold text-[#341F14] text-sm mt-0.5">{activeSpace.stats.breeze}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#341F14]/60">Vibe Level</p>
                <p className="font-editorial italic font-bold text-[#341F14] text-sm mt-0.5">{activeSpace.stats.vibe}</p>
              </div>
            </div>

            <a
              href="#reserve"
              className="retro-btn inline-flex items-center gap-2 bg-[#C8521A] text-[#FAF4E8] px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#341F14]"
            >
              <span>Book a Seat in This Space</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
