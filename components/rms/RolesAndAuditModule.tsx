'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  Users,
  Lock,
  Layers,
  History,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Sliders,
  Store,
} from 'lucide-react'
import { useRestaurantDb } from '@/lib/hooks/useRestaurantDb'
import { UserRole } from '@/lib/db/restaurant-db'
import { useToast } from './RmsToast'

interface RolesAndAuditModuleProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

export function RolesAndAuditModule({ currentRole, onRoleChange }: RolesAndAuditModuleProps) {
  const { auditLogs, employees, resetDatabase } = useRestaurantDb()
  const { toast } = useToast()
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('all')

  // Filtered audit logs
  const filteredLogs = auditLogs.filter(
    (log) => auditModuleFilter === 'all' || log.module === auditModuleFilter
  )

  // Roles permissions matrix definition
  const permissions = [
    { feature: 'View Unified Executive Dashboard', admin: true, manager: true, employee: true, customer: false },
    { feature: 'Create & Edit Floor Plan Layout (Drag & Drop)', admin: true, manager: true, employee: false, customer: false },
    { feature: 'Assign Shifts & Enforce Max Hours', admin: true, manager: true, employee: false, customer: false },
    { feature: 'Approve / Reject Shift Swaps & Requests', admin: true, manager: true, employee: false, customer: false },
    { feature: 'Clock In / Clock Out & Submit Shift Swaps', admin: true, manager: true, employee: true, customer: false },
    { feature: 'Edit Recipe Costing & Ingredient Yields', admin: true, manager: true, employee: false, customer: false },
    { feature: 'Manage Stock, Issue POs & Log Spoilage', admin: true, manager: true, employee: false, customer: false },
    { feature: 'Process Table POS Orders & Deduct Stock', admin: true, manager: true, employee: true, customer: false },
    { feature: 'Seat Guests & Update Table Occupancy', admin: true, manager: true, employee: true, customer: false },
    { feature: 'Book Tables & Select Available Seating', admin: true, manager: true, employee: true, customer: true },
    { feature: 'View Financial & Employee Reports (CSV Export)', admin: true, manager: true, employee: false, customer: false },
    { feature: 'System Configuration & Full Audit Log Stream', admin: true, manager: false, employee: false, customer: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header Banner (Neo-Brutalist + Rounded-3xl) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-black">Role Permissions Matrix & Audit Console</h2>
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#22C55E] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                  RBAC 2.0
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-600 mt-0.5">
                Role-based access control (RBAC) rules and immutable synchronized system audit stream.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Restore default seed database?')) {
                resetDatabase()
                toast('Database Restored', 'Reset all records to standard demo state', 'success')
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-white hover:bg-[#FAF8F5] text-black border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <RotateCcw className="w-4 h-4 text-black" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Permissions Matrix Table (Neo-Brutalist + Rounded-3xl) */}
      <div className="bg-white border-3 border-black rounded-3xl p-6 lg:p-7 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <div className="pb-3 border-b-2 border-black/10">
          <h3 className="font-black text-base text-black">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs font-medium text-neutral-600">Permissions enforced across system actions, data modification, and views.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-black uppercase font-black text-[10px] border-b-2 border-black">
              <tr>
                <th className="p-3">System Capability / Module Feature</th>
                <th className="p-3 text-center">Administrator</th>
                <th className="p-3 text-center">Manager</th>
                <th className="p-3 text-center">Staff / Employee</th>
                <th className="p-3 text-center">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {permissions.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-[#172033]">{p.feature}</td>

                  <td className="p-3 text-center">
                    {p.admin ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {p.manager ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {p.employee ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {p.customer ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synchronized Real-Time Audit Log Console (Glassmorphic + Rounded-3xl) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#EA580C]" />
              <h3 className="font-bold text-base text-[#172033]">Immutable Audit Trail Console</h3>
            </div>
            <p className="text-xs text-[#64748B]">Tracking all critical operational actions across all five modules.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B]">Filter Module:</span>
            <select
              value={auditModuleFilter}
              onChange={(e) => setAuditModuleFilter(e.target.value)}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#172033] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="all">All Modules</option>
              <option value="Scheduling">Scheduling</option>
              <option value="Costing">Costing</option>
              <option value="Inventory">Inventory</option>
              <option value="Reservations">Reservations</option>
              <option value="FloorPlan">FloorPlan</option>
              <option value="POS">POS</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase font-semibold text-[10px] border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Module</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Detailed Operational Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200">
                      {log.module.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#172033]">
                    {log.actor} <span className="text-[10px] text-[#64748B]">({log.actorRole})</span>
                  </td>
                  <td className="p-3 font-bold text-amber-700">{log.action}</td>
                  <td className="p-3 text-[#64748B] max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
