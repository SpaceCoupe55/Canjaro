import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Recycle,
  Droplets,
  TreePine
} from 'lucide-react'

const AnalyticsDashboard = () => {
  const { user } = useAuth()
  const { batches, deposits, users: allUsers } = useData()
  const [timeFilter, setTimeFilter] = useState('week')
  const [showCharts, setShowCharts] = useState(true)

  const getFilteredData = () => {
    const now = new Date()
    let startDate
    
    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0)
    }
    
    return {
      batches: batches.filter(batch => new Date(batch.createdAt) >= startDate),
      deposits: deposits.filter(deposit => new Date(deposit.timestamp) >= startDate)
    }
  }

  const filteredData = getFilteredData()
  
  const totalWeight = filteredData.deposits.reduce((sum, deposit) => sum + deposit.weight, 0)
  const totalTokens = filteredData.deposits.reduce((sum, deposit) => sum + deposit.tokensEarned, 0)
  const totalBatches = filteredData.batches.length
  const totalUsers = allUsers.length
  
  const plasticByType = filteredData.deposits.reduce((acc, deposit) => {
    acc[deposit.plasticType] = (acc[deposit.plasticType] || 0) + deposit.weight
    return acc
  }, {})
  
  const topCollectors = filteredData.batches
    .reduce((acc, batch) => {
      const existing = acc.find(c => c.id === batch.collectorId)
      if (existing) {
        existing.weight += batch.actualWeight || batch.expectedWeight
        existing.earnings += batch.earnings.actual || batch.earnings.expected
        existing.batches += 1
      } else {
        acc.push({
          id: batch.collectorId,
          name: batch.collectorName,
          weight: batch.actualWeight || batch.expectedWeight,
          earnings: batch.earnings.actual || batch.earnings.expected,
          batches: 1
        })
      }
      return acc
    }, [])
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric'
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights and performance metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-1" />
            Export
          </Button>
          <Button variant="secondary" size="sm">
            <Filter size={16} className="mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Time Filter */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Time Period
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
              All Time
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalWeight.toFixed(1)}kg
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Weight</p>
        </Card>

        <Card className="text-center">
          <Package size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalBatches}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Batches</p>
        </Card>

        <Card className="text-center">
          <DollarSign size={24} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalTokens}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tokens Distributed</p>
        </Card>

        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalUsers}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Performance Charts
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
          >
            <BarChart3 size={16} className="mr-1" />
            {showCharts ? 'Hide' : 'Show'} Charts
          </Button>
        </div>
        
        {showCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight Trend */}
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Weight Collection Trend</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {totalWeight.toFixed(1)}kg collected
                </p>
              </div>
            </div>

            {/* Plastic Types */}
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Recycle size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Plastic Types Distribution</p>
                <div className="mt-2 space-y-1">
                  {Object.entries(plasticByType).map(([type, weight]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span>{type}:</span>
                      <span>{weight.toFixed(1)}kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Click "Show Charts" to view analytics
            </p>
          </div>
        )}
      </Card>

      {/* Top Collectors */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Top Collectors
        </h3>
        
        {topCollectors.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No collector data</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Collector performance will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topCollectors.map((collector, index) => (
              <div key={collector.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {collector.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {collector.batches} batches
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {collector.weight.toFixed(1)}kg
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ₵{collector.earnings}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Environmental Impact */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Environmental Impact
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <Recycle size={24} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalWeight.toFixed(1)}kg
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plastic Recycled</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <Droplets size={24} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {(totalWeight * 2).toFixed(0)}L
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Water Saved</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
            <TreePine size={24} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(totalWeight / 20)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Trees Equivalent</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Activity
        </h3>
        
        {filteredData.batches.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No activity in this period</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Activity will appear here when batches are processed
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.batches.slice(0, 5).map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    <Package size={16} className="text-primary-600 dark:text-primary-400" />
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
                    {(batch.actualWeight || batch.expectedWeight).toFixed(1)}kg
                  </p>
                  <Badge variant="info" size="sm">{batch.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
