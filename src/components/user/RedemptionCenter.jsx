import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import Badge from '../shared/Badge'
import { 
  Gift, 
  Store, 
  DollarSign, 
  Heart, 
  QrCode,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  Calendar
} from 'lucide-react'

const RedemptionCenter = () => {
  const { user } = useAuth()
  const { createRedemption, addNotification } = useData()
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [tokensToRedeem, setTokensToRedeem] = useState(50)
  const [showRedemptionModal, setShowRedemptionModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const partners = [
    {
      id: 'partner001',
      name: 'GreenMart Supermarket',
      logo: '🛒',
      category: 'Retail',
      description: 'Leading supermarket chain with eco-friendly products',
      locations: ['Accra', 'Tema', 'Kumasi'],
      redemptionRate: 10, // 10 tokens = 1% discount
      minTokens: 50,
      maxTokens: 500,
      rating: 4.8,
      popular: true
    },
    {
      id: 'partner002',
      name: 'EcoStore',
      logo: '🌱',
      category: 'Retail',
      description: 'Specialty store for sustainable products',
      locations: ['Accra', 'Labone'],
      redemptionRate: 1, // 1 token = 1 GHS
      minTokens: 10,
      maxTokens: 200,
      rating: 4.6,
      popular: false
    },
    {
      id: 'partner003',
      name: 'PlantTrees Charity',
      logo: '🌳',
      category: 'Charity',
      description: 'Environmental conservation organization',
      locations: ['Nationwide'],
      redemptionRate: 5, // 5 tokens = 1 tree planted
      minTokens: 25,
      maxTokens: 1000,
      rating: 4.9,
      popular: true
    },
    {
      id: 'partner004',
      name: 'Mobile Money Cash',
      logo: '💰',
      category: 'Financial',
      description: 'Direct cash withdrawal via mobile money',
      locations: ['Nationwide'],
      redemptionRate: 1, // 1 token = 1 GHS
      minTokens: 100,
      maxTokens: 1000,
      rating: 4.7,
      popular: false
    }
  ]

  const activeRedemptions = [
    {
      id: 'red123',
      partner: 'GreenMart Supermarket',
      tokensSpent: 50,
      voucherCode: 'VOUCHER123456',
      status: 'active',
      expiresAt: '2024-02-20T00:00:00Z',
      redeemedAt: '2024-01-20T12:00:00Z'
    },
    {
      id: 'red124',
      partner: 'PlantTrees Charity',
      tokensSpent: 100,
      voucherCode: 'TREE789012',
      status: 'active',
      expiresAt: '2024-02-15T00:00:00Z',
      redeemedAt: '2024-01-15T10:30:00Z'
    }
  ]

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner)
    setTokensToRedeem(Math.min(partner.minTokens, user.tokenBalance))
    setShowRedemptionModal(true)
  }

  const handleRedemption = async () => {
    if (!selectedPartner || tokensToRedeem < selectedPartner.minTokens) return
    
    setIsProcessing(true)
    
    try {
      const redemptionData = {
        userId: user.id,
        type: selectedPartner.category === 'Charity' ? 'donation' : 
              selectedPartner.category === 'Financial' ? 'cash_withdrawal' : 'store_discount',
        tokensSpent: tokensToRedeem,
        cashValue: tokensToRedeem * selectedPartner.redemptionRate,
        partner: {
          id: selectedPartner.id,
          name: selectedPartner.name,
          logo: selectedPartner.logo,
          category: selectedPartner.category
        }
      }
      
      const result = await createRedemption(redemptionData)
      
      if (result.success) {
        addNotification({
          userId: user.id,
          type: 'tokens_redeemed',
          title: 'Tokens Redeemed!',
          message: `You've successfully redeemed ${tokensToRedeem} tokens for ${selectedPartner.name}.`
        })
        
        setShowRedemptionModal(false)
        setSelectedPartner(null)
      }
    } catch (error) {
      console.error('Redemption failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiresAt) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffTime = expiry - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Redemption Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Redeem your tokens for rewards and discounts
        </p>
      </div>

      {/* Token Balance */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Available Tokens</p>
            <p className="text-3xl font-bold">{user.tokenBalance}</p>
            <p className="text-primary-100 text-sm">
              ≈ ₵{(user.tokenBalance * 0.1).toFixed(2)} in value
            </p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Gift size={32} />
          </div>
        </div>
      </Card>

      {/* Active Vouchers */}
      {activeRedemptions.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Active Vouchers
            </h3>
            <Badge variant="info" size="sm">{activeRedemptions.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {activeRedemptions.map((redemption) => {
              const daysLeft = getDaysUntilExpiry(redemption.expiresAt)
              return (
                <div key={redemption.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {redemption.partner}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Code: {redemption.voucherCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" size="sm">Active</Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expires soon'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Partner Options */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Redeem With Partners
        </h3>
        
        <div className="grid gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer"
              onClick={() => handlePartnerSelect(partner)}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{partner.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {partner.name}
                    </h4>
                    {partner.popular && (
                      <Badge variant="primary" size="xs">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {partner.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {partner.rating}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {partner.locations.length} locations
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {partner.redemptionRate === 1 ? '1:1' : `${partner.redemptionRate}:1`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {partner.minTokens}-{partner.maxTokens} tokens
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Redemption Modal */}
      <Modal
        isOpen={showRedemptionModal}
        onClose={() => setShowRedemptionModal(false)}
        title="Redeem Tokens"
        size="md"
      >
        {selectedPartner && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{selectedPartner.logo}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {selectedPartner.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPartner.description}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tokens to Redeem:</span>
                  <span className="font-medium">{tokensToRedeem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                  <span className="font-medium">{selectedPartner.redemptionRate === 1 ? '1:1' : `${selectedPartner.redemptionRate}:1`}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>You'll receive:</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {selectedPartner.category === 'Charity' 
                      ? `${Math.floor(tokensToRedeem / selectedPartner.redemptionRate)} tree${Math.floor(tokensToRedeem / selectedPartner.redemptionRate) !== 1 ? 's' : ''} planted`
                      : `₵${(tokensToRedeem * selectedPartner.redemptionRate).toFixed(2)}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Token Slider */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount: {tokensToRedeem} tokens
              </label>
              <input
                type="range"
                min={selectedPartner.minTokens}
                max={Math.min(selectedPartner.maxTokens, user.tokenBalance)}
                value={tokensToRedeem}
                onChange={(e) => setTokensToRedeem(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{selectedPartner.minTokens}</span>
                <span>{Math.min(selectedPartner.maxTokens, user.tokenBalance)}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowRedemptionModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRedemption}
                loading={isProcessing}
                disabled={tokensToRedeem < selectedPartner.minTokens || tokensToRedeem > user.tokenBalance}
                className="flex-1"
              >
                <Gift size={16} className="mr-2" />
                Redeem Now
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RedemptionCenter
