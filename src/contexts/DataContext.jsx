import React, { createContext, useContext, useState, useCallback } from 'react'
import { mockData } from '../utils/mockData'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [deposits, setDeposits] = useState(mockData.deposits)
  const [batches, setBatches] = useState(mockData.batches)
  const [redemptions, setRedemptions] = useState(mockData.redemptions)
  const [users, setUsers] = useState(mockData.users)
  const [notifications, setNotifications] = useState(mockData.notifications)
  const [isLoading, setIsLoading] = useState(false)

  const createDeposit = useCallback(async (depositData) => {
    setIsLoading(true)
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newDeposit = {
      id: `dep_${Date.now()}`,
      ...depositData,
      status: 'pending',
      timestamp: new Date().toISOString(),
      qrCode: `QR${Date.now()}`,
      batchId: null
    }
    
    setDeposits(prev => [newDeposit, ...prev])
    setIsLoading(false)
    return { success: true, deposit: newDeposit }
  }, [])

  const updateDeposit = useCallback(async (depositId, updates) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setDeposits(prev => 
      prev.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, ...updates }
          : deposit
      )
    )
    setIsLoading(false)
    return { success: true }
  }, [])

  const createBatch = useCallback(async (batchData) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const newBatch = {
      id: `batch_${Date.now()}`,
      ...batchData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deposits: [],
      totalDeposits: 0,
      expectedWeight: 0,
      actualWeight: 0,
      weightDiscrepancy: 0
    }
    
    setBatches(prev => [newBatch, ...prev])
    setIsLoading(false)
    return { success: true, batch: newBatch }
  }, [])

  const updateBatch = useCallback(async (batchId, updates) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setBatches(prev => 
      prev.map(batch => 
        batch.id === batchId 
          ? { ...batch, ...updates }
          : batch
      )
    )
    setIsLoading(false)
    return { success: true }
  }, [])

  const createRedemption = useCallback(async (redemptionData) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 700))
    
    const newRedemption = {
      id: `red_${Date.now()}`,
      ...redemptionData,
      status: 'active',
      voucherCode: `VOUCHER${Date.now()}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    setRedemptions(prev => [newRedemption, ...prev])
    setIsLoading(false)
    return { success: true, redemption: newRedemption }
  }, [])

  const updateRedemption = useCallback(async (redemptionId, updates) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    setRedemptions(prev => 
      prev.map(redemption => 
        redemption.id === redemptionId 
          ? { ...redemption, ...updates }
          : redemption
      )
    )
    setIsLoading(false)
    return { success: true }
  }, [])

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  const getDepositsByUser = useCallback((userId) => {
    return deposits.filter(deposit => deposit.userId === userId)
  }, [deposits])

  const getBatchesByCollector = useCallback((collectorId) => {
    return batches.filter(batch => batch.collectorId === collectorId)
  }, [batches])

  const getRedemptionsByUser = useCallback((userId) => {
    return redemptions.filter(redemption => redemption.userId === userId)
  }, [redemptions])

  const getUnreadNotificationsCount = useCallback(() => {
    return notifications.filter(notif => !notif.read).length
  }, [notifications])

  const value = {
    deposits,
    batches,
    redemptions,
    users,
    notifications,
    isLoading,
    createDeposit,
    updateDeposit,
    createBatch,
    updateBatch,
    createRedemption,
    updateRedemption,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getDepositsByUser,
    getBatchesByCollector,
    getRedemptionsByUser,
    getUnreadNotificationsCount
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
