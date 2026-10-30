'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Flame,
  TrendingUp,
  Users,
  Printer,
  Copy,
  Trash2,
  DollarSign,
  Sun,
  ShieldCheck,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Store,
  X,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
  Receipt,
  Columns,
  List,
  Building2,
  Activity,
  ArrowUpRight,
  Menu,
} from 'lucide-react'
import { AdminOrder, AdminReservation, BranchId, MenuItem } from '@/lib/types'
import { MENU_ITEMS } from '@/lib/menu-data'
import {
  BRANCH_CONFIG,
  INITIAL_ADMIN_ORDERS_LAKE,
  INITIAL_ADMIN_ORDERS_NIUGAN,
  INITIAL_ADMIN_RESERVATIONS_LAKE,
  INITIAL_ADMIN_RESERVATIONS_NIUGAN,
} from '@/lib/admin-data'

interface CafeTable {
  id: string
  name: string
  branch: BranchId
  zone: string
  capacity: number
  status: 'occupied' | 'reserved' | 'available'
  currentGuest?: string
  partySize?: number
  orderId?: string
  timeElapsed?: string
}

const INITIAL_TABLES_LAKE: CafeTable[] = [
  { id: 'T-V1', name: 'Veranda 1', branch: 'lake', zone: 'Waterfront Bay Veranda', capacity: 4, status: 'occupied', currentGuest: 'Camille S.', partySize: 3, orderId: 'RD-LKE-742', timeElapsed: '28m' },
  { id: 'T-V2', name: 'Veranda 2', branch: 'lake', zone: 'Waterfront Bay Veranda', capacity: 2, status: 'available' },
  { id: 'T-V3', name: 'Veranda 3', branch: 'lake', zone: 'Waterfront Bay Veranda', capacity: 4, status: 'reserved', currentGuest: 'Sophia B. (5:15 PM)', partySize: 4 },
  { id: 'T-V4', name: 'Veranda 4', branch: 'lake', zone: 'Waterfront Bay Veranda', capacity: 4, status: 'occupied', currentGuest: 'Denise R.', partySize: 2, orderId: 'RD-LKE-740', timeElapsed: '45m' },
  { id: 'T-P1', name: 'Pool 1', branch: 'lake', zone: 'Resort Poolside Deck', capacity: 4, status: 'occupied', currentGuest: 'Mark T.', partySize: 3, orderId: 'RD-LKE-743', timeElapsed: '18m' },
  { id: 'T-P2', name: 'Pool 2', branch: 'lake', zone: 'Resort Poolside Deck', capacity: 4, status: 'reserved', currentGuest: 'Joshua G. (4:30 PM)', partySize: 2 },
  { id: 'T-G1', name: 'Garden 1', branch: 'lake', zone: 'Garden Courtyard Gazebo', capacity: 6, status: 'reserved', currentGuest: 'Bea Alonzo (6:30 PM)', partySize: 6 },
  { id: 'T-B1', name: 'Slow Bar 1', branch: 'lake', zone: 'Indoor Slow Bar AC', capacity: 1, status: 'occupied', currentGuest: 'Miguel Tan', partySize: 1, timeElapsed: '50m' },
]

const INITIAL_TABLES_NIUGAN: CafeTable[] = [
  { id: 'T-S1', name: 'Study Pod 1', branch: 'niugan', zone: 'Study Stalls & Co-Work (AC)', capacity: 2, status: 'occupied', currentGuest: 'Janelle D.', partySize: 1, orderId: 'RD-NGN-102', timeElapsed: '1h 10m' },
  { id: 'T-S2', name: 'Study Pod 2', branch: 'niugan', zone: 'Study Stalls & Co-Work (AC)', capacity: 4, status: 'reserved', currentGuest: 'Prof. Reyes (2:00 PM)', partySize: 4 },
  { id: 'T-S3', name: 'Study Pod 3', branch: 'niugan', zone: 'Study Stalls & Co-Work (AC)', capacity: 6, status: 'reserved', currentGuest: 'Ateneo Group (9:00 AM)', partySize: 6 },
  { id: 'T-M1', name: 'Main Hall 1', branch: 'niugan', zone: 'Main Espresso Hall', capacity: 4, status: 'occupied', currentGuest: 'Dr. Raymond Cruz', partySize: 2, orderId: 'RD-NGN-103', timeElapsed: '25m' },
  { id: 'T-M2', name: 'Main Hall 2', branch: 'niugan', zone: 'Main Espresso Hall', capacity: 4, status: 'available' },
  { id: 'T-M3', name: 'Main Hall 3', branch: 'niugan', zone: 'Main Espresso Hall', capacity: 2, status: 'available' },
  { id: 'T-A1', name: 'Patio 1', branch: 'niugan', zone: 'Alfresco Patio', capacity: 4, status: 'reserved', currentGuest: 'Dave & Chloe (4:00 PM)', partySize: 2 },
  { id: 'T-A2', name: 'Patio 2', branch: 'niugan', zone: 'Alfresco Patio', capacity: 2, status: 'available' },
]

interface BranchAdminDashboardProps {
  initialBranch?: BranchId | 'both'
  fixedBranch?: BranchId
}

export function BranchAdminDashboard({ initialBranch = 'lake', fixedBranch }: BranchAdminDashboardProps) {
  // Active Branch Switcher (Niugan vs Lake vs Consolidated 'both')
  const [currentBranch, setCurrentBranch] = useState<BranchId | 'both'>(fixedBranch || initialBranch)

  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'reservations' | 'menu' | 'floor' | 'analytics' | 'settings'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [ordersViewMode, setOrdersViewMode] = useState<'kanban' | 'list'>('kanban')
  const [mobileKanbanStage, setMobileKanbanStage] = useState<'queued' | 'brewing' | 'ready' | 'completed'>('queued')

  // Orders State per Branch
  const [lakeOrders, setLakeOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS_LAKE)
  const [niuganOrders, setNiuganOrders] = useState<AdminOrder[]>(INITIAL_ADMIN_ORDERS_NIUGAN)

  // Reservations State per Branch
  const [lakeReservations, setLakeReservations] = useState<AdminReservation[]>(INITIAL_ADMIN_RESERVATIONS_LAKE)
  const [niuganReservations, setNiuganReservations] = useState<AdminReservation[]>(INITIAL_ADMIN_RESERVATIONS_NIUGAN)

  // Tables State per Branch
  const [lakeTables, setLakeTables] = useState<CafeTable[]>(INITIAL_TABLES_LAKE)
  const [niuganTables, setNiuganTables] = useState<CafeTable[]>(INITIAL_TABLES_NIUGAN)

  // Menu Items State
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS.map((item) => ({ ...item, isAvailable: true })))

  // Store Controls
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [rushMode, setRushMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Live Marquee Tickers per Branch
  const [storeNoticeLake, setStoreNoticeLake] = useState('GOLDEN HOUR VERANDA IS 84% FULL TODAY · SUNSET SPECIALS AT 5 PM')
  const [storeNoticeNiugan, setStoreNoticeNiugan] = useState('NIUGAN STUDY PODS ARE 78% RESERVED · MORNING ESPRESSO BATCH FRESH')
  const [isNoticeSaved, setIsNoticeSaved] = useState(false)

  // Modals
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isAddResOpen, setIsAddResOpen] = useState(false)
  const [receiptOrder, setReceiptOrder] = useState<AdminOrder | null>(null)
  const [selectedTable, setSelectedTable] = useState<CafeTable | null>(null)

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState<'all' | 'queued' | 'brewing' | 'ready' | 'completed'>('all')
  const [resDateFilter, setResDateFilter] = useState<string>('all')
  const [menuSearch, setMenuSearch] = useState('')
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all')
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Live Time
  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Audio synthesizer
  const playSound = (type: 'chime' | 'click' | 'success') => {
    if (!soundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      if (type === 'chime') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35)
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.35)
      } else if (type === 'success') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, audioCtx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.25)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, audioCtx.currentTime)
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05)
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.05)
      }
    } catch {
      // AudioContext fallback
    }
  }

  // Active Branch Context Data
  const branchMeta = currentBranch === 'both' ? null : BRANCH_CONFIG[currentBranch]
  const currentOrders = useMemo(() => {
    if (currentBranch === 'lake') return lakeOrders
    if (currentBranch === 'niugan') return niuganOrders
    return [...lakeOrders, ...niuganOrders]
  }, [currentBranch, lakeOrders, niuganOrders])

  const currentReservations = useMemo(() => {
    if (currentBranch === 'lake') return lakeReservations
    if (currentBranch === 'niugan') return niuganReservations
    return [...lakeReservations, ...niuganReservations]
  }, [currentBranch, lakeReservations, niuganReservations])

  const currentTables = useMemo(() => {
    if (currentBranch === 'lake') return lakeTables
    if (currentBranch === 'niugan') return niuganTables
    return [...lakeTables, ...niuganTables]
  }, [currentBranch, lakeTables, niuganTables])

  // KPI Calculations
  const totalRevenue = useMemo(() => currentOrders.reduce((sum, o) => sum + o.total, 0), [currentOrders])
  const activeOrdersCount = useMemo(() => currentOrders.filter((o) => o.status !== 'completed').length, [currentOrders])
  const brewingOrdersCount = useMemo(() => currentOrders.filter((o) => o.status === 'brewing').length, [currentOrders])
  const queuedOrdersCount = useMemo(() => currentOrders.filter((o) => o.status === 'queued').length, [currentOrders])
  const completedOrdersCount = useMemo(() => currentOrders.filter((o) => o.status === 'completed').length, [currentOrders])
  const avgOrderValue = useMemo(() => (currentOrders.length ? Math.round(totalRevenue / currentOrders.length) : 0), [currentOrders, totalRevenue])

  // Cross-Branch Aggregated Revenue
  const lakeRevenue = useMemo(() => lakeOrders.reduce((sum, o) => sum + o.total, 0), [lakeOrders])
  const niuganRevenue = useMemo(() => niuganOrders.reduce((sum, o) => sum + o.total, 0), [niuganOrders])

  // Advance Order Status
  const advanceOrderStatus = (orderId: string) => {
    playSound('click')
    const updater = (orders: AdminOrder[]) =>
      orders.map((order) => {
        if (order.id !== orderId) return order
        if (order.status === 'queued') {
          showToast(`Order #${orderId} moved to Brewing`)
          return { ...order, status: 'brewing' as const }
        }
        if (order.status === 'brewing') {
          showToast(`Order #${orderId} is Ready at Bar!`)
          return { ...order, status: 'ready' as const }
        }
        if (order.status === 'ready') {
          playSound('success')
          showToast(`Order #${orderId} Completed & Delivered`)
          return { ...order, status: 'completed' as const }
        }
        return order
      })

    setLakeOrders(updater)
    setNiuganOrders(updater)
  }

  // Reservation Status
  const updateReservationStatus = (resId: string, newStatus: 'confirmed' | 'seated' | 'cancelled') => {
    playSound('click')
    const updater = (resList: AdminReservation[]) =>
      resList.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))

    setLakeReservations(updater)
    setNiuganReservations(updater)
    showToast(`Reservation #${resId} marked as ${newStatus}`)
  }

  // Stock Toggle
  const toggleItemStock = (itemId: string) => {
    playSound('click')
    setMenuList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextState = !item.isAvailable
          showToast(`${item.name} is now ${nextState ? 'In Stock' : 'Marked Sold Out (86)'}`)
          return { ...item, isAvailable: nextState }
        }
        return item
      })
    )
  }

  // Copy Ticket
  const copyOrderSlip = (order: AdminOrder) => {
    const branchName = order.branch === 'niugan' ? 'NIUGAN DOWNTOWN BRANCH' : 'LAKEFRONT WATERFRONT BRANCH'
    const text = `🌊 ROSA DOSE [${branchName}] · TICKET [${order.id}]
TIME: ${order.time} | CUSTOMER: ${order.customer}
SERVICE: ${order.mode.toUpperCase()} - ${order.table}
PAYMENT: ${order.paymentMethod} (${order.paymentStatus.toUpperCase()})
---------------------------------------
${order.items.map((i) => `• ${i.quantity}x ${i.name} (${i.details}) - ₱${i.price}`).join('\n')}
---------------------------------------
TOTAL: ₱${order.total}`

    navigator.clipboard.writeText(text)
    setCopiedOrderId(order.id)
    showToast(`Ticket #${order.id} copied to clipboard!`)
    setTimeout(() => setCopiedOrderId(null), 2000)
  }

  // Simulate Order
  const addSimulatedOrder = () => {
    const targetBranch = currentBranch === 'both' ? 'lake' : currentBranch
    const prefix = targetBranch === 'niugan' ? 'RD-NGN' : 'RD-LKE'
    const id = `${prefix}-${Math.floor(200 + Math.random() * 700)}`
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)]
    
    const newOrder: AdminOrder = {
      id,
      branch: targetBranch,
      time,
      customer: targetBranch === 'niugan' 
        ? ['Janelle D.', 'Engr. Kenneth', 'Dave P.', 'Ateneo Group', 'Dr. Cruz'][Math.floor(Math.random() * 5)]
        : ['Camille S.', 'Mark T.', 'Sophia B.', 'Denise R.', 'Leo B.'][Math.floor(Math.random() * 5)],
      mode: Math.random() > 0.4 ? 'dine-in' : 'takeaway',
      table: targetBranch === 'niugan' ? `Study Pod #${Math.floor(1 + Math.random() * 6)}` : `Veranda Table #${Math.floor(1 + Math.random() * 6)}`,
      items: [
        {
          name: randomItem.name,
          quantity: 1,
          details: 'Iced · 75% Sweet · Oat Milk',
          price: randomItem.price,
        },
      ],
      total: randomItem.price,
      status: 'queued',
      paymentStatus: 'paid',
      paymentMethod: ['GCash', 'Maya', 'Card', 'Cash'][Math.floor(Math.random() * 4)] as 'GCash' | 'Maya' | 'Card' | 'Cash',
    }

    if (targetBranch === 'niugan') {
      setNiuganOrders((prev) => [newOrder, ...prev])
    } else {
      setLakeOrders((prev) => [newOrder, ...prev])
    }

    playSound('chime')
    showToast(`🔔 New Order #${id} placed at ${targetBranch === 'niugan' ? 'Niugan Branch' : 'Lake Branch'}!`)
  }

  // POS Order Form State
  const [orderCustomer, setOrderCustomer] = useState('')
  const [orderBranch, setOrderBranch] = useState<BranchId>(currentBranch === 'niugan' ? 'niugan' : 'lake')
  const [orderMode, setOrderMode] = useState<'dine-in' | 'takeaway'>('dine-in')
  const [orderTable, setOrderTable] = useState('Table 1')
  const [orderPayment, setOrderPayment] = useState<'GCash' | 'Cash' | 'Maya' | 'Card'>('GCash')
  const [cartEntries, setCartEntries] = useState<{ id: string; qty: number }[]>([
    { id: MENU_ITEMS[0]?.id || 'item-1', qty: 1 },
  ])

  // Handle Manual POS Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderCustomer.trim()) return

    const orderItems = cartEntries
      .map((entry) => {
        const item = menuList.find((m) => m.id === entry.id)
        if (!item) return null
        return {
          name: item.name,
          quantity: entry.qty,
          details: 'Handcrafted Batch',
          price: item.price * entry.qty,
        }
      })
      .filter(Boolean) as AdminOrder['items']

    if (orderItems.length === 0) return

    const total = orderItems.reduce((acc, curr) => acc + curr.price, 0)
    const prefix = orderBranch === 'niugan' ? 'RD-NGN' : 'RD-LKE'
    const id = `${prefix}-${Math.floor(300 + Math.random() * 600)}`
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

    const newOrder: AdminOrder = {
      id,
      branch: orderBranch,
      time,
      customer: orderCustomer,
      mode: orderMode,
      table: orderMode === 'takeaway' ? 'Express Counter' : orderTable,
      items: orderItems,
      total,
      status: 'queued',
      paymentStatus: 'paid',
      paymentMethod: orderPayment,
    }

    if (orderBranch === 'niugan') {
      setNiuganOrders([newOrder, ...niuganOrders])
    } else {
      setLakeOrders([newOrder, ...lakeOrders])
    }

    setIsAddOrderOpen(false)
    setOrderCustomer('')
    playSound('chime')
    showToast(`Order #${id} created at ${orderBranch === 'niugan' ? 'Niugan' : 'Lake'}!`)
  }

  // Reservation Form State
  const [resGuestName, setResGuestName] = useState('')
  const [resBranch, setResBranch] = useState<BranchId>(currentBranch === 'niugan' ? 'niugan' : 'lake')
  const [resPhone, setResPhone] = useState('')
  const [resPax, setResPax] = useState(2)
  const [resZone, setResZone] = useState('Waterfront Bay Veranda')
  const [resDate, setResDate] = useState('Today')
  const [resTime, setResTime] = useState('5:15 PM')
  const [resNotes, setResNotes] = useState('')

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!resGuestName.trim() || !resPhone.trim()) return

    const prefix = resBranch === 'niugan' ? 'RES-NGN' : 'RES-LKE'
    const newRes: AdminReservation = {
      id: `${prefix}-${Math.floor(300 + Math.random() * 600)}`,
      branch: resBranch,
      guestName: resGuestName,
      phone: resPhone,
      guests: resPax,
      zone: resZone,
      date: resDate,
      time: resTime,
      status: 'confirmed',
      notes: resNotes || 'Reserved via Admin Terminal',
    }

    if (resBranch === 'niugan') {
      setNiuganReservations([newRes, ...niuganReservations])
    } else {
      setLakeReservations([newRes, ...lakeReservations])
    }

    setIsAddResOpen(false)
    setResGuestName('')
    setResPhone('')
    setResNotes('')
    playSound('success')
    showToast(`Reservation #${newRes.id} confirmed for ${newRes.guestName}!`)
  }

  // Filtered views
  const filteredOrders = useMemo(() => {
    return currentOrders.filter((o) => {
      const matchesFilter = orderFilter === 'all' || o.status === orderFilter
      const matchesSearch =
        !globalSearch ||
        o.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
        o.customer.toLowerCase().includes(globalSearch.toLowerCase()) ||
        o.items.some((i) => i.name.toLowerCase().includes(globalSearch.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }, [currentOrders, orderFilter, globalSearch])

  const filteredReservations = useMemo(() => {
    return currentReservations.filter((r) => {
      const matchesDate = resDateFilter === 'all' || r.date.toLowerCase() === resDateFilter.toLowerCase()
      const matchesSearch =
        !globalSearch ||
        r.guestName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        r.zone.toLowerCase().includes(globalSearch.toLowerCase()) ||
        r.phone.includes(globalSearch)
      return matchesDate && matchesSearch
    })
  }, [currentReservations, resDateFilter, globalSearch])

  const filteredMenuItems = useMemo(() => {
    return menuList.filter((item) => {
      const matchesCategory = menuCategoryFilter === 'all' || item.category === menuCategoryFilter
      const matchesSearch =
        !menuSearch ||
        item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(menuSearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [menuList, menuCategoryFilter, menuSearch])

  // Hourly Traffic Data
  const hourlyTraffic = [
    { hour: '10 AM', revenue: 2450, orders: 8, height: '32%', peak: false },
    { hour: '11 AM', revenue: 3100, orders: 11, height: '40%', peak: false },
    { hour: '12 PM', revenue: 4200, orders: 14, height: '54%', peak: false },
    { hour: '1 PM', revenue: 3600, orders: 12, height: '46%', peak: false },
    { hour: '2 PM', revenue: 2900, orders: 9, height: '38%', peak: false },
    { hour: '3 PM', revenue: 4100, orders: 13, height: '52%', peak: false },
    { hour: '4 PM', revenue: 6800, orders: 21, height: '82%', peak: true },
    { hour: '5 PM', revenue: 9400, orders: 28, height: '100%', peak: true },
    { hour: '6 PM', revenue: 7900, orders: 24, height: '88%', peak: true },
    { hour: '7 PM', revenue: 5600, orders: 17, height: '68%', peak: false },
    { hour: '8 PM', revenue: 4800, orders: 15, height: '58%', peak: false },
    { hour: '9 PM', revenue: 5200, orders: 16, height: '62%', peak: false },
    { hour: '10 PM', revenue: 3400, orders: 10, height: '44%', peak: false },
    { hour: '11 PM', revenue: 2100, orders: 7, height: '30%', peak: false },
  ]

  return (
    <div className="min-h-screen bg-[#FAF4E8] text-[#341F14] font-sans antialiased selection:bg-[#FBE48A] selection:text-[#341F14]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-2.5 rounded-2xl border-2 border-[#1A3B2F] bg-[#1A3B2F] px-4 py-3 text-xs sm:text-sm font-semibold text-[#FAF4E8] shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 shrink-0 text-[#A3E635]" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* TOP MASTER ADMIN BAR WITH STORE SWITCHER */}
      <header className="sticky top-0 z-40 border-b-2 border-[#1A3B2F]/20 bg-[#FAF4E8]/95 backdrop-blur-md">
        
        {/* Branch Selector Ribbon: Scrollable on mobile */}
        <div className="border-b border-[#1A3B2F]/15 bg-[#1A3B2F] px-3 py-1.5 text-xs text-[#FAF4E8]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-editorial italic font-bold text-[#FBE48A] text-[11px] sm:text-xs">
                Rosa Dose HQ
              </span>
              <span className="hidden md:inline text-[#FAF4E8]/50">|</span>
              <span className="hidden md:inline text-[11px] text-[#FAF4E8]/80 font-mono">
                Multi-Store Network (Laguna)
              </span>
            </div>

            {/* Branch Switcher Tabs: Touch-Friendly Pills */}
            <div className="flex items-center gap-1 shrink-0 font-bold text-[10px] sm:text-[11px]">
              <button
                onClick={() => {
                  setCurrentBranch('lake')
                  playSound('click')
                }}
                className={`rounded-lg px-2 sm:px-2.5 py-1 transition-all flex items-center gap-1 shrink-0 ${
                  currentBranch === 'lake'
                    ? 'bg-[#FBE48A] text-[#1A3B2F] shadow-xs font-black'
                    : 'text-[#FAF4E8]/75 hover:bg-white/10'
                }`}
              >
                <span>🌊 Lake</span>
                <span className="hidden sm:inline font-mono opacity-80">(Waterfront)</span>
              </button>

              <button
                onClick={() => {
                  setCurrentBranch('niugan')
                  playSound('click')
                }}
                className={`rounded-lg px-2 sm:px-2.5 py-1 transition-all flex items-center gap-1 shrink-0 ${
                  currentBranch === 'niugan'
                    ? 'bg-[#A3E635] text-[#1A3B2F] shadow-xs font-black'
                    : 'text-[#FAF4E8]/75 hover:bg-white/10'
                }`}
              >
                <span>🌿 Niugan</span>
                <span className="hidden sm:inline font-mono opacity-80">(Downtown)</span>
              </button>

              <button
                onClick={() => {
                  setCurrentBranch('both')
                  playSound('click')
                }}
                className={`rounded-lg px-2 sm:px-2.5 py-1 transition-all flex items-center gap-1 shrink-0 ${
                  currentBranch === 'both'
                    ? 'bg-white text-[#1A3B2F] shadow-xs font-black'
                    : 'text-[#FAF4E8]/75 hover:bg-white/10'
                }`}
              >
                <span>📊 Combined</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile Drawer */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#1A3B2F]/20 text-[#1A3B2F] hover:bg-[#1A3B2F]/5 shrink-0"
              aria-label="Open navigation drawer"
            >
              <Menu className="size-4" />
            </button>

            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 group">
              <div className="size-9 sm:size-11 shrink-0 overflow-hidden rounded-2xl border-2 border-[#1A3B2F] bg-[#4E3629] shadow-sm">
                <img
                  src="/cafe_pic/10001.jpg"
                  alt="Rosa Dose Emblem"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-editorial text-base sm:text-2xl font-bold tracking-tight text-[#1A3B2F] group-hover:text-[#D25427] transition-colors truncate">
                    {currentBranch === 'niugan' ? 'Rosa Dose Niugan' : currentBranch === 'lake' ? 'Rosa Dose Lake' : 'Rosa Dose Multi-Store'}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                    currentBranch === 'niugan' ? 'bg-[#A3E635] text-[#1A3B2F]' : currentBranch === 'lake' ? 'bg-[#1A3B2F] text-[#FBE48A]' : 'bg-[#D25427] text-white'
                  }`}>
                    {currentBranch === 'niugan' ? 'NIUGAN' : currentBranch === 'lake' ? 'LAKE' : 'ALL'}
                  </span>
                </div>
                <p className="hidden sm:block text-[10px] font-bold text-[#1A3B2F]/70 tracking-wide uppercase truncate">
                  {branchMeta ? branchMeta.tagline : 'Consolidated Multi-Store Operations Dashboard'}
                </p>
              </div>
            </Link>
          </div>

          {/* Center Search (Tablet & Desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#1A3B2F]/40" />
              <input
                type="text"
                placeholder={`Search ${currentBranch === 'both' ? 'both branches' : currentBranch === 'niugan' ? 'Niugan store' : 'Lakefront store'}...`}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#1A3B2F]/20 bg-white/90 pl-10 pr-4 py-1.5 text-xs text-[#341F14] placeholder:text-[#1A3B2F]/45 focus:border-[#D25427] focus:bg-white focus:outline-none transition-all shadow-xs"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#1A3B2F]/50 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-[#1A3B2F]/15 bg-white/70 px-2.5 py-1 text-xs font-mono font-bold text-[#1A3B2F]">
              <Clock className="size-3.5 text-[#D25427]" />
              <span>{currentTime || '10:00 AM'}</span>
            </div>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                showToast(soundEnabled ? 'Chime muted' : 'Chime audio enabled')
              }}
              className="p-1.5 sm:p-2 rounded-xl border border-[#1A3B2F]/20 bg-white/80 text-[#1A3B2F] hover:bg-[#FBE48A]/40 transition-colors"
              title="Toggle audio chime"
            >
              {soundEnabled ? <Volume2 className="size-3.5 sm:size-4" /> : <VolumeX className="size-3.5 sm:size-4 text-red-500" />}
            </button>

            <button
              onClick={() => {
                setIsStoreOpen(!isStoreOpen)
                playSound('click')
                showToast(isStoreOpen ? 'Store marked Closed / Paused' : 'Store marked OPEN')
              }}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold transition-all shadow-xs ${
                isStoreOpen
                  ? 'border border-[#22C55E]/40 bg-[#22C55E]/15 text-[#166534]'
                  : 'border border-red-300 bg-red-100 text-red-700'
              }`}
            >
              <span className={`size-2 rounded-full ${isStoreOpen ? 'bg-[#22C55E] animate-pulse' : 'bg-red-500'}`} />
              <span className="hidden sm:inline">{isStoreOpen ? 'ONLINE' : 'PAUSED'}</span>
            </button>

            <button
              onClick={() => setIsAddOrderOpen(true)}
              className="flex items-center gap-1 rounded-xl bg-[#D25427] px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#B8431C] transition-all"
            >
              <Plus className="size-3.5 sm:size-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Order</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#1A3B2F]/20 bg-white px-2.5 py-1.5 text-xs font-bold text-[#1A3B2F] hover:bg-[#1A3B2F] hover:text-[#FAF4E8] transition-all shadow-xs"
            >
              <Store className="size-3.5" />
              <span className="hidden lg:inline">Store</span>
            </Link>
          </div>

        </div>

        {/* Mobile Search Input Bar */}
        <div className="px-3 pb-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#1A3B2F]/40" />
            <input
              type="text"
              placeholder={`Search ${currentBranch === 'both' ? 'both branches' : currentBranch === 'niugan' ? 'Niugan' : 'Lakefront'}...`}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full rounded-xl border border-[#1A3B2F]/20 bg-white/90 pl-9 pr-4 py-1.5 text-xs text-[#341F14] focus:outline-none focus:border-[#D25427]"
            />
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          
          {/* MOBILE SIDEBAR OVERLAY DRAWER */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
              onClick={() => setSidebarOpen(false)}
            >
              <div 
                className="w-4/5 max-w-xs h-full bg-[#FAF4E8] p-4 overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-3">
                  <span className="font-editorial text-lg font-bold text-[#1A3B2F]">Terminal Menu</span>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="size-8 rounded-full border border-black/20 flex items-center justify-center text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Branch Quick Select */}
                <div className="rounded-2xl bg-[#1A3B2F] p-3 text-white space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-[#FBE48A]">Branch View:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                    <button
                      onClick={() => {
                        setCurrentBranch('lake')
                        setSidebarOpen(false)
                        playSound('click')
                      }}
                      className={`p-2 rounded-xl text-center transition-all ${
                        currentBranch === 'lake' ? 'bg-[#FBE48A] text-[#1A3B2F]' : 'bg-white/10 text-white'
                      }`}
                    >
                      🌊 Lake
                    </button>
                    <button
                      onClick={() => {
                        setCurrentBranch('niugan')
                        setSidebarOpen(false)
                        playSound('click')
                      }}
                      className={`p-2 rounded-xl text-center transition-all ${
                        currentBranch === 'niugan' ? 'bg-[#A3E635] text-[#1A3B2F]' : 'bg-white/10 text-white'
                      }`}
                    >
                      🌿 Niugan
                    </button>
                  </div>
                </div>

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'orders', label: 'Live Orders & KDS', icon: Coffee, badge: `${activeOrdersCount}` },
                    { id: 'floor', label: 'Table Seating Map', icon: MapPin },
                    { id: 'reservations', label: 'Reservations', icon: Calendar, badge: `${currentReservations.length}` },
                    { id: 'menu', label: 'Menu Inventory', icon: UtensilsCrossed },
                    { id: 'analytics', label: 'Sales & Metrics', icon: TrendingUp },
                    { id: 'settings', label: 'Configuration', icon: SlidersHorizontal },
                  ].map((nav) => {
                    const Icon = nav.icon
                    const isActive = activeTab === nav.id
                    return (
                      <button
                        key={nav.id}
                        onClick={() => {
                          setActiveTab(nav.id as typeof activeTab)
                          setSidebarOpen(false)
                          playSound('click')
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                          isActive ? 'bg-[#1A3B2F] text-[#FAF4E8]' : 'text-[#1A3B2F] hover:bg-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4" />
                          <span>{nav.label}</span>
                        </div>
                        {nav.badge && (
                          <span className="rounded-full bg-[#D25427] px-2 py-0.5 text-[9px] font-black text-white">
                            {nav.badge}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                <Link
                  href="/"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1A3B2F]/20 bg-white py-2.5 text-xs font-bold text-[#1A3B2F]"
                >
                  <Store className="size-4" />
                  <span>View Customer Storefront</span>
                </Link>
              </div>
            </div>
          )}

          {/* DESKTOP PERMANENT SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-4">
            
            {/* Branch Badge Card */}
            <div className="rounded-3xl border-2 border-[#1A3B2F]/15 bg-[#1A3B2F] p-4 text-[#FAF4E8] shadow-[4px_4px_0_0_#341F14] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FBE48A]">
                  Active Branch Terminal
                </span>
                <span className="rounded-full bg-[#FAF4E8]/20 px-2 py-0.5 text-[9px] font-bold">
                  {currentBranch.toUpperCase()}
                </span>
              </div>
              <p className="font-editorial text-lg font-bold text-[#FAF4E8] leading-tight">
                {currentBranch === 'niugan' ? 'Niugan Downtown' : currentBranch === 'lake' ? 'Lakefront Resort' : 'All Laguna Stores'}
              </p>
              <p className="text-[11px] text-[#FAF4E8]/80 leading-relaxed font-sans line-clamp-2">
                {branchMeta ? branchMeta.address : 'Consolidated view of Niugan Highway and Queen Aurora Resort'}
              </p>
              <div className="border-t border-[#FAF4E8]/15 pt-2 text-[10px] text-[#FAF4E8]/70 font-mono truncate">
                Hours: {branchMeta ? branchMeta.hours : 'Both Stores Active'}
              </div>
            </div>

            {/* Nav Card */}
            <div className="rounded-3xl border-2 border-[#1A3B2F]/15 bg-white p-3.5 shadow-[4px_4px_0_0_#1A3B2F] space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/60">
                Operations
              </div>

              {[
                { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live', color: 'bg-[#D25427] text-white' },
                { id: 'orders', label: 'Live Orders & KDS', icon: Coffee, badge: `${activeOrdersCount}`, color: 'bg-[#FBE48A] text-[#341F14]' },
                { id: 'floor', label: 'Table & Seating Map', icon: MapPin, badge: `${currentTables.filter(t => t.status === 'occupied').length}/${currentTables.length}`, color: 'bg-[#A3E635] text-[#1A3B2F]' },
                { id: 'reservations', label: 'Reservations', icon: Calendar, badge: `${currentReservations.length}`, color: 'bg-[#1A3B2F] text-white' },
                { id: 'menu', label: 'Menu & Stock Inventory', icon: UtensilsCrossed, badge: `${menuList.length}`, color: 'bg-neutral-100 text-neutral-800' },
                { id: 'analytics', label: 'Sales & Performance', icon: TrendingUp, badge: `₱${(totalRevenue / 1000).toFixed(1)}k`, color: 'bg-neutral-100 text-neutral-800' },
                { id: 'settings', label: 'Store Configuration', icon: SlidersHorizontal, badge: null, color: '' },
              ].map((nav) => {
                const Icon = nav.icon
                const isActive = activeTab === nav.id
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActiveTab(nav.id as typeof activeTab)
                      playSound('click')
                    }}
                    className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#1A3B2F] text-[#FAF4E8] shadow-sm'
                        : 'text-[#1A3B2F] hover:bg-[#FAF4E8] hover:text-[#D25427]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`size-4 ${isActive ? 'text-[#FBE48A]' : 'text-[#1A3B2F]/70'}`} />
                      <span>{nav.label}</span>
                    </div>
                    {nav.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${nav.color}`}>
                        {nav.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-3xl border-2 border-[#1A3B2F]/15 bg-[#FFFDF9] p-4 shadow-[4px_4px_0_0_#1A3B2F] space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/60 block px-1">
                Fast Actions
              </span>

              <button
                onClick={addSimulatedOrder}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#1A3B2F]/20 bg-white px-3.5 py-2 text-xs font-bold text-[#1A3B2F] hover:bg-[#FBE48A]/40 transition-colors shadow-xs"
              >
                <Sparkles className="size-3.5 text-[#D25427]" />
                <span>Simulate Order</span>
              </button>

              <button
                onClick={() => setIsAddResOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#1A3B2F]/20 bg-white px-3.5 py-2 text-xs font-bold text-[#1A3B2F] hover:bg-[#FBE48A]/40 transition-colors shadow-xs"
              >
                <Calendar className="size-3.5 text-[#1A3B2F]" />
                <span>+ Book Table</span>
              </button>
            </div>

          </aside>

          {/* MAIN TERMINAL BODY */}
          <main className="flex-1 w-full min-w-0 space-y-4 sm:space-y-6">

            {/* BROADCAST MARQUEE BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3 sm:p-3.5 shadow-[3px_3px_0_0_#1A3B2F]">
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-xl bg-[#D25427] px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                  {currentBranch === 'niugan' ? 'Niugan Notice' : currentBranch === 'lake' ? 'Lake Notice' : 'Notice'}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={currentBranch === 'niugan' ? storeNoticeNiugan : storeNoticeLake}
                  onChange={(e) => {
                    if (currentBranch === 'niugan') setStoreNoticeNiugan(e.target.value)
                    else setStoreNoticeLake(e.target.value)
                    setIsNoticeSaved(false)
                  }}
                  placeholder="Type broadcast ticker text for this branch..."
                  className="flex-1 min-w-0 rounded-xl sm:rounded-2xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/60 px-3 py-1.5 text-xs text-[#341F14] focus:outline-none focus:border-[#D25427]"
                />
                <button
                  onClick={() => {
                    setIsNoticeSaved(true)
                    playSound('success')
                    showToast('Store ticker updated for active branch!')
                    setTimeout(() => setIsNoticeSaved(false), 2000)
                  }}
                  className="rounded-xl sm:rounded-2xl bg-[#1A3B2F] px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white transition-all shadow-xs shrink-0"
                >
                  {isNoticeSaved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* VIEW 1: EXECUTIVE DASHBOARD */}
            {/* ========================================================================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                
                {/* HERO BANNER CARD */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-gradient-to-br from-[#1A3B2F] via-[#214739] to-[#341F14] p-4 sm:p-6 text-[#FAF4E8] shadow-[4px_4px_0_0_#341F14]">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#FBE48A] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-[#1A3B2F]">
                          {currentBranch === 'niugan' ? '🌿 Niugan Station' : currentBranch === 'lake' ? '🌊 Lakefront Station' : '👑 Both Stores'}
                        </span>
                        <span className="text-[11px] text-[#FAF4E8]/75 font-mono">
                          {branchMeta ? branchMeta.hours : 'Multi-Store'}
                        </span>
                      </div>

                      <h2 className="font-editorial text-xl sm:text-3xl font-black text-[#FBE48A] tracking-tight">
                        {currentBranch === 'niugan' ? 'adminNIUGAN Live' : currentBranch === 'lake' ? 'adminLAKE Live' : 'Owner Master HQ'}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#FAF4E8]/85 max-w-xl leading-relaxed">
                        {currentBranch === 'niugan' 
                          ? 'Downtown Cabuyao high-speed espresso bar & quiet study pods. Morning commuter batch is active.'
                          : currentBranch === 'lake'
                          ? 'Waterfront Laguna de Bay roastery & sunset veranda. Golden hour prep active with 84% booking capacity.'
                          : 'Combined multi-store dashboard tracking gross revenue, live orders, and table allocations.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-0">
                      <button
                        onClick={addSimulatedOrder}
                        className="rounded-xl sm:rounded-2xl bg-[#FBE48A] px-3.5 py-2 text-xs font-bold text-[#1A3B2F] hover:bg-white transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Sparkles className="size-3.5 text-[#D25427]" />
                        <span>Simulate Order</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('floor')}
                        className="rounded-xl sm:rounded-2xl border border-[#FAF4E8]/30 bg-white/10 px-3.5 py-2 text-xs font-bold text-[#FAF4E8] hover:bg-white/20 transition-all flex items-center gap-1.5"
                      >
                        <MapPin className="size-3.5 text-[#FBE48A]" />
                        <span>Table Layout</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 CORE KPI CARDS: Responsive 2-cols on mobile, 4-cols on lg */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/70 truncate">
                        Gross Sales
                      </span>
                      <div className="rounded-lg sm:rounded-xl bg-[#FAF4E8] p-1.5 text-[#D25427]">
                        <DollarSign className="size-3.5 sm:size-4" />
                      </div>
                    </div>
                    <p className="font-editorial text-xl sm:text-3xl font-black text-[#1A3B2F]">
                      ₱{totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between pt-0.5 text-[10px] sm:text-[11px] text-[#166534] font-bold">
                      <span className="flex items-center gap-0.5">
                        <TrendingUp className="size-3" />
                        <span>+18.4%</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#1A3B2F]/60">{currentOrders.length} orders</span>
                    </div>
                  </div>

                  <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/70 truncate">
                        KDS Queue
                      </span>
                      <div className="rounded-lg sm:rounded-xl bg-[#FAF4E8] p-1.5 text-[#1A3B2F]">
                        <Coffee className="size-3.5 sm:size-4" />
                      </div>
                    </div>
                    <p className="font-editorial text-xl sm:text-3xl font-black text-[#D25427]">
                      {activeOrdersCount} Tickets
                    </p>
                    <div className="flex items-center justify-between pt-0.5 text-[10px] sm:text-[11px] text-[#1A3B2F]/70">
                      <span>{brewingOrdersCount} brew</span>
                      <span className="font-mono text-[9px] sm:text-[10px]">Avg 3.1m</span>
                    </div>
                  </div>

                  <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/70 truncate">
                        Occupancy
                      </span>
                      <div className="rounded-lg sm:rounded-xl bg-[#FAF4E8] p-1.5 text-[#C8521A]">
                        <Calendar className="size-3.5 sm:size-4 text-[#D25427]" />
                      </div>
                    </div>
                    <p className="font-editorial text-xl sm:text-3xl font-black text-[#1A3B2F]">
                      {Math.round((currentTables.filter(t => t.status === 'occupied' || t.status === 'reserved').length / currentTables.length) * 100)}%
                    </p>
                    <div className="flex items-center justify-between pt-0.5 text-[10px] sm:text-[11px] text-[#1A3B2F]/70">
                      <span>{currentTables.filter(t => t.status === 'occupied').length} seated</span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#D25427]">{currentTables.length} tables</span>
                    </div>
                  </div>

                  <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A3B2F]/70 truncate">
                        Avg Ticket
                      </span>
                      <div className="rounded-lg sm:rounded-xl bg-[#FAF4E8] p-1.5 text-[#1A3B2F]">
                        <Users className="size-3.5 sm:size-4" />
                      </div>
                    </div>
                    <p className="font-editorial text-xl sm:text-3xl font-black text-[#1A3B2F]">
                      ₱{avgOrderValue}
                    </p>
                    <div className="flex items-center justify-between pt-0.5 text-[10px] sm:text-[11px] text-[#1A3B2F]/70">
                      <span>{completedOrdersCount} done</span>
                      <span className="text-[9px] sm:text-[10px] font-mono">100% Sat</span>
                    </div>
                  </div>
                </div>

                {/* OWNER MULTI-STORE ROLL-UP SNAPSHOTS */}
                <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                  {/* Lake Branch Snapshot */}
                  <div className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] transition-all ${
                    currentBranch === 'lake' ? 'bg-[#FBE48A]/25 border-[#1A3B2F]' : 'bg-white border-[#1A3B2F]/20'
                  }`}>
                    <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-2.5">
                      <div>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#D25427]">
                          Branch 01 (Waterfront)
                        </span>
                        <h3 className="font-editorial text-base sm:text-xl font-bold text-[#1A3B2F]">
                          🌊 Rosa Dose Lake
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentBranch('lake')
                          playSound('click')
                        }}
                        className="rounded-xl bg-[#1A3B2F] px-2.5 py-1 text-xs font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white"
                      >
                        Open adminLAKE
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">SALES</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#1A3B2F]">₱{lakeRevenue.toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">QUEUE</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#D25427]">{lakeOrders.filter(o => o.status !== 'completed').length} active</span>
                      </div>
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">VERANDA</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#1A3B2F]">84% Full</span>
                      </div>
                    </div>
                  </div>

                  {/* Niugan Branch Snapshot */}
                  <div className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] transition-all ${
                    currentBranch === 'niugan' ? 'bg-[#A3E635]/25 border-[#1A3B2F]' : 'bg-white border-[#1A3B2F]/20'
                  }`}>
                    <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-2.5">
                      <div>
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#166534]">
                          Branch 02 (Downtown)
                        </span>
                        <h3 className="font-editorial text-base sm:text-xl font-bold text-[#1A3B2F]">
                          🌿 Rosa Dose Niugan
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentBranch('niugan')
                          playSound('click')
                        }}
                        className="rounded-xl bg-[#1A3B2F] px-2.5 py-1 text-xs font-bold text-[#A3E635] hover:bg-[#D25427] hover:text-white"
                      >
                        Open adminNIUGAN
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">SALES</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#1A3B2F]">₱{niuganRevenue.toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">QUEUE</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#D25427]">{niuganOrders.filter(o => o.status !== 'completed').length} active</span>
                      </div>
                      <div className="rounded-xl bg-[#FAF4E8] p-2 border border-[#1A3B2F]/10">
                        <span className="text-[9px] text-[#1A3B2F]/70 font-bold block">STUDY PODS</span>
                        <span className="font-editorial text-sm sm:text-lg font-black text-[#1A3B2F]">78% Full</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIVE KDS & TABLE STATUS CORE */}
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                    
                    {/* Live KDS Stream */}
                    <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-6 shadow-[3px_3px_0_0_#1A3B2F] space-y-3.5">
                      <div className="flex items-center justify-between border-b border-[#1A3B2F]/10 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl bg-[#D25427] p-1.5 text-white">
                            <Flame className="size-4" />
                          </div>
                          <div>
                            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A3B2F]">
                              Live Barista Tickets ({currentOrders.filter(o => o.status !== 'completed').length})
                            </h3>
                            <p className="text-[11px] text-[#1A3B2F]/65 truncate">
                              {currentBranch === 'both' ? 'Unified feed across all locations' : `Active orders for ${branchMeta?.shortName}`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-xs font-bold text-[#D25427] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>Full KDS</span>
                          <ChevronRight className="size-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {currentOrders.filter((o) => o.status !== 'completed').slice(0, 4).map((order) => (
                          <div
                            key={order.id}
                            className="rounded-2xl border border-[#1A3B2F]/15 bg-[#FAF4E8]/40 p-3 sm:p-4 hover:bg-[#FAF4E8] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <span className="font-mono text-xs font-black text-[#1A3B2F] bg-white px-1.5 py-0.5 rounded border border-[#1A3B2F]/20">
                                    {order.id}
                                  </span>
                                  <span className="font-bold text-xs sm:text-sm text-[#1A3B2F] truncate">{order.customer}</span>
                                  <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase ${
                                    order.branch === 'niugan' ? 'bg-[#A3E635] text-[#1A3B2F]' : 'bg-[#1A3B2F] text-[#FBE48A]'
                                  }`}>
                                    {order.branch}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#1A3B2F]/75 mt-1 font-medium flex items-center gap-1 truncate">
                                  <MapPin className="size-3 text-[#D25427] shrink-0" />
                                  <span className="truncate">{order.mode === 'dine-in' ? order.table : 'Takeaway Counter'}</span>
                                </p>
                              </div>

                              <span className="rounded-full border border-[#1A3B2F]/20 bg-[#FBE48A] px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase text-[#1A3B2F] shrink-0">
                                {order.status}
                              </span>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-[#1A3B2F]/10 flex flex-wrap items-center justify-between gap-2">
                              <div className="text-xs text-[#341F14] font-medium line-clamp-1">
                                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#1A3B2F]">₱{order.total}</span>
                                <button
                                  onClick={() => advanceOrderStatus(order.id)}
                                  className="rounded-lg sm:rounded-xl bg-[#1A3B2F] px-2.5 py-1 text-[11px] font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white transition-all shadow-xs"
                                >
                                  {order.status === 'queued' && '▶ Start Brewing'}
                                  {order.status === 'brewing' && '★ Mark Ready'}
                                  {order.status === 'ready' && '✓ Serve Order'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Table map preview & Rush Chart */}
                  <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                    
                    {/* Hourly Traffic Chart (Horizontally scrollable on mobile) */}
                    <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1A3B2F]/10 pb-2.5">
                        <div>
                          <span className="text-[9px] font-black uppercase text-[#D25427]">Traffic Peak</span>
                          <h4 className="font-editorial text-base sm:text-lg font-bold text-[#1A3B2F]">Hourly Volume Timeline</h4>
                        </div>
                        <span className="rounded-full bg-[#FBE48A] px-2 py-0.5 text-[9px] font-bold text-[#1A3B2F]">
                          Sunset: 5 PM Peak
                        </span>
                      </div>

                      {/* Scroll wrapper for mobile */}
                      <div className="overflow-x-auto no-scrollbar pt-2">
                        <div className="h-40 min-w-[420px] flex items-end justify-between gap-1.5 border-b border-[#1A3B2F]/20 pb-2">
                          {hourlyTraffic.map((bar, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                              <div
                                className={`w-full rounded-t-md transition-all ${
                                  bar.peak ? 'bg-gradient-to-t from-[#D25427] to-[#FBE48A]' : 'bg-[#1A3B2F]/70'
                                }`}
                                style={{ height: bar.height }}
                              />
                              <span className="mt-1 text-[8px] font-mono text-[#1A3B2F]/70">{bar.hour.replace(' ', '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Table map snapshot */}
                    <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1A3B2F]/10 pb-2">
                        <h4 className="font-editorial text-base sm:text-lg font-bold text-[#1A3B2F]">Table Seating Status</h4>
                        <button onClick={() => setActiveTab('floor')} className="text-xs font-bold text-[#D25427] hover:underline">
                          Full Map
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {currentTables.slice(0, 4).map((table) => (
                          <div
                            key={table.id}
                            onClick={() => {
                              setSelectedTable(table)
                              playSound('click')
                            }}
                            className="p-2.5 rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8] text-xs cursor-pointer hover:border-[#D25427]"
                          >
                            <div className="flex justify-between font-bold">
                              <span>{table.name}</span>
                              <span className="text-[9px] opacity-75">{table.branch}</span>
                            </div>
                            <p className="text-[10px] font-medium truncate mt-0.5">
                              {table.status === 'occupied' ? `● ${table.currentGuest}` : table.status === 'reserved' ? `★ Reserved` : '○ Open'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 2: LIVE ORDERS & KDS (RESPONSIVE KANBAN + LIST) */}
            {/* ========================================================================= */}
            {activeTab === 'orders' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-4 shadow-[3px_3px_0_0_#1A3B2F]">
                  {/* Status Pills: Scrollable horizontally on small screens */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    {(['all', 'queued', 'brewing', 'ready', 'completed'] as const).map((status) => {
                      const count = status === 'all' ? currentOrders.length : currentOrders.filter((o) => o.status === status).length
                      return (
                        <button
                          key={status}
                          onClick={() => setOrderFilter(status)}
                          className={`rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold uppercase transition-all shrink-0 ${
                            orderFilter === status
                              ? 'bg-[#1A3B2F] text-[#FBE48A] shadow-xs'
                              : 'bg-[#FAF4E8] text-[#1A3B2F] hover:bg-[#1A3B2F]/10'
                          }`}
                        >
                          {status} ({count})
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={addSimulatedOrder}
                      className="flex items-center gap-1 rounded-xl bg-[#D25427] px-3 py-1.5 text-xs font-bold text-white shadow-xs shrink-0"
                    >
                      <Plus className="size-3.5" />
                      <span>Simulate</span>
                    </button>
                    <button
                      onClick={() => setIsAddOrderOpen(true)}
                      className="flex items-center gap-1 rounded-xl border border-[#1A3B2F] bg-[#FBE48A] px-3 py-1.5 text-xs font-bold text-[#1A3B2F] shadow-xs shrink-0"
                    >
                      <span>+ POS Ticket</span>
                    </button>
                  </div>
                </div>

                {/* Orders Grid */}
                <div className="grid gap-3.5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-5 shadow-[3px_3px_0_0_#1A3B2F] space-y-3"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between border-b border-[#1A3B2F]/15 pb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-sm sm:text-base font-black text-[#1A3B2F]">{order.id}</span>
                              <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase ${
                                order.branch === 'niugan' ? 'bg-[#A3E635] text-[#1A3B2F]' : 'bg-[#1A3B2F] text-[#FBE48A]'
                              }`}>
                                {order.branch}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#1A3B2F] mt-0.5">{order.customer} · <span className="font-mono font-normal">{order.time}</span></p>
                          </div>
                          <span className="rounded-lg bg-[#FAF4E8] px-2 py-0.5 text-[10px] font-bold text-[#1A3B2F]">
                            {order.mode === 'dine-in' ? order.table : 'TAKEAWAY'}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {order.items.map((i, idx) => (
                            <div key={idx} className="border-b border-[#1A3B2F]/10 pb-1 flex justify-between">
                              <div>
                                <span className="font-bold text-[#1A3B2F]">{i.quantity}x {i.name}</span>
                                <p className="text-[10px] text-[#1A3B2F]/65">{i.details}</p>
                              </div>
                              <span className="font-mono font-bold">₱{i.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-dashed border-[#1A3B2F]/20 text-xs">
                          <span className="text-[10px] text-[#1A3B2F]/70">Paid via {order.paymentMethod}</span>
                          <span className="font-mono text-sm sm:text-base font-black text-[#1A3B2F]">₱{order.total}</span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#1A3B2F]/15 flex items-center gap-2">
                        {order.status !== 'completed' ? (
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            className="flex-1 rounded-xl bg-[#1A3B2F] py-2 text-xs font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white transition-all shadow-xs"
                          >
                            {order.status === 'queued' && '▶ Start Brewing'}
                            {order.status === 'brewing' && '★ Mark Ready'}
                            {order.status === 'ready' && '✓ Complete Order'}
                          </button>
                        ) : (
                          <div className="flex-1 text-center py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                            ✓ Delivered
                          </div>
                        )}

                        <button
                          onClick={() => setReceiptOrder(order)}
                          className="p-2 rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8] text-[#1A3B2F]"
                          title="Receipt"
                        >
                          <Receipt className="size-3.5" />
                        </button>

                        <button
                          onClick={() => copyOrderSlip(order)}
                          className="p-2 rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8] text-[#1A3B2F]"
                          title="Copy ticket"
                        >
                          {copiedOrderId === order.id ? <Check className="size-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 3: TABLE & SEATING MAP */}
            {/* ========================================================================= */}
            {activeTab === 'floor' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 shadow-[3px_3px_0_0_#1A3B2F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A3B2F]">
                      {currentBranch === 'niugan' ? 'Niugan Study Lounge Map' : currentBranch === 'lake' ? 'Lakefront Veranda Map' : 'All Tables'}
                    </h3>
                    <p className="text-xs text-[#1A3B2F]/70">
                      Tap any table to inspect details or change status
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#1A3B2F]" /> Seated</span>
                    <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#D25427]" /> Reserved</span>
                    <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-[#FAF4E8] border border-black/30" /> Available</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {currentTables.map((table) => (
                    <div
                      key={table.id}
                      onClick={() => {
                        setSelectedTable(table)
                        playSound('click')
                      }}
                      className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border-2 cursor-pointer shadow-[2px_2px_0_0_#1A3B2F] hover:shadow-[4px_4px_0_0_#1A3B2F] transition-all bg-white"
                    >
                      <div className="flex items-center justify-between border-b border-[#1A3B2F]/10 pb-1.5">
                        <span className="font-editorial text-sm sm:text-base font-bold truncate">{table.name}</span>
                        <span className="rounded-full bg-[#FAF4E8] px-1.5 py-0.5 text-[9px] font-bold text-[#1A3B2F]">
                          {table.capacity}pax
                        </span>
                      </div>

                      <div className="py-2 space-y-0.5 text-xs">
                        <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-black uppercase ${
                          table.branch === 'niugan' ? 'bg-[#A3E635]/30 text-[#166534]' : 'bg-[#FBE48A]/40 text-[#1A3B2F]'
                        }`}>
                          {table.branch}
                        </span>

                        {table.status === 'occupied' && (
                          <div className="space-y-0.5 pt-0.5">
                            <p className="font-bold text-[#1A3B2F] truncate">{table.currentGuest}</p>
                            <p className="text-[10px] text-[#1A3B2F]/70">{table.partySize} guests · {table.timeElapsed}</p>
                          </div>
                        )}

                        {table.status === 'reserved' && (
                          <p className="font-bold text-[#D25427] truncate">★ {table.currentGuest}</p>
                        )}

                        {table.status === 'available' && (
                          <p className="text-[11px] text-neutral-400 italic pt-1">Available</p>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-[#1A3B2F]/10 flex items-center justify-between text-[11px] font-bold">
                        <span className={`capitalize ${table.status === 'occupied' ? 'text-emerald-700' : table.status === 'reserved' ? 'text-[#D25427]' : 'text-neutral-500'}`}>
                          ● {table.status}
                        </span>
                        <span className="text-[10px] text-[#1A3B2F] underline">Edit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 4: RESERVATIONS */}
            {/* ========================================================================= */}
            {activeTab === 'reservations' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-3.5 sm:p-4 shadow-[3px_3px_0_0_#1A3B2F]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['all', 'Today', 'Tomorrow'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setResDateFilter(d)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                          resDateFilter === d
                            ? 'bg-[#1A3B2F] text-[#FBE48A]'
                            : 'bg-[#FAF4E8] text-[#1A3B2F] hover:bg-[#1A3B2F]/10'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsAddResOpen(true)}
                    className="rounded-xl bg-[#D25427] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#B8431C] transition-all shadow-xs"
                  >
                    + New Reservation
                  </button>
                </div>

                <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white shadow-[3px_3px_0_0_#1A3B2F] overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                    <thead>
                      <tr className="border-b-2 border-[#1A3B2F]/20 bg-[#FAF4E8] text-[#1A3B2F] font-bold">
                        <th className="p-3 border-r border-[#1A3B2F]/15">REF #</th>
                        <th className="p-3 border-r border-[#1A3B2F]/15">BRANCH</th>
                        <th className="p-3 border-r border-[#1A3B2F]/15">GUEST</th>
                        <th className="p-3 border-r border-[#1A3B2F]/15">PAX</th>
                        <th className="p-3 border-r border-[#1A3B2F]/15">ZONE</th>
                        <th className="p-3 border-r border-[#1A3B2F]/15">DATE &amp; TIME</th>
                        <th className="p-3">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((res) => (
                        <tr key={res.id} className="border-b border-[#1A3B2F]/10 hover:bg-[#FAF4E8]/50 transition-colors">
                          <td className="p-3 border-r border-[#1A3B2F]/10 font-mono font-bold text-[#1A3B2F]">
                            {res.id}
                          </td>
                          <td className="p-3 border-r border-[#1A3B2F]/10 font-bold">
                            <span className={`rounded px-1.5 py-0.5 text-[8px] uppercase font-black ${
                              res.branch === 'niugan' ? 'bg-[#A3E635] text-[#1A3B2F]' : 'bg-[#1A3B2F] text-[#FBE48A]'
                            }`}>
                              {res.branch}
                            </span>
                          </td>
                          <td className="p-3 border-r border-[#1A3B2F]/10 font-bold text-[#1A3B2F]">
                            {res.guestName}
                            {res.notes && <span className="block text-[10px] font-normal text-[#1A3B2F]/65 truncate max-w-xs">{res.notes}</span>}
                          </td>
                          <td className="p-3 border-r border-[#1A3B2F]/10 font-bold">{res.guests}pax</td>
                          <td className="p-3 border-r border-[#1A3B2F]/10 truncate max-w-[140px]">{res.zone}</td>
                          <td className="p-3 border-r border-[#1A3B2F]/10 font-medium"><strong>{res.date}</strong> · {res.time}</td>
                          <td className="p-3">
                            {res.status === 'confirmed' ? (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'seated')}
                                className="rounded-lg bg-[#22C55E] px-2.5 py-1 text-[11px] font-bold text-white"
                              >
                                Seat
                              </button>
                            ) : (
                              <span className="text-neutral-500 font-bold">{res.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 5: MENU INVENTORY */}
            {/* ========================================================================= */}
            {activeTab === 'menu' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 p-3.5 sm:p-4 shadow-[2px_2px_0_0_#1A3B2F] ${
                        item.isAvailable ? 'bg-white' : 'bg-neutral-100 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="size-14 sm:size-16 shrink-0 rounded-xl overflow-hidden border border-[#1A3B2F]/20 bg-black">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#D25427]">
                              [{item.category}]
                            </span>
                            <h4 className="font-editorial text-sm sm:text-base font-bold text-[#1A3B2F] truncate">{item.name}</h4>
                            <p className="font-mono text-xs font-bold text-[#1A3B2F] mt-0.5">₱{item.price}</p>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#1A3B2F]/75 mt-2 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#1A3B2F]/15 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-[#1A3B2F]/70">
                          {item.isAvailable ? '● In Stock' : '○ Sold Out'}
                        </span>
                        <button
                          onClick={() => toggleItemStock(item.id)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                            item.isAvailable ? 'bg-[#22C55E] text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.isAvailable ? 'Mark Sold Out' : 'Restock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 6: ANALYTICS */}
            {/* ========================================================================= */}
            {activeTab === 'analytics' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-200">
                <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-6 shadow-[3px_3px_0_0_#1A3B2F] space-y-4">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#D25427]">Multi-Store Comparison</span>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A3B2F]">Niugan vs Lakefront Revenue</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FBE48A]/30 border border-[#1A3B2F]/20">
                      <p className="font-editorial text-base sm:text-lg font-bold text-[#1A3B2F]">🌊 Lakefront Branch</p>
                      <p className="font-editorial text-2xl sm:text-3xl font-black text-[#1A3B2F] mt-1">₱{lakeRevenue.toLocaleString()}</p>
                      <p className="text-xs text-[#1A3B2F]/70 mt-1">{lakeOrders.length} tickets · Peak: Sunset (5 PM)</p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#A3E635]/30 border border-[#1A3B2F]/20">
                      <p className="font-editorial text-base sm:text-lg font-bold text-[#1A3B2F]">🌿 Niugan Branch</p>
                      <p className="font-editorial text-2xl sm:text-3xl font-black text-[#1A3B2F] mt-1">₱{niuganRevenue.toLocaleString()}</p>
                      <p className="text-xs text-[#1A3B2F]/70 mt-1">{niuganOrders.length} tickets · Peak: Morning Rush (8 AM)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* VIEW 7: STORE SETTINGS */}
            {/* ========================================================================= */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl sm:rounded-3xl border-2 border-[#1A3B2F]/20 bg-white p-4 sm:p-6 shadow-[3px_3px_0_0_#1A3B2F] space-y-4 animate-in fade-in-50 duration-200">
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#D25427]">Store Directory</span>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A3B2F]">Branch Profiles &amp; Operating Hours</h3>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  {Object.values(BRANCH_CONFIG).map((b) => (
                    <div key={b.id} className="p-4 rounded-2xl border-2 border-[#1A3B2F]/20 bg-[#FAF4E8]/50 space-y-1.5">
                      <h4 className="font-editorial text-base font-bold text-[#1A3B2F]">{b.name}</h4>
                      <p><strong>Address:</strong> {b.address}</p>
                      <p><strong>Hours:</strong> {b.hours}</p>
                      <p><strong>Phone:</strong> {b.phone}</p>
                      <p className="text-[11px] text-[#1A3B2F]/70 pt-1"><strong>Zones:</strong> {b.zones.join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* POS ORDER MODAL WITH OVERFLOW PROTECTION FOR MOBILE */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#1A3B2F] bg-white p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-2.5">
              <div>
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A3B2F]">+ Enter Customer Order</h3>
                <p className="text-[11px] text-[#1A3B2F]/60">Choose branch and send ticket to KDS</p>
              </div>
              <button onClick={() => setIsAddOrderOpen(false)} className="size-8 rounded-full border border-black/20 flex items-center justify-center font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#1A3B2F] block mb-1">Target Branch</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderBranch('lake')
                      setOrderTable('Veranda Table 1')
                    }}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                      orderBranch === 'lake' ? 'bg-[#1A3B2F] text-[#FBE48A] border-[#1A3B2F]' : 'bg-[#FAF4E8] text-[#1A3B2F] border-[#1A3B2F]/20'
                    }`}
                  >
                    <span>🌊 Lakefront</span>
                    <span className="block text-[9px] font-normal opacity-80">Queen Aurora Resort</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderBranch('niugan')
                      setOrderTable('Study Pod 1')
                    }}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                      orderBranch === 'niugan' ? 'bg-[#1A3B2F] text-[#A3E635] border-[#1A3B2F]' : 'bg-[#FAF4E8] text-[#1A3B2F] border-[#1A3B2F]/20'
                    }`}
                  >
                    <span>🌿 Niugan</span>
                    <span className="block text-[9px] font-normal opacity-80">Downtown Highway</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#1A3B2F] block mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Legaspi"
                    value={orderCustomer}
                    onChange={(e) => setOrderCustomer(e.target.value)}
                    className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A3B2F] block mb-1">Service</label>
                  <select
                    value={orderMode}
                    onChange={(e) => setOrderMode(e.target.value as 'dine-in' | 'takeaway')}
                    className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                  >
                    <option value="dine-in">Dine-In (Table)</option>
                    <option value="takeaway">Takeaway Counter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A3B2F] block mb-1">Select Items</label>
                <div className="max-h-36 overflow-y-auto rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/40 p-1.5 space-y-1">
                  {menuList.map((item) => {
                    const isSelected = cartEntries.some((s) => s.id === item.id)
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          playSound('click')
                          if (isSelected) setCartEntries(cartEntries.filter((s) => s.id !== item.id))
                          else setCartEntries([...cartEntries, { id: item.id, qty: 1 }])
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                          isSelected ? 'bg-[#1A3B2F] text-[#FBE48A]' : 'bg-white text-[#1A3B2F]'
                        }`}
                      >
                        <span className="font-bold truncate">{item.name}</span>
                        <span className="font-mono text-xs font-bold">₱{item.price}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#1A3B2F] py-3 text-xs font-bold text-[#FBE48A] hover:bg-[#D25427] hover:text-white transition-all shadow-sm"
              >
                Send Order to {orderBranch === 'niugan' ? 'Niugan KDS' : 'Lake KDS'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESERVATION MODAL WITH MOBILE SCROLL */}
      {isAddResOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#1A3B2F] bg-white p-5 sm:p-6 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-2.5">
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A3B2F]">+ Book Table</h3>
              <button onClick={() => setIsAddResOpen(false)} className="size-8 rounded-full border border-black/20 flex items-center justify-center font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1A3B2F] block mb-1">Select Branch</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResBranch('lake')
                      setResZone('Waterfront Bay Veranda')
                    }}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      resBranch === 'lake' ? 'bg-[#1A3B2F] text-[#FBE48A]' : 'bg-[#FAF4E8] text-[#1A3B2F]'
                    }`}
                  >
                    🌊 Lakefront
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResBranch('niugan')
                      setResZone('Study Stalls & Co-Work (AC)')
                    }}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      resBranch === 'niugan' ? 'bg-[#1A3B2F] text-[#A3E635]' : 'bg-[#FAF4E8] text-[#1A3B2F]'
                    }`}
                  >
                    🌿 Niugan
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A3B2F] block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Clara Santos"
                  value={resGuestName}
                  onChange={(e) => setResGuestName(e.target.value)}
                  className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1A3B2F] block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="0917 123 4567"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A3B2F] block mb-1">Guests (PAX)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={resPax}
                    onChange={(e) => setResPax(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A3B2F] block mb-1">Seating Zone</label>
                <select
                  value={resZone}
                  onChange={(e) => setResZone(e.target.value)}
                  className="w-full rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8]/50 px-3 py-2 focus:outline-none"
                >
                  {BRANCH_CONFIG[resBranch].zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#D25427] py-2.5 text-xs font-bold text-white hover:bg-[#B8431C] transition-all shadow-sm"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPT SLIP PREVIEW */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#1A3B2F] bg-white p-5 sm:p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#1A3B2F]/30 pb-2.5">
              <span className="font-bold text-sm text-[#1A3B2F]">RECEIPT PREVIEW</span>
              <button onClick={() => setReceiptOrder(null)} className="size-7 rounded-full border border-black/20 flex items-center justify-center">✕</button>
            </div>

            <div className="border border-neutral-200 bg-[#FAFDF8] p-3.5 rounded-xl space-y-2.5 text-[11px] leading-tight">
              <div className="text-center space-y-1">
                <p className="font-black text-sm text-[#1A3B2F]">ROSA DOSE</p>
                <p className="text-[10px] font-bold text-neutral-700">
                  {receiptOrder.branch === 'niugan' ? '🌿 NIUGAN DOWNTOWN BRANCH' : '🌊 LAKEFRONT ROASTERY'}
                </p>
              </div>

              <div className="border-t border-b border-dashed border-neutral-300 py-2 space-y-1 text-[10px]">
                <div className="flex justify-between"><span>TICKET:</span><span className="font-bold">{receiptOrder.id}</span></div>
                <div className="flex justify-between"><span>GUEST:</span><span>{receiptOrder.customer}</span></div>
                <div className="flex justify-between"><span>TABLE:</span><span>{receiptOrder.table}</span></div>
              </div>

              <div className="space-y-1 py-1">
                {receiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                    <span>₱{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-neutral-400 pt-2 flex justify-between text-xs font-bold text-[#1A3B2F]">
                <span>TOTAL DUE:</span>
                <span>₱{receiptOrder.total}</span>
              </div>
            </div>

            <div className="flex gap-2 font-sans font-bold text-xs">
              <button
                onClick={() => {
                  window.print()
                  showToast('Sent to printer!')
                }}
                className="flex-1 rounded-xl bg-[#1A3B2F] py-2.5 text-[#FBE48A] flex items-center justify-center gap-1.5"
              >
                <Printer className="size-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => copyOrderSlip(receiptOrder)}
                className="rounded-xl border border-[#1A3B2F]/20 bg-[#FAF4E8] px-3.5 py-2.5 text-[#1A3B2F]"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border-2 border-[#1A3B2F] bg-white p-5 sm:p-6 shadow-2xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-[#1A3B2F]/15 pb-2.5">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A3B2F]">{selectedTable.name}</h3>
                <p className="text-[10px] text-[#1A3B2F]/65 uppercase font-bold">{selectedTable.branch} · {selectedTable.zone}</p>
              </div>
              <button onClick={() => setSelectedTable(null)} className="size-7 rounded-full border border-black/20 flex items-center justify-center font-bold">✕</button>
            </div>

            <div className="rounded-xl border border-[#1A3B2F]/15 bg-[#FAF4E8]/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A3B2F]">Status:</span>
                <span className="rounded-full bg-[#1A3B2F] px-2 py-0.5 text-[9px] font-black text-[#FBE48A] uppercase">
                  {selectedTable.status}
                </span>
              </div>
              {selectedTable.currentGuest && <p><strong>Guest:</strong> {selectedTable.currentGuest}</p>}
              {selectedTable.partySize && <p><strong>Party:</strong> {selectedTable.partySize} guests</p>}
            </div>

            <button
              onClick={() => {
                const targetTables = selectedTable.branch === 'niugan' ? setNiuganTables : setLakeTables
                targetTables((prev) =>
                  prev.map((t) => (t.id === selectedTable.id ? { ...t, status: t.status === 'occupied' ? 'available' : 'occupied', currentGuest: t.status === 'occupied' ? undefined : 'Walk-in Guest' } : t))
                )
                setSelectedTable(null)
                playSound('success')
                showToast(`Table status toggled!`)
              }}
              className="w-full rounded-xl bg-[#1A3B2F] py-2.5 font-bold text-[#FBE48A] shadow-xs"
            >
              Toggle Status (Occupied / Available)
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
