import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Card from '../shared/Card'
import { Eye, EyeOff, Recycle } from 'lucide-react'

const LoginForm = ({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth()
  const { addNotification } = useData()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      addNotification({
        userId: result.user.id,
        type: 'login_success',
        title: 'Welcome Back!',
        message: `Welcome back, ${result.user.name}!`
      })
    } else {
      setErrors({ general: result.error })
    }
  }

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      user: { email: 'user@demo.com', password: 'demo123' },
      collector: { email: 'collector@demo.com', password: 'demo123' },
      collection_point: { email: 'point@demo.com', password: 'demo123' }
    }
    
    setFormData(demoAccounts[role])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Recycle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            RecycleToken
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Demo Accounts</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('user')}
              className="text-xs"
            >
              User
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('collector')}
              className="text-xs"
            >
              Collector
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDemoLogin('collection_point')}
              className="text-xs"
            >
              Collection Point
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create one here
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default LoginForm
