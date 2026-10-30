export type BranchId = 'niugan' | 'lake'

export interface BranchInfo {
  id: BranchId
  name: string
  shortName: string
  tagline: string
  address: string
  hours: string
  phone: string
  zones: string[]
}

export interface MenuItem {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  category: 'signature' | 'pourover' | 'matcha-tea' | 'pastries-kitchen'
  image: string
  tag?: string
  roastLevel?: string
  tastingNotes: string[]
  temperature: 'iced' | 'hot' | 'both'
  origin?: string
  isPopular?: boolean
  calories?: string
  isAvailable?: boolean
  availableBranches?: BranchId[]
}

export interface CartItem {
  id: string
  item: MenuItem
  temperature: 'iced' | 'hot'
  sweetness: string
  milk: string
  extras: string[]
  quantity: number
  totalPrice: number
  customizationSummary: string
  branch?: BranchId
}

export interface ReservationData {
  branch: BranchId
  guestCount: number
  seatingArea: string
  date: string
  timeSlot: string
  name: string
  phone: string
  occasion: string
}

export interface AdminOrder {
  id: string
  branch: BranchId
  time: string
  customer: string
  mode: 'dine-in' | 'takeaway'
  table: string
  items: {
    name: string
    quantity: number
    details: string
    price: number
  }[]
  total: number
  status: 'queued' | 'brewing' | 'ready' | 'completed'
  paymentStatus: 'paid' | 'pending'
  paymentMethod: 'GCash' | 'Cash' | 'Maya' | 'Card'
}

export interface AdminReservation {
  id: string
  branch: BranchId
  guestName: string
  phone: string
  guests: number
  zone: string
  date: string
  time: string
  status: 'confirmed' | 'seated' | 'cancelled'
  notes?: string
}

