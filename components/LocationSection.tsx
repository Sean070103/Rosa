'use client'

import { MapPin, Clock, Phone, Navigation, ArrowUpRight, Car, Dog } from 'lucide-react'

export function LocationSection() {
  return (
    <section id="visit" className="border-b-4 border-black bg-[#FFFDF0] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-block border-2 border-black bg-[#00F0FF] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
                ★ SECTION 08 // DESTINATION & ACCESS ★
              </div>
              <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
                SEE YOU BY THE WATER.
              </h2>
              <p className="font-mono text-xs leading-relaxed text-black/85">
                Located right inside Queen Aurora Garden Resort along the serene banks of Laguna de Bay in Cabuyao, Laguna.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] space-y-1">
                <span className="font-arcade text-[9px] text-[#FF5722] block">
                  [LOCATION]
                </span>
                <p className="font-pixel text-xl font-bold text-black">
                  Queen Aurora Resort
                </p>
                <p className="text-black/80">
                  Cabuyao, Laguna 4025, PH
                  <br />
                  <span className="font-arcade text-[8px] text-black/60">(Free gate entry for cafe patrons)</span>
                </p>
              </div>

              <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] space-y-1">
                <span className="font-arcade text-[9px] text-[#FF5722] block">
                  [OPERATING HOURS]
                </span>
                <p className="font-pixel text-xl font-bold text-black">
                  10:00 AM — 1:00 AM
                </p>
                <p className="text-black/80">
                  Open 7 Days a Week Daily
                  <br />
                  <span className="font-arcade text-[8px] text-black/60">Sunset peak: 4:45 PM — 6:15 PM</span>
                </p>
              </div>
            </div>

            {/* Parking & Pet Pills */}
            <div className="space-y-2 font-mono text-xs text-black">
              <div className="flex items-center gap-2 border-2 border-black bg-[#A3E635] p-2.5 shadow-[2px_2px_0_0_#000]">
                <Car className="size-4 shrink-0" />
                <span><strong>FREE SECURE PARKING:</strong> Inside resort gates.</span>
              </div>
              <div className="flex items-center gap-2 border-2 border-black bg-[#FFE600] p-2.5 shadow-[2px_2px_0_0_#000]">
                <Dog className="size-4 shrink-0" />
                <span><strong>100% PET-FRIENDLY:</strong> Outdoor poolside veranda.</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1 font-silk text-xs">
              <a
                href="https://maps.app.goo.gl/c1mfgMUK8GrFe26d9?g_st=ipc"
                target="_blank"
                rel="noreferrer"
                className="neo-btn flex items-center gap-2 bg-[#FFE600] px-5 py-3 text-black font-bold"
              >
                <Navigation className="size-3.5" />
                <span>[▶] GOOGLE MAPS</span>
                <ArrowUpRight className="size-3.5" />
              </a>

              <a
                href="https://www.waze.com/ul?q=Queen%20Aurora%20Garden%20Resort%20Cabuyao"
                target="_blank"
                rel="noreferrer"
                className="neo-btn flex items-center gap-2 bg-[#00F0FF] px-5 py-3 text-black font-bold"
              >
                <span>[▶] WAZE MAPS</span>
                <ArrowUpRight className="size-3.5" />
              </a>

              <a
                href="tel:09279532665"
                className="neo-btn flex items-center gap-2 bg-white px-4 py-3 text-black font-mono text-xs font-bold"
              >
                <Phone className="size-3.5 text-[#FF5722]" />
                <span>0927 953 2665</span>
              </a>
            </div>
          </div>

          {/* Right Visual Card with 10002.jpg (Real Cup + Map Screen) */}
          <div className="lg:col-span-6">
            <div className="border-4 border-black bg-[#FFE600] p-4 shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center justify-between border-b-3 border-black pb-2 mb-3 font-arcade text-[10px] text-black">
                <span>RORA_PIN_LOCATION.JPG</span>
                <span className="bg-black text-[#FFE600] px-2 py-0.5">CABUYAO</span>
              </div>

              <div className="relative aspect-square w-full overflow-hidden border-3 border-black bg-black">
                <img
                  src="/cafe_pic/10002.jpg"
                  alt="Rora Dose coffee cup with location map overlay"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Commute Chips */}
              <div className="grid grid-cols-3 gap-2 pt-3 font-mono text-center text-xs">
                <div className="border-2 border-black bg-white p-2">
                  <span className="font-arcade text-[8px] text-black/60 block">SLEX CABUYAO</span>
                  <span className="font-bold text-black font-pixel text-base">12 MINS</span>
                </div>
                <div className="border-2 border-black bg-white p-2">
                  <span className="font-arcade text-[8px] text-black/60 block">SANTA ROSA</span>
                  <span className="font-bold text-black font-pixel text-base">20 MINS</span>
                </div>
                <div className="border-2 border-black bg-white p-2">
                  <span className="font-arcade text-[8px] text-black/60 block">ALABANG</span>
                  <span className="font-bold text-black font-pixel text-base">40 MINS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
