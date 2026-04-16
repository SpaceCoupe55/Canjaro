import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Badge from '../shared/Badge'
import { 
  TrendingUp, 
  Package, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Recycle,
  BarChart3
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { getBatchesByCollector } = useData()
  
  const batches = getBatchesByCollector(user.id)
  const activeBatches = batches.filter(batch => batch.status === 'pending' || batch.status === 'in_transit')
  const completedBatches = batches.filter(batch => batch.status === 'verified' || batch.status === 'settled')
  // Date helper functions (declare before use)
  const isToday = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    return date.toDateString() === today.toDateString()
  }

  const isThisWeek = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= weekAgo
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const todayEarnings = batches
    .filter(batch => batch.status === 'settled' && isToday(batch.settledAt))
    .reduce((sum, batch) => sum + batch.earnings.actual, 0)

  const weeklyEarnings = batches
    .filter(batch => batch.status === 'settled' && isThisWeek(batch.settledAt))
    .reduce((sum, batch) => sum + batch.earnings.actual, 0)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>
      case 'in_transit':
        return <Badge variant="info" size="sm">In Transit</Badge>
      case 'verified':
        return <Badge variant="success" size="sm">Verified</Badge>
      case 'settled':
        return <Badge variant="success" size="sm">Settled</Badge>
      default:
        return <Badge variant="info" size="sm">{status}</Badge>
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user.name.split(' ')[0]}! 🚚
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Ready to collect some plastic today?
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Today's Earnings</p>
              <p className="text-2xl font-bold">₵{todayEarnings}</p>
            </div>
            <DollarSign size={24} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">This Week</p>
              <p className="text-2xl font-bold">₵{weeklyEarnings}</p>
            </div>
            <TrendingUp size={24} />
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <Package size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeBatches.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active Batches</p>
        </Card>

        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {completedBatches.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
        </Card>

        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.statistics.totalCollections}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Collections</p>
        </Card>
      </div>

      {/* Active Batches */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Active Batches
          </h3>
          <Badge variant="info" size="sm">{activeBatches.length}</Badge>
        </div>
        
        {activeBatches.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No active batches</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create a new deposit to start a batch!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeBatches.map((batch) => (
              <div key={batch.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                      <Package size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Batch #{batch.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {batch.totalDeposits} deposits • {batch.expectedWeight}kg
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600 dark:text-primary-400">
                      ₵{batch.earnings.expected}
                    </p>
                    {getStatusBadge(batch.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h3>
          <BarChart3 size={20} className="text-gray-400" />
        </div>
        
        {batches.length === 0 ? (
          <div className="text-center py-8">
            <Recycle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No activity yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start collecting plastic to see your activity here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {batches.slice(0, 5).map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    batch.status === 'settled' ? 'bg-green-100 dark:bg-green-900' :
                    batch.status === 'verified' ? 'bg-blue-100 dark:bg-blue-900' :
                    'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                    {batch.status === 'settled' ? <CheckCircle size={16} className="text-green-600 dark:text-green-400" /> :
                     batch.status === 'verified' ? <Clock size={16} className="text-blue-600 dark:text-blue-400" /> :
                     <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Batch #{batch.id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(batch.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    ₵{batch.earnings.actual || batch.earnings.expected}
                  </p>
                  {getStatusBadge(batch.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Performance Metrics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.averageRating}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.reliabilityScore}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reliability Score</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
