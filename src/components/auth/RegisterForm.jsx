import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Card from '../shared/Card'
import { Eye, EyeOff, Recycle, ArrowLeft } from 'lucide-react'

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth()
  const { addNotification } = useData()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationalId: '',
    phone: '',
    address: {
      street: '',
      city: '',
      region: '',
      country: 'Ghana'
    },
    role: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required'
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    
    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep3()) return
    
    const result = await register(formData)
    
    if (result.success) {
      addNotification({
        userId: result.user.id,
        type: 'welcome',
        title: 'Welcome to RecycleToken!',
        message: `Welcome, ${result.user.name}! Start earning tokens by recycling plastic.`
      })
    } else {
      setErrors({ general: result.error })
    }
  }

  const roleOptions = [
    {
      value: 'user',
      title: 'User',
      description: 'Collect plastic waste and earn tokens',
      icon: '♻️'
    },
    {
      value: 'collector',
      title: 'Collector',
      description: 'Collect plastic from users and deliver to collection points',
      icon: '🚚'
    },
    {
      value: 'collection_point',
      title: 'Collection Point',
      description: 'Process and verify plastic batches from collectors',
      icon: '🏭'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Recycle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join the recycling revolution
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-1 mx-2
                    ${currentStep > step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep} of 3
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Basic Information
              </h2>
              
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email address"
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
                  placeholder="Create a password (min 8 characters)"
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

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Personal Details
              </h2>
              
              <Input
                label="National ID"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                error={errors.nationalId}
                placeholder="Enter your national ID"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="Enter your phone number"
                required
              />

              <Input
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                error={errors['address.street']}
                placeholder="Enter your street address"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  error={errors['address.city']}
                  placeholder="Enter your city"
                  required
                />

                <Input
                  label="Region"
                  name="address.region"
                  value={formData.address.region}
                  onChange={handleChange}
                  placeholder="Enter your region"
                />
              </div>
            </div>
          )}

          {/* Step 3: Role Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Choose Your Role
              </h2>
              
              <div className="grid gap-4">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    className={`
                      border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${formData.role === role.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{role.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {role.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {role.description}
                        </p>
                      </div>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${formData.role === role.value
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300 dark:border-gray-600'
                        }
                      `}>
                        {formData.role === role.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.role}</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="flex items-center"
              >
                Create Account
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default RegisterForm
