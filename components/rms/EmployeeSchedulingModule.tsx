'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
  UserCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  Edit2,
  LogIn,
  LogOut,
  AlertCircle,
  Info,
  Check,
  ShieldAlert,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { Shift, ShiftType, TODAY, UserRole, Employee } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface EmployeeSchedulingModuleProps {
  currentRole: UserRole
}

export function EmployeeSchedulingModule({ currentRole }: EmployeeSchedulingModuleProps) {
  const {
    employees,
    shifts,
    scheduleRequests,
    createShift,
    updateShift,
    deleteShift,
    submitScheduleRequest,
    approveScheduleRequest,
    rejectScheduleRequest,
    clockInOut,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Views & Filters
  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [selectedDate, setSelectedDate] = useState<string>(TODAY)
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'calendar' | 'my-shifts' | 'requests' | 'staff-hours'>('calendar')

  // Logged-in employee simulator for employee role
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('emp-3') // Default to Carlos Mendoza (Lead Server)
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId) || employees[0]

  // Modals state
  const [isNewShiftModalOpen, setIsNewShiftModalOpen] = useState(false)
  const [isSubmitRequestModalOpen, setIsSubmitRequestModalOpen] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)

  // Shift Form State
  const [shiftForm, setShiftForm] = useState<{
    employeeId: string
    date: string
    shiftType: ShiftType
    section: string
    notes: string
  }>({
    employeeId: employees[0]?.id || '',
    date: TODAY,
    shiftType: 'Morning',
    section: 'Main Dining Room',
    notes: '',
  })

  // Request Form State
  const [requestForm, setRequestForm] = useState<{
    type: 'preference' | 'change' | 'swap'
    requestedDate: string
    shiftType: ShiftType
    swapWithEmployeeId: string
    reason: string
  }>({
    type: 'preference',
    requestedDate: TODAY,
    shiftType: 'Afternoon',
    swapWithEmployeeId: employees.find((e) => e.id !== activeEmployeeId)?.id || '',
    reason: '',
  })

  // Calculate current week days (7 days around selectedDate)
  const weekDays = useMemo(() => {
    const curr = new Date(selectedDate)
    const dayOfWeek = curr.getDay() // 0 = Sun
    const firstDay = new Date(curr)
    firstDay.setDate(curr.getDate() - dayOfWeek + 1) // start Monday

    const days: string[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(firstDay)
      d.setDate(firstDay.getDate() + i)
      days.push(d.toISOString().substring(0, 10))
    }
    return days
  }, [selectedDate])

  // Shift type time map
  const shiftTimes: Record<ShiftType, { start: string; end: string; hours: number; color: string; badge: string }> = {
    Morning: { start: '07:00', end: '15:00', hours: 8, color: 'bg-amber-50 text-amber-700 border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    Afternoon: { start: '11:00', end: '19:00', hours: 8, color: 'bg-sky-50 text-sky-700 border-sky-200', badge: 'bg-sky-100 text-sky-800' },
    Evening: { start: '16:00', end: '00:00', hours: 8, color: 'bg-purple-50 text-purple-700 border-purple-200', badge: 'bg-purple-100 text-purple-800' },
    Closing: { start: '19:00', end: '02:00', hours: 7, color: 'bg-rose-50 text-rose-700 border-rose-200', badge: 'bg-rose-100 text-rose-800' },
  }

  // Understaffed Shifts Detector: flags if a shift has < 2 staff or no supervisor
  const getUnderstaffedWarning = (date: string, shiftType: ShiftType) => {
    const matchingShifts = shifts.filter((s) => s.date === date && s.shiftType === shiftType && s.status === 'approved')
    if (matchingShifts.length === 0) return 'No staff scheduled'
    if (matchingShifts.length < 2) return `Understaffed: only ${matchingShifts.length} staff scheduled`
    return null
  }

  const handleCreateShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emp = employees.find((e) => e.id === shiftForm.employeeId)
    if (!emp) return

    const timeConfig = shiftTimes[shiftForm.shiftType]
    const res = createShift({
      employeeId: emp.id,
      employeeName: emp.name,
      role: emp.role,
      date: shiftForm.date,
      shiftType: shiftForm.shiftType,
      startTime: timeConfig.start,
      endTime: timeConfig.end,
      hours: timeConfig.hours,
      diningSection: shiftForm.section,
      status: 'approved',
      notes: shiftForm.notes,
    })

    if (!res.success) {
      toast('Schedule Conflict Error', res.error, 'error')
    } else {
      toast('Shift Assigned', `Assigned ${shiftForm.shiftType} shift to ${emp.name}`, 'success')
      setIsNewShiftModalOpen(false)
    }
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    submitScheduleRequest({
      employeeId: activeEmployee.id,
      employeeName: activeEmployee.name,
      type: requestForm.type,
      requestedDate: requestForm.requestedDate,
      shiftType: requestForm.shiftType,
      swapWithEmployeeId: requestForm.type === 'swap' ? requestForm.swapWithEmployeeId : undefined,
      swapWithEmployeeName:
        requestForm.type === 'swap'
          ? employees.find((e) => e.id === requestForm.swapWithEmployeeId)?.name
          : undefined,
      reason: requestForm.reason || 'Requested preference for schedule balance',
    })

    toast('Request Submitted', 'Your schedule request has been sent for manager approval.', 'success')
    setIsSubmitRequestModalOpen(false)
  }

  const handleClockToggle = () => {
    const res = clockInOut(activeEmployee.id)
    if (res.status === 'clocked-in') {
      toast('Clock In Successful', `${activeEmployee.name} clocked in at ${res.time}`, 'success')
    } else {
      toast('Clock Out Successful', `${activeEmployee.name} clocked out at ${res.time}`, 'info')
    }
  }

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager'

  return (
    <div className="space-y-6">
      {/* Header & Controls (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black text-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Employee Scheduling & Shifts</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  ROSTER 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Weekly and monthly interactive roster with conflict detection, shift swaps, and working hour limits.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Employee Switcher */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border-2 border-black px-3.5 py-1.5 rounded-2xl text-xs shadow-[2px_2px_0px_0px_#000]">
            <span className="text-neutral-600 font-bold">Staff View:</span>
            <select
              value={activeEmployeeId}
              onChange={(e) => setActiveEmployeeId(e.target.value)}
              className="bg-transparent text-xs font-black text-black focus:outline-none cursor-pointer"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Clock In / Out Button */}
          <button
            onClick={handleClockToggle}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer ${
              activeEmployee.status === 'on-duty'
                ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                : 'bg-[#22C55E] text-black hover:bg-[#16A34A]'
            }`}
          >
            {activeEmployee.status === 'on-duty' ? (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Clock Out ({activeEmployee.name.split(' ')[0]})</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Clock In ({activeEmployee.name.split(' ')[0]})</span>
              </>
            )}
          </button>

          {/* Submit Schedule Request (For Employees) */}
          <button
            onClick={() => {
              setRequestForm((prev) => ({ ...prev, type: 'preference' }))
              setIsSubmitRequestModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Clock className="w-3.5 h-3.5 text-black" />
            <span>Preferences</span>
          </button>

          {/* Request Shift Swap */}
          <button
            onClick={() => {
              setRequestForm((prev) => ({ ...prev, type: 'swap' }))
              setIsSubmitRequestModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#60A5FA] hover:bg-[#3B82F6] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Shift</span>
          </button>

          {/* Assign Shift (Manager only) */}
          {isManagerOrAdmin && (
            <button
              onClick={() => setIsNewShiftModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FF5500] hover:bg-[#E04B00] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Shift</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs & View Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black/10 pb-3 gap-3">
        {/* Left Sub-Tabs (Smooth Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl sm:rounded-2xl border-2 border-black transition-all cursor-pointer shrink-0 ${
              activeTab === 'calendar' ? 'bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
            }`}
          >
            Interactive Calendar
          </button>
          <button
            onClick={() => setActiveTab('my-shifts')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl sm:rounded-2xl border-2 border-black transition-all cursor-pointer shrink-0 ${
              activeTab === 'my-shifts' ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
            }`}
          >
            My Shifts ({activeEmployee.name.split(' ')[0]})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl sm:rounded-2xl border-2 border-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'requests' ? 'bg-[#22C55E] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Shift Requests</span>
            {scheduleRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-white font-mono text-[9px] flex items-center justify-center font-black">
                {scheduleRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('staff-hours')}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl sm:rounded-2xl border-2 border-black transition-all cursor-pointer shrink-0 ${
              activeTab === 'staff-hours' ? 'bg-[#60A5FA] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
            }`}
          >
            Staff Hours & Limits
          </button>
        </div>

        {/* Right View Selectors & Date Navigator */}
        {activeTab === 'calendar' && (
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            <div className="flex items-center bg-[#FAF8F5] border-2 border-black p-0.5 rounded-xl sm:rounded-2xl text-xs shadow-[2px_2px_0px_0px_#000]">
              {(['daily', 'weekly', 'monthly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all cursor-pointer ${
                    calendarView === view ? 'bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000]' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] border-2 border-black p-0.5 rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_#000]">
              <button
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() - (calendarView === 'weekly' ? 7 : 1))
                  setSelectedDate(d.toISOString().substring(0, 10))
                }}
                className="p-1 rounded-lg text-black hover:bg-neutral-200 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] sm:text-xs font-mono font-black text-black px-1.5">{selectedDate}</span>
              <button
                onClick={() => {
                  const d = new Date(selectedDate)
                  d.setDate(d.getDate() + (calendarView === 'weekly' ? 7 : 1))
                  setSelectedDate(d.toISOString().substring(0, 10))
                }}
                className="p-1 rounded-lg text-black hover:bg-neutral-200 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: INTERACTIVE CALENDAR (Neo-Brutalist + Rounded-3xl) */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {calendarView === 'weekly' && (
            <p className="sm:hidden text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <span>← Swipe horizontally to view full weekly roster →</span>
            </p>
          )}
          <div className="bg-white border-3 border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
            {/* Week Header & Columns */}
            {calendarView === 'weekly' && (
              <div className="overflow-x-auto">
                <div className="min-w-[1120px]">
                  <div className="grid grid-cols-7 border-b-2 border-black text-center bg-[#FAF8F5]">
                    {weekDays.map((dayStr) => {
                      const d = new Date(dayStr)
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
                      const dayNum = d.getDate()
                      const isToday = dayStr === TODAY

                      return (
                        <div
                          key={dayStr}
                          className={`p-3 border-r-2 border-black last:border-r-0 ${
                            isToday ? 'bg-[#FFE600]/40' : ''
                          }`}
                        >
                          <p className="text-[11px] font-black uppercase tracking-wider text-black">{dayName}</p>
                          <p className={`text-base font-black font-mono mt-0.5 ${isToday ? 'text-[#FF5500]' : 'text-black'}`}>
                            {dayNum}
                          </p>
                          {isToday && (
                            <span className="text-[9px] font-black text-black bg-[#FFE600] px-1.5 py-0.2 rounded-full border border-black uppercase tracking-wider inline-block mt-0.5">Today</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Weekly Columns (Clean Light Grid) */}
                  <div className="grid grid-cols-7 min-h-[500px] divide-x-2 divide-black">
                {weekDays.map((dayStr) => {
                  const dayShifts = shifts.filter((s) => s.date === dayStr)

                  return (
                    <div key={dayStr} className="p-2 space-y-2 bg-white">
                      {/* Understaffed indicator badge */}
                      {(['Morning', 'Afternoon', 'Evening'] as ShiftType[]).map((st) => {
                        const warn = getUnderstaffedWarning(dayStr, st)
                        return warn ? (
                          <div
                            key={st}
                            className="text-[9px] p-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-1"
                            title={warn}
                          >
                            <AlertTriangle className="w-2.5 h-2.5 text-red-500 shrink-0" />
                            <span className="truncate">{st}: {warn}</span>
                          </div>
                        ) : null
                      })}

                      {dayShifts.length === 0 ? (
                        <div className="text-center py-10 text-[11px] text-[#94A3B8]">
                          No shifts
                        </div>
                      ) : (
                        dayShifts.map((shift) => {
                          const emp = employees.find((e) => e.id === shift.employeeId)
                          const isApproved = shift.status === 'approved'
                          const isCompleted = shift.status === 'completed'

                          return (
                            <div
                              key={shift.id}
                              className={`p-2.5 rounded-xl border transition-all text-xs relative group ${
                                isCompleted
                                  ? 'bg-emerald-50/70 border-emerald-200 text-[#172033]'
                                  : isApproved
                                  ? 'bg-white border-[#E2E8F0] hover:border-[#EA580C] text-[#172033] shadow-xs'
                                  : 'bg-amber-50/70 border-amber-200 text-[#172033]'
                              }`}
                            >
                              {/* Status badge row */}
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border ${
                                  isCompleted
                                    ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                                    : isApproved
                                    ? 'text-blue-800 bg-blue-100 border-blue-300'
                                    : 'text-amber-800 bg-amber-100 border-amber-300'
                                }`}>
                                  {shift.status}
                                </span>
                                <span className="text-[10px] font-mono text-neutral-500 font-bold">{shift.hours}h</span>
                              </div>

                              {/* Employee Name */}
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: emp?.colorCode || '#EA580C' }}
                                />
                                <p className="font-black truncate text-xs text-black">{shift.employeeName}</p>
                              </div>

                              <p className="text-[10px] text-[#64748B] mt-1 font-mono">
                                {shift.shiftType} • {shift.startTime} - {shift.endTime} ({shift.hours}h)
                              </p>

                              <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                                📍 {shift.diningSection}
                              </p>

                              {shift.checkInTime && (
                                <p className="text-[9px] text-emerald-600 mt-0.5 font-mono font-semibold">
                                  ✓ In: {shift.checkInTime} {shift.checkOutTime ? `• Out: ${shift.checkOutTime}` : ''}
                                </p>
                              )}

                              {/* Manager Quick Actions on hover */}
                              {isManagerOrAdmin && (
                                <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      deleteShift(shift.id)
                                      toast('Shift Removed', `Removed shift for ${shift.employeeName}`, 'info')
                                    }}
                                    className="text-[10px] text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                                    title="Delete Shift"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}

                      {/* Click to add shift on this day for managers */}
                      {isManagerOrAdmin && (
                        <button
                          onClick={() => {
                            setShiftForm((prev) => ({ ...prev, date: dayStr }))
                            setIsNewShiftModalOpen(true)
                          }}
                          className="w-full py-1 text-[10px] text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] rounded-lg border border-dashed border-[#CBD5E1] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Assign</span>
                        </button>
                      )}
                    </div>
                  )
                })}
                  </div>
                </div>
              </div>
            )}

            {/* Daily View Day Title */}
            {calendarView === 'daily' && (
              <div className="p-4 bg-[#FAF8F5] border-b-2 border-black flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-black">
                    Daily Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <p className="text-xs font-medium text-neutral-600">All shifts across Morning, Afternoon, Evening, and Closing shifts</p>
                </div>
                {isManagerOrAdmin && (
                  <button
                    onClick={() => {
                      setShiftForm((prev) => ({ ...prev, date: selectedDate }))
                      setIsNewShiftModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22C55E] text-black text-xs font-black uppercase border border-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Shift to This Day</span>
                  </button>
                )}
              </div>
            )}

            {/* Daily View Content */}
            {calendarView === 'daily' && (
              <div className="p-5 space-y-4 bg-white">
                {(['Morning', 'Afternoon', 'Evening', 'Closing'] as ShiftType[]).map((st) => {
                  const matching = shifts.filter((s) => s.date === selectedDate && s.shiftType === st)
                  const time = shiftTimes[st]

                  return (
                    <div key={st} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${time.color}`}>
                            {st} Shift
                          </span>
                          <span className="text-xs text-[#64748B] font-mono">
                            {time.start} - {time.end} ({time.hours} hrs)
                          </span>
                        </div>
                        <span className="text-xs text-[#172033] font-bold">
                          {matching.length} Staff Assigned
                        </span>
                      </div>

                      {matching.length === 0 ? (
                        <p className="text-xs text-[#94A3B8] italic">No employees scheduled for this shift time.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {matching.map((s) => (
                            <div key={s.id} className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-xs">
                              <div>
                                <p className="font-bold text-sm text-[#172033]">{s.employeeName}</p>
                                <p className="text-xs text-[#64748B]">{s.role} • {s.diningSection}</p>
                                {s.checkInTime && (
                                  <p className="text-[10px] text-emerald-600 font-mono mt-0.5 font-semibold">
                                    Clocked in: {s.checkInTime}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {s.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Monthly View Grid */}
            {calendarView === 'monthly' && (
              <div className="overflow-x-auto">
                <div className="min-w-[700px] p-5 text-center space-y-4 bg-white">
                  <p className="text-xs text-[#64748B]">Displaying November 2026 Monthly Overview</p>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const dayNum = i + 1
                      const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`
                      const dayShifts = shifts.filter((s) => s.date === dateStr)
                      const isToday = dateStr === TODAY

                      return (
                        <div
                          key={dateStr}
                          onClick={() => {
                            setSelectedDate(dateStr)
                            setCalendarView('daily')
                          }}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                            isToday
                              ? 'bg-orange-50 border-[#EA580C]'
                              : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#EA580C]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold font-mono ${isToday ? 'text-[#EA580C]' : 'text-[#172033]'}`}>
                              {dayNum}
                            </span>
                            {dayShifts.length > 0 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#EA580C] text-white font-bold">
                                {dayShifts.length}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-[10px] text-[#64748B] truncate">
                            {dayShifts.length > 0 ? `${dayShifts.length} shifts` : 'Empty'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY UPCOMING SHIFTS */}
      {activeTab === 'my-shifts' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <img src={activeEmployee.avatar} alt={activeEmployee.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#EA580C]" />
                <div>
                  <h3 className="font-bold text-base text-[#172033]">{activeEmployee.name}</h3>
                  <p className="text-xs text-[#64748B]">{activeEmployee.role} • {activeEmployee.diningSection}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#94A3B8]">Weekly Hours: </span>
                  <span className="font-bold text-[#EA580C]">{activeEmployee.currentWeeklyHours}h / {activeEmployee.maxWeeklyHours}h max</span>
                </div>
                <div>
                  <span className="text-[#94A3B8]">Status: </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    activeEmployee.status === 'on-duty' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeEmployee.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Shifts List */}
            <div className="mt-5 space-y-3">
              <h4 className="font-bold text-sm text-[#172033]">Your Assigned & Preferred Shifts</h4>
              {shifts.filter((s) => s.employeeId === activeEmployee.id).length === 0 ? (
                <p className="text-xs text-[#94A3B8] py-4">No upcoming shifts assigned yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {shifts
                    .filter((s) => s.employeeId === activeEmployee.id)
                    .map((shift) => (
                      <div
                        key={shift.id}
                        className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#172033]">{shift.date}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-[#EA580C]">
                              {shift.shiftType}
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1 font-mono">
                            {shift.startTime} - {shift.endTime} ({shift.hours} hours)
                          </p>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            Section: {shift.diningSection}
                          </p>
                          {shift.checkInTime && (
                            <p className="text-xs text-emerald-600 font-mono mt-1 font-semibold">
                              Clocked in: {shift.checkInTime}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            shift.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {shift.status.toUpperCase()}
                          </span>

                          <button
                            onClick={() => {
                              setRequestForm((prev) => ({
                                ...prev,
                                type: 'swap',
                                requestedDate: shift.date,
                                shiftType: shift.shiftType,
                              }))
                              setIsSubmitRequestModalOpen(true)
                            }}
                            className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Request Swap</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHIFT REQUESTS & APPROVALS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Schedule Change & Swap Requests</h3>
                <p className="text-xs text-[#64748B]">Employees submit preference or swap requests for manager authorization.</p>
              </div>
              <button
                onClick={() => setIsSubmitRequestModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + New Request
              </button>
            </div>

            <div className="space-y-3">
              {scheduleRequests.length === 0 ? (
                <p className="text-xs text-[#94A3B8] py-8 text-center">No schedule requests submitted.</p>
              ) : (
                scheduleRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#172033]">{req.employeeName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {req.type}
                        </span>
                        <span className="text-xs text-[#64748B] font-mono">
                          {req.requestedDate} ({req.shiftType})
                        </span>
                      </div>
                      <p className="text-xs text-[#172033] mt-1 font-medium">
                        Reason: &ldquo;{req.reason}&rdquo;
                      </p>
                      {req.swapWithEmployeeName && (
                        <p className="text-xs text-amber-700 mt-0.5">
                          Swapping with: {req.swapWithEmployeeName}
                        </p>
                      )}
                      <p className="text-[10px] text-[#94A3B8] mt-1 font-mono">Submitted: {req.createdAt}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {req.status === 'pending' ? (
                        isManagerOrAdmin ? (
                          <>
                            <button
                              onClick={() => {
                                approveScheduleRequest(req.id)
                                toast('Request Approved', `Approved request from ${req.employeeName}`, 'success')
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Reason for declining this request:', 'Shift already fully staffed')
                                if (reason) {
                                  rejectScheduleRequest(req.id, reason)
                                  toast('Request Declined', `Declined request from ${req.employeeName}`, 'info')
                                }
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-mono font-bold text-amber-700 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                            PENDING MANAGER REVIEW
                          </span>
                        )
                      ) : (
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {req.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STAFF HOURS & LIMITS */}
      {activeTab === 'staff-hours' && (
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
          <div className="pb-3 border-b border-[#F1F5F9] mb-4">
            <h3 className="font-bold text-base text-[#172033]">Employee Workload & Maximum Working Hours</h3>
            <p className="text-xs text-[#64748B]">System enforces maximum hours per week to prevent staff fatigue and overtime breach.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {employees.map((emp) => {
              const percent = Math.min(100, Math.round((emp.currentWeeklyHours / emp.maxWeeklyHours) * 100))
              const isOvertime = emp.currentWeeklyHours >= emp.maxWeeklyHours

              return (
                <div key={emp.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      <div>
                        <p className="font-bold text-xs text-[#172033]">{emp.name}</p>
                        <p className="text-[10px] text-[#64748B]">{emp.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      emp.status === 'on-duty' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Weekly Assigned</span>
                      <span className={`font-bold ${isOvertime ? 'text-red-600' : 'text-[#172033]'}`}>
                        {emp.currentWeeklyHours}h / {emp.maxWeeklyHours}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Rate: ₱{emp.hourlyRate}/hr</span>
                    <span>Section: {emp.diningSection.split(' ')[0]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN SHIFT (Clean White Modal) */}
      {isNewShiftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-base text-[#172033]">Assign Employee Shift</h3>
              <button
                onClick={() => setIsNewShiftModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#172033] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShiftSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#172033] mb-1">Select Employee</label>
                <select
                  value={shiftForm.employeeId}
                  onChange={(e) => setShiftForm({ ...shiftForm, employeeId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role} - currently {emp.currentWeeklyHours}h/{emp.maxWeeklyHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Date</label>
                  <input
                    type="date"
                    value={shiftForm.date}
                    onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Shift Type</label>
                  <select
                    value={shiftForm.shiftType}
                    onChange={(e) => setShiftForm({ ...shiftForm, shiftType: e.target.value as ShiftType })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="Morning">Morning (07:00 - 15:00)</option>
                    <option value="Afternoon">Afternoon (11:00 - 19:00)</option>
                    <option value="Evening">Evening (16:00 - 00:00)</option>
                    <option value="Closing">Closing (19:00 - 02:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172033] mb-1">Dining Section</label>
                <select
                  value={shiftForm.section}
                  onChange={(e) => setShiftForm({ ...shiftForm, section: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="Waterfront Veranda">Waterfront Veranda</option>
                  <option value="Main Dining Room">Main Dining Room</option>
                  <option value="Alfresco Patio">Alfresco Patio</option>
                  <option value="VIP Private Lounge">VIP Private Lounge</option>
                  <option value="Artisan Espresso Bar">Artisan Espresso Bar</option>
                  <option value="Main Dining Kitchen">Main Dining Kitchen</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#172033] mb-1">Assignment Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Lead supervisor for dinner rush"
                  value={shiftForm.notes}
                  onChange={(e) => setShiftForm({ ...shiftForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>The system automatically checks for overlapping shifts and weekly hour ceilings.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewShiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Assign Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT SCHEDULE REQUEST (EMPLOYEE) */}
      {isSubmitRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Submit Schedule Preference or Swap</h3>
                <p className="text-[11px] text-[#64748B]">Submitted as: {activeEmployee.name} ({activeEmployee.role})</p>
              </div>
              <button
                onClick={() => setIsSubmitRequestModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#172033] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#172033] mb-1">Request Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['preference', 'change', 'swap'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRequestForm({ ...requestForm, type: t })}
                      className={`py-2 rounded-xl border text-xs font-bold capitalize transition-colors cursor-pointer ${
                        requestForm.type === t
                          ? 'bg-[#EA580C] text-white border-[#EA580C]'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Requested Date</label>
                  <input
                    type="date"
                    value={requestForm.requestedDate}
                    onChange={(e) => setRequestForm({ ...requestForm, requestedDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172033] mb-1">Shift Time</label>
                  <select
                    value={requestForm.shiftType}
                    onChange={(e) => setRequestForm({ ...requestForm, shiftType: e.target.value as ShiftType })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Closing">Closing</option>
                  </select>
                </div>
              </div>

              {requestForm.type === 'swap' && (
                <div>
                  <label className="block font-bold text-[#172033] mb-1">Swap With Colleague</label>
                  <select
                    value={requestForm.swapWithEmployeeId}
                    onChange={(e) => setRequestForm({ ...requestForm, swapWithEmployeeId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                  >
                    {employees
                      .filter((e) => e.id !== activeEmployee.id)
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#172033] mb-1">Reason / Note for Manager</label>
                <textarea
                  rows={3}
                  placeholder="Explain the reason for this schedule request..."
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:border-[#EA580C] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
