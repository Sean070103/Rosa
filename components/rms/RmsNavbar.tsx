'use client'

import React, { useState } from 'react'
import {
  Bell,
  Clock,
  Sparkles,
  Shield,
  UserCheck,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  RotateCcw,
  Check,
  ChevronDown,
  Store,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react'
import { UserRole } from '@/lib/db/restaurant-db'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { useToast } from './RmsToast'

interface RmsNavbarProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
  currentBranch: string
  onBranchChange: (branch: string) => void
  onOpenCustomerBooking: () => void
  onNavigateTab: (tabId: string) => void
}

export function RmsNavbar({
  currentRole,
  onRoleChange,
  currentBranch,
  onBranchChange,
  onOpenCustomerBooking,
  onNavigateTab,
}: RmsNavbarProps) {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, resetDatabase } = useRestaurantDb()
  const { toast } = useToast()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const roles: { role: UserRole; label: string; badge: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator', badge: 'bg-red-50 text-red-700 border-red-200', desc: 'Full system control & audit' },
    { role: 'manager', label: 'Restaurant Manager', badge: 'bg-orange-50 text-orange-700 border-orange-200', desc: 'Schedules, inventory, floor & costing' },
    { role: 'employee', label: 'Staff / Waiter', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Personal shifts, assigned tables & clock' },
    { role: 'customer', label: 'Customer Portal', badge: 'bg-blue-50 text-blue-700 border-blue-200', desc: 'Book tables & view reservations' },
  ]

  const activeRoleConfig = roles.find((r) => r.role === currentRole) || roles[0]

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-black text-[#172033] px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Location Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FF5500] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-base sm:text-lg font-black tracking-tight text-black">RORA</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-black bg-[#FFE600] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  RMS PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-600 hidden sm:block">Intelligent Restaurant Management System</p>
            </div>
          </div>

          <div className="h-6 w-0.5 bg-black/15 hidden md:block" />

          {/* Location Selector (Neo-Brutalist) */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-white px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border-2 border-black text-xs transition-all shadow-[2px_2px_0px_0px_#000] shrink-0">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5500] shrink-0" />
            <select
              value={currentBranch}
              onChange={(e) => onBranchChange(e.target.value)}
              className="bg-transparent text-[11px] sm:text-xs font-bold text-black focus:outline-none cursor-pointer max-w-[110px] sm:max-w-none truncate"
            >
              <option value="lake">Waterfront Lake</option>
              <option value="niugan">Niugan Hall</option>
            </select>
          </div>
        </div>

        {/* Right Controls: Book Table, Role Switcher, Notifications, Demo Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Book Table Button */}
          <button
            onClick={onOpenCustomerBooking}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-wider bg-[#FFE600] hover:bg-[#FACC15] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            title="Launch Customer Table Booking Flow"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Table</span>
            <span className="sm:hidden text-[10px]">Book</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-xs font-bold transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="font-black text-black hidden md:inline">{activeRoleConfig.label}</span>
              <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-black border border-black shadow-[1px_1px_0px_0px_#000] ${activeRoleConfig.badge}`}>
                {currentRole.toUpperCase()}
              </span>
              <ChevronDown className="w-3 h-3 text-black" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-3 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2 border-b-2 border-black/10 mb-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-black">Select Active Role</p>
                  <p className="text-[11px] text-neutral-600">Switch role perspective & permissions</p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onRoleChange(r.role)
                      setShowRoleMenu(false)
                      toast(`Perspective switched to ${r.label}`, r.desc, 'info')
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl flex items-start gap-2.5 transition-all cursor-pointer mb-1 ${
                      currentRole === r.role
                        ? 'bg-[#FFE600] text-black font-black border-2 border-black shadow-[2px_2px_0px_0px_#000]'
                        : 'hover:bg-[#FAF8F5] text-neutral-700 border-2 border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {currentRole === r.role ? (
                        <Check className="w-4 h-4 text-black font-black" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-black/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-black">
                        {r.label}
                      </div>
                      <p className="text-[10px] text-neutral-600 leading-tight mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5500] text-white font-black text-[10px] flex items-center justify-center border-2 border-black shadow-[1px_1px_0px_0px_#000]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 max-w-[calc(100vw-24px)] bg-white border-3 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-4 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-black/10 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-black">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-[#FFE600] text-black text-[10px] px-2 py-0.5 rounded-full border border-black font-black">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[11px] text-[#FF5500] font-black hover:underline uppercase tracking-wider"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-neutral-500 py-6 font-medium">No notifications currently</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id)
                          if (n.linkModule) onNavigateTab(n.linkModule)
                          setShowNotifications(false)
                        }}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                          n.isRead
                            ? 'bg-white border-black/20 text-neutral-600'
                            : 'bg-[#FFFBEB] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-black text-xs text-black">{n.title}</p>
                          <span className="text-[10px] font-mono font-bold text-neutral-500 shrink-0">{n.timestamp.substring(11, 16)}</span>
                        </div>
                        <p className="text-[11px] text-neutral-700 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Reset Button */}
          <button
            onClick={() => {
              if (confirm('Restore default seed database for the demo?')) {
                resetDatabase()
                toast('Database reset', 'Seed demo data restored successfully.', 'success')
              }
            }}
            className="p-2 rounded-2xl bg-white hover:bg-[#FAF8F5] border-2 border-black text-black transition-all hidden sm:block cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Reset database to demo seed data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
