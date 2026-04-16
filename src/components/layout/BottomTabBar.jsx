import React from 'react'
import { Home, QrCode, Wallet, Gift, User } from 'lucide-react'

const BottomTabBar = ({ activeTab, onTabChange, role }) => {
  const getTabs = () => {
    switch (role) {
      case 'user':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'scan', label: 'Scan', icon: QrCode },
          { id: 'wallet', label: 'Wallet', icon: Wallet },
          { id: 'redeem', label: 'Redeem', icon: Gift },
          { id: 'profile', label: 'Profile', icon: User }
        ]
      case 'collector':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'create', label: 'Create', icon: QrCode },
          { id: 'batches', label: 'Batches', icon: Wallet },
          { id: 'routes', label: 'Routes', icon: Home },
          { id: 'earnings', label: 'Earnings', icon: Wallet }
        ]
      case 'collection_point':
        return [
          { id: 'home', label: 'Dashboard', icon: Home },
          { id: 'verify', label: 'Verify', icon: QrCode },
          { id: 'settlement', label: 'Settlement', icon: Wallet },
          { id: 'analytics', label: 'Analytics', icon: Home },
          { id: 'reports', label: 'Reports', icon: Wallet }
        ]
      default:
        return []
    }
  }

  const tabs = getTabs()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors duration-200
                ${isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <Icon 
                size={20} 
                className={`
                  transition-transform duration-200
                  ${isActive ? 'scale-110' : ''}
                `}
              />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomTabBar
