'use client'

import { useState } from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { MenuItem, CartItem, BranchId } from '@/lib/types'
import { MENU_ITEMS } from '@/lib/menu-data'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MenuSection } from '@/components/MenuSection'
import { DrinkCustomizerModal } from '@/components/DrinkCustomizerModal'
import { TastingTrayDrawer } from '@/components/TastingTrayDrawer'
import { AmbianceSection } from '@/components/AmbianceSection'
import { CraftSection } from '@/components/CraftSection'
import { ReservationSection } from '@/components/ReservationSection'
import { RewardsSection } from '@/components/RewardsSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { FaqSection } from '@/components/FaqSection'
import { LocationSection } from '@/components/LocationSection'
import { Footer } from '@/components/Footer'

export default function Page() {
  const [customerBranch, setCustomerBranch] = useState<BranchId>('lake')
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  const [isTrayOpen, setIsTrayOpen] = useState(false)
  const [trayItems, setTrayItems] = useState<CartItem[]>([
    {
      id: 'default-item',
      item: MENU_ITEMS[0],
      temperature: 'iced',
      sweetness: '75% Less Sweet',
      milk: 'Fresh Whole Milk',
      extras: ['Sea Salt Whipped Cloud Foam'],
      quantity: 1,
      totalPrice: 230,
      customizationSummary: 'Iced · 75% Sweet · Sea Salt Whipped Cloud',
    },
  ])

  // Total count & subtotal
  const trayCount = trayItems.reduce((acc, i) => acc + i.quantity, 0)
  const traySubtotal = trayItems.reduce((acc, i) => acc + i.totalPrice, 0)

  const handleOpenCustomizer = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setIsCustomizerOpen(true)
  }

  const handleQuickAdd = (item: MenuItem) => {
    const existingIndex = trayItems.findIndex(
      (i) => i.item.id === item.id && i.customizationSummary.includes('Standard')
    )

    if (existingIndex > -1) {
      const updated = [...trayItems]
      updated[existingIndex].quantity += 1
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * item.price
      setTrayItems(updated)
    } else {
      const newCartItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        item,
        temperature: item.temperature === 'hot' ? 'hot' : 'iced',
        sweetness: '100% Standard',
        milk: 'Fresh Whole Milk',
        extras: [],
        quantity: 1,
        totalPrice: item.price,
        customizationSummary: `${item.temperature === 'hot' ? 'Hot' : 'Iced'} · Standard Serving`,
      }
      setTrayItems((prev) => [...prev, newCartItem])
    }
  }

  const handleAddToCart = (item: CartItem) => {
    setTrayItems((prev) => [...prev, item])
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    setTrayItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            if (newQty <= 0) return null
            const unitPrice = item.totalPrice / item.quantity
            return {
              ...item,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            }
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const handleRemoveItem = (id: string) => {
    setTrayItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleClearTray = () => {
    setTrayItems([])
  }

  const scrollToReservation = () => {
    const el = document.getElementById('reserve')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main id="top" className="min-h-screen bg-[#FAF4E8] text-[#341F14] bg-vintage-paper selection:bg-[#FBE48A] selection:text-[#341F14]">
      {/* Global Header */}
      <Header
        trayCount={trayCount}
        onOpenTray={() => setIsTrayOpen(true)}
        onOpenReserve={scrollToReservation}
        selectedBranch={customerBranch}
        onSelectBranch={setCustomerBranch}
      />

      {/* Hero Section */}
      <Hero
        featuredItem={MENU_ITEMS[0]}
        onQuickAdd={handleQuickAdd}
        onOpenReserve={scrollToReservation}
      />

      {/* Interactive Slow Bar Menu */}
      <MenuSection
        onSelectItem={handleOpenCustomizer}
        onQuickAdd={handleQuickAdd}
      />

      {/* Spaces to Linger (Ambiance Tour) */}
      <AmbianceSection />

      {/* Craft & Terroir Section */}
      <CraftSection />

      {/* Golden Hour Sunset Table Reservation */}
      <ReservationSection />

      {/* 8-Stamp Passport & Loyalty Card */}
      <RewardsSection />

      {/* Guest Testimonials & Bay Stories */}
      <TestimonialsSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Location, Driving Directions & Map */}
      <LocationSection />

      {/* Editorial Neo Footer */}
      <Footer />

      {/* Drink Customization Modal */}
      <DrinkCustomizerModal
        item={selectedMenuItem}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Tasting Tray Slide-over Drawer */}
      <TastingTrayDrawer
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        items={trayItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearTray={handleClearTray}
        selectedBranch={customerBranch}
        onSelectBranch={setCustomerBranch}
      />

      {/* Floating Tasting Tray Pill */}
      {trayCount > 0 && (
        <aside 
          aria-label="Order summary"
          className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-200"
        >
          <button
            onClick={() => setIsTrayOpen(true)}
            className="flex items-center gap-3 rounded-full bg-[#1A3B2F] text-[#FAF4E8] px-5 py-2.5 shadow-xl hover:bg-[#D25427] hover:scale-105 transition-all"
          >
            <div className="relative flex size-7 items-center justify-center rounded-full bg-white/20">
              <ShoppingBag className="size-3.5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#D25427] text-[9px] font-black text-white">
                {trayCount}
              </span>
            </div>
            <div className="text-left font-sans">
              <p className="text-[9px] uppercase tracking-wider text-white/75 font-bold">
                Tasting Tray
              </p>
              <p className="font-bold text-xs text-[#FAF4E8]">
                ₱{traySubtotal}
              </p>
            </div>
            <ArrowRight className="size-4 text-white/90" />
          </button>
        </aside>
      )}
    </main>
  )
}
