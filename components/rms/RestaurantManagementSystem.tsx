'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Package,
  CalendarDays,
  UtensilsCrossed,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Store,
  Layers,
  Sparkles,
  Zap,
  MapPin,
} from 'lucide-react'
import { UserRole } from '@/lib/db/restaurant-db'
import { ToastProvider } from './RmsToast'
import { RmsNavbar } from './RmsNavbar'
import { DashboardModule } from './DashboardModule'
import { EmployeeSchedulingModule } from './EmployeeSchedulingModule'
import { CostingModule } from './CostingModule'
import { InventoryModule } from './InventoryModule'
import { ReservationsModule } from './ReservationsModule'
import { FloorPlanModule } from './FloorPlanModule'
import { ReportsModule } from './ReportsModule'
import { RolesAndAuditModule } from './RolesAndAuditModule'
import { CustomerReservationModal } from './CustomerReservationModal'

export function RestaurantManagementSystem() {
  const [currentRole, setCurrentRole] = useState<UserRole>('manager')
  const [currentBranch, setCurrentBranch] = useState<string>('lake')
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)

  // Modals
  const [isCustomerBookingOpen, setIsCustomerBookingOpen] = useState<boolean>(false)

  // Navigation Items with Neo-Brutalist Badges & Accents
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-[#22C55E] text-black',
      allowedRoles: ['admin', 'manager', 'employee'],
    },
    {
      id: 'scheduling',
      label: '1. Employee Scheduling',
      shortLabel: 'Scheduling',
      icon: Calendar,
      badge: null,
      badgeColor: '',
      allowedRoles: ['admin', 'manager', 'employee'],
    },
    {
      id: 'costing',
      label: '2. Costing Management',
      shortLabel: 'Costing',
      icon: DollarSign,
      badge: 'RECIPES',
      badgeColor: 'bg-[#FFE600] text-black',
      allowedRoles: ['admin', 'manager'],
    },
    {
      id: 'inventory',
      label: '3. Stock & Inventory',
      shortLabel: 'Inventory',
      icon: Package,
      badge: null,
      badgeColor: '',
      allowedRoles: ['admin', 'manager'],
    },
    {
      id: 'reservations',
      label: '4. Table Reservations',
      shortLabel: 'Reservations',
      icon: CalendarDays,
      badge: null,
      badgeColor: '',
      allowedRoles: ['admin', 'manager', 'employee', 'customer'],
    },
    {
      id: 'floor',
      label: '5. Seating & Floor Plan',
      shortLabel: 'Floor Plan',
      icon: UtensilsCrossed,
      badge: 'CANVAS',
      badgeColor: 'bg-[#60A5FA] text-black',
      allowedRoles: ['admin', 'manager', 'employee'],
    },
    {
      id: 'reports',
      label: '6. Reports & Analytics',
      shortLabel: 'Reports',
      icon: FileText,
      badge: 'CSV',
      badgeColor: 'bg-[#C084FC] text-black',
      allowedRoles: ['admin', 'manager'],
    },
    {
      id: 'roles',
      label: '7. Roles & Audit Logs',
      shortLabel: 'Roles & Audit',
      icon: ShieldCheck,
      badge: null,
      badgeColor: '',
      allowedRoles: ['admin', 'manager'],
    },
  ]

  // Filter items based on current role
  const visibleNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(currentRole)
  )

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileSidebarOpen(false)
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FDFBF7] text-[#18181B] flex flex-col font-sans selection:bg-[#FFE600] selection:text-black relative">
        {/* Subtle Architectural Grid Pattern */}
        <div
          className="fixed inset-0 pointer-events-none opacity-40 z-0"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Sticky Header with Neo-Brutalist Border & Shadow */}
        <RmsNavbar
          currentRole={currentRole}
          onRoleChange={(r) => {
            setCurrentRole(r)
            if (r === 'customer') {
              setActiveTab('reservations')
            }
          }}
          currentBranch={currentBranch}
          onBranchChange={setCurrentBranch}
          onOpenCustomerBooking={() => setIsCustomerBookingOpen(true)}
          onNavigateTab={handleTabSelect}
        />

        {/* Mobile Sub-Header & Fast Module Switcher */}
        <div className="lg:hidden bg-white border-b-2 border-black z-20 relative">
          <div className="flex items-center justify-between px-3 py-2 border-b border-black/10">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-[#FFE600] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span>MODULES</span>
            </button>

            <span className="text-[11px] font-black uppercase tracking-tight text-black bg-[#FAF8F5] px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_#000]">
              {navItems.find((i) => i.id === activeTab)?.shortLabel}
            </span>
          </div>

          {/* Quick-switch horizontal scrollable strip for mobile */}
          <div className="flex items-center gap-1.5 px-2.5 py-2 overflow-x-auto no-scrollbar bg-[#FAF8F5]">
            {visibleNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-black cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#FF5500] text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FAF8F5] shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-black'}`} />
                  <span>{item.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Body Layout with Sidebar */}
        <div className="flex-1 flex overflow-hidden relative z-10">
          {/* Desktop Left Sidebar (Neo-Brutalist Design) */}
          <aside
            className={`hidden lg:flex flex-col bg-white border-r-2 border-black transition-all duration-300 ${
              isSidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            {/* Sidebar Navigation Links */}
            <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              <div className="px-3 py-2 mb-1 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#71717A]">
                  {!isSidebarCollapsed ? 'OPERATIONS' : 'RMS'}
                </span>
                {!isSidebarCollapsed && (
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] border border-black animate-pulse" />
                )}
              </div>

              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all text-left cursor-pointer border-2 ${
                      isActive
                        ? 'bg-[#FF5500] text-white border-black shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-white text-[#18181B] border-transparent hover:border-black hover:bg-[#FAF8F5] hover:shadow-[2px_2px_0px_0px_#000]'
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-4 h-4 shrink-0 stroke-[2.5] ${isActive ? 'text-white' : 'text-black'}`} />
                    {!isSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate font-black">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-black border border-black shadow-[1px_1px_0px_0px_#000] ${
                            isActive ? 'bg-white text-black' : item.badgeColor
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Sidebar Footer with Collapse Toggle */}
            <div className="p-3 border-t-2 border-black flex items-center justify-between text-xs bg-[#FAF8F5]">
              {!isSidebarCollapsed && (
                <div className="text-[11px]">
                  <p className="font-mono font-black text-black uppercase tracking-wider">v2.6 PRO</p>
                  <p className="text-[10px] text-[#71717A] font-medium">RMS Operations</p>
                </div>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-xl bg-white hover:bg-[#FFE600] border-2 border-black text-black ml-auto cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
              </button>
            </div>
          </aside>

          {/* Mobile Sliding Drawer Sidebar (Neo-Brutalist) */}
          {isMobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
              <div className="w-72 max-w-[85vw] bg-white border-r-3 border-black flex flex-col h-full shadow-[6px_0px_0px_0px_#000]">
                {/* Drawer Header */}
                <div className="p-4 border-b-2 border-black flex items-center justify-between bg-[#FAF8F5]">
                  <span className="font-black text-base text-black tracking-tight flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5500] border border-black" />
                    RORA RMS PRO
                  </span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 text-black hover:bg-black hover:text-white rounded-xl border-2 border-black transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Mobile Branch Selector */}
                <div className="p-3 bg-[#FFFBEB] border-b-2 border-black flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-mono font-black uppercase text-neutral-500">Active Branch</p>
                    <select
                      value={currentBranch}
                      onChange={(e) => setCurrentBranch(e.target.value)}
                      className="bg-transparent text-xs font-black text-black focus:outline-none w-full cursor-pointer truncate"
                    >
                      <option value="lake">Waterfront Lake Bistro</option>
                      <option value="niugan">Downtown Niugan Hall</option>
                    </select>
                  </div>
                </div>

                {/* Scrollable Nav Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {visibleNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabSelect(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-black border-2 border-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#FF5500] text-white shadow-[3px_3px_0px_0px_#000]'
                            : 'bg-white text-black hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#000]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 stroke-[2.5] ${isActive ? 'text-white' : 'text-black'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Drawer Footer */}
                <div className="p-3 border-t-2 border-black bg-[#FFE600] text-xs font-black text-black uppercase flex items-center justify-between">
                  <span>Role: <span className="underline">{currentRole}</span></span>
                  <span className="font-mono text-[10px]">RMS PRO</span>
                </div>
              </div>

              <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
            </div>
          )}

          {/* Center Main Stage Content Area */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden min-w-0">
            {activeTab === 'dashboard' && (
              <DashboardModule
                currentRole={currentRole}
                onNavigate={handleTabSelect}
                onOpenCustomerBooking={() => setIsCustomerBookingOpen(true)}
              />
            )}

            {activeTab === 'scheduling' && (
              <EmployeeSchedulingModule currentRole={currentRole} />
            )}

            {activeTab === 'costing' && (
              <CostingModule currentRole={currentRole} />
            )}

            {activeTab === 'inventory' && (
              <InventoryModule currentRole={currentRole} />
            )}

            {activeTab === 'reservations' && (
              <ReservationsModule
                currentRole={currentRole}
                onOpenCustomerBooking={() => setIsCustomerBookingOpen(true)}
                onNavigateToFloor={() => setActiveTab('floor')}
              />
            )}

            {activeTab === 'floor' && (
              <FloorPlanModule currentRole={currentRole} />
            )}

            {activeTab === 'reports' && (
              <ReportsModule currentRole={currentRole} />
            )}

            {activeTab === 'roles' && (
              <RolesAndAuditModule
                currentRole={currentRole}
                onRoleChange={(r) => setCurrentRole(r)}
              />
            )}
          </main>
        </div>

        {/* Customer Booking Dialog Modal */}
        <CustomerReservationModal
          isOpen={isCustomerBookingOpen}
          onClose={() => setIsCustomerBookingOpen(false)}
        />
      </div>
    </ToastProvider>
  )
}
