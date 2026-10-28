'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

export function CraftSection() {
  const [roastSelection, setRoastSelection] = useState<'light' | 'medium' | 'dark'>('light')

  const roastProfiles = {
    light: {
      title: 'Light Roast // Benguet Atok Washed',
      flavor: 'High floral acidity, crisp green apple, delicate jasmine, and sweet citrus zest.',
      elevation: '1,650M Above Sea Level',
      brewMethod: 'Japanese V60 Cone Pour-Over at 92°C',
      metrics: { acidity: 90, body: 40, sweetness: 85 },
      image: '/cafe_pic/10007.jpg',
    },
    medium: {
      title: 'Medium Roast // Mt. Apo Anaerobic',
      flavor: 'Wild stone fruit, juicy plum, balanced cacao butter sweetness, and winey finish.',
      elevation: '1,500M Above Sea Level',
      brewMethod: 'Lever Double Shot & Iced Ripple',
      metrics: { acidity: 65, body: 75, sweetness: 90 },
      image: '/cafe_pic/10009.jpg',
    },
    dark: {
      title: 'Dark Roast // Lipa Heritage Liberica',
      flavor: 'Smoked cedar wood, dark baker chocolate, ripe jackfruit undertones, and dense crema.',
      elevation: 'Southern Luzon Foothills',
      brewMethod: '18H Slow Drip Cold Brew',
      metrics: { acidity: 20, body: 95, sweetness: 70 },
      image: '/cafe_pic/10012.jpg',
    },
  }

  const current = roastProfiles[roastSelection]

  return (
    <section id="craft" className="border-b-4 border-[#341F14] bg-[#FAF4E8] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Craft Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 border-2 border-[#341F14] bg-[#FBE48A] px-3.5 py-1 text-xs font-bold text-[#341F14] shadow-70s-sm uppercase tracking-wider">
              ✿ Section 03 // Ethical Terroir ✿
            </div>

            <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight leading-tight">
              From Highland Peaks to the Bay.
            </h2>

            <p className="font-sans text-sm leading-relaxed text-[#341F14]/85">
              Direct partnership with smallholder farming cooperatives in Benguet and Bansalan, Mt. Apo. We roast in micro-batches and calibrate water remineralization to 120 PPM for maximum cup sweetness.
            </p>

            {/* Photo Cards Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border-3 border-[#341F14] bg-[#FFFDF7] p-2.5 shadow-70s">
                <div className="aspect-square overflow-hidden border-2 border-[#341F14] rounded-t-3xl bg-[#341F14] mb-2.5">
                  <img
                    src="/cafe_pic/10017.jpg"
                    alt="Precision tamped portafilter"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-editorial italic text-sm font-black text-[#341F14]">Precision Extraction</p>
                <p className="font-sans text-[10px] text-[#341F14]/60">Tamped to 20kg pressure.</p>
              </div>

              <div className="border-3 border-[#341F14] bg-[#FBE48A] p-2.5 shadow-70s">
                <div className="aspect-square overflow-hidden border-2 border-[#341F14] rounded-t-3xl bg-[#341F14] mb-2.5">
                  <img
                    src="/cafe_pic/10008.jpg"
                    alt="Coffee cupping flight"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-editorial italic text-sm font-black text-[#341F14]">Cupping Flight</p>
                <p className="font-sans text-[10px] text-[#341F14]/60">Multi-origin tasting trays.</p>
              </div>
            </div>
          </div>

          {/* Right Interactive Roast Profile — 70s Editorial Style */}
          <div className="lg:col-span-6 border-4 border-[#341F14] bg-[#FFFDF7] p-6 sm:p-8 shadow-70s-xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#341F14]/40 pb-3">
              <div>
                <p className="font-script text-base font-bold text-[#C8521A]">
                  Calibrate Roast Profile
                </p>
                <h3 className="font-editorial text-2xl font-black italic text-[#341F14] mt-0.5">
                  The Bean Spectrum
                </h3>
              </div>
              <SlidersHorizontal className="size-5 text-[#C8521A]" />
            </div>

            {/* Selector Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Benguet Light' },
                { id: 'medium', label: 'Apo Medium' },
                { id: 'dark', label: 'Liberica Bold' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setRoastSelection(btn.id as 'light' | 'medium' | 'dark')}
                  className={`retro-btn py-2.5 text-center font-editorial italic text-xs font-bold ${
                    roastSelection === btn.id
                      ? 'bg-[#C8521A] text-[#FAF4E8]'
                      : 'bg-[#FAF4E8] text-[#341F14] hover:bg-[#FBE48A]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Details for Selected Roast */}
            <div className="border-3 border-[#341F14] bg-[#FAF4E8] p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 shrink-0 border-2 border-[#341F14] rounded-full overflow-hidden bg-[#341F14]">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-editorial text-lg font-black italic text-[#341F14] leading-tight">
                    {current.title}
                  </h4>
                  <p className="font-script text-sm text-[#C8521A] font-bold mt-0.5">
                    {current.elevation}
                  </p>
                </div>
              </div>

              <p className="font-sans text-xs text-[#341F14]/85 leading-relaxed">
                {current.flavor}
              </p>

              {/* Warm Analog Progress Meters */}
              <div className="space-y-3 pt-2 border-t-2 border-dashed border-[#341F14]/30">
                {[
                  { label: 'Acidity (Fruit Brightness)', value: current.metrics.acidity, color: 'bg-[#C8521A]' },
                  { label: 'Body (Velvet Texture)', value: current.metrics.body, color: 'bg-[#341F14]' },
                  { label: 'Sweetness (Wild Honey)', value: current.metrics.sweetness, color: 'bg-[#FBE48A]' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between font-sans text-[10px] font-bold text-[#341F14]/80 mb-1.5">
                      <span className="uppercase tracking-wider">{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-3.5 w-full border-2 border-[#341F14] bg-[#FFFDF7] overflow-hidden p-0.5">
                      <div
                        className={`h-full ${color} transition-all duration-500 border-r border-[#341F14]`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-script text-sm text-[#C8521A] font-bold pt-1">
                Extraction: {current.brewMethod}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
