'use client'

import { useState } from 'react'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { MenuItem, CartItem } from '@/lib/types'
import { MENU_ITEMS } from '@/lib/menu-data'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MarqueeTicker } from '@/components/MarqueeTicker'
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
    <main id="top" className="min-h-screen bg-[#FFFDF0] text-black bg-neo-grid selection:bg-[#FFE600] selection:text-black">
      {/* Global Header */}
      <Header
        trayCount={trayCount}
        onOpenTray={() => setIsTrayOpen(true)}
        onOpenReserve={scrollToReservation}
      />

      {/* Hero Section */}
      <Hero
        featuredItem={MENU_ITEMS[0]}
        onQuickAdd={handleQuickAdd}
        onOpenReserve={scrollToReservation}
      />

      {/* Retro Marquee Ticker */}
      <MarqueeTicker />

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
      />

      {/* Floating Tasting Tray Pill in Neo Brutalism */}
      {trayCount > 0 && (
        <aside 
          aria-label="Order summary"
          className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-4 duration-200"
        >
          <button
            onClick={() => setIsTrayOpen(true)}
            className="neo-btn flex items-center gap-3 bg-[#FFE600] pl-4 pr-5 py-3 text-black font-arcade text-xs"
          >
            <div className="relative flex size-8 items-center justify-center border-2 border-black bg-white">
              <ShoppingBag className="size-4" />
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center border-2 border-black bg-[#FF3366] text-[8px] font-bold text-white">
                {trayCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[8px] tracking-wider text-black/70">
                TASTING TRAY
              </p>
              <p className="font-bold text-black text-xs">
                ₱{traySubtotal}
              </p>
            </div>
            <ArrowRight className="size-4 text-black" />
          </button>
        </aside>
      )}
    </main>
  )
}
