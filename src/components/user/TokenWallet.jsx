import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Badge from '../shared/Badge'
import Button from '../shared/Button'
import Input from '../shared/Input'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Search, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock
} from 'lucide-react'

const TokenWallet = () => {
  const { user } = useAuth()
  const { getDepositsByUser, getRedemptionsByUser } = useData()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('all')

  const deposits = getDepositsByUser(user.id)
  const redemptions = getRedemptionsByUser(user.id)

  // Combine all transactions
  const allTransactions = [
    ...deposits.map(deposit => ({
      id: deposit.id,
      type: 'deposit',
      amount: deposit.tokensEarned,
      description: `${deposit.weight}kg ${deposit.plasticType} from ${deposit.collectorName}`,
      timestamp: deposit.timestamp,
      status: deposit.status,
      icon: ArrowUpRight,
      color: 'text-green-600 dark:text-green-400'
    })),
    ...redemptions.map(redemption => ({
      id: redemption.id,
      type: 'redemption',
      amount: -redemption.tokensSpent,
      description: `${redemption.type.replace('_', ' ')} - ${redemption.partner.name}`,
      timestamp: redemption.redeemedAt,
      status: redemption.status,
      icon: ArrowDownLeft,
      color: 'text-red-600 dark:text-red-400'
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = dateRange === 'all' || 
      (dateRange === 'week' && isWithinWeek(transaction.timestamp)) ||
      (dateRange === 'month' && isWithinMonth(transaction.timestamp))
    
    return matchesFilter && matchesSearch && matchesDate
  })

  const isWithinWeek = (timestamp) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(timestamp) > weekAgo
  }

  const isWithinMonth = (timestamp) => {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    return new Date(timestamp) > monthAgo
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" size="xs">Confirmed</Badge>
      case 'pending':
        return <Badge variant="warning" size="xs">Pending</Badge>
      case 'rejected':
        return <Badge variant="error" size="xs">Rejected</Badge>
      case 'active':
        return <Badge variant="info" size="xs">Active</Badge>
      case 'used':
        return <Badge variant="success" size="xs">Used</Badge>
      default:
        return <Badge variant="info" size="xs">{status}</Badge>
    }
  }

  const totalEarned = deposits
    .filter(d => d.status === 'confirmed')
    .reduce((sum, d) => sum + d.tokensEarned, 0)
  
  const totalRedeemed = redemptions
    .filter(r => r.status === 'used')
    .reduce((sum, r) => sum + r.tokensSpent, 0)

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Token Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your tokens and view transaction history
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Current Balance</p>
            <p className="text-4xl font-bold">{user.tokenBalance}</p>
            <p className="text-primary-100 text-sm">
              ≈ ₵{(user.tokenBalance * 0.1).toFixed(2)} in value
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <Wallet size={32} />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {totalEarned}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
              <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Redeemed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {totalRedeemed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Transaction History
            </h3>
            <Button variant="ghost" size="sm">
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'deposit' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('deposit')}
            >
              Deposits
            </Button>
            <Button
              variant={filter === 'redemption' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('redemption')}
            >
              Redemptions
            </Button>
          </div>

          {/* Date Range */}
          <div className="flex space-x-2">
            <Button
              variant={dateRange === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDateRange('all')}
            >
              All Time
            </Button>
            <Button
              variant={dateRange === 'week' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDateRange('week')}
            >
              This Week
            </Button>
            <Button
              variant={dateRange === 'month' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDateRange('month')}
            >
              This Month
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start earning tokens by scanning QR codes!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const Icon = transaction.icon
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.color.includes('green') ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                      <Icon size={16} className={transaction.color} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.timestamp)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                    <div className={`text-right font-semibold ${transaction.color}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default TokenWallet
