import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  isVisible = true
}) => {
  const [show, setShow] = useState(isVisible)
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])
  
  const handleClose = () => {
    setShow(false)
    setTimeout(() => onClose?.(), 300)
  }
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
  }
  
  const Icon = icons[type]
  
  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm w-full
      transform transition-all duration-300 ease-in-out
      ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        flex items-start p-4 rounded-lg border shadow-lg
        ${colors[type]}
      `}>
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
