'use client'

import React from 'react'
import {
  Calendar,
  Users,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Layers,
  ShoppingBag,
  ChefHat,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { TODAY, UserRole } from '@/lib/db/restaurant-db'

interface DashboardModuleProps {
  onNavigate: (tabId: string) => void
  currentRole: UserRole
  onOpenCustomerBooking: () => void
}

export function DashboardModule({
  onNavigate,
  currentRole,
  onOpenCustomerBooking,
}: DashboardModuleProps) {
  const {
    reservations,
    tables,
    employees,
    shifts,
    scheduleRequests,
    inventory,
    posOrders,
    recipes,
    auditLogs,
  } = useRestaurantDb()

  // 1. Today's Reservations
  const todayReservations = reservations.filter((r) => r.date === TODAY && r.status !== 'Cancelled')
  const totalGuestsToday = todayReservations.reduce((sum, r) => sum + r.guestCount, 0)

  // 2. Table Status Breakdown
  const availableTables = tables.filter((t) => t.status === 'available').length
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length
  const reservedTables = tables.filter((t) => t.status === 'reserved').length
  const cleaningTables = tables.filter((t) => t.status === 'cleaning').length
  const totalTablesCount = tables.length
  const tableUtilizationRate = totalTablesCount > 0 ? Math.round(((occupiedTables + reservedTables) / totalTablesCount) * 100) : 0

  // 3. Employees On Duty & Shifts
  const onDutyEmployees = employees.filter((e) => e.status === 'on-duty')
  const todayShifts = shifts.filter((s) => s.date === TODAY)
  const pendingRequests = scheduleRequests.filter((r) => r.status === 'pending')

  // 4. Inventory Valuation & Low Stock
  const inventoryValuation = inventory.reduce((sum, item) => sum + item.stockQuantity * item.unitCost, 0)
  const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.minThreshold)

  // 5. Sales & Gross Profit
  const completedOrders = posOrders.filter((o) => o.status === 'completed')
  const openOrders = posOrders.filter((o) => o.status === 'open')
  const dailySales = posOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0)
  const estimatedGrossProfit = posOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.grossProfit : 0), 0)

  // 6. Food Cost Percentage
  const avgFoodCostPercent =
    recipes.length > 0
      ? Math.round(
          recipes.reduce((sum, r) => sum + r.foodCostPercentage, 0) / recipes.length
        )
      : 34

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Welcome with Neo-Brutalist Frame & Rounded-3xl */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-3 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider font-mono font-black text-black bg-[#FFE600] px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000]">
                Unified Operations Control
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-black animate-pulse" />
              <span className="text-xs text-neutral-600 font-bold uppercase tracking-wider">Live Sync Active</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight">
              Rosa Lake Bistro & Veranda Executive
            </h1>
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
              Comprehensive restaurant operations control. Manage staff schedules, recipe costing, stock inventory, dining reservations, and floor seating in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('floor')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FAF8F5] text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#FF5500]" />
              <span>Floor Plan</span>
            </button>
            <button
              onClick={() => onNavigate('scheduling')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Calendar className="w-4 h-4 text-black" />
              <span>Staff Schedule</span>
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-black border-2 border-black font-black uppercase tracking-wider text-xs shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] transition-all cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Package className="w-4 h-4 text-black" />
              <span>Inventory</span>
            </button>
          </div>
        </div>
      </div>

      {/* 12 Executive KPI Metric Cards (Neo-Brutalist + Rounded-2xl + Hard Offset Shadows) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
        {/* 1. Today's Reservations */}
        <div
          onClick={() => onNavigate('reservations')}
          className="bg-white hover:bg-[#FFFBEB] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-black font-mono">{todayReservations.length}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1 flex items-center justify-between">
            <span>{totalGuestsToday} guests</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5500]" />
          </div>
        </div>

        {/* 2. Available Tables */}
        <div
          onClick={() => onNavigate('floor')}
          className="bg-white hover:bg-[#F0FDF4] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Available</span>
            <div className="w-8 h-8 rounded-xl bg-[#22C55E] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-black" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#15803D] font-mono">{availableTables}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Of {totalTablesCount} tables
          </div>
        </div>

        {/* 3. Occupied Tables */}
        <div
          onClick={() => onNavigate('floor')}
          className="bg-white hover:bg-[#FEF2F2] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Occupied</span>
            <div className="w-8 h-8 rounded-xl bg-[#EF4444] text-white flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-black" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B91C1C] font-mono">{occupiedTables}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            {tableUtilizationRate}% floor cap
          </div>
        </div>

        {/* 4. Staff On Duty */}
        <div
          onClick={() => onNavigate('scheduling')}
          className="bg-white hover:bg-[#EFF6FF] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">On Duty</span>
            <div className="w-8 h-8 rounded-xl bg-[#60A5FA] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1D4ED8] font-mono">{onDutyEmployees.length}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            {todayShifts.length} rostered
          </div>
        </div>

        {/* 5. Pending Schedule Requests */}
        <div
          onClick={() => onNavigate('scheduling')}
          className="bg-white hover:bg-[#FFFBEB] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Shift Req</span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B45309] font-mono">{pendingRequests.length}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Awaiting review
          </div>
        </div>

        {/* 6. Low-Stock Ingredients */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white hover:bg-[#FFFBEB] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Stock Alert</span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B45309] font-mono">{lowStockItems.length}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            {lowStockItems.length > 0 ? 'Restock item' : 'Stocks healthy'}
          </div>
        </div>

        {/* 7. Inventory Valuation */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white hover:bg-[#FAF8F5] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-black font-mono">
            ₱{Math.round(inventoryValuation).toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            {inventory.length} catalog items
          </div>
        </div>

        {/* 8. Food Cost Percentage */}
        <div
          onClick={() => onNavigate('costing')}
          className="bg-white hover:bg-[#F0FDF4] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Food Cost %</span>
            <div className="w-8 h-8 rounded-xl bg-[#22C55E] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#15803D] font-mono">{avgFoodCostPercent}%</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Target: &lt; 40%
          </div>
        </div>

        {/* 9. Daily Sales */}
        <div
          onClick={() => onNavigate('reports')}
          className="bg-white hover:bg-[#F0FDF4] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Daily Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#22C55E] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#15803D] font-mono">
            ₱{Math.round(dailySales).toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            {completedOrders.length} done • {openOrders.length} open
          </div>
        </div>

        {/* 10. Estimated Gross Profit */}
        <div
          onClick={() => onNavigate('costing')}
          className="bg-white hover:bg-[#FFFBEB] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Gross Profit</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-[#FF5500] font-mono">
            ₱{Math.round(estimatedGrossProfit).toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Net ingredient cost
          </div>
        </div>

        {/* 11. Reserved Tables */}
        <div
          onClick={() => onNavigate('floor')}
          className="bg-white hover:bg-[#FFFBEB] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Reserved</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 rounded-full bg-black" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#B45309] font-mono">{reservedTables}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Upcoming seats
          </div>
        </div>

        {/* 12. Tables Being Cleaned */}
        <div
          onClick={() => onNavigate('floor')}
          className="bg-white hover:bg-[#EFF6FF] border-2 border-black rounded-2xl p-4 transition-all duration-150 cursor-pointer group shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <div className="flex items-center justify-between text-neutral-600 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Cleaning</span>
            <div className="w-8 h-8 rounded-xl bg-[#60A5FA] text-black flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 rounded-full bg-black" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1D4ED8] font-mono">{cleaningTables}</div>
          <div className="text-[11px] font-semibold text-neutral-600 mt-1">
            Turnover active
          </div>
        </div>
      </div>

      {/* Middle Dual Columns: Live Floor Snapshot vs Staff & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Floor Plan Quick Map (2 cols) */}
        <div className="lg:col-span-2 bg-white border-3 border-black rounded-3xl p-6 lg:p-7 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b-2 border-black/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF5500] border-2 border-black text-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <UtensilsCrossed className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-black">Live Table & Seating Snapshot</h2>
                  <p className="text-xs font-medium text-neutral-600">Dynamic floor occupancy by dining zone</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('floor')}
                className="text-xs font-black uppercase tracking-wider text-[#FF5500] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Interactive Canvas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Mini Grid of Tables with Neo-Brutalist Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {tables.map((t) => {
                const statusStyles: Record<string, { bg: string; text: string; badgeBg: string; label: string }> = {
                  available: { bg: 'bg-[#F0FDF4]', text: 'text-black', badgeBg: 'bg-[#22C55E] text-black', label: 'AVAILABLE' },
                  reserved: { bg: 'bg-[#FFFBEB]', text: 'text-black', badgeBg: 'bg-[#FFE600] text-black', label: 'RESERVED' },
                  occupied: { bg: 'bg-[#FEF2F2]', text: 'text-black', badgeBg: 'bg-[#EF4444] text-white', label: 'OCCUPIED' },
                  cleaning: { bg: 'bg-[#EFF6FF]', text: 'text-black', badgeBg: 'bg-[#60A5FA] text-black', label: 'CLEANING' },
                  unavailable: { bg: 'bg-[#F4EFEA]', text: 'text-black', badgeBg: 'bg-neutral-300 text-black', label: 'CLOSED' },
                }
                const st = statusStyles[t.status] || statusStyles.available

                return (
                  <div
                    key={t.id}
                    onClick={() => onNavigate('floor')}
                    className={`p-3.5 rounded-2xl border-2 border-black ${st.bg} shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black font-mono text-sm text-black">{t.tableNumber}</span>
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_0px_#000] ${st.badgeBg}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-700">
                      <p className="truncate font-black text-black">{t.diningArea}</p>
                      <p className="mt-0.5 font-medium text-neutral-600">Cap: {t.capacity} • {t.shape}</p>
                      {t.currentGuestName && (
                        <p className="mt-1 text-xs font-black text-[#FF5500] truncate">
                          👤 {t.currentGuestName}
                        </p>
                      )}
                      {t.assignedEmployeeName && (
                        <p className="mt-0.5 text-[10px] text-neutral-800 font-bold truncate">
                          Waiter: {t.assignedEmployeeName.split(' ')[0]}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-black/10 flex flex-wrap items-center justify-between text-xs text-black gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#F0FDF4] font-black text-[11px] shadow-[1px_1px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] border border-black" /> Available ({availableTables})
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#FFFBEB] font-black text-[11px] shadow-[1px_1px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-[#FFE600] border border-black" /> Reserved ({reservedTables})
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#FEF2F2] font-black text-[11px] shadow-[1px_1px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] border border-black" /> Occupied ({occupiedTables})
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black bg-[#EFF6FF] font-black text-[11px] shadow-[1px_1px_0px_0px_#000]">
                <span className="w-2 h-2 rounded-full bg-[#60A5FA] border border-black" /> Cleaning ({cleaningTables})
              </span>
            </div>
            <button
              onClick={onOpenCustomerBooking}
              className="text-xs text-[#FF5500] font-black uppercase tracking-wider hover:underline cursor-pointer"
            >
              + Create New Reservation
            </button>
          </div>
        </div>

        {/* Right Column: Staff on Duty & Low Stock Watchlist */}
        <div className="space-y-6">
          {/* Staff on Duty */}
          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#60A5FA] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-black">Staff On Duty</h3>
              </div>
              <button
                onClick={() => onNavigate('scheduling')}
                className="text-xs text-[#FF5500] font-black uppercase tracking-wider hover:underline cursor-pointer"
              >
                Schedule
              </button>
            </div>

            <div className="space-y-2.5">
              {onDutyEmployees.length === 0 ? (
                <p className="text-xs font-medium text-neutral-500">No staff clocked in right now.</p>
              ) : (
                onDutyEmployees.slice(0, 4).map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border-2 border-black" />
                      <div>
                        <p className="text-xs font-black text-black">{emp.name}</p>
                        <p className="text-[10px] font-bold text-neutral-600">{emp.role} • {emp.diningSection}</p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full font-mono font-black bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      ON DUTY
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-black">Stock & Thresholds</h3>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs text-[#FF5500] font-black uppercase tracking-wider hover:underline cursor-pointer"
              >
                Restock
              </button>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.length === 0 ? (
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border-2 border-black text-black text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span className="font-bold">All ingredients are above minimum thresholds.</span>
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-black text-xs flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                    <div>
                      <p className="font-black text-black">{item.name}</p>
                      <p className="text-[10px] text-neutral-700 font-medium">
                        Current: <span className="font-mono text-red-600 font-black">{item.stockQuantity} {item.unit}</span> (Min: {item.minThreshold} {item.unit})
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('inventory')}
                      className="px-3 py-1 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-black uppercase tracking-wider text-[10px] border border-black shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                    >
                      PO Reorder
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Cross-Module Audit Stream */}
      <div className="bg-white border-3 border-black rounded-3xl p-6 lg:p-7 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-black text-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-black">Synchronized System Audit Stream</h3>
              <p className="text-xs font-medium text-neutral-600">Tamper-evident logs across POS, inventory, shifts and tables</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('roles')}
            className="text-xs text-[#FF5500] hover:underline font-black uppercase tracking-wider cursor-pointer"
          >
            Full Audit Logs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-xs shadow-[2px_2px_0px_0px_#000] transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] text-black font-black uppercase px-2 py-0.5 rounded-full bg-[#FFE600] border border-black shadow-[1px_1px_0px_0px_#000]">
                  {log.module.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono font-bold text-neutral-500">{log.timestamp.substring(11, 16)}</span>
              </div>
              <p className="font-black text-black">{log.action}</p>
              <p className="text-[11px] font-medium text-neutral-600 mt-1 line-clamp-2 leading-relaxed">{log.details}</p>
              <p className="text-[10px] text-neutral-500 mt-2 font-bold">By {log.actor} ({log.actorRole})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
