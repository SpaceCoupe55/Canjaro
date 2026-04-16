import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Badge from '../shared/Badge'
import Modal from '../shared/Modal'
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react'

const ReportingTools = () => {
  const { user } = useAuth()
  const { batches, deposits, users: allUsers } = useData()
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState('')
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    collectorId: '',
    status: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      id: 'daily_summary',
      title: 'Daily Summary',
      description: 'Overview of daily operations and metrics',
      icon: Calendar
    },
    {
      id: 'collector_performance',
      title: 'Collector Performance',
      description: 'Individual collector statistics and rankings',
      icon: Users
    },
    {
      id: 'environmental_impact',
      title: 'Environmental Impact',
      description: 'Environmental benefits and CO2 savings',
      icon: TrendingUp
    },
    {
      id: 'financial_summary',
      title: 'Financial Summary',
      description: 'Payment summaries and financial metrics',
      icon: DollarSign
    },
    {
      id: 'operational_report',
      title: 'Operational Report',
      description: 'Processing times and efficiency metrics',
      icon: Clock
    }
  ]

  const recentReports = [
    {
      id: 'rep001',
      type: 'Daily Summary',
      date: '2024-01-20',
      status: 'completed',
      size: '2.3 MB'
    },
    {
      id: 'rep002',
      type: 'Collector Performance',
      date: '2024-01-19',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 'rep003',
      type: 'Environmental Impact',
      date: '2024-01-18',
      status: 'generating',
      size: '-'
    }
  ]

  const handleGenerateReport = async (reportType) => {
    setIsGenerating(true)
    
    try {
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log(`Generating ${reportType} report with filters:`, reportFilters)
      
      // Simulate successful generation
      setShowReportModal(false)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (reportId) => {
    // Mock download
    console.log(`Downloading report ${reportId}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>
      case 'generating':
        return <Badge variant="warning" size="sm">Generating</Badge>
      case 'failed':
        return <Badge variant="error" size="sm">Failed</Badge>
      default:
        return <Badge variant="info" size="sm">{status}</Badge>
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Reporting Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate and manage operational reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <FileText size={24} className="mx-auto mb-2 text-primary-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {batches.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Batches</p>
        </Card>

        <Card className="text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {allUsers.length}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Users</p>
        </Card>

        <Card className="text-center">
          <BarChart3 size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {deposits.reduce((sum, d) => sum + d.weight, 0).toFixed(1)}kg
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Weight</p>
        </Card>

        <Card className="text-center">
          <DollarSign size={24} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ₵{batches.filter(b => b.status === 'settled').reduce((sum, b) => sum + b.earnings.actual, 0)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Paid</p>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Generate Report
          </h3>
          <Button onClick={() => setShowReportModal(true)}>
            <FileText size={16} className="mr-2" />
            New Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <div
                key={report.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedReportType(report.id)
                  setShowReportModal(true)
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                    <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Reports */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Reports
          </h3>
          <Button variant="secondary" size="sm">
            <Download size={16} className="mr-1" />
            Download All
          </Button>
        </div>
        
        {recentReports.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No reports generated yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Generate your first report to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    <FileText size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {report.type}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generated {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(report.status)}
                  {report.status === 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download size={16} className="mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Report Generation Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Generate Report"
        size="lg"
      >
        <div className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="input-field"
            >
              <option value="">Select report type</option>
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.title}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={reportFilters.startDate}
              onChange={(e) => setReportFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={reportFilters.endDate}
              onChange={(e) => setReportFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Collector
              </label>
              <select
                value={reportFilters.collectorId}
                onChange={(e) => setReportFilters(prev => ({ ...prev, collectorId: e.target.value }))}
                className="input-field"
              >
                <option value="">All collectors</option>
                <option value="col456">Jane Smith</option>
                <option value="col789">Bob Johnson</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={reportFilters.status}
                onChange={(e) => setReportFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input-field"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="settled">Settled</option>
              </select>
            </div>
          </div>

          {/* Report Preview */}
          {selectedReportType && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Report Preview
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reportTypes.find(r => r.id === selectedReportType)?.description}
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Filters: {reportFilters.startDate && `From ${reportFilters.startDate}`} 
                {reportFilters.endDate && ` to ${reportFilters.endDate}`}
                {reportFilters.collectorId && ` • Collector: ${reportFilters.collectorId}`}
                {reportFilters.status && ` • Status: ${reportFilters.status}`}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowReportModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerateReport(selectedReportType)}
              loading={isGenerating}
              disabled={!selectedReportType}
              className="flex-1"
            >
              <FileText size={16} className="mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ReportingTools
