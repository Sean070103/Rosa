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
}

export interface ReservationData {
  guestCount: number
  seatingArea: 'veranda' | 'indoor' | 'garden'
  date: string
  timeSlot: string
  name: string
  phone: string
  occasion: string
}

export interface AdminOrder {
  id: string
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
  guestName: string
  phone: string
  guests: number
  zone: string
  date: string
  time: string
  status: 'confirmed' | 'seated' | 'cancelled'
  notes?: string
}

