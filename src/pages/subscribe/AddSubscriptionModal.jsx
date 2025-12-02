// ==================== 4. AddSubscriptionModal.jsx (FULL REWRITE) ====================

import { useState, useEffect } from 'react'
import { 
  X,
  Crown,
  IndianRupee ,
  Calendar,
  Tag,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const AddSubscriptionModal = ({ isOpen, onClose, onSave, editingPlan, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'monthly',
    benefits: [''],
    limitations: [''],
    isActive: true
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name || '',
        description: editingPlan.description || '',
        price: editingPlan.price || '',
        type: editingPlan.type || 'monthly',
        benefits: editingPlan.benefits && editingPlan.benefits.length > 0 
          ? editingPlan.benefits 
          : [''],
        limitations: editingPlan.limitations && editingPlan.limitations.length > 0 
          ? editingPlan.limitations 
          : [''],
        isActive: editingPlan.isActive !== undefined ? editingPlan.isActive : true
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
    setErrors({})
  }, [editingPlan, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData(prev => ({ ...prev, benefits: newBenefits }))
  }

  const handleLimitationChange = (index, value) => {
    const newLimitations = [...formData.limitations]
    newLimitations[index] = value
    setFormData(prev => ({ ...prev, limitations: newLimitations }))
  }

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }))
  }

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const addLimitation = () => {
    setFormData(prev => ({
      ...prev,
      limitations: [...prev.limitations, '']
    }))
  }

  const removeLimitation = (index) => {
    setFormData(prev => ({
      ...prev,
      limitations: prev.limitations.filter((_, i) => i !== index)
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    // Filter out empty benefits
    const validBenefits = formData.benefits.filter(b => b.trim())
    if (validBenefits.length === 0) {
      newErrors.benefits = 'At least one benefit is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    // Filter out empty values
    const validBenefits = formData.benefits.filter(b => b.trim())
    const validLimitations = formData.limitations.filter(l => l.trim())

    const planData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      type: formData.type,
      benefits: validBenefits,
      limitations: validLimitations,
      isActive: formData.isActive
    }

    onSave(planData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed  transition-opacity bg-black/60 "
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
                  </h3>
                  <p className="text-white/80">
                    {editingPlan ? 'Update plan details' : 'Define pricing and features'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  <Tag className="inline h-4 w-4 mr-2" />
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="e.g., Premium Music Pro"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  <IndianRupee className="inline h-4 w-4 mr-2" />
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.price ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="29.99"
                  disabled={loading}
                />
                {errors.price && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Billing Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Billing Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2 flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Active Plan
                    </span>
                    <span className="text-xs text-gray-500">Make this plan available to users</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Full access to all premium tools for a month"
                disabled={loading}
              />
              {errors.description && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  <Sparkles className="inline h-4 w-4 mr-2" />
                  Benefits * (What's included)
                </label>
                <button
                  type="button"
                  onClick={addBenefit}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  Add Benefit
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Benefit ${index + 1} (e.g., Unlimited downloads)`}
                      disabled={loading}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.benefits && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.benefits}
                </p>
              )}
            </div>

            {/* Limitations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-900">
                  <AlertCircle className="inline h-4 w-4 mr-2" />
                  Limitations (Optional)
                </label>
                <button
                  type="button"
                  onClick={addLimitation}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                  Add Limitation
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={limitation}
                      onChange={(e) => handleLimitationChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Limitation ${index + 1} (e.g., Limited team members)`}
                      disabled={loading}
                    />
                    {formData.limitations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLimitation(index)}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    {editingPlan ? 'Update Plan' : 'Create Plan'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSubscriptionModal