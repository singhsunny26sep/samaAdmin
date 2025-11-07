import { useDispatch, useSelector } from 'react-redux'
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Search,
  Settings,
  Music,
  Headphones,
  Volume2
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import Button from '../ui/Button'

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-lg shadow-gray-900/5">
      <div className="flex h-20 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Brand section */}
        {/* <div className="flex items-center gap-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Volume2 className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Music Admin
            </h1>
            <p className="text-xs text-gray-500 font-medium">Studio Dashboard</p>
          </div>
        </div> */}

        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, artists, albums..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-x-3 ml-auto">
          {/* Quick stats */}
          <div className="hidden lg:flex items-center gap-x-4 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div className="flex items-center gap-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Live</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-x-1">
              <Headphones className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">247</span>
            </div>
          </div>

          {/* Notifications */}
          {/* <div className="relative">
            <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div> */}

         

          {/* User profile */}
          <div className="flex items-center gap-x-3 pl-3 border-l border-gray-200">
            <div className="flex items-center gap-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 text-gray-700 hover:text-gray-900 rounded-xl px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search music..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )
}

export default Header