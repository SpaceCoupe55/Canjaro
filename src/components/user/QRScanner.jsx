import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import LoadingSpinner from '../shared/LoadingSpinner'
import { 
  QrCode, 
  Camera, 
  Flashlight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

const QRScanner = () => {
  const { user } = useAuth()
  const { createDeposit, addNotification } = useData()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [scanError, setScanError] = useState(null)

  // Mock QR codes for simulation
  const mockQRCodes = [
    {
      id: 'qr_001',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      weight: 2.5,
      plasticType: 'PET',
      tokenRate: 10,
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      }
    },
    {
      id: 'qr_002',
      collectorId: 'col789',
      collectorName: 'Bob Johnson',
      weight: 1.8,
      plasticType: 'HDPE',
      tokenRate: 10,
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      }
    },
    {
      id: 'qr_003',
      collectorId: 'col456',
      collectorName: 'Jane Smith',
      weight: 3.2,
      plasticType: 'Mixed',
      tokenRate: 10,
      location: {
        lat: 5.6037,
        lng: -0.1870,
        address: 'Accra, Ghana'
      }
    }
  ]

  const startScanning = () => {
    setIsScanning(true)
    setScanError(null)
    setScanResult(null)
  }

  const stopScanning = () => {
    setIsScanning(false)
  }

  const simulateScan = () => {
    // Simulate scanning delay
    setTimeout(() => {
      const randomQR = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)]
      setScanResult(randomQR)
      setIsScanning(false)
      setShowResult(true)
    }, 2000)
  }

  const handleScanSuccess = async (qrData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const depositData = {
        userId: user.id,
        userName: user.name,
        collectorId: qrData.collectorId,
        collectorName: qrData.collectorName,
        weight: qrData.weight,
        plasticType: qrData.plasticType,
        tokensEarned: qrData.weight * qrData.tokenRate,
        tokenRate: qrData.tokenRate,
        qrCode: qrData.id,
        location: qrData.location,
        photos: [],
        notes: `Scanned from ${qrData.collectorName}`
      }
      
      const result = await createDeposit(depositData)
      
      if (result.success) {
        addNotification({
          userId: user.id,
          type: 'deposit_created',
          title: 'Deposit Created',
          message: `You've earned ${depositData.tokensEarned} tokens for ${depositData.weight}kg of ${depositData.plasticType}!`
        })
        
        // Auto-confirm after 3 seconds for demo
        setTimeout(() => {
          addNotification({
            userId: user.id,
            type: 'deposit_confirmed',
            title: 'Deposit Confirmed',
            message: `Your deposit has been confirmed! ${depositData.tokensEarned} tokens added to your balance.`
          })
        }, 3000)
      }
      
      setShowResult(false)
      setScanResult(null)
    } catch (error) {
      setScanError('Failed to process deposit. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScanError = () => {
    setScanError('Invalid QR code. Please try scanning again.')
    setIsScanning(false)
  }

  const retryScan = () => {
    setScanError(null)
    setScanResult(null)
    setShowResult(false)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Scan QR Code
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Scan a collector's QR code to earn tokens
        </p>
      </div>

      {/* Scanner Interface */}
      <Card className="relative overflow-hidden">
        {!isScanning ? (
          <div className="text-center py-12">
            <div className="bg-primary-100 dark:bg-primary-900 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <QrCode size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ready to Scan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Position the QR code within the camera viewfinder
            </p>
            <Button onClick={startScanning} className="w-full">
              <Camera size={20} className="mr-2" />
              Start Camera
            </Button>
          </div>
        ) : (
          <div className="relative">
            {/* Mock Camera View */}
            <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                {/* Mock camera feed pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`${i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'} animate-pulse`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Viewfinder overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary-500 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary-500 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary-500 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary-500 rounded-br-lg"></div>
                  </div>
                </div>
                
                {/* Scanning line animation */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary-500 animate-pulse"></div>
              </div>
              
              {/* Camera controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <button
                  onClick={() => setFlashlightOn(!flashlightOn)}
                  className={`p-3 rounded-full ${
                    flashlightOn 
                      ? 'bg-yellow-400 text-yellow-900' 
                      : 'bg-white bg-opacity-20 text-white'
                  }`}
                >
                  <Flashlight size={20} />
                </button>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleScanError}
                    className="p-3 bg-red-500 bg-opacity-20 text-white rounded-full"
                  >
                    <XCircle size={20} />
                  </button>
                  
                  <button
                    onClick={simulateScan}
                    className="p-3 bg-primary-500 text-white rounded-full"
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Position QR code within the frame
              </p>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={stopScanning}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Error State */}
      {scanError && (
        <Card className="border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900">
          <div className="flex items-center space-x-3">
            <XCircle size={24} className="text-red-600 dark:text-red-400" />
            <div className="flex-1">
              <p className="font-medium text-red-800 dark:text-red-200">Scan Failed</p>
              <p className="text-sm text-red-600 dark:text-red-400">{scanError}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={retryScan}>
              <RotateCcw size={16} className="mr-1" />
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          How to Scan
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>1. Ask the collector to show their QR code</p>
          <p>2. Position your camera over the QR code</p>
          <p>3. Wait for the scan to complete automatically</p>
          <p>4. Your tokens will be added after verification</p>
        </div>
      </Card>

      {/* Scan Result Modal */}
      <Modal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Scan Result"
        size="md"
      >
        {scanResult && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                QR Code Scanned Successfully!
              </h3>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Collector</p>
                  <p className="font-medium">{scanResult.collectorName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="font-medium">{scanResult.weight}kg</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Plastic Type</p>
                  <p className="font-medium">{scanResult.plasticType}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Tokens Earned</p>
                  <p className="font-medium text-primary-600 dark:text-primary-400">
                    +{scanResult.weight * scanResult.tokenRate}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowResult(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleScanSuccess(scanResult)}
                loading={isLoading}
                className="flex-1"
              >
                Confirm Deposit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default QRScanner
