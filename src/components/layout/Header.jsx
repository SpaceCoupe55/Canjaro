import React, { useState } from 'react'
import { Bell, Moon, Sun, LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'

const Header = ({ user, unreadCount, isDarkMode, onToggleDarkMode }) => {
  const { logout } = useAuth()
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deposit_confirmed':
        return '✅'
      case 'tokens_redeemed':
        return '🎁'
      case 'batch_verified':
        return '📦'
      default:
        return '🔔'
    }
  }

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-primary-600 p-2 rounded-lg">
                <span className="text-white font-bold text-lg">♻️</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                RecycleToken
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="error" 
                      size="xs"
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </button>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
                
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
        size="md"
      >
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-colors
                      ${notification.read 
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                        : 'bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700'
                      }
                    `}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Header
