'use client'

import React, { useState } from 'react'
import {
  Heart,
  Utensils,
  Fish,
  Flame,
  Soup,
  Shrimp,
  Wine,
  Sparkles,
  Cake,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShoppingBag,
  CreditCard,
  QrCode,
  DollarSign,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Layers,
  Store,
  User,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { POSOrder, RecipeItem, UserRole } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface PosModuleProps {
  currentRole: UserRole
  onClose?: () => void
  onNavigateToInventory?: () => void
}

export function PosModule({ currentRole, onClose, onNavigateToInventory }: PosModuleProps) {
  const {
    tables,
    recipes,
    employees,
    inventory,
    createPOSOrder,
    completePOSOrder,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Currency display: supports ৳ (as in screenshot) or ₱ (Philippine Peso)
  const [currencySymbol, setCurrencySymbol] = useState<'৳' | '₱'>('৳')

  // Active Category matching the user's screenshot
  const [activeCategory, setActiveCategory] = useState<string>('Popular')

  // Active Table & Server for POS Order Linking
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[0]?.id || '')
  const [customerName, setCustomerName] = useState<string>('Table Guest')
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Credit Card' | 'Cash' | 'Maya'>('Cash')
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(true)

  // Carousel slide for top banner
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // Cart state: map of recipeId -> quantity
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'rec-classic-burger': 1,
    'rec-salmon-nigiri': 1,
  })

  const activeTable = tables.find((t) => t.id === selectedTableId) || tables[0]
  const onDutyServer = employees.find((e) => e.id === activeTable?.assignedEmployeeId) || employees[2]

  // Vertical Categories list with custom icons and labels matching the screenshot
  const categoryNavItems = [
    {
      id: 'Popular',
      label: 'Popular',
      icon: (props: any) => <Heart className={props.className} fill="currentColor" />,
      tag: 'hot',
    },
    {
      id: 'Burger',
      label: 'Burger',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍔</span>
      ),
    },
    {
      id: 'Sushi',
      label: 'Sushi',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍣</span>
      ),
    },
    {
      id: 'Sashimi',
      label: 'Sashimi',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🐟</span>
      ),
    },
    {
      id: 'BBQ',
      label: 'BBQ',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍢</span>
      ),
    },
    {
      id: 'Noodle',
      label: 'Noodle',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍜</span>
      ),
    },
    {
      id: 'Tempura',
      label: 'Tempura',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍤</span>
      ),
    },
    {
      id: 'Nabe',
      label: 'Nabe',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍲</span>
      ),
    },
    {
      id: 'Sake',
      label: 'Sake',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🍶</span>
      ),
    },
    {
      id: 'Desserts',
      label: 'Desserts',
      icon: (props: any) => (
        <span className="text-xl leading-none select-none">🥭</span>
      ),
    },
  ]

  // Filter recipes based on active category
  const filteredRecipes = recipes.filter((r) => {
    if (activeCategory === 'Popular') {
      return (
        r.id === 'rec-classic-burger' ||
        r.id === 'rec-burger-combo' ||
        r.id === 'rec-tobiko-roll' ||
        r.id === 'rec-salmon-nigiri' ||
        r.id === 'rec-maguro-nigiri' ||
        r.id === 'rec-shime-saba-nigiri' ||
        r.id === 'rec-tempura-roll' ||
        r.id === 'rec-alaska-roll' ||
        r.id === 'rec-unagi-roll' ||
        r.id === 'rec-mango-royale'
      )
    }
    if (activeCategory === 'Burger') {
      return r.category === 'Burger' || r.name.toLowerCase().includes('burger')
    }
    if (activeCategory === 'Sushi') {
      return r.category === 'Sushi' || r.name.toLowerCase().includes('roll') || r.name.toLowerCase().includes('nigiri')
    }
    if (activeCategory === 'Sashimi') {
      return r.category === 'Sashimi' || r.name.toLowerCase().includes('nigiri') || r.name.toLowerCase().includes('sashimi')
    }
    if (activeCategory === 'Tempura') {
      return r.category === 'Tempura' || r.name.toLowerCase().includes('tempura')
    }
    if (activeCategory === 'Desserts') {
      return r.category === 'Desserts' || r.name.toLowerCase().includes('mango')
    }
    return r.category === activeCategory || r.category.toLowerCase().includes(activeCategory.toLowerCase())
  })

  // Quantity helpers
  const handleIncreaseQuantity = (recipeId: string) => {
    setCartQuantities((prev) => ({
      ...prev,
      [recipeId]: (prev[recipeId] || 0) + 1,
    }))
  }

  const handleDecreaseQuantity = (recipeId: string) => {
    setCartQuantities((prev) => {
      const current = prev[recipeId] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[recipeId]
        return next
      }
      return { ...prev, [recipeId]: current - 1 }
    })
  }

  // Active items array
  const activeCartItems = Object.entries(cartQuantities)
    .map(([recipeId, qty]) => {
      const rec = recipes.find((r) => r.id === recipeId)
      return rec ? { recipe: rec, quantity: qty } : null
    })
    .filter(Boolean) as { recipe: RecipeItem; quantity: number }[]

  const totalItemCount = Object.values(cartQuantities).reduce((s, q) => s + q, 0)
  const subtotal = activeCartItems.reduce((sum, item) => sum + item.recipe.currentSellingPrice * item.quantity, 0)
  const tax = Number((subtotal * 0.05).toFixed(2)) // 5% service/tax
  const total = Number((subtotal + tax).toFixed(2))
  const costOfGoods = activeCartItems.reduce((sum, item) => sum + item.recipe.totalIngredientCost * item.quantity, 0)
  const grossProfit = Number((total - costOfGoods).toFixed(2))

  // Preview ingredients to be deducted from inventory
  const previewDeductions = activeCartItems.flatMap((cartItem) =>
    cartItem.recipe.ingredients.map((ing) => ({
      name: ing.ingredientName,
      deductQty: ing.quantity * cartItem.quantity,
      unit: ing.unit,
      recipeName: cartItem.recipe.name,
    }))
  )

  // Handle Checkout & Automatic Stock Deduction
  const handleCheckoutAndDeduct = () => {
    if (activeCartItems.length === 0) {
      toast('Empty Order', 'Please add at least one item to proceed.', 'error')
      return
    }

    const newOrder = createPOSOrder({
      tableId: activeTable.id,
      tableName: activeTable.tableNumber,
      customerName: customerName || activeTable.currentGuestName || 'Table Guest',
      serverId: onDutyServer.id,
      serverName: onDutyServer.name,
      items: activeCartItems.map((ci) => ({
        recipeId: ci.recipe.id,
        name: ci.recipe.name,
        quantity: ci.quantity,
        unitPrice: ci.recipe.currentSellingPrice,
        subtotal: ci.recipe.currentSellingPrice * ci.quantity,
        unitCost: ci.recipe.totalIngredientCost,
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      costOfGoods,
      grossProfit,
      paymentMethod,
    })

    completePOSOrder(newOrder.id, onDutyServer.name)

    toast(
      'Order Placed & Stock Deducted!',
      `Order ${newOrder.orderNumber} placed for Table ${activeTable.tableNumber}. Inventory ingredients automatically deducted.`,
      'success'
    )

    setCartQuantities({})
    if (onClose) onClose()
  }

  // Promotional Banner Slides
  const promoSlides = [
    {
      title: 'Super Delicious',
      highlight: 'Hot Burger',
      badge: 'Today Best Deal',
      discount: 'Get Upto 45% Discount',
      bg: 'bg-gradient-to-r from-[#FF4141] via-[#FF5858] to-[#FF6B6B]',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    },
    {
      title: 'Fresh & Hand-Crafted',
      highlight: 'Salmon & Nigiri Set',
      badge: "Chef's Special",
      discount: 'Save 20% on Combos',
      bg: 'bg-gradient-to-r from-[#E54040] via-[#F25A5A] to-[#FF7575]',
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=80',
    },
  ]

  return (
    <div className="bg-white text-[#222222] rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_#000] border-3 border-black flex flex-col font-sans transition-all">
      {/* Top Bar with Table, Server, Currency Selector & Cart Toggle (Neo-Brutalist) */}
      <div className="bg-white border-b-2 border-black px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4141] border border-black animate-pulse" />
            <span className="font-black text-sm tracking-tight text-black">Rosa Table Ordering Terminal</span>
          </div>

          <div className="h-5 w-0.5 bg-black/15 hidden sm:block" />

          {/* Active Table Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border-2 border-black px-3 py-1 rounded-2xl shadow-[2px_2px_0px_0px_#000]">
            <span className="text-neutral-600 font-bold">Table:</span>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="bg-transparent font-black text-black focus:outline-none cursor-pointer"
            >
              {tables.map((tbl) => (
                <option key={tbl.id} value={tbl.id}>
                  {tbl.tableNumber} ({tbl.diningArea} - {tbl.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-2xl font-mono font-black text-[11px] border-2 border-black shadow-[1px_1px_0px_0px_#000]">
            <button
              onClick={() => setCurrencySymbol('৳')}
              className={`px-2 py-0.5 rounded-xl border ${currencySymbol === '৳' ? 'bg-[#FF4141] text-white border-black shadow-[1px_1px_0px_0px_#000]' : 'text-neutral-700 border-transparent'}`}
              title="Bengali Taka (as in reference)"
            >
              ৳ (BDT)
            </button>
            <button
              onClick={() => setCurrencySymbol('₱')}
              className={`px-2 py-0.5 rounded-xl border ${currencySymbol === '₱' ? 'bg-[#FF4141] text-white border-black shadow-[1px_1px_0px_0px_#000]' : 'text-neutral-700 border-transparent'}`}
              title="Philippine Peso"
            >
              ₱ (PHP)
            </button>
          </div>
        </div>

        {/* Right Action: Cart Indicator / Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartDrawerOpen(!isCartDrawerOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-black uppercase tracking-wider text-xs bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Receipt ({totalItemCount})</span>
            <span className="font-mono font-black ml-1">{currencySymbol}{subtotal}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white border-2 border-black text-black hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              title="Close POS"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body: Left Sidebar + Center Product Canvas + Right Order Bill */}
      <div className="flex flex-1 min-h-[640px] overflow-hidden">
        {/* 1. LEFT VERTICAL CATEGORY BAR */}
        <aside className="w-20 sm:w-24 bg-[#FAF8F5] border-r-2 border-black py-3 flex flex-col items-center gap-2 overflow-y-auto shrink-0 select-none">
          {categoryNavItems.map((cat) => {
            const isActive = activeCategory === cat.id
            const Icon = cat.icon

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-16 sm:w-18 py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF4141] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                    : 'text-neutral-700 hover:text-black hover:bg-white border-2 border-transparent'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-white text-[#FF4141] border-2 border-black shadow-[1px_1px_0px_0px_#000]'
                      : 'bg-white text-neutral-800 border-2 border-black/20 shadow-2xs'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#FF4141]" />
                </div>
                <span className={`text-[11px] font-black tracking-tight text-center truncate w-full ${
                  isActive ? 'text-white' : 'text-neutral-800'
                }`}>
                  {cat.label}
                </span>
              </button>
            )
          })}
        </aside>

        {/* 2. CENTER PRODUCT CANVAS (Hero Banner + 3-Col Product Cards) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#FDFBF7] space-y-5">
          {/* TOP HERO PROMO BANNER CAROUSEL (Exact match to screenshot) */}
          <div className="relative rounded-3xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_0px_#000] text-white">
            <div className={`p-6 sm:p-8 flex items-center justify-between relative overflow-hidden ${promoSlides[currentSlide].bg}`}>
              {/* Background decorative burger pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Left Content */}
              <div className="space-y-2 relative z-10 max-w-sm">
                <span className="font-serif italic text-lg sm:text-xl text-[#FFD553] drop-shadow-sm font-black">
                  {promoSlides[currentSlide].title}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
                  {promoSlides[currentSlide].highlight}
                </h2>
                <div className="inline-block bg-[#FFE600] text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_#000] mt-1">
                  {promoSlides[currentSlide].badge}
                </div>
                <p className="text-[11px] text-white/90 leading-relaxed pt-1 font-medium">
                  Freshly seared Australian ground chuck patty, aged cheddar, crisp greens, and secret house sauce.
                </p>
              </div>

              {/* Right Burger Photo & Discount Circle */}
              <div className="relative flex items-center justify-center shrink-0">
                <img
                  src={promoSlides[currentSlide].img}
                  alt="Hot Burger Special"
                  className="w-36 h-36 sm:w-52 sm:h-52 object-cover rounded-2xl border-2 border-black drop-shadow-2xl transform hover:scale-105 transition-transform"
                />

                {/* Red Circular Discount Badge */}
                <div className="absolute -top-2 -right-2 sm:top-2 sm:right-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E52222] border-2 border-black text-white flex flex-col items-center justify-center p-1 text-center shadow-[2px_2px_0px_0px_#000] transform rotate-12">
                  <span className="text-[9px] uppercase font-black tracking-wider leading-none">Get Upto</span>
                  <span className="text-base sm:text-lg font-black leading-none mt-0.5">45%</span>
                  <span className="text-[8px] uppercase font-black tracking-wider leading-none">Discount</span>
                </div>
              </div>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="bg-white py-2 flex items-center justify-center gap-1.5 border-t-2 border-black">
              {promoSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full border border-black transition-all ${
                    currentSlide === idx ? 'w-8 bg-[#FF4141]' : 'w-2.5 bg-neutral-200'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 3-COLUMN PRODUCT CARDS GRID (Exact match to screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredRecipes.map((item) => {
              const qty = cartQuantities[item.id] || 0
              const isSelected = qty > 0

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-4 flex flex-col justify-between transition-all duration-150 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] ${
                    isSelected
                      ? 'ring-2 ring-[#FF4141] bg-[#FFF8F8]'
                      : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  {/* Product Image */}
                  <div className="w-full h-36 flex items-center justify-center bg-transparent rounded-2xl overflow-hidden mb-3 border border-black/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-black leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 line-clamp-1 font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Price Tag & Action Stepper */}
                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-black/10">
                    {/* Price in Coral Red with Currency Symbol */}
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-sm font-black text-[#FF4141] font-mono">
                        {currencySymbol}
                      </span>
                      <span className="text-lg font-black text-[#FF4141] font-mono tracking-tight">
                        {item.currentSellingPrice}
                      </span>
                    </div>

                    {/* Button Stepper: If quantity is 0, show circular (+) button. If >0, show pill stepper [- 1 +] */}
                    {qty === 0 ? (
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="w-9 h-9 rounded-full border-2 border-black bg-white text-[#FF4141] hover:bg-[#FF4141] hover:text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        aria-label={`Add ${item.name}`}
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    ) : (
                      /* Oblong pill with minus, quantity, and red circular plus button (Exact match to screenshot) */
                      <div className="flex items-center gap-2 bg-white border-2 border-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_#000]">
                        {/* Minus button */}
                        <button
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="w-7 h-7 rounded-full text-black hover:text-[#FF4141] flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        {/* Bold Count */}
                        <span className="font-mono font-black text-sm text-black px-1 select-none">
                          {qty}
                        </span>

                        {/* Plus button with filled red circle */}
                        <button
                          onClick={() => handleIncreaseQuantity(item.id)}
                          className="w-7 h-7 rounded-full bg-[#FF4141] text-white border border-black flex items-center justify-center hover:bg-[#E03535] transition-colors shadow-2xs cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. RIGHT SIDE ORDER BILL & INVENTORY DEDUCTION PREVIEW */}
        {isCartDrawerOpen && (
          <aside className="w-80 lg:w-96 bg-white border-l-2 border-black flex flex-col justify-between shrink-0 shadow-[-6px_0px_0px_0px_rgba(0,0,0,0.05)] p-5">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-black">Active Table Order</span>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      Table {activeTable.tableNumber}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                    {activeTable.diningArea} • Waiter: <span className="font-bold text-black">{onDutyServer.name}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="text-neutral-500 hover:text-black p-1 border-2 border-black rounded-xl bg-white shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Guest Name input */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">
                  Customer / Guest Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Table 1 Guests"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#FAF8F5] border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {activeCartItems.length === 0 ? (
                  <div className="text-center py-10 text-neutral-400 space-y-1">
                    <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300" />
                    <p className="text-xs font-bold text-neutral-600">Your order is empty</p>
                    <p className="text-[11px] text-neutral-500">Click (+) on any burger or sushi card to add.</p>
                  </div>
                ) : (
                  activeCartItems.map(({ recipe, quantity }) => (
                    <div
                      key={recipe.id}
                      className="p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black flex items-center justify-between text-xs shadow-[2px_2px_0px_0px_#000]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={recipe.image} alt={recipe.name} className="w-10 h-10 rounded-xl object-cover border border-black" />
                        <div>
                          <p className="font-black text-black leading-tight">{recipe.name}</p>
                          <p className="text-[11px] font-mono text-[#FF4141] font-black">
                            {currencySymbol}{recipe.currentSellingPrice} × {quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDecreaseQuantity(recipe.id)}
                          className="w-6 h-6 rounded-lg bg-white border border-black text-black flex items-center justify-center font-black hover:bg-neutral-100 shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono font-black text-xs text-black px-1">{quantity}</span>
                        <button
                          onClick={() => handleIncreaseQuantity(recipe.id)}
                          className="w-6 h-6 rounded-lg bg-[#FF4141] text-white border border-black flex items-center justify-center font-black hover:bg-[#E03535] shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Real-time Automatic Stock Deduction Preview */}
              {previewDeductions.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-black text-[11px] space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-1 text-black font-black uppercase text-[10px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>Automatic Stock Deduction Sync:</span>
                  </div>
                  <div className="max-h-20 overflow-y-auto space-y-0.5 text-neutral-800">
                    {previewDeductions.slice(0, 5).map((d, i) => (
                      <div key={i} className="flex justify-between font-mono text-[10px]">
                        <span className="truncate pr-2 font-bold">{d.name}</span>
                        <span className="text-[#FF4141] font-black shrink-0">-{d.deductQty} {d.unit}</span>
                      </div>
                    ))}
                    {previewDeductions.length > 5 && (
                      <p className="text-[9px] text-neutral-600 font-bold italic">
                        +{previewDeductions.length - 5} more ingredients will be deducted
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary & Payment Trigger */}
            <div className="space-y-3 pt-3 border-t-2 border-black/10 text-xs">
              <div className="space-y-1.5 text-neutral-600 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span className="font-mono text-black font-black">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax & Service (5%)</span>
                  <span className="font-mono text-black font-black">{currencySymbol}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#15803D] font-black">
                  <span>Estimated Gross Margin</span>
                  <span className="font-mono">+{currencySymbol}{grossProfit.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border-2 border-black flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                <span className="font-black text-sm text-black">Total Payable:</span>
                <span className="font-mono font-black text-xl text-[#FF4141]">
                  {currencySymbol}{total.toFixed(2)}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-black uppercase">
                {(['Cash', 'Credit Card', 'GCash', 'Maya'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-1.5 rounded-xl border-2 border-black text-center transition-all cursor-pointer ${
                      paymentMethod === m
                        ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white text-neutral-700 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handleCheckoutAndDeduct}
                disabled={activeCartItems.length === 0}
                className="w-full py-3.5 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Place Order & Auto-Deduct Stock</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
