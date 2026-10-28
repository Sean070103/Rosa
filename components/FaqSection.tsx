'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { FAQS } from '@/lib/menu-data'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="border-b-4 border-[#341F14] bg-[#FBE48A] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-2 border-2 border-[#341F14] bg-[#341F14] px-3.5 py-1 text-xs font-bold text-[#FBE48A] shadow-70s-sm uppercase tracking-wider">
            ✿ Section 07 // Frequently Asked ✿
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight">
            FAQ &amp; Visitor Manual.
          </h2>
          <p className="font-sans text-sm text-[#341F14]/85 max-w-md mx-auto leading-relaxed">
            Everything you need to know about resort entry, pet policies, and parking.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="border-3 border-[#341F14] bg-[#FFFDF7] shadow-70s transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#FAF4E8]"
                  aria-expanded={isOpen}
                >
                  <span className="font-editorial italic text-base font-black text-[#341F14] pr-4 leading-tight">
                    {faq.q}
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center border-2 border-[#341F14] bg-[#FBE48A] text-[#341F14] font-bold shadow-70s-sm">
                    {isOpen ? <Minus className="size-3.5 stroke-[3]" /> : <Plus className="size-3.5 stroke-[3]" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 font-sans text-sm leading-relaxed text-[#341F14]/85 border-t-2 border-dashed border-[#341F14]/30 bg-[#FAF4E8]">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
