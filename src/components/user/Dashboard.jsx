import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Badge from '../shared/Badge'
import { 
  TrendingUp, 
  Recycle, 
  Droplets, 
  TreePine, 
  Award,
  QrCode,
  History,
  Gift,
  BarChart3
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { getDepositsByUser } = useData()
  
  const deposits = getDepositsByUser(user.id)
  const recentDeposits = deposits.slice(0, 5)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="sm">Confirmed</Badge>
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>
      case 'rejected':
        return <Badge variant="error" size="sm">Rejected</Badge>
      default:
        return <Badge variant="info" size="sm">{status}</Badge>
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ready to make a difference today?
        </p>
      </div>

      {/* Token Balance Card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Your Token Balance</p>
            <p className="text-3xl font-bold">{user.tokenBalance}</p>
            <p className="text-primary-100 text-sm">
              ≈ ₵{(user.tokenBalance * 0.1).toFixed(2)} in value
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Recycle size={32} />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card hover className="text-center p-4">
          <QrCode size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="font-medium text-gray-900 dark:text-gray-100">Scan QR</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Earn tokens</p>
        </Card>
        
        <Card hover className="text-center p-4">
          <Gift size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="font-medium text-gray-900 dark:text-gray-100">Redeem</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Use tokens</p>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Impact
          </h3>
          <BarChart3 size={20} className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
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
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h3>
          <History size={20} className="text-gray-400" />
        </div>
        
        {recentDeposits.length === 0 ? (
          <div className="text-center py-8">
            <Recycle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No deposits yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Scan your first QR code to start earning tokens!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDeposits.map((deposit) => (
              <div key={deposit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    <Recycle size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {deposit.weight}kg {deposit.plasticType}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(deposit.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600 dark:text-primary-400">
                    +{deposit.tokensEarned} tokens
                  </p>
                  {getStatusBadge(deposit.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Achievement Badge */}
      {user.statistics.totalWeight > 50 && (
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <div className="flex items-center space-x-3">
            <Award size={32} />
            <div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p className="text-sm opacity-90">
                You've recycled over 50kg of plastic. You're making a real difference!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
