'use client'

import { useState } from 'react'
import { Check, Coffee, Gift } from 'lucide-react'

export function RewardsSection() {
  const [phone, setPhone] = useState('')
  const [joined, setJoined] = useState(false)
  const [stamps, setStamps] = useState(5)

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setJoined(true)
    setStamps(6)
  }

  return (
    <section id="rewards" className="border-b-4 border-[#341F14] bg-[#C8521A] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-4 border-[#341F14] bg-[#FFFDF7] p-6 sm:p-12 shadow-70s-xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Text & Join */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 border-2 border-[#341F14] bg-[#FBE48A] px-3.5 py-1 text-xs font-bold text-[#341F14] shadow-70s-sm uppercase tracking-wider">
                ✿ Section 05 // Rosa Passport Club ✿
              </div>

              <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] leading-tight tracking-tight">
                Collect Stamps.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-[#FBE48A] px-2 border-2 border-[#341F14] shadow-70s-sm">
                    Unlock Sips.
                  </span>
                </span>
              </h2>

              <p className="font-sans text-sm leading-relaxed text-[#341F14]/85 max-w-md">
                No plastic cards to lose. Collect digital stamps every time you grab coffee by the lake. Unlock complimentary artisanal pastries and signature brews.
              </p>

              {joined ? (
                <div className="border-3 border-[#341F14] bg-[#FBE48A] p-4 shadow-70s-sm animate-in fade-in space-y-1">
                  <div className="flex items-center gap-2 text-[#341F14] font-bold font-sans">
                    <Check className="size-4 stroke-[3] text-[#C8521A]" />
                    <span>Passport Activated!</span>
                  </div>
                  <p className="font-sans text-xs text-[#341F14]/90">
                    Welcome stamp added for <strong>{phone}</strong>! Mention it on your next visit.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-3 max-w-md">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Enter Mobile (09XX XXX XXXX)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border-2 border-[#341F14] bg-[#FAF4E8] px-3.5 py-2.5 font-sans text-xs text-[#341F14] placeholder:text-[#341F14]/50 focus:outline-none focus:bg-[#FFFDF7] shadow-70s-sm"
                    />
                    <button
                      type="submit"
                      className="retro-btn bg-[#341F14] text-[#FBE48A] px-5 py-2.5 font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#C8521A]"
                    >
                      Claim Stamp
                    </button>
                  </div>
                  <p className="font-script text-sm text-[#C8521A] font-bold">
                    ✿ Instant 1 Welcome Stamp + Free Oat Milk Upgrade
                  </p>
                </form>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-dashed border-[#341F14]/30">
                <div className="border-2 border-[#341F14] bg-[#FAF4E8] p-3 shadow-70s-sm">
                  <p className="font-script text-xs text-[#C8521A] font-bold">Stamp 4 Reward</p>
                  <p className="font-editorial italic text-sm font-black text-[#341F14] mt-0.5">Warm Kouign-Amann or Choco Cookie</p>
                </div>
                <div className="border-2 border-[#341F14] bg-[#FAF4E8] p-3 shadow-70s-sm">
                  <p className="font-script text-xs text-[#C8521A] font-bold">Stamp 8 Reward</p>
                  <p className="font-editorial italic text-sm font-black text-[#341F14] mt-0.5">Any Signature Bay Brew + Enamel Pin</p>
                </div>
              </div>
            </div>

            {/* Right — 70s Retro Passport Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm border-4 border-[#341F14] bg-[#FBE48A] p-6 shadow-70s-xl">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b-3 border-[#341F14] pb-4 mb-4">
                  <div>
                    <p className="font-editorial text-2xl font-black italic text-[#341F14]">
                      Rosa Passport
                    </p>
                    <p className="font-script text-sm text-[#C8521A] font-bold">
                      Lakeside Patron · 8-Stamp Pass
                    </p>
                  </div>
                  <span className="border-2 border-[#341F14] bg-[#FFFDF7] px-2.5 py-1 font-editorial italic text-sm font-black text-[#341F14] shadow-70s-sm">
                    {stamps}/8
                  </span>
                </div>

                {/* 8 Stamp Grid */}
                <div className="grid grid-cols-4 gap-3 py-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const isCollected = index <= stamps
                    const isGiftStamp = index === 4 || index === 8
                    return (
                      <div
                        key={index}
                        className={`aspect-square border-3 border-[#341F14] flex flex-col items-center justify-center transition-all ${
                          isCollected
                            ? 'bg-[#341F14] text-[#FBE48A] shadow-70s-sm'
                            : 'bg-[#FFFDF7] text-[#341F14]/40'
                        }`}
                      >
                        {isCollected ? (
                          <>
                            <Coffee className="size-5 stroke-[2]" />
                            <span className="font-sans text-[8px] font-black mt-0.5">SIP {index}</span>
                          </>
                        ) : isGiftStamp ? (
                          <>
                            <Gift className="size-4 text-[#C8521A]" />
                            <span className="font-sans text-[8px] text-[#C8521A] font-bold mt-0.5">PERK</span>
                          </>
                        ) : (
                          <span className="font-editorial italic text-base font-black">{index}</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Card Footer */}
                <div className="border-t-3 border-[#341F14] pt-3 flex items-center justify-between font-sans text-[10px] font-bold text-[#341F14]">
                  <span className="uppercase tracking-wider">Level: Lakeside Regular</span>
                  <span className="bg-[#341F14] text-[#FBE48A] px-2 py-0.5">
                    {8 - stamps > 0 ? `${8 - stamps} sips to go` : 'Reward Unlocked!'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
