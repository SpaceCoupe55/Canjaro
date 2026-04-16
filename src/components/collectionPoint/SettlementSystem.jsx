import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'
import { 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp
} from 'lucide-react'

const SettlementSystem = () => {
  const { user } = useAuth()
  const { batches, updateBatch, addNotification } = useData()
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    method: 'mobile_money',
    transactionId: '',
    notes: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const verifiedBatches = batches.filter(batch => batch.status === 'verified')
  const settledBatches = batches.filter(batch => batch.status === 'settled')
  
  const totalPending = verifiedBatches.reduce((sum, batch) => sum + batch.earnings.actual, 0)
  const totalSettled = settledBatches.reduce((sum, batch) => sum + batch.earnings.actual, 0)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="info" size="sm">Verified</Badge>
      case 'settled':
        return <Badge variant="success" size="sm">Settled</Badge>
      default:
        return <Badge variant="info" size="sm">{status}</Badge>
    }
  }

  const handleSettleBatch = (batch) => {
    setSelectedBatch(batch)
    setPaymentData({
      method: 'mobile_money',
      transactionId: '',
      notes: ''
    })
    setShowPaymentModal(true)
  }

  const handleSubmitPayment = async () => {
    if (!selectedBatch) return
    
    setIsProcessing(true)
    
    try {
      await updateBatch(selectedBatch.id, {
        status: 'settled',
        settledAt: new Date().toISOString(),
        paymentMethod: paymentData.method,
        paymentTransactionId: paymentData.transactionId,
        paymentNotes: paymentData.notes
      })
      
      addNotification({
        userId: selectedBatch.collectorId,
        type: 'payment_received',
        title: 'Payment Received',
        message: `Your payment of ₵${selectedBatch.earnings.actual} has been processed for batch #${selectedBatch.id.slice(-6)}.`
      })
      
      setShowPaymentModal(false)
      setSelectedBatch(null)
    } catch (error) {
      console.error('Failed to process payment:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const paymentMethods = [
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
    { value: 'cash', label: 'Cash', icon: Banknote }
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Settlement System
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Process payments to collectors
        </p>
      </div>

      {/* Payment Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold">₵{totalPending}</p>
            </div>
            <Clock size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Settled</p>
              <p className="text-3xl font-bold">₵{totalSettled}</p>
            </div>
            <CheckCircle size={32} />
          </div>
        </Card>
      </div>

      {/* Pending Settlements */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pending Settlements
          </h3>
          <Badge variant="warning" size="sm">{verifiedBatches.length}</Badge>
        </div>
        
        {verifiedBatches.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No pending settlements</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              All verified batches have been settled
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifiedBatches.map((batch) => (
              <div key={batch.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <DollarSign size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Batch #{batch.id.slice(-6)} - {batch.collectorName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Verified {formatDate(batch.verifiedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ₵{batch.earnings.actual}
                    </p>
                    {getStatusBadge(batch.status)}
                  </div>
                </div>
                
                {/* Batch Details */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div className="text-center">
                    <Users size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.totalDeposits}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deposits</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.actualWeight}kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                  </div>
                  <div className="text-center">
                    <Clock size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{Math.abs(batch.weightDiscrepancy).toFixed(1)}kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Discrepancy</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleSettleBatch(batch)}
                  >
                    <DollarSign size={16} className="mr-1" />
                    Process Payment
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Settlements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Settlements
        </h3>
        
        {settledBatches.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No settlements yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Settled payments will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {settledBatches.slice(0, 5).map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Batch #{batch.id.slice(-6)} - {batch.collectorName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Settled {formatDate(batch.settledAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    ₵{batch.earnings.actual}
                  </p>
                  {getStatusBadge(batch.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Process Payment"
        size="md"
      >
        {selectedBatch && (
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Payment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Collector:</span>
                  <span className="font-medium">{selectedBatch.collectorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Batch ID:</span>
                  <span className="font-medium">#{selectedBatch.id.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-bold text-lg">₵{selectedBatch.earnings.actual}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.value}
                      onClick={() => setPaymentData(prev => ({ ...prev, method: method.value }))}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        paymentData.method === method.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon size={20} className="mx-auto mb-1" />
                      <p className="text-xs font-medium">{method.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Transaction ID */}
            <Input
              label="Transaction ID"
              value={paymentData.transactionId}
              onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
              placeholder="Enter transaction reference"
              required
            />

            {/* Notes */}
            <Input
              label="Notes (Optional)"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any payment notes"
            />

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPayment}
                loading={isProcessing}
                className="flex-1"
              >
                <DollarSign size={16} className="mr-2" />
                Process Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SettlementSystem
