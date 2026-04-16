import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'
import { 
  Package, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'

const BatchVerification = () => {
  const { user } = useAuth()
  const { batches, updateBatch, addNotification } = useData()
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationData, setVerificationData] = useState({
    actualWeight: '',
    qualityRating: 'good',
    notes: '',
    adjustment: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingBatches = batches.filter(batch => batch.status === 'in_transit')
  const verifiedBatches = batches.filter(batch => batch.status === 'verified' || batch.status === 'settled')

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

  const handleVerifyBatch = (batch) => {
    setSelectedBatch(batch)
    setVerificationData({
      actualWeight: batch.expectedWeight.toString(),
      qualityRating: 'good',
      notes: '',
      adjustment: 0
    })
    setShowVerificationModal(true)
  }

  const handleSubmitVerification = async () => {
    if (!selectedBatch) return
    
    setIsProcessing(true)
    
    try {
      const actualWeight = parseFloat(verificationData.actualWeight)
      const expectedWeight = selectedBatch.expectedWeight
      const weightDiscrepancy = actualWeight - expectedWeight
      const adjustmentPercentage = (weightDiscrepancy / expectedWeight) * 100
      
      const adjustedEarnings = Math.max(0, selectedBatch.earnings.expected + (weightDiscrepancy * 10))
      
      await updateBatch(selectedBatch.id, {
        status: 'verified',
        actualWeight,
        weightDiscrepancy,
        verifiedAt: new Date().toISOString(),
        earnings: {
          ...selectedBatch.earnings,
          actual: adjustedEarnings
        },
        qualityRating: verificationData.qualityRating,
        verificationNotes: verificationData.notes
      })
      
      addNotification({
        userId: selectedBatch.collectorId,
        type: 'batch_verified',
        title: 'Batch Verified',
        message: `Your batch #${selectedBatch.id.slice(-6)} has been verified. Payment of ₵${adjustedEarnings} is being processed.`
      })
      
      setShowVerificationModal(false)
      setSelectedBatch(null)
    } catch (error) {
      console.error('Failed to verify batch:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectBatch = async (batchId) => {
    if (!confirm('Are you sure you want to reject this batch?')) return
    
    setIsProcessing(true)
    
    try {
      await updateBatch(batchId, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: 'Quality issues or weight discrepancy'
      })
      
      addNotification({
        userId: batches.find(b => b.id === batchId)?.collectorId,
        type: 'batch_rejected',
        title: 'Batch Rejected',
        message: 'Your batch has been rejected due to quality issues.'
      })
    } catch (error) {
      console.error('Failed to reject batch:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getWeightDiscrepancyColor = (discrepancy) => {
    if (Math.abs(discrepancy) <= 0.1) return 'text-green-600 dark:text-green-400'
    if (Math.abs(discrepancy) <= 0.5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Batch Verification
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Verify and process incoming batches
        </p>
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
          <div className="space-y-4">
            {pendingBatches.map((batch) => (
              <div key={batch.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                      <Package size={16} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        Batch #{batch.id.slice(-6)} - {batch.collectorName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Delivered {formatDate(batch.deliveredAt)}
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
                
                {/* Batch Details */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div className="text-center">
                    <Users size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.totalDeposits}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deposits</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.expectedWeight}kg</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Expected</p>
                  </div>
                  <div className="text-center">
                    <Clock size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="font-medium">{batch.route.duration}m</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleVerifyBatch(batch)}
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Verify
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    <BarChart3 size={16} className="mr-1" />
                    Details
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectBatch(batch.id)}
                    loading={isProcessing}
                  >
                    <XCircle size={16} className="mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Verifications */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Verifications
        </h3>
        
        {verifiedBatches.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No verifications yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Verified batches will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {verifiedBatches.slice(0, 5).map((batch) => (
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
                      {formatDate(batch.verifiedAt)}
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
            ))}
          </div>
        )}
      </Card>

      {/* Verification Modal */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        title="Verify Batch"
        size="lg"
      >
        {selectedBatch && (
          <div className="space-y-6">
            {/* Batch Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Batch #{selectedBatch.id.slice(-6)} - {selectedBatch.collectorName}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Expected Weight:</p>
                  <p className="font-medium">{selectedBatch.expectedWeight}kg</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Expected Earnings:</p>
                  <p className="font-medium">₵{selectedBatch.earnings.expected}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Deposits:</p>
                  <p className="font-medium">{selectedBatch.totalDeposits}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Route Distance:</p>
                  <p className="font-medium">{selectedBatch.route.distance}km</p>
                </div>
              </div>
            </div>

            {/* Verification Form */}
            <div className="space-y-4">
              <Input
                label="Actual Weight (kg)"
                type="number"
                step="0.1"
                value={verificationData.actualWeight}
                onChange={(e) => setVerificationData(prev => ({ ...prev, actualWeight: e.target.value }))}
                placeholder="Enter actual weight measured"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality Rating
                </label>
                <select
                  value={verificationData.qualityRating}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, qualityRating: e.target.value }))}
                  className="input-field"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              
              <Input
                label="Notes (Optional)"
                value={verificationData.notes}
                onChange={(e) => setVerificationData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any verification notes"
              />
            </div>

            {/* Weight Discrepancy */}
            {verificationData.actualWeight && (
              <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-800 dark:text-primary-200">
                    Weight Discrepancy:
                  </span>
                  <span className={`font-bold ${getWeightDiscrepancyColor(
                    parseFloat(verificationData.actualWeight) - selectedBatch.expectedWeight
                  )}`}>
                    {((parseFloat(verificationData.actualWeight) - selectedBatch.expectedWeight) / selectedBatch.expectedWeight * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  Adjusted earnings: ₵{Math.max(0, selectedBatch.earnings.expected + 
                    ((parseFloat(verificationData.actualWeight) - selectedBatch.expectedWeight) * 10))}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowVerificationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitVerification}
                loading={isProcessing}
                className="flex-1"
              >
                <CheckCircle size={16} className="mr-2" />
                Verify Batch
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default BatchVerification
