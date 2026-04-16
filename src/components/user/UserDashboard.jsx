import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useTheme } from '../../contexts/ThemeContext'
import Header from '../layout/Header'
import BottomTabBar from '../layout/BottomTabBar'
import Dashboard from './Dashboard'
import QRScanner from './QRScanner'
import TokenWallet from './TokenWallet'
import RedemptionCenter from './RedemptionCenter'
import UserProfile from './UserProfile'

const UserDashboard = () => {
  const { user } = useAuth()
  const { getUnreadNotificationsCount } = useData()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />
      case 'scan':
        return <QRScanner />
      case 'wallet':
        return <TokenWallet />
      case 'redeem':
        return <RedemptionCenter />
      case 'profile':
        return <UserProfile />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        user={user}
        unreadCount={getUnreadNotificationsCount()}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="pb-20">
        {renderContent()}
      </main>
      
      <BottomTabBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        role="user"
      />
    </div>
  )
}

export default UserDashboard
