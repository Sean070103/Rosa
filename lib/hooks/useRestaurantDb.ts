'use client'

import { useState, useEffect } from 'react'
import {
  db,
  Employee,
  Shift,
  ScheduleRequest,
  InventoryItem,
  RecipeItem,
  OperatingExpense,
  StockMovement,
  Supplier,
  PurchaseOrder,
  WastageRecord,
  Reservation,
  FloorTable,
  POSOrder,
  AuditLog,
  SystemNotification,
  UserRole,
} from '@/lib/db/restaurant-db'

export function useRestaurantDb() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      setTick((prev) => prev + 1)
    })
    return () => unsubscribe()
  }, [])

  return {
    employees: db.getEmployees(),
    shifts: db.getShifts(),
    scheduleRequests: db.getScheduleRequests(),
    inventory: db.getInventory(),
    recipes: db.getRecipes(),
    operatingExpenses: db.getOperatingExpenses(),
    stockMovements: db.getStockMovements(),
    suppliers: db.getSuppliers(),
    purchaseOrders: db.getPurchaseOrders(),
    wastageRecords: db.getWastageRecords(),
    reservations: db.getReservations(),
    tables: db.getTables(),
    posOrders: db.getPOSOrders(),
    auditLogs: db.getAuditLogs(),
    notifications: db.getNotifications(),
    // DB methods
    createShift: db.createShift.bind(db),
    updateShift: db.updateShift.bind(db),
    deleteShift: db.deleteShift.bind(db),
    submitScheduleRequest: db.submitScheduleRequest.bind(db),
    approveScheduleRequest: db.approveScheduleRequest.bind(db),
    rejectScheduleRequest: db.rejectScheduleRequest.bind(db),
    clockInOut: db.clockInOut.bind(db),
    createRecipe: db.createRecipe.bind(db),
    updateRecipe: db.updateRecipe.bind(db),
    deleteRecipe: db.deleteRecipe.bind(db),
    addOperatingExpense: db.addOperatingExpense.bind(db),
    updateInventoryItem: db.updateInventoryItem.bind(db),
    recordStockMovement: db.recordStockMovement.bind(db),
    recordWastage: db.recordWastage.bind(db),
    createPurchaseOrder: db.createPurchaseOrder.bind(db),
    receivePurchaseOrder: db.receivePurchaseOrder.bind(db),
    createReservation: db.createReservation.bind(db),
    updateReservationStatus: db.updateReservationStatus.bind(db),
    seatReservation: db.seatReservation.bind(db),
    recommendTableForReservation: db.recommendTableForReservation.bind(db),
    updateTablePosition: db.updateTablePosition.bind(db),
    updateTable: db.updateTable.bind(db),
    addTable: db.addTable.bind(db),
    removeTable: db.removeTable.bind(db),
    setTableStatus: db.setTableStatus.bind(db),
    assignEmployeeToTable: db.assignEmployeeToTable.bind(db),
    transferEmployeeTables: db.transferEmployeeTables.bind(db),
    combineTables: db.combineTables.bind(db),
    separateTables: db.separateTables.bind(db),
    createPOSOrder: db.createPOSOrder.bind(db),
    completePOSOrder: db.completePOSOrder.bind(db),
    addAuditLog: db.addAuditLog.bind(db),
    addNotification: db.addNotification.bind(db),
    markNotificationAsRead: db.markNotificationAsRead.bind(db),
    markAllNotificationsRead: db.markAllNotificationsRead.bind(db),
    resetDatabase: db.resetDatabase.bind(db),
  }
}
