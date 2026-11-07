'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Snowflake,
  Flame,
  Check,
  LayoutGrid,
  List,
  Sparkles,
  Coffee,
  X,
  Newspaper,
  BookOpen,
  Compass,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react'
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
  const [tempFilter, setTempFilter] = useState<'all' | 'iced' | 'hot'>('all')
  const [viewMode, setViewMode] = useState<'broadsheet' | 'classifieds'>('broadsheet')
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null)

  const categories = [
    { id: 'all', section: 'SEC. 01', label: 'Complete Gazette', icon: '📰' },
    { id: 'signature', section: 'SEC. 02', label: 'Front-Page Sips', icon: '☕' },
    { id: 'pourover', section: 'SEC. 03', label: 'Single Origin V60', icon: '🏔️' },
    { id: 'matcha-tea', section: 'SEC. 04', label: 'Kyoto Tea Desk', icon: '🍵' },
    { id: 'pastries-kitchen', section: 'SEC. 05', label: 'Morning Bakery', icon: '🥐' },
  ]

  // Lead editorial story item (Flagship)
  const leadStoryItem = useMemo(() => {
    return MENU_ITEMS.find((i) => i.id === 'honey-sea-salt-latte') || MENU_ITEMS[0]
  }, [])

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MENU_ITEMS.length }
    MENU_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return counts
  }, [])

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.origin && item.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.tastingNotes.some((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesPopular = !filterPopular || item.isPopular

      const matchesTemp =
        tempFilter === 'all' ||
        item.temperature === 'both' ||
        item.temperature === tempFilter

      return matchesCategory && matchesSearch && matchesPopular && matchesTemp
    })
  }, [activeCategory, searchQuery, filterPopular, tempFilter])

  const handleQuickAddWithNotice = (item: MenuItem) => {
    onQuickAdd(item)
    setAddedItemNotice(item.name)
    setTimeout(() => {
      setAddedItemNotice(null)
    }, 2400)
  }

  const activeFiltersCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0) +
    (filterPopular ? 1 : 0) +
    (tempFilter !== 'all' ? 1 : 0)

  const resetAllFilters = () => {
    setActiveCategory('all')
    setSearchQuery('')
    setFilterPopular(false)
    setTempFilter('all')
  }

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
      
      {/* ── Toast Notice for Orders ── */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border-3 border-black bg-[#FFE600] px-5 py-3.5 font-sans font-black text-xs text-black shadow-[6px_6px_0px_0px_#000] animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex size-6 items-center justify-center rounded-full bg-black text-white shrink-0">
            <Check className="size-3.5 stroke-[3] text-[#FFE600]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-wider text-black/70">Dispatch Confirmed · Added to Tray</span>
            <span className="font-bold">{addedItemNotice}</span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          NEWSPAPER MASTHEAD (Broadsheet Gazette Header)
         ══════════════════════════════════════════════════════════════ */}
      <div className="border-t-4 border-b-4 border-double border-black py-4 mb-8 bg-white/60">
        
        {/* Top Dateline Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-2.5 font-mono text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-800">
          <div className="flex items-center gap-3">
            <span>VOL. IV · NO. 88</span>
            <span>•</span>
            <span>LAGUNA DE BAY WATERFRONT EDITION</span>
          </div>
          <div className="flex items-center gap-3">
            <span>WEATHER: 28°C LAKE BREEZE</span>
            <span>•</span>
            <span className="text-[#FF5500]">VERANDA SLOW BAR: OPEN</span>
            <span>•</span>
            <span>PRICE: ₱160 – ₱230</span>
          </div>
        </div>

        {/* Major Editorial Broadsheet Headline */}
        <div className="text-center py-6 sm:py-8 space-y-2">
          <p className="font-mono text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase text-[#FF5500]">
            ★ THE DAILY ROASTER &amp; BAKERY DISPATCH ★
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black tracking-tight uppercase leading-none">
            The Waterfront Chronicle
          </h2>
          <p className="font-serif italic text-base sm:text-xl text-neutral-700 max-w-3xl mx-auto pt-1">
            “Documenting the slow-roasted single origins, morning flaky laminations, and cold-steeped craft of Laguna de Bay.”
          </p>
        </div>

        {/* Bottom Rules / Sub-header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-black pt-2.5 font-mono text-[10px] sm:text-xs font-bold text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 rounded font-black text-[9px]">LATEST CROP</span>
            <span>Atok Benguet Washed Typica (1,600m) &amp; Mt. Apo Anaerobic Reserve</span>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span>DAILY CIRCULATION: 1,200 CUPS SERVED FRESH</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FRONT-PAGE LEAD STORY (Feature Spotlight Article)
         ══════════════════════════════════════════════════════════════ */}
      {leadStoryItem && activeCategory === 'all' && !searchQuery && (
        <article className="rounded-3xl border-3 border-black bg-white p-5 sm:p-8 shadow-[8px_8px_0px_0px_#000] mb-12">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#FF5500] text-white border-2 border-black px-3 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider">
                ★ FRONT-PAGE LEAD STORY
              </span>
              <span className="font-mono text-xs font-black uppercase text-neutral-500">
                DISPATCH // ATOK &amp; CALAUAN
              </span>
            </div>
            <span className="font-mono text-xs font-black text-[#FF5500]">
              VERIFIED SPECIALTY SCORE: 88.5 PTS
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            
            {/* Story Image with Editorial Photo Caption */}
            <div className="lg:col-span-5 space-y-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-black bg-neutral-100 shadow-[4px_4px_0px_0px_#000]">
                <img
                  src={leadStoryItem.image}
                  alt={leadStoryItem.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-full border-2 border-black bg-[#FFE600] px-3 py-1 font-mono text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
                  {leadStoryItem.tag || 'FLAGSHIP ROAST'}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full border-2 border-black bg-white px-3.5 py-1 font-mono text-sm font-black text-black shadow-[2px_2px_0px_0px_#000]">
                  ₱{leadStoryItem.price}
                </span>
              </div>
              <p className="font-mono text-[10px] italic text-neutral-500 leading-tight">
                FIG 1.0 — Freshly pulled double ristretto layered beneath hand-whipped Laguna sea-salt cloud foam and raw forest honey drizzle.
              </p>
            </div>

            {/* Story Editorial Body */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <p className="font-mono text-xs font-black text-[#FF5500] uppercase tracking-wider">
                  EXCLUSIVE WATERFRONT REPORT
                </p>
                <h3 className="font-serif text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight mt-1">
                  {leadStoryItem.name}: The Morning Benchmark
                </h3>
                <h4 className="font-serif italic text-lg sm:text-xl text-neutral-700 mt-1">
                  {leadStoryItem.tagline}
                </h4>
              </div>

              {/* Editorial Article Columns */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-black/15">
                <p className="font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  <span className="float-left font-serif text-4xl sm:text-5xl font-black text-black leading-none pr-2 pt-0.5">
                    F
                  </span>
                  rom the steep mountain ridges of Atok, Benguet at 1,600 meters elevation, our master roasters select washed Typica lots specifically calibrated for milk beverage balance.
                </p>
                <p className="font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  Crowned with a dense micro-foam infused with Laguna mineral sea salt and sweetened naturally with wild forest honey harvested in Calauan. Never synthetic; pure lakefront morning comfort.
                </p>
              </div>

              {/* Cupping Notes Strip */}
              <div className="rounded-2xl border-2 border-black bg-[#FAF8F5] p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black text-black uppercase">
                  <span>CUPPING PROFILE:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {leadStoryItem.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="rounded-lg border border-black bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold text-black"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Story CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleQuickAddWithNotice(leadStoryItem)}
                  className="flex-1 sm:flex-initial rounded-full bg-[#FF5500] hover:bg-[#E04B00] text-white border-2 border-black px-7 py-3 font-mono font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="size-4 stroke-[3]" />
                  <span>ORDER THIS ROAST (₱{leadStoryItem.price})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectItem(leadStoryItem)}
                  className="rounded-full bg-white hover:bg-[#FAF8F5] text-black border-2 border-black px-6 py-3 font-mono font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>CUSTOMIZE SPECIFICATIONS</span>
                  <ArrowUpRight className="size-4 text-[#FF5500]" />
                </button>
              </div>

            </div>
          </div>
        </article>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CLASSIFIEDS & ARCHIVE DESK (Search & Filter Controls)
         ══════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border-3 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] mb-10 space-y-4">
        
        {/* Desk Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="size-4 text-[#FF5500]" />
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black">
              THE ROASTER'S INDEX &amp; CLASSIFIEDS DESK
            </h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-neutral-600">
            <span>SHOWING: <strong className="text-black">{filteredItems.length}</strong> ENTRIES</span>
            <span>•</span>
            <div className="flex items-center rounded-xl border border-black bg-[#FAF8F5] p-0.5">
              <button
                onClick={() => setViewMode('broadsheet')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  viewMode === 'broadsheet' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Broadsheet
              </button>
              <button
                onClick={() => setViewMode('classifieds')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  viewMode === 'classifieds' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Gazette Index
              </button>
            </div>
          </div>
        </div>

        {/* Search input + Newspaper Filter Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Newspaper Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by roast, harvest terroir (Benguet, Mt. Apo), or flavor profile..."
              className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] pl-10 pr-9 py-2.5 font-mono text-xs font-bold text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5500]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Quick News Stamp Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterPopular(!filterPopular)}
              className={`flex items-center gap-1.5 rounded-2xl border-2 border-black px-3.5 py-2 font-mono text-xs font-black uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                filterPopular
                  ? 'bg-[#FF5500] text-white'
                  : 'bg-white text-black hover:bg-[#FAF8F5]'
              }`}
            >
              <span>★</span>
              <span>Editor's Picks</span>
            </button>

            <button
              onClick={() => setTempFilter(tempFilter === 'iced' ? 'all' : 'iced')}
              className={`flex items-center gap-1.5 rounded-2xl border-2 border-black px-3.5 py-2 font-mono text-xs font-black uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                tempFilter === 'iced'
                  ? 'bg-[#60A5FA] text-black'
                  : 'bg-white text-black hover:bg-[#FAF8F5]'
              }`}
            >
              <Snowflake className="size-3.5 text-blue-700" />
              <span>Chilled Editions</span>
            </button>

            <button
              onClick={() => setTempFilter(tempFilter === 'hot' ? 'all' : 'hot')}
              className={`flex items-center gap-1.5 rounded-2xl border-2 border-black px-3.5 py-2 font-mono text-xs font-black uppercase transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                tempFilter === 'hot'
                  ? 'bg-[#F97316] text-white'
                  : 'bg-white text-black hover:bg-[#FAF8F5]'
              }`}
            >
              <Flame className="size-3.5 text-orange-200" />
              <span>Steamed &amp; Hot</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1 rounded-2xl border-2 border-dashed border-neutral-400 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 font-mono text-xs font-black text-neutral-700 transition-all cursor-pointer"
              >
                <X className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Tabs (Newspaper Section Index) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t-2 border-black/10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            const count = categoryCounts[cat.id] || 0
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-2xl border-2 border-black px-4 py-2 font-mono text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                  isActive
                    ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="text-[10px] text-neutral-500 font-bold">{cat.section}</span>
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                    isActive ? 'bg-black text-[#FFE600]' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BROADSHEET EDITORIAL ARTICLES GRID
         ══════════════════════════════════════════════════════════════ */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border-3 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_#000] my-8">
          <Newspaper className="size-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="font-serif text-2xl font-black text-black">NO GAZETTE ARTICLES LOCATED</h3>
          <p className="font-mono text-xs text-neutral-600 mt-2 max-w-md mx-auto">
            The archive query yielded 0 published records. Adjust your keywords or reset all category dispatches.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-6 rounded-full bg-[#FF5500] text-white border-2 border-black px-6 py-2.5 font-mono font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:bg-[#E04B00] cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'broadsheet' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              className="group flex flex-col justify-between rounded-3xl border-3 border-black bg-white p-5 shadow-[5px_5px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                {/* Dateline & Section header */}
                <div className="flex items-center justify-between border-b border-black/15 pb-2 mb-3 font-mono text-[9px] font-black uppercase tracking-wider text-neutral-500">
                  <span>DISPATCH NO. {String(idx + 1).padStart(2, '0')}</span>
                  {item.origin ? (
                    <span className="text-[#FF5500]">📍 {item.origin}</span>
                  ) : (
                    <span>WATERFRONT KITCHEN</span>
                  )}
                </div>

                {/* Newspaper Photo Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-black bg-neutral-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Stamp Tag */}
                  {item.tag && (
                    <div className="absolute top-2.5 left-2.5 backdrop-blur-md bg-white/95 border-2 border-black rounded-full px-2.5 py-1 font-mono text-[9px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                      <span className="text-[#FF5500]">★</span>
                      <span>{item.tag}</span>
                    </div>
                  )}

                  {/* Temperature Pill */}
                  {item.category !== 'pastries-kitchen' && (
                    <div className="absolute top-2.5 right-2.5 backdrop-blur-md bg-white/95 border-2 border-black rounded-full px-2 py-0.5 font-mono text-[9px] font-black text-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                      {item.temperature === 'iced' ? (
                        <>
                          <Snowflake className="size-2.5 text-blue-600" />
                          <span>ICED</span>
                        </>
                      ) : item.temperature === 'hot' ? (
                        <>
                          <Flame className="size-2.5 text-orange-600" />
                          <span>HOT</span>
                        </>
                      ) : (
                        <span>ICED / HOT</span>
                      )}
                    </div>
                  )}

                  {/* Price Chip */}
                  <div className="absolute bottom-2.5 right-2.5 rounded-full border-2 border-black bg-[#FFE600] px-3 py-1 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]">
                    ₱{item.price}
                  </div>
                </div>

                {/* Article Typography */}
                <div className="pt-4 space-y-2">
                  <h4 className="font-serif text-2xl font-black text-black leading-tight group-hover:text-[#FF5500] transition-colors">
                    {item.name}
                  </h4>
                  
                  {item.tagline && (
                    <p className="font-serif italic text-xs text-neutral-600">
                      “{item.tagline}”
                    </p>
                  )}

                  <p className="font-sans text-xs text-neutral-700 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Cupping Notes Tag Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/10">
                    {item.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="rounded border border-black/30 bg-[#FAF8F5] px-2 py-0.5 font-mono text-[9px] font-bold text-neutral-800"
                      >
                        ✦ {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t-2 border-dashed border-black/15 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectItem(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-black bg-[#FAF8F5] hover:bg-[#FFE600] py-2.5 font-mono font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>Customize</span>
                  <ArrowUpRight className="size-3.5 text-[#FF5500]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddWithNotice(item)}
                  className="flex items-center justify-center size-10 rounded-2xl border-2 border-black bg-[#FF5500] hover:bg-[#E04B00] text-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
                  title="Quick add to tray"
                >
                  <Plus className="size-4 stroke-[3]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            GAZETTE INDEX / CLASSIFIED ROWS (List Mode)
           ══════════════════════════════════════════════════════════════ */
        <div className="rounded-3xl border-3 border-black bg-white overflow-hidden shadow-[6px_6px_0px_0px_#000] divide-y-2 divide-black">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="font-mono text-xs font-black text-neutral-400 w-6 shrink-0">
                  #{String(idx + 1).padStart(2, '0')}
                </span>
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-16 rounded-xl border-2 border-black object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-serif text-lg font-black text-black">
                      {item.name}
                    </h5>
                    {item.tag && (
                      <span className="rounded-full border border-black bg-[#FFE600] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-neutral-600 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 mt-1">
                    {item.origin && <span>📍 {item.origin}</span>}
                    <span>•</span>
                    <span className="text-[#FF5500]">{item.tastingNotes.join(' · ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <span className="rounded-full border-2 border-black bg-[#FFE600] px-3.5 py-1 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]">
                  ₱{item.price}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="rounded-2xl border-2 border-black bg-[#FAF8F5] hover:bg-[#FFE600] px-3.5 py-2 font-mono font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                  >
                    Specs
                  </button>
                  <button
                    onClick={() => handleQuickAddWithNotice(item)}
                    className="flex items-center justify-center size-9 rounded-2xl border-2 border-black bg-[#FF5500] hover:bg-[#E04B00] text-white shadow-[2px_2px_0px_0px_#000] cursor-pointer shrink-0"
                    title="Quick add"
                  >
                    <Plus className="size-4 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDITORIAL GAZETTE FOOTER (Dispatches & Standards)
         ══════════════════════════════════════════════════════════════ */}
      <div className="mt-14 rounded-3xl border-3 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000]">
        <div className="border-b-2 border-black pb-3 mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
            <span>EDITORIAL STANDARDS &amp; ROASTER DISPATCHES</span>
          </div>
          <span className="font-mono text-[10px] text-neutral-500 uppercase">PUBLISHED BI-WEEKLY · LAGUNA DE BAY</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-black/15 pb-4 sm:pb-0 sm:pr-4">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF5500]">01 // ROASTING LOG</span>
            <h5 className="font-serif text-lg font-black text-black">Small-Batch Micro-Lots Only</h5>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed">
              Every bean is tracked from Philippine highlands (Atok, Benguet &amp; Mt. Apo) directly to our waterfront drum roasters. Cupping score threshold: &gt;86 points.
            </p>
          </div>

          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-black/15 pb-4 sm:pb-0 sm:pr-4">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF5500]">02 // HONEY HARVEST</span>
            <h5 className="font-serif text-lg font-black text-black">Calauan Raw Forest Honey</h5>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed">
              Zero refined corn syrups or artificial flavorings. Sweetened exclusively by wild honey harvested by indigenous beekeepers in Laguna de Bay forests.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF5500]">03 // BAKERY SCHEDULE</span>
            <h5 className="font-serif text-lg font-black text-black">Dawn Lamination at 05:00</h5>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed">
              French butter laminated viennoiserie, sourdough focaccia, and burnt Basque cheesecakes emerge from the deck ovens fresh every morning at sunrise.
            </p>
          </div>
        </div>
      </div>

    </section>
  )
}
