import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Badge from '../shared/Badge'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Target,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Zap
} from 'lucide-react'

const RouteOptimizer = () => {
  const { user } = useAuth()
  const { getBatchesByCollector } = useData()
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const batches = getBatchesByCollector(user.id)
  const activeBatches = batches.filter(batch => batch.status === 'pending' || batch.status === 'in_transit')
  
  // Mock route data
  const mockRoute = {
    totalDistance: 12.5,
    totalDuration: 45,
    optimizationScore: 8.5,
    waypoints: [
      {
        id: 'wp1',
        name: 'John Doe',
        address: '123 Main St, Accra',
        coordinates: { lat: 5.6037, lng: -0.1870 },
        weight: 2.5,
        plasticType: 'PET',
        tokens: 25,
        completed: false
      },
      {
        id: 'wp2',
        name: 'Jane Smith',
        address: '456 Oak Ave, Accra',
        coordinates: { lat: 5.6047, lng: -0.1880 },
        weight: 1.8,
        plasticType: 'HDPE',
        tokens: 18,
        completed: false
      },
      {
        id: 'wp3',
        name: 'Bob Johnson',
        address: '789 Pine St, Accra',
        coordinates: { lat: 5.6057, lng: -0.1890 },
        weight: 3.2,
        plasticType: 'Mixed',
        tokens: 32,
        completed: false
      },
      {
        id: 'destination',
        name: 'Central Recycling Hub',
        address: '999 Recycling St, Tema',
        coordinates: { lat: 5.6067, lng: -0.1900 },
        isDestination: true
      }
    ]
  }

  const handleStartNavigation = () => {
    setIsNavigating(true)
    setCurrentStep(0)
  }

  const handleNextStep = () => {
    if (currentStep < mockRoute.waypoints.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsNavigating(false)
    }
  }

  const handleCompleteWaypoint = (waypointId) => {
    // Mock completion
    console.log(`Completed waypoint: ${waypointId}`)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getOptimizationColor = (score) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Route Optimizer
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Optimize your collection route for maximum efficiency
        </p>
      </div>

      {/* Route Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Optimized Route
          </h3>
          <Badge variant="primary" size="sm">
            <Zap size={12} className="mr-1" />
            Optimized
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <Navigation size={24} className="mx-auto mb-2 text-primary-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockRoute.totalDistance}km
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
          </div>
          
          <div className="text-center">
            <Clock size={24} className="mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatDuration(mockRoute.totalDuration)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
          </div>
          
          <div className="text-center">
            <Target size={24} className="mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockRoute.waypoints.filter(wp => !wp.isDestination).length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Stops</p>
          </div>
        </div>

        <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary-800 dark:text-primary-200">
              Optimization Score:
            </span>
            <span className={`text-xl font-bold ${getOptimizationColor(mockRoute.optimizationScore)}`}>
              {mockRoute.optimizationScore}/10
            </span>
          </div>
        </div>
      </Card>

      {/* Navigation Controls */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Navigation
          </h3>
          {isNavigating && (
            <Badge variant="info" size="sm">
              <Navigation size={12} className="mr-1" />
              Active
            </Badge>
          )}
        </div>
        
        {!isNavigating ? (
          <div className="text-center py-8">
            <Navigation size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start navigation to begin your optimized route
            </p>
            <Button onClick={handleStartNavigation} className="w-full">
              <Play size={16} className="mr-2" />
              Start Navigation
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Step */}
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-primary-800 dark:text-primary-200">
                  Current Stop: {currentStep + 1} of {mockRoute.waypoints.length}
                </span>
                <span className="text-sm text-primary-600 dark:text-primary-400">
                  {Math.round(((currentStep + 1) / mockRoute.waypoints.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-primary-200 dark:bg-primary-700 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / mockRoute.waypoints.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Waypoint */}
            {mockRoute.waypoints[currentStep] && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {mockRoute.waypoints[currentStep].name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mockRoute.waypoints[currentStep].address}
                    </p>
                    {!mockRoute.waypoints[currentStep].isDestination && (
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          Weight: {mockRoute.waypoints[currentStep].weight}kg
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Type: {mockRoute.waypoints[currentStep].plasticType}
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          Tokens: {mockRoute.waypoints[currentStep].tokens}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex space-x-2">
              <Button variant="secondary" className="flex-1">
                <Pause size={16} className="mr-2" />
                Pause
              </Button>
              <Button 
                onClick={handleNextStep}
                className="flex-1"
              >
                <CheckCircle size={16} className="mr-2" />
                {currentStep === mockRoute.waypoints.length - 1 ? 'Complete Route' : 'Next Stop'}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Route Waypoints */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Route Details
        </h3>
        
        <div className="space-y-3">
          {mockRoute.waypoints.map((waypoint, index) => (
            <div 
              key={waypoint.id}
              className={`p-3 rounded-lg border ${
                index === currentStep 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : index === currentStep
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {index < currentStep ? <CheckCircle size={16} /> : index + 1}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {waypoint.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {waypoint.address}
                  </p>
                  {!waypoint.isDestination && (
                    <div className="mt-1 flex space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{waypoint.weight}kg {waypoint.plasticType}</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        {waypoint.tokens} tokens
                      </span>
                    </div>
                  )}
                </div>
                
                {index === currentStep && (
                  <Badge variant="info" size="sm">
                    Current
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Route Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Route Statistics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockRoute.waypoints.filter(wp => !wp.isDestination).reduce((sum, wp) => sum + wp.weight, 0)}kg
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Weight</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockRoute.waypoints.filter(wp => !wp.isDestination).reduce((sum, wp) => sum + wp.tokens, 0)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RouteOptimizer
