'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Plus, ArrowUpRight, Snowflake, Flame, Check, Sparkles } from 'lucide-react'
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
    { id: 'all', label: '[ALL ITEMS]', color: 'bg-[#FFE600]' },
    { id: 'signature', label: '[SIGNATURE SIPS]', color: 'bg-[#00F0FF]' },
    { id: 'pourover', label: '[POUR-OVERS]', color: 'bg-[#A3E635]' },
    { id: 'matcha-tea', label: '[MATCHA & TEA]', color: 'bg-[#D8B4FE]' },
    { id: 'pastries-kitchen', label: '[BAKES & PIZZA]', color: 'bg-[#FF8A00]' },
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 border-3 border-black bg-[#FFE600] px-5 py-3 font-arcade text-xs text-black shadow-[6px_6px_0_0_#000] animate-in slide-in-from-bottom-2">
          <Check className="size-4 stroke-[3]" />
          <span>[ADDED: {addedItemNotice.toUpperCase()}]</span>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-10">
        <div className="space-y-2">
          <div className="inline-block border-2 border-black bg-[#FF3366] px-3 py-1 font-arcade text-[10px] text-white shadow-[3px_3px_0_0_#000]">
            ★ SECTION 01 // THE SLOW BAR MENU ★
          </div>
          <h2 className="font-pixel text-4xl font-black text-black sm:text-6xl">
            MADE FOR MINDFUL SIPS.
          </h2>
          <p className="font-mono text-xs text-black/80 max-w-xl">
            Freshly pulled espresso shots, stone-ground Kyoto matcha, artisanal sourdough bakes, and single-origin Philippine beans.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH DRINK OR INGREDIENT..."
            className="w-full border-3 border-black bg-white px-4 py-3 font-mono text-xs text-black placeholder:text-black/50 shadow-[4px_4px_0_0_#000] focus:outline-none focus:bg-[#FFFDF0]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-black pb-6 mb-10">
        <div className="flex flex-wrap gap-2 font-silk text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`neo-btn px-4 py-2.5 font-bold ${
                activeCategory === cat.id
                  ? `${cat.color} text-black`
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setFilterPopular(!filterPopular)}
          className={`neo-btn flex items-center gap-2 px-4 py-2 font-arcade text-[10px] ${
            filterPopular
              ? 'bg-[#FF3366] text-white'
              : 'bg-white text-black'
          }`}
        >
          <Filter className="size-3" />
          <span>[BEST SELLERS ONLY]</span>
        </button>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="border-4 border-black bg-white p-12 text-center shadow-[6px_6px_0_0_#000]">
          <p className="font-pixel text-2xl text-black">NO SIPS FOUND IN THIS CATEGORY.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('all')
              setFilterPopular(false)
            }}
            className="mt-4 neo-btn bg-[#FFE600] px-4 py-2 font-arcade text-xs text-black"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000]"
            >
              <div>
                {/* Image Frame with Authentic Photo */}
                <div className="relative aspect-square w-full overflow-hidden border-3 border-black bg-black">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />

                  {/* Tag badge */}
                  {item.tag && (
                    <span className="absolute top-2.5 left-2.5 border-2 border-black bg-[#FFE600] px-2.5 py-1 font-arcade text-[9px] font-bold text-black shadow-[2px_2px_0_0_#000]">
                      {item.tag}
                    </span>
                  )}

                  {/* Temperature badge */}
                  {item.category !== 'pastries-kitchen' && (
                    <span className="absolute top-2.5 right-2.5 border-2 border-black bg-white px-2 py-0.5 font-arcade text-[9px] text-black shadow-[2px_2px_0_0_#000] flex items-center gap-1">
                      {item.temperature === 'iced' ? (
                        <>
                          <Snowflake className="size-3 text-sky-600" />
                          <span>ICED</span>
                        </>
                      ) : item.temperature === 'hot' ? (
                        <>
                          <Flame className="size-3 text-amber-600" />
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
                      <h3 className="font-pixel text-2xl font-bold leading-tight text-black">
                        {item.name}
                      </h3>
                      {item.origin && (
                        <p className="font-silk text-[10px] text-[#FF5722] mt-0.5">
                          {item.origin}
                        </p>
                      )}
                    </div>
                    <span className="border-2 border-black bg-[#FFE600] px-2.5 py-1 font-arcade text-sm font-bold text-black shadow-[2px_2px_0_0_#000]">
                      ₱{item.price}
                    </span>
                  </div>

                  <p className="font-mono text-xs leading-relaxed text-black/80 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tasting notes chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="border border-black bg-[#FFFDF0] px-2 py-0.5 font-arcade text-[8px] text-black"
                      >
                        +{note.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t-3 border-black flex items-center gap-2 font-silk">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="neo-btn flex-1 flex items-center justify-center gap-1.5 bg-[#00F0FF] py-2.5 text-xs font-bold text-black"
                >
                  <span>CUSTOMIZE</span>
                  <ArrowUpRight className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddWithNotice(item)}
                  className="neo-btn flex items-center justify-center bg-[#FFE600] px-4 py-2.5 text-black"
                  title="Quick add to tray"
                >
                  <Plus className="size-4 stroke-[3]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Neo Guarantee Banner */}
      <div className="mt-14 border-4 border-black bg-[#A3E635] p-6 shadow-[6px_6px_0_0_#000] text-center">
        <p className="font-arcade text-xs text-black">
          ★ ZERO ARTIFICIAL PRESERVATIVES · 100% CALAUAN WILD HONEY · LAGUNA SEA SALT ★
        </p>
        <p className="font-mono text-xs text-black/80 mt-1 max-w-xl mx-auto">
          All our syrups are prepared in-house weekly. Single origins roasted fresh bi-weekly.
        </p>
      </div>
    </section>
  )
}
