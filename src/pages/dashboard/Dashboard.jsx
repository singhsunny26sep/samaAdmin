import { useState, useEffect } from 'react'
import { 
  Users2, 
  Music2, 
  Upload, 
  TrendingUp, 
  Play,
  Heart,
  Clock,
  Star,
  Headphones,
  Radio,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12847,
    totalMusic: 3456,
    totalUploads: 247,
    growthRate: 18.5
  })

  const [timeRange, setTimeRange] = useState('month')

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users2,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12.4%',
      trend: 'up',
      subtitle: 'Active listeners'
    },
    {
      title: 'Music Library',
      value: stats.totalMusic.toLocaleString(),
      icon: Music2,
      gradient: 'from-purple-500 to-pink-500',
      change: '+8.2%',
      trend: 'up',
      subtitle: 'Total tracks'
    },
    {
      title: 'Monthly Uploads',
      value: stats.totalUploads.toLocaleString(),
      icon: Upload,
      gradient: 'from-emerald-500 to-teal-500',
      change: '+23.1%',
      trend: 'up',
      subtitle: 'New content'
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      change: '+3.2%',
      trend: 'up',
      subtitle: 'Monthly growth'
    }
  ]

  const recentUploads = [
    {
      id: 1,
      title: 'Midnight Vibes',
      artist: 'Luna Rodriguez',
      duration: '3:42',
      plays: 15420,
      likes: 892,
      time: '2 hours ago',
      status: 'trending'
    },
    {
      id: 2,
      title: 'Electric Dreams',
      artist: 'Neo Sync',
      duration: '4:15',
      plays: 8734,
      likes: 445,
      time: '4 hours ago',
      status: 'new'
    },
    {
      id: 3,
      title: 'Ocean Waves',
      artist: 'Calm Collective',
      duration: '5:28',
      plays: 23891,
      likes: 1247,
      time: '6 hours ago',
      status: 'hot'
    },
    {
      id: 4,
      title: 'City Lights',
      artist: 'Urban Echo',
      duration: '3:56',
      plays: 12043,
      likes: 678,
      time: '8 hours ago',
      status: 'rising'
    }
  ]

  const newUsers = [
    {
      id: 1,
      name: 'Alexandra Chen',
      email: 'alex.chen@email.com',
      avatar: null,
      joinedTime: '1 hour ago',
      plan: 'Premium',
      location: 'New York'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      email: 'm.johnson@email.com',
      avatar: null,
      joinedTime: '2 hours ago',
      plan: 'Basic',
      location: 'Los Angeles'
    },
    {
      id: 3,
      name: 'Sofia Martinez',
      email: 'sofia.m@email.com',
      avatar: null,
      joinedTime: '3 hours ago',
      plan: 'Premium',
      location: 'Miami'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      avatar: null,
      joinedTime: '5 hours ago',
      plan: 'Basic',
      location: 'Seattle'
    }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'trending': return 'from-purple-500 to-pink-500'
      case 'hot': return 'from-red-500 to-orange-500'
      case 'rising': return 'from-green-500 to-emerald-500'
      case 'new': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-white/80 text-lg">Here's your music platform overview for today</p>
            </div>
            <div className="mt-6 sm:mt-0 flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <Radio className="h-4 w-4" />
                <span className="text-sm font-medium">Live: 1.2k listeners</span>
              </div>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </div>
                  <span className="text-xs text-gray-500">{stat.subtitle}</span>
                </div>
              </div>
              
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-7 w-7 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                style={{ width: `${60 + index * 10}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Uploads - Takes 2 columns */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Uploads</h3>
                <p className="text-gray-600 mt-1">Latest tracks from your artists</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentUploads.map((track, index) => (
                <div key={track.id} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor(track.status)} flex items-center justify-center shadow-lg`}>
                      <Music2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${getStatusColor(track.status)} text-white`}>
                        {track.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{track.artist}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {track.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {track.plays.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {track.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">{track.time}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Play className="h-3 w-3" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Users - Takes 1 column */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">New Users</h3>
                <p className="text-gray-600 mt-1">Recent signups</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {newUsers.map((user, index) => (
                <div key={user.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{user.name}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        user.plan === 'Premium' 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.plan}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{user.location}</span>
                      <span className="text-xs text-gray-400">{user.joinedTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Analytics Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Platform Analytics</h3>
            <p className="text-gray-300">Real-time performance metrics</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Updated now</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">99.9%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">1.8s</div>
            <div className="text-gray-400 text-sm">Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">847TB</div>
            <div className="text-gray-400 text-sm">Storage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-gray-400 text-sm">Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard