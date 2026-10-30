'use client'

import { useState } from 'react'
import { X, Check, Flame, Snowflake, Sparkles } from 'lucide-react'
import { MenuItem, CartItem } from '@/lib/types'

interface DrinkCustomizerModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (cartItem: CartItem) => void
}

export function DrinkCustomizerModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
}: DrinkCustomizerModalProps) {
  if (!isOpen || !item) return null

  const [temperature, setTemperature] = useState<'iced' | 'hot'>(
    item.temperature === 'hot' ? 'hot' : 'iced'
  )
  const [sweetness, setSweetness] = useState('75% Less Sweet')
  const [milk, setMilk] = useState('Fresh Whole Milk')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  const milkPrices: Record<string, number> = {
    'Fresh Whole Milk': 0,
    'Oat Milk (Barista Blend)': 35,
    'Almond Milk': 35,
  }

  const extrasList = [
    { name: 'Extra Double Shot Espresso', price: 40 },
    { name: 'Sea Salt Whipped Cloud Foam', price: 45 },
    { name: 'Calauan Wild Honey Drizzle', price: 20 },
    { name: 'Pure Vanilla Bean Extract', price: 25 },
  ]

  const toggleExtra = (name: string) => {
    setSelectedExtras((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    )
  }

  const extrasCost = selectedExtras.reduce((sum, name) => {
    const extra = extrasList.find((e) => e.name === name)
    return sum + (extra ? extra.price : 0)
  }, 0)

  const unitPrice = item.price + (milkPrices[milk] || 0) + extrasCost
  const totalPrice = unitPrice * quantity

  const handleAdd = () => {
    const summaryParts: string[] = []
    if (item.category !== 'pastries-kitchen') {
      summaryParts.push(temperature === 'iced' ? 'Iced' : 'Hot')
      summaryParts.push(sweetness)
      if (milk !== 'Fresh Whole Milk') summaryParts.push(milk.split(' ')[0])
    }
    if (selectedExtras.length > 0) {
      summaryParts.push(`+${selectedExtras.length} extras`)
    }

    const cartItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      item,
      temperature,
      sweetness,
      milk,
      extras: selectedExtras,
      quantity,
      totalPrice,
      customizationSummary: summaryParts.join(' · ') || 'Standard Serving',
    }

    onAddToCart(cartItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto border-4 border-black bg-[#FFFDF0] text-black shadow-[12px_12px_0_0_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Titlebar */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#FFE600] px-4 py-2.5 font-arcade text-xs">
          <div className="flex items-center gap-2">
            <span className="size-3 border-2 border-black bg-black inline-block" />
            <span>CUSTOMIZER.EXE // {item.name.toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center border-2 border-black bg-[#FF3366] text-white hover:bg-black"
            aria-label="Close customizer"
          >
            <X className="size-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Image Header */}
        <div className="relative h-56 w-full overflow-hidden border-b-4 border-black bg-black">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="border-2 border-black bg-[#00F0FF] px-3 py-1 font-arcade text-[10px] text-black shadow-[3px_3px_0_0_#000]">
              {item.tag || item.category.toUpperCase()}
            </span>
            <span className="border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-sm font-bold text-black shadow-[3px_3px_0_0_#000]">
              BASE: ₱{item.price}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description & Tasting Notes */}
          <div className="space-y-2">
            <p className="font-mono text-xs leading-relaxed text-black/85">
              {item.description}
            </p>
            {item.tastingNotes && item.tastingNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="border border-black bg-white px-2 py-0.5 font-arcade text-[8px] text-black"
                  >
                    ✦ {note.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Beverage Customizations */}
          {item.category !== 'pastries-kitchen' && (
            <>
              {/* Temperature Selector */}
              {item.temperature === 'both' && (
                <div>
                  <label className="font-arcade text-[10px] text-black block mb-2">
                    [SERVING TEMPERATURE]
                  </label>
                  <div className="grid grid-cols-2 gap-3 font-silk text-xs">
                    <button
                      type="button"
                      onClick={() => setTemperature('iced')}
                      className={`neo-btn flex items-center justify-center gap-2 p-3 ${
                        temperature === 'iced'
                          ? 'bg-[#00F0FF] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      <Snowflake className="size-4 text-sky-700" />
                      ICED [CRYSTAL CUBE]
                    </button>
                    <button
                      type="button"
                      onClick={() => setTemperature('hot')}
                      className={`neo-btn flex items-center justify-center gap-2 p-3 ${
                        temperature === 'hot'
                          ? 'bg-[#FF8A00] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      <Flame className="size-4 text-amber-800" />
                      HOT [65°C MICROFOAM]
                    </button>
                  </div>
                </div>
              )}

              {/* Sweetness Selector */}
              <div>
                <label className="font-arcade text-[10px] text-black block mb-2">
                  [SWEETNESS LEVEL]
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 font-silk text-[11px]">
                  {['100% Standard', '75% Less Sweet', '50% Mild', 'Sugar-Free'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSweetness(lvl)}
                      className={`neo-btn p-2 text-center ${
                        sweetness === lvl
                          ? 'bg-[#FFE600] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milk Option */}
              <div>
                <label className="font-arcade text-[10px] text-black block mb-2">
                  [CHOICE OF MILK]
                </label>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { label: 'Fresh Whole Milk', extra: 0 },
                    { label: 'Oat Milk (Barista Blend)', extra: 35 },
                    { label: 'Almond Milk', extra: 35 },
                  ].map((m) => (
                    <button
                      key={m.label}
                      type="button"
                      onClick={() => setMilk(m.label)}
                      className={`neo-btn flex w-full items-center justify-between p-3 ${
                        milk === m.label
                          ? 'bg-[#A3E635] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="font-arcade text-[10px]">
                        {m.extra === 0 ? '[INCLUDED]' : `+₱${m.extra}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="font-arcade text-[10px] text-black block mb-2">
                  [ARTISANAL ADD-ONS]
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {extrasList.map((extra) => {
                    const isChecked = selectedExtras.includes(extra.name)
                    return (
                      <button
                        key={extra.name}
                        type="button"
                        onClick={() => toggleExtra(extra.name)}
                        className={`neo-btn flex items-center justify-between p-2.5 text-left ${
                          isChecked
                            ? 'bg-[#D8B4FE] text-black font-bold'
                            : 'bg-white text-black'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`size-3.5 border-2 border-black flex items-center justify-center ${isChecked ? 'bg-black text-white' : 'bg-white'}`}>
                            {isChecked && <Check className="size-2.5 stroke-[4]" />}
                          </span>
                          <span className="text-[11px] leading-tight">{extra.name}</span>
                        </span>
                        <span className="font-arcade text-[9px]">+₱{extra.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Quantity & Add to Cart Footer */}
          <div className="pt-4 border-t-4 border-black flex items-center justify-between gap-4">
            <div className="flex items-center border-3 border-black bg-white p-1 shadow-[3px_3px_0_0_#000]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex size-8 items-center justify-center border-2 border-black bg-[#FFE600] font-arcade text-sm font-bold text-black"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center font-arcade font-bold text-xs text-black">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex size-8 items-center justify-center border-2 border-black bg-[#FFE600] font-arcade text-sm font-bold text-black"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="neo-btn flex-1 flex items-center justify-between bg-[#FFE600] px-5 py-3.5 text-black"
            >
              <span className="font-arcade text-[10px] tracking-wider">
                [+] ADD TO TRAY
              </span>
              <span className="font-arcade text-sm font-bold bg-black text-[#FFE600] px-2 py-0.5 border border-black">
                ₱{totalPrice}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
