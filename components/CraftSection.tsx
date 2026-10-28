'use client'

import { useState } from 'react'
import { SlidersHorizontal, Droplets, Flame, Award, HeartHandshake } from 'lucide-react'

export function CraftSection() {
  const [roastSelection, setRoastSelection] = useState<'light' | 'medium' | 'dark'>('light')

  const roastProfiles = {
    light: {
      title: 'LIGHT ROAST // BENGUET ATOK WASHED',
      flavor: 'High floral acidity, crisp green apple, delicate jasmine, and sweet citrus zest.',
      elevation: '1,650M ABOVE SEA LEVEL',
      brewMethod: 'JAPANESE V60 CONE POUR-OVER AT 92°C',
      metrics: { acidity: 90, body: 40, sweetness: 85 },
      image: '/cafe_pic/10007.jpg',
    },
    medium: {
      title: 'MEDIUM ROAST // MT. APO ANAEROBIC',
      flavor: 'Wild stone fruit, juicy plum, balanced cacao butter sweetness, and winey finish.',
      elevation: '1,500M ABOVE SEA LEVEL',
      brewMethod: 'LEVER DOUBLE SHOT & ICED RIPPLE',
      metrics: { acidity: 65, body: 75, sweetness: 90 },
      image: '/cafe_pic/10009.jpg',
    },
    dark: {
      title: 'DARK ROAST // LIPA HERITAGE LIBERICA',
      flavor: 'Smoked cedar wood, dark baker chocolate, ripe jackfruit undertones, and dense crema.',
      elevation: 'SOUTHERN LUZON FOOTHILLS',
      brewMethod: '18H SLOW DRIP COLD BREW',
      metrics: { acidity: 20, body: 95, sweetness: 70 },
      image: '/cafe_pic/10012.jpg',
    },
  }

  const current = roastProfiles[roastSelection]

  return (
    <section id="craft" className="border-b-4 border-black bg-[#FFFDF0] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Craft Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block border-2 border-black bg-[#A3E635] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
              ★ SECTION 03 // ETHICAL TERROIR ★
            </div>

            <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
              FROM HIGHLAND PEAKS TO THE BAY.
            </h2>

            <p className="font-mono text-xs leading-relaxed text-black/85">
              Direct partnership with smallholder farming cooperatives in Benguet and Bansalan, Mt. Apo. We roast in micro-batches and calibrate water remineralization to 120 PPM for maximum cup sweetness.
            </p>

            {/* Photo Cards Row (10017.jpg Portafilter & 10008.jpg Tasting Flight) */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border-3 border-black bg-white p-2 shadow-[4px_4px_0_0_#000]">
                <div className="aspect-square overflow-hidden border-2 border-black bg-black mb-2">
                  <img
                    src="/cafe_pic/10017.jpg"
                    alt="Precision tamped portafilter"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-arcade text-[8px] text-black">PRECISION EXTRACTION</p>
                <p className="font-mono text-[9px] text-black/60">Tamped to 20kg pressure.</p>
              </div>

              <div className="border-3 border-black bg-[#FFE600] p-2 shadow-[4px_4px_0_0_#000]">
                <div className="aspect-square overflow-hidden border-2 border-black bg-black mb-2">
                  <img
                    src="/cafe_pic/10008.jpg"
                    alt="Coffee cupping flight"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-arcade text-[8px] text-black">CUPPING FLIGHT</p>
                <p className="font-mono text-[9px] text-black/60">Multi-origin tasting trays.</p>
              </div>
            </div>
          </div>

          {/* Right Interactive Roast Profile Dial */}
          <div className="lg:col-span-6 border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#000] space-y-5">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <div>
                <p className="font-arcade text-[9px] text-[#FF5722]">
                  [CALIBRATE ROAST PROFILE]
                </p>
                <h3 className="font-pixel text-2xl font-bold text-black mt-0.5">
                  THE BEAN SPECTRUM
                </h3>
              </div>
              <SlidersHorizontal className="size-5 text-black" />
            </div>

            {/* Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 font-silk text-xs">
              {[
                { id: 'light', label: 'BENGUET LIGHT', color: 'bg-[#FFE600]' },
                { id: 'medium', label: 'APO MEDIUM', color: 'bg-[#00F0FF]' },
                { id: 'dark', label: 'LIBERICA BOLD', color: 'bg-[#FF8A00]' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setRoastSelection(btn.id as 'light' | 'medium' | 'dark')}
                  className={`neo-btn py-2.5 text-center font-bold ${
                    roastSelection === btn.id
                      ? `${btn.color} text-black`
                      : 'bg-[#FFFDF0] text-black'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Details for Selected Roast */}
            <div className="border-3 border-black bg-[#FFFDF0] p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-14 shrink-0 border-2 border-black overflow-hidden bg-black">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-pixel text-lg font-bold text-black leading-tight">
                    {current.title}
                  </h4>
                  <p className="font-arcade text-[8px] text-[#FF5722] mt-0.5">
                    {current.elevation}
                  </p>
                </div>
              </div>

              <p className="font-mono text-xs text-black/80 leading-relaxed">
                {current.flavor}
              </p>

              {/* 8-bit progress meters */}
              <div className="space-y-2.5 pt-2 border-t-2 border-black/20 font-mono text-xs">
                <div>
                  <div className="flex justify-between font-arcade text-[9px] text-black mb-1">
                    <span>ACIDITY (FRUIT BRIGHTNESS)</span>
                    <span>{current.metrics.acidity}%</span>
                  </div>
                  <div className="h-3 w-full border-2 border-black bg-white overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#FF3366] transition-all duration-300"
                      style={{ width: `${current.metrics.acidity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-arcade text-[9px] text-black mb-1">
                    <span>BODY (VELVET TEXTURE)</span>
                    <span>{current.metrics.body}%</span>
                  </div>
                  <div className="h-3 w-full border-2 border-black bg-white overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#00F0FF] transition-all duration-300"
                      style={{ width: `${current.metrics.body}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-arcade text-[9px] text-black mb-1">
                    <span>SWEETNESS (WILD HONEY)</span>
                    <span>{current.metrics.sweetness}%</span>
                  </div>
                  <div className="h-3 w-full border-2 border-black bg-white overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#FFE600] transition-all duration-300"
                      style={{ width: `${current.metrics.sweetness}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="font-arcade text-[8px] text-black/70 pt-1">
                EXTRACTION: {current.brewMethod}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
