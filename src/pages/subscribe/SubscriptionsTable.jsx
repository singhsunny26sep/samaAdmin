import { 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Plus,
  Zap,
  Crown,
  Shield
} from 'lucide-react'

const SubscriptionsTable = ({ 
  subscriptions, 
  selectedSubscriptions, 
  onToggleSelection, 
  onSelectAll,
  onDelete 
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    expired: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const tierColors = {
    basic: 'from-gray-500 to-slate-500',
    premium: 'from-purple-500 to-pink-500',
    enterprise: 'from-blue-600 to-indigo-600'
  }

  const tierIcons = {
    basic: Shield,
    premium: Crown,
    enterprise: Zap
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return CheckCircle
      case 'cancelled': return XCircle
      case 'pending': return Clock
      default: return AlertCircle
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectAll(subscriptions.map(s => s.id))
                      } else {
                        onSelectAll([])
                      }
                    }}
                    checked={selectedSubscriptions.length === subscriptions.length && subscriptions.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Auto-Renew
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => {
                const StatusIcon = getStatusIcon(sub.status)
                const TierIcon = tierIcons[sub.tier]
                
                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedSubscriptions.includes(sub.id)}
                        onChange={() => onToggleSelection(sub.id)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {sub.userName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{sub.userName}</h3>
                          <p className="text-xs text-gray-500">{sub.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 bg-gradient-to-br ${tierColors[sub.tier]} rounded-lg flex items-center justify-center`}>
                          <TierIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{sub.planName}</p>
                          <p className="text-xs text-gray-500 capitalize">{sub.tier}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-bold text-gray-900">${sub.price}</p>
                        <p className="text-xs text-gray-500">/{sub.billingCycle}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[sub.status]}`}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="capitalize">{sub.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(sub.nextBillingDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {sub.autoRenew ? (
                          <>
                            <RefreshCw className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-700 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-700 font-medium">No</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add New Subscription
          </button>
        </div>
      )}
    </>
  )
}

export default SubscriptionsTable