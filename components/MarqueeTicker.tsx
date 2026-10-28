'use client'

export function MarqueeTicker() {
  const items = [
    '★ 100% PHILIPPINE SPECIALTY COFFEE',
    '★ BENGUET ATOK SINGLE ORIGIN (1,650M)',
    '★ WATERFRONT VERANDA @ QUEEN AURORA RESORT',
    '★ OPEN DAILY 10:00 AM — 1:00 AM',
    '★ CALAUAN WILD HONEY & ARTISANAL SEA SALT',
    '★ CEREMONIAL BISCOFF MATCHA',
    '★ PET FRIENDLY LAKESIDE POOL AREA',
    '★ HIGH SPEED FIBER WI-FI FOR STUDY & WORK',
  ]

  return (
    <div className="relative border-b-4 border-black bg-[#FFE600] py-3 overflow-hidden select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap font-arcade text-[11px] text-black tracking-wider">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center mx-6 gap-3">
            <span className="font-bold">{text}</span>
            <span className="bg-black text-[#FFE600] px-1.5 py-0.5 border border-black font-silk text-[9px]">
              &gt;&gt;
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
