'use client'

import { useState } from 'react'
import { Sparkles, Clock, Users, Wind, Compass } from 'lucide-react'
import { SPACES_DATA } from '@/lib/menu-data'

export function AmbianceSection() {
  const [activeSpaceId, setActiveSpaceId] = useState(SPACES_DATA[0].id)
  const activeSpace = SPACES_DATA.find((s) => s.id === activeSpaceId) || SPACES_DATA[0]

  return (
    <section id="spaces" className="border-b-4 border-black bg-[#00F0FF] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-10 space-y-2">
          <div className="inline-block border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
            ★ SECTION 02 // SANCTUARY MAP ★
          </div>
          <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
            SPACES DESIGNED TO LINGER.
          </h2>
          <p className="font-mono text-xs text-black/90">
            Inside Queen Aurora Garden Resort in Cabuyao, Laguna. Find your zone—by the poolside, at our high-speed study desks, or deep in late-night kwentuhan.
          </p>
        </div>

        {/* Space Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar font-silk text-xs">
          {SPACES_DATA.map((space) => (
            <button
              key={space.id}
              onClick={() => setActiveSpaceId(space.id)}
              className={`neo-btn whitespace-nowrap px-4 py-2.5 font-bold ${
                activeSpaceId === space.id
                  ? 'bg-black text-[#FFE600]'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {space.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Active Space Display */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#000]">
          
          {/* Visual Side */}
          <div className="relative lg:col-span-7 aspect-[4/3] overflow-hidden border-4 border-black bg-black">
            <img
              src={activeSpace.image}
              alt={activeSpace.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
              {activeSpace.tag}
            </div>
          </div>

          {/* Details Side */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="font-arcade text-[10px] text-[#FF5722]">
                {activeSpace.subtitle.toUpperCase()}
              </p>
              <h3 className="font-pixel text-3xl font-bold text-black mt-1">
                {activeSpace.name}
              </h3>
            </div>

            <p className="font-mono text-xs leading-relaxed text-black/85">
              {activeSpace.description}
            </p>

            {/* Atmosphere Specs Grid */}
            <div className="grid grid-cols-2 gap-3 border-3 border-black bg-[#FFFDF0] p-4 text-xs font-mono">
              <div>
                <p className="font-arcade text-[8px] text-black/60">[BEST TIME]</p>
                <p className="font-bold text-black text-[11px] mt-0.5">{activeSpace.stats.bestTime}</p>
              </div>

              <div>
                <p className="font-arcade text-[8px] text-black/60">[SEATING]</p>
                <p className="font-bold text-black text-[11px] mt-0.5">{activeSpace.stats.capacity}</p>
              </div>

              <div>
                <p className="font-arcade text-[8px] text-black/60">[BREEZE]</p>
                <p className="font-bold text-black text-[11px] mt-0.5">{activeSpace.stats.breeze}</p>
              </div>

              <div>
                <p className="font-arcade text-[8px] text-black/60">[VIBE LEVEL]</p>
                <p className="font-bold text-black text-[11px] mt-0.5">{activeSpace.stats.vibe}</p>
              </div>
            </div>

            <a
              href="#reserve"
              className="neo-btn inline-flex items-center gap-2 bg-[#A3E635] px-4 py-2.5 font-arcade text-[10px] text-black"
            >
              <span>[▶] BOOK A SEAT IN THIS SPACE</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
