'use client'

import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  UtensilsCrossed,
  Phone,
  Mail,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Printer,
  Edit2,
  Check,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { Reservation, ReservationStatus, TODAY, UserRole, FloorTable } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface ReservationsModuleProps {
  currentRole: UserRole
  onOpenCustomerBooking: () => void
  onNavigateToFloor: () => void
}

export function ReservationsModule({
  currentRole,
  onOpenCustomerBooking,
  onNavigateToFloor,
}: ReservationsModuleProps) {
  const {
    reservations,
    tables,
    employees,
    createReservation,
    updateReservationStatus,
    seatReservation,
    recommendTableForReservation,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>(TODAY)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>('list')

  // Selected reservation details modal / drawer
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [confirmedReservationData, setConfirmedReservationData] = useState<Reservation | null>(null)

  // Direct Staff Booking Modal State
  const [isStaffBookingModalOpen, setIsStaffBookingModalOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState<{
    customerName: string
    customerPhone: string
    customerEmail: string
    guestCount: number
    date: string
    timeSlot: string
    durationMinutes: number
    tableId: string
    diningArea: string
    specialRequests: string
    occasion: string
  }>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    guestCount: 2,
    date: TODAY,
    timeSlot: '18:30',
    durationMinutes: 90,
    tableId: '',
    diningArea: 'Waterfront Veranda',
    specialRequests: '',
    occasion: 'Casual Dining',
  })

  // Time Slots Available
  const standardTimeSlots = [
    '11:30', '12:00', '12:30', '13:00', '13:30',
    '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ]

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesDate = viewMode === 'timeline' ? r.date === dateFilter : true
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerPhone.includes(searchQuery) ||
      (r.tableName && r.tableName.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesDate && matchesSearch
  })

  // Status Badge Helper
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Seated':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Checked In':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'Cancelled':
      case 'No Show':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  // Handle staff booking creation with conflict detection
  const handleCreateStaffBooking = (e: React.FormEvent) => {
    e.preventDefault()

    // Automatic table recommendation if no table selected
    let assignedTable = tables.find((t) => t.id === bookingForm.tableId)
    if (!assignedTable) {
      const rec = recommendTableForReservation(bookingForm.guestCount, bookingForm.date, bookingForm.timeSlot)
      if (rec) assignedTable = rec
    }

    const res = createReservation({
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail || 'walkin@customer.com',
      guestCount: bookingForm.guestCount,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      durationMinutes: bookingForm.durationMinutes,
      tableId: assignedTable?.id,
      tableName: assignedTable?.tableNumber,
      diningArea: assignedTable?.diningArea || bookingForm.diningArea,
      specialRequests: bookingForm.specialRequests,
      occasion: bookingForm.occasion,
    })

    if (!res.success) {
      toast('Double Booking Conflict', res.error, 'error')
    } else if (res.reservation) {
      toast('Reservation Confirmed', `Booked Table ${res.reservation.tableName || 'TBD'} for ${res.reservation.customerName}`, 'success')
      setConfirmedReservationData(res.reservation)
      setIsConfirmationModalOpen(true)
      setIsStaffBookingModalOpen(false)
    }
  }

  const handleSeatGuests = (res: Reservation) => {
    seatReservation(res.id)
    toast('Guests Seated', `Seated ${res.customerName} at Table ${res.tableName}. Table marked occupied!`, 'success')
  }

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager'

  return (
    <div className="space-y-6">
      {/* Header Banner (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Table Reservations & Bookings</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  GUESTS 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Real-time table booking calendar, conflict prevention, guest party sizing, and seamless table seating.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCustomerBooking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Customer Portal</span>
          </button>

          <button
            onClick={() => setIsStaffBookingModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#22C55E] hover:bg-[#16A34A] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Filters (Neo-Brutalist) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-3 border-black p-4 rounded-3xl text-xs shadow-[4px_4px_0px_0px_#000]">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-black absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-xs font-bold text-black placeholder:text-neutral-500 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border-2 border-black rounded-2xl px-3 py-1.5 text-xs font-black text-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Seated">Seated</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>

        {/* View Modes */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#FAF8F5] border-2 border-black p-1 rounded-2xl shadow-[2px_2px_0px_0px_#000]">
            {(['list', 'timeline', 'calendar'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                  viewMode === mode ? 'bg-[#FF5500] text-white shadow-[1px_1px_0px_0px_#000]' : 'text-neutral-700 hover:text-black'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODE 1: LIST VIEW (Neo-Brutalist + Rounded-3xl) */}
      {viewMode === 'list' && (
        <div className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#000]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-black uppercase font-black text-[10px] border-b-2 border-black">
                <tr>
                  <th className="p-3.5">Guest Name & Details</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5 text-center">Party Size</th>
                  <th className="p-3.5">Assigned Table</th>
                  <th className="p-3.5">Occasion / Requests</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#94A3B8]">
                      No reservations found matching the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-[#EA580C]">
                            {r.customerName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#172033]">{r.customerName}</p>
                            <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#94A3B8]" />
                              <span>{r.customerPhone}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-[#172033] font-mono">{r.date}</p>
                        <p className="text-[11px] text-[#64748B] font-mono">{r.timeSlot} ({r.durationMinutes}m)</p>
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold text-[#172033]">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          <Users className="w-3 h-3 text-[#EA580C]" />
                          <span>{r.guestCount}</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        {r.tableName ? (
                          <div>
                            <span className="font-mono font-bold text-emerald-700">
                              Table {r.tableName}
                            </span>
                            <span className="block text-[10px] text-[#64748B]">{r.diningArea}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-mono">Unassigned</span>
                        )}
                      </td>

                      <td className="p-3.5 text-[#64748B] max-w-xs">
                        <span className="text-xs font-semibold text-[#172033]">{r.occasion || 'General Dining'}</span>
                        {r.specialRequests && (
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                            &ldquo;{r.specialRequests}&rdquo;
                          </p>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${getStatusBadge(r.status)}`}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status === 'Confirmed' && (
                            <button
                              onClick={() => handleSeatGuests(r)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                              title="Seat guests at assigned table"
                            >
                              Seat Guests
                            </button>
                          )}

                          {r.status === 'Pending' && isManagerOrAdmin && (
                            <button
                              onClick={() => {
                                updateReservationStatus(r.id, 'Confirmed')
                                toast('Reservation Approved', `Approved reservation for ${r.customerName}`, 'success')
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer shadow-2xs"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedRes(r)
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#172033] text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 2: TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Daily Service Timeline for {dateFilter}</h3>
              <p className="text-xs text-[#64748B]">Visual schedule of bookings mapped across evening dinner seatings.</p>
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#172033] focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          <div className="space-y-3">
            {standardTimeSlots.map((slot) => {
              const slotBookings = reservations.filter((r) => r.date === dateFilter && r.timeSlot === slot && r.status !== 'Cancelled')

              return (
                <div key={slot} className="flex items-start gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="w-16 shrink-0 font-mono font-bold text-sm text-[#EA580C] pt-1">
                    {slot}
                  </div>

                  <div className="flex-1 flex flex-wrap gap-2">
                    {slotBookings.length === 0 ? (
                      <span className="text-xs text-[#94A3B8] italic py-1">All tables available for seating</span>
                    ) : (
                      slotBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedRes(b)}
                          className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#EA580C] cursor-pointer text-xs space-y-0.5 shadow-2xs transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#172033]">{b.customerName}</span>
                            <span className="text-[10px] font-mono text-[#EA580C]">({b.guestCount} guests)</span>
                          </div>
                          <p className="text-[10px] text-emerald-700 font-mono font-semibold">Table {b.tableName || 'TBD'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODE 3: CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm text-center space-y-4">
          <p className="text-xs text-[#64748B]">Select a day in November 2026 to view bookings</p>
          <div className="grid grid-cols-7 gap-2.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const dNum = i + 1
              const dStr = `2026-11-${String(dNum).padStart(2, '0')}`
              const dayRes = reservations.filter((r) => r.date === dStr && r.status !== 'Cancelled')
              const isToday = dStr === TODAY

              return (
                <div
                  key={dStr}
                  onClick={() => {
                    setDateFilter(dStr)
                    setViewMode('timeline')
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isToday ? 'bg-orange-50 border-[#EA580C] shadow-2xs' : 'bg-white border-[#E2E8F0] hover:border-[#EA580C] hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className={`text-xs font-bold ${isToday ? 'text-[#EA580C]' : 'text-[#172033]'}`}>{dNum}</span>
                    {dayRes.length > 0 && (
                      <span className="text-[10px] px-1.5 rounded-full bg-[#EA580C] text-white font-bold">
                        {dayRes.length}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    {dayRes.length > 0 ? `${dayRes.reduce((s, r) => s + r.guestCount, 0)} guests` : 'Open'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODAL: STAFF DIRECT RESERVATION BOOKING */}
      {isStaffBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Create Table Reservation</h3>
                <p className="text-[11px] text-[#64748B]">System validates against table double-booking and checks party capacities.</p>
              </div>
              <button onClick={() => setIsStaffBookingModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateStaffBooking} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atty. Manuel Soriano"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+63 917 000 0000"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Time Slot</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                  >
                    {standardTimeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Guest Count</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={bookingForm.guestCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestCount: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono font-bold focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Select Specific Table or Auto-Assign</label>
                <select
                  value={bookingForm.tableId}
                  onChange={(e) => setBookingForm({ ...bookingForm, tableId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                >
                  <option value="">✨ Auto-Recommend Best Fit Table</option>
                  {tables.map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      Table {tbl.tableNumber} ({tbl.diningArea} - Cap: {tbl.capacity} • {tbl.shape})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Occasion / Special Requests</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday dinner, high chair needed, window table"
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffBookingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP RECEIPT */}
      {isConfirmationModalOpen && confirmedReservationData && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-200 rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#172033]">Reservation Confirmed!</h3>
              <p className="text-[#64748B] text-xs mt-0.5">Booking reference code generated</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Reference:</span>
                <span className="text-emerald-700 font-bold">{confirmedReservationData.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Guest:</span>
                <span className="text-[#172033] font-bold">{confirmedReservationData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Time:</span>
                <span className="text-[#172033]">{confirmedReservationData.date} @ {confirmedReservationData.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Table:</span>
                <span className="text-[#EA580C] font-bold">Table {confirmedReservationData.tableName} ({confirmedReservationData.diningArea})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Party Size:</span>
                <span className="text-[#172033]">{confirmedReservationData.guestCount} guests</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESERVATION DETAIL DRAWER */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">{selectedRes.customerName}</h3>
                <p className="text-[11px] text-[#64748B]">Booking ID: {selectedRes.id}</p>
              </div>
              <button onClick={() => setSelectedRes(null)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B]">Status:</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${getStatusBadge(selectedRes.status)}`}>
                  {selectedRes.status}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B]">Time & Date:</span>
                <span className="text-[#172033] font-mono">{selectedRes.date} at {selectedRes.timeSlot}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B]">Party Size:</span>
                <span className="text-[#172033] font-mono font-bold">{selectedRes.guestCount} Guests</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B]">Assigned Table:</span>
                <span className="text-emerald-700 font-mono font-bold">
                  {selectedRes.tableName ? `Table ${selectedRes.tableName}` : 'None'} ({selectedRes.diningArea})
                </span>
              </div>

              {selectedRes.specialRequests && (
                <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]">
                  <p className="font-semibold text-[#172033] mb-0.5">Special Requests:</p>
                  <p className="italic">&ldquo;{selectedRes.specialRequests}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Status Change Quick Actions */}
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              <p className="text-[10px] text-[#64748B] font-bold uppercase">Update Status:</p>
              <div className="grid grid-cols-3 gap-2">
                {(['Confirmed', 'Checked In', 'Seated', 'Completed', 'Cancelled', 'No Show'] as ReservationStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateReservationStatus(selectedRes.id, st)
                      setSelectedRes({ ...selectedRes, status: st })
                      toast('Status Updated', `Reservation marked as ${st}`, 'info')
                    }}
                    className={`py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-colors cursor-pointer ${
                      selectedRes.status === st
                        ? 'bg-orange-50 text-[#EA580C] border-orange-300'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRes(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
