import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Download,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  Zap,
  Crown,
  Shield,
  Loader2,
  Edit,
  Tag
} from 'lucide-react'
import { 
  getSubscriptionPlans, 
  createSubscriptionPlan, 
  updateSubscriptionPlan, 
  deleteSubscriptionPlan,
  toggleSubscriptionStatus 
} from '../../api/api'
import AddSubscriptionModal from './AddSubscriptionModal'
import SubscriptionsTable from './SubscriptionsTable'

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  // Fetch subscription plans on mount
  useEffect(() => {
    fetchSubscriptionPlans()
  }, [])

const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSubscriptionPlans()
      
      // Handle different response structures
      let plans = []
      if (Array.isArray(response)) {
        plans = response
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Handle nested data structure: response.data.data
        plans = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        plans = response.data
      } else if (response.subscriptions && Array.isArray(response.subscriptions)) {
        plans = response.subscriptions
      } else if (response.plans && Array.isArray(response.plans)) {
        plans = response.plans
      }
      
      setSubscriptions(plans)
    } catch (err) {
      console.error('Error fetching subscription plans:', err)
      setError(err.response?.data?.message || 'Failed to load subscription plans')
    } finally {
      setLoading(false)
    }
  }

  console.log('Subscriptions:', subscriptions)

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' ? sub.isActive : !sub.isActive)
    
    const matchesType = selectedType === 'all' || sub.type === selectedType

    return matchesSearch && matchesStatus && matchesType
  })

  const handleAddPlan = () => {
    setEditingPlan(null)
    setIsAddModalOpen(true)
  }

  const handleEditPlan = (plan) => {
    setEditingPlan(plan)
    setIsAddModalOpen(true)
  }

  const handleSavePlan = async (planData) => {
    try {
      setActionLoading(true)

      if (editingPlan) {
        // Update existing plan
        const response = await updateSubscriptionPlan(
          editingPlan._id || editingPlan.id,
          planData
        )
        
        setSubscriptions(prev => prev.map(sub =>
          (sub._id || sub.id) === (editingPlan._id || editingPlan.id)
            ? { ...sub, ...planData }
            : sub
        ))
      } else {
        // Create new plan
        const response = await createSubscriptionPlan(planData)
        const newPlan = response.data || response
        
        setSubscriptions(prev => [...prev, newPlan])
      }

      setIsAddModalOpen(false)
      setEditingPlan(null)
    } catch (err) {
      console.error('Error saving plan:', err)
      alert(err.response?.data?.message || 'Failed to save subscription plan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return
    }

    try {
      setActionLoading(true)
      await deleteSubscriptionPlan(id)
      setSubscriptions(prev => prev.filter(sub => (sub._id || sub.id) !== id))
    } catch (err) {
      console.error('Error deleting plan:', err)
      alert(err.response?.data?.message || 'Failed to delete subscription plan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (plan) => {
    try {
      setActionLoading(true)
      await toggleSubscriptionStatus(plan._id || plan.id)
      
      setSubscriptions(prev => prev.map(sub =>
        (sub._id || sub.id) === (plan._id || plan.id)
          ? { ...sub, isActive: !sub.isActive }
          : sub
      ))
    } catch (err) {
      console.error('Error toggling status:', err)
      alert(err.response?.data?.message || 'Failed to update plan status')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleSelection = (id) => {
    setSelectedSubscriptions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getTotalRevenue = () => {
    return subscriptions
      .filter(sub => sub.isActive)
      .reduce((acc, sub) => {
        const multiplier = sub.type === 'yearly' ? 1 : 12
        return acc + ((sub.price || 0) * multiplier)
      }, 0)
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(subscriptions, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `subscription-plans-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting:', err)
      alert('Failed to export subscription plans')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Manage Subscription Plans</h1>
              <p className="text-white/80 text-lg">Create and manage subscription pricing plans</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-semibold">{subscriptions.length} Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">
                    {subscriptions.filter(s => s.isActive).length} Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">
                    ${getTotalRevenue().toLocaleString()}/year
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button 
                onClick={handleAddPlan}
                disabled={actionLoading}
                className="bg-white text-indigo-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                New Plan
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Data</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchSubscriptionPlans}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading subscription plans...</p>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
              {/* Status Filters */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedStatus === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({subscriptions.length})
                </button>
                <button
                  onClick={() => setSelectedStatus('active')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedStatus === 'active'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active ({subscriptions.filter(s => s.isActive).length})
                </button>
                <button
                  onClick={() => setSelectedStatus('inactive')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    selectedStatus === 'inactive'
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive ({subscriptions.filter(s => !s.isActive).length})
                </button>
              </div>

              {/* Type Filter & Search */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            {filteredSubscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <CreditCard className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No subscription plans found</p>
                <p className="text-gray-400 text-sm mt-1">Create your first plan to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscriptions.map((plan) => (
                  <div
                    key={plan._id || plan.id}
                    className={`relative group rounded-2xl p-6 border-2 transition-all duration-200 ${
                      plan.isActive
                        ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl'
                        : 'border-gray-200 bg-gray-50 opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          plan.isActive ? 'bg-blue-600' : 'bg-gray-400'
                        }`}>
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            plan.type === 'monthly'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {plan.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleStatus(plan)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={plan.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {plan.isActive ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id || plan.id)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500">/{plan.type === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {plan.description}
                    </p>

                    {/* Benefits */}
                    {plan.benefits && plan.benefits.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-gray-700">Benefits:</p>
                        <ul className="space-y-1">
                          {plan.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.benefits.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            +{plan.benefits.length - 3} more benefits
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="pt-4 border-t border-gray-200">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Plan Modal */}
      <AddSubscriptionModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingPlan(null)
        }}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
        loading={actionLoading}
      />
    </div>
  )
}

export default ManageSubscriptions