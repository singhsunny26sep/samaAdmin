import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users2, 
  Music2, 
  Upload,
  BarChart3,
  Settings2,
  X,
  Headphones,
  Mic,
  Radio,
  TrendingUp,
  Library,
  Plus,
  Volume2,
  Disc3
} from 'lucide-react'
import { useSelector } from 'react-redux'
import logo from '../../assets/logo.jpeg';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Overview & Stats'
  },
  { 
    name: ' Users', 
    href: '/users', 
    icon: Users2, 
    gradient: 'from-purple-500 to-pink-500',
    description: 'Manage Users'
  },
  // catgeoryies
  { 
    name: 'Categories',
    href: '/categories',
    icon: BarChart3,
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Music Categories'
  },
  // SubCategory
  { 
    name: 'Subcategories',
    href: '/subcategories',
    icon: Settings2,
    gradient: 'from-green-500 to-lime-500',
    description: 'Music Subcategories'

  },

  {
    name: 'Albums',
    href: '/albums',
    icon: Upload,
    gradient: 'from-indigo-500 to-violet-500',
    description: 'albums & tracks'
  },
  { 
    name: 'Music Library', 
    href: '/music', 
    icon: Library, 
    gradient: 'from-emerald-500 to-teal-500',
    description: 'Browse Tracks'
  },


  {
    name:'Subscriptions',
    href:'/subscriptions',
    icon: Disc3,
    gradient: 'from-pink-500 to-rose-500',
    description: 'User Plans'
  }

 
 
 
]

const quickActions = [
  { name: 'Live Radio', icon: Radio, gradient: 'from-red-500 to-pink-500' },
  { name: 'Recording', icon: Mic, gradient: 'from-green-500 to-emerald-500' },
  { name: 'New Playlist', icon: Plus, gradient: 'from-blue-500 to-indigo-500' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth)

  const SidebarContent = () => (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto no-scrollbar bg-gradient-to-b from-gray-900 via-gray-900 to-black px-6 pb-4">
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
  <img src={logo} alt="Logo" className=""/>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse">
             
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
             Sama Song 
            </span>
            <div className="text-xs text-gray-400 font-medium">Studio Pro</div>
          </div>
        </div>
        
        {/* Mobile close button */}
        <button 
          className="text-gray-400 hover:text-white lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col ">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-4">
            Main Menu
          </div>
          
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 shadow-lg shadow-black/20'
                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 hover:border hover:border-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon container */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                      : 'bg-gray-800 group-hover:bg-gray-700'
                  }`}>
                    <item.icon className={`h-5 w-5 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    }`} />
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300">
                      {item.description}
                    </div>
                  </div>

                  {/* Active line indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>


       

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-gray-800">
          <div className="flex items-center gap-x-4 p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-400">
                {user?.role || 'Studio Admin'}
              </div>
              <div className="flex items-center gap-x-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          <div className="fixed inset-y-0 left-0 z-50 w-80 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col shadow-2xl">
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar