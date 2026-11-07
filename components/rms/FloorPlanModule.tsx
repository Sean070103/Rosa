'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  UtensilsCrossed,
  Move,
  RotateCw,
  Maximize2,
  Trash2,
  Plus,
  Users,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ShoppingBag,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Link2,
  Unlink,
  Brush,
  Ban,
  Clock,
  Eye,
  Settings2,
  ShieldAlert,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { FloorTable, TableShape, TableStatus, UserRole, Employee, TODAY } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface FloorPlanModuleProps {
  currentRole: UserRole
}

export function FloorPlanModule({ currentRole }: FloorPlanModuleProps) {
  const {
    tables,
    employees,
    shifts,
    reservations,
    posOrders,
    updateTablePosition,
    updateTable,
    addTable,
    removeTable,
    setTableStatus,
    assignEmployeeToTable,
    transferEmployeeTables,
    combineTables,
    separateTables,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Selected Zone Filter
  const [selectedZone, setSelectedZone] = useState<string>('all')
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  // Dragging state
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Active selected table
  const selectedTable = tables.find((t) => t.id === selectedTableId) || null

  // Dining Areas
  const diningAreas = [
    'Waterfront Veranda',
    'Main Dining Room',
    'Alfresco Patio',
    'VIP Private Lounge',
  ]

  // Add Table Modal State
  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false)
  const [newTableForm, setNewTableForm] = useState<{
    tableNumber: string
    shape: TableShape
    capacity: number
    diningArea: string
  }>({
    tableNumber: 'V-04',
    shape: 'square',
    capacity: 4,
    diningArea: 'Waterfront Veranda',
  })

  // Table Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [targetTransferTableId, setTargetTransferTableId] = useState<string>('')

  // Shift Handover Modal State
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false)
  const [handoverFromEmpId, setHandoverFromEmpId] = useState<string>(employees[2]?.id || '')
  const [handoverToEmpId, setHandoverToEmpId] = useState<string>(employees[3]?.id || '')

  // Filtered Tables
  const filteredTables = tables.filter((t) => selectedZone === 'all' || t.diningArea === selectedZone)

  // Status Color Map for Light Theme Canvas: White table background with crisp status color borders & pills
  const statusColors: Record<TableStatus, { bg: string; border: string; text: string; badgeBg: string; badgeText: string; label: string }> = {
    available: { bg: '#FFFFFF', border: '#10B981', text: '#047857', badgeBg: '#ECFDF5', badgeText: '#047857', label: 'Available' },
    reserved: { bg: '#FFFFFF', border: '#F59E0B', text: '#B45309', badgeBg: '#FFFBEB', badgeText: '#B45309', label: 'Reserved' },
    occupied: { bg: '#FFFFFF', border: '#EF4444', text: '#B91C1C', badgeBg: '#FEF2F2', badgeText: '#B91C1C', label: 'Occupied' },
    cleaning: { bg: '#FFFFFF', border: '#3B82F6', text: '#1D4ED8', badgeBg: '#EFF6FF', badgeText: '#1D4ED8', label: 'Cleaning' },
    unavailable: { bg: '#FFFFFF', border: '#94A3B8', text: '#475569', badgeBg: '#F1F5F9', badgeText: '#475569', label: 'Closed' },
  }

  // Drag Handlers on canvas
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    if (!isEditMode) return
    e.stopPropagation()
    const tbl = tables.find((t) => t.id === tableId)
    if (!tbl || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - tbl.x,
      y: e.clientY - rect.top - tbl.y,
    })
    setDraggedTableId(tableId)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedTableId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()

    const rawX = e.clientX - rect.left - dragOffset.x
    const rawY = e.clientY - rect.top - dragOffset.y

    // Keep inside bounds
    const boundedX = Math.max(10, Math.min(rawX, 850))
    const boundedY = Math.max(10, Math.min(rawY, 620))

    updateTablePosition(draggedTableId, Math.round(boundedX), Math.round(boundedY))
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setDraggedTableId(null)
    }
  }

  // Create Table Handler
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault()
    let w = 90
    let h = 90
    if (newTableForm.shape === 'rectangular') {
      w = 120
      h = 80
    } else if (newTableForm.shape === 'communal') {
      w = 160
      h = 90
    } else if (newTableForm.shape === 'booth') {
      w = 100
      h = 90
    } else if (newTableForm.shape === 'lounge') {
      w = 140
      h = 95
    }

    addTable({
      tableNumber: newTableForm.tableNumber,
      shape: newTableForm.shape,
      capacity: newTableForm.capacity,
      x: 60 + Math.floor(Math.random() * 200),
      y: 60 + Math.floor(Math.random() * 200),
      width: w,
      height: h,
      rotation: 0,
      diningArea: newTableForm.diningArea,
      status: 'available',
    })

    toast('Table Added', `Placed Table ${newTableForm.tableNumber} in ${newTableForm.diningArea}`, 'success')
    setIsAddTableModalOpen(false)
  }

  // Handle Transfer Guests
  const handleExecuteTransfer = () => {
    if (!selectedTable || !targetTransferTableId) return
    const target = tables.find((t) => t.id === targetTransferTableId)
    if (!target) return

    // Move guest & order data
    updateTable(target.id, {
      status: 'occupied',
      currentGuestName: selectedTable.currentGuestName,
      currentGuests: selectedTable.currentGuests,
      orderId: selectedTable.orderId,
      activeBillTotal: selectedTable.activeBillTotal,
    })

    setTableStatus(selectedTable.id, 'cleaning')
    toast('Guests Transferred', `Transferred party from Table ${selectedTable.tableNumber} to Table ${target.tableNumber}`, 'success')
    setIsTransferModalOpen(false)
    setSelectedTableId(target.id)
  }

  // Handle Shift Handover
  const handleExecuteHandover = () => {
    const count = transferEmployeeTables(handoverFromEmpId, handoverToEmpId)
    const toEmp = employees.find((e) => e.id === handoverToEmpId)
    toast('Handover Complete', `Reassigned ${count} active tables to on-duty server ${toEmp?.name}`, 'success')
    setIsHandoverModalOpen(false)
  }

  // Get On-Duty Waiters for assignment
  const onDutyServers = employees.filter((e) => e.status === 'on-duty' && (e.role.includes('Server') || e.role.includes('Sommelier') || e.role.includes('Host')))

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager'

  return (
    <div className="space-y-6">
      {/* Top Banner & Canvas Controls (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Interactive Seating Plan</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  Canvas 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Visual drag-and-drop floor plan with real-time status indicators, shapes, server assignments, and table actions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Shift Handover Button */}
          {isManagerOrAdmin && (
            <button
              onClick={() => setIsHandoverModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              title="Transfer active tables between servers during shift changes"
            >
              <UserCheck className="w-4 h-4" />
              <span>Shift Handover</span>
            </button>
          )}

          {/* Toggle Edit Layout Mode */}
          {isManagerOrAdmin && (
            <button
              onClick={() => {
                setIsEditMode(!isEditMode)
                toast(
                  isEditMode ? 'Layout Locked' : 'Layout Edit Mode Enabled',
                  isEditMode ? 'Tables are fixed in place' : 'Drag tables on canvas to reposition, rotate, or resize.',
                  'info'
                )
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                isEditMode
                  ? 'bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-black hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <Move className="w-4 h-4" />
              <span>{isEditMode ? 'Exit Layout Editor' : 'Edit Layout'}</span>
            </button>
          )}

          {/* Add Table Button */}
          {isManagerOrAdmin && (
            <button
              onClick={() => setIsAddTableModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#22C55E] hover:bg-[#16A34A] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          )}
        </div>
      </div>

      {/* Zone Selector & Color Status Legend (Neo-Brutalist) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white border-3 border-black p-4 rounded-3xl text-xs shadow-[4px_4px_0px_0px_#000]">
        {/* Dining Zones Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-black font-black uppercase text-[11px] mr-1">Dining Area:</span>
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
              selectedZone === 'all'
                ? 'bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-neutral-800 hover:bg-[#FAF8F5] shadow-2xs'
            }`}
          >
            All Sections ({tables.length})
          </button>
          {diningAreas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedZone(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-2 border-black ${
                selectedZone === area
                  ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-neutral-800 hover:bg-[#FAF8F5] shadow-2xs'
              }`}
            >
              {area} ({tables.filter((t) => t.diningArea === area).length})
            </button>
          ))}
        </div>

        {/* Status Indicators Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-black uppercase">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#F0FDF4] shadow-[1px_1px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-black" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#FFFBEB] shadow-[1px_1px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] border border-black" /> Reserved
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#FEF2F2] shadow-[1px_1px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-black" /> Occupied
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#EFF6FF] shadow-[1px_1px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA] border border-black" /> Cleaning
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#F4EFEA] shadow-[1px_1px_0px_0px_#000]">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-black" /> Closed
          </span>
        </div>
      </div>

      {/* Main Floor Canvas & Table Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Floor Canvas */}
        <div className="lg:col-span-3">
          <p className="sm:hidden text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <span>← Swipe horizontally to explore full restaurant floor plan →</span>
          </p>
          <div className="overflow-x-auto rounded-3xl border-3 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] bg-[#FAF8F5]">
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`relative min-w-[680px] sm:min-w-full w-full h-[640px] bg-[#FAF8F5] overflow-hidden transition-all ${
                isEditMode ? 'cursor-crosshair ring-4 ring-[#FF5500]/30' : ''
              }`}
              style={{
                backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            >
            {/* Visual Area Zones Watermarks */}
            <div className="absolute top-4 left-6 text-xs font-black tracking-wider text-black/30 uppercase pointer-events-none">
              Waterfront Veranda (Lakeside Deck)
            </div>
            <div className="absolute top-[180px] left-6 text-xs font-black tracking-wider text-black/30 uppercase pointer-events-none">
              Main Dining Hall
            </div>
            <div className="absolute top-[330px] left-6 text-xs font-black tracking-wider text-black/30 uppercase pointer-events-none">
              Alfresco Garden Patio
            </div>
            <div className="absolute top-[470px] left-6 text-xs font-black tracking-wider text-black/30 uppercase pointer-events-none">
              VIP Private Tasting Lounge
            </div>

            {/* Edit Mode Notice Badge */}
            {isEditMode && (
              <div className="absolute top-3 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#FFE600] border-2 border-black text-black text-xs font-mono font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] animate-pulse">
                <Move className="w-3.5 h-3.5" />
                <span>DRAG & DROP ACTIVE</span>
              </div>
            )}

            {/* Render Each Table */}
            {filteredTables.map((tbl) => {
              const st = statusColors[tbl.status]
              const isSelected = selectedTableId === tbl.id

              // Render shapes
              const borderRadius =
                tbl.shape === 'round'
                  ? '9999px'
                  : tbl.shape === 'booth'
                  ? '16px 16px 6px 6px'
                  : tbl.shape === 'lounge'
                  ? '24px'
                  : '14px'

              return (
                <div
                  key={tbl.id}
                  onMouseDown={(e) => handleMouseDown(e, tbl.id)}
                  onClick={() => setSelectedTableId(tbl.id)}
                  className={`absolute flex flex-col items-center justify-center p-2 cursor-pointer select-none transition-all ${
                    isSelected ? 'ring-3 ring-black ring-offset-2 z-30 shadow-[5px_5px_0px_0px_#000] scale-105' : 'shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] z-10'
                  }`}
                  style={{
                    left: `${tbl.x}px`,
                    top: `${tbl.y}px`,
                    width: `${tbl.width}px`,
                    height: `${tbl.height}px`,
                    backgroundColor: st.bg,
                    borderColor: '#000000',
                    borderWidth: '2.5px',
                    borderRadius,
                    transform: `rotate(${tbl.rotation}deg)`,
                  }}
                >
                  {/* Table Number */}
                  <span className="font-mono font-black text-sm text-black">
                    {tbl.tableNumber}
                  </span>

                  {/* Capacity indicator */}
                  <span className="text-[10px] font-mono text-neutral-700 font-bold mt-0.5">
                    {tbl.capacity} seats
                  </span>

                  {/* Assigned Server Badge */}
                  {tbl.assignedEmployeeName && (
                    <span className="text-[9px] font-bold text-black bg-white border border-black px-1.5 py-0.2 rounded-full mt-1 truncate max-w-[80px] shadow-[1px_1px_0px_0px_#000]">
                      {tbl.assignedEmployeeName.split(' ')[0]}
                    </span>
                  )}

                  {/* Combined Table Indicator */}
                  {tbl.combinedWithTableId && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C084FC] text-black text-[10px] font-mono font-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                      ∞
                    </span>
                  )}

                  {/* Live Guest count if occupied */}
                  {tbl.status === 'occupied' && tbl.currentGuests && (
                    <span className="absolute -bottom-2 px-1.5 rounded-full bg-[#EF4444] text-white font-mono text-[9px] font-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      {tbl.currentGuests}p
                    </span>
                  )}
                </div>
              )
            })}
            </div>
          </div>
        </div>

        {/* Right Col: Table Inspector & Actions Drawer (Neo-Brutalist + Rounded-3xl) */}
        <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between space-y-4">
          {selectedTable ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="pb-3 border-b-2 border-black/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-black">Table {selectedTable.tableNumber}</h3>
                    <span
                      className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]"
                      style={{
                        backgroundColor: statusColors[selectedTable.status].badgeBg,
                        color: statusColors[selectedTable.status].badgeText,
                      }}
                    >
                      {statusColors[selectedTable.status].label.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-600 mt-0.5">{selectedTable.diningArea}</p>
                </div>

                {isManagerOrAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove Table ${selectedTable.tableNumber}?`)) {
                        removeTable(selectedTable.id)
                        setSelectedTableId(null)
                        toast('Table Removed', `Deleted ${selectedTable.tableNumber}`, 'info')
                      }
                    }}
                    className="p-1.5 rounded-xl border-2 border-black bg-white text-red-600 hover:bg-red-50 shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                    title="Delete Table"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Table Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-neutral-600 font-bold">Capacity:</span>
                  <span className="font-mono font-black text-black">{selectedTable.capacity} guests ({selectedTable.shape})</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-neutral-600 font-bold">Assigned Waiter:</span>
                  <span className="font-black text-black">
                    {selectedTable.assignedEmployeeName || 'Unassigned'}
                  </span>
                </div>

                {/* If table has active guest / reservation */}
                {selectedTable.currentGuestName && (
                  <div className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1">
                    <span className="text-[10px] uppercase font-black text-black">Current Guest Party</span>
                    <p className="font-black text-sm text-black">{selectedTable.currentGuestName}</p>
                    <p className="text-xs font-medium text-neutral-700">Party: {selectedTable.currentGuests} guests</p>
                    {selectedTable.activeBillTotal && (
                      <p className="text-xs font-mono font-black text-[#15803D] mt-1">
                        Active Bill: ₱{selectedTable.activeBillTotal.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Server Assignment Dropdown */}
              <div className="pt-2 border-t-2 border-black/10">
                <label className="block text-[11px] font-black uppercase text-black mb-1">
                  Assign Waiter (On-Duty Check Enforced)
                </label>
                <select
                  value={selectedTable.assignedEmployeeId || ''}
                  onChange={(e) => {
                    if (!e.target.value) return
                    const res = assignEmployeeToTable(selectedTable.id, e.target.value)
                    if (!res.success) {
                      toast('Duty Assignment Error', res.error, 'error')
                    } else {
                      const emp = employees.find((em) => em.id === e.target.value)
                      toast('Server Assigned', `Assigned ${emp?.name} to Table ${selectedTable.tableNumber}`, 'success')
                    }
                  }}
                  className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                >
                  <option value="">Select On-Duty Server...</option>
                  {onDutyServers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} • {s.diningSection})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Change Buttons */}
              <div className="pt-2 border-t-2 border-black/10 space-y-2">
                <p className="text-[10px] text-black font-black uppercase tracking-wider">Change Table Status:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setTableStatus(selectedTable.id, 'available')
                      toast('Table Available', `Table ${selectedTable.tableNumber} is ready for seating`, 'success')
                    }}
                    className="p-2 rounded-xl bg-[#22C55E] border-2 border-black text-black font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    Available
                  </button>

                  <button
                    onClick={() => {
                      setTableStatus(selectedTable.id, 'occupied')
                      toast('Table Occupied', `Table ${selectedTable.tableNumber} marked occupied`, 'info')
                    }}
                    className="p-2 rounded-xl bg-[#EF4444] border-2 border-black text-white font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    Occupied
                  </button>

                  <button
                    onClick={() => {
                      setTableStatus(selectedTable.id, 'cleaning')
                      toast('Cleaning In Progress', `Table ${selectedTable.tableNumber} marked for sanitizing`, 'info')
                    }}
                    className="p-2 rounded-xl bg-[#60A5FA] border-2 border-black text-black font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    Cleaning
                  </button>

                  <button
                    onClick={() => {
                      setTableStatus(selectedTable.id, 'unavailable')
                      toast('Table Closed', `Table ${selectedTable.tableNumber} marked unavailable`, 'info')
                    }}
                    className="p-2 rounded-xl bg-[#F4EFEA] border-2 border-black text-black font-black uppercase text-[10px] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    Closed
                  </button>
                </div>
              </div>

              {/* Table Action Utilities: Combine, Transfer, Order */}
              <div className="pt-2 border-t-2 border-black/10 space-y-2">
                <p className="text-[10px] text-black font-black uppercase tracking-wider">Table Actions:</p>

                {selectedTable.status === 'occupied' && (
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="w-full py-2.5 rounded-2xl bg-[#60A5FA] border-2 border-black text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Transfer Guests</span>
                  </button>
                )}

                {/* Combine Tables Feature */}
                {selectedTable.combinedWithTableId ? (
                  <button
                    onClick={() => {
                      separateTables(selectedTable.id)
                      toast('Tables Separated', `Table ${selectedTable.tableNumber} unlinked from partner table`, 'info')
                    }}
                    className="w-full py-2.5 rounded-2xl bg-[#C084FC] border-2 border-black text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Separate Tables</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          combineTables(selectedTable.id, e.target.value)
                          toast('Tables Combined', `Linked Table ${selectedTable.tableNumber} for a large party`, 'success')
                        }
                      }}
                      className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                    >
                      <option value="">🔗 Combine with adjacent table...</option>
                      {tables
                        .filter((t) => t.id !== selectedTable.id && !t.combinedWithTableId)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            Table {t.tableNumber} (Cap: {t.capacity})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Rotate & Resize Tools (in Edit Mode) */}
                {isEditMode && (
                  <div className="pt-2 border-t-2 border-black/10 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const nextRot = (selectedTable.rotation + 45) % 360
                        updateTable(selectedTable.id, { rotation: nextRot })
                      }}
                      className="flex-1 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3 text-[#FF5500]" />
                      <span>Rotate (+45°)</span>
                    </button>
                    <button
                      onClick={() => {
                        const newW = selectedTable.width === 90 ? 120 : 90
                        updateTable(selectedTable.id, { width: newW })
                      }}
                      className="flex-1 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3 text-[#FF5500]" />
                      <span>Resize</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500 space-y-2">
              <UtensilsCrossed className="w-8 h-8 mx-auto text-neutral-400" />
              <p className="font-black text-xs text-black uppercase">No Table Selected</p>
              <p className="text-[11px] text-neutral-600 font-medium">Click on any table on the floor plan canvas to view details, seat guests, or assign staff.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD TABLE */}
      {isAddTableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#000] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <h3 className="font-black text-base text-black">Add Table to Restaurant Floor</h3>
              <button onClick={() => setIsAddTableModalOpen(false)} className="text-black font-black p-1 hover:bg-neutral-100 rounded-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateTable} className="space-y-3.5">
              <div>
                <label className="block font-black uppercase text-black mb-1">Table Number / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V-05 or VIP-C"
                  value={newTableForm.tableNumber}
                  onChange={(e) => setNewTableForm({ ...newTableForm, tableNumber: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black uppercase text-black mb-1">Table Shape</label>
                  <select
                    value={newTableForm.shape}
                    onChange={(e) => setNewTableForm({ ...newTableForm, shape: e.target.value as TableShape })}
                    className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                  >
                    <option value="square">Square Table</option>
                    <option value="round">Round Table</option>
                    <option value="rectangular">Rectangular Table</option>
                    <option value="communal">Long Communal Table</option>
                    <option value="booth">Booth Seating</option>
                    <option value="lounge">Lounge Seating</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase text-black mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newTableForm.capacity}
                    onChange={(e) => setNewTableForm({ ...newTableForm, capacity: parseInt(e.target.value) || 2 })}
                    className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-mono font-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase text-black mb-1">Dining Area</label>
                <select
                  value={newTableForm.diningArea}
                  onChange={(e) => setNewTableForm({ ...newTableForm, diningArea: e.target.value })}
                  className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                >
                  {diningAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-black border-2 border-black font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TRANSFER GUESTS TO ANOTHER TABLE */}
      {isTransferModalOpen && selectedTable && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#000] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <h3 className="font-black text-base text-black">Transfer Guests from Table {selectedTable.tableNumber}</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-black font-black p-1 hover:bg-neutral-100 rounded-lg cursor-pointer">✕</button>
            </div>

            <p className="text-neutral-700 font-medium">
              Move party of <span className="font-black text-black">{selectedTable.currentGuestName}</span> ({selectedTable.currentGuests} guests) to an available table:
            </p>

            <select
              value={targetTransferTableId}
              onChange={(e) => setTargetTransferTableId(e.target.value)}
              className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black text-xs font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
            >
              <option value="">Select Target Table...</option>
              {tables
                .filter((t) => t.id !== selectedTable.id && t.status === 'available' && t.capacity >= (selectedTable.currentGuests || 1))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.tableNumber} ({t.diningArea} - Cap: {t.capacity})
                  </option>
                ))}
            </select>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black/10">
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!targetTransferTableId}
                onClick={handleExecuteTransfer}
                className="px-5 py-2 rounded-2xl bg-[#60A5FA] hover:bg-[#3B82F6] text-black border-2 border-black font-black uppercase cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                Execute Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHIFT HANDOVER / EMPLOYEE TABLE REASSIGNMENT */}
      {isHandoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#000] text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <div>
                <h3 className="font-black text-base text-black">Shift Handover: Transfer Active Tables</h3>
                <p className="text-[11px] text-neutral-600 font-medium">Bulk reassign active tables when an employee clocks out or ends shift.</p>
              </div>
              <button onClick={() => setIsHandoverModalOpen(false)} className="text-black font-black p-1 hover:bg-neutral-100 rounded-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-black uppercase text-black mb-1">Ending Shift (Transfer From)</label>
                <select
                  value={handoverFromEmpId}
                  onChange={(e) => setHandoverFromEmpId(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({tables.filter((t) => t.assignedEmployeeId === emp.id).length} tables currently)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black uppercase text-black mb-1">Incoming On-Duty Waiter (Transfer To)</label>
                <select
                  value={handoverToEmpId}
                  onChange={(e) => setHandoverToEmpId(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-black text-black font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                >
                  {employees
                    .filter((e) => e.id !== handoverFromEmpId)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role} - Status: {emp.status})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black/10">
              <button
                type="button"
                onClick={() => setIsHandoverModalOpen(false)}
                className="px-4 py-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteHandover}
                className="px-5 py-2 rounded-2xl bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black font-black uppercase cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                Complete Handover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
