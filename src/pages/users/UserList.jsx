import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Crown,
  Shield,
  Star,
  Mail,
  MapPin,
  Activity,
  Users2,
  Download,
  X
} from 'lucide-react'
import Button from '../../components/ui/Button'
import { getUsers } from '../../api/api'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch users from API on mount
  useEffect(() => {
    fetchUsersData()
  }, [])

  // Fetch users using imported API function
  const fetchUsersData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getUsers()
      
      // Handle API response structure: {success: true, data: {...}, message: "..."}
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users')
      }
      
      // Convert single user object or array to array
      let usersArray = []
      if (response.data) {
        usersArray = Array.isArray(response.data) ? response.data : [response.data]
      }
      
      // Transform API data to match expected format
      const transformedData = usersArray.map(user => ({
        id: user._id || user.id,
        name: user.name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'user',
        status: user.isActive ? 'active' : 'inactive',
        avatar: user.avatar || user.profilePicture || null,
        location: user.location || user.city || 'N/A',
        phone: user.phone || user.phoneNumber || 'N/A',
        joinDate: user.createdAt || new Date().toISOString(),
        lastActivity: user.lastActivity ? new Date(user.lastActivity).toLocaleString() : 'Recently',
        subscription: user.subscription || user.plan || 'Free',
        totalPlays: user.totalPlays || user.playCount || 0,
        favoriteGenre: user.favoriteGenre || user.genre || 'Various',
        plan: user.plan || user.subscription || (user.role === 'admin' ? 'Premium' : 'Free'),
        // Additional fields from your API
        isEmailVerified: user.isEmailVerified || false,
        isMobileVerified: user.isMobileVerified || false,
        loginType: user.loginType || 'password',
        currentScreen: user.currentScreen || 'LANDING_SCREEN'
      }))
      
      setUsers(transformedData)
      setFilteredUsers(transformedData)
    } catch (err) {
      setError(err.message || 'Failed to fetch users')
      console.error('Error fetching users:', err)
      // Set empty array on error
      setUsers([])
      setFilteredUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search and filter
  useEffect(() => {
    let filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => user.status === selectedFilter)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, users, selectedFilter])

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      // TODO: Add your delete API call here
      // await deleteUser(userId)
      
      // Update local state
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
    } catch (err) {
      alert('Error deleting user: ' + err.message)
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const getPlanColor = (plan) => {
    const planLower = plan?.toLowerCase() || 'free'
    switch(planLower) {
      case 'premium': return 'from-purple-500 to-pink-500'
      case 'family': return 'from-emerald-500 to-teal-500'
      case 'basic': return 'from-blue-500 to-indigo-500'
      case 'free': return 'from-gray-500 to-slate-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getPlanIcon = (plan) => {
    const planLower = plan?.toLowerCase() || 'free'
    switch(planLower) {
      case 'premium': return Crown
      case 'family': return Shield
      case 'basic': return Star
      case 'free': return Users2
      default: return Users2
    }
  }

  const filters = [
    { value: 'all', label: 'All Users', count: users.length },
    { value: 'active', label: 'Active', count: users.filter(u => u.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: users.filter(u => u.status === 'inactive').length },
  ]

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={fetchUsersData}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">User Management</h1>
              <p className="text-white/80 text-lg">Manage and monitor your community</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  <span className="font-semibold">{users.length.toLocaleString()} Total Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="font-semibold">{users.filter(u => u.status === 'active').length} Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, emails, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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

        {/* Selected Users Actions */}
        {selectedUsers.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-900">
                {selectedUsers.length} user(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" className="text-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="secondary" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const PlanIcon = getPlanIcon(user.plan)
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                            {user.plan?.toLowerCase() === 'premium' && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {user.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getPlanColor(user.plan)} flex items-center justify-center`}>
                          <PlanIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${getPlanColor(user.plan)} text-white`}>
                            {user.plan}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{user.favoriteGenre}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className={`flex items-center gap-2 text-xs font-medium ${
                          user.status === 'active' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`}></div>
                          {user.status === 'active' ? 'Online' : 'Offline'}
                        </div>
                        <p className="text-xs text-gray-500">Last: {user.lastActivity}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(user.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {user.totalPlays?.toLocaleString() || 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Total plays</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-black hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-black hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
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

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No users available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList