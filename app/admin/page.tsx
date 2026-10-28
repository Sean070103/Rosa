'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Coffee,
  ShoppingBag,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  SlidersHorizontal,
  Flame,
  Snowflake,
  TrendingUp,
  Users,
  Printer,
  Copy,
  Trash2,
  Edit2,
  DollarSign,
  Sun,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import { AdminOrder, AdminReservation, MenuItem } from '@/lib/types'
import { MENU_ITEMS } from '@/lib/menu-data'
import { INITIAL_ADMIN_ORDERS, INITIAL_ADMIN_RESERVATIONS } from '@/lib/admin-data'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu' | 'analytics' | 'settings'>('orders')
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS)
  const [reservations, setReservations] = useState<AdminReservation[]>(INITIAL_ADMIN_RESERVATIONS)
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS.map((item) => ({ ...item, isAvailable: true })))
  
  // Store status
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [storeNotice, setStoreNotice] = useState('GOLDEN HOUR VERANDA IS 84% FULL TODAY')
  const [isNoticeSaved, setIsNoticeSaved] = useState(false)

  // Filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'queued' | 'brewing' | 'ready' | 'completed'>('all')
  const [resDateFilter, setResDateFilter] = useState<string>('all')
  const [menuSearch, setMenuSearch] = useState('')
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null)

  // New Menu Item Modal
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState(185)
  const [newItemCategory, setNewItemCategory] = useState<'signature' | 'pourover' | 'matcha-tea' | 'pastries-kitchen'>('signature')
  const [newItemImage, setNewItemImage] = useState('/cafe_pic/10005.jpg')
  const [newItemTag, setNewItemTag] = useState('NEW DROP')
  const [newItemDesc, setNewItemDesc] = useState('')

  // KPI Metrics Calculation
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders])
  const activeOrdersCount = useMemo(() => orders.filter((o) => o.status !== 'completed').length, [orders])
  const completedOrdersCount = useMemo(() => orders.filter((o) => o.status === 'completed').length, [orders])

  // Order status progression
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order
        if (order.status === 'queued') return { ...order, status: 'brewing' }
        if (order.status === 'brewing') return { ...order, status: 'ready' }
        if (order.status === 'ready') return { ...order, status: 'completed' }
        return order
      })
    )
  }

  // Reservation status update
  const updateReservationStatus = (resId: string, newStatus: 'confirmed' | 'seated' | 'cancelled') => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
    )
  }

  // Toggle Item Availability
  const toggleItemStock = (itemId: string) => {
    setMenuList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    )
  }

  // Update item price
  const updateItemPrice = (itemId: string, newPriceStr: string) => {
    const price = parseInt(newPriceStr, 10)
    if (isNaN(price)) return
    setMenuList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price } : item))
    )
  }

  // Copy order slip
  const copyOrderSlip = (order: AdminOrder) => {
    const text = `🌊 RORA DOSE ORDER TICKET [${order.id}]
TIME: ${order.time} | CUSTOMER: ${order.customer}
SERVICE: ${order.mode.toUpperCase()} - ${order.table}
PAYMENT: ${order.paymentMethod} (${order.paymentStatus.toUpperCase()})
---------------------------------------
${order.items.map((i) => `• ${i.quantity}x ${i.name} (${i.details}) - ₱${i.price}`).join('\n')}
---------------------------------------
TOTAL: ₱${order.total}`

    navigator.clipboard.writeText(text)
    setCopiedOrderId(order.id)
    setTimeout(() => setCopiedOrderId(null), 2000)
  }

  // Add new order simulation
  const addSimulatedOrder = () => {
    const id = `RD-${Math.floor(750 + Math.random() * 200)}`
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)]
    
    const newOrder: AdminOrder = {
      id,
      time,
      customer: ['Alex M.', 'Chloe V.', 'Gelo D.', 'Patricia K.', 'Neil C.'][Math.floor(Math.random() * 5)],
      mode: Math.random() > 0.3 ? 'dine-in' : 'takeaway',
      table: `Table ${Math.floor(1 + Math.random() * 10)} (Veranda)`,
      items: [
        {
          name: randomItem.name,
          quantity: 1,
          details: 'Iced · 75% Sweet · Oat Milk',
          price: randomItem.price + 35,
        },
      ],
      total: randomItem.price + 35,
      status: 'queued',
      paymentStatus: 'paid',
      paymentMethod: 'GCash',
    }
    setOrders([newOrder, ...orders])
  }

  // Handle Add Menu Item Submit
  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName) return

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newItemName,
      tagline: 'Artisanal Batch',
      description: newItemDesc || 'Handcrafted fresh at Rora Dose.',
      price: newItemPrice,
      category: newItemCategory,
      image: newItemImage,
      tag: newItemTag,
      tastingNotes: ['Specialty Roast', 'Fresh Batch'],
      temperature: 'both',
      isPopular: false,
      isAvailable: true,
    }

    setMenuList([newItem, ...menuList])
    setIsAddMenuOpen(false)
    setNewItemName('')
    setNewItemDesc('')
  }

  // Filtered views
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return orders
    return orders.filter((o) => o.status === orderFilter)
  }, [orders, orderFilter])

  const filteredReservations = useMemo(() => {
    if (resDateFilter === 'all') return reservations
    return reservations.filter((r) => r.date.toLowerCase() === resDateFilter.toLowerCase())
  }, [reservations, resDateFilter])

  const filteredMenuItems = useMemo(() => {
    return menuList.filter((item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase())
    )
  }, [menuList, menuSearch])

  return (
    <div className="min-h-screen bg-[#FFFDF0] bg-neo-grid text-black font-mono selection:bg-[#FFE600] selection:text-black">
      
      {/* Top Admin Bar */}
      <div className="border-b-4 border-black bg-[#FFE600] px-4 py-3 font-arcade text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-8 overflow-hidden border-2 border-black bg-[#4E3629]">
              <img
                src="/cafe_pic/10001.jpg"
                alt="Rora Dose RD Emblem"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="font-pixel text-xl font-bold tracking-tight text-black sm:text-2xl">
                RORA DOSE // TERMINAL OS
              </span>
              <span className="ml-2 bg-black px-1.5 py-0.5 text-[8px] font-bold text-[#FFE600]">
                v2.0 [LIVE]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-arcade text-[10px]">
            {/* Store Toggle */}
            <button
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`neo-btn flex items-center gap-1.5 px-3 py-1.5 text-black ${
                isStoreOpen ? 'bg-[#A3E635]' : 'bg-[#FF3366] text-white'
              }`}
            >
              <span className={`size-2 border border-black ${isStoreOpen ? 'bg-black animate-ping' : 'bg-white'}`} />
              <span>{isStoreOpen ? '[STORE: ONLINE (10AM-1AM)]' : '[STORE: PAUSED]'}</span>
            </button>

            {/* Link Back to Storefront */}
            <Link
              href="/"
              className="neo-btn flex items-center gap-1.5 bg-white px-3 py-1.5 text-black hover:bg-black hover:text-[#FFE600]"
            >
              <ArrowLeft className="size-3" />
              <span>STOREFRONT</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-8">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
          {/* Card 1: Revenue */}
          <div className="border-4 border-black bg-[#FFE600] p-4 shadow-[6px_6px_0_0_#000]">
            <span className="font-arcade text-[9px] text-black block">[GROSS SALES TODAY]</span>
            <p className="font-pixel text-3xl font-black text-black mt-1 sm:text-4xl">
              ₱{totalRevenue.toLocaleString()}
            </p>
            <p className="font-arcade text-[8px] text-black/70 mt-1">
              +18.4% VS LAST WEEK
            </p>
          </div>

          {/* Card 2: Active Orders */}
          <div className="border-4 border-black bg-[#00F0FF] p-4 shadow-[6px_6px_0_0_#000]">
            <span className="font-arcade text-[9px] text-black block">[ACTIVE KITCHEN QUEUE]</span>
            <p className="font-pixel text-3xl font-black text-black mt-1 sm:text-4xl">
              {activeOrdersCount} ORDERS
            </p>
            <p className="font-arcade text-[8px] text-black/70 mt-1">
              AVG PULL SPEED: 3.4 MINS
            </p>
          </div>

          {/* Card 3: Veranda Occupancy */}
          <div className="border-4 border-black bg-[#A3E635] p-4 shadow-[6px_6px_0_0_#000]">
            <span className="font-arcade text-[9px] text-black block">[VERANDA SUNSET BOOKINGS]</span>
            <p className="font-pixel text-3xl font-black text-black mt-1 sm:text-4xl">
              84% FULL
            </p>
            <p className="font-arcade text-[8px] text-black/70 mt-1">
              15/18 TABLES RESERVED
            </p>
          </div>

          {/* Card 4: Orders Completed */}
          <div className="border-4 border-black bg-[#FF8A00] p-4 shadow-[6px_6px_0_0_#000]">
            <span className="font-arcade text-[9px] text-black block">[COMPLETED TICKETS]</span>
            <p className="font-pixel text-3xl font-black text-black mt-1 sm:text-4xl">
              {completedOrdersCount} TICKETS
            </p>
            <p className="font-arcade text-[8px] text-black/70 mt-1">
              100% SATISFACTION RATE
            </p>
          </div>
        </div>

        {/* Live Broadcast Control Banner */}
        <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <span className="border-2 border-black bg-[#FF3366] px-2 py-1 font-arcade text-[9px] text-white">
              BROADCAST TAPE
            </span>
            <span className="font-arcade text-[10px] text-black">STORE NOTICE:</span>
          </div>
          <div className="flex-1 w-full flex gap-2">
            <input
              type="text"
              value={storeNotice}
              onChange={(e) => {
                setStoreNotice(e.target.value)
                setIsNoticeSaved(false)
              }}
              placeholder="Store announcement ticker text..."
              className="flex-1 border-2 border-black bg-[#FFFDF0] px-3 py-1.5 font-mono text-xs text-black focus:outline-none"
            />
            <button
              onClick={() => {
                setIsNoticeSaved(true)
                setTimeout(() => setIsNoticeSaved(false), 2000)
              }}
              className="neo-btn bg-[#FFE600] px-4 py-1.5 font-arcade text-[10px] text-black"
            >
              {isNoticeSaved ? '[SAVED!]' : 'UPDATE'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b-4 border-black pb-4 font-silk text-xs">
          {[
            { id: 'orders', label: `[1] LIVE ORDERS & KDS (${activeOrdersCount})`, color: 'bg-[#00F0FF]' },
            { id: 'reservations', label: `[2] SUNSET RESERVATIONS (${reservations.length})`, color: 'bg-[#A3E635]' },
            { id: 'menu', label: `[3] MENU & INVENTORY (${menuList.length})`, color: 'bg-[#FFE600]' },
            { id: 'analytics', label: '[4] REVENUE & METRICS', color: 'bg-[#FF8A00]' },
            { id: 'settings', label: '[5] STORE SETTINGS', color: 'bg-[#D8B4FE]' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`neo-btn px-4 py-3 font-bold ${
                activeTab === tab.id
                  ? `${tab.color} text-black shadow-[4px_4px_0_0_#000]`
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: LIVE ORDERS & KDS (Kitchen Display System) */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filter Bar & Simulated Order Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 font-arcade text-[10px]">
                {(['all', 'queued', 'brewing', 'ready', 'completed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`neo-btn px-3 py-1.5 font-bold uppercase ${
                      orderFilter === status
                        ? 'bg-black text-[#FFE600]'
                        : 'bg-white text-black'
                    }`}
                  >
                    {status} ({status === 'all' ? orders.length : orders.filter((o) => o.status === status).length})
                  </button>
                ))}
              </div>

              <button
                onClick={addSimulatedOrder}
                className="neo-btn flex items-center gap-1.5 bg-[#A3E635] px-3.5 py-2 font-arcade text-[10px] text-black"
              >
                <Plus className="size-3.5 stroke-[3]" />
                <span>+ SIMULATE INCOMING ORDER</span>
              </button>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => {
                const statusColors = {
                  queued: 'bg-[#FF3366] text-white',
                  brewing: 'bg-[#FFE600] text-black',
                  ready: 'bg-[#00F0FF] text-black',
                  completed: 'bg-[#A3E635] text-black',
                }

                return (
                  <div
                    key={order.id}
                    className="flex flex-col justify-between border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]"
                  >
                    <div className="space-y-4">
                      {/* Ticket Header */}
                      <div className="flex items-start justify-between border-b-3 border-black pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-pixel text-2xl font-black text-black">
                              {order.id}
                            </span>
                            <span className={`border-2 border-black px-2 py-0.5 font-arcade text-[9px] font-bold ${statusColors[order.status]}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="font-arcade text-[8px] text-black/60 mt-1">
                            {order.time} · {order.customer}
                          </p>
                        </div>
                        <span className="border border-black bg-[#FFFDF0] px-2 py-1 font-silk text-[10px] text-black">
                          {order.mode === 'dine-in' ? order.table : 'TAKEAWAY'}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 py-1 font-mono text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="border-b border-black/10 pb-1.5">
                            <div className="flex justify-between font-bold text-black">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-arcade text-[10px]">₱{item.price}</span>
                            </div>
                            <p className="font-mono text-[10px] text-black/60">{item.details}</p>
                          </div>
                        ))}
                      </div>

                      {/* Payment info & Total */}
                      <div className="border-t-2 border-dashed border-black pt-3 flex justify-between items-baseline font-mono text-xs">
                        <span className="font-arcade text-[8px] text-black/70">
                          PAYMENT: {order.paymentMethod} [{order.paymentStatus.toUpperCase()}]
                        </span>
                        <span className="font-arcade text-base font-bold bg-[#FFE600] px-1.5 py-0.5 border border-black">
                          ₱{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-3 border-t-3 border-black flex items-center gap-2 font-arcade text-[9px]">
                      {order.status !== 'completed' ? (
                        <button
                          onClick={() => advanceOrderStatus(order.id)}
                          className="neo-btn flex-1 bg-[#A3E635] py-2.5 text-black font-bold"
                        >
                          {order.status === 'queued' && '▶ START BREWING'}
                          {order.status === 'brewing' && '★ MARK READY'}
                          {order.status === 'ready' && '✓ COMPLETE ORDER'}
                        </button>
                      ) : (
                        <div className="flex-1 text-center py-2 text-[#22C55E] font-bold">
                          [✓ ORDER DELIVERED]
                        </div>
                      )}

                      <button
                        onClick={() => copyOrderSlip(order)}
                        title="Copy ticket"
                        className="neo-btn bg-white p-2.5 text-black hover:bg-[#FFE600]"
                      >
                        {copiedOrderId === order.id ? <Check className="size-3.5 stroke-[3]" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SUNSET RESERVATIONS */}
        {/* ========================================================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 font-arcade text-[10px]">
                {['all', 'Today', 'Tomorrow'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setResDateFilter(d)}
                    className={`neo-btn px-3 py-1.5 uppercase ${
                      resDateFilter === d
                        ? 'bg-black text-[#FFE600]'
                        : 'bg-white text-black'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="border-2 border-black bg-[#FFE600] px-3 py-1 font-arcade text-[10px] text-black">
                ★ 14 / 18 VERANDA SLOTS BOOKED ★
              </div>
            </div>

            {/* Reservations Table */}
            <div className="border-4 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-3 border-black bg-[#FFFDF0] font-arcade text-[9px] text-black">
                    <th className="p-3 border-r-2 border-black">REF #</th>
                    <th className="p-3 border-r-2 border-black">GUEST</th>
                    <th className="p-3 border-r-2 border-black">PHONE</th>
                    <th className="p-3 border-r-2 border-black">PARTY</th>
                    <th className="p-3 border-r-2 border-black">ZONE</th>
                    <th className="p-3 border-r-2 border-black">DATE & TIME</th>
                    <th className="p-3 border-r-2 border-black">STATUS</th>
                    <th className="p-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="border-b-2 border-black/20 hover:bg-[#FFFDF0]">
                      <td className="p-3 border-r-2 border-black/20 font-arcade text-[10px] font-bold">
                        {res.id}
                      </td>
                      <td className="p-3 border-r-2 border-black/20 font-bold">
                        {res.guestName}
                        {res.notes && (
                          <span className="block text-[10px] text-black/60 font-normal">
                            Note: {res.notes}
                          </span>
                        )}
                      </td>
                      <td className="p-3 border-r-2 border-black/20 font-mono text-xs">
                        <a href={`tel:${res.phone.replace(/\s+/g, '')}`} className="underline hover:text-[#FF5722]">
                          {res.phone}
                        </a>
                      </td>
                      <td className="p-3 border-r-2 border-black/20 font-arcade text-xs">
                        {res.guests} PAX
                      </td>
                      <td className="p-3 border-r-2 border-black/20">
                        <span className="bg-[#FFE600] px-1.5 py-0.5 border border-black font-silk text-[10px]">
                          {res.zone}
                        </span>
                      </td>
                      <td className="p-3 border-r-2 border-black/20 font-mono text-xs">
                        <strong>{res.date}</strong> @ {res.time}
                      </td>
                      <td className="p-3 border-r-2 border-black/20">
                        <span
                          className={`border border-black px-2 py-0.5 font-arcade text-[8px] ${
                            res.status === 'confirmed'
                              ? 'bg-[#00F0FF] text-black'
                              : res.status === 'seated'
                              ? 'bg-[#A3E635] text-black'
                              : 'bg-[#FF3366] text-white'
                          }`}
                        >
                          {res.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 space-x-1 font-arcade text-[8px]">
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'seated')}
                            className="neo-btn bg-[#A3E635] px-2 py-1 text-black"
                          >
                            SEAT
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'cancelled')}
                            className="neo-btn bg-[#FF3366] px-2 py-1 text-white"
                          >
                            CANCEL
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MENU & INVENTORY CONTROL */}
        {/* ========================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="SEARCH MENU ITEMS..."
                  className="w-full border-3 border-black bg-white px-3 py-2 font-mono text-xs text-black placeholder:text-black/50 shadow-[3px_3px_0_0_#000] focus:outline-none"
                />
              </div>

              <button
                onClick={() => setIsAddMenuOpen(true)}
                className="neo-btn flex items-center gap-1.5 bg-[#FFE600] px-4 py-2 font-arcade text-xs text-black"
              >
                <Plus className="size-4 stroke-[3]" />
                <span>+ ADD NEW MENU ITEM</span>
              </button>
            </div>

            {/* Menu List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className={`border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-col justify-between ${
                    item.isAvailable ? 'bg-white' : 'bg-neutral-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="size-16 shrink-0 border-2 border-black overflow-hidden bg-black">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-arcade text-[8px] text-[#FF5722]">
                          [{item.category.toUpperCase()}]
                        </span>
                        <h4 className="font-pixel text-lg font-bold text-black truncate leading-tight">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-arcade text-[9px] text-black">₱</span>
                          <input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => updateItemPrice(item.id, e.target.value)}
                            className="w-16 border border-black bg-[#FFFDF0] px-1.5 py-0.5 font-arcade text-xs text-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="font-mono text-[11px] text-black/75 mt-3 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Stock Toggle Button */}
                  <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between font-arcade text-[9px]">
                    <span className="text-black/60">
                      STATUS: {item.isAvailable ? 'AVAILABLE' : 'SOLD OUT'}
                    </span>
                    <button
                      onClick={() => toggleItemStock(item.id)}
                      className={`neo-btn px-3 py-1.5 ${
                        item.isAvailable
                          ? 'bg-[#A3E635] text-black'
                          : 'bg-[#FF3366] text-white'
                      }`}
                    >
                      {item.isAvailable ? '[IN STOCK]' : '[SOLD OUT]'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: REVENUE & SALES ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 8-Bit Hourly Traffic Bar Graph */}
            <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] space-y-4">
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <div>
                  <span className="font-arcade text-[9px] text-[#FF5722]">[SALES PEAK ANALYSIS]</span>
                  <h3 className="font-pixel text-2xl font-bold text-black">
                    HOURLY TRAFFIC BY THE BAY
                  </h3>
                </div>
                <span className="border-2 border-black bg-[#FFE600] px-2 py-1 font-arcade text-[9px]">
                  PEAK: 4:30 PM — 6:30 PM
                </span>
              </div>

              {/* Bar graph representation */}
              <div className="grid grid-cols-8 gap-2 items-end pt-4 h-48 border-b-2 border-black font-arcade text-[8px] text-center">
                {[
                  { time: '10 AM', height: '35%', count: '₱2,100', color: 'bg-[#00F0FF]' },
                  { time: '12 PM', height: '50%', count: '₱3,800', color: 'bg-[#00F0FF]' },
                  { time: '2 PM', height: '40%', count: '₱2,900', color: 'bg-[#00F0FF]' },
                  { time: '4 PM', height: '80%', count: '₱6,400', color: 'bg-[#FFE600]' },
                  { time: '5 PM', height: '100%', count: '₱8,900', color: 'bg-[#A3E635]' },
                  { time: '6 PM', height: '90%', count: '₱7,100', color: 'bg-[#A3E635]' },
                  { time: '8 PM', height: '65%', count: '₱4,800', color: 'bg-[#FF8A00]' },
                  { time: '10 PM', height: '45%', count: '₱3,100', color: 'bg-[#D8B4FE]' },
                ].map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[7px] text-black font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.count}
                    </span>
                    <div
                      className={`w-full border-2 border-black ${bar.color} transition-all duration-300 shadow-[2px_2px_0_0_#000]`}
                      style={{ height: bar.height }}
                    />
                    <span className="mt-2 text-black/70">{bar.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Best-selling Drinks */}
              <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] space-y-3">
                <span className="font-arcade text-[9px] text-[#FF5722] block">[TOP SIP RANKINGS]</span>
                <h4 className="font-pixel text-xl font-bold text-black">BEST-SELLING ITEMS TODAY</h4>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { name: 'Honey Sea Salt Latte', sales: '48 Cups', rev: '₱8,880', share: '32%' },
                    { name: 'Ceremonial Biscoff Matcha', sales: '34 Cups', rev: '₱6,630', share: '24%' },
                    { name: 'Coconut Cloud Cold Brew', sales: '28 Cups', rev: '₱4,900', share: '18%' },
                    { name: 'Giant Double Choco Palm Cookie', sales: '24 Bakes', rev: '₱3,480', share: '12%' },
                    { name: 'Bay Flatbread Artisan Pizza', sales: '19 Pizzas', rev: '₱4,560', share: '14%' },
                  ].map((item, idx) => (
                    <div key={idx} className="border-b border-black/10 pb-1.5 flex justify-between items-center">
                      <div>
                        <span className="font-arcade text-[9px] text-[#FF5722] mr-2">#{idx + 1}</span>
                        <strong className="text-black">{item.name}</strong>
                        <span className="text-[10px] text-black/60 block">{item.sales} sold</span>
                      </div>
                      <span className="font-arcade text-xs text-black bg-[#FFE600] px-1.5 py-0.5 border border-black">
                        {item.rev}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods & Terroir Stats */}
              <div className="border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_#000] space-y-4">
                <span className="font-arcade text-[9px] text-[#FF5722] block">[PAYMENT CHANNEL SPLIT]</span>
                <h4 className="font-pixel text-xl font-bold text-black">PAYMENT PREFERENCES</h4>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between font-arcade text-[9px] mb-1">
                      <span>GCASH QR PH</span>
                      <span>62% (₱17,639)</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-white p-0.5">
                      <div className="h-full bg-[#00F0FF] w-[62%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-arcade text-[9px] mb-1">
                      <span>MAYA WALLET</span>
                      <span>18% (₱5,121)</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-white p-0.5">
                      <div className="h-full bg-[#A3E635] w-[18%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-arcade text-[9px] mb-1">
                      <span>CREDIT / DEBIT CARDS</span>
                      <span>12% (₱3,414)</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-white p-0.5">
                      <div className="h-full bg-[#FFE600] w-[12%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-arcade text-[9px] mb-1">
                      <span>CASH AT BAR COUNTER</span>
                      <span>8% (₱2,276)</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-white p-0.5">
                      <div className="h-full bg-[#FF8A00] w-[8%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: STORE SETTINGS & LOGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="border-4 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#000] space-y-6 animate-in fade-in duration-150">
            <div className="border-b-3 border-black pb-3">
              <span className="font-arcade text-[9px] text-[#FF5722]">[SYSTEM CONFIGURATION]</span>
              <h3 className="font-pixel text-3xl font-bold text-black">STORE CONTROLS & LOGS</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2 font-mono text-xs">
              <div className="space-y-4">
                <div>
                  <label className="font-arcade text-[9px] text-black block mb-1">
                    [STORE SCHEDULE]
                  </label>
                  <input
                    type="text"
                    defaultValue="10:00 AM — 1:00 AM Daily"
                    className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-2 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-black block mb-1">
                    [RESORT CONCIERGE ACCESS NOTE]
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Cafe guests at Rora Dose are granted free pass through Queen Aurora Garden Resort main gate. Free parking in Section B."
                    className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-2 text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[9px] text-black block mb-1">
                    [BARISTA HELPLINE]
                  </label>
                  <input
                    type="text"
                    defaultValue="0927 953 2665"
                    className="w-full border-2 border-black bg-[#FFFDF0] px-3 py-2 text-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Activity Audit Log */}
              <div className="border-3 border-black bg-[#FFFDF0] p-4 space-y-2">
                <span className="font-arcade text-[9px] text-black block">[SECURITY AUDIT LOG]</span>
                <div className="space-y-2 text-[11px] text-black/80 font-mono">
                  <p>• 10:35 AM - Order #RD-743 queued (Maya QR)</p>
                  <p>• 10:32 AM - Order #RD-742 moved to [BREWING]</p>
                  <p>• 10:28 AM - Order #RD-744 marked [READY AT COUNTER]</p>
                  <p>• 10:15 AM - Reservation #RES-1051 seated at Slow Bar</p>
                  <p>• 09:45 AM - System calibration: RO water at 120 PPM</p>
                  <p>• 09:00 AM - Morning bakes received from oven</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Settings saved successfully to Rora Dose HQ!')}
              className="neo-btn bg-[#FFE600] px-6 py-3 font-arcade text-xs text-black"
            >
              ★ SAVE STORE SETTINGS ★
            </button>
          </div>
        )}

      </div>

      {/* Modal: Add New Menu Item */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md border-4 border-black bg-[#FFFDF0] shadow-[12px_12px_0_0_#000]">
            <div className="flex items-center justify-between border-b-4 border-black bg-[#FFE600] px-4 py-2.5 font-arcade text-xs">
              <span>+ ADD_MENU_ITEM.EXE</span>
              <button
                onClick={() => setIsAddMenuOpen(false)}
                className="size-6 border-2 border-black bg-[#FF3366] text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMenuItem} className="p-5 space-y-4 font-mono text-xs">
              <div>
                <label className="font-arcade text-[8px] text-black block mb-1">ITEM NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ube Cold Foam Latte"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-arcade text-[8px] text-black block mb-1">PRICE (₱)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(parseInt(e.target.value, 10))}
                    className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none font-arcade text-xs"
                  />
                </div>

                <div>
                  <label className="font-arcade text-[8px] text-black block mb-1">CATEGORY</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as typeof newItemCategory)}
                    className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none text-xs"
                  >
                    <option value="signature">Signature Sips</option>
                    <option value="pourover">Single Origin</option>
                    <option value="matcha-tea">Matcha &amp; Botanicals</option>
                    <option value="pastries-kitchen">Bakes &amp; Kitchen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-arcade text-[8px] text-black block mb-1">SELECT AUTHENTIC PHOTO</label>
                <select
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none text-xs"
                >
                  <option value="/cafe_pic/10005.jpg">10005.jpg - Hot Latte Art</option>
                  <option value="/cafe_pic/10004.jpg">10004.jpg - Ribbed Glass Iced Sips</option>
                  <option value="/cafe_pic/10018.jpg">10018.jpg - Resort Pool Iced Cups</option>
                  <option value="/cafe_pic/10011.jpg">10011.jpg - Biscoff Matcha</option>
                  <option value="/cafe_pic/10015.jpg">10015.jpg - Giant Choco Palm Cookie</option>
                  <option value="/cafe_pic/10020.jpg">10020.jpg - Woodfired Flatbread Pizza</option>
                </select>
              </div>

              <div>
                <label className="font-arcade text-[8px] text-black block mb-1">BADGE TAG</label>
                <input
                  type="text"
                  value={newItemTag}
                  onChange={(e) => setNewItemTag(e.target.value)}
                  className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-arcade text-[8px] text-black block mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Ingredients, roast profile, tasting notes..."
                  className="w-full border-2 border-black bg-white px-3 py-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="neo-btn w-full bg-[#FFE600] py-3 font-arcade text-xs text-black"
              >
                ★ CONFIRM &amp; ADD TO MENU ★
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
