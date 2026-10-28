'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Plus, ArrowUpRight, Snowflake, Flame, Check } from 'lucide-react'
import { MenuItem } from '@/lib/types'
import { MENU_ITEMS } from '@/lib/menu-data'

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void
  onQuickAdd: (item: MenuItem) => void
}

export function MenuSection({ onSelectItem, onQuickAdd }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPopular, setFilterPopular] = useState(false)
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: '01 / All Offerings', color: 'bg-[#FBE48A]' },
    { id: 'signature', label: '02 / Signature Sips', color: 'bg-[#C8521A] text-[#FAF4E8]' },
    { id: 'pourover', label: '03 / Pour-Overs', color: 'bg-[#FBE48A]' },
    { id: 'matcha-tea', label: '04 / Matcha & Tea', color: 'bg-[#FBE48A]' },
    { id: 'pastries-kitchen', label: '05 / Bakes & Pizza', color: 'bg-[#C8521A] text-[#FAF4E8]' },
  ]

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tastingNotes.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesPopular = !filterPopular || item.isPopular

      return matchesCategory && matchesSearch && matchesPopular
    })
  }, [activeCategory, searchQuery, filterPopular])

  const handleQuickAddWithNotice = (item: MenuItem) => {
    onQuickAdd(item)
    setAddedItemNotice(item.name)
    setTimeout(() => {
      setAddedItemNotice(null)
    }, 2000)
  }

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8">
      {/* Toast Notice when Quick Added */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border-3 border-[#341F14] bg-[#FBE48A] px-5 py-3 font-sans font-bold text-xs text-[#341F14] shadow-70s animate-in slide-in-from-bottom-2">
          <Check className="size-4 stroke-[3] text-[#C8521A]" />
          <span>[ADDED TO TRAY: {addedItemNotice.toUpperCase()}]</span>
        </div>
      )}

      {/* 70s Editorial Section Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 border-2 border-[#341F14] bg-[#C8521A] px-3.5 py-1 text-xs font-bold text-[#FAF4E8] shadow-70s-sm uppercase">
            <span>✿ Section 01 // The Slow Bar &amp; Bakery ✿</span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-6xl font-black italic text-[#341F14] tracking-tight">
            Crafted for Mindful Sips.
          </h2>
          <p className="font-sans text-sm text-[#341F14]/80 max-w-xl leading-relaxed">
            Freshly pulled single-origin Benguet espresso, stone-ground Kyoto matcha, artisanal sourdough bakes, and house-infused wild honey syrups.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drinks, origin, or pastry..."
            className="w-full border-3 border-[#341F14] bg-[#FFFDF7] px-4 py-3 font-sans text-xs text-[#341F14] placeholder:text-[#341F14]/50 shadow-70s focus:outline-none focus:bg-[#FAF4E8]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#341F14] pb-6 mb-10">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`retro-btn px-4 py-2 font-editorial text-xs italic font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-[#C8521A] text-[#FAF4E8]'
                    : 'bg-[#FFFDF7] text-[#341F14] hover:bg-[#FBE48A]'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setFilterPopular(!filterPopular)}
          className={`retro-btn flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold ${
            filterPopular
              ? 'bg-[#C8521A] text-[#FAF4E8]'
              : 'bg-[#FBE48A] text-[#341F14]'
          }`}
        >
          <Filter className="size-3.5" />
          <span>[Best Sellers Only]</span>
        </button>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="border-4 border-[#341F14] bg-[#FFFDF7] p-12 text-center shadow-70s-lg">
          <p className="font-editorial text-2xl italic text-[#341F14]">No offerings found in this category.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('all')
              setFilterPopular(false)
            }}
            className="mt-4 retro-btn bg-[#FBE48A] px-5 py-2.5 font-sans font-bold text-xs text-[#341F14]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between border-4 border-[#341F14] bg-[#FFFDF7] p-5 shadow-70s transition-all hover:-translate-y-1 hover:shadow-70s-xl"
            >
              <div>
                {/* 70s Textured Image Frame with Arch Accent */}
                <div className="relative aspect-square w-full overflow-hidden border-3 border-[#341F14] rounded-t-3xl bg-[#341F14]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />

                  {/* 70s Tag badge */}
                  {item.tag && (
                    <span className="absolute top-3 left-3 border-2 border-[#341F14] bg-[#FBE48A] px-2.5 py-1 font-editorial italic text-xs font-bold text-[#341F14] shadow-70s-sm">
                      ✿ {item.tag}
                    </span>
                  )}

                  {/* Temperature badge */}
                  {item.category !== 'pastries-kitchen' && (
                    <span className="absolute top-3 right-3 border-2 border-[#341F14] bg-[#FFFDF7] px-2.5 py-0.5 font-sans text-[10px] font-bold text-[#341F14] shadow-70s-sm flex items-center gap-1">
                      {item.temperature === 'iced' ? (
                        <>
                          <Snowflake className="size-3 text-[#C8521A]" />
                          <span>ICED</span>
                        </>
                      ) : item.temperature === 'hot' ? (
                        <>
                          <Flame className="size-3 text-[#C8521A]" />
                          <span>HOT</span>
                        </>
                      ) : (
                        <span>ICED/HOT</span>
                      )}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-editorial text-2xl font-black italic leading-tight text-[#341F14]">
                        {item.name}
                      </h3>
                      {item.origin && (
                        <p className="font-script text-sm font-bold text-[#C8521A] mt-0.5">
                          {item.origin}
                        </p>
                      )}
                    </div>
                    <span className="border-2 border-[#341F14] bg-[#FBE48A] px-3 py-1 font-editorial italic text-base font-black text-[#341F14] shadow-70s-sm">
                      ₱{item.price}
                    </span>
                  </div>

                  <p className="font-sans text-xs leading-relaxed text-[#341F14]/80 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tasting notes chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="border border-[#341F14] bg-[#FAF4E8] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#341F14]"
                      >
                        +{note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t-2 border-dashed border-[#341F14]/40 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="retro-btn flex-1 flex items-center justify-center gap-1.5 bg-[#FAF4E8] hover:bg-[#FBE48A] py-2.5 text-xs font-bold text-[#341F14]"
                >
                  <span>CUSTOMIZE</span>
                  <ArrowUpRight className="size-3.5 text-[#C8521A]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddWithNotice(item)}
                  className="retro-btn flex items-center justify-center bg-[#C8521A] text-[#FAF4E8] px-4 py-2.5 hover:bg-[#341F14]"
                  title="Quick add to tray"
                >
                  <Plus className="size-4 stroke-[3]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 70s Guarantee Banner in Butter Yellow */}
      <div className="mt-14 border-4 border-[#341F14] bg-[#FBE48A] p-6 shadow-70s text-center">
        <p className="font-editorial text-sm italic font-bold text-[#341F14]">
          ✿ ZERO ARTIFICIAL PRESERVATIVES · 100% CALAUAN WILD HONEY · LAGUNA SEA SALT ✿
        </p>
        <p className="font-sans text-xs text-[#341F14]/80 mt-1 max-w-xl mx-auto">
          All our syrups are prepared in-house weekly. Single origins roasted fresh bi-weekly in small artisanal batches.
        </p>
      </div>
    </section>
  )
}
