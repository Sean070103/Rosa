'use client'

import React, { useState } from 'react'
import {
  Package,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Truck,
  RotateCcw,
  Trash2,
  Calendar,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { InventoryItem, UserRole, StockMovement, PurchaseOrder } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface InventoryModuleProps {
  currentRole: UserRole
}

export function InventoryModule({ currentRole }: InventoryModuleProps) {
  const {
    inventory,
    stockMovements,
    suppliers,
    purchaseOrders,
    wastageRecords,
    updateInventoryItem,
    recordStockMovement,
    recordWastage,
    createPurchaseOrder,
    receivePurchaseOrder,
  } = useRestaurantDb()

  const { toast } = useToast()

  // Tabs & Search
  const [activeTab, setActiveTab] = useState<'items' | 'movements' | 'purchase-orders' | 'suppliers' | 'wastage'>('items')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ingredient' | 'beverage' | 'packaging' | 'supplies'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] = useState(false)
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = useState<InventoryItem | null>(null)
  const [adjustmentForm, setAdjustmentForm] = useState<{
    type: 'stock-in' | 'stock-out' | 'adjustment'
    quantity: number
    reason: string
  }>({
    type: 'stock-in',
    quantity: 1000,
    reason: 'Fresh supplier drop-off',
  })

  // Wastage Modal
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false)
  const [wastageForm, setWastageForm] = useState<{
    itemId: string
    quantity: number
    reason: 'Spoiled' | 'Expired' | 'Prep Spill' | 'Kitchen Waste' | 'Defective'
    notes: string
  }>({
    itemId: inventory[0]?.id || '',
    quantity: 500,
    reason: 'Spoiled',
    notes: 'Damaged packaging during storage handling',
  })

  // New Purchase Order Modal
  const [isPoModalOpen, setIsPoModalOpen] = useState(false)
  const [poForm, setPoForm] = useState<{
    supplierId: string
    itemId: string
    quantity: number
  }>({
    supplierId: suppliers[0]?.id || '',
    itemId: inventory[0]?.id || '',
    quantity: 10000,
  })

  // Computed Dashboard Metrics
  const totalValuation = inventory.reduce((sum, item) => sum + item.stockQuantity * item.unitCost, 0)
  const totalStockCount = inventory.reduce((sum, item) => sum + item.stockQuantity, 0)
  const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.minThreshold)
  const outOfStockItems = inventory.filter((item) => item.stockQuantity === 0)

  // Expiring items (< 14 days)
  const now = new Date()
  const expiringItems = inventory.filter((item) => {
    if (!item.expirationDate) return false
    const exp = new Date(item.expirationDate)
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 14
  })

  // Filtered Inventory List
  const filteredInventory = inventory.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  // Submit Adjustment
  const handleAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItemForAdjustment) return

    const qty = adjustmentForm.type === 'stock-out' ? -Math.abs(adjustmentForm.quantity) : Math.abs(adjustmentForm.quantity)

    recordStockMovement({
      itemId: selectedItemForAdjustment.id,
      itemName: selectedItemForAdjustment.name,
      type: adjustmentForm.type,
      quantity: qty,
      unit: selectedItemForAdjustment.unit,
      reason: adjustmentForm.reason,
      performedBy: 'Inventory Manager',
      costImpact: qty * selectedItemForAdjustment.unitCost,
    })

    toast('Stock Updated', `Recorded ${adjustmentForm.type} of ${Math.abs(qty)} ${selectedItemForAdjustment.unit} for ${selectedItemForAdjustment.name}`, 'success')
    setIsStockAdjustmentModalOpen(false)
  }

  // Submit Wastage
  const handleWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const item = inventory.find((i) => i.id === wastageForm.itemId)
    if (!item) return

    const costLoss = Number((wastageForm.quantity * item.unitCost).toFixed(2))

    recordWastage({
      itemId: item.id,
      itemName: item.name,
      quantity: wastageForm.quantity,
      unit: item.unit,
      reason: wastageForm.reason,
      costLoss,
      reportedBy: 'Kitchen Staff',
      notes: wastageForm.notes,
    })

    toast('Wastage Recorded', `Logged ₱${costLoss} loss on ${item.name} (${wastageForm.reason})`, 'warning')
    setIsWastageModalOpen(false)
  }

  // Create PO
  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault()
    const sup = suppliers.find((s) => s.id === poForm.supplierId)
    const item = inventory.find((i) => i.id === poForm.itemId)
    if (!sup || !item) return

    const total = Number((poForm.quantity * item.unitCost).toFixed(2))

    createPurchaseOrder({
      poNumber: `PO-${Date.now().toString().slice(-4)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      items: [
        {
          itemId: item.id,
          itemName: item.name,
          quantity: poForm.quantity,
          unit: item.unit,
          unitCost: item.unitCost,
          total,
        },
      ],
      totalAmount: total,
      expectedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
      notes: 'Urgent standard restock order',
    })

    toast('Purchase Order Issued', `Sent PO for ${item.name} to ${sup.name}`, 'success')
    setIsPoModalOpen(false)
  }

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager'

  return (
    <div className="space-y-6">
      {/* Header Banner (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5500] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Stock & Inventory Management</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  SYNC 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Ingredients, beverages, packaging, stock movements, purchase orders, and wastage tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isManagerOrAdmin && (
            <>
              <button
                onClick={() => setIsWastageModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#EF4444] hover:bg-[#DC2626] text-white border-2 border-black transition-colors cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Log Spoilage</span>
              </button>

              <button
                onClick={() => setIsPoModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#FF5500] hover:bg-[#E04B00] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Purchase Order</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5 Inventory Dashboard KPI Cards (Neo-Brutalist + Rounded-2xl) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="font-black uppercase tracking-wider text-black">Total Valuation</span>
            <div className="p-1.5 rounded-xl bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-[#15803D]">
            ₱{Math.round(totalValuation).toLocaleString()}
          </div>
          <p className="text-[11px] font-medium text-neutral-600 mt-0.5">{inventory.length} item lines</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="font-black uppercase tracking-wider text-black">Low Stock Items</span>
            <div className="p-1.5 rounded-xl bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-[#B45309]">
            {lowStockItems.length}
          </div>
          <p className="text-[11px] font-medium text-neutral-600 mt-0.5">Below threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000] transition-all">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="font-black uppercase tracking-wider text-black">Out of Stock</span>
            <div className="p-1.5 rounded-xl bg-[#EF4444] text-white border border-black shadow-[1px_1px_0px_0px_#000]">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-red-600">
            {outOfStockItems.length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">Critical zero balance</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Expiring Soon</span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-purple-600">
            {expiringItems.length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">Within 14 days</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
            <span>Active POs</span>
            <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-blue-600">
            {purchaseOrders.filter((p) => p.status === 'Sent').length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-0.5">Awaiting delivery</p>
        </div>
      </div>

      {/* Sub Tabs (Glassmorphic Pills) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 font-semibold rounded-2xl transition-all cursor-pointer ${
            activeTab === 'items'
              ? 'bg-orange-50/90 text-[#EA580C] border border-orange-200/80 shadow-2xs backdrop-blur-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-white/60'
          }`}
        >
          Inventory Master Catalog ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 font-semibold rounded-2xl transition-all cursor-pointer ${
            activeTab === 'movements'
              ? 'bg-orange-50/90 text-[#EA580C] border border-orange-200/80 shadow-2xs backdrop-blur-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-white/60'
          }`}
        >
          Stock Movement History ({stockMovements.length})
        </button>
        <button
          onClick={() => setActiveTab('purchase-orders')}
          className={`px-4 py-2 font-semibold rounded-2xl transition-all cursor-pointer ${
            activeTab === 'purchase-orders'
              ? 'bg-orange-50/90 text-[#EA580C] border border-orange-200/80 shadow-2xs backdrop-blur-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-white/60'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 font-semibold rounded-2xl transition-all cursor-pointer ${
            activeTab === 'suppliers'
              ? 'bg-orange-50/90 text-[#EA580C] border border-orange-200/80 shadow-2xs backdrop-blur-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-white/60'
          }`}
        >
          Supplier Directory ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('wastage')}
          className={`px-4 py-2 font-semibold rounded-2xl transition-all cursor-pointer ${
            activeTab === 'wastage'
              ? 'bg-orange-50/90 text-[#EA580C] border border-orange-200/80 shadow-2xs backdrop-blur-xs'
              : 'text-[#64748B] hover:text-[#172033] hover:bg-white/60'
          }`}
        >
          Wastage & Spoilage Logs ({wastageRecords.length})
        </button>
      </div>

      {/* TAB 1: INVENTORY ITEMS MASTER */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 backdrop-blur-md border border-white/80 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search item, SKU, supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/70 border border-[#E2E8F0] text-xs text-[#172033] placeholder-[#94A3B8] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="bg-white/70 border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-medium text-[#172033] focus:outline-none focus:border-[#EA580C]"
              >
                <option value="all">All Categories</option>
                <option value="ingredient">Ingredients</option>
                <option value="beverage">Beverages</option>
                <option value="packaging">Packaging</option>
                <option value="supplies">Restaurant Supplies</option>
              </select>
            </div>

            <div className="text-xs text-[#64748B] font-mono">
              Showing {filteredInventory.length} of {inventory.length} items
            </div>
          </div>

          {/* Master Table (Glassmorphic + Rounded-3xl) */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3.5">Item & SKU</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5 text-right">Available Stock</th>
                    <th className="p-3.5 text-right">Unit Cost</th>
                    <th className="p-3.5 text-right">Total Value</th>
                    <th className="p-3.5">Supplier</th>
                    <th className="p-3.5">Expiration</th>
                    <th className="p-3.5 text-center">Status</th>
                    {isManagerOrAdmin && <th className="p-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredInventory.map((item) => {
                    const isLow = item.stockQuantity <= item.minThreshold
                    const isZero = item.stockQuantity === 0
                    const totalVal = item.stockQuantity * item.unitCost

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div>
                            <p className="font-bold text-[#172033]">{item.name}</p>
                            <span className="font-mono text-[10px] text-[#64748B]">{item.sku} • {item.storageLocation}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {item.category}
                          </span>
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold">
                          <span className={isZero ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-[#172033]'}>
                            {item.stockQuantity.toLocaleString()} {item.unit}
                          </span>
                          <span className="block text-[10px] text-[#94A3B8] font-normal">Min: {item.minThreshold}</span>
                        </td>

                        <td className="p-3.5 text-right font-mono text-[#64748B]">
                          ₱{item.unitCost.toFixed(3)}
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold text-emerald-600">
                          ₱{Math.round(totalVal).toLocaleString()}
                        </td>

                        <td className="p-3.5 text-[#172033]">
                          <span className="truncate block max-w-[140px] text-[#64748B]">{item.supplierName}</span>
                        </td>

                        <td className="p-3.5 font-mono text-[11px] text-[#64748B]">
                          {item.expirationDate || 'N/A'}
                        </td>

                        <td className="p-3.5 text-center">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                              isZero
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : isLow
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isZero ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                          </span>
                        </td>

                        {isManagerOrAdmin && (
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedItemForAdjustment(item)
                                setIsStockAdjustmentModalOpen(true)
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#172033] text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer"
                            >
                              Adjust / Restock
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENT HISTORY & AUTO POS DEDUCTIONS */}
      {activeTab === 'movements' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Stock Movement Audit Trail</h3>
              <p className="text-xs text-[#64748B]">Audit trail every time ingredients are received, adjusted, or logged as spoilage.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-right">Qty Shift</th>
                  <th className="p-3 text-right">Cost Impact</th>
                  <th className="p-3">Reason / Reference</th>
                  <th className="p-3">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {stockMovements.map((sm) => {
                  const isPositive = sm.quantity > 0
                  return (
                    <tr key={sm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-[11px] text-[#64748B]">{sm.timestamp}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          sm.type === 'pos-deduction'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : sm.type === 'stock-in'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : sm.type === 'wastage'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {sm.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#172033]">{sm.itemName}</td>
                      <td className={`p-3 text-right font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isPositive ? `+${sm.quantity}` : sm.quantity} {sm.unit}
                      </td>
                      <td className="p-3 text-right font-mono text-[#64748B]">
                        ₱{Math.abs(sm.costImpact).toFixed(2)}
                      </td>
                      <td className="p-3 text-[#64748B] max-w-xs truncate">{sm.reason}</td>
                      <td className="p-3 text-[#64748B] font-mono text-[11px]">{sm.performedBy}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASE ORDERS */}
      {activeTab === 'purchase-orders' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Purchase Orders & Inbound Shipments</h3>
              <p className="text-xs text-[#64748B]">Receiving purchase orders automatically increments stock quantities.</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setIsPoModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                + New PO
              </button>
            )}
          </div>

          <div className="space-y-3">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#172033]">{po.poNumber}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      po.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {po.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#172033] mt-1">{po.supplierName}</p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Items: {po.items.map((i) => `${i.quantity}${i.unit} ${i.itemName}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] font-mono mt-1">
                    Ordered: {po.orderDate} • Expected: {po.expectedDeliveryDate}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-[#64748B]">Total Amount</span>
                    <p className="text-sm font-bold font-mono text-emerald-600">₱{po.totalAmount.toLocaleString()}</p>
                  </div>

                  {po.status !== 'Received' && isManagerOrAdmin && (
                    <button
                      onClick={() => {
                        receivePurchaseOrder(po.id)
                        toast('PO Received & Restocked', `Inventory updated from ${po.poNumber}`, 'success')
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Receive & Restock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-base text-[#172033]">Verified Food & Packaging Suppliers</h3>
            <p className="text-xs text-[#64748B]">Payment terms, ratings, and contact points for restaurant suppliers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#172033]">{sup.name}</h4>
                  <span className="text-xs font-mono font-bold text-amber-500">★ {sup.rating}</span>
                </div>
                <p className="text-xs text-[#EA580C] font-semibold">{sup.category}</p>
                <div className="text-xs text-[#64748B] space-y-0.5">
                  <p><span className="text-[#94A3B8]">Contact:</span> {sup.contactPerson}</p>
                  <p><span className="text-[#94A3B8]">Email:</span> {sup.email}</p>
                  <p><span className="text-[#94A3B8]">Phone:</span> {sup.phone}</p>
                  <p><span className="text-[#94A3B8]">Terms:</span> {sup.paymentTerms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WASTAGE & SPOILAGE */}
      {activeTab === 'wastage' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-base text-[#172033]">Kitchen Spoilage & Wastage Log</h3>
              <p className="text-xs text-[#64748B]">Track food loss reasons, quantities, and cost damage.</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setIsWastageModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                + Log Wastage
              </button>
            )}
          </div>

          <div className="space-y-3">
            {wastageRecords.map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#172033]">{w.itemName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      {w.reason}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Quantity lost: {w.quantity} {w.unit} • Reported by: {w.reportedBy} ({w.date})
                  </p>
                  {w.notes && <p className="text-[11px] text-[#94A3B8] mt-0.5">{w.notes}</p>}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#64748B]">Financial Loss</span>
                  <p className="text-sm font-bold font-mono text-red-600">-₱{w.costLoss.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT / RESTOCK */}
      {isStockAdjustmentModalOpen && selectedItemForAdjustment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#172033]">Stock Adjustment</h3>
                <p className="text-[11px] text-[#64748B]">{selectedItemForAdjustment.name} (Current: {selectedItemForAdjustment.stockQuantity} {selectedItemForAdjustment.unit})</p>
              </div>
              <button onClick={() => setIsStockAdjustmentModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAdjustmentSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['stock-in', 'stock-out', 'adjustment'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAdjustmentForm({ ...adjustmentForm, type: t })}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-colors cursor-pointer ${
                        adjustmentForm.type === t
                          ? 'bg-orange-50 text-[#EA580C] border-orange-300'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Quantity ({selectedItemForAdjustment.unit})</label>
                <input
                  type="number"
                  required
                  value={adjustmentForm.quantity}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono font-bold focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={adjustmentForm.reason}
                  onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockAdjustmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG WASTAGE */}
      {isWastageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Log Kitchen Spoilage or Waste</h3>
              <button onClick={() => setIsWastageModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleWastageSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Select Ingredient / Item</label>
                <select
                  value={wastageForm.itemId}
                  onChange={(e) => setWastageForm({ ...wastageForm, itemId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                >
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.stockQuantity} {inv.unit} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Quantity Lost</label>
                  <input
                    type="number"
                    required
                    value={wastageForm.quantity}
                    onChange={(e) => setWastageForm({ ...wastageForm, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono focus:outline-none focus:border-[#EA580C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Reason</label>
                  <select
                    value={wastageForm.reason}
                    onChange={(e) => setWastageForm({ ...wastageForm, reason: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                  >
                    <option value="Spoiled">Spoiled</option>
                    <option value="Expired">Expired</option>
                    <option value="Prep Spill">Prep Spill</option>
                    <option value="Kitchen Waste">Kitchen Waste</option>
                    <option value="Defective">Defective</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Incident Notes</label>
                <input
                  type="text"
                  value={wastageForm.notes}
                  onChange={(e) => setWastageForm({ ...wastageForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWastageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer shadow-sm"
                >
                  Record Spoilage Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW PURCHASE ORDER */}
      {isPoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#172033]">Create Purchase Order (PO)</h3>
              <button onClick={() => setIsPoModalOpen(false)} className="text-[#94A3B8] hover:text-[#172033] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Supplier</label>
                <select
                  value={poForm.supplierId}
                  onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Item to Reorder</label>
                <select
                  value={poForm.itemId}
                  onChange={(e) => setPoForm({ ...poForm, itemId: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] focus:outline-none focus:border-[#EA580C]"
                >
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (Unit cost: ₱{inv.unitCost}/{inv.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Order Quantity</label>
                <input
                  type="number"
                  required
                  value={poForm.quantity}
                  onChange={(e) => setPoForm({ ...poForm, quantity: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#172033] font-mono font-bold focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold cursor-pointer shadow-sm"
                >
                  Send Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
