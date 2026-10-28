'use client'

import { useState } from 'react'
import { Coffee, Gift, Check, Sparkles } from 'lucide-react'

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
    <section id="rewards" className="border-b-4 border-black bg-[#D8B4FE] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-4 border-black bg-[#FFFDF0] p-6 sm:p-12 shadow-[10px_10px_0_0_#000]">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Text & Join */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
                ★ SECTION 05 // RORA PASSPORT CLUB ★
              </div>

              <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl leading-tight">
                COLLECT STAMPS.
                <br />
                <span className="bg-[#FFE600] px-2 border-2 border-black">UNLOCK SIPS.</span>
              </h2>

              <p className="font-mono text-xs leading-relaxed text-black/85 max-w-md">
                No plastic cards to lose. Collect digital stamps every time you grab coffee by the lake. Unlock complimentary pastries and signature brews.
              </p>

              {joined ? (
                <div className="border-3 border-black bg-[#A3E635] p-4 text-xs font-arcade space-y-1 shadow-[3px_3px_0_0_#000] animate-in fade-in">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <Check className="size-4 stroke-[3]" />
                    <span>[PASSPORT ACTIVATED!]</span>
                  </div>
                  <p className="font-mono text-black/90">
                    Welcome stamp added for <strong>{phone}</strong>! Mention it on your next visit.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-3 max-w-md">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="ENTER MOBILE (09XX XXX XXXX)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border-2 border-black bg-white px-3 py-2.5 font-mono text-xs text-black placeholder:text-black/50 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="neo-btn bg-[#FFE600] px-4 py-2.5 font-arcade text-[10px] text-black"
                    >
                      CLAIM STAMP
                    </button>
                  </div>
                  <p className="font-arcade text-[8px] text-black/70">
                    ✦ INSTANT 1 WELCOME STAMP + FREE OAT MILK UPGRADE
                  </p>
                </form>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-black/20 font-mono text-xs">
                <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0_0_#000]">
                  <p className="font-arcade text-[9px] text-[#FF5722]">[STAMP 4 REWARD]</p>
                  <p className="text-black text-[11px] mt-0.5 font-bold">Warm Kouign-Amann or Choco Cookie</p>
                </div>
                <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0_0_#000]">
                  <p className="font-arcade text-[9px] text-[#FF5722]">[STAMP 8 REWARD]</p>
                  <p className="text-black text-[11px] mt-0.5 font-bold">Any Signature Bay Brew + Enamel Pin</p>
                </div>
              </div>
            </div>

            {/* Right Neo Digital Stamp Passport Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-sm border-4 border-black bg-[#FFE600] p-6 shadow-[8px_8px_0_0_#000]">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b-3 border-black pb-3">
                  <div>
                    <p className="font-pixel text-xl font-black text-black">
                      RORA PASSPORT
                    </p>
                    <p className="font-arcade text-[8px] text-[#FF5722]">
                      LAKESIDE PATRON // 8-STAMP PASS
                    </p>
                  </div>
                  <span className="border-2 border-black bg-white px-2 py-0.5 font-arcade text-[9px] font-bold text-black">
                    {stamps}/8 STAMPS
                  </span>
                </div>

                {/* 8 Stamp Grid */}
                <div className="grid grid-cols-4 gap-3 py-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const isCollected = index <= stamps
                    const isGiftStamp = index === 4 || index === 8
                    return (
                      <div
                        key={index}
                        className={`aspect-square border-3 border-black flex flex-col items-center justify-center transition-all ${
                          isCollected
                            ? 'bg-[#A3E635] text-black shadow-[2px_2px_0_0_#000]'
                            : 'bg-white text-black/40'
                        }`}
                      >
                        {isCollected ? (
                          <>
                            <Coffee className="size-5 stroke-[2.5]" />
                            <span className="font-arcade text-[7px] mt-0.5 font-bold">SIP {index}</span>
                          </>
                        ) : isGiftStamp ? (
                          <>
                            <Gift className="size-4 text-[#FF3366]" />
                            <span className="font-arcade text-[7px] text-[#FF3366] mt-0.5">PERK</span>
                          </>
                        ) : (
                          <span className="font-arcade text-xs">{index}</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Card Footer */}
                <div className="border-t-3 border-black pt-3 flex items-center justify-between font-arcade text-[8px] text-black">
                  <span>LEVEL: LAKESIDE REGULAR</span>
                  <span className="bg-black text-[#FFE600] px-1.5 py-0.5">
                    {8 - stamps > 0 ? `${8 - stamps} SIPS TO GO` : 'REWARD UNLOCKED!'}
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
