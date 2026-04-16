import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'
import { 
  Package, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Truck,
  DollarSign,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react'

const BatchManager = () => {
  const { user } = useAuth()
  const { getBatchesByCollector, createBatch, updateBatch, addNotification } = useData()
  const [showCreateBatch, setShowCreateBatch] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const batches = getBatchesByCollector(user.id)
  const activeBatches = batches.filter(batch => batch.status === 'pending' || batch.status === 'in_transit')
  const completedBatches = batches.filter(batch => batch.status === 'verified' || batch.status === 'settled')

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

  const handleCreateBatch = async () => {
    setIsProcessing(true)
    
    try {
      const batchData = {
        collectorId: user.id,
        collectorName: user.name,
        deposits: [],
        totalDeposits: 0,
        expectedWeight: 0,
        actualWeight: 0,
        weightDiscrepancy: 0,
        status: 'pending',
        earnings: {
          expected: 0,
          actual: 0,
          paid: false
        },
        route: {
          distance: 0,
          duration: 0,
          optimizationScore: 0
        }
      }
      
      const result = await createBatch(batchData)
      
      if (result.success) {
        addNotification({
          userId: user.id,
          type: 'batch_created',
          title: 'New Batch Created',
          message: `Batch #${result.batch.id.slice(-6)} is ready for deposits`
        })
        setShowCreateBatch(false)
      }
    } catch (error) {
      console.error('Failed to create batch:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseBatch = async (batchId) => {
    setIsProcessing(true)
    
    try {
      await updateBatch(batchId, { 
        status: 'in_transit',
        deliveredAt: new Date().toISOString()
      })
      
      addNotification({
        userId: user.id,
        type: 'batch_closed',
        title: 'Batch Ready for Delivery',
        message: 'Your batch is ready for delivery to the collection point'
      })
    } catch (error) {
      console.error('Failed to close batch:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getBatchProgress = (batch) => {
    if (batch.status === 'pending') return 25
    if (batch.status === 'in_transit') return 50
    if (batch.status === 'verified') return 75
    if (batch.status === 'settled') return 100
    return 0
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Batch Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your collection batches
          </p>
        </div>
        <Button onClick={() => setShowCreateBatch(true)}>
          <Plus size={16} className="mr-2" />
          New Batch
        </Button>
      </div>

      {/* Stats Cards */}
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
          <DollarSign size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₵{batches.filter(b => b.status === 'settled').reduce((sum, b) => sum + b.earnings.actual, 0)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Earned</p>
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
              Create a new batch to start collecting
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBatches.map((batch) => (
              <div key={batch.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                      <Package size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Batch #{batch.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created {formatDate(batch.createdAt)}
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
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{getBatchProgress(batch)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getBatchProgress(batch)}%` }}
                    />
                  </div>
                </div>
                
                {/* Batch Details */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <Users size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.totalDeposits}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deposits</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.expectedWeight}kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Weight</p>
                  </div>
                  <div className="text-center">
                    <Clock size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.route.duration}m</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    View Details
                  </Button>
                  {batch.status === 'pending' && batch.totalDeposits > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleCloseBatch(batch.id)}
                      loading={isProcessing}
                    >
                      <Truck size={16} className="mr-1" />
                      Close Batch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Batches */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Batches
        </h3>
        
        {batches.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No batches yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create your first batch to start collecting
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

      {/* Create Batch Modal */}
      <Modal
        isOpen={showCreateBatch}
        onClose={() => setShowCreateBatch(false)}
        title="Create New Batch"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Create a new batch to start collecting plastic deposits. You can add deposits to this batch as you collect them.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Once you close a batch, it will be ready for delivery to the collection point.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCreateBatch(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBatch}
              loading={isProcessing}
              className="flex-1"
            >
              <Plus size={16} className="mr-2" />
              Create Batch
            </Button>
          </div>
        </div>
      </Modal>

      {/* Batch Details Modal */}
      <Modal
        isOpen={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        title={selectedBatch ? `Batch #${selectedBatch.id.slice(-6)}` : ''}
        size="lg"
      >
        {selectedBatch && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Users size={24} className="mx-auto mb-2 text-primary-600" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedBatch.totalDeposits}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Deposits</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <BarChart3 size={24} className="mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedBatch.expectedWeight}kg
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Weight</p>
              </div>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary-800 dark:text-primary-200">
                  Expected Earnings:
                </span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ₵{selectedBatch.earnings.expected}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedBatch(null)}
                className="flex-1"
              >
                Close
              </Button>
              {selectedBatch.status === 'pending' && selectedBatch.totalDeposits > 0 && (
                <Button
                  onClick={() => {
                    handleCloseBatch(selectedBatch.id)
                    setSelectedBatch(null)
                  }}
                  loading={isProcessing}
                  className="flex-1"
                >
                  Close Batch
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BatchManager
