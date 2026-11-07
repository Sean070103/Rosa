// Restaurant Management System - Unified Relational Database & Store
// Fully reactive with localStorage persistence, relational integrity, conflict detection, and event pub/sub.

export type UserRole = 'admin' | 'manager' | 'employee' | 'customer'

export type ShiftType = 'Morning' | 'Afternoon' | 'Evening' | 'Closing'

export type TableShape = 'square' | 'round' | 'rectangular' | 'communal' | 'booth' | 'lounge'

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'cleaning' | 'unavailable'

export type ReservationStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Checked In' 
  | 'Seated' 
  | 'Completed' 
  | 'Cancelled' 
  | 'No Show'

export interface Employee {
  id: string
  name: string
  role: 'General Manager' | 'Head Chef' | 'Sous Chef' | 'Senior Barista' | 'Lead Server' | 'Server' | 'Host' | 'Sommelier'
  email: string
  phone: string
  avatar: string
  colorCode: string
  hourlyRate: number
  maxWeeklyHours: number
  currentWeeklyHours: number
  diningSection: string
  status: 'on-duty' | 'off-duty' | 'break'
  hiredDate: string
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  role: string
  date: string // YYYY-MM-DD
  shiftType: ShiftType
  startTime: string
  endTime: string
  hours: number
  diningSection: string
  status: 'approved' | 'preferred' | 'rejected' | 'completed'
  checkInTime?: string
  checkOutTime?: string
  notes?: string
}

export interface ScheduleRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'preference' | 'change' | 'swap'
  requestedDate: string
  shiftType: ShiftType
  targetShiftId?: string
  swapWithEmployeeId?: string
  swapWithEmployeeName?: string
  swapWithShiftId?: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  reviewedBy?: string
  reviewNotes?: string
}

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: 'ingredient' | 'beverage' | 'packaging' | 'supplies'
  unit: 'g' | 'kg' | 'ml' | 'L' | 'pcs' | 'pack'
  unitCost: number // cost in PHP per unit
  stockQuantity: number
  minThreshold: number
  reorderPoint: number
  supplierId: string
  supplierName: string
  expirationDate: string
  batchNumber: string
  storageLocation: string
  lastRestocked: string
}

export interface RecipeIngredient {
  inventoryItemId: string
  ingredientName: string
  quantity: number
  unit: string
  unitCost: number
  lineCost: number
}

export interface HistoricalCostRecord {
  date: string
  previousCost: number
  newCost: number
  reason: string
  updatedBy: string
}

export interface RecipeItem {
  id: string
  name: string
  category: 'Burger' | 'Sushi' | 'Sashimi' | 'Tempura' | 'BBQ' | 'Noodle' | 'Nabe' | 'Sake' | 'Desserts' | 'Main Entrees' | 'Artisan Coffee' | 'Signatures' | 'Pastries' | string
  servingSize: number
  laborCost: number
  overheadCost: number
  ingredients: RecipeIngredient[]
  totalIngredientCost: number
  totalProductionCost: number
  suggestedSellingPrice: number
  currentSellingPrice: number
  foodCostPercentage: number
  grossProfit: number
  profitMarginPercentage: number
  description: string
  image: string
  historicalCostRecords: HistoricalCostRecord[]
  updatedAt: string
}

export interface OperatingExpense {
  id: string
  category: 'Labor' | 'Rent' | 'Utilities' | 'Maintenance' | 'Marketing' | 'Packaging & Sanitation'
  description: string
  amount: number
  frequency: 'Monthly' | 'Weekly' | 'Daily'
  date: string
}

export interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'stock-in' | 'stock-out' | 'transfer' | 'wastage' | 'pos-deduction' | 'adjustment'
  quantity: number
  unit: string
  reason: string
  referenceId?: string
  performedBy: string
  timestamp: string
  costImpact: number
}

export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  category: string
  paymentTerms: string
  rating: number
}

export interface PurchaseOrderItem {
  itemId: string
  itemName: string
  quantity: number
  unit: string
  unitCost: number
  total: number
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled'
  orderDate: string
  expectedDeliveryDate: string
  receivedDate?: string
  notes?: string
}

export interface WastageRecord {
  id: string
  itemId: string
  itemName: string
  quantity: number
  unit: string
  reason: 'Spoiled' | 'Expired' | 'Prep Spill' | 'Kitchen Waste' | 'Defective'
  costLoss: number
  reportedBy: string
  date: string
  notes?: string
}

export interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  guestCount: number
  date: string // YYYY-MM-DD
  timeSlot: string // e.g., '18:30'
  durationMinutes: number
  tableId?: string
  tableName?: string
  diningArea: string
  status: ReservationStatus
  specialRequests?: string
  occasion?: string
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  createdAt: string
  notes?: string
}

export interface FloorTable {
  id: string
  tableNumber: string
  shape: TableShape
  capacity: number
  x: number
  y: number
  width: number
  height: number
  rotation: number // 0, 45, 90, 180
  diningArea: string
  status: TableStatus
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  assignedEmployeeRole?: string
  currentReservationId?: string
  currentGuestName?: string
  currentGuests?: number
  orderId?: string
  activeBillTotal?: number
  combinedWithTableId?: string
  notes?: string
}

export interface POSOrderItem {
  recipeId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  unitCost: number
}

export interface POSOrder {
  id: string
  orderNumber: string
  tableId: string
  tableName: string
  customerName: string
  serverId: string
  serverName: string
  items: POSOrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  costOfGoods: number
  grossProfit: number
  status: 'open' | 'completed' | 'cancelled'
  paymentMethod: 'GCash' | 'Credit Card' | 'Cash' | 'Maya'
  createdAt: string
  completedAt?: string
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: string
  actorRole: string
  action: string
  details: string
  module: 'Scheduling' | 'Costing' | 'Inventory' | 'Reservations' | 'FloorPlan' | 'POS' | 'System'
}

export interface SystemNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'alert'
  timestamp: string
  isRead: boolean
  linkModule?: string
}

// -------------------------------------------------------------
// SEED DATA INITIALIZERS
// -------------------------------------------------------------

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Chef Marco Valerio',
    role: 'Head Chef',
    email: 'marco.valerio@rora.restaurant',
    phone: '+63 917 555 1001',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    colorCode: '#E05A47',
    hourlyRate: 350,
    maxWeeklyHours: 40,
    currentWeeklyHours: 32,
    diningSection: 'Main Dining Kitchen',
    status: 'on-duty',
    hiredDate: '2023-01-15',
  },
  {
    id: 'emp-2',
    name: 'Denise Reyes',
    role: 'General Manager',
    email: 'denise.reyes@rora.restaurant',
    phone: '+63 917 555 1002',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    colorCode: '#D97706',
    hourlyRate: 320,
    maxWeeklyHours: 40,
    currentWeeklyHours: 35,
    diningSection: 'Executive Operations',
    status: 'on-duty',
    hiredDate: '2022-08-10',
  },
  {
    id: 'emp-3',
    name: 'Carlos Mendoza',
    role: 'Lead Server',
    email: 'carlos.m@rora.restaurant',
    phone: '+63 917 555 1003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    colorCode: '#2563EB',
    hourlyRate: 190,
    maxWeeklyHours: 40,
    currentWeeklyHours: 30,
    diningSection: 'Waterfront Veranda',
    status: 'on-duty',
    hiredDate: '2023-05-20',
  },
  {
    id: 'emp-4',
    name: 'Samantha Gomez',
    role: 'Server',
    email: 'samantha.g@rora.restaurant',
    phone: '+63 917 555 1004',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    colorCode: '#059669',
    hourlyRate: 175,
    maxWeeklyHours: 40,
    currentWeeklyHours: 28,
    diningSection: 'Main Dining Room',
    status: 'on-duty',
    hiredDate: '2023-09-01',
  },
  {
    id: 'emp-5',
    name: 'Javier Santos',
    role: 'Senior Barista',
    email: 'javier.s@rora.restaurant',
    phone: '+63 917 555 1005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    colorCode: '#7C3AED',
    hourlyRate: 185,
    maxWeeklyHours: 38,
    currentWeeklyHours: 24,
    diningSection: 'Artisan Espresso Bar',
    status: 'on-duty',
    hiredDate: '2024-02-14',
  },
  {
    id: 'emp-6',
    name: 'Bea Alonzo',
    role: 'Host',
    email: 'bea.alonzo@rora.restaurant',
    phone: '+63 917 555 1006',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    colorCode: '#DB2777',
    hourlyRate: 170,
    maxWeeklyHours: 35,
    currentWeeklyHours: 20,
    diningSection: 'Reception & Foyer',
    status: 'off-duty',
    hiredDate: '2024-03-01',
  },
  {
    id: 'emp-7',
    name: 'Lorenzo Cruz',
    role: 'Server',
    email: 'lorenzo.c@rora.restaurant',
    phone: '+63 917 555 1007',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    colorCode: '#0891B2',
    hourlyRate: 175,
    maxWeeklyHours: 40,
    currentWeeklyHours: 26,
    diningSection: 'Alfresco Patio',
    status: 'off-duty',
    hiredDate: '2024-04-10',
  },
  {
    id: 'emp-8',
    name: 'Patricia Lim',
    role: 'Sommelier',
    email: 'patricia.lim@rora.restaurant',
    phone: '+63 917 555 1008',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    colorCode: '#9333EA',
    hourlyRate: 260,
    maxWeeklyHours: 36,
    currentWeeklyHours: 22,
    diningSection: 'VIP Private Lounge',
    status: 'on-duty',
    hiredDate: '2023-11-15',
  },
]

// Current date helper (2026-11-07)
export const TODAY = '2026-11-07'

export const INITIAL_SHIFTS: Shift[] = [
  // Today's Shifts
  {
    id: 'shift-101',
    employeeId: 'emp-1',
    employeeName: 'Chef Marco Valerio',
    role: 'Head Chef',
    date: TODAY,
    shiftType: 'Morning',
    startTime: '07:00',
    endTime: '15:00',
    hours: 8,
    diningSection: 'Main Dining Kitchen',
    status: 'approved',
    checkInTime: '06:55',
  },
  {
    id: 'shift-102',
    employeeId: 'emp-2',
    employeeName: 'Denise Reyes',
    role: 'General Manager',
    date: TODAY,
    shiftType: 'Afternoon',
    startTime: '11:00',
    endTime: '19:00',
    hours: 8,
    diningSection: 'Executive Operations',
    status: 'approved',
    checkInTime: '10:50',
  },
  {
    id: 'shift-103',
    employeeId: 'emp-3',
    employeeName: 'Carlos Mendoza',
    role: 'Lead Server',
    date: TODAY,
    shiftType: 'Afternoon',
    startTime: '11:00',
    endTime: '19:00',
    hours: 8,
    diningSection: 'Waterfront Veranda',
    status: 'approved',
    checkInTime: '10:58',
  },
  {
    id: 'shift-104',
    employeeId: 'emp-4',
    employeeName: 'Samantha Gomez',
    role: 'Server',
    date: TODAY,
    shiftType: 'Evening',
    startTime: '16:00',
    endTime: '00:00',
    hours: 8,
    diningSection: 'Main Dining Room',
    status: 'approved',
    checkInTime: '15:55',
  },
  {
    id: 'shift-105',
    employeeId: 'emp-5',
    employeeName: 'Javier Santos',
    role: 'Senior Barista',
    date: TODAY,
    shiftType: 'Morning',
    startTime: '07:00',
    endTime: '15:00',
    hours: 8,
    diningSection: 'Artisan Espresso Bar',
    status: 'approved',
    checkInTime: '06:50',
  },
  {
    id: 'shift-106',
    employeeId: 'emp-8',
    employeeName: 'Patricia Lim',
    role: 'Sommelier',
    date: TODAY,
    shiftType: 'Evening',
    startTime: '16:00',
    endTime: '00:00',
    hours: 8,
    diningSection: 'VIP Private Lounge',
    status: 'approved',
    checkInTime: '15:58',
  },
  // Upcoming Shifts this week
  {
    id: 'shift-107',
    employeeId: 'emp-3',
    employeeName: 'Carlos Mendoza',
    role: 'Lead Server',
    date: '2026-11-08',
    shiftType: 'Evening',
    startTime: '16:00',
    endTime: '00:00',
    hours: 8,
    diningSection: 'Waterfront Veranda',
    status: 'approved',
  },
  {
    id: 'shift-108',
    employeeId: 'emp-4',
    employeeName: 'Samantha Gomez',
    role: 'Server',
    date: '2026-11-08',
    shiftType: 'Afternoon',
    startTime: '11:00',
    endTime: '19:00',
    hours: 8,
    diningSection: 'Main Dining Room',
    status: 'approved',
  },
  {
    id: 'shift-109',
    employeeId: 'emp-7',
    employeeName: 'Lorenzo Cruz',
    role: 'Server',
    date: '2026-11-08',
    shiftType: 'Closing',
    startTime: '19:00',
    endTime: '02:00',
    hours: 7,
    diningSection: 'Alfresco Patio',
    status: 'approved',
  },
  {
    id: 'shift-110',
    employeeId: 'emp-6',
    employeeName: 'Bea Alonzo',
    role: 'Host',
    date: '2026-11-08',
    shiftType: 'Evening',
    startTime: '16:00',
    endTime: '00:00',
    hours: 8,
    diningSection: 'Reception & Foyer',
    status: 'preferred', // pending manager approval
  },
  {
    id: 'shift-111',
    employeeId: 'emp-5',
    employeeName: 'Javier Santos',
    role: 'Senior Barista',
    date: '2026-11-09',
    shiftType: 'Morning',
    startTime: '07:00',
    endTime: '15:00',
    hours: 8,
    diningSection: 'Artisan Espresso Bar',
    status: 'approved',
  },
  {
    id: 'shift-112',
    employeeId: 'emp-7',
    employeeName: 'Lorenzo Cruz',
    role: 'Server',
    date: '2026-11-09',
    shiftType: 'Afternoon',
    startTime: '11:00',
    endTime: '19:00',
    hours: 8,
    diningSection: 'Alfresco Patio',
    status: 'preferred',
  },
]

export const INITIAL_SCHEDULE_REQUESTS: ScheduleRequest[] = [
  {
    id: 'req-1',
    employeeId: 'emp-6',
    employeeName: 'Bea Alonzo',
    type: 'preference',
    requestedDate: '2026-11-08',
    shiftType: 'Evening',
    reason: 'Available for evening host duties during weekend rush',
    status: 'pending',
    createdAt: '2026-11-06 14:20',
  },
  {
    id: 'req-2',
    employeeId: 'emp-7',
    employeeName: 'Lorenzo Cruz',
    type: 'swap',
    requestedDate: '2026-11-09',
    shiftType: 'Afternoon',
    swapWithEmployeeId: 'emp-4',
    swapWithEmployeeName: 'Samantha Gomez',
    reason: 'Family appointment on morning of Nov 9; swapping with Samantha with her mutual consent.',
    status: 'pending',
    createdAt: '2026-11-07 09:15',
  },
  {
    id: 'req-3',
    employeeId: 'emp-5',
    employeeName: 'Javier Santos',
    type: 'change',
    requestedDate: '2026-11-10',
    shiftType: 'Afternoon',
    reason: 'Barista workshop certification in the morning',
    status: 'approved',
    createdAt: '2026-11-05 11:00',
    reviewedBy: 'Denise Reyes',
    reviewNotes: 'Approved. Marco will cover early coffee service.',
  },
]

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Prompt exact ingredients for Mango Royale
  {
    id: 'inv-mango',
    sku: 'ING-MNG-001',
    name: 'Fresh Carabao Mango',
    category: 'ingredient',
    unit: 'g',
    unitCost: 0.175, // ₱35 for 200g (₱0.175 per gram)
    stockQuantity: 18500, // 18.5 kg
    minThreshold: 5000,
    reorderPoint: 8000,
    supplierId: 'sup-1',
    supplierName: 'Guimaras Fruit Growers Co-op',
    expirationDate: '2026-11-14',
    batchNumber: 'MNG-26-88',
    storageLocation: 'Walk-in Chiller B2',
    lastRestocked: '2026-11-05',
  },
  {
    id: 'inv-cream',
    sku: 'ING-CRM-002',
    name: 'All-Purpose Heavy Cream',
    category: 'ingredient',
    unit: 'ml',
    unitCost: 0.25, // ₱25 for 100ml (₱0.25 per ml)
    stockQuantity: 12000, // 12 L
    minThreshold: 4000,
    reorderPoint: 6000,
    supplierId: 'sup-2',
    supplierName: 'Hacienda Dairy Specialties',
    expirationDate: '2026-12-01',
    batchNumber: 'CRM-4109',
    storageLocation: 'Cold Dairy Vault 1',
    lastRestocked: '2026-11-04',
  },
  {
    id: 'inv-graham',
    sku: 'ING-GRH-003',
    name: 'Crushed Graham Crackers',
    category: 'ingredient',
    unit: 'g',
    unitCost: 0.30, // ₱15 for 50g (₱0.30 per gram)
    stockQuantity: 8500, // 8.5 kg
    minThreshold: 2000,
    reorderPoint: 4000,
    supplierId: 'sup-3',
    supplierName: 'Baker Elite Provisions',
    expirationDate: '2027-02-15',
    batchNumber: 'GRH-9921',
    storageLocation: 'Dry Pantry Shelf 4',
    lastRestocked: '2026-10-28',
  },
  {
    id: 'inv-condensed',
    sku: 'ING-CND-004',
    name: 'Sweetened Condensed Milk',
    category: 'ingredient',
    unit: 'ml',
    unitCost: 0.20, // ₱10 for 50ml (₱0.20 per ml)
    stockQuantity: 9500, // 9.5 L
    minThreshold: 3000,
    reorderPoint: 5000,
    supplierId: 'sup-2',
    supplierName: 'Hacienda Dairy Specialties',
    expirationDate: '2027-05-10',
    batchNumber: 'CND-8840',
    storageLocation: 'Dry Pantry Shelf 3',
    lastRestocked: '2026-11-02',
  },
  // Additional core ingredients & items
  {
    id: 'inv-ribeye',
    sku: 'ING-RIB-005',
    name: 'Prime Wagyu Ribeye Steak MB6',
    category: 'ingredient',
    unit: 'g',
    unitCost: 2.10, // ₱2.10/g -> ₱630 for 300g
    stockQuantity: 4200, // 4.2 kg (Low stock alert!)
    minThreshold: 5000,
    reorderPoint: 8000,
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    expirationDate: '2026-11-12',
    batchNumber: 'WGY-MB6-09',
    storageLocation: 'Sub-Zero Meat Locker',
    lastRestocked: '2026-11-04',
  },
  {
    id: 'inv-truffle-butter',
    sku: 'ING-TRF-006',
    name: 'Black Truffle Infused Butter',
    category: 'ingredient',
    unit: 'g',
    unitCost: 1.80,
    stockQuantity: 1800,
    minThreshold: 1000,
    reorderPoint: 2000,
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    expirationDate: '2026-12-20',
    batchNumber: 'TRF-102',
    storageLocation: 'Cold Dairy Vault 1',
    lastRestocked: '2026-10-30',
  },
  {
    id: 'inv-coffee-beans',
    sku: 'BEV-COF-007',
    name: 'Mt. Apo Single-Origin Bourbon Arabica',
    category: 'beverage',
    unit: 'g',
    unitCost: 0.85,
    stockQuantity: 14000, // 14 kg
    minThreshold: 4000,
    reorderPoint: 7000,
    supplierId: 'sup-5',
    supplierName: 'Highland Specialty Roasters',
    expirationDate: '2027-01-30',
    batchNumber: 'APO-26-W',
    storageLocation: 'Roastery Shelf Alpha',
    lastRestocked: '2026-11-01',
  },
  {
    id: 'inv-matcha',
    sku: 'BEV-MTC-008',
    name: 'Ceremonial Grade Uji Matcha',
    category: 'beverage',
    unit: 'g',
    unitCost: 3.50,
    stockQuantity: 850, // 850g (Low stock!)
    minThreshold: 1000,
    reorderPoint: 2000,
    supplierId: 'sup-6',
    supplierName: 'Kyoto Tea Importers',
    expirationDate: '2027-04-10',
    batchNumber: 'UJI-991',
    storageLocation: 'Chilled Tea Vault',
    lastRestocked: '2026-10-15',
  },
  {
    id: 'inv-containers',
    sku: 'PKG-BOX-009',
    name: 'Eco Kraft Dessert Container & Lid',
    category: 'packaging',
    unit: 'pcs',
    unitCost: 12.00,
    stockQuantity: 450,
    minThreshold: 150,
    reorderPoint: 300,
    supplierId: 'sup-7',
    supplierName: 'GreenPack Eco Solutions',
    expirationDate: '2029-01-01',
    batchNumber: 'ECO-KRF-55',
    storageLocation: 'Packaging Bay C',
    lastRestocked: '2026-10-20',
  },
  {
    id: 'inv-napkins',
    sku: 'PKG-NPK-010',
    name: 'Embossed Linen-Feel Table Napkins',
    category: 'supplies',
    unit: 'pack',
    unitCost: 85.00,
    stockQuantity: 80,
    minThreshold: 30,
    reorderPoint: 60,
    supplierId: 'sup-7',
    supplierName: 'GreenPack Eco Solutions',
    expirationDate: '2030-01-01',
    batchNumber: 'NPK-880',
    storageLocation: 'Supply Storage A1',
    lastRestocked: '2026-10-25',
  },
  {
    id: 'inv-beef-patty',
    sku: 'ING-BEEF-011',
    name: 'Prime Ground Chuck Patty',
    category: 'ingredient',
    unit: 'pcs',
    unitCost: 65.00,
    stockQuantity: 180,
    minThreshold: 40,
    reorderPoint: 80,
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    expirationDate: '2026-11-15',
    batchNumber: 'BF-PTY-90',
    storageLocation: 'Meat Chiller Vault',
    lastRestocked: '2026-11-05',
  },
  {
    id: 'inv-burger-bun',
    sku: 'ING-BUN-012',
    name: 'Toasted Brioche Burger Buns',
    category: 'ingredient',
    unit: 'pcs',
    unitCost: 18.00,
    stockQuantity: 240,
    minThreshold: 50,
    reorderPoint: 100,
    supplierId: 'sup-3',
    supplierName: 'Baker Elite Provisions',
    expirationDate: '2026-11-12',
    batchNumber: 'BUN-881',
    storageLocation: 'Bakery Dry Storage',
    lastRestocked: '2026-11-06',
  },
  {
    id: 'inv-cheddar',
    sku: 'ING-CHD-013',
    name: 'Sharp Cheddar Cheese Slices',
    category: 'ingredient',
    unit: 'pcs',
    unitCost: 12.00,
    stockQuantity: 300,
    minThreshold: 60,
    reorderPoint: 120,
    supplierId: 'sup-2',
    supplierName: 'Hacienda Dairy Specialties',
    expirationDate: '2026-12-15',
    batchNumber: 'CHD-551',
    storageLocation: 'Cold Dairy Vault 1',
    lastRestocked: '2026-11-04',
  },
  {
    id: 'inv-french-fries',
    sku: 'ING-FRY-014',
    name: 'Crispy Shoestring Potatoes',
    category: 'ingredient',
    unit: 'g',
    unitCost: 0.14,
    stockQuantity: 20000,
    minThreshold: 4000,
    reorderPoint: 8000,
    supplierId: 'sup-3',
    supplierName: 'Baker Elite Provisions',
    expirationDate: '2027-04-10',
    batchNumber: 'FRY-101',
    storageLocation: 'Deep Freeze Bay 2',
    lastRestocked: '2026-11-03',
  },
  {
    id: 'inv-salmon',
    sku: 'ING-SLM-015',
    name: 'Fresh Norwegian Salmon Fillet',
    category: 'ingredient',
    unit: 'g',
    unitCost: 1.45,
    stockQuantity: 6500,
    minThreshold: 1500,
    reorderPoint: 3000,
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    expirationDate: '2026-11-11',
    batchNumber: 'SLM-NOR-22',
    storageLocation: 'Sub-Zero Fish Cooler',
    lastRestocked: '2026-11-06',
  },
  {
    id: 'inv-tuna',
    sku: 'ING-TNA-016',
    name: 'Sashimi Grade Yellowfin Maguro',
    category: 'ingredient',
    unit: 'g',
    unitCost: 1.35,
    stockQuantity: 5200,
    minThreshold: 1200,
    reorderPoint: 2500,
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    expirationDate: '2026-11-11',
    batchNumber: 'MAG-TNA-08',
    storageLocation: 'Sub-Zero Fish Cooler',
    lastRestocked: '2026-11-06',
  },
  {
    id: 'inv-sushi-rice',
    sku: 'ING-RCE-017',
    name: 'Seasoned Koshihikari Sushi Rice',
    category: 'ingredient',
    unit: 'g',
    unitCost: 0.08,
    stockQuantity: 30000,
    minThreshold: 6000,
    reorderPoint: 12000,
    supplierId: 'sup-3',
    supplierName: 'Baker Elite Provisions',
    expirationDate: '2027-06-30',
    batchNumber: 'RCE-KSH-99',
    storageLocation: 'Dry Pantry Shelf 2',
    lastRestocked: '2026-11-02',
  },
  {
    id: 'inv-tobiko',
    sku: 'ING-TBK-018',
    name: 'Gold Orange Flying Fish Roe (Tobiko)',
    category: 'ingredient',
    unit: 'g',
    unitCost: 1.85,
    stockQuantity: 1400,
    minThreshold: 400,
    reorderPoint: 800,
    supplierId: 'sup-6',
    supplierName: 'Kyoto Tea Importers',
    expirationDate: '2026-12-10',
    batchNumber: 'TBK-201',
    storageLocation: 'Chilled Vault 2',
    lastRestocked: '2026-10-31',
  },
]

export const INITIAL_RECIPES: RecipeItem[] = [
  // The Prompt's EXACT example: Mango Royale
  // Mango: 200g @ ₱35
  // Cream: 100ml @ ₱25
  // Graham: 50g @ ₱15
  // Condensed Milk: 50ml @ ₱10
  // Total Ingredient Cost = ₱85.00
  {
    id: 'rec-mango-royale',
    name: 'Mango Royale',
    category: 'Desserts',
    servingSize: 1,
    laborCost: 20.00,
    overheadCost: 15.00,
    ingredients: [
      {
        inventoryItemId: 'inv-mango',
        ingredientName: 'Fresh Carabao Mango',
        quantity: 200,
        unit: 'g',
        unitCost: 0.175,
        lineCost: 35.00,
      },
      {
        inventoryItemId: 'inv-cream',
        ingredientName: 'All-Purpose Heavy Cream',
        quantity: 100,
        unit: 'ml',
        unitCost: 0.25,
        lineCost: 25.00,
      },
      {
        inventoryItemId: 'inv-graham',
        ingredientName: 'Crushed Graham Crackers',
        quantity: 50,
        unit: 'g',
        unitCost: 0.30,
        lineCost: 15.00,
      },
      {
        inventoryItemId: 'inv-condensed',
        ingredientName: 'Sweetened Condensed Milk',
        quantity: 50,
        unit: 'ml',
        unitCost: 0.20,
        lineCost: 10.00,
      },
    ],
    totalIngredientCost: 85.00,
    totalProductionCost: 120.00, // 85 + 20 + 15
    suggestedSellingPrice: 220.00,
    currentSellingPrice: 220.00,
    foodCostPercentage: 38.64, // (85 / 220) * 100
    grossProfit: 100.00, // 220 - 120
    profitMarginPercentage: 45.45,
    description: 'Chilled layers of hand-selected Guimaras mangoes, whipped vanilla cream, and buttery toasted grahams.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    historicalCostRecords: [
      {
        date: '2026-10-15',
        previousCost: 80.00,
        newCost: 85.00,
        reason: 'Seasonal adjustment on fresh Carabao mango harvest pricing',
        updatedBy: 'Chef Marco Valerio',
      },
    ],
    updatedAt: '2026-11-05',
  },
  {
    id: 'rec-wagyu-ribeye',
    name: 'Charred Wagyu Ribeye MB6',
    category: 'Main Entrees',
    servingSize: 1,
    laborCost: 95.00,
    overheadCost: 45.00,
    ingredients: [
      {
        inventoryItemId: 'inv-ribeye',
        ingredientName: 'Prime Wagyu Ribeye Steak MB6',
        quantity: 300,
        unit: 'g',
        unitCost: 2.10,
        lineCost: 630.00,
      },
      {
        inventoryItemId: 'inv-truffle-butter',
        ingredientName: 'Black Truffle Infused Butter',
        quantity: 30,
        unit: 'g',
        unitCost: 1.80,
        lineCost: 54.00,
      },
    ],
    totalIngredientCost: 684.00,
    totalProductionCost: 824.00,
    suggestedSellingPrice: 1650.00,
    currentSellingPrice: 1650.00,
    foodCostPercentage: 41.45,
    grossProfit: 826.00,
    profitMarginPercentage: 50.06,
    description: 'Cast-iron seared 300g Australian Wagyu, basted with black truffle butter and smoked sea salt.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-04',
  },
  {
    id: 'rec-cloud-matcha',
    name: 'Ceremonial Cloud Matcha Latte',
    category: 'Artisan Coffee',
    servingSize: 1,
    laborCost: 18.00,
    overheadCost: 10.00,
    ingredients: [
      {
        inventoryItemId: 'inv-matcha',
        ingredientName: 'Ceremonial Grade Uji Matcha',
        quantity: 8,
        unit: 'g',
        unitCost: 3.50,
        lineCost: 28.00,
      },
      {
        inventoryItemId: 'inv-cream',
        ingredientName: 'All-Purpose Heavy Cream',
        quantity: 60,
        unit: 'ml',
        unitCost: 0.25,
        lineCost: 15.00,
      },
      {
        inventoryItemId: 'inv-condensed',
        ingredientName: 'Sweetened Condensed Milk',
        quantity: 25,
        unit: 'ml',
        unitCost: 0.20,
        lineCost: 5.00,
      },
    ],
    totalIngredientCost: 48.00,
    totalProductionCost: 76.00,
    suggestedSellingPrice: 240.00,
    currentSellingPrice: 240.00,
    foodCostPercentage: 20.00,
    grossProfit: 164.00,
    profitMarginPercentage: 68.33,
    description: 'Whisked ceremonial Kyoto Uji matcha topped with hand-shaken sea salt cream cloud.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-01',
  },
  // Items matching ordering UI screenshot:
  {
    id: 'rec-classic-burger',
    name: 'Classic Beef Burger',
    category: 'Burger' as any,
    servingSize: 1,
    laborCost: 25.00,
    overheadCost: 15.00,
    ingredients: [
      {
        inventoryItemId: 'inv-beef-patty',
        ingredientName: 'Prime Ground Chuck Patty',
        quantity: 1,
        unit: 'pcs',
        unitCost: 65.00,
        lineCost: 65.00,
      },
      {
        inventoryItemId: 'inv-burger-bun',
        ingredientName: 'Toasted Brioche Burger Buns',
        quantity: 1,
        unit: 'pcs',
        unitCost: 18.00,
        lineCost: 18.00,
      },
      {
        inventoryItemId: 'inv-cheddar',
        ingredientName: 'Sharp Cheddar Cheese Slices',
        quantity: 1,
        unit: 'pcs',
        unitCost: 12.00,
        lineCost: 12.00,
      },
    ],
    totalIngredientCost: 95.00,
    totalProductionCost: 135.00,
    suggestedSellingPrice: 239.00,
    currentSellingPrice: 239.00,
    foodCostPercentage: 39.75,
    grossProfit: 104.00,
    profitMarginPercentage: 43.51,
    description: 'Fresh grilled pure beef patty, melted cheddar, lettuce, and secret house burger sauce on toasted brioche.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-burger-combo',
    name: 'Beef Burger Combo',
    category: 'Burger' as any,
    servingSize: 1,
    laborCost: 35.00,
    overheadCost: 20.00,
    ingredients: [
      {
        inventoryItemId: 'inv-beef-patty',
        ingredientName: 'Prime Ground Chuck Patty',
        quantity: 1,
        unit: 'pcs',
        unitCost: 65.00,
        lineCost: 65.00,
      },
      {
        inventoryItemId: 'inv-burger-bun',
        ingredientName: 'Toasted Brioche Burger Buns',
        quantity: 1,
        unit: 'pcs',
        unitCost: 18.00,
        lineCost: 18.00,
      },
      {
        inventoryItemId: 'inv-cheddar',
        ingredientName: 'Sharp Cheddar Cheese Slices',
        quantity: 2,
        unit: 'pcs',
        unitCost: 12.00,
        lineCost: 24.00,
      },
      {
        inventoryItemId: 'inv-french-fries',
        ingredientName: 'Crispy Shoestring Potatoes',
        quantity: 180,
        unit: 'g',
        unitCost: 0.14,
        lineCost: 25.20,
      },
    ],
    totalIngredientCost: 132.20,
    totalProductionCost: 187.20,
    suggestedSellingPrice: 399.00,
    currentSellingPrice: 399.00,
    foodCostPercentage: 33.13,
    grossProfit: 211.80,
    profitMarginPercentage: 53.08,
    description: 'Double cheese flame-broiled burger served with a mountain of golden shoestring fries and cold drink.',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-tobiko-roll',
    name: 'Tobiko Roll',
    category: 'Sushi' as any,
    servingSize: 1,
    laborCost: 30.00,
    overheadCost: 15.00,
    ingredients: [
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 140,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 11.20,
      },
      {
        inventoryItemId: 'inv-tobiko',
        ingredientName: 'Gold Orange Flying Fish Roe (Tobiko)',
        quantity: 25,
        unit: 'g',
        unitCost: 1.85,
        lineCost: 46.25,
      },
      {
        inventoryItemId: 'inv-salmon',
        ingredientName: 'Fresh Norwegian Salmon Fillet',
        quantity: 40,
        unit: 'g',
        unitCost: 1.45,
        lineCost: 58.00,
      },
    ],
    totalIngredientCost: 115.45,
    totalProductionCost: 160.45,
    suggestedSellingPrice: 239.00,
    currentSellingPrice: 239.00,
    foodCostPercentage: 48.31,
    grossProfit: 78.55,
    profitMarginPercentage: 32.87,
    description: 'Crisp cucumber and salmon maki rolled in crunchy vibrant flying fish roe with pickled ginger.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-salmon-nigiri',
    name: 'Salmon Nigiri',
    category: 'Sushi' as any,
    servingSize: 1,
    laborCost: 25.00,
    overheadCost: 10.00,
    ingredients: [
      {
        inventoryItemId: 'inv-salmon',
        ingredientName: 'Fresh Norwegian Salmon Fillet',
        quantity: 60,
        unit: 'g',
        unitCost: 1.45,
        lineCost: 87.00,
      },
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 70,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 5.60,
      },
    ],
    totalIngredientCost: 92.60,
    totalProductionCost: 127.60,
    suggestedSellingPrice: 250.00,
    currentSellingPrice: 250.00,
    foodCostPercentage: 37.04,
    grossProfit: 122.40,
    profitMarginPercentage: 48.96,
    description: 'Twin hand-pressed nigiri with premium sashimi-grade Atlantic salmon glazed with sweet nikiri shoyu.',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-maguro-nigiri',
    name: 'Maguro Nigiri',
    category: 'Sashimi' as any,
    servingSize: 1,
    laborCost: 25.00,
    overheadCost: 10.00,
    ingredients: [
      {
        inventoryItemId: 'inv-tuna',
        ingredientName: 'Sashimi Grade Yellowfin Maguro',
        quantity: 60,
        unit: 'g',
        unitCost: 1.35,
        lineCost: 81.00,
      },
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 70,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 5.60,
      },
    ],
    totalIngredientCost: 86.60,
    totalProductionCost: 121.60,
    suggestedSellingPrice: 219.00,
    currentSellingPrice: 219.00,
    foodCostPercentage: 39.54,
    grossProfit: 97.40,
    profitMarginPercentage: 44.47,
    description: 'Tender ruby-red yellowfin tuna draped over warm seasoned sushi rice with freshly grated wasabi.',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-shime-saba-nigiri',
    name: 'Shime Saba Nigiri',
    category: 'Sushi' as any,
    servingSize: 1,
    laborCost: 28.00,
    overheadCost: 12.00,
    ingredients: [
      {
        inventoryItemId: 'inv-tuna',
        ingredientName: 'Cured Mackerel Saba',
        quantity: 60,
        unit: 'g',
        unitCost: 1.20,
        lineCost: 72.00,
      },
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 70,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 5.60,
      },
    ],
    totalIngredientCost: 77.60,
    totalProductionCost: 117.60,
    suggestedSellingPrice: 279.00,
    currentSellingPrice: 279.00,
    foodCostPercentage: 27.81,
    grossProfit: 161.40,
    profitMarginPercentage: 57.85,
    description: 'Vinegar and salt cured mackerel lightly torched and topped with scallions and grated ginger.',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-tempura-roll',
    name: 'Tempura Roll',
    category: 'Tempura' as any,
    servingSize: 1,
    laborCost: 30.00,
    overheadCost: 15.00,
    ingredients: [
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 140,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 11.20,
      },
      {
        inventoryItemId: 'inv-salmon',
        ingredientName: 'Crispy Tiger Shrimp Tempura',
        quantity: 2,
        unit: 'pcs',
        unitCost: 35.00,
        lineCost: 70.00,
      },
    ],
    totalIngredientCost: 81.20,
    totalProductionCost: 126.20,
    suggestedSellingPrice: 249.00,
    currentSellingPrice: 249.00,
    foodCostPercentage: 32.61,
    grossProfit: 122.80,
    profitMarginPercentage: 49.32,
    description: 'Golden crispy tempura shrimp, avocado, and unagi glaze drizzle rolled with toasted sesame.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-alaska-roll',
    name: 'Alaska Roll',
    category: 'Sushi' as any,
    servingSize: 1,
    laborCost: 28.00,
    overheadCost: 14.00,
    ingredients: [
      {
        inventoryItemId: 'inv-salmon',
        ingredientName: 'Fresh Norwegian Salmon Fillet',
        quantity: 50,
        unit: 'g',
        unitCost: 1.45,
        lineCost: 72.50,
      },
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 130,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 10.40,
      },
    ],
    totalIngredientCost: 82.90,
    totalProductionCost: 124.90,
    suggestedSellingPrice: 239.00,
    currentSellingPrice: 239.00,
    foodCostPercentage: 34.69,
    grossProfit: 114.10,
    profitMarginPercentage: 47.74,
    description: 'Silky raw salmon wrapped over avocado, cucumber, and light cream cheese.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
  {
    id: 'rec-unagi-roll',
    name: 'Unagi Roll',
    category: 'Sushi' as any,
    servingSize: 1,
    laborCost: 28.00,
    overheadCost: 14.00,
    ingredients: [
      {
        inventoryItemId: 'inv-tuna',
        ingredientName: 'BBQ Freshwater Eel Unagi',
        quantity: 45,
        unit: 'g',
        unitCost: 1.60,
        lineCost: 72.00,
      },
      {
        inventoryItemId: 'inv-sushi-rice',
        ingredientName: 'Seasoned Koshihikari Sushi Rice',
        quantity: 130,
        unit: 'g',
        unitCost: 0.08,
        lineCost: 10.40,
      },
    ],
    totalIngredientCost: 82.40,
    totalProductionCost: 124.40,
    suggestedSellingPrice: 230.00,
    currentSellingPrice: 230.00,
    foodCostPercentage: 35.83,
    grossProfit: 105.60,
    profitMarginPercentage: 45.91,
    description: 'Rich grilled eel glazed with sweet tare reduction and fresh cucumber inside.',
    image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&auto=format&fit=crop&q=80',
    historicalCostRecords: [],
    updatedAt: '2026-11-07',
  },
]

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Guimaras Fruit Growers Co-op',
    contactPerson: 'Ramon De Leon',
    email: 'orders@guimarasfruits.ph',
    phone: '+63 917 222 3001',
    category: 'Fresh Fruits & Produce',
    paymentTerms: 'Net 15',
    rating: 4.9,
  },
  {
    id: 'sup-2',
    name: 'Hacienda Dairy Specialties',
    contactPerson: 'Elena Vasquez',
    email: 'accounts@haciendadairy.ph',
    phone: '+63 918 444 8002',
    category: 'Dairy, Milk & Cream',
    paymentTerms: 'Net 30',
    rating: 4.8,
  },
  {
    id: 'sup-3',
    name: 'Baker Elite Provisions',
    contactPerson: 'Grace Bernardo',
    email: 'sales@bakerelite.ph',
    phone: '+63 920 111 9003',
    category: 'Flour, Grahams & Bakery',
    paymentTerms: 'Net 30',
    rating: 4.7,
  },
  {
    id: 'sup-4',
    name: 'Prime Butcher Cuts Manila',
    contactPerson: 'Antonio Soriano',
    email: 'butcher@primecuts.com.ph',
    phone: '+63 917 888 7704',
    category: 'Wagyu, Steaks & Chilled Meats',
    paymentTerms: 'Net 15',
    rating: 5.0,
  },
  {
    id: 'sup-7',
    name: 'GreenPack Eco Solutions',
    contactPerson: 'Kimberly Tan',
    email: 'kim@greenpack.ph',
    phone: '+63 922 999 4405',
    category: 'Packaging & Restaurant Sanitation',
    paymentTerms: 'Net 30',
    rating: 4.6,
  },
]

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1001',
    poNumber: 'PO-2026-088',
    supplierId: 'sup-1',
    supplierName: 'Guimaras Fruit Growers Co-op',
    items: [
      {
        itemId: 'inv-mango',
        itemName: 'Fresh Carabao Mango',
        quantity: 15000,
        unit: 'g',
        unitCost: 0.175,
        total: 2625.00,
      },
    ],
    totalAmount: 2625.00,
    status: 'Received',
    orderDate: '2026-11-04',
    expectedDeliveryDate: '2026-11-05',
    receivedDate: '2026-11-05 08:30',
    notes: 'Delivered in chilled insulated crates.',
  },
  {
    id: 'po-1002',
    poNumber: 'PO-2026-089',
    supplierId: 'sup-4',
    supplierName: 'Prime Butcher Cuts Manila',
    items: [
      {
        itemId: 'inv-ribeye',
        itemName: 'Prime Wagyu Ribeye Steak MB6',
        quantity: 10000,
        unit: 'g',
        unitCost: 2.10,
        total: 21000.00,
      },
    ],
    totalAmount: 21000.00,
    status: 'Sent',
    orderDate: '2026-11-06',
    expectedDeliveryDate: '2026-11-08',
    notes: 'Urgent weekend restocking.',
  },
]

export const INITIAL_WASTAGE_RECORDS: WastageRecord[] = [
  {
    id: 'wst-1',
    itemId: 'inv-mango',
    itemName: 'Fresh Carabao Mango',
    quantity: 600,
    unit: 'g',
    reason: 'Spoiled',
    costLoss: 105.00,
    reportedBy: 'Chef Marco Valerio',
    date: '2026-11-06',
    notes: 'Bruised during delivery unloading.',
  },
  {
    id: 'wst-2',
    itemId: 'inv-cream',
    itemName: 'All-Purpose Heavy Cream',
    quantity: 250,
    unit: 'ml',
    reason: 'Prep Spill',
    costLoss: 62.50,
    reportedBy: 'Javier Santos',
    date: '2026-11-07',
    notes: 'Spilled during espresso cloud whip prep.',
  },
]

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-1',
    itemId: 'inv-mango',
    itemName: 'Fresh Carabao Mango',
    type: 'stock-in',
    quantity: 15000,
    unit: 'g',
    reason: 'PO-2026-088 Received from Guimaras Co-op',
    referenceId: 'po-1001',
    performedBy: 'Chef Marco Valerio',
    timestamp: '2026-11-05 08:35',
    costImpact: 2625.00,
  },
  {
    id: 'sm-2',
    itemId: 'inv-mango',
    itemName: 'Fresh Carabao Mango',
    type: 'pos-deduction',
    quantity: -400,
    unit: 'g',
    reason: 'POS Order RD-742: 2x Mango Royale',
    referenceId: 'ord-742',
    performedBy: 'POS Automatic System',
    timestamp: '2026-11-07 14:15',
    costImpact: -70.00,
  },
  {
    id: 'sm-3',
    itemId: 'inv-cream',
    itemName: 'All-Purpose Heavy Cream',
    type: 'pos-deduction',
    quantity: -200,
    unit: 'ml',
    reason: 'POS Order RD-742: 2x Mango Royale',
    referenceId: 'ord-742',
    performedBy: 'POS Automatic System',
    timestamp: '2026-11-07 14:15',
    costImpact: -50.00,
  },
  {
    id: 'sm-4',
    itemId: 'inv-mango',
    itemName: 'Fresh Carabao Mango',
    type: 'wastage',
    quantity: -600,
    unit: 'g',
    reason: 'Spoilage loss recorded',
    referenceId: 'wst-1',
    performedBy: 'Chef Marco Valerio',
    timestamp: '2026-11-06 17:00',
    costImpact: -105.00,
  },
]

export const INITIAL_OPERATING_EXPENSES: OperatingExpense[] = [
  {
    id: 'opex-1',
    category: 'Rent',
    description: 'Veranda Lakeside Lease',
    amount: 145000,
    frequency: 'Monthly',
    date: '2026-11-01',
  },
  {
    id: 'opex-2',
    category: 'Labor',
    description: 'Floor & Kitchen Staff Payroll (Bi-weekly)',
    amount: 185000,
    frequency: 'Monthly',
    date: '2026-11-01',
  },
  {
    id: 'opex-3',
    category: 'Utilities',
    description: 'Meralco Commercial Power & Chiller Refrigeration',
    amount: 48000,
    frequency: 'Monthly',
    date: '2026-11-03',
  },
  {
    id: 'opex-4',
    category: 'Packaging & Sanitation',
    description: 'Eco Takeout Boxes & Cleaning Chemicals',
    amount: 18500,
    frequency: 'Monthly',
    date: '2026-11-02',
  },
]

export const INITIAL_TABLES: FloorTable[] = [
  // Waterfront Veranda Zone
  {
    id: 'tbl-v1',
    tableNumber: 'V-01',
    shape: 'square',
    capacity: 4,
    x: 40,
    y: 50,
    width: 90,
    height: 90,
    rotation: 0,
    diningArea: 'Waterfront Veranda',
    status: 'occupied',
    assignedEmployeeId: 'emp-3',
    assignedEmployeeName: 'Carlos Mendoza',
    assignedEmployeeRole: 'Lead Server',
    currentGuestName: 'Camille Santos',
    currentGuests: 3,
    orderId: 'ord-742',
    activeBillTotal: 1240.00,
    notes: 'Lake sunset view table. Prefers sparkling water.',
  },
  {
    id: 'tbl-v2',
    tableNumber: 'V-02',
    shape: 'round',
    capacity: 2,
    x: 180,
    y: 50,
    width: 80,
    height: 80,
    rotation: 0,
    diningArea: 'Waterfront Veranda',
    status: 'available',
    assignedEmployeeId: 'emp-3',
    assignedEmployeeName: 'Carlos Mendoza',
    assignedEmployeeRole: 'Lead Server',
    notes: 'Intimate date-night table overlooking lake fountain.',
  },
  {
    id: 'tbl-v3',
    tableNumber: 'V-03',
    shape: 'rectangular',
    capacity: 6,
    x: 310,
    y: 45,
    width: 130,
    height: 95,
    rotation: 0,
    diningArea: 'Waterfront Veranda',
    status: 'reserved',
    assignedEmployeeId: 'emp-3',
    assignedEmployeeName: 'Carlos Mendoza',
    assignedEmployeeRole: 'Lead Server',
    currentReservationId: 'res-101',
    currentGuestName: 'Atty. Victor Cruz',
    currentGuests: 5,
    notes: 'Reserved for 19:00 dinner. High-chair requested.',
  },
  // Main Dining Room Zone
  {
    id: 'tbl-m1',
    tableNumber: 'M-01',
    shape: 'booth',
    capacity: 4,
    x: 40,
    y: 200,
    width: 105,
    height: 95,
    rotation: 0,
    diningArea: 'Main Dining Room',
    status: 'occupied',
    assignedEmployeeId: 'emp-4',
    assignedEmployeeName: 'Samantha Gomez',
    assignedEmployeeRole: 'Server',
    currentGuestName: 'Mark Villanueva',
    currentGuests: 4,
    orderId: 'ord-743',
    activeBillTotal: 3450.00,
    notes: 'Plush velvet booth seating.',
  },
  {
    id: 'tbl-m2',
    tableNumber: 'M-02',
    shape: 'rectangular',
    capacity: 4,
    x: 180,
    y: 200,
    width: 100,
    height: 85,
    rotation: 0,
    diningArea: 'Main Dining Room',
    status: 'cleaning',
    assignedEmployeeId: 'emp-4',
    assignedEmployeeName: 'Samantha Gomez',
    assignedEmployeeRole: 'Server',
    notes: 'Guests just checked out; busboy clearing and sanitizing.',
  },
  {
    id: 'tbl-m3',
    tableNumber: 'M-03',
    shape: 'communal',
    capacity: 10,
    x: 310,
    y: 195,
    width: 170,
    height: 95,
    rotation: 0,
    diningArea: 'Main Dining Room',
    status: 'available',
    assignedEmployeeId: 'emp-4',
    assignedEmployeeName: 'Samantha Gomez',
    assignedEmployeeRole: 'Server',
    notes: 'Solid Acacia communal table for large group bookings.',
  },
  // Alfresco Patio Zone
  {
    id: 'tbl-p1',
    tableNumber: 'P-01',
    shape: 'round',
    capacity: 4,
    x: 40,
    y: 350,
    width: 85,
    height: 85,
    rotation: 0,
    diningArea: 'Alfresco Patio',
    status: 'available',
    notes: 'Breezy garden terrace with umbrella canopy.',
  },
  {
    id: 'tbl-p2',
    tableNumber: 'P-02',
    shape: 'square',
    capacity: 2,
    x: 180,
    y: 350,
    width: 75,
    height: 75,
    rotation: 0,
    diningArea: 'Alfresco Patio',
    status: 'reserved',
    currentReservationId: 'res-103',
    currentGuestName: 'Chloe Delgado',
    currentGuests: 2,
    notes: 'Anniversary couple booking at 20:00.',
  },
  {
    id: 'tbl-p3',
    tableNumber: 'P-03',
    shape: 'rectangular',
    capacity: 6,
    x: 310,
    y: 345,
    width: 120,
    height: 85,
    rotation: 0,
    diningArea: 'Alfresco Patio',
    status: 'unavailable',
    notes: 'Scheduled for patio deck floor refinishing today.',
  },
  // VIP Private Lounge Zone
  {
    id: 'tbl-vip1',
    tableNumber: 'VIP-A',
    shape: 'lounge',
    capacity: 8,
    x: 40,
    y: 490,
    width: 160,
    height: 100,
    rotation: 0,
    diningArea: 'VIP Private Lounge',
    status: 'occupied',
    assignedEmployeeId: 'emp-8',
    assignedEmployeeName: 'Patricia Lim',
    assignedEmployeeRole: 'Sommelier',
    currentGuestName: 'Senator Fernando Estate',
    currentGuests: 7,
    orderId: 'ord-744',
    activeBillTotal: 8900.00,
    notes: 'Wine cellar private tasting suite.',
  },
  {
    id: 'tbl-vip2',
    tableNumber: 'VIP-B',
    shape: 'lounge',
    capacity: 6,
    x: 250,
    y: 490,
    width: 140,
    height: 100,
    rotation: 0,
    diningArea: 'VIP Private Lounge',
    status: 'available',
    assignedEmployeeId: 'emp-8',
    assignedEmployeeName: 'Patricia Lim',
    assignedEmployeeRole: 'Sommelier',
    notes: 'Private acoustic partition and dedicated sommelier service.',
  },
]

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    customerName: 'Atty. Victor Cruz',
    customerPhone: '+63 917 555 3301',
    customerEmail: 'vcruz.law@gmail.com',
    guestCount: 5,
    date: TODAY,
    timeSlot: '19:00',
    durationMinutes: 120,
    tableId: 'tbl-v3',
    tableName: 'V-03',
    diningArea: 'Waterfront Veranda',
    status: 'Confirmed',
    specialRequests: 'Celebrating senior partner promotion. Please prepare wine bucket.',
    occasion: 'Business Dinner',
    assignedEmployeeId: 'emp-3',
    assignedEmployeeName: 'Carlos Mendoza',
    createdAt: '2026-11-05 16:30',
  },
  {
    id: 'res-102',
    customerName: 'Camille Santos',
    customerPhone: '+63 918 222 9911',
    customerEmail: 'camille.s@yahoo.com',
    guestCount: 3,
    date: TODAY,
    timeSlot: '13:30',
    durationMinutes: 90,
    tableId: 'tbl-v1',
    tableName: 'V-01',
    diningArea: 'Waterfront Veranda',
    status: 'Seated',
    specialRequests: 'Window lakeside seat preferred.',
    occasion: 'Family Lunch',
    assignedEmployeeId: 'emp-3',
    assignedEmployeeName: 'Carlos Mendoza',
    createdAt: '2026-11-06 10:15',
  },
  {
    id: 'res-103',
    customerName: 'Chloe Delgado',
    customerPhone: '+63 920 888 1245',
    customerEmail: 'chloe.delgado@icloud.com',
    guestCount: 2,
    date: TODAY,
    timeSlot: '20:00',
    durationMinutes: 120,
    tableId: 'tbl-p2',
    tableName: 'P-02',
    diningArea: 'Alfresco Patio',
    status: 'Confirmed',
    specialRequests: '3rd Year Anniversary! Candle on table please.',
    occasion: 'Anniversary',
    assignedEmployeeId: 'emp-7',
    assignedEmployeeName: 'Lorenzo Cruz',
    createdAt: '2026-11-06 18:40',
  },
  {
    id: 'res-104',
    customerName: 'Dr. Raymond Cruz',
    customerPhone: '+63 917 333 4455',
    customerEmail: 'raymond.cruz@med.ph',
    guestCount: 8,
    date: '2026-11-08',
    timeSlot: '18:30',
    durationMinutes: 150,
    tableId: 'tbl-m3',
    tableName: 'M-03',
    diningArea: 'Main Dining Room',
    status: 'Pending',
    specialRequests: 'Need table for medical conference banquet. Audio-visual presentation.',
    occasion: 'Corporate Meeting',
    createdAt: '2026-11-07 11:20',
  },
  {
    id: 'res-105',
    customerName: 'Janelle Dizon',
    customerPhone: '+63 922 444 7788',
    customerEmail: 'janelle.d@gmail.com',
    guestCount: 2,
    date: '2026-11-09',
    timeSlot: '12:00',
    durationMinutes: 90,
    diningArea: 'Waterfront Veranda',
    status: 'Pending',
    specialRequests: 'High chair for 1-year old toddler.',
    occasion: 'Casual Dining',
    createdAt: '2026-11-07 14:00',
  },
]

export const INITIAL_POS_ORDERS: POSOrder[] = [
  {
    id: 'ord-742',
    orderNumber: 'ORD-2026-742',
    tableId: 'tbl-v1',
    tableName: 'V-01',
    customerName: 'Camille Santos',
    serverId: 'emp-3',
    serverName: 'Carlos Mendoza',
    items: [
      {
        recipeId: 'rec-mango-royale',
        name: 'Mango Royale',
        quantity: 2,
        unitPrice: 220.00,
        subtotal: 440.00,
        unitCost: 120.00,
      },
      {
        recipeId: 'rec-cloud-matcha',
        name: 'Ceremonial Cloud Matcha Latte',
        quantity: 2,
        unitPrice: 240.00,
        subtotal: 480.00,
        unitCost: 76.00,
      },
      {
        recipeId: 'rec-mango-royale',
        name: 'Extra Graham Crumble & Cloud',
        quantity: 1,
        unitPrice: 120.00,
        subtotal: 120.00,
        unitCost: 35.00,
      },
    ],
    subtotal: 1040.00,
    tax: 124.80,
    discount: 0.00,
    total: 1164.80,
    costOfGoods: 427.00,
    grossProfit: 737.80,
    status: 'open',
    paymentMethod: 'GCash',
    createdAt: '2026-11-07 14:10',
  },
]

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-07 15:58',
    actor: 'Patricia Lim',
    actorRole: 'Sommelier',
    action: 'Clock In',
    details: 'Clocked in for Evening shift at VIP Private Lounge.',
    module: 'Scheduling',
  },
  {
    id: 'log-2',
    timestamp: '2026-11-07 15:55',
    actor: 'Samantha Gomez',
    actorRole: 'Server',
    action: 'Clock In',
    details: 'Clocked in for Evening shift at Main Dining Room.',
    module: 'Scheduling',
  },
  {
    id: 'log-3',
    timestamp: '2026-11-07 14:15',
    actor: 'System POS Engine',
    actorRole: 'Automated',
    action: 'Inventory Stock Deduction',
    details: 'Deducted 400g Carabao Mango, 200ml Heavy Cream for Order ORD-2026-742.',
    module: 'POS',
  },
  {
    id: 'log-4',
    timestamp: '2026-11-07 13:30',
    actor: 'Carlos Mendoza',
    actorRole: 'Lead Server',
    action: 'Seat Guests',
    details: 'Seated reservation for Camille Santos at Table V-01 (Veranda).',
    module: 'FloorPlan',
  },
  {
    id: 'log-5',
    timestamp: '2026-11-06 17:00',
    actor: 'Chef Marco Valerio',
    actorRole: 'Head Chef',
    action: 'Record Spoilage',
    details: 'Logged 600g bruised Carabao Mango as kitchen spoilage (₱105 loss).',
    module: 'Inventory',
  },
]

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Warning',
    message: 'Ceremonial Grade Uji Matcha has dropped to 850g (below 1,000g threshold).',
    type: 'alert',
    timestamp: '2026-11-07 12:45',
    isRead: false,
    linkModule: 'inventory',
  },
  {
    id: 'notif-2',
    title: 'New Schedule Swap Request',
    message: 'Lorenzo Cruz requested a shift swap with Samantha Gomez on Nov 9.',
    type: 'warning',
    timestamp: '2026-11-07 09:15',
    isRead: false,
    linkModule: 'scheduling',
  },
  {
    id: 'notif-3',
    title: 'Pending Reservation for 8 Guests',
    message: 'Dr. Raymond Cruz requested Table M-03 for Nov 8 corporate dinner.',
    type: 'info',
    timestamp: '2026-11-07 11:20',
    isRead: false,
    linkModule: 'reservations',
  },
]

// -------------------------------------------------------------
// RELATIONAL DATABASE STORE ENGINE (Client & Server Safe)
// -------------------------------------------------------------

const STORAGE_KEY = 'RORA_RMS_DATABASE_V1'

type ChangeListener = () => void

class RestaurantDatabaseService {
  private employees: Employee[] = []
  private shifts: Shift[] = []
  private scheduleRequests: ScheduleRequest[] = []
  private inventory: InventoryItem[] = []
  private recipes: RecipeItem[] = []
  private operatingExpenses: OperatingExpense[] = []
  private stockMovements: StockMovement[] = []
  private suppliers: Supplier[] = []
  private purchaseOrders: PurchaseOrder[] = []
  private wastageRecords: WastageRecord[] = []
  private reservations: Reservation[] = []
  private tables: FloorTable[] = []
  private posOrders: POSOrder[] = []
  private auditLogs: AuditLog[] = []
  private notifications: SystemNotification[] = []
  private listeners: Set<ChangeListener> = new Set()
  private isInitialized = false

  constructor() {
    this.init()
  }

  private init() {
    if (typeof window === 'undefined') {
      // In SSR, load static seed data
      this.loadDefaults()
      return
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        this.employees = parsed.employees || INITIAL_EMPLOYEES
        this.shifts = parsed.shifts || INITIAL_SHIFTS
        this.scheduleRequests = parsed.scheduleRequests || INITIAL_SCHEDULE_REQUESTS
        this.inventory = parsed.inventory || INITIAL_INVENTORY
        this.recipes = parsed.recipes || INITIAL_RECIPES
        this.operatingExpenses = parsed.operatingExpenses || INITIAL_OPERATING_EXPENSES
        this.stockMovements = parsed.stockMovements || INITIAL_STOCK_MOVEMENTS
        this.suppliers = parsed.suppliers || INITIAL_SUPPLIERS
        this.purchaseOrders = parsed.purchaseOrders || INITIAL_PURCHASE_ORDERS
        this.wastageRecords = parsed.wastageRecords || INITIAL_WASTAGE_RECORDS
        this.reservations = parsed.reservations || INITIAL_RESERVATIONS
        this.tables = parsed.tables || INITIAL_TABLES
        this.posOrders = parsed.posOrders || INITIAL_POS_ORDERS
        this.auditLogs = parsed.auditLogs || INITIAL_AUDIT_LOGS
        this.notifications = parsed.notifications || INITIAL_NOTIFICATIONS
        this.isInitialized = true
        return
      }
    } catch (e) {
      console.warn('Could not read RMS database from localStorage, initializing defaults', e)
    }

    this.loadDefaults()
    this.save()
    this.isInitialized = true
  }

  private loadDefaults() {
    this.employees = [...INITIAL_EMPLOYEES]
    this.shifts = [...INITIAL_SHIFTS]
    this.scheduleRequests = [...INITIAL_SCHEDULE_REQUESTS]
    this.inventory = [...INITIAL_INVENTORY]
    this.recipes = [...INITIAL_RECIPES]
    this.operatingExpenses = [...INITIAL_OPERATING_EXPENSES]
    this.stockMovements = [...INITIAL_STOCK_MOVEMENTS]
    this.suppliers = [...INITIAL_SUPPLIERS]
    this.purchaseOrders = [...INITIAL_PURCHASE_ORDERS]
    this.wastageRecords = [...INITIAL_WASTAGE_RECORDS]
    this.reservations = [...INITIAL_RESERVATIONS]
    this.tables = [...INITIAL_TABLES]
    this.posOrders = [...INITIAL_POS_ORDERS]
    this.auditLogs = [...INITIAL_AUDIT_LOGS]
    this.notifications = [...INITIAL_NOTIFICATIONS]
  }

  private save() {
    if (typeof window === 'undefined') return
    try {
      const payload = {
        employees: this.employees,
        shifts: this.shifts,
        scheduleRequests: this.scheduleRequests,
        inventory: this.inventory,
        recipes: this.recipes,
        operatingExpenses: this.operatingExpenses,
        stockMovements: this.stockMovements,
        suppliers: this.suppliers,
        purchaseOrders: this.purchaseOrders,
        wastageRecords: this.wastageRecords,
        reservations: this.reservations,
        tables: this.tables,
        posOrders: this.posOrders,
        auditLogs: this.auditLogs,
        notifications: this.notifications,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (e) {
      console.error('Failed to save RMS database to localStorage', e)
    }
    this.notify()
  }

  public subscribe(listener: ChangeListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l()
      } catch (err) {
        console.error('Listener callback error', err)
      }
    })
  }

  public resetDatabase() {
    this.loadDefaults()
    this.save()
    this.addAuditLog('Administrator', 'admin', 'Reset Database', 'Restored complete database to default demo seed state.', 'System')
  }

  // -------------------------------------------------------------
  // AUDIT & NOTIFICATIONS
  // -------------------------------------------------------------

  public addAuditLog(actor: string, actorRole: string, action: string, details: string, module: AuditLog['module']) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actorRole,
      action,
      details,
      module,
    }
    this.auditLogs = [log, ...this.auditLogs.slice(0, 99)]
    this.save()
  }

  public addNotification(title: string, message: string, type: SystemNotification['type'], linkModule?: string) {
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      linkModule,
    }
    this.notifications = [notif, ...this.notifications.slice(0, 49)]
    this.save()
  }

  public markNotificationAsRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    this.save()
  }

  public markAllNotificationsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, isRead: true }))
    this.save()
  }

  // -------------------------------------------------------------
  // GETTERS
  // -------------------------------------------------------------

  public getEmployees(): Employee[] {
    return [...this.employees]
  }

  public getShifts(): Shift[] {
    return [...this.shifts]
  }

  public getScheduleRequests(): ScheduleRequest[] {
    return [...this.scheduleRequests]
  }

  public getInventory(): InventoryItem[] {
    return [...this.inventory]
  }

  public getRecipes(): RecipeItem[] {
    return [...this.recipes]
  }

  public getOperatingExpenses(): OperatingExpense[] {
    return [...this.operatingExpenses]
  }

  public getStockMovements(): StockMovement[] {
    return [...this.stockMovements]
  }

  public getSuppliers(): Supplier[] {
    return [...this.suppliers]
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders]
  }

  public getWastageRecords(): WastageRecord[] {
    return [...this.wastageRecords]
  }

  public getReservations(): Reservation[] {
    return [...this.reservations]
  }

  public getTables(): FloorTable[] {
    return [...this.tables]
  }

  public getPOSOrders(): POSOrder[] {
    return [...this.posOrders]
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs]
  }

  public getNotifications(): SystemNotification[] {
    return [...this.notifications]
  }

  // -------------------------------------------------------------
  // MODULE 1: EMPLOYEE SCHEDULING OPERATIONS
  // -------------------------------------------------------------

  public createShift(data: Omit<Shift, 'id'>, actorName: string = 'Manager'): { success: boolean; error?: string; shift?: Shift } {
    // Conflict Detection: Prevent overlapping shifts for same employee on same date
    const existing = this.shifts.find(
      (s) => s.employeeId === data.employeeId && s.date === data.date && s.status !== 'rejected'
    )
    if (existing) {
      return {
        success: false,
        error: `Schedule conflict: ${data.employeeName} already has an assigned ${existing.shiftType} shift on ${data.date}.`,
      }
    }

    // Check Weekly Max Hours
    const emp = this.employees.find((e) => e.id === data.employeeId)
    if (emp) {
      const currentHours = this.shifts
        .filter((s) => s.employeeId === data.employeeId && s.status === 'approved')
        .reduce((sum, s) => sum + s.hours, 0)
      if (currentHours + data.hours > emp.maxWeeklyHours) {
        return {
          success: false,
          error: `Hour limit exceeded: Adding ${data.hours}h will cause ${emp.name} to exceed their weekly max of ${emp.maxWeeklyHours}h (currently ${currentHours}h).`,
        }
      }
    }

    const newShift: Shift = {
      ...data,
      id: `shift-${Date.now()}`,
    }
    this.shifts.push(newShift)
    this.recalculateEmployeeHours(data.employeeId)
    this.save()

    this.addAuditLog(actorName, 'Manager', 'Create Shift', `Created ${data.shiftType} shift for ${data.employeeName} on ${data.date}.`, 'Scheduling')
    return { success: true, shift: newShift }
  }

  public updateShift(id: string, updates: Partial<Shift>, actorName: string = 'Manager'): boolean {
    const index = this.shifts.findIndex((s) => s.id === id)
    if (index === -1) return false

    const old = this.shifts[index]
    this.shifts[index] = { ...old, ...updates }
    this.recalculateEmployeeHours(old.employeeId)
    if (updates.employeeId && updates.employeeId !== old.employeeId) {
      this.recalculateEmployeeHours(updates.employeeId)
    }
    this.save()

    this.addAuditLog(actorName, 'Manager', 'Update Shift', `Updated shift for ${this.shifts[index].employeeName} on ${this.shifts[index].date}.`, 'Scheduling')
    return true
  }

  public deleteShift(id: string, actorName: string = 'Manager'): boolean {
    const shift = this.shifts.find((s) => s.id === id)
    if (!shift) return false

    this.shifts = this.shifts.filter((s) => s.id !== id)
    this.recalculateEmployeeHours(shift.employeeId)
    this.save()

    this.addAuditLog(actorName, 'Manager', 'Delete Shift', `Removed shift for ${shift.employeeName} on ${shift.date}.`, 'Scheduling')
    return true
  }

  public submitScheduleRequest(request: Omit<ScheduleRequest, 'id' | 'createdAt' | 'status'>): ScheduleRequest {
    const newReq: ScheduleRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }
    this.scheduleRequests.unshift(newReq)

    // Notify managers
    this.addNotification(
      `New ${request.type.toUpperCase()} Request`,
      `${request.employeeName} requested a ${request.type} on ${request.requestedDate} (${request.shiftType}).`,
      'info',
      'scheduling'
    )

    this.save()
    return newReq
  }

  public approveScheduleRequest(requestId: string, reviewerName: string = 'General Manager'): boolean {
    const req = this.scheduleRequests.find((r) => r.id === requestId)
    if (!req) return false

    req.status = 'approved'
    req.reviewedBy = reviewerName
    req.reviewNotes = 'Approved by manager'

    // If it was a preferred shift, create the shift
    if (req.type === 'preference') {
      const emp = this.employees.find((e) => e.id === req.employeeId)
      if (emp) {
        const timeMap: Record<ShiftType, { start: string; end: string; hours: number }> = {
          Morning: { start: '07:00', end: '15:00', hours: 8 },
          Afternoon: { start: '11:00', end: '19:00', hours: 8 },
          Evening: { start: '16:00', end: '00:00', hours: 8 },
          Closing: { start: '19:00', end: '02:00', hours: 7 },
        }
        const times = timeMap[req.shiftType] || { start: '09:00', end: '17:00', hours: 8 }
        this.shifts.push({
          id: `shift-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          role: emp.role,
          date: req.requestedDate,
          shiftType: req.shiftType,
          startTime: times.start,
          endTime: times.end,
          hours: times.hours,
          diningSection: emp.diningSection,
          status: 'approved',
        })
        this.recalculateEmployeeHours(emp.id)
      }
    } else if (req.type === 'swap' && req.swapWithEmployeeId) {
      // Execute swap: switch employee assignments on relevant shifts
      const emp1Shift = this.shifts.find((s) => s.employeeId === req.employeeId && s.date === req.requestedDate)
      const emp2Shift = this.shifts.find((s) => s.employeeId === req.swapWithEmployeeId && s.date === req.requestedDate)
      const emp1 = this.employees.find((e) => e.id === req.employeeId)
      const emp2 = this.employees.find((e) => e.id === req.swapWithEmployeeId)

      if (emp1Shift && emp2Shift && emp1 && emp2) {
        emp1Shift.employeeId = emp2.id
        emp1Shift.employeeName = emp2.name
        emp1Shift.role = emp2.role
        emp2Shift.employeeId = emp1.id
        emp2Shift.employeeName = emp1.name
        emp2Shift.role = emp1.role
        this.recalculateEmployeeHours(emp1.id)
        this.recalculateEmployeeHours(emp2.id)
      }
    }

    // Notify employee
    this.addNotification(
      'Schedule Request Approved',
      `Your ${req.type} request for ${req.requestedDate} was approved by ${reviewerName}.`,
      'success',
      'scheduling'
    )

    this.addAuditLog(reviewerName, 'Manager', 'Approve Schedule Request', `Approved ${req.type} request from ${req.employeeName}.`, 'Scheduling')
    this.save()
    return true
  }

  public rejectScheduleRequest(requestId: string, reason: string, reviewerName: string = 'General Manager'): boolean {
    const req = this.scheduleRequests.find((r) => r.id === requestId)
    if (!req) return false

    req.status = 'rejected'
    req.reviewedBy = reviewerName
    req.reviewNotes = reason

    this.addNotification(
      'Schedule Request Rejected',
      `Your ${req.type} request for ${req.requestedDate} was declined: ${reason}`,
      'alert',
      'scheduling'
    )

    this.addAuditLog(reviewerName, 'Manager', 'Reject Schedule Request', `Rejected request from ${req.employeeName}: ${reason}`, 'Scheduling')
    this.save()
    return true
  }

  public clockInOut(employeeId: string): { status: 'clocked-in' | 'clocked-out'; time: string } {
    const emp = this.employees.find((e) => e.id === employeeId)
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    if (!emp) return { status: 'clocked-out', time: timeStr }

    const shiftToday = this.shifts.find((s) => s.employeeId === employeeId && s.date === TODAY)

    if (emp.status === 'on-duty') {
      emp.status = 'off-duty'
      if (shiftToday) {
        shiftToday.checkOutTime = timeStr
        shiftToday.status = 'completed'
      }
      this.addAuditLog(emp.name, emp.role, 'Clock Out', `Clocked out at ${timeStr}.`, 'Scheduling')
      this.save()
      return { status: 'clocked-out', time: timeStr }
    } else {
      emp.status = 'on-duty'
      if (shiftToday) {
        shiftToday.checkInTime = timeStr
      }
      this.addAuditLog(emp.name, emp.role, 'Clock In', `Clocked in at ${timeStr}.`, 'Scheduling')
      this.save()
      return { status: 'clocked-in', time: timeStr }
    }
  }

  private recalculateEmployeeHours(employeeId: string) {
    const emp = this.employees.find((e) => e.id === employeeId)
    if (!emp) return
    const totalHours = this.shifts
      .filter((s) => s.employeeId === employeeId && s.status === 'approved')
      .reduce((sum, s) => sum + s.hours, 0)
    emp.currentWeeklyHours = totalHours
  }

  // -------------------------------------------------------------
  // MODULE 2: COSTING MANAGEMENT & RECIPES
  // -------------------------------------------------------------

  public createRecipe(data: Omit<RecipeItem, 'id' | 'updatedAt' | 'historicalCostRecords'>): RecipeItem {
    const newRecipe: RecipeItem = {
      ...data,
      id: `rec-${Date.now()}`,
      historicalCostRecords: [],
      updatedAt: new Date().toISOString().substring(0, 10),
    }
    this.recipes.push(newRecipe)
    this.addAuditLog('Chef Marco Valerio', 'Head Chef', 'Create Recipe', `Created costing card for ${data.name}.`, 'Costing')
    this.save()
    return newRecipe
  }

  public updateRecipe(id: string, updates: Partial<RecipeItem>, actorName: string = 'Chef Marco Valerio'): boolean {
    const index = this.recipes.findIndex((r) => r.id === id)
    if (index === -1) return false

    const old = this.recipes[index]
    this.recipes[index] = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString().substring(0, 10),
    }
    this.addAuditLog(actorName, 'Head Chef', 'Update Recipe', `Updated recipe ${old.name} costing details.`, 'Costing')
    this.save()
    return true
  }

  public deleteRecipe(id: string): boolean {
    const recipe = this.recipes.find((r) => r.id === id)
    if (!recipe) return false

    this.recipes = this.recipes.filter((r) => r.id !== id)
    this.addAuditLog('Chef Marco Valerio', 'Head Chef', 'Delete Recipe', `Removed recipe ${recipe.name}.`, 'Costing')
    this.save()
    return true
  }

  public addOperatingExpense(expense: Omit<OperatingExpense, 'id'>): OperatingExpense {
    const newExp: OperatingExpense = {
      ...expense,
      id: `opex-${Date.now()}`,
    }
    this.operatingExpenses.push(newExp)
    this.save()
    return newExp
  }

  // -------------------------------------------------------------
  // MODULE 3: STOCK & INVENTORY OPERATIONS
  // -------------------------------------------------------------

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>, actorName: string = 'Manager'): boolean {
    const index = this.inventory.findIndex((i) => i.id === id)
    if (index === -1) return false

    const oldItem = this.inventory[index]
    const priceChanged = updates.unitCost !== undefined && updates.unitCost !== oldItem.unitCost
    const oldCost = oldItem.unitCost

    this.inventory[index] = { ...oldItem, ...updates }

    // If ingredient price changed, update recipe costing calculations and save historical record!
    if (priceChanged && updates.unitCost !== undefined) {
      this.recalculateRecipesForIngredient(id, oldCost, updates.unitCost, actorName)
    }

    // Check low stock threshold
    if (this.inventory[index].stockQuantity <= this.inventory[index].minThreshold) {
      this.addNotification(
        'Low Stock Alert',
        `${this.inventory[index].name} has fallen to ${this.inventory[index].stockQuantity}${this.inventory[index].unit} (Threshold: ${this.inventory[index].minThreshold}).`,
        'alert',
        'inventory'
      )
    }

    this.addAuditLog(actorName, 'Manager', 'Update Inventory Item', `Updated ${oldItem.name} (Qty: ${this.inventory[index].stockQuantity}${this.inventory[index].unit}).`, 'Inventory')
    this.save()
    return true
  }

  private recalculateRecipesForIngredient(itemId: string, oldCost: number, newCost: number, actorName: string) {
    const today = new Date().toISOString().substring(0, 10)

    this.recipes.forEach((recipe) => {
      let changed = false
      recipe.ingredients.forEach((ing) => {
        if (ing.inventoryItemId === itemId) {
          ing.unitCost = newCost
          ing.lineCost = Number((ing.quantity * newCost).toFixed(2))
          changed = true
        }
      })

      if (changed) {
        const prevTotal = recipe.totalIngredientCost
        const newTotalIngredientCost = Number(
          recipe.ingredients.reduce((sum, ing) => sum + ing.lineCost, 0).toFixed(2)
        )
        recipe.totalIngredientCost = newTotalIngredientCost
        recipe.totalProductionCost = Number((newTotalIngredientCost + recipe.laborCost + recipe.overheadCost).toFixed(2))
        recipe.foodCostPercentage = Number(
          ((newTotalIngredientCost / recipe.currentSellingPrice) * 100).toFixed(2)
        )
        recipe.grossProfit = Number((recipe.currentSellingPrice - recipe.totalProductionCost).toFixed(2))
        recipe.profitMarginPercentage = Number(
          ((recipe.grossProfit / recipe.currentSellingPrice) * 100).toFixed(2)
        )
        recipe.updatedAt = today

        recipe.historicalCostRecords.push({
          date: today,
          previousCost: prevTotal,
          newCost: newTotalIngredientCost,
          reason: `Automatic price update from inventory cost shift (₱${oldCost} -> ₱${newCost})`,
          updatedBy: actorName,
        })
      }
    })
  }

  public recordStockMovement(movement: Omit<StockMovement, 'id' | 'timestamp'>): StockMovement {
    const newMovement: StockMovement = {
      ...movement,
      id: `sm-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }
    this.stockMovements.unshift(newMovement)

    // Adjust item stock quantity
    const item = this.inventory.find((i) => i.id === movement.itemId)
    if (item) {
      item.stockQuantity = Math.max(0, item.stockQuantity + movement.quantity)
      if (item.stockQuantity <= item.minThreshold) {
        this.addNotification(
          'Low Stock Warning',
          `${item.name} stock level is now ${item.stockQuantity}${item.unit} (Min: ${item.minThreshold}).`,
          'alert',
          'inventory'
        )
      }
    }

    this.addAuditLog(movement.performedBy, 'Staff', `Stock Movement: ${movement.type}`, `${movement.quantity} ${movement.unit} of ${movement.itemName} (${movement.reason}).`, 'Inventory')
    this.save()
    return newMovement
  }

  public recordWastage(wastage: Omit<WastageRecord, 'id' | 'date'>): WastageRecord {
    const today = new Date().toISOString().substring(0, 10)
    const newWastage: WastageRecord = {
      ...wastage,
      id: `wst-${Date.now()}`,
      date: today,
    }
    this.wastageRecords.unshift(newWastage)

    // Deduct stock
    this.recordStockMovement({
      itemId: wastage.itemId,
      itemName: wastage.itemName,
      type: 'wastage',
      quantity: -wastage.quantity,
      unit: wastage.unit,
      reason: `Wastage: ${wastage.reason}`,
      referenceId: newWastage.id,
      performedBy: wastage.reportedBy,
      costImpact: -wastage.costLoss,
    })

    this.save()
    return newWastage
  }

  public createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'orderDate' | 'status'>): PurchaseOrder {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      orderDate: new Date().toISOString().substring(0, 10),
      status: 'Sent',
    }
    this.purchaseOrders.unshift(newPO)
    this.addAuditLog('Manager', 'Manager', 'Create Purchase Order', `Sent ${newPO.poNumber} to ${newPO.supplierName} for ₱${newPO.totalAmount.toLocaleString()}.`, 'Inventory')
    this.save()
    return newPO
  }

  public receivePurchaseOrder(poId: string, receivedBy: string = 'Chef Marco Valerio'): boolean {
    const po = this.purchaseOrders.find((p) => p.id === poId)
    if (!po || po.status === 'Received') return false

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16)
    po.status = 'Received'
    po.receivedDate = nowStr

    // Restock all items
    po.items.forEach((item) => {
      this.recordStockMovement({
        itemId: item.itemId,
        itemName: item.itemName,
        type: 'stock-in',
        quantity: item.quantity,
        unit: item.unit,
        reason: `Restocked from Purchase Order ${po.poNumber}`,
        referenceId: po.id,
        performedBy: receivedBy,
        costImpact: item.total,
      })
    })

    this.addNotification(
      'Purchase Order Received',
      `${po.poNumber} from ${po.supplierName} was received and added to inventory.`,
      'success',
      'inventory'
    )
    this.save()
    return true
  }

  // -------------------------------------------------------------
  // MODULE 4: TABLE RESERVATIONS
  // -------------------------------------------------------------

  public createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'status'>): { success: boolean; reservation?: Reservation; error?: string } {
    // Conflict detection: verify no active reservation exists on same table at overlapping time
    if (data.tableId) {
      const conflict = this.reservations.find(
        (r) =>
          r.tableId === data.tableId &&
          r.date === data.date &&
          r.timeSlot === data.timeSlot &&
          r.status !== 'Cancelled' &&
          r.status !== 'No Show' &&
          r.status !== 'Completed'
      )
      if (conflict) {
        return {
          success: false,
          error: `Table ${data.tableName || data.tableId} is already booked at ${data.timeSlot} on ${data.date} by ${conflict.customerName}.`,
        }
      }
    }

    const newRes: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      status: 'Confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }

    this.reservations.unshift(newRes)

    // If reservation has a table assigned and is for today, update table status to 'reserved'
    if (newRes.tableId && newRes.date === TODAY) {
      const tbl = this.tables.find((t) => t.id === newRes.tableId)
      if (tbl && tbl.status === 'available') {
        tbl.status = 'reserved'
        tbl.currentReservationId = newRes.id
        tbl.currentGuestName = newRes.customerName
        tbl.currentGuests = newRes.guestCount
      }
    }

    this.addAuditLog('Host Bea Alonzo', 'Host', 'Create Reservation', `Booked table for ${data.customerName} (${data.guestCount} guests) on ${data.date} at ${data.timeSlot}.`, 'Reservations')
    this.save()
    return { success: true, reservation: newRes }
  }

  public updateReservationStatus(id: string, status: ReservationStatus, actorName: string = 'Staff'): boolean {
    const res = this.reservations.find((r) => r.id === id)
    if (!res) return false

    const oldStatus = res.status
    res.status = status

    // Sync with table
    if (res.tableId) {
      const tbl = this.tables.find((t) => t.id === res.tableId)
      if (tbl) {
        if (status === 'Seated') {
          tbl.status = 'occupied'
          tbl.currentReservationId = res.id
          tbl.currentGuestName = res.customerName
          tbl.currentGuests = res.guestCount
        } else if (status === 'Completed' || status === 'Cancelled' || status === 'No Show') {
          if (tbl.currentReservationId === res.id) {
            tbl.status = status === 'Completed' ? 'cleaning' : 'available'
            tbl.currentReservationId = undefined
            tbl.currentGuestName = undefined
            tbl.currentGuests = undefined
          }
        }
      }
    }

    this.addAuditLog(actorName, 'Host', 'Update Reservation Status', `Changed ${res.customerName}'s reservation from ${oldStatus} to ${status}.`, 'Reservations')
    this.save()
    return true
  }

  public seatReservation(resId: string, actorName: string = 'Carlos Mendoza'): boolean {
    return this.updateReservationStatus(resId, 'Seated', actorName)
  }

  public recommendTableForReservation(guestCount: number, date: string, timeSlot: string): FloorTable | null {
    // Find available tables that fit party size with least wasted capacity
    const reservedTableIds = new Set(
      this.reservations
        .filter(
          (r) =>
            r.date === date &&
            r.timeSlot === timeSlot &&
            r.status !== 'Cancelled' &&
            r.status !== 'No Show' &&
            r.status !== 'Completed' &&
            r.tableId
        )
        .map((r) => r.tableId)
    )

    const candidates = this.tables
      .filter((t) => !reservedTableIds.has(t.id) && t.status !== 'unavailable' && t.capacity >= guestCount)
      .sort((a, b) => a.capacity - b.capacity)

    return candidates[0] || null
  }

  // -------------------------------------------------------------
  // MODULE 5 & 6: INTERACTIVE TABLE & SEATING PLAN & EMPLOYEE ASSIGNMENTS
  // -------------------------------------------------------------

  public updateTablePosition(id: string, x: number, y: number): boolean {
    const tbl = this.tables.find((t) => t.id === id)
    if (!tbl) return false
    tbl.x = x
    tbl.y = y
    this.save()
    return true
  }

  public updateTable(id: string, updates: Partial<FloorTable>, actorName: string = 'Manager'): boolean {
    const index = this.tables.findIndex((t) => t.id === id)
    if (index === -1) return false

    this.tables[index] = { ...this.tables[index], ...updates }
    this.addAuditLog(actorName, 'Manager', 'Update Table Config', `Updated ${this.tables[index].tableNumber} settings.`, 'FloorPlan')
    this.save()
    return true
  }

  public addTable(newTable: Omit<FloorTable, 'id'>, actorName: string = 'Manager'): FloorTable {
    const tbl: FloorTable = {
      ...newTable,
      id: `tbl-${Date.now()}`,
    }
    this.tables.push(tbl)
    this.addAuditLog(actorName, 'Manager', 'Add Table', `Added new table ${tbl.tableNumber} to ${tbl.diningArea}.`, 'FloorPlan')
    this.save()
    return tbl
  }

  public removeTable(id: string, actorName: string = 'Manager'): boolean {
    const tbl = this.tables.find((t) => t.id === id)
    if (!tbl) return false

    this.tables = this.tables.filter((t) => t.id !== id)
    this.addAuditLog(actorName, 'Manager', 'Remove Table', `Removed table ${tbl.tableNumber}.`, 'FloorPlan')
    this.save()
    return true
  }

  public setTableStatus(tableId: string, status: TableStatus, actorName: string = 'Staff'): boolean {
    const tbl = this.tables.find((t) => t.id === tableId)
    if (!tbl) return false

    const oldStatus = tbl.status
    tbl.status = status

    if (status === 'available') {
      tbl.currentGuestName = undefined
      tbl.currentGuests = undefined
      tbl.currentReservationId = undefined
      tbl.orderId = undefined
      tbl.activeBillTotal = undefined
    }

    this.addAuditLog(actorName, 'Staff', 'Change Table Status', `Table ${tbl.tableNumber} set from ${oldStatus} to ${status}.`, 'FloorPlan')
    this.save()
    return true
  }

  public assignEmployeeToTable(tableId: string, employeeId: string, actorName: string = 'Manager'): { success: boolean; error?: string } {
    const tbl = this.tables.find((t) => t.id === tableId)
    const emp = this.employees.find((e) => e.id === employeeId)
    if (!tbl || !emp) return { success: false, error: 'Table or employee not found' }

    // Duty Verification: Prevent assignment to employees outside their approved shifts
    const shiftToday = this.shifts.find(
      (s) => s.employeeId === employeeId && s.date === TODAY && (s.status === 'approved' || s.status === 'completed')
    )
    if (!shiftToday && emp.status !== 'on-duty') {
      return {
        success: false,
        error: `Duty check failure: ${emp.name} is not on an approved shift today (${TODAY}).`,
      }
    }

    tbl.assignedEmployeeId = emp.id
    tbl.assignedEmployeeName = emp.name
    tbl.assignedEmployeeRole = emp.role

    this.addAuditLog(actorName, 'Manager', 'Assign Server to Table', `Assigned ${emp.name} to Table ${tbl.tableNumber}.`, 'FloorPlan')
    this.save()
    return { success: true }
  }

  public transferEmployeeTables(fromEmployeeId: string, toEmployeeId: string, actorName: string = 'Manager'): number {
    const toEmp = this.employees.find((e) => e.id === toEmployeeId)
    if (!toEmp) return 0

    let transferredCount = 0
    this.tables.forEach((tbl) => {
      if (tbl.assignedEmployeeId === fromEmployeeId) {
        tbl.assignedEmployeeId = toEmp.id
        tbl.assignedEmployeeName = toEmp.name
        tbl.assignedEmployeeRole = toEmp.role
        transferredCount++
      }
    })

    const fromEmp = this.employees.find((e) => e.id === fromEmployeeId)
    this.addAuditLog(
      actorName,
      'Manager',
      'Shift Handover / Table Transfer',
      `Transferred ${transferredCount} tables from ${fromEmp?.name || fromEmployeeId} to ${toEmp.name}.`,
      'FloorPlan'
    )
    this.save()
    return transferredCount
  }

  public combineTables(tableId1: string, tableId2: string, actorName: string = 'Manager'): boolean {
    const t1 = this.tables.find((t) => t.id === tableId1)
    const t2 = this.tables.find((t) => t.id === tableId2)
    if (!t1 || !t2) return false

    t1.combinedWithTableId = t2.id
    t2.combinedWithTableId = t1.id

    this.addAuditLog(actorName, 'Manager', 'Combine Tables', `Combined Table ${t1.tableNumber} and ${t2.tableNumber} for joint party.`, 'FloorPlan')
    this.save()
    return true
  }

  public separateTables(tableId: string, actorName: string = 'Manager'): boolean {
    const t1 = this.tables.find((t) => t.id === tableId)
    if (!t1 || !t1.combinedWithTableId) return false

    const t2 = this.tables.find((t) => t.id === t1.combinedWithTableId)
    t1.combinedWithTableId = undefined
    if (t2) t2.combinedWithTableId = undefined

    this.addAuditLog(actorName, 'Manager', 'Separate Tables', `Separated combined tables for ${t1.tableNumber}.`, 'FloorPlan')
    this.save()
    return true
  }

  // -------------------------------------------------------------
  // POS & AUTOMATIC STOCK DEDUCTION (INTERCONNECTION ENGINE)
  // -------------------------------------------------------------

  public createPOSOrder(order: Omit<POSOrder, 'id' | 'orderNumber' | 'createdAt' | 'status'>): POSOrder {
    const newOrder: POSOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'open',
    }

    this.posOrders.unshift(newOrder)

    // Link table
    const tbl = this.tables.find((t) => t.id === order.tableId)
    if (tbl) {
      tbl.status = 'occupied'
      tbl.orderId = newOrder.id
      tbl.activeBillTotal = newOrder.total
      tbl.currentGuestName = order.customerName
    }

    this.save()
    return newOrder
  }

  public completePOSOrder(orderId: string, actorName: string = 'Carlos Mendoza'): boolean {
    const order = this.posOrders.find((o) => o.id === orderId)
    if (!order || order.status === 'completed') return false

    order.status = 'completed'
    order.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16)

    // AUTOMATIC STOCK DEDUCTION BASED ON RECIPES!
    order.items.forEach((orderedItem) => {
      const recipe = this.recipes.find((r) => r.id === orderedItem.recipeId)
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          const qtyToDeduct = ing.quantity * orderedItem.quantity
          this.recordStockMovement({
            itemId: ing.inventoryItemId,
            itemName: ing.ingredientName,
            type: 'pos-deduction',
            quantity: -qtyToDeduct,
            unit: ing.unit,
            reason: `Auto POS Deduction: ${orderedItem.quantity}x ${orderedItem.name} (${order.orderNumber})`,
            referenceId: order.id,
            performedBy: 'Automatic POS Engine',
            costImpact: -(ing.unitCost * qtyToDeduct),
          })
        })
      }
    })

    // Free / Clean table
    const tbl = this.tables.find((t) => t.id === order.tableId)
    if (tbl) {
      tbl.status = 'cleaning'
      tbl.activeBillTotal = undefined
    }

    this.addNotification(
      'Order Completed & Stock Deducted',
      `Order ${order.orderNumber} (₱${order.total.toLocaleString()}) completed. Recipe ingredients deducted from stock.`,
      'success',
      'pos'
    )

    this.addAuditLog(actorName, 'Server', 'Complete POS Order', `Completed order ${order.orderNumber} for Table ${order.tableName} (₱${order.total}).`, 'POS')
    this.save()
    return true
  }
}

export const db = new RestaurantDatabaseService()
