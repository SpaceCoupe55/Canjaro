import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Download,
  Filter
} from 'lucide-react'

const EarningsDashboard = () => {
  const { user } = useAuth()
  const { getBatchesByCollector } = useData()
  const [timeFilter, setTimeFilter] = useState('week')
  const [showChart, setShowChart] = useState(false)

  const batches = getBatchesByCollector(user.id)
  const settledBatches = batches.filter(batch => batch.status === 'settled')
  const pendingBatches = batches.filter(batch => batch.status === 'verified')
  
  const totalEarnings = settledBatches.reduce((sum, batch) => sum + batch.earnings.actual, 0)
  const pendingEarnings = pendingBatches.reduce((sum, batch) => sum + batch.earnings.actual, 0)
  
  // Date helpers (declare before use)
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

  const isThisMonth = (dateString) => {
    if (!dateString) return false
    const today = new Date()
    const date = new Date(dateString)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    return date >= monthAgo
  }

  const todayEarnings = settledBatches
    .filter(batch => isToday(batch.settledAt))
    .reduce((sum, batch) => sum + batch.earnings.actual, 0)
  
  const weekEarnings = settledBatches
    .filter(batch => isThisWeek(batch.settledAt))
    .reduce((sum, batch) => sum + batch.earnings.actual, 0)
  
  const monthEarnings = settledBatches
    .filter(batch => isThisMonth(batch.settledAt))
    .reduce((sum, batch) => sum + batch.earnings.actual, 0)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'settled':
        return <Badge variant="success" size="sm">Settled</Badge>
      case 'verified':
        return <Badge variant="info" size="sm">Verified</Badge>
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>
      default:
        return <Badge variant="info" size="sm">{status}</Badge>
    }
  }

  const getFilteredBatches = () => {
    switch (timeFilter) {
      case 'today':
        return settledBatches.filter(batch => isToday(batch.settledAt))
      case 'week':
        return settledBatches.filter(batch => isThisWeek(batch.settledAt))
      case 'month':
        return settledBatches.filter(batch => isThisMonth(batch.settledAt))
      default:
        return settledBatches
    }
  }

  const getFilteredEarnings = () => {
    switch (timeFilter) {
      case 'today':
        return todayEarnings
      case 'week':
        return weekEarnings
      case 'month':
        return monthEarnings
      default:
        return totalEarnings
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Earnings Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your earnings and payment history
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Earned</p>
              <p className="text-3xl font-bold">₵{totalEarnings}</p>
            </div>
            <DollarSign size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Pending</p>
              <p className="text-3xl font-bold">₵{pendingEarnings}</p>
            </div>
            <Clock size={32} />
          </div>
        </Card>
      </div>

      {/* Time Filter */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Earnings by Period
          </h3>
          <div className="flex space-x-2">
            <Button
              variant={timeFilter === 'today' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeFilter('today')}
            >
              Today
            </Button>
            <Button
              variant={timeFilter === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeFilter('week')}
            >
              Week
            </Button>
            <Button
              variant={timeFilter === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeFilter('month')}
            >
              Month
            </Button>
            <Button
              variant={timeFilter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeFilter('all')}
            >
              All
            </Button>
          </div>
        </div>
        
        <div className="text-center py-8">
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ₵{getFilteredEarnings()}
          </p>
          <p className="text-gray-600 dark:text-gray-400 capitalize">
            {timeFilter === 'all' ? 'Total' : `This ${timeFilter}`} Earnings
          </p>
        </div>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.statistics.totalCollections}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Collections</p>
        </Card>

        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.statistics.totalWeight}kg
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Weight</p>
        </Card>

        <Card className="text-center">
          <CheckCircle size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.statistics.averageRating}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
        </Card>
      </div>

      {/* Recent Earnings */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Earnings
          </h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Download size={16} className="mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Filter size={16} className="mr-1" />
              Filter
            </Button>
          </div>
        </div>
        
        {getFilteredBatches().length === 0 ? (
          <div className="text-center py-8">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No earnings yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Complete some batches to see your earnings here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {getFilteredBatches().slice(0, 10).map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Batch #{batch.id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(batch.settledAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    +₵{batch.earnings.actual}
                  </p>
                  {getStatusBadge(batch.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pending Payments */}
      {pendingBatches.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Pending Payments
            </h3>
          </div>
          
          <div className="space-y-3">
            {pendingBatches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-200 dark:bg-yellow-700 p-2 rounded-full">
                    <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Batch #{batch.id.slice(-6)}
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Awaiting settlement
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                    ₵{batch.earnings.actual}
                  </p>
                  <Badge variant="warning" size="sm">Pending</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Earnings Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Earnings Trend
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowChart(!showChart)}
          >
            <BarChart3 size={16} className="mr-1" />
            {showChart ? 'Hide' : 'Show'} Chart
          </Button>
        </div>
        
        {showChart ? (
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Click "Show Chart" to view earnings trends
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default EarningsDashboard
