'use client'

import { MapPin, Phone, Navigation, ArrowUpRight, Car, Dog } from 'lucide-react'

export function LocationSection() {
  return (
    <section id="visit" className="border-b-4 border-[#341F14] bg-[#FAF4E8] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 border-2 border-[#341F14] bg-[#FBE48A] px-3.5 py-1 text-xs font-bold text-[#341F14] shadow-70s-sm uppercase tracking-wider">
                ✿ Section 08 // Destination &amp; Access ✿
              </div>
              <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight">
                See You by the Water.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-[#341F14]/85">
                Located right inside Queen Aurora Garden Resort along the serene banks of Laguna de Bay in Cabuyao, Laguna.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Lakefront Branch */}
              <div className="border-3 border-[#341F14] bg-[#FFFDF7] p-4 shadow-70s space-y-1.5">
                <span className="font-script text-sm font-bold text-[#C8521A] block">Branch 01 · Waterfront</span>
                <p className="font-editorial text-lg sm:text-xl italic font-black text-[#341F14]">
                  🌊 Lakefront Roastery
                </p>
                <p className="font-sans text-xs text-[#341F14]/80 leading-relaxed">
                  Queen Aurora Resort, Cabuyao, Laguna
                  <br />
                  <span className="text-[#C8521A] font-bold">10:00 AM — 1:00 AM Daily</span>
                  <br />
                  <span className="text-[#341F14]/60">(Free resort gate pass for patrons)</span>
                </p>
              </div>

              {/* Niugan Branch */}
              <div className="border-3 border-[#341F14] bg-[#FFFDF7] p-4 shadow-70s space-y-1.5">
                <span className="font-script text-sm font-bold text-[#166534] block">Branch 02 · Downtown</span>
                <p className="font-editorial text-lg sm:text-xl italic font-black text-[#341F14]">
                  🌿 Niugan Hub &amp; Study
                </p>
                <p className="font-sans text-xs text-[#341F14]/80 leading-relaxed">
                  Old National Hwy, Niugan, Cabuyao
                  <br />
                  <span className="text-[#166534] font-bold">7:00 AM — 11:00 PM Daily</span>
                  <br />
                  <span className="text-[#341F14]/60">(AC study pods &amp; curbside pickup)</span>
                </p>
              </div>
            </div>

            {/* Parking & Pet Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 border-2 border-[#341F14] bg-[#FBE48A] p-3 shadow-70s-sm font-sans text-sm text-[#341F14]">
                <Car className="size-4 shrink-0 text-[#C8521A]" />
                <span><strong>Free Secure Parking:</strong> Inside resort gates — Section B.</span>
              </div>
              <div className="flex items-center gap-2.5 border-2 border-[#341F14] bg-[#FFFDF7] p-3 shadow-70s-sm font-sans text-sm text-[#341F14]">
                <Dog className="size-4 shrink-0 text-[#C8521A]" />
                <span><strong>100% Pet-Friendly:</strong> Outdoor poolside veranda welcome.</span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://maps.app.goo.gl/c1mfgMUK8GrFe26d9?g_st=ipc"
                target="_blank"
                rel="noreferrer"
                className="retro-btn flex items-center gap-2 bg-[#341F14] text-[#FBE48A] px-5 py-3 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#C8521A]"
              >
                <Navigation className="size-3.5" />
                <span>Google Maps</span>
                <ArrowUpRight className="size-3.5" />
              </a>

              <a
                href="https://www.waze.com/ul?q=Queen%20Aurora%20Garden%20Resort%20Cabuyao"
                target="_blank"
                rel="noreferrer"
                className="retro-btn flex items-center gap-2 bg-[#FBE48A] text-[#341F14] px-5 py-3 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#FAF4E8]"
              >
                <span>Waze Maps</span>
                <ArrowUpRight className="size-3.5" />
              </a>

              <a
                href="tel:09279532665"
                className="retro-btn flex items-center gap-2 bg-[#FFFDF7] text-[#341F14] px-4 py-3 font-sans font-bold text-xs hover:bg-[#FBE48A]"
              >
                <Phone className="size-3.5 text-[#C8521A]" />
                <span>0927 953 2665</span>
              </a>
            </div>
          </div>

          {/* Right Visual — 70s Polaroid Frame */}
          <div className="lg:col-span-6">
            <div className="border-4 border-[#341F14] bg-[#FBE48A] p-4 shadow-70s-xl">
              <div className="flex items-center justify-between border-b-2 border-[#341F14] pb-2.5 mb-3">
                <span className="font-editorial italic text-sm font-black text-[#341F14]">
                  ✿ Rosa_Pin_Location.jpg
                </span>
                <span className="bg-[#341F14] text-[#FBE48A] px-2.5 py-0.5 font-sans font-bold text-[10px] uppercase">
                  Cabuyao · Laguna
                </span>
              </div>

              <div className="relative aspect-square w-full overflow-hidden border-3 border-[#341F14] rounded-t-[60px] bg-[#341F14]">
                <img
                  src="/cafe_pic/10002.jpg"
                  alt="Rosa Dose coffee cup with location map overlay"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Commute Chips */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="border-2 border-[#341F14] bg-[#FFFDF7] p-2.5 shadow-70s-sm">
                  <span className="font-sans text-[10px] font-bold text-[#341F14]/60 block uppercase tracking-wider">SLEX Cabuyao</span>
                  <span className="font-editorial italic text-base font-black text-[#341F14]">12 Mins</span>
                </div>
                <div className="border-2 border-[#341F14] bg-[#FFFDF7] p-2.5 shadow-70s-sm">
                  <span className="font-sans text-[10px] font-bold text-[#341F14]/60 block uppercase tracking-wider">Santa Rosa</span>
                  <span className="font-editorial italic text-base font-black text-[#341F14]">20 Mins</span>
                </div>
                <div className="border-2 border-[#341F14] bg-[#FFFDF7] p-2.5 shadow-70s-sm">
                  <span className="font-sans text-[10px] font-bold text-[#341F14]/60 block uppercase tracking-wider">Alabang</span>
                  <span className="font-editorial italic text-base font-black text-[#341F14]">40 Mins</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
