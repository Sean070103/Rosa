'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  ArrowRightLeft,
  Send,
  User,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Info,
  Check,
  AlertCircle,
  LayoutList,
  CalendarDays,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { useToast, ToastProvider } from '@/components/rms/RmsToast'
import { ShiftType, TODAY } from '@/lib/db/restaurant-db'

// ─────────────────────────────────────────────
// SHIFT CONFIG
// ─────────────────────────────────────────────
const SHIFT_CONFIG: Record<
  ShiftType,
  { label: string; time: string; hours: number; icon: React.ReactNode; bg: string; border: string; text: string; badge: string }
> = {
  Morning: {
    label: 'Morning',
    time: '07:00 – 15:00',
    hours: 8,
    icon: <Sunrise className="size-5" />,
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  Afternoon: {
    label: 'Afternoon',
    time: '11:00 – 19:00',
    hours: 8,
    icon: <Sun className="size-5" />,
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    text: 'text-sky-800',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
  },
  Evening: {
    label: 'Evening',
    time: '16:00 – 00:00',
    hours: 8,
    icon: <Sunset className="size-5" />,
    bg: 'bg-violet-50',
    border: 'border-violet-300',
    text: 'text-violet-800',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  Closing: {
    label: 'Closing',
    time: '19:00 – 02:00',
    hours: 7,
    icon: <Moon className="size-5" />,
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-800',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
  },
}

// ─────────────────────────────────────────────
// MONTH CALENDAR HELPERS
// ─────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday-first (0=Mon)
}

// ─────────────────────────────────────────────
// INNER PAGE (needs toast hook so must be child of ToastProvider)
// ─────────────────────────────────────────────
function SchedPageInner() {
  const {
    employees,
    shifts,
    scheduleRequests,
    submitScheduleRequest,
    clockInOut,
  } = useRestaurantDb()
  const { toast } = useToast()

  // Active staff identity
  const [activeEmployeeId, setActiveEmployeeId] = useState('emp-3')
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0]

  // ── View tabs ──
  const [activeTab, setActiveTab] = useState<'pick' | 'my-schedule' | 'requests'>('pick')

  // ── Calendar navigation ──
  const todayDate = new Date(TODAY)
  const [calYear, setCalYear] = useState(todayDate.getFullYear())
  const [calMonth, setCalMonth] = useState(todayDate.getMonth())

  // ── Availability Picker state ──
  // Map of "YYYY-MM-DD" → ShiftType[]
  const [pickedSlots, setPickedSlots] = useState<Record<string, ShiftType[]>>({})
  const [submitNote, setSubmitNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // ── Swap request ──
  const [swapTargetShiftId, setSwapTargetShiftId] = useState('')
  const [swapWithEmployeeId, setSwapWithEmployeeId] = useState('')
  const [swapReason, setSwapReason] = useState('')
  const [isSwapOpen, setIsSwapOpen] = useState(false)

  // ─────── Calendar data ────────
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDayOffset = getFirstDayOfWeek(calYear, calMonth)

  const monthStr = new Date(calYear, calMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1) }
    else setCalMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1) }
    else setCalMonth((m) => m + 1)
  }

  // Build date string
  const toDateStr = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // Toggle a slot on/off
  const toggleSlot = useCallback((dateStr: string, slot: ShiftType) => {
    setPickedSlots((prev) => {
      const existing = prev[dateStr] || []
      if (existing.includes(slot)) {
        const next = existing.filter((s) => s !== slot)
        if (next.length === 0) {
          const copy = { ...prev }
          delete copy[dateStr]
          return copy
        }
        return { ...prev, [dateStr]: next }
      }
      return { ...prev, [dateStr]: [...existing, slot] }
    })
  }, [])

  // Clear a full day
  const clearDay = (dateStr: string) =>
    setPickedSlots((prev) => {
      const copy = { ...prev }
      delete copy[dateStr]
      return copy
    })

  // Total submitted dates
  const pickedCount = Object.keys(pickedSlots).length
  const pickedSlotsTotal = Object.values(pickedSlots).reduce((a, b) => a + b.length, 0)

  // My shifts (this employee)
  const myShifts = useMemo(
    () => shifts.filter((s) => s.employeeId === activeEmployee.id).sort((a, b) => a.date.localeCompare(b.date)),
    [shifts, activeEmployee.id]
  )
  const upcomingShifts = myShifts.filter((s) => s.date >= TODAY)
  const pastShifts = myShifts.filter((s) => s.date < TODAY)

  // My requests
  const myRequests = useMemo(
    () => scheduleRequests.filter((r) => r.employeeId === activeEmployee.id).sort((a, b) => b.requestedDate.localeCompare(a.requestedDate)),
    [scheduleRequests, activeEmployee.id]
  )

  // Weekly hours
  const weeklyHoursUsed = activeEmployee.currentWeeklyHours
  const weeklyHoursMax = activeEmployee.maxWeeklyHours
  const hoursPercent = Math.min(100, Math.round((weeklyHoursUsed / weeklyHoursMax) * 100))

  // ─── Submit availability ───
  const handleSubmitAvailability = () => {
    if (pickedCount === 0) {
      toast('No Dates Selected', 'Please pick at least one date and shift slot.', 'warning')
      return
    }

    let count = 0
    Object.entries(pickedSlots).forEach(([date, slots]) => {
      slots.forEach((slot) => {
        submitScheduleRequest({
          employeeId: activeEmployee.id,
          employeeName: activeEmployee.name,
          type: 'preference',
          requestedDate: date,
          shiftType: slot,
          reason: submitNote || 'Staff availability preference submitted via Staff Portal.',
        })
        count++
      })
    })

    toast('Availability Submitted', `${count} shift preference(s) sent for manager review.`, 'success')
    setPickedSlots({})
    setSubmitNote('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setActiveTab('requests')
  }

  // ─── Clock In/Out ───
  const handleClock = () => {
    const res = clockInOut(activeEmployee.id)
    if (res.status === 'clocked-in') {
      toast('Clocked In ✓', `${activeEmployee.name} — ${res.time}`, 'success')
    } else {
      toast('Clocked Out', `${activeEmployee.name} — ${res.time}`, 'info')
    }
  }

  // ─── Swap submit ───
  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetShift = shifts.find((s) => s.id === swapTargetShiftId)
    const swapWith = employees.find((e) => e.id === swapWithEmployeeId)
    if (!targetShift || !swapWith) return

    submitScheduleRequest({
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      type: 'swap',
      requestedDate: targetShift.date,
      shiftType: targetShift.shiftType,
      swapWithEmployeeId: swapWith.id,
      swapWithEmployeeName: swapWith.name,
      reason: swapReason || 'Shift swap requested via Staff Portal.',
    })

    toast('Swap Request Sent', `Swap with ${swapWith.name} submitted for approval.`, 'success')
    setIsSwapOpen(false)
    setSwapReason('')
    setActiveTab('requests')
  }

  const DAYS_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="min-h-screen bg-[#FAF8F5] selection:bg-[#FFE600] selection:text-black">
      {/* ═══════════════════════════════════════════
          STAFF PORTAL HEADER
         ═══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b-3 border-black shadow-[0_2px_0_0_#000]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center justify-center size-9 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FAF8F5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="h-5 w-px bg-black/20" />
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-2xl bg-[#FF5500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] text-white shrink-0">
                <Calendar className="size-4" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-black leading-tight">Staff Scheduling Portal</p>
                <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">RORA Dose · Waterfront</p>
              </div>
            </div>
          </div>

          {/* Center: Staff Identity Switcher */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] max-w-xs w-full">
              <User className="size-3.5 text-neutral-500 shrink-0" />
              <select
                value={activeEmployeeId}
                onChange={(e) => setActiveEmployeeId(e.target.value)}
                className="bg-transparent text-xs font-black text-black focus:outline-none cursor-pointer w-full"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} · {emp.role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Clock + Status */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClock}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                activeEmployee.status === 'on-duty'
                  ? 'bg-[#EF4444] text-white'
                  : 'bg-[#22C55E] text-black'
              }`}
            >
              {activeEmployee.status === 'on-duty' ? (
                <><LogOut className="size-3.5" /><span className="hidden sm:inline">Clock Out</span></>
              ) : (
                <><LogIn className="size-3.5" /><span className="hidden sm:inline">Clock In</span></>
              )}
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <span className="size-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase text-black">Portal Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── STAFF IDENTITY CARD ── */}
        <div className="rounded-3xl border-3 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeEmployee.avatar}
              alt={activeEmployee.name}
              className="size-14 rounded-2xl border-2 border-black object-cover shadow-[2px_2px_0px_0px_#000]"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl font-black text-black">{activeEmployee.name}</h1>
                <span
                  className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_#000] ${
                    activeEmployee.status === 'on-duty'
                      ? 'bg-[#22C55E] text-black'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {activeEmployee.status === 'on-duty' ? '● ON DUTY' : '○ OFF DUTY'}
                </span>
              </div>
              <p className="font-mono text-xs text-neutral-600 mt-0.5">{activeEmployee.role} · {activeEmployee.diningSection}</p>
            </div>
          </div>

          {/* Weekly hours bar */}
          <div className="w-full sm:w-56 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs font-black text-black">
              <span>WEEKLY HOURS</span>
              <span className={hoursPercent >= 90 ? 'text-red-600' : 'text-black'}>
                {weeklyHoursUsed}h / {weeklyHoursMax}h
              </span>
            </div>
            <div className="h-3 w-full rounded-full border-2 border-black bg-[#FAF8F5] overflow-hidden shadow-[1px_1px_0px_0px_#000]">
              <div
                className={`h-full rounded-full transition-all ${
                  hoursPercent >= 90 ? 'bg-red-500' : hoursPercent >= 70 ? 'bg-amber-400' : 'bg-[#22C55E]'
                }`}
                style={{ width: `${hoursPercent}%` }}
              />
            </div>
            <p className="font-mono text-[10px] text-neutral-500">₱{activeEmployee.hourlyRate}/hr · {weeklyHoursMax - weeklyHoursUsed}h remaining</p>
          </div>
        </div>

        {/* ── NAV TABS ── */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'pick', label: '📅 Pick My Availability', active: 'bg-[#FF5500] text-white' },
            { id: 'my-schedule', label: '📋 My Shifts', active: 'bg-[#FFE600] text-black' },
            { id: 'requests', label: `📨 My Requests${myRequests.filter(r => r.status === 'pending').length > 0 ? ` (${myRequests.filter(r => r.status === 'pending').length})` : ''}`, active: 'bg-[#22C55E] text-black' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-2xl border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                activeTab === tab.id ? tab.active : 'bg-white text-black hover:bg-[#FAF8F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Swap Shift Button */}
          <button
            onClick={() => setIsSwapOpen(true)}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 border-black bg-[#60A5FA] text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <ArrowRightLeft className="size-3.5" />
            <span>Request Swap</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════
            TAB 1: AVAILABILITY PICKER
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'pick' && (
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

            {/* LEFT: Month Calendar + Slot Picker */}
            <div className="rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
              {/* Calendar Header */}
              <div className="flex items-center justify-between border-b-3 border-black px-5 py-4 bg-[#FAF8F5]">
                <button
                  onClick={prevMonth}
                  className="size-8 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-[#FAF8F5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div className="text-center">
                  <h2 className="font-serif text-xl font-black text-black">{monthStr}</h2>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">Pick your available shift slots</p>
                </div>
                <button
                  onClick={nextMonth}
                  className="size-8 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-[#FAF8F5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Shift Legend Row */}
              <div className="flex flex-wrap gap-2 px-5 py-3 border-b-2 border-black/10 bg-white">
                {(Object.keys(SHIFT_CONFIG) as ShiftType[]).map((s) => {
                  const cfg = SHIFT_CONFIG[s]
                  return (
                    <span key={s} className={`flex items-center gap-1 rounded-xl border ${cfg.border} ${cfg.badge} px-2.5 py-1 font-mono text-[10px] font-black uppercase`}>
                      {cfg.icon}
                      <span>{cfg.label}</span>
                      <span className="opacity-70">{cfg.time}</span>
                    </span>
                  )
                })}
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 border-b-2 border-black bg-[#FAF8F5]">
                {DAYS_HEADER.map((d) => (
                  <div key={d} className="text-center py-2 font-mono text-[10px] font-black uppercase text-neutral-600 border-r last:border-r-0 border-black/10">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {/* Empty offset cells */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[90px] border-b border-r border-black/10 bg-[#FAF8F5]/50" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = toDateStr(day)
                  const isToday = dateStr === TODAY
                  const isPast = dateStr < TODAY
                  const picked = pickedSlots[dateStr] || []
                  const myAssigned = shifts.filter((s) => s.employeeId === activeEmployee.id && s.date === dateStr)
                  const colIndex = (firstDayOffset + i) % 7
                  const isWeekend = colIndex === 5 || colIndex === 6

                  return (
                    <div
                      key={dateStr}
                      className={`min-h-[90px] p-2 border-b border-r border-black/10 flex flex-col gap-1 transition-colors ${
                        isPast ? 'bg-neutral-50 opacity-50' : isWeekend ? 'bg-sky-50/40' : 'bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {/* Day number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-xs font-black ${
                            isToday
                              ? 'size-6 rounded-full bg-[#FF5500] text-white flex items-center justify-center shadow-[1px_1px_0px_0px_#000]'
                              : isPast
                              ? 'text-neutral-400'
                              : 'text-black'
                          }`}
                        >
                          {day}
                        </span>
                        {picked.length > 0 && !isPast && (
                          <button
                            onClick={() => clearDay(dateStr)}
                            className="text-[9px] text-red-500 hover:text-red-700 cursor-pointer font-black"
                            title="Clear day"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Already assigned badge */}
                      {myAssigned.map((s) => (
                        <span key={s.id} className="text-[8px] font-black uppercase rounded-md border border-black/20 bg-black/5 px-1 py-0.5 text-black leading-none truncate">
                          ✓ {s.shiftType}
                        </span>
                      ))}

                      {/* Shift slot toggles */}
                      {!isPast && (
                        <div className="flex flex-col gap-0.5 mt-auto">
                          {(Object.keys(SHIFT_CONFIG) as ShiftType[]).map((slot) => {
                            const cfg = SHIFT_CONFIG[slot]
                            const isSelected = picked.includes(slot)
                            const isAlreadyAssigned = myAssigned.some((s) => s.shiftType === slot)
                            return (
                              <button
                                key={slot}
                                disabled={isAlreadyAssigned}
                                onClick={() => toggleSlot(dateStr, slot)}
                                title={`${slot} · ${cfg.time}`}
                                className={`text-[8px] font-black rounded-md px-1 py-0.5 leading-none uppercase border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                  isAlreadyAssigned
                                    ? `${cfg.badge} border-transparent`
                                    : isSelected
                                    ? `border-black ${cfg.bg} ${cfg.text} shadow-[1px_1px_0px_0px_#000]`
                                    : 'border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-500 hover:text-neutral-600'
                                }`}
                              >
                                {isAlreadyAssigned ? '✓' : isSelected ? '● ' : '○ '}{slot.slice(0, 3)}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT: Summary + Submit Panel */}
            <div className="space-y-4">
              {/* Selection Summary */}
              <div className="rounded-3xl border-3 border-black bg-white p-5 shadow-[6px_6px_0px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-serif text-lg font-black text-black">My Availability</h3>
                  <span className="font-mono text-xs font-black text-neutral-600">
                    {pickedCount} day{pickedCount !== 1 ? 's' : ''} · {pickedSlotsTotal} slot{pickedSlotsTotal !== 1 ? 's' : ''}
                  </span>
                </div>

                {pickedCount === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <CalendarDays className="size-10 mx-auto text-neutral-300" />
                    <p className="font-mono text-xs text-neutral-500 font-bold uppercase">No slots selected yet</p>
                    <p className="font-sans text-xs text-neutral-400 max-w-[200px] mx-auto">Tap the slot buttons on the calendar to mark your availability.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {Object.entries(pickedSlots)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([date, slots]) => {
                        const d = new Date(date)
                        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        return (
                          <div key={date} className="rounded-2xl border-2 border-black bg-[#FAF8F5] p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-black text-black">{label}</span>
                              <button
                                onClick={() => clearDay(date)}
                                className="text-[10px] text-red-500 hover:text-red-700 font-black cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {slots.map((slot) => {
                                const cfg = SHIFT_CONFIG[slot]
                                return (
                                  <button
                                    key={slot}
                                    onClick={() => toggleSlot(date, slot)}
                                    className={`flex items-center gap-1 rounded-xl border ${cfg.border} ${cfg.badge} px-2 py-0.5 font-mono text-[9px] font-black uppercase cursor-pointer hover:opacity-70`}
                                    title="Click to remove"
                                  >
                                    {cfg.icon}
                                    <span>{cfg.label}</span>
                                    <span className="opacity-50 text-[8px]">·{cfg.time.split(' ')[0]}</span>
                                    <XCircle className="size-2.5 ml-0.5" />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block font-mono text-[10px] font-black uppercase text-neutral-600 mb-1">Note to Manager (optional)</label>
                  <textarea
                    rows={2}
                    value={submitNote}
                    onChange={(e) => setSubmitNote(e.target.value)}
                    placeholder="e.g. Prefer morning shifts this week due to class schedule..."
                    className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2 font-sans text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  onClick={handleSubmitAvailability}
                  disabled={pickedCount === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FF5500] hover:bg-[#E04B00] text-white py-3 font-mono font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0"
                >
                  <Send className="size-4" />
                  <span>Submit {pickedSlotsTotal > 0 ? `${pickedSlotsTotal} Slot${pickedSlotsTotal > 1 ? 's' : ''}` : 'Availability'} for Approval</span>
                </button>

                {submitted && (
                  <div className="flex items-center gap-2 rounded-2xl border-2 border-[#22C55E] bg-green-50 px-3 py-2.5 text-xs font-black text-green-800">
                    <CheckCircle2 className="size-4 text-green-600 shrink-0" />
                    <span>Submitted! Manager will review and confirm your shifts.</span>
                  </div>
                )}
              </div>

              {/* Shift Key Legend Card */}
              <div className="rounded-3xl border-3 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
                <h4 className="font-mono text-xs font-black uppercase text-neutral-600 border-b border-black/10 pb-2">Shift Time Reference</h4>
                {(Object.keys(SHIFT_CONFIG) as ShiftType[]).map((s) => {
                  const cfg = SHIFT_CONFIG[s]
                  return (
                    <div key={s} className={`flex items-center justify-between rounded-xl border ${cfg.border} ${cfg.bg} px-3 py-2`}>
                      <div className="flex items-center gap-2">
                        <span className={cfg.text}>{cfg.icon}</span>
                        <span className={`font-mono text-xs font-black ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-[10px] font-bold ${cfg.text}`}>{cfg.time}</span>
                        <span className={`font-mono text-[9px] ml-1 opacity-70 ${cfg.text}`}>({cfg.hours}h)</span>
                      </div>
                    </div>
                  )
                })}
                <div className="pt-1 border-t border-black/10 space-y-1 font-mono text-[10px] text-neutral-500">
                  <p>⬤ Filled slot = your preference submitted</p>
                  <p>✓ Already assigned by manager</p>
                  <p>◯ Dashed = available to pick</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 2: MY SHIFTS
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'my-schedule' && (
          <div className="space-y-4">
            {/* Upcoming */}
            <div className="rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
              <div className="border-b-2 border-black px-5 py-4 bg-[#FAF8F5] flex items-center justify-between">
                <h3 className="font-serif text-lg font-black text-black">Upcoming Shifts</h3>
                <span className="font-mono text-xs font-black text-neutral-600">{upcomingShifts.length} scheduled</span>
              </div>
              {upcomingShifts.length === 0 ? (
                <div className="p-10 text-center">
                  <CalendarDays className="size-10 mx-auto text-neutral-300 mb-2" />
                  <p className="font-mono text-xs font-black text-neutral-500 uppercase">No upcoming shifts assigned yet</p>
                  <p className="font-sans text-xs text-neutral-400 mt-1">Submit your availability in the "Pick My Availability" tab.</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-black/10">
                  {upcomingShifts.map((shift) => {
                    const cfg = SHIFT_CONFIG[shift.shiftType]
                    const d = new Date(shift.date)
                    const isCurrentDay = shift.date === TODAY
                    return (
                      <div
                        key={shift.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 ${isCurrentDay ? 'bg-[#FFE600]/20 border-l-4 border-[#FF5500]' : 'hover:bg-[#FAF8F5]'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-2.5 shrink-0`}>
                            <span className={cfg.text}>{cfg.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif text-base font-black text-black">
                                {d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                              </span>
                              {isCurrentDay && (
                                <span className="font-mono text-[9px] font-black uppercase rounded-full bg-[#FF5500] text-white border border-black px-2 py-0.5">TODAY</span>
                              )}
                              <span className={`font-mono text-[10px] font-black uppercase rounded-xl border px-2 py-0.5 ${cfg.badge}`}>
                                {shift.status}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-neutral-600 mt-0.5">
                              {shift.shiftType} · {shift.startTime} – {shift.endTime} · {shift.hours}h
                            </p>
                            <p className="font-sans text-xs text-neutral-500 mt-0.5">📍 {shift.diningSection}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {shift.checkInTime ? (
                            <span className="font-mono text-[10px] font-black text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
                              ✓ Clocked In {shift.checkInTime}
                              {shift.checkOutTime ? ` · Out ${shift.checkOutTime}` : ''}
                            </span>
                          ) : isCurrentDay ? (
                            <button
                              onClick={handleClock}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 border-black bg-[#22C55E] text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                            >
                              <LogIn className="size-3.5" />
                              <span>Clock In Now</span>
                            </button>
                          ) : (
                            <span className="font-mono text-[10px] text-neutral-400">Not yet clocked in</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Past Shifts */}
            {pastShifts.length > 0 && (
              <div className="rounded-3xl border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="border-b-2 border-black px-5 py-4 bg-[#FAF8F5] flex items-center justify-between">
                  <h3 className="font-serif text-base font-black text-black">Past Shifts</h3>
                  <span className="font-mono text-xs text-neutral-500">{pastShifts.length} records</span>
                </div>
                <div className="divide-y divide-black/10">
                  {pastShifts.slice().reverse().slice(0, 8).map((shift) => {
                    const cfg = SHIFT_CONFIG[shift.shiftType]
                    const d = new Date(shift.date)
                    return (
                      <div key={shift.id} className="flex items-center justify-between gap-3 px-5 py-3 opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-[9px] font-black uppercase rounded-xl border px-2 py-0.5 ${cfg.badge}`}>{shift.shiftType}</span>
                          <div>
                            <span className="font-mono text-xs font-black text-black">
                              {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-500 ml-2">{shift.startTime} – {shift.endTime}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[10px] text-neutral-400">{shift.diningSection.split(' ')[0]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 3: MY REQUESTS
           ════════════════════════════════════════════════════════ */}
        {activeTab === 'requests' && (
          <div className="rounded-3xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="border-b-2 border-black px-5 py-4 bg-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif text-lg font-black text-black">My Schedule Requests</h3>
              <span className="font-mono text-xs font-black text-neutral-600">{myRequests.length} total</span>
            </div>
            {myRequests.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <LayoutList className="size-10 mx-auto text-neutral-300" />
                <p className="font-mono text-xs font-black text-neutral-500 uppercase">No requests submitted yet</p>
                <p className="font-sans text-xs text-neutral-400">Use "Pick My Availability" to submit your preferred shift dates.</p>
              </div>
            ) : (
              <div className="divide-y-2 divide-black/10">
                {myRequests.map((req) => {
                  const cfg = SHIFT_CONFIG[req.shiftType]
                  const d = new Date(req.requestedDate)
                  const statusColor =
                    req.status === 'approved'
                      ? 'bg-[#22C55E] text-black border-black'
                      : req.status === 'rejected'
                      ? 'bg-red-500 text-white border-red-700'
                      : 'bg-[#FFE600] text-black border-black'
                  return (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-[#FAF8F5]">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.bg} p-2 shrink-0`}>
                          <span className={cfg.text}>{cfg.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-sm font-black text-black">
                              {d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                            <span className={`font-mono text-[9px] font-black uppercase rounded-xl border px-2 py-0.5 ${cfg.badge}`}>
                              {req.shiftType}
                            </span>
                            <span className="font-mono text-[9px] font-black uppercase rounded-full border border-black bg-neutral-100 text-black px-2 py-0.5">
                              {req.type}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-neutral-600 mt-0.5 line-clamp-1">"{req.reason}"</p>
                          {req.swapWithEmployeeName && (
                            <p className="font-mono text-[10px] text-neutral-500 mt-0.5">
                              ↔ Swap with: {req.swapWithEmployeeName}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`shrink-0 font-mono text-[10px] font-black uppercase rounded-xl border-2 px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] ${statusColor}`}>
                        {req.status === 'pending' ? '⏳ Pending Review' : req.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════
          SWAP SHIFT MODAL
         ════════════════════════════════════════════════════════ */}
      {isSwapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border-3 border-black bg-white p-6 shadow-[10px_10px_0px_0px_#000] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h3 className="font-serif text-xl font-black text-black">Request Shift Swap</h3>
                <p className="font-mono text-[10px] text-neutral-500">As: {activeEmployee.name}</p>
              </div>
              <button
                onClick={() => setIsSwapOpen(false)}
                className="size-8 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-[#FAF8F5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <XCircle className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSwapSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-black uppercase text-neutral-600 mb-1.5">Select My Shift to Swap</label>
                <select
                  required
                  value={swapTargetShiftId}
                  onChange={(e) => setSwapTargetShiftId(e.target.value)}
                  className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs font-bold text-black focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value="">— Choose one of my upcoming shifts —</option>
                  {upcomingShifts.map((s) => {
                    const d = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    return (
                      <option key={s.id} value={s.id}>
                        {d} · {s.shiftType} ({s.startTime}–{s.endTime}) · {s.diningSection}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-black uppercase text-neutral-600 mb-1.5">Swap With Colleague</label>
                <select
                  required
                  value={swapWithEmployeeId}
                  onChange={(e) => setSwapWithEmployeeId(e.target.value)}
                  className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5 font-mono text-xs font-bold text-black focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value="">— Choose a colleague —</option>
                  {employees.filter((e) => e.id !== activeEmployee.id).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} · {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-black uppercase text-neutral-600 mb-1.5">Reason for Swap</label>
                <textarea
                  rows={3}
                  required
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="Explain why you need to swap this shift..."
                  className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5 font-sans text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-2xl border-2 border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                <Info className="size-4 text-amber-600 shrink-0" />
                <span className="font-sans">The shift swap request will be sent to your manager for approval before it takes effect.</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSwapOpen(false)}
                  className="flex-1 rounded-2xl border-2 border-black bg-[#FAF8F5] hover:bg-neutral-200 py-2.5 font-mono font-black text-xs uppercase text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-black bg-[#60A5FA] hover:bg-blue-400 text-black py-2.5 font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Submit Swap Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// EXPORTED PAGE (wraps with ToastProvider)
// ─────────────────────────────────────────────
export default function StaffSchedulePage() {
  return (
    <ToastProvider>
      <SchedPageInner />
    </ToastProvider>
  )
}
