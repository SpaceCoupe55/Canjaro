import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Badge from '../shared/Badge'
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Recycle,
  MapPin
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { batches, deposits, users } = useData()
  
  // Helper functions must be declared before use
  const isToday = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    return date.toDateString() === today.toDateString()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingBatches = batches.filter(batch => batch.status === 'in_transit')
  const verifiedBatches = batches.filter(batch => batch.status === 'verified')
  const settledBatches = batches.filter(batch => batch.status === 'settled')

  const todayWeight = deposits
    .filter(deposit => isToday(deposit.timestamp))
    .reduce((sum, deposit) => sum + deposit.weight, 0)

  const todayBatches = batches
    .filter(batch => isToday(batch.verifiedAt))
    .length

  const todayTokens = deposits
    .filter(deposit => isToday(deposit.timestamp))
    .reduce((sum, deposit) => sum + deposit.tokensEarned, 0)


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
          Welcome back, {user.name}! 🏭
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your collection point operations
        </p>
      </div>

      {/* Today's Summary */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Today's Summary</p>
            <p className="text-2xl font-bold">{todayBatches} batches processed</p>
            <p className="text-primary-100 text-sm">
              {todayWeight}kg • {todayTokens} tokens distributed
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Recycle size={32} />
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <Package size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {pendingBatches.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending Batches</p>
        </Card>

        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {verifiedBatches.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Verified Today</p>
        </Card>

        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {users.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
        </Card>

        <Card className="text-center">
          <DollarSign size={24} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₵{settledBatches.reduce((sum, batch) => sum + batch.earnings.actual, 0)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
        </Card>
      </div>

      {/* Pending Batches */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pending Verification
          </h3>
          <Badge variant="warning" size="sm">{pendingBatches.length}</Badge>
        </div>
        
        {pendingBatches.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No pending batches</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              All batches have been processed
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBatches.slice(0, 5).map((batch) => (
              <div key={batch.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Batch #{batch.id.slice(-6)} - {batch.collectorName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {batch.totalDeposits} deposits • {batch.expectedWeight}kg expected
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
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
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No activity yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Batches will appear here when collectors deliver them
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
                      Batch #{batch.id.slice(-6)} - {batch.collectorName}
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.totalBatchesProcessed}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Batches Processed</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.totalWeightProcessed}kg
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Weight</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.totalTokensDistributed}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tokens Distributed</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user.statistics.averageProcessingTime}m
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Processing Time</p>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
              System Alerts
            </h4>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              {pendingBatches.length > 0 
                ? `${pendingBatches.length} batches awaiting verification`
                : 'All systems running smoothly'
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
