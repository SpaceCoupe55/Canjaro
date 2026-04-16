import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Modal from '../shared/Modal'
import Badge from '../shared/Badge'
import { 
  User, 
  Camera, 
  MapPin, 
  QrCode,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react'

const DepositForm = () => {
  const { user } = useAuth()
  const { createDeposit, createBatch, addNotification } = useData()
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    weight: '',
    plasticType: '',
    notes: '',
    photos: []
  })
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Mock users for search
  const mockUsers = [
    { id: 'user123', name: 'John Doe', phone: '+233244123456' },
    { id: 'user456', name: 'Jane Smith', phone: '+233244456789' },
    { id: 'user789', name: 'Bob Johnson', phone: '+233244789012' },
    { id: 'user101', name: 'Alice Brown', phone: '+233244101112' }
  ]

  const plasticTypes = [
    { value: 'PET', label: 'PET (Bottles)', rate: 10 },
    { value: 'HDPE', label: 'HDPE (Containers)', rate: 10 },
    { value: 'LDPE', label: 'LDPE (Bags)', rate: 8 },
    { value: 'PP', label: 'PP (Packaging)', rate: 9 },
    { value: 'PS', label: 'PS (Styrofoam)', rate: 7 },
    { value: 'PVC', label: 'PVC (Pipes)', rate: 6 },
    { value: 'Mixed', label: 'Mixed Plastic', rate: 8 }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleUserSelect = (selectedUser) => {
    setFormData(prev => ({ 
      ...prev, 
      userId: selectedUser.id, 
      userName: selectedUser.name 
    }))
    setShowUserSearch(false)
  }

  const calculateTokens = () => {
    if (!formData.weight || !formData.plasticType) return 0
    const selectedType = plasticTypes.find(type => type.value === formData.plasticType)
    return (parseFloat(formData.weight) * selectedType.rate).toFixed(0)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.userId) {
      newErrors.userId = 'Please select a user'
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required'
    } else if (parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0'
    }
    
    if (!formData.plasticType) {
      newErrors.plasticType = 'Please select plastic type'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const depositData = {
        userId: formData.userId,
        userName: formData.userName,
        collectorId: user.id,
        collectorName: user.name,
        weight: parseFloat(formData.weight),
        plasticType: formData.plasticType,
        tokensEarned: parseInt(calculateTokens()),
        tokenRate: plasticTypes.find(type => type.value === formData.plasticType).rate,
        location: {
          lat: 5.6037, // Mock location
          lng: -0.1870,
          address: 'Accra, Ghana'
        },
        photos: formData.photos,
        notes: formData.notes
      }
      
      const result = await createDeposit(depositData)
      
      if (result.success) {
        addNotification({
          userId: user.id,
          type: 'deposit_created',
          title: 'Deposit Created',
          message: `Created deposit for ${formData.userName}: ${formData.weight}kg ${formData.plasticType}`
        })
        
        setShowQRGenerator(true)
        
        // Reset form
        setFormData({
          userId: '',
          userName: '',
          weight: '',
          plasticType: '',
          notes: '',
          photos: []
        })
      }
    } catch (error) {
      console.error('Failed to create deposit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTakePhoto = () => {
    // Mock photo capture
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, `photo_${Date.now()}`]
    }))
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Create Deposit
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Record a new plastic deposit for a user
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select User
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by name or phone..."
                  value={formData.userName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, userName: e.target.value }))
                    setShowUserSearch(true)
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowUserSearch(true)}
                >
                  <Search size={16} className="mr-1" />
                  Search
                </Button>
              </div>
              {errors.userId && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.userId}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Deposit Details */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Deposit Details
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                error={errors.weight}
                placeholder="Enter weight in kg"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plastic Type
                </label>
                <select
                  name="plasticType"
                  value={formData.plasticType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select plastic type</option>
                  {plasticTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.rate} tokens/kg)
                    </option>
                  ))}
                </select>
                {errors.plasticType && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.plasticType}</p>
                )}
              </div>
            </div>

            <Input
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about the deposit"
            />

            {/* Photo Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photos
              </label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleTakePhoto}
                >
                  <Camera size={16} className="mr-1" />
                  Take Photo
                </Button>
                {formData.photos.length > 0 && (
                  <Badge variant="info" size="sm">
                    {formData.photos.length} photo{formData.photos.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Token Calculation */}
        {formData.weight && formData.plasticType && (
          <Card className="bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700">
            <div className="flex items-center space-x-3">
              <Calculator size={24} className="text-primary-600 dark:text-primary-400" />
              <div>
                <p className="font-semibold text-primary-800 dark:text-primary-200">
                  Token Calculation
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  {formData.weight}kg × {plasticTypes.find(type => type.value === formData.plasticType)?.rate} tokens/kg = {calculateTokens()} tokens
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          Create Deposit
        </Button>
      </form>

      {/* User Search Modal */}
      <Modal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        title="Select User"
        size="md"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search users..."
            className="w-full"
          />
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {mockUsers.map((mockUser) => (
              <div
                key={mockUser.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                onClick={() => handleUserSelect(mockUser)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {mockUser.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {mockUser.phone}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* QR Generator Modal */}
      <Modal
        isOpen={showQRGenerator}
        onClose={() => setShowQRGenerator(false)}
        title="QR Code Generated"
        size="md"
      >
        <div className="text-center space-y-4">
          <CheckCircle size={48} className="mx-auto text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Deposit Created Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Show this QR code to the user to complete the transaction.
          </p>
          
          {/* Mock QR Code */}
          <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="grid grid-cols-8 gap-1 w-32 h-32 mx-auto">
              {Array.from({ length: 64 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deposit ID: {Date.now().toString().slice(-8)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Weight: {formData.weight}kg {formData.plasticType}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tokens: {calculateTokens()}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowQRGenerator(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => setShowQRGenerator(false)}
              className="flex-1"
            >
              <QrCode size={16} className="mr-2" />
              Print QR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DepositForm
