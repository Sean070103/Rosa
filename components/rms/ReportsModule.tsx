'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Printer,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Package,
  DollarSign,
  Trash2,
  ChefHat,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { TODAY, UserRole } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface ReportsModuleProps {
  currentRole: UserRole
}

export function ReportsModule({ currentRole }: ReportsModuleProps) {
  const {
    employees,
    shifts,
    reservations,
    tables,
    inventory,
    recipes,
    stockMovements,
    wastageRecords,
    posOrders,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Selected Report Type
  const [selectedReport, setSelectedReport] = useState<
    | 'attendance'
    | 'reservations'
    | 'tables'
    | 'inventory'
    | 'costing'
    | 'wastage'
    | 'menu-profit'
  >('menu-profit')

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month')

  // CSV Exporter Utility
  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${filename}-${new Date().toISOString().substring(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast('Report Exported', `Downloaded ${filename}.csv`, 'success')
  }

  // Handle Export based on selected report
  const handleExportCurrent = () => {
    switch (selectedReport) {
      case 'attendance':
        exportToCSV(
          'employee-attendance-report',
          ['Employee Name', 'Role', 'Status', 'Assigned Hours', 'Max Weekly Hours', 'Hourly Rate', 'Section'],
          employees.map((e) => [
            e.name,
            e.role,
            e.status,
            e.currentWeeklyHours,
            e.maxWeeklyHours,
            e.hourlyRate,
            e.diningSection,
          ])
        )
        break

      case 'reservations':
        exportToCSV(
          'reservations-performance-report',
          ['Reservation ID', 'Guest Name', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Occasion'],
          reservations.map((r) => [
            r.id,
            r.customerName,
            r.customerPhone,
            r.date,
            r.timeSlot,
            r.guestCount,
            r.tableName || 'N/A',
            r.status,
            r.occasion || 'General',
          ])
        )
        break

      case 'tables':
        exportToCSV(
          'table-utilization-report',
          ['Table Number', 'Dining Area', 'Shape', 'Capacity', 'Current Status', 'Assigned Server', 'Current Guests', 'Bill Total'],
          tables.map((t) => [
            t.tableNumber,
            t.diningArea,
            t.shape,
            t.capacity,
            t.status,
            t.assignedEmployeeName || 'Unassigned',
            t.currentGuests || 0,
            t.activeBillTotal || 0,
          ])
        )
        break

      case 'inventory':
        exportToCSV(
          'inventory-consumption-report',
          ['SKU', 'Item Name', 'Category', 'Available Stock', 'Unit', 'Unit Cost', 'Valuation', 'Supplier'],
          inventory.map((i) => [
            i.sku,
            i.name,
            i.category,
            i.stockQuantity,
            i.unit,
            i.unitCost,
            (i.stockQuantity * i.unitCost).toFixed(2),
            i.supplierName,
          ])
        )
        break

      case 'costing':
        exportToCSV(
          'ingredient-costing-margin-report',
          ['Menu Item', 'Category', 'Ingredient Cost', 'Production Cost', 'Menu Price', 'Gross Profit', 'Food Cost %', 'Margin %'],
          recipes.map((r) => [
            r.name,
            r.category,
            r.totalIngredientCost,
            r.totalProductionCost,
            r.currentSellingPrice,
            r.grossProfit,
            r.foodCostPercentage,
            r.profitMarginPercentage,
          ])
        )
        break

      case 'wastage':
        exportToCSV(
          'food-wastage-spoilage-report',
          ['Record ID', 'Item Name', 'Quantity Lost', 'Unit', 'Reason', 'Cost Loss (PHP)', 'Reported By', 'Date'],
          wastageRecords.map((w) => [
            w.id,
            w.itemName,
            w.quantity,
            w.unit,
            w.reason,
            w.costLoss,
            w.reportedBy,
            w.date,
          ])
        )
        break

      case 'menu-profit':
        exportToCSV(
          'menu-profitability-report',
          ['Menu Item', 'Category', 'Selling Price', 'Cost of Ingredients', 'Gross Margin (PHP)', 'Profit Margin %'],
          recipes.map((r) => [
            r.name,
            r.category,
            r.currentSellingPrice,
            r.totalIngredientCost,
            r.grossProfit,
            `${r.profitMarginPercentage}%`,
          ])
        )
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Executive Reports & Analytics</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  CSV READY
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Aggregated business intelligence covering employee hours, table utilization, food cost margins, and spoilage logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-white hover:bg-[#FAF8F5] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCurrent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FF5500] hover:bg-[#E04B00] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs (Neo-Brutalist Pills) */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-black/10 pb-3 text-xs">
        {[
          { id: 'menu-profit', label: 'Menu Profitability', icon: TrendingUp },
          { id: 'costing', label: 'Ingredient Costing & Yields', icon: ChefHat },
          { id: 'inventory', label: 'Inventory Consumption', icon: Package },
          { id: 'tables', label: 'Table Utilization', icon: UtensilsCrossed },
          { id: 'reservations', label: 'Reservation Performance', icon: Calendar },
          { id: 'attendance', label: 'Employee Attendance & Hours', icon: Users },
          { id: 'wastage', label: 'Food Spoilage & Wastage', icon: Trash2 },
        ].map((rep) => {
          const isActive = selectedReport === rep.id
          const Icon = rep.icon

          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black uppercase tracking-wider text-xs border-2 border-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FFE600] text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-neutral-800 hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{rep.label}</span>
            </button>
          )
        })}
      </div>

      {/* REPORT CONTENT AREA (Neo-Brutalist + Rounded-3xl) */}
      <div className="bg-white border-3 border-black rounded-3xl p-6 lg:p-7 shadow-[6px_6px_0px_0px_#000] space-y-4">
        {/* REPORT 1: MENU PROFITABILITY */}
        {selectedReport === 'menu-profit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Menu Profitability & Sales Margin Report</h3>
                <p className="text-xs text-[#64748B]">Actual dish selling price vs raw production cost and profit contribution.</p>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Avg Food Cost: {Math.round(recipes.reduce((s, r) => s + r.foodCostPercentage, 0) / recipes.length)}%
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">Dish / Drink</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Selling Price</th>
                    <th className="p-3 text-right">Raw Food Cost</th>
                    <th className="p-3 text-right">Gross Profit</th>
                    <th className="p-3 text-right">Food Cost %</th>
                    <th className="p-3 text-right">Profit Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {recipes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[#172033]">{r.name}</td>
                      <td className="p-3 text-[#64748B]">{r.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">₱{r.currentSellingPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-[#172033]">₱{r.totalIngredientCost.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#EA580C]">+₱{r.grossProfit.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-amber-600">{r.foodCostPercentage.toFixed(1)}%</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">{r.profitMarginPercentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 2: INGREDIENT COSTING */}
        {selectedReport === 'costing' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Ingredient Costing & Yield Breakdown</h3>
              <p className="text-xs text-[#64748B]">Detailed line-item component costs for recipes (e.g., Mango Royale example).</p>
            </div>

            <div className="space-y-4">
              {recipes.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#172033]">{r.name}</span>
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Total Ingredients: ₱{r.totalIngredientCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    {r.ingredients.map((ing, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                        <span className="text-[#64748B] block truncate">{ing.ingredientName}</span>
                        <span className="text-[#172033] font-bold">{ing.quantity} {ing.unit} • ₱{ing.lineCost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT 3: INVENTORY CONSUMPTION */}
        {selectedReport === 'inventory' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Inventory Consumption & Current Valuation</h3>
              <p className="text-xs text-[#64748B]">On-hand inventory levels, unit costs, and total balance valuations.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Available</th>
                    <th className="p-3 text-right">Unit Cost</th>
                    <th className="p-3 text-right">Total Valuation</th>
                    <th className="p-3">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[10px] text-[#64748B]">{inv.sku}</td>
                      <td className="p-3 font-bold text-[#172033]">{inv.name}</td>
                      <td className="p-3 text-[#64748B] uppercase text-[10px]">{inv.category}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#172033]">{inv.stockQuantity} {inv.unit}</td>
                      <td className="p-3 text-right font-mono text-[#64748B]">₱{inv.unitCost.toFixed(3)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">
                        ₱{Math.round(inv.stockQuantity * inv.unitCost).toLocaleString()}
                      </td>
                      <td className="p-3 text-[#64748B]">{inv.supplierName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 4: TABLE UTILIZATION */}
        {selectedReport === 'tables' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Table Utilization & Floor Performance</h3>
              <p className="text-xs text-[#64748B]">Live seating occupancy, guest capacity matching, and assigned service waiters.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {tables.map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#172033]">Table {t.tableNumber}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[#64748B] mt-1">{t.diningArea} • {t.shape} (Cap: {t.capacity})</p>
                  <p className="text-blue-700 mt-0.5 font-medium">Assigned: {t.assignedEmployeeName || 'Unassigned'}</p>
                  {t.currentGuestName && (
                    <p className="text-xs font-bold text-[#172033] mt-1">👤 {t.currentGuestName} ({t.currentGuests} guests)</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORT 5: RESERVATION PERFORMANCE */}
        {selectedReport === 'reservations' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Reservation Performance & Guest Volume</h3>
              <p className="text-xs text-[#64748B]">Guest turnout, seating timeliness, and status breakdown.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3 text-center">Party Size</th>
                    <th className="p-3">Table</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#172033]">{res.customerName}</td>
                      <td className="p-3 text-[#64748B] font-mono">{res.customerPhone}</td>
                      <td className="p-3 text-[#172033] font-mono">{res.date} @ {res.timeSlot}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#172033]">{res.guestCount}</td>
                      <td className="p-3 text-emerald-700 font-mono font-medium">Table {res.tableName || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 6: ATTENDANCE & HOURS */}
        {selectedReport === 'attendance' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Employee Attendance & Assigned Working Hours</h3>
              <p className="text-xs text-[#64748B]">Weekly hours assigned, maximum working hour compliance, and wage rates.</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Weekly Hours</th>
                    <th className="p-3 text-right">Max Limit</th>
                    <th className="p-3 text-right">Hourly Rate</th>
                    <th className="p-3 text-right">Estimated Weekly Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#172033]">{emp.name}</td>
                      <td className="p-3 text-[#64748B]">{emp.role}</td>
                      <td className="p-3 font-mono text-[10px] text-emerald-700 uppercase font-bold">{emp.status}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#172033]">{emp.currentWeeklyHours}h</td>
                      <td className="p-3 text-right font-mono text-[#94A3B8]">{emp.maxWeeklyHours}h</td>
                      <td className="p-3 text-right font-mono text-[#64748B]">₱{emp.hourlyRate}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">
                        ₱{(emp.currentWeeklyHours * emp.hourlyRate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT 7: FOOD WASTAGE & SPOILAGE */}
        {selectedReport === 'wastage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Kitchen Spoilage & Food Waste Audit</h3>
                <p className="text-xs text-[#64748B]">Log of ingredient losses, damaged goods, and financial write-offs.</p>
              </div>
              <span className="text-xs font-mono text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                Total Loss: -₱{wastageRecords.reduce((s, w) => s + w.costLoss, 0).toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              {wastageRecords.map((w) => (
                <div key={w.id} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <span className="font-bold text-[#172033]">{w.itemName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 ml-2">
                      {w.reason}
                    </span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Lost: {w.quantity} {w.unit} • Reported by {w.reportedBy} ({w.date})
                    </p>
                  </div>
                  <span className="font-mono font-bold text-red-600 text-sm">-₱{w.costLoss.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
