import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useTheme } from '../../contexts/ThemeContext'
import Header from '../layout/Header'
import BottomTabBar from '../layout/BottomTabBar'
import Dashboard from './Dashboard'
import BatchVerification from './BatchVerification'
import SettlementSystem from './SettlementSystem'
import AnalyticsDashboard from './AnalyticsDashboard'
import ReportingTools from './ReportingTools'

const CollectionPointDashboard = () => {
  const { user } = useAuth()
  const { getUnreadNotificationsCount } = useData()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />
      case 'verify':
        return <BatchVerification />
      case 'settlement':
        return <SettlementSystem />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'reports':
        return <ReportingTools />
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
        role="collection_point"
      />
    </div>
  )
}

export default CollectionPointDashboard
