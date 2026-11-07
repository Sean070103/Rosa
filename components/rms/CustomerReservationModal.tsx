'use client'

import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
  Sparkles,
  UtensilsCrossed,
  X,
  Phone,
  Mail,
  User,
  Heart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { FloorTable, Reservation, TODAY } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface CustomerReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomerReservationModal({ isOpen, onClose }: CustomerReservationModalProps) {
  const { tables, reservations, createReservation, recommendTableForReservation } = useRestaurantDb()
  const { toast } = useToast()

  const [step, setStep] = useState<1 | 2 | 3>(1) // 1: Date/Time/Guests, 2: Table Selection, 3: Details & Confirmation

  const [date, setDate] = useState<string>(TODAY)
  const [timeSlot, setTimeSlot] = useState<string>('18:30')
  const [guestCount, setGuestCount] = useState<number>(2)
  const [selectedArea, setSelectedArea] = useState<string>('Waterfront Veranda')
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [customerPhone, setCustomerPhone] = useState<string>('')
  const [customerEmail, setCustomerEmail] = useState<string>('')
  const [specialRequests, setSpecialRequests] = useState<string>('')
  const [occasion, setOccasion] = useState<string>('Dinner')
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null)

  if (!isOpen) return null

  // Time Slots
  const availableSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ]

  // Filter available tables for the chosen date/time
  const reservedTableIds = new Set(
    reservations
      .filter((r) => r.date === date && r.timeSlot === timeSlot && r.status !== 'Cancelled' && r.tableId)
      .map((r) => r.tableId)
  )

  const candidateTables = tables.filter(
    (t) =>
      !reservedTableIds.has(t.id) &&
      t.status !== 'unavailable' &&
      t.capacity >= guestCount &&
      (selectedArea === 'all' || t.diningArea === selectedArea)
  )

  const recommendedTable = recommendTableForReservation(guestCount, date, timeSlot)

  const handleNextToSeating = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTableId && recommendedTable) {
      setSelectedTableId(recommendedTable.id)
    }
    setStep(2)
  }

  const handleNextToGuestInfo = () => {
    if (!selectedTableId && candidateTables[0]) {
      setSelectedTableId(candidateTables[0].id)
    }
    setStep(3)
  }

  const handleFinalBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const tableChosen = tables.find((t) => t.id === selectedTableId) || recommendedTable

    const res = createReservation({
      customerName,
      customerPhone,
      customerEmail,
      guestCount,
      date,
      timeSlot,
      durationMinutes: 120,
      tableId: tableChosen?.id,
      tableName: tableChosen?.tableNumber,
      diningArea: tableChosen?.diningArea || selectedArea,
      specialRequests,
      occasion,
    })

    if (!res.success) {
      toast('Booking Conflict', res.error, 'error')
    } else if (res.reservation) {
      setConfirmedReservation(res.reservation)
      toast('Reservation Confirmed', `Table ${res.reservation.tableName} is reserved for ${customerName}!`, 'success')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-3 border-black rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-[8px_8px_0px_0px_#000] text-black relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-black hover:bg-neutral-100 p-1.5 rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedReservation ? (
          /* Confirmation Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#22C55E] text-black flex items-center justify-center mx-auto border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="font-black text-2xl text-black">Table Reserved Successfully!</h3>
            <p className="text-xs font-medium text-neutral-600">We look forward to hosting you at Rosa Lake Bistro.</p>

            <div className="p-5 rounded-3xl bg-[#FAF8F5] border-2 border-black text-left space-y-2.5 font-mono text-xs shadow-[3px_3px_0px_0px_#000]">
              <div className="flex justify-between">
                <span className="text-neutral-600 font-bold">Booking Ref:</span>
                <span className="text-black font-black">{confirmedReservation.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-bold">Guest Name:</span>
                <span className="text-black font-black">{confirmedReservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-bold">Date & Time:</span>
                <span className="text-black font-bold">{confirmedReservation.date} @ {confirmedReservation.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-bold">Table Reserved:</span>
                <span className="text-[#FF5500] font-black">
                  Table {confirmedReservation.tableName} ({confirmedReservation.diningArea})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-bold">Party Size:</span>
                <span className="text-black font-bold">{confirmedReservation.guestCount} Guests</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FACC15] text-black font-black uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            {/* Step Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-black uppercase text-neutral-500">
                <span className={step >= 1 ? 'text-[#FF5500]' : ''}>1. Party & Time</span>
                <span className={step >= 2 ? 'text-[#FF5500]' : ''}>2. Table Seating</span>
                <span className={step >= 3 ? 'text-[#FF5500]' : ''}>3. Guest Details</span>
              </div>
              <div className="w-full bg-[#FAF8F5] h-2.5 rounded-full border-2 border-black overflow-hidden p-0.5 shadow-[1px_1px_0px_0px_#000]">
                <div
                  className="bg-[#FF5500] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: PARTY & TIME */}
            {step === 1 && (
              <form onSubmit={handleNextToSeating} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-xl text-[#172033]">Reserve a Table</h3>
                  <p className="text-[#64748B] mt-0.5">Select your dining date, preferred seating time, and party size.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#172033] mb-1">Reservation Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#172033] mb-1">Number of Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value) || 2)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1.5">Select Seating Time Slot</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = timeSlot === slot.replace(' PM', '').replace(' AM', '')
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot.replace(' PM', '').replace(' AM', ''))}
                          className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50 text-[#EA580C] border-orange-300'
                              : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#EA580C]'
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <span>Select Table Seating</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: TABLE SELECTION & RECOMMENDATION */}
            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-xl text-[#172033]">Choose Your Table</h3>
                  <p className="text-[#64748B] mt-0.5">
                    We found {candidateTables.length} tables matching your party of {guestCount} guests on {date} at {timeSlot}.
                  </p>
                </div>

                {/* Recommended Badge */}
                {recommendedTable && (
                  <div
                    onClick={() => setSelectedTableId(recommendedTable.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedTableId === recommendedTable.id
                        ? 'bg-orange-50 border-[#EA580C] shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#EA580C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-sm text-[#172033]">
                          Recommended: Table {recommendedTable.tableNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Best Fit ({recommendedTable.capacity} Seats)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">{recommendedTable.diningArea} • {recommendedTable.shape} seating</p>
                  </div>
                )}

                {/* Available Tables Grid */}
                <div className="space-y-2">
                  <p className="font-semibold text-[#172033]">Or Select a Specific Table:</p>
                  <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {candidateTables.map((tbl) => (
                      <div
                        key={tbl.id}
                        onClick={() => setSelectedTableId(tbl.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedTableId === tbl.id
                            ? 'bg-orange-50 border-[#EA580C] shadow-2xs'
                            : 'bg-white border-[#E2E8F0] hover:border-[#EA580C]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#172033]">Table {tbl.tableNumber}</span>
                          <span className="text-[10px] font-mono text-[#64748B]">{tbl.capacity} seats</span>
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-1 truncate">{tbl.diningArea}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextToGuestInfo}
                    className="flex-1 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Guest Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: GUEST INFORMATION */}
            {step === 3 && (
              <form onSubmit={handleFinalBooking} className="space-y-3.5 text-xs">
                <div>
                  <h3 className="font-bold text-xl text-[#172033]">Guest Details & Special Requests</h3>
                  <p className="text-[#64748B] mt-0.5">Enter your contact info to receive immediate reservation confirmation.</p>
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Clara Santos"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#172033] mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="+63 917 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#172033] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="maria@example.ph"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="Dinner">Casual Dinner</option>
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Anniversary">Anniversary Date</option>
                    <option value="Business Meeting">Business Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Special Requests / Dietary Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Window lake view, high chair needed, celebrating anniversary..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold shadow-sm cursor-pointer"
                  >
                    Confirm & Reserve Table
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
