'use client'

import { Star, MessageSquare } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/menu-data'

export function TestimonialsSection() {
  return (
    <section className="border-b-4 border-black bg-[#FFFDF0] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-block border-2 border-black bg-[#FF3366] px-3 py-1 font-arcade text-[10px] text-white shadow-[3px_3px_0_0_#000]">
              ★ SECTION 06 // PATRON KWENTUHAN ★
            </div>
            <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
              VOICES FROM THE VERANDA.
            </h2>
          </div>
          <p className="font-mono text-xs text-black/80 max-w-md">
            Stories from sunrise cyclers, remote coders, and late-night barkadas who call Rora Dose their second home.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] hover:-translate-y-1 transition-all"
            >
              <div className="space-y-4">
                {/* Rating stars & Quote */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex gap-1 text-[#FFE600]">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="text-base font-bold text-black bg-[#FFE600] px-1 border border-black text-[10px]">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-arcade text-[8px] text-[#FF5722]">VERIFIED PATRON</span>
                </div>

                <p className="font-mono text-xs leading-relaxed text-black/90">
                  “{item.review}”
                </p>
              </div>

              {/* Author Info with Authentic Pic */}
              <div className="mt-6 pt-4 border-t-3 border-black flex items-center gap-3">
                <div className="size-12 shrink-0 border-2 border-black overflow-hidden bg-black shadow-[2px_2px_0_0_#000]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-pixel text-lg font-bold text-black truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="font-arcade text-[8px] text-[#FF5722] truncate">
                    {item.role.toUpperCase()}
                  </p>
                  <p className="font-mono text-[9px] text-black/60 truncate mt-0.5">
                    FAVE: {item.favorite}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Viral Meme Card from 10003.jpg */}
        <div className="mt-10 border-4 border-black bg-[#FFE600] p-6 shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row items-center gap-6">
          <div className="size-24 shrink-0 border-3 border-black overflow-hidden bg-black shadow-[4px_4px_0_0_#000]">
            <img
              src="/cafe_pic/10003.jpg"
              alt="Isang tasang kape lang ako kada araw meme"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <span className="font-arcade text-[9px] bg-black text-[#FFE600] px-2 py-0.5 border border-black inline-block">
              VIRAL RORA MEME // #1TASALANG
            </span>
            <h3 className="font-pixel text-2xl font-bold text-black">
              &quot;ISANG TASANG KAPE LANG AKO KADA ARAW...&quot;
            </h3>
            <p className="font-mono text-xs text-black/85">
              Come by Queen Aurora Garden Resort for your giant cup of coffee and hours of late-night kwentuhan until 1:00 AM.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
