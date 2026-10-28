'use client'

import { Star } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/menu-data'

export function TestimonialsSection() {
  return (
    <section className="border-b-4 border-[#341F14] bg-[#FAF4E8] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 border-2 border-[#341F14] bg-[#C8521A] px-3.5 py-1 text-xs font-bold text-[#FAF4E8] shadow-70s-sm uppercase tracking-wider">
              ✿ Section 06 // Patron Kwentuhan ✿
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight">
              Voices from the Veranda.
            </h2>
          </div>
          <p className="font-sans text-sm text-[#341F14]/80 max-w-md leading-relaxed">
            Stories from sunrise cyclers, remote coders, and late-night barkadas who call Rosa Dose their second home by the bay.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between border-4 border-[#341F14] bg-[#FFFDF7] p-6 shadow-70s transition-all hover:shadow-70s-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#341F14]/30 pb-3">
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="font-bold text-[#C8521A] bg-[#FBE48A] px-1 border border-[#341F14] text-[10px]">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-script text-xs font-bold text-[#C8521A]">Verified Patron</span>
                </div>

                <p className="font-editorial italic text-sm leading-relaxed text-[#341F14]/90 font-medium">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-[#341F14]/30 flex items-center gap-3">
                <div className="size-12 shrink-0 border-2 border-[#341F14] rounded-full overflow-hidden bg-[#341F14] shadow-70s-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-editorial italic text-base font-black text-[#341F14] truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="font-script text-xs font-bold text-[#C8521A] truncate">
                    {item.role}
                  </p>
                  <p className="font-sans text-[10px] text-[#341F14]/60 truncate mt-0.5">
                    Fave: {item.favorite}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 70s Retro Viral Meme Card */}
        <div className="mt-10 border-4 border-[#341F14] bg-[#FBE48A] p-6 shadow-70s flex flex-col md:flex-row items-center gap-6">
          <div className="size-24 shrink-0 border-3 border-[#341F14] rounded-full overflow-hidden bg-[#341F14] shadow-70s">
            <img
              src="/cafe_pic/10003.jpg"
              alt="Isang tasang kape lang meme"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-1.5">
            <span className="font-editorial italic font-bold text-xs bg-[#341F14] text-[#FBE48A] px-3 py-1 border border-[#341F14] inline-block shadow-70s-sm">
              ✿ Viral Rosa Meme // #IsangTasaLang
            </span>
            <h3 className="font-editorial text-2xl font-black italic text-[#341F14]">
              &ldquo;Isang tasang kape lang ako kada araw...&rdquo;
            </h3>
            <p className="font-sans text-sm text-[#341F14]/85 leading-relaxed">
              Come by Queen Aurora Garden Resort for your giant cup of coffee and hours of late-night kwentuhan until 1:00 AM.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
