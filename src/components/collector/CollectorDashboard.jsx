import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useTheme } from '../../contexts/ThemeContext'
import Header from '../layout/Header'
import BottomTabBar from '../layout/BottomTabBar'
import Dashboard from './Dashboard'
import DepositForm from './DepositForm'
import BatchManager from './BatchManager'
import RouteOptimizer from './RouteOptimizer'
import EarningsDashboard from './EarningsDashboard'

const CollectorDashboard = () => {
  const { user } = useAuth()
  const { getUnreadNotificationsCount } = useData()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />
      case 'create':
        return <DepositForm />
      case 'batches':
        return <BatchManager />
      case 'routes':
        return <RouteOptimizer />
      case 'earnings':
        return <EarningsDashboard />
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
        role="collector"
      />
    </div>
  )
}

export default CollectorDashboard
