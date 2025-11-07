import { useState, useEffect } from 'react'
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  DollarSign,
  Calendar,
  Zap,
  Shield,
  Crown,
  TrendingUp,
  Download,
  Eye,
  Star
} from 'lucide-react'

// API Functions (Replace with your actual API endpoints)
const api = {
  getSubscriptions: async (params) => {
    // Replace with your actual API call
    // return await fetch('/api/subscriptions', { params })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: 1,
              name: "Basic Plan",
              description: "Perfect for getting started",
              price: 49,
              type: "monthly",
              benefits: ["5 downloads per month", "Basic analytics", "Email support"],
              limitations: ["Limited features", "1 user only"],
              isActive: true,
              createdAt: "2024-01-15",
              subscribers: 145
            },
            {
              id: 2,
              name: "Pro Plan",
              description: "Most popular for growing businesses",
              price: 199,
              type: "monthly",
              benefits: ["Unlimited downloads", "Full analytics dashboard", "Dedicated support", "Priority updates"],
              limitations: ["Limited team members (max 5)"],
              isActive: true,
              createdAt: "2024-01-20",
              subscribers: 567
            },
            {
              id: 3,
              name: "Enterprise Plan",
              description: "For large organizations",
              price: 499,
              type: "monthly",
              benefits: ["Everything in Pro", "Unlimited team members", "Custom integrations", "24/7 support", "SLA guarantee"],
              limitations: [],
              isActive: true,
              createdAt: "2024-02-01",
              subscribers: 89
            },
            {
              id: 4,
              name: "Annual Basic",
              description: "Basic plan billed annually",
              price: 490,
              type: "annual",
              benefits: ["5 downloads per month", "Basic analytics", "Email support", "2 months free"],
              limitations: ["Limited features", "1 user only"],
              isActive: true,
              createdAt: "2024-02-10",
              subscribers: 234
            }
          ]
        })
      }, 500)
    })
  },
  
  createSubscription: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            subscribers: 0
          }
        })
      }, 1000)
    })
  },
  
  updateSubscription: async (id, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { id, ...data } })
      }, 1000)
    })
  },
  
  deleteSubscription: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 800)
    })
  }
}

// Subscription Modal Component
const SubscriptionModal = ({ isOpen, onClose, onSave, subscription, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'monthly',
    benefits: [''],
    limitations: [''],
    isActive: true
  })

  useEffect(() => {
    if (subscription) {
      setFormData({
        ...subscription,
        benefits: subscription.benefits.length > 0 ? subscription.benefits : [''],
        limitations: subscription.limitations.length > 0 ? subscription.limitations : ['']
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        type: 'monthly',
        benefits: [''],
        limitations: [''],
        isActive: true
      })
    }
  }, [subscription, isOpen])

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price) {
      alert('Please fill in all required fields')
      return
    }
    
    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price),
      benefits: formData.benefits.filter(b => b.trim() !== ''),
      limitations: formData.limitations.filter(l => l.trim() !== '')
    }
    
    onSave(cleanedData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 transition-opacity bg-black/60"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl z-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {subscription ? 'Edit' : 'Create'} Subscription Plan
                  </h3>
                  <p className="text-white/80">
                    {subscription ? 'Update plan details' : 'Add a new subscription plan'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Pro Plan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="199"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Billing Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description of the plan"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
                Benefits
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Unlimited downloads"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      disabled={loading}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                disabled={loading}
                className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Benefit
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                <XCircle className="inline h-4 w-4 mr-2 text-orange-600" />
                Limitations (Optional)
              </label>
              {formData.limitations.map((limitation, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={limitation}
                    onChange={(e) => handleArrayChange('limitations', index, e.target.value)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Limited team members"
                  />
                  {formData.limitations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('limitations', index)}
                      disabled={loading}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('limitations')}
                disabled={loading}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Limitation
              </button>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={loading}
                className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="text-sm font-semibold text-gray-900">
                Active (visible to customers)
              </label>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    {subscription ? 'Update' : 'Create'} Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Subscription Management Component
const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, searchTerm, typeFilter, statusFilter])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getSubscriptions()
      setSubscriptions(response.data || [])
    } catch (err) {
      console.error('Error fetching subscriptions:', err)
      setError('Failed to load subscription plans')
    } finally {
      setLoading(false)
    }
  }

  const filterSubscriptions = () => {
    let filtered = subscriptions

    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub =>
        statusFilter === 'active' ? sub.isActive : !sub.isActive
      )
    }

    setFilteredSubscriptions(filtered)
  }

  const handleAddSubscription = () => {
    setEditingSubscription(null)
    setIsModalOpen(true)
  }

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription)
    setIsModalOpen(true)
  }

  const handleSaveSubscription = async (formData) => {
    try {
      setActionLoading(true)

      if (editingSubscription) {
        await api.updateSubscription(editingSubscription.id, formData)
        setSubscriptions(prev =>
          prev.map(sub =>
            sub.id === editingSubscription.id ? { ...sub, ...formData } : sub
          )
        )
      } else {
        const response = await api.createSubscription(formData)
        setSubscriptions(prev => [...prev, response.data])
      }

      setIsModalOpen(false)
      setEditingSubscription(null)
    } catch (err) {
      console.error('Error saving subscription:', err)
      alert('Failed to save subscription plan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return
    }

    try {
      setActionLoading(true)
      await api.deleteSubscription(id)
      setSubscriptions(prev => prev.filter(sub => sub.id !== id))
    } catch (err) {
      console.error('Error deleting subscription:', err)
      alert('Failed to delete subscription plan')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true)
      const subscription = subscriptions.find(sub => sub.id === id)
      const updatedData = { ...subscription, isActive: !subscription.isActive }
      await api.updateSubscription(id, updatedData)
      setSubscriptions(prev =>
        prev.map(sub => (sub.id === id ? updatedData : sub))
      )
    } catch (err) {
      console.error('Error toggling status:', err)
      alert('Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  const getStats = () => {
    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.isActive).length,
      monthly: subscriptions.filter(s => s.type === 'monthly').length,
      annual: subscriptions.filter(s => s.type === 'annual').length,
      totalRevenue: subscriptions.reduce((acc, sub) => acc + (sub.price * (sub.subscribers || 0)), 0),
      totalSubscribers: subscriptions.reduce((acc, sub) => acc + (sub.subscribers || 0), 0)
    }
  }

  const stats = getStats()

  const getPlanIcon = (type) => {
    switch(type) {
      case 'monthly': return Calendar
      case 'annual': return Crown
      case 'lifetime': return Star
      default: return Package
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="h-10 w-10" />
                Subscription Plans
              </h1>
              <p className="text-white/90 text-lg">Manage your pricing and subscription tiers</p>
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">{stats.total} Plans</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{stats.active} Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">{stats.totalSubscribers} Subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">${stats.totalRevenue.toLocaleString()} MRR</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleAddSubscription}
                disabled={actionLoading}
                className="bg-white text-indigo-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create Plan
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Plans</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <p className="text-sm text-gray-600 mt-1">{stats.active} active plans</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Subscribers</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalSubscribers}</div>
          <p className="text-sm text-gray-600 mt-1">Total active users</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">MRR</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${(stats.totalRevenue / 1000).toFixed(1)}k</div>
          <p className="text-sm text-gray-600 mt-1">Monthly recurring revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Billing Types</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.monthly + stats.annual}</div>
          <p className="text-sm text-gray-600 mt-1">{stats.monthly} monthly, {stats.annual} annual</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                typeFilter === 'all'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('monthly')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                typeFilter === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-1" />
              Monthly ({stats.monthly})
            </button>
            <button
              onClick={() => setTypeFilter('annual')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                typeFilter === 'annual'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Crown className="inline h-4 w-4 mr-1" />
              Annual ({stats.annual})
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchSubscriptions}
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
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading subscription plans...</p>
          </div>
        ) : (
          <>
            {/* Subscription Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubscriptions.map((subscription) => {
                const Icon = getPlanIcon(subscription.type)
                return (
                  <div
                    key={subscription.id}
                    className={`relative group rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-2xl ${
                      subscription.isActive
                        ? 'bg-gradient-to-br from-white to-indigo-50 border-indigo-200 hover:border-indigo-400'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          subscription.isActive
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg'
                            : 'bg-gray-300'
                        }`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{subscription.name}</h3>
                          <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                            <Icon className="h-3 w-3" />
                            {subscription.type}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        subscription.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">
                          ${subscription.price}
                        </span>
                        <span className="text-gray-600 text-sm">
                          /{subscription.type === 'lifetime' ? 'forever' : subscription.type === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{subscription.description}</p>
                    </div>

                    {/* Subscribers */}
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-indigo-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-indigo-900">
                        {subscription.subscribers || 0} subscribers
                      </span>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Benefits
                      </p>
                      <ul className="space-y-1.5">
                        {subscription.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{benefit}</span>
                          </li>
                        ))}
                        {subscription.benefits.length > 3 && (
                          <li className="text-xs text-indigo-600 font-medium ml-6">
                            +{subscription.benefits.length - 3} more benefits
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Limitations */}
                    {subscription.limitations && subscription.limitations.length > 0 && (
                      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-orange-600" />
                          Limitations
                        </p>
                        <ul className="space-y-1.5">
                          {subscription.limitations.slice(0, 2).map((limitation, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <XCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(subscription.createdAt).toLocaleDateString()}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleStatus(subscription.id)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={subscription.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {subscription.isActive ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditSubscription(subscription)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-20">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No subscription plans found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search criteria.'
                    : 'Get started by creating your first subscription plan.'}
                </p>
                <button 
                  onClick={handleAddSubscription}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 mx-auto font-semibold"
                >
                  <Plus className="h-5 w-5" />
                  Create Subscription Plan
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSubscription(null)
        }}
        onSave={handleSaveSubscription}
        subscription={editingSubscription}
        loading={actionLoading}
      />

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <span className="font-semibold text-gray-900 text-lg">Processing...</span>
            <p className="text-sm text-gray-600">Please wait</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionManagement