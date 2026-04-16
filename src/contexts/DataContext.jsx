import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { depositsApi } from '../lib/api/deposits'
import { batchesApi } from '../lib/api/batches'
import { redemptionsApi } from '../lib/api/redemptions'
import { notificationsApi } from '../lib/api/notifications'
import { partnersApi, collectionPointsApi } from '../lib/api/partners'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [deposits, setDeposits] = useState([])
  const [batches, setBatches] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [notifications, setNotifications] = useState([])
  const [partners, setPartners] = useState([])
  const [collectionPoints, setCollectionPoints] = useState([])
  const [collectionPoint, setCollectionPoint] = useState(null) // current user's CP
  const [isLoading, setIsLoading] = useState(false)

  // Load public data once on mount
  useEffect(() => {
    partnersApi.getAll().then(setPartners).catch(console.error)
    collectionPointsApi.getAll().then(setCollectionPoints).catch(console.error)
  }, [])

  // Load user-specific data whenever the logged-in user changes
  useEffect(() => {
    if (!user) {
      setDeposits([])
      setBatches([])
      setRedemptions([])
      setNotifications([])
      setCollectionPoint(null)
      return
    }
    loadUserData(user)
  }, [user?.id])

  const loadUserData = async (currentUser) => {
    setIsLoading(true)
    try {
      // Notifications are loaded for every role
      const notifs = await notificationsApi.getByUser(currentUser.id)
      setNotifications(notifs)

      if (currentUser.role === 'user') {
        const [deps, reds] = await Promise.all([
          depositsApi.getByUser(currentUser.id),
          redemptionsApi.getByUser(currentUser.id),
        ])
        setDeposits(deps)
        setRedemptions(reds)

      } else if (currentUser.role === 'collector') {
        const [deps, bats] = await Promise.all([
          depositsApi.getByCollector(currentUser.id),
          batchesApi.getByCollector(currentUser.id),
        ])
        setDeposits(deps)
        setBatches(bats)

      } else if (currentUser.role === 'collection_point') {
        const cp = await collectionPointsApi.getByProfileId(currentUser.id)
        setCollectionPoint(cp)
        if (cp) {
          const [bats, deps] = await Promise.all([
            batchesApi.getByCollectionPoint(cp.id),
            depositsApi.getByCollectionPoint(cp.id),
          ])
          setBatches(bats)
          setDeposits(deps)
        }
      }
    } catch (err) {
      console.error('Failed to load user data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Deposits ──────────────────────────────────────────────

  const createDeposit = useCallback(async (depositData) => {
    setIsLoading(true)
    try {
      const deposit = await depositsApi.create({
        ...depositData,
        userId: user.id,
      })
      setDeposits(prev => [deposit, ...prev])
      return { success: true, deposit }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const updateDeposit = useCallback(async (depositId, updates) => {
    setIsLoading(true)
    try {
      const updated = await depositsApi.update(depositId, updates)
      setDeposits(prev => prev.map(d => d.id === depositId ? updated : d))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Batches ───────────────────────────────────────────────

  const createBatch = useCallback(async (batchData) => {
    setIsLoading(true)
    try {
      const batch = await batchesApi.create({
        ...batchData,
        collectorId: user.id,
      })
      setBatches(prev => [batch, ...prev])
      return { success: true, batch }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const updateBatch = useCallback(async (batchId, updates) => {
    setIsLoading(true)
    try {
      const updated = await batchesApi.update(batchId, updates)
      setBatches(prev => prev.map(b => b.id === batchId ? updated : b))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Redemptions ───────────────────────────────────────────

  const createRedemption = useCallback(async (redemptionData) => {
    setIsLoading(true)
    try {
      const redemption = await redemptionsApi.create({
        ...redemptionData,
        userId: user.id,
      })
      setRedemptions(prev => [redemption, ...prev])
      return { success: true, redemption }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const updateRedemption = useCallback(async (redemptionId, updates) => {
    setIsLoading(true)
    try {
      const updated = await redemptionsApi.update(redemptionId, updates)
      setRedemptions(prev => prev.map(r => r.id === redemptionId ? updated : r))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Notifications ─────────────────────────────────────────

  // addNotification is kept for backward compatibility but is now a no-op
  // since notifications are created server-side by DB triggers
  const addNotification = useCallback(() => {}, [])

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }, [])

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!user) return
    try {
      await notificationsApi.markAllAsRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }, [user])

  // ── Selectors (kept for backward compatibility) ───────────

  const getDepositsByUser = useCallback((userId) =>
    deposits.filter(d => d.userId === userId), [deposits])

  const getBatchesByCollector = useCallback((collectorId) =>
    batches.filter(b => b.collectorId === collectorId), [batches])

  const getRedemptionsByUser = useCallback((userId) =>
    redemptions.filter(r => r.userId === userId), [redemptions])

  const getUnreadNotificationsCount = useCallback(() =>
    notifications.filter(n => !n.read).length, [notifications])

  const value = {
    deposits,
    batches,
    redemptions,
    notifications,
    partners,
    collectionPoints,
    collectionPoint,
    isLoading,
    // Mutations
    createDeposit,
    updateDeposit,
    createBatch,
    updateBatch,
    createRedemption,
    updateRedemption,
    // Notifications
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    // Selectors
    getDepositsByUser,
    getBatchesByCollector,
    getRedemptionsByUser,
    getUnreadNotificationsCount,
    // Refresh
    refreshData: () => user && loadUserData(user),
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
