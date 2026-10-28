'use client'

import { useState } from 'react'
import { X, Trash2, ShoppingBag, ArrowRight, Check, Copy, Coffee, Sparkles } from 'lucide-react'
import { CartItem } from '@/lib/types'

interface TastingTrayDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onClearTray: () => void
}

export function TastingTrayDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
}: TastingTrayDrawerProps) {
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeaway'>('dine-in')
  const [tableNumber, setTableNumber] = useState('Table 7 (Veranda)')
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('RD-482')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handlePlaceOrder = () => {
    const randomTicket = `RD-${Math.floor(100 + Math.random() * 900)}`
    setTicketNumber(randomTicket)
    setIsOrderPlaced(true)
  }

  const copyOrderSummary = () => {
    const text = `🌊 RORA DOSE [ORDER #${ticketNumber}]
📍 Queen Aurora Garden Resort, Cabuyao Laguna
🍽️ MODE: ${diningMode.toUpperCase()} (${diningMode === 'dine-in' ? tableNumber : 'Takeaway'})
================================
${items.map((i) => `[${i.quantity}x] ${i.item.name} (${i.customizationSummary}) = ₱${i.totalPrice}`).join('\n')}
================================
TOTAL DUE: ₱${subtotal}
☕ Please show this ticket to barista counter!`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const resetAndClose = () => {
    setIsOrderPlaced(false)
    onClearTray()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="absolute inset-y-0 right-0 flex max-w-full pl-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md border-l-4 border-black bg-[#FFFDF0] text-black shadow-[-12px_0_0_0_#000] flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b-4 border-black bg-[#FFE600] px-5 py-4 flex items-center justify-between font-arcade text-xs">
            <div className="flex items-center gap-2.5">
              <span className="size-3 border-2 border-black bg-black inline-block" />
              <span>[TASTING TRAY: {totalItemCount} ITEMS]</span>
            </div>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center border-2 border-black bg-[#FF3366] text-white hover:bg-black"
              aria-label="Close tray"
            >
              <X className="size-4 stroke-[3]" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isOrderPlaced ? (
              /* Receipt Ticket State */
              <div className="space-y-5 text-center animate-in zoom-in-95 duration-150">
                <div className="border-4 border-black bg-[#A3E635] p-3 shadow-[4px_4px_0_0_#000]">
                  <p className="font-arcade text-xs text-black">
                    ★ ORDER READY FOR COUNTER ★
                  </p>
                  <p className="font-pixel text-4xl font-bold mt-1 text-black">
                    TICKET #{ticketNumber}
                  </p>
                </div>

                {/* Neo Pixel Receipt Slip */}
                <div className="border-3 border-black bg-white p-5 text-left font-mono text-xs shadow-[6px_6px_0_0_#000] space-y-3">
                  <div className="border-b-2 border-dashed border-black pb-3 text-center">
                    <p className="font-pixel text-2xl font-bold tracking-widest text-black">RORA DOSE</p>
                    <p className="font-arcade text-[8px] text-black/70">QUEEN AURORA RESORT · CABUYAO</p>
                    <p className="font-silk text-[9px] text-[#FF5722] mt-1">
                      {diningMode.toUpperCase()} // {diningMode === 'dine-in' ? tableNumber : 'TAKEAWAY'}
                    </p>
                  </div>

                  <div className="space-y-2 py-2">
                    {items.map((cartItem) => (
                      <div key={cartItem.id} className="flex justify-between items-start border-b border-black/10 pb-1">
                        <div>
                          <p className="font-bold text-black">{cartItem.quantity}x {cartItem.item.name}</p>
                          <p className="text-[10px] text-black/60 font-mono">{cartItem.customizationSummary}</p>
                        </div>
                        <span className="font-arcade text-xs font-bold text-black">₱{cartItem.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-dashed border-black pt-3 flex justify-between font-arcade text-sm text-black">
                    <span>TOTAL</span>
                    <span className="bg-[#FFE600] px-1 border border-black">₱{subtotal}</span>
                  </div>

                  {/* Retro Barcode Motif */}
                  <div className="pt-2 text-center">
                    <p className="font-mono text-xl tracking-[0.25em] select-none text-black">
                      ||| | |||| | ||| || |||
                    </p>
                    <p className="font-arcade text-[7px] text-black/60 mt-1">
                      * THANK YOU FOR SIPPING SLOW *
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 font-arcade text-xs">
                  <button
                    onClick={copyOrderSummary}
                    className="neo-btn flex w-full items-center justify-center gap-2 bg-[#FFE600] p-3 text-black"
                  >
                    {copied ? <Check className="size-4 stroke-[3]" /> : <Copy className="size-4" />}
                    <span>{copied ? '[COPIED TO CLIPBOARD!]' : '[COPY TICKET TEXT]'}</span>
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="neo-btn flex w-full items-center justify-center gap-2 bg-black text-white p-3 hover:bg-[#FF3366]"
                  >
                    [START NEW ORDER]
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* Empty State */
              <div className="border-4 border-black bg-white p-8 text-center shadow-[6px_6px_0_0_#000] my-8">
                <div className="mx-auto size-16 border-3 border-black bg-[#FFE600] flex items-center justify-center text-black mb-3 shadow-[3px_3px_0_0_#000]">
                  <ShoppingBag className="size-8" />
                </div>
                <h3 className="font-pixel text-2xl font-bold text-black">
                  YOUR TRAY IS EMPTY.
                </h3>
                <p className="font-mono text-xs text-black/70 mt-2">
                  Browse our slow bar creations or single origins and press [+] to add.
                </p>
                <button
                  onClick={onClose}
                  className="neo-btn mt-5 bg-[#00F0FF] px-5 py-2 font-arcade text-xs text-black"
                >
                  [▶] BROWSE MENU
                </button>
              </div>
            ) : (
              /* Items List */
              <>
                <div className="space-y-3">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="flex gap-3 border-3 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]"
                    >
                      <div className="size-16 shrink-0 border-2 border-black overflow-hidden bg-black">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-pixel text-base font-bold text-black truncate leading-tight">
                            {cartItem.item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(cartItem.id)}
                            className="text-black/50 hover:text-[#FF3366] transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="font-mono text-[10px] text-black/70 truncate mt-0.5">
                          {cartItem.customizationSummary}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-black bg-[#FFFDF0]">
                            <button
                              onClick={() => onUpdateQuantity(cartItem.id, -1)}
                              className="size-5 flex items-center justify-center font-arcade text-xs font-bold text-black hover:bg-[#FFE600]"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-arcade text-[10px] font-bold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(cartItem.id, 1)}
                              className="size-5 flex items-center justify-center font-arcade text-xs font-bold text-black hover:bg-[#FFE600]"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-arcade text-xs font-bold text-black bg-[#FFE600] px-1.5 py-0.5 border border-black">
                            ₱{cartItem.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Style */}
                <div className="border-3 border-black bg-white p-3.5 shadow-[4px_4px_0_0_#000] space-y-2">
                  <span className="font-arcade text-[9px] text-black block">
                    [SERVICE STYLE]
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-silk text-xs">
                    <button
                      onClick={() => setDiningMode('dine-in')}
                      className={`neo-btn py-2 text-center ${
                        diningMode === 'dine-in'
                          ? 'bg-[#A3E635] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      VERANDA DINE-IN
                    </button>
                    <button
                      onClick={() => setDiningMode('takeaway')}
                      className={`neo-btn py-2 text-center ${
                        diningMode === 'takeaway'
                          ? 'bg-[#00F0FF] text-black font-bold'
                          : 'bg-white text-black'
                      }`}
                    >
                      TO-GO / WALK
                    </button>
                  </div>
                  {diningMode === 'dine-in' && (
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Table # or Area"
                      className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-1.5 font-mono text-xs focus:outline-none"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer calculation */}
          {!isOrderPlaced && items.length > 0 && (
            <div className="border-t-4 border-black bg-[#FFE600] p-5 space-y-3 font-mono">
              <div className="flex justify-between items-baseline">
                <span className="font-arcade text-xs text-black">TRAY TOTAL:</span>
                <span className="font-arcade text-xl font-black text-black bg-white px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_#000]">
                  ₱{subtotal}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="neo-btn w-full flex items-center justify-center gap-2 bg-[#00F0FF] py-3.5 font-arcade text-xs font-bold text-black hover:bg-black hover:text-white"
              >
                <span>[▶] GENERATE COUNTER SLIP</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
