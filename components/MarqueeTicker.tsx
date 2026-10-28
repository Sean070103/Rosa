'use client'

export function MarqueeTicker() {
  const items = [
    '✿ 100% PHILIPPINE SPECIALTY COFFEE',
    '✦ BENGUET ATOK SINGLE ORIGIN (1,650M)',
    '✿ WATERFRONT VERANDA @ QUEEN AURORA RESORT',
    '✦ OPEN DAILY 10:00 AM — 1:00 AM',
    '✿ CALAUAN WILD HONEY & ARTISANAL SEA SALT',
    '✦ STONE-GROUND CEREMONIAL BISCOFF MATCHA',
    '✿ PET-FRIENDLY LAKESIDE POOL AREA',
    '✦ SLOW BATCH SOURDOUGH BAKES & PASTRIES',
  ]

  return (
    <div className="relative border-b-4 border-[#341F14] bg-[#FBE48A] py-3.5 overflow-hidden select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap font-editorial italic text-sm text-[#341F14] font-bold tracking-wider">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-6 gap-3">
            <span>{text}</span>
            <span className="bg-[#341F14] text-[#FBE48A] px-2 py-0.5 border border-[#341F14] font-sans font-black text-[10px] not-italic">
              ROSA DOSE
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
