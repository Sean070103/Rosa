'use client'

import { useState } from 'react'
import { X, Trash2, ShoppingBag, ArrowRight, Check, Copy, Coffee, Sparkles, MapPin, Building2 } from 'lucide-react'
import { CartItem, BranchId } from '@/lib/types'
import { BRANCH_CONFIG } from '@/lib/admin-data'

interface TastingTrayDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  onClearTray: () => void
  selectedBranch?: BranchId
  onSelectBranch?: (branch: BranchId) => void
}

export function TastingTrayDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
  selectedBranch: initialBranch = 'lake',
  onSelectBranch,
}: TastingTrayDrawerProps) {
  const [branch, setBranch] = useState<BranchId>(initialBranch)
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeaway'>('dine-in')
  const [tableNumber, setTableNumber] = useState('Veranda Table 4')
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('RD-482')
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const branchMeta = BRANCH_CONFIG[branch]
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleBranchChange = (newBranch: BranchId) => {
    setBranch(newBranch)
    if (onSelectBranch) onSelectBranch(newBranch)
    if (newBranch === 'niugan') {
      setTableNumber('Study Pod #2')
    } else {
      setTableNumber('Veranda Table 4')
    }
  }

  const handlePlaceOrder = () => {
    const prefix = branch === 'niugan' ? 'RD-NGN' : 'RD-LKE'
    const randomTicket = `${prefix}-${Math.floor(100 + Math.random() * 900)}`
    setTicketNumber(randomTicket)
    setIsOrderPlaced(true)
  }

  const copyOrderSummary = () => {
    const text = `🌊 ROSA DOSE [${branchMeta.shortName}]
TICKET #${ticketNumber}
📍 ${branchMeta.name}
${branchMeta.address}
🍽️ SERVICE: ${diningMode.toUpperCase()} (${diningMode === 'dine-in' ? tableNumber : 'Takeaway / To-Go'})
================================
${items.map((i) => `[${i.quantity}x] ${i.item.name} (${i.customizationSummary}) = ₱${i.totalPrice}`).join('\n')}
================================
TOTAL DUE: ₱${subtotal}
☕ Show this ticket to the ${branch === 'niugan' ? 'Niugan Downtown' : 'Lakefront'} barista counter!`

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="absolute inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md border-l-2 border-[#1A3B2F] bg-[#FAF4E8] text-[#341F14] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b-2 border-[#1A3B2F]/20 bg-[#1A3B2F] text-[#FAF4E8] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="size-2.5 rounded-full bg-[#FBE48A] animate-pulse" />
              <div>
                <span className="font-editorial text-lg font-bold text-[#FBE48A]">
                  Tasting Tray
                </span>
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white font-mono">
                  {totalItemCount} ITEMS
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close tray"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isOrderPlaced ? (
              /* Receipt Ticket State */
              <div className="space-y-5 text-center animate-in zoom-in-95 duration-150">
                <div className="rounded-2xl border-2 border-[#1A3B2F] bg-[#1A3B2F] p-4 text-[#FAF4E8] shadow-md">
                  <p className="text-xs font-bold text-[#FBE48A] uppercase tracking-wider">
                    ★ ORDER READY FOR BARISTA COUNTER ★
                  </p>
                  <p className="font-editorial text-3xl font-black mt-1 text-white">
                    {ticketNumber}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#FBE48A]">
                    <MapPin className="size-3" />
                    <span>{branchMeta.name}</span>
                  </div>
                </div>

                {/* Thermal Ticket Slip */}
                <div className="rounded-2xl border-2 border-[#1A3B2F]/20 bg-white p-5 text-left font-mono text-xs shadow-md space-y-3">
                  <div className="border-b border-dashed border-[#1A3B2F]/30 pb-3 text-center">
                    <p className="font-editorial text-xl font-bold tracking-tight text-[#1A3B2F]">ROSA DOSE</p>
                    <p className="text-[10px] font-bold text-[#D25427] uppercase mt-0.5">
                      {branchMeta.shortName}
                    </p>
                    <p className="text-[9px] text-[#341F14]/70 mt-0.5">{branchMeta.address}</p>
                    <p className="text-[10px] font-sans font-bold text-[#1A3B2F] mt-1.5 bg-[#FAF4E8] py-1 rounded">
                      {diningMode.toUpperCase()} · {diningMode === 'dine-in' ? tableNumber : 'TAKEAWAY / TO-GO'}
                    </p>
                  </div>

                  <div className="space-y-2 py-1">
                    {items.map((cartItem) => (
                      <div key={cartItem.id} className="flex justify-between items-start border-b border-black/5 pb-1">
                        <div>
                          <p className="font-bold text-[#1A3B2F]">{cartItem.quantity}x {cartItem.item.name}</p>
                          <p className="text-[10px] text-black/60 font-mono">{cartItem.customizationSummary}</p>
                        </div>
                        <span className="font-bold text-[#1A3B2F]">₱{cartItem.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-[#1A3B2F]/30 pt-2 flex justify-between font-bold text-sm text-[#1A3B2F]">
                    <span>TOTAL DUE:</span>
                    <span className="bg-[#FBE48A] px-2 py-0.5 rounded">₱{subtotal}</span>
                  </div>

                  <div className="pt-2 text-center text-[9px] text-black/60 border-t border-dashed border-black/10">
                    <p>Show this screen or copied slip to the barista counter at {branchMeta.shortName}.</p>
                    <p className="font-bold text-[#1A3B2F] mt-0.5">Freshly brewed upon counter presentation!</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs font-bold">
                  <button
                    onClick={copyOrderSummary}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FBE48A] p-3 text-[#1A3B2F] hover:bg-white transition-all shadow-xs"
                  >
                    {copied ? <Check className="size-4 stroke-[2.5]" /> : <Copy className="size-4" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Ticket Text'}</span>
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A3B2F] text-white p-3 hover:bg-[#D25427] transition-all"
                  >
                    Start New Order
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              /* Empty State */
              <div className="rounded-3xl border-2 border-dashed border-[#1A3B2F]/20 bg-white p-8 text-center my-8 space-y-3">
                <div className="mx-auto size-14 rounded-2xl bg-[#FBE48A] flex items-center justify-center text-[#1A3B2F] shadow-xs">
                  <ShoppingBag className="size-7" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#1A3B2F]">
                  Your Tray is Empty.
                </h3>
                <p className="text-xs text-[#341F14]/70 leading-relaxed max-w-xs mx-auto">
                  Browse our specialty drinks, single origin pour-overs, or artisan bakes to begin crafting your order.
                </p>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-[#1A3B2F] px-5 py-2.5 text-xs font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              /* Items & Ordering Setup */
              <>
                {/* BRANCH SELECTION CARD */}
                <div className="rounded-2xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 shadow-xs space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D25427] block">
                    1. Select Cafe Branch for Pickup / Dining
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleBranchChange('lake')}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                        branch === 'lake'
                          ? 'border-[#1A3B2F] bg-[#1A3B2F] text-[#FAF4E8]'
                          : 'border-[#1A3B2F]/15 bg-[#FAF4E8] text-[#1A3B2F] hover:border-[#1A3B2F]'
                      }`}
                    >
                      <p className="font-editorial text-xs font-bold flex items-center gap-1">
                        <span>🌊 Lakefront</span>
                      </p>
                      <p className="text-[9px] opacity-80 mt-0.5">Waterfront Bay · Resort</p>
                      <span className="text-[8px] font-mono block mt-1 opacity-70">Open: 10AM - 1AM</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBranchChange('niugan')}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                        branch === 'niugan'
                          ? 'border-[#1A3B2F] bg-[#1A3B2F] text-[#FAF4E8]'
                          : 'border-[#1A3B2F]/15 bg-[#FAF4E8] text-[#1A3B2F] hover:border-[#1A3B2F]'
                      }`}
                    >
                      <p className="font-editorial text-xs font-bold flex items-center gap-1">
                        <span>🌿 Niugan</span>
                      </p>
                      <p className="text-[9px] opacity-80 mt-0.5">Downtown · Study Hub</p>
                      <span className="text-[8px] font-mono block mt-1 opacity-70">Open: 7AM - 11PM</span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/70 block px-1">
                    2. Tray Items ({items.length})
                  </span>
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.id}
                      className="flex gap-3 rounded-2xl border border-[#1A3B2F]/20 bg-white p-3 shadow-xs"
                    >
                      <div className="size-16 shrink-0 rounded-xl border border-[#1A3B2F]/20 overflow-hidden bg-black">
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-editorial text-sm font-bold text-[#1A3B2F] truncate">
                            {cartItem.item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(cartItem.id)}
                            className="text-[#341F14]/40 hover:text-red-600 transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#341F14]/65 font-mono truncate mt-0.5">
                          {cartItem.customizationSummary}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-[#1A3B2F]/20 bg-[#FAF4E8]">
                            <button
                              onClick={() => onUpdateQuantity(cartItem.id, -1)}
                              className="size-5 flex items-center justify-center text-xs font-bold text-[#1A3B2F] hover:bg-neutral-200"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-[10px] font-mono font-bold">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(cartItem.id, 1)}
                              className="size-5 flex items-center justify-center text-xs font-bold text-[#1A3B2F] hover:bg-neutral-200"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#1A3B2F]">
                            ₱{cartItem.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Style & Seating */}
                <div className="rounded-2xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D25427] block">
                    3. Service Mode
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      onClick={() => setDiningMode('dine-in')}
                      className={`py-2 text-center rounded-xl border transition-all ${
                        diningMode === 'dine-in'
                          ? 'border-[#1A3B2F] bg-[#1A3B2F] text-[#FAF4E8]'
                          : 'border-[#1A3B2F]/20 bg-[#FAF4E8] text-[#1A3B2F]'
                      }`}
                    >
                      Dine-In (Table)
                    </button>
                    <button
                      onClick={() => setDiningMode('takeaway')}
                      className={`py-2 text-center rounded-xl border transition-all ${
                        diningMode === 'takeaway'
                          ? 'border-[#1A3B2F] bg-[#1A3B2F] text-[#FAF4E8]'
                          : 'border-[#1A3B2F]/20 bg-[#FAF4E8] text-[#1A3B2F]'
                      }`}
                    >
                      Takeaway / To-Go
                    </button>
                  </div>
                  {diningMode === 'dine-in' && (
                    <div className="pt-1">
                      <label className="text-[10px] font-bold text-[#1A3B2F]/70 block mb-1">
                        Table or Area Name:
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder={branch === 'niugan' ? 'e.g. Study Pod 2, Main Hall' : 'e.g. Veranda Table 4, Poolside'}
                        className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/60 px-3.5 py-1.5 text-xs text-[#341F14] focus:border-[#D25427] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer calculation */}
          {!isOrderPlaced && items.length > 0 && (
            <div className="border-t-2 border-[#1A3B2F]/20 bg-white p-5 space-y-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-[#1A3B2F]">Subtotal Due:</span>
                  <span className="block text-[10px] text-[#1A3B2F]/60">Pick up at {branchMeta.shortName}</span>
                </div>
                <span className="font-mono text-2xl font-black text-[#1A3B2F]">
                  ₱{subtotal}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D25427] py-3.5 text-xs font-bold text-white hover:bg-[#B8431C] transition-all shadow-md"
              >
                <span>Generate Ticket for {branch === 'niugan' ? 'Niugan Branch' : 'Lakefront Branch'}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
