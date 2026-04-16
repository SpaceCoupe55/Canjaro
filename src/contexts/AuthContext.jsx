import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo accounts
    const demoAccounts = {
      'user@demo.com': {
        id: 'user123',
        name: 'John Doe',
        email: 'user@demo.com',
        role: 'user',
        nationalId: 'GH123456789',
        phone: '+233244123456',
        tokenBalance: 150,
        verified: true,
        verificationDate: '2024-01-10',
        joinDate: '2024-01-15',
        profileImage: null,
        address: {
          street: '123 Main St',
          city: 'Accra',
          region: 'Greater Accra',
          country: 'Ghana'
        },
        statistics: {
          totalDeposits: 45,
          totalWeight: 112.5,
          totalTokensEarned: 1125,
          totalRedeemed: 975,
          environmentalImpact: {
            co2Saved: 337.5,
            waterSaved: 2250
          }
        }
      },
      'collector@demo.com': {
        id: 'col456',
        name: 'Jane Smith',
        email: 'collector@demo.com',
        role: 'collector',
        nationalId: 'GH987654321',
        phone: '+233244987654',
        tokenBalance: 0,
        verified: true,
        verificationDate: '2024-01-05',
        joinDate: '2024-01-01',
        profileImage: null,
        address: {
          street: '456 Collector Ave',
          city: 'Accra',
          region: 'Greater Accra',
          country: 'Ghana'
        },
        statistics: {
          totalCollections: 120,
          totalWeight: 450.5,
          totalEarnings: 4505,
          averageRating: 4.8,
          reliabilityScore: 95
        }
      },
      'point@demo.com': {
        id: 'cp001',
        name: 'Central Recycling Hub',
        email: 'point@demo.com',
        role: 'collection_point',
        nationalId: 'GH555666777',
        phone: '+233244555666',
        tokenBalance: 0,
        verified: true,
        verificationDate: '2024-01-01',
        joinDate: '2024-01-01',
        profileImage: null,
        address: {
          street: '789 Recycling St',
          city: 'Tema',
          region: 'Greater Accra',
          country: 'Ghana'
        },
        statistics: {
          totalBatchesProcessed: 250,
          totalWeightProcessed: 1250.5,
          totalTokensDistributed: 12505,
          averageProcessingTime: 15
        }
      }
    }

    if (demoAccounts[email] && password === 'demo123') {
      setUser(demoAccounts[email])
      setIsLoading(false)
      return { success: true, user: demoAccounts[email] }
    } else {
      setIsLoading(false)
      return { success: false, error: 'Invalid credentials' }
    }
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
      tokenBalance: 0,
      verified: false,
      joinDate: new Date().toISOString().split('T')[0],
      statistics: {
        totalDeposits: 0,
        totalWeight: 0,
        totalTokensEarned: 0,
        totalRedeemed: 0,
        environmentalImpact: {
          co2Saved: 0,
          waterSaved: 0
        }
      }
    }
    
    setUser(newUser)
    setIsLoading(false)
    return { success: true, user: newUser }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
