'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react'
import { FAQS } from '@/lib/menu-data'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="border-b-4 border-black bg-[#A3E635] px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-block border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
            ★ SECTION 07 // FREQUENTLY ASKED ★
          </div>
          <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
            FAQ &amp; VISITOR MANUAL.
          </h2>
          <p className="font-mono text-xs text-black/85 max-w-md mx-auto">
            Everything you need to know about resort entry, pet policies, and parking.
          </p>
        </div>

        <div className="space-y-3 font-mono">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="border-3 border-black bg-white shadow-[4px_4px_0_0_#000] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#FFFDF0]"
                  aria-expanded={isOpen}
                >
                  <span className="font-arcade text-xs font-bold text-black pr-4">
                    {faq.q}
                  </span>
                  <span className="flex size-6 shrink-0 items-center justify-center border-2 border-black bg-[#FFE600] text-black font-bold">
                    {isOpen ? <Minus className="size-3.5 stroke-[3]" /> : <Plus className="size-3.5 stroke-[3]" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-black/85 border-t-2 border-black bg-[#FFFDF0]">
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
