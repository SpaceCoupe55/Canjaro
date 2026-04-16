import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  Edit3,
  Save,
  X,
  Award,
  Recycle,
  Droplets,
  TreePine,
  BarChart3
} from 'lucide-react'

const UserProfile = () => {
  const { user, updateUser } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: { ...user.address }
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
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
  }

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: { ...user.address }
    })
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    // Mock password change
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={32} className="text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {user.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 capitalize">
          {user.role.replace('_', ' ')} • Member since {formatDate(user.joinDate)}
        </p>
        {user.verified && (
          <Badge variant="success" size="sm" className="mt-2">
            <Shield size={12} className="mr-1" />
            Verified
          </Badge>
        )}
      </div>

      {/* Profile Information */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Profile Information
          </h3>
          {!isEditing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} className="mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <Input
              label="National ID"
              value={user.nationalId}
              disabled
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Region"
                name="address.region"
                value={formData.address.region}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Country"
                name="address.country"
                value={formData.address.country}
                disabled
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Your Impact
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Recycle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.totalWeight}kg
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Plastic Recycled</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Droplets size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.environmentalImpact.waterSaved}L
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Water Saved</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <TreePine size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(user.statistics.environmentalImpact.co2Saved / 20)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Trees Equivalent</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.totalDeposits}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Deposits</p>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified about deposits and redemptions
                </p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Shield size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Change Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your account password
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Edit3 size={16} />
            </button>
          </button>
        </div>
      </Card>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Enter current password"
          />
          
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="Enter new password"
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm new password"
          />
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="flex-1"
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserProfile
