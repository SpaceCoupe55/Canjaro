import React, { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAuth } from './contexts/AuthContext'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import UserDashboard from './components/user/UserDashboard'
import CollectorDashboard from './components/collector/CollectorDashboard'
import CollectionPointDashboard from './components/collectionPoint/CollectionPointDashboard'
import LoadingSpinner from './components/shared/LoadingSpinner'

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)

  console.log('AppContent rendered:', { user, isAuthenticated, isLoading })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
    )
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'user':
      return <UserDashboard />
    case 'collector':
      return <CollectorDashboard />
    case 'collection_point':
      return <CollectionPointDashboard />
    default:
      return <UserDashboard />
  }
}

const App = () => {
  console.log('App component rendered')
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App