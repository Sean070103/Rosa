'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, CheckCircle2, XCircle,
  ChevronLeft, ChevronRight, LogIn, LogOut,
  Trash2, ArrowRightLeft, Send, User,
  Sunrise, Sun, Sunset, Moon, Info,
  CalendarDays, LayoutList,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { useToast, ToastProvider } from '@/components/rms/RmsToast'
import { ShiftType, TODAY } from '@/lib/db/restaurant-db'

// ─── Shift colours & metadata ───────────────────────────────────────────────
type SCfg = { label: string; time: string; hours: number; emoji: string; bg: string; border: string; text: string; selBg: string; selBorder: string; selText: string }
const SC: Record<ShiftType, SCfg> = {
  Morning:   { label:'Morning',   time:'07:00 – 15:00', hours:8, emoji:'🌅', bg:'bg-amber-50',  border:'border-amber-200',  text:'text-amber-800',  selBg:'bg-amber-400',  selBorder:'border-amber-600',  selText:'text-white' },
  Afternoon: { label:'Afternoon', time:'11:00 – 19:00', hours:8, emoji:'☀️', bg:'bg-sky-50',    border:'border-sky-200',    text:'text-sky-800',    selBg:'bg-sky-500',    selBorder:'border-sky-700',    selText:'text-white' },
  Evening:   { label:'Evening',   time:'16:00 – 00:00', hours:8, emoji:'🌆', bg:'bg-violet-50', border:'border-violet-200', text:'text-violet-800', selBg:'bg-violet-600', selBorder:'border-violet-800', selText:'text-white' },
  Closing:   { label:'Closing',   time:'19:00 – 02:00', hours:7, emoji:'🌙', bg:'bg-rose-50',   border:'border-rose-200',   text:'text-rose-800',   selBg:'bg-rose-600',   selBorder:'border-rose-800',   selText:'text-white' },
}
const SHIFTS = Object.keys(SC) as ShiftType[]

// ─── Calendar math ───────────────────────────────────────────────────────────
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 } // Mon=0
function toISO(y: number, m: number, d: number) { return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` }
function fmt(ds: string, opts: Intl.DateTimeFormatOptions) { return new Date(ds).toLocaleDateString('en-US', opts) }

const DOW = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

// ─── Inner page ──────────────────────────────────────────────────────────────
function SchedPage() {
  const { employees, shifts, scheduleRequests, submitScheduleRequest, clockInOut } = useRestaurantDb()
  const { toast } = useToast()

  // staff identity
  const [empId, setEmpId] = useState('emp-3')
  const emp = employees.find(e => e.id === empId) || employees[0]

  // tabs
  const [tab, setTab] = useState<'pick'|'schedule'|'requests'>('pick')

  // calendar nav
  const now = new Date(TODAY)
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  // selected date for slot picking
  const [selDate, setSelDate] = useState<string | null>(null)

  // picked slots: { 'YYYY-MM-DD': ShiftType[] }
  const [picked, setPicked] = useState<Record<string, ShiftType[]>>({})

  const [note, setNote]       = useState('')
  const [submitted, setDone]  = useState(false)

  // swap modal
  const [swapOpen, setSwapOpen]   = useState(false)
  const [swapShift, setSwapShift] = useState('')
  const [swapWith,  setSwapWith]  = useState('')
  const [swapNote,  setSwapNote]  = useState('')

  // ── calendar ──
  const days    = daysInMonth(year, month)
  const offset  = firstWeekday(year, month)
  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevM = () => { if (month===0){setMonth(11);setYear(y=>y-1)} else setMonth(m=>m-1); setSelDate(null) }
  const nextM = () => { if (month===11){setMonth(0);setYear(y=>y+1)} else setMonth(m=>m+1); setSelDate(null) }

  // ── slot helpers ──
  const toggleSlot = useCallback((date: string, slot: ShiftType) => {
    setPicked(prev => {
      const cur = prev[date] || []
      const next = cur.includes(slot) ? cur.filter(s => s !== slot) : [...cur, slot]
      if (next.length === 0) { const c={...prev}; delete c[date]; return c }
      return { ...prev, [date]: next }
    })
  }, [])

  const clearDay = (date: string) => { setPicked(prev => { const c={...prev}; delete c[date]; return c }) }

  const totalDays  = Object.keys(picked).length
  const totalSlots = Object.values(picked).reduce((a,b) => a+b.length, 0)

  // ── my data ──
  const myShifts   = useMemo(() => shifts.filter(s=>s.employeeId===emp.id).sort((a,b)=>a.date.localeCompare(b.date)), [shifts, emp.id])
  const upcoming   = myShifts.filter(s=>s.date>=TODAY)
  const past       = myShifts.filter(s=>s.date<TODAY)
  const myReqs     = useMemo(() => scheduleRequests.filter(r=>r.employeeId===emp.id).sort((a,b)=>b.requestedDate.localeCompare(a.requestedDate)), [scheduleRequests, emp.id])
  const pendingN   = myReqs.filter(r=>r.status==='pending').length

  const pct = Math.min(100, Math.round((emp.currentWeeklyHours / emp.maxWeeklyHours) * 100))

  // ── actions ──
  const handleClock = () => {
    const r = clockInOut(emp.id)
    r.status==='clocked-in' ? toast('Clocked In ✓', `${emp.name} — ${r.time}`, 'success') : toast('Clocked Out', `${emp.name} — ${r.time}`, 'info')
  }

  const handleSubmit = () => {
    if (totalDays === 0) { toast('Nothing selected', 'Pick at least one shift slot on the calendar.', 'warning'); return }
    let n = 0
    Object.entries(picked).forEach(([date, slots]) =>
      slots.forEach(slot => { submitScheduleRequest({ employeeId:emp.id, employeeName:emp.name, type:'preference', requestedDate:date, shiftType:slot, reason: note||'Availability submitted via Staff Portal.' }); n++ })
    )
    toast('Submitted ✓', `${n} shift preference${n>1?'s':''} sent to manager.`, 'success')
    setPicked({}); setNote(''); setSelDate(null); setDone(true)
    setTimeout(() => setDone(false), 3500)
    setTab('requests')
  }

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault()
    const target = shifts.find(s=>s.id===swapShift)
    const peer   = employees.find(e=>e.id===swapWith)
    if (!target||!peer) return
    submitScheduleRequest({ employeeId:emp.id, employeeName:emp.name, type:'swap', requestedDate:target.date, shiftType:target.shiftType, swapWithEmployeeId:peer.id, swapWithEmployeeName:peer.name, reason:swapNote||'Shift swap via Staff Portal.' })
    toast('Swap Request Sent', `Pending approval for swap with ${peer.name}.`, 'success')
    setSwapOpen(false); setSwapNote(''); setTab('requests')
  }

  // ── selected day data ──
  const selPicked   = selDate ? (picked[selDate] || []) : []
  const selAssigned = selDate ? shifts.filter(s=>s.employeeId===emp.id && s.date===selDate) : []
  const selIsPast   = selDate ? selDate < TODAY : false

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b-[3px] border-black shadow-[0_3px_0_#000]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="size-8 sm:size-9 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-neutral-50 active:translate-x-px active:translate-y-px active:shadow-none transition-all">
              <ArrowLeft className="size-3.5 sm:size-4" />
            </Link>
            <div className="size-8 sm:size-9 rounded-xl bg-[#FF5500] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000] text-white shrink-0">
              <Calendar className="size-3.5 sm:size-4" />
            </div>
            <div className="hidden xs:block sm:block">
              <p className="text-xs sm:text-sm font-black text-black">Staff Scheduling</p>
              <p className="text-[9px] font-mono text-neutral-500 uppercase hidden sm:block">RORA Dose Waterfront</p>
            </div>
          </div>

          {/* staff picker */}
          <div className="flex-1 flex justify-center min-w-0 px-2">
            <div className="flex items-center gap-1.5 rounded-2xl border-2 border-black bg-[#FAF8F5] px-2.5 py-1.5 shadow-[2px_2px_0_#000] w-full max-w-xs">
              <User className="size-3 text-neutral-400 shrink-0" />
              <select value={empId} onChange={e=>setEmpId(e.target.value)} className="bg-transparent text-[10px] sm:text-xs font-black text-black focus:outline-none cursor-pointer w-full truncate">
                {employees.map(e=><option key={e.id} value={e.id}>{e.name} · {e.role}</option>)}
              </select>
            </div>
          </div>

          {/* clock */}
          <button onClick={handleClock} className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer shrink-0 ${emp.status==='on-duty'?'bg-red-500 text-white':'bg-[#22C55E] text-black'}`}>
            {emp.status==='on-duty' ? <LogOut className="size-3.5"/> : <LogIn className="size-3.5"/>}
            <span className="hidden sm:inline">{emp.status==='on-duty'?'Clock Out':'Clock In'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">

        {/* ── IDENTITY CARD ─────────────────────────────────────────────── */}
        <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={emp.avatar} alt={emp.name} className="size-12 sm:size-14 rounded-xl sm:rounded-2xl border-2 border-black object-cover shadow-[2px_2px_0_#000]"/>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-lg sm:text-xl font-black text-black">{emp.name}</h1>
                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border-2 border-black ${emp.status==='on-duty'?'bg-[#22C55E] text-black':'bg-neutral-200 text-neutral-600'}`}>
                  {emp.status==='on-duty'?'● ON DUTY':'○ OFF DUTY'}
                </span>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-neutral-500 mt-0.5">{emp.role} · {emp.diningSection}</p>
            </div>
          </div>
          <div className="w-full sm:w-52 space-y-1">
            <div className="flex justify-between font-mono text-[10px] sm:text-xs font-black">
              <span>WEEKLY HOURS</span>
              <span className={pct>=90?'text-red-500':''}>{emp.currentWeeklyHours}h / {emp.maxWeeklyHours}h</span>
            </div>
            <div className="h-2.5 w-full rounded-full border-2 border-black bg-[#FAF8F5] overflow-hidden">
              <div className={`h-full rounded-full ${pct>=90?'bg-red-500':pct>=70?'bg-amber-400':'bg-[#22C55E]'}`} style={{width:`${pct}%`}}/>
            </div>
            <p className="font-mono text-[9px] text-neutral-400">{emp.maxWeeklyHours - emp.currentWeeklyHours}h remaining · ₱{emp.hourlyRate}/hr</p>
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          {([
            {id:'pick',     label:'📅 Availability', active:'bg-[#FF5500] text-white'},
            {id:'schedule', label:'📋 My Shifts',    active:'bg-[#FFE600] text-black'},
            {id:'requests', label:`📨 Requests${pendingN>0?` (${pendingN})`:''}`, active:'bg-[#22C55E] text-black'},
          ] as const).map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border-2 border-black font-mono text-[10px] sm:text-xs font-black uppercase shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer ${tab===t.id?t.active:'bg-white text-black hover:bg-neutral-50'}`}>
              {t.label}
            </button>
          ))}
          <button onClick={()=>setSwapOpen(true)} className="ml-auto flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border-2 border-black bg-[#60A5FA] text-black font-mono text-[10px] sm:text-xs font-black uppercase shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer">
            <ArrowRightLeft className="size-3.5"/>
            <span>Swap</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB: AVAILABILITY PICKER
           ════════════════════════════════════════════════════════════════ */}
        {tab==='pick' && (
          <div className="space-y-4">

            {/* Sticky submit bar when slots picked */}
            {totalSlots > 0 && (
              <div className="sticky top-14 sm:top-16 z-30 flex items-center justify-between gap-3 rounded-2xl border-[3px] border-black bg-[#FFE600] px-4 py-2.5 shadow-[4px_4px_0_#000]">
                <p className="font-mono text-xs font-black text-black">
                  <span className="text-[#FF5500]">{totalSlots}</span> slot{totalSlots>1?'s':''} across <span className="text-[#FF5500]">{totalDays}</span> day{totalDays>1?'s':''} selected
                </p>
                <button onClick={handleSubmit} className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FF5500] text-white px-4 py-2 font-mono text-xs font-black uppercase shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer">
                  <Send className="size-3.5"/> Submit
                </button>
              </div>
            )}

            {/* ── MINI CALENDAR ── */}
            <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] overflow-hidden">

              {/* Month nav */}
              <div className="flex items-center justify-between bg-[#FAF8F5] border-b-[3px] border-black px-4 py-3">
                <button onClick={prevM} className="size-9 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-neutral-50 active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer">
                  <ChevronLeft className="size-4"/>
                </button>
                <div className="text-center">
                  <h2 className="font-serif text-lg sm:text-2xl font-black text-black">{monthLabel}</h2>
                  <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mt-0.5">tap a date · pick your shifts</p>
                </div>
                <button onClick={nextM} className="size-9 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-neutral-50 active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer">
                  <ChevronRight className="size-4"/>
                </button>
              </div>

              {/* DOW row */}
              <div className="grid grid-cols-7 border-b-2 border-black">
                {DOW.map(d=>(
                  <div key={d} className={`text-center py-2 font-mono text-[9px] sm:text-[10px] font-black uppercase border-r last:border-r-0 border-black/10 ${d==='Sat'||d==='Sun'?'text-sky-600':'text-neutral-500'}`}>{d}</div>
                ))}
              </div>

              {/* Calendar grid — only numbers + status dots, NO tiny buttons */}
              <div className="grid grid-cols-7">
                {/* offset cells */}
                {Array.from({length:offset}).map((_,i)=>(
                  <div key={`off-${i}`} className="aspect-square sm:min-h-[70px] border-b border-r border-black/10 bg-neutral-50/60"/>
                ))}

                {/* day cells */}
                {Array.from({length:days}).map((_,i)=>{
                  const day  = i+1
                  const ds   = toISO(year, month, day)
                  const isPast   = ds < TODAY
                  const isToday  = ds === TODAY
                  const isSel    = ds === selDate
                  const myPicked = picked[ds] || []
                  const myAssign = shifts.filter(s=>s.employeeId===emp.id && s.date===ds)
                  const col = (offset+i)%7
                  const isWE = col===5||col===6
                  const hasDot = myPicked.length>0 || myAssign.length>0

                  return (
                    <button
                      key={ds}
                      disabled={isPast}
                      onClick={()=>setSelDate(isSel ? null : ds)}
                      className={`relative flex flex-col items-center justify-start pt-1.5 pb-1 aspect-square sm:min-h-[70px] border-b border-r border-black/10 transition-all disabled:cursor-default
                        ${isPast ? 'bg-neutral-50 opacity-40'
                          : isSel  ? 'bg-black ring-inset ring-2 ring-black cursor-pointer'
                          : isWE   ? 'bg-sky-50/60 hover:bg-sky-100/80 cursor-pointer'
                          : 'bg-white hover:bg-[#FFF9E6] cursor-pointer'}
                      `}
                    >
                      {/* Day number */}
                      <span className={`font-mono text-xs sm:text-sm font-black leading-none
                        ${isSel ? 'text-white'
                          : isToday ? 'text-[#FF5500]'
                          : isPast ? 'text-neutral-400'
                          : isWE ? 'text-sky-700'
                          : 'text-black'}
                      `}>
                        {day}
                      </span>

                      {/* Today dot */}
                      {isToday && !isSel && <span className="w-1 h-1 rounded-full bg-[#FF5500] mt-0.5"/>}

                      {/* Slot dots row */}
                      {hasDot && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                          {myAssign.map(s=>(
                            <span key={s.id} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-black/20 ${
                              s.shiftType==='Morning'?'bg-amber-400':s.shiftType==='Afternoon'?'bg-sky-400':s.shiftType==='Evening'?'bg-violet-500':'bg-rose-500'
                            }`} title={`Assigned: ${s.shiftType}`}/>
                          ))}
                          {myPicked.map(slot=>(
                            <span key={slot} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ring-1 ring-black/30 ${
                              slot==='Morning'?'bg-amber-300':slot==='Afternoon'?'bg-sky-300':slot==='Evening'?'bg-violet-400':'bg-rose-400'
                            }`} title={`Picked: ${slot}`}/>
                          ))}
                        </div>
                      )}

                      {/* Selected ring overlay */}
                      {isSel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[8px] text-white/70 uppercase tracking-wider leading-none">pick</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── SHIFT SLOT PICKER PANEL (shown when a date is selected) ── */}
            {selDate && (
              <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] overflow-hidden">
                {/* Panel header */}
                <div className={`flex items-center justify-between border-b-[3px] border-black px-4 py-3 ${selIsPast?'bg-neutral-100':'bg-[#FFF9E6]'}`}>
                  <div>
                    <p className="font-mono text-[9px] font-black uppercase text-neutral-500 tracking-widest">
                      {selIsPast ? 'Past date — view only' : 'Pick your available shifts for'}
                    </p>
                    <h3 className="font-serif text-lg sm:text-2xl font-black text-black">
                      {fmt(selDate, {weekday:'long', month:'long', day:'numeric'})}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {selPicked.length > 0 && (
                      <button onClick={()=>clearDay(selDate)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-dashed border-red-300 text-red-500 font-mono text-[9px] font-black uppercase hover:bg-red-50 cursor-pointer">
                        <Trash2 className="size-3"/> Clear
                      </button>
                    )}
                    <button onClick={()=>setSelDate(null)} className="size-8 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-neutral-50 cursor-pointer">
                      <XCircle className="size-4"/>
                    </button>
                  </div>
                </div>

                {/* 4 shift slot buttons — large & touch-friendly */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SHIFTS.map(slot => {
                    const c = SC[slot]
                    const isAssigned = selAssigned.some(s=>s.shiftType===slot)
                    const isSel2 = selPicked.includes(slot)
                    const disabled = selIsPast || isAssigned

                    return (
                      <button
                        key={slot}
                        disabled={disabled}
                        onClick={()=>toggleSlot(selDate, slot)}
                        className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] py-5 px-3 font-black transition-all cursor-pointer disabled:cursor-default
                          ${isAssigned
                            ? `${c.bg} ${c.border} opacity-70`
                            : isSel2
                            ? `${c.selBg} ${c.selBorder} shadow-[3px_3px_0_#000] -translate-y-0.5`
                            : `bg-white border-dashed border-neutral-300 hover:${c.bg} hover:${c.border} hover:shadow-[2px_2px_0_#000]`
                          }
                        `}
                      >
                        {/* checkmark badge */}
                        {(isSel2 || isAssigned) && (
                          <span className={`absolute top-2 right-2 size-5 flex items-center justify-center rounded-full border-2 border-black ${isAssigned?'bg-black text-white':'bg-white text-black'}`}>
                            <span className="text-[9px] font-black">{isAssigned?'★':'✓'}</span>
                          </span>
                        )}

                        <span className="text-2xl sm:text-3xl leading-none">{c.emoji}</span>

                        <div className="text-center">
                          <p className={`font-mono text-xs sm:text-sm font-black uppercase ${isSel2?c.selText:isAssigned?c.text:'text-neutral-700'}`}>
                            {c.label}
                          </p>
                          <p className={`font-mono text-[9px] sm:text-[10px] font-bold mt-0.5 ${isSel2?c.selText:isAssigned?c.text:'text-neutral-400'}`}>
                            {c.time}
                          </p>
                          <p className={`font-mono text-[8px] mt-0.5 ${isSel2?c.selText:'text-neutral-400'}`}>
                            {c.hours}h shift
                          </p>
                        </div>

                        {isAssigned && (
                          <span className={`text-[8px] font-black uppercase rounded-full px-2 py-0.5 border ${c.border} ${c.bg} ${c.text}`}>
                            Assigned
                          </span>
                        )}
                        {!isAssigned && !isSel2 && !selIsPast && (
                          <span className="text-[8px] font-mono text-neutral-400 uppercase">tap to pick</span>
                        )}
                        {isSel2 && (
                          <span className={`text-[8px] font-black uppercase ${c.selText}`}>✓ Selected</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Quick dots legend */}
                <div className="flex flex-wrap gap-3 px-4 pb-3 border-t border-black/10 pt-3">
                  <span className="font-mono text-[9px] text-neutral-500 flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400 border border-black/20"/>Morning assigned</span>
                  <span className="font-mono text-[9px] text-neutral-500 flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-300 ring-1 ring-black/30"/>Morning picked</span>
                </div>
              </div>
            )}

            {/* ── SELECTION SUMMARY + NOTE + SUBMIT ── */}
            <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white p-4 shadow-[4px_4px_0_#000] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h3 className="font-serif text-base sm:text-lg font-black text-black">Availability Summary</h3>
                <span className="font-mono text-xs text-neutral-500">{totalDays} day{totalDays!==1?'s':''} · {totalSlots} slot{totalSlots!==1?'s':''}</span>
              </div>

              {totalDays === 0 ? (
                <div className="py-6 text-center space-y-1.5">
                  <CalendarDays className="size-10 mx-auto text-neutral-200"/>
                  <p className="font-mono text-xs font-black uppercase text-neutral-400">Nothing selected yet</p>
                  <p className="font-sans text-xs text-neutral-400">Tap any future date on the calendar above, then pick your available shifts.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(picked).sort(([a],[b])=>a.localeCompare(b)).map(([date,slots])=>(
                    <div key={date} className="flex items-center justify-between gap-2 rounded-xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-mono text-xs font-black text-black shrink-0">
                          {fmt(date,{weekday:'short', month:'short', day:'numeric'})}
                        </span>
                        {slots.map(s=>(
                          <button key={s} onClick={()=>toggleSlot(date,s)} className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 font-mono text-[9px] font-black uppercase cursor-pointer hover:opacity-70 ${SC[s].bg} ${SC[s].border} ${SC[s].text}`}>
                            {SC[s].emoji} {s.slice(0,3)} <XCircle className="size-2.5 ml-0.5"/>
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>clearDay(date)} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0">
                        <Trash2 className="size-4"/>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block font-mono text-[9px] font-black uppercase text-neutral-500 mb-1.5">Note to manager (optional)</label>
                <textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Prefer morning shifts this week due to class schedule..." className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5 font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:bg-white resize-none"/>
              </div>

              <button onClick={handleSubmit} disabled={totalDays===0}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FF5500] hover:bg-[#E04B00] disabled:bg-neutral-300 disabled:border-neutral-400 text-white py-3.5 font-mono font-black text-sm uppercase tracking-wide shadow-[3px_3px_0_#000] disabled:shadow-none active:translate-x-px active:translate-y-px active:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed">
                <Send className="size-4"/>
                Submit {totalSlots > 0 ? `${totalSlots} Slot${totalSlots>1?'s':''}` : 'Availability'} for Approval
              </button>

              {submitted && (
                <div className="flex items-center gap-2 rounded-2xl border-2 border-green-400 bg-green-50 px-3 py-2.5">
                  <CheckCircle2 className="size-5 text-green-500 shrink-0"/>
                  <p className="font-sans text-sm font-bold text-green-800">Submitted! Your manager will review and confirm your shifts.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB: MY SHIFTS
           ════════════════════════════════════════════════════════════════ */}
        {tab==='schedule' && (
          <div className="space-y-4">
            <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] overflow-hidden">
              <div className="border-b-2 border-black px-4 py-3 bg-[#FAF8F5] flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-black text-black">Upcoming Shifts</h3>
                <span className="font-mono text-xs text-neutral-500">{upcoming.length} scheduled</span>
              </div>
              {upcoming.length===0 ? (
                <div className="p-8 text-center space-y-2">
                  <CalendarDays className="size-10 mx-auto text-neutral-200"/>
                  <p className="font-mono text-xs font-black uppercase text-neutral-400">No upcoming shifts</p>
                  <p className="font-sans text-xs text-neutral-400">Go to "Availability" to submit your preferred dates.</p>
                </div>
              ) : (
                <div className="divide-y divide-black/10">
                  {upcoming.map(s=>{
                    const c = SC[s.shiftType]
                    const isToday2 = s.date===TODAY
                    return (
                      <div key={s.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 ${isToday2?'bg-[#FFF9E6] border-l-4 border-[#FF5500]':'hover:bg-neutral-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl sm:text-3xl size-10 sm:size-12 flex items-center justify-center rounded-xl sm:rounded-2xl border-2 ${c.border} ${c.bg} shrink-0`}>{c.emoji}</div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif text-sm sm:text-base font-black text-black">{fmt(s.date,{weekday:'long',month:'short',day:'numeric'})}</span>
                              {isToday2&&<span className="font-mono text-[9px] font-black uppercase rounded-full bg-[#FF5500] text-white px-2 py-0.5">TODAY</span>}
                              <span className={`font-mono text-[9px] font-black uppercase rounded-xl border px-2 py-0.5 ${c.bg} ${c.border} ${c.text}`}>{s.status}</span>
                            </div>
                            <p className="font-mono text-[10px] sm:text-xs text-neutral-500 mt-0.5">{s.shiftType} · {s.startTime} – {s.endTime} · {s.hours}h</p>
                            <p className="font-sans text-[10px] sm:text-xs text-neutral-400 mt-0.5">📍 {s.diningSection}</p>
                          </div>
                        </div>
                        {s.checkInTime ? (
                          <span className="font-mono text-[10px] font-black text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5 self-start sm:self-auto">
                            ✓ In {s.checkInTime}{s.checkOutTime?` · Out ${s.checkOutTime}`:''}
                          </span>
                        ) : isToday2 ? (
                          <button onClick={handleClock} className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border-2 border-black bg-[#22C55E] text-black font-mono text-xs font-black uppercase shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer self-start sm:self-auto">
                            <LogIn className="size-3.5"/> Clock In
                          </button>
                        ) : (
                          <span className="font-mono text-[10px] text-neutral-400 hidden sm:block">Not clocked in yet</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {past.length>0&&(
              <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white shadow-[3px_3px_0_#000] overflow-hidden">
                <div className="border-b-2 border-black px-4 py-3 bg-[#FAF8F5] flex items-center justify-between">
                  <h3 className="font-serif text-sm sm:text-base font-black text-black">Past Shifts</h3>
                  <span className="font-mono text-[10px] text-neutral-400">{past.length} records</span>
                </div>
                <div className="divide-y divide-black/10">
                  {past.slice().reverse().slice(0,8).map(s=>{
                    const c=SC[s.shiftType]
                    return (
                      <div key={s.id} className="flex items-center gap-3 px-4 py-3 opacity-60 hover:opacity-100 transition-opacity">
                        <span className="text-lg">{c.emoji}</span>
                        <span className="font-mono text-xs font-black text-black">{fmt(s.date,{weekday:'short',month:'short',day:'numeric'})}</span>
                        <span className={`font-mono text-[9px] font-black uppercase rounded-xl border px-2 py-0.5 ${c.bg} ${c.border} ${c.text}`}>{s.shiftType}</span>
                        <span className="font-mono text-[9px] text-neutral-400 ml-auto hidden sm:block">{s.startTime}–{s.endTime}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB: REQUESTS
           ════════════════════════════════════════════════════════════════ */}
        {tab==='requests' && (
          <div className="rounded-2xl sm:rounded-3xl border-[3px] border-black bg-white shadow-[4px_4px_0_#000] overflow-hidden">
            <div className="border-b-2 border-black px-4 py-3 bg-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif text-base sm:text-lg font-black text-black">My Schedule Requests</h3>
              <span className="font-mono text-xs text-neutral-500">{myReqs.length} total</span>
            </div>
            {myReqs.length===0 ? (
              <div className="p-8 text-center space-y-2">
                <LayoutList className="size-10 mx-auto text-neutral-200"/>
                <p className="font-mono text-xs font-black uppercase text-neutral-400">No requests yet</p>
                <p className="font-sans text-xs text-neutral-400">Use "Availability" tab to submit your preferred shift dates.</p>
              </div>
            ) : (
              <div className="divide-y divide-black/10">
                {myReqs.map(r=>{
                  const c=SC[r.shiftType]
                  const sc2 = r.status==='approved'?'bg-[#22C55E] text-black border-black':r.status==='rejected'?'bg-red-500 text-white border-red-700':'bg-[#FFE600] text-black border-black'
                  return (
                    <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-4 hover:bg-neutral-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl sm:text-2xl shrink-0">{c.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-sm font-black text-black">{fmt(r.requestedDate,{weekday:'long',month:'short',day:'numeric'})}</span>
                            <span className={`font-mono text-[9px] font-black uppercase rounded-xl border px-2 py-0.5 ${c.bg} ${c.border} ${c.text}`}>{r.shiftType}</span>
                            <span className="font-mono text-[9px] font-black uppercase rounded-full border border-black bg-neutral-100 text-black px-2 py-0.5">{r.type}</span>
                          </div>
                          <p className="font-sans text-xs text-neutral-500 mt-0.5 truncate">"{r.reason}"</p>
                          {r.swapWithEmployeeName&&<p className="font-mono text-[9px] text-neutral-400 mt-0.5">↔ {r.swapWithEmployeeName}</p>}
                        </div>
                      </div>
                      <span className={`shrink-0 self-start sm:self-auto font-mono text-[10px] font-black uppercase rounded-xl border-2 px-3 py-1.5 shadow-[2px_2px_0_#000] ${sc2}`}>
                        {r.status==='pending'?'⏳ Pending':r.status==='approved'?'✓ Approved':'✕ Rejected'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ══ SWAP MODAL ══════════════════════════════════════════════════════ */}
      {swapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t-[3px] sm:border-[3px] border-black bg-white p-5 shadow-[0_-6px_0_#000] sm:shadow-[8px_8px_0_#000] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h3 className="font-serif text-xl font-black text-black">Request Shift Swap</h3>
                <p className="font-mono text-[10px] text-neutral-400">As: {emp.name}</p>
              </div>
              <button onClick={()=>setSwapOpen(false)} className="size-9 flex items-center justify-center rounded-xl border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-neutral-50 cursor-pointer">
                <XCircle className="size-4"/>
              </button>
            </div>
            <form onSubmit={handleSwap} className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] font-black uppercase text-neutral-500 mb-1.5">My shift to swap</label>
                <select required value={swapShift} onChange={e=>setSwapShift(e.target.value)} className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-3 font-mono text-xs font-bold text-black focus:outline-none cursor-pointer">
                  <option value="">— Choose one of my upcoming shifts —</option>
                  {upcoming.map(s=><option key={s.id} value={s.id}>{fmt(s.date,{weekday:'short',month:'short',day:'numeric'})} · {s.shiftType} ({s.startTime}–{s.endTime})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] font-black uppercase text-neutral-500 mb-1.5">Swap with colleague</label>
                <select required value={swapWith} onChange={e=>setSwapWith(e.target.value)} className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-3 font-mono text-xs font-bold text-black focus:outline-none cursor-pointer">
                  <option value="">— Choose a colleague —</option>
                  {employees.filter(e=>e.id!==emp.id).map(e=><option key={e.id} value={e.id}>{e.name} · {e.role}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[9px] font-black uppercase text-neutral-500 mb-1.5">Reason</label>
                <textarea rows={3} required value={swapNote} onChange={e=>setSwapNote(e.target.value)} placeholder="Why do you need to swap this shift?" className="w-full rounded-2xl border-2 border-black bg-[#FAF8F5] px-3 py-2.5 font-sans text-sm text-black placeholder:text-neutral-400 focus:outline-none resize-none"/>
              </div>
              <div className="flex items-start gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5">
                <Info className="size-4 text-amber-500 shrink-0 mt-0.5"/>
                <span className="font-sans text-xs text-amber-800">Swap requires manager approval before it takes effect.</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={()=>setSwapOpen(false)} className="flex-1 rounded-2xl border-2 border-black bg-neutral-100 hover:bg-neutral-200 py-3 font-mono font-black text-xs uppercase cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl border-2 border-black bg-[#60A5FA] text-black py-3 font-mono font-black text-xs uppercase shadow-[2px_2px_0_#000] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer">
                  <Send className="size-3.5"/> Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StaffSchedulePage() {
  return <ToastProvider><SchedPage/></ToastProvider>
}
