import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../../store/slices/authSlice'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Eye, EyeOff, Music2, Sparkles, Lock, Mail } from 'lucide-react'

const LoginForm = () => {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) dispatch(clearError())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(login({
      email: formData.email,
      password: formData.password,
      fcmToken: ''
    }))
  }

  const togglePasswordVisibility = () => setShowPassword(prev => !prev)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Form Container with Glass Effect */}
        <div className="relative w-full max-w-md z-10">
          {/* Header Section */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-5 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Music2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-gray-300 flex items-center justify-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Sign in to SamaSong Admin Portal</span>
            </p>
          </header>

          {/* Glass Card Container */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Error Alert with Better Animation */}
              {error && (
                <div 
                  role="alert"
                  className="rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/50 p-4 animate-shake"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-red-100 flex-1">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Form Fields */}
              <div className="space-y-5">
                {/* Email Field */}
                <div className="relative group ">
                  <Mail className="absolute left-4 text-center top-[36px] w-5 h-5 text-white group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@samasong.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 pl-12 transition-all duration-200 hover:bg-white/15"
                  />
                </div>
                
                {/* Password Field */}
                <div className="relative group">
                  <Lock className="absolute left-4 text-center top-[36px] w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors pointer-events-none z-10" />
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 pl-12 pr-12 transition-all duration-200 hover:bg-white/15"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-[32px] text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg p-1"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-center "  /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Section */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors group">
                  <input 
                    type="checkbox" 
                    className="mr-2 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer w-4 h-4" 
                  />
                  <span className="select-none">Remember me</span>
                </label>
                <a 
                  href="#" 
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button with Enhanced Styling */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to Dashboard</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-gray-300">
            <p>
              Don't have an account?{' '}
              <a 
                href="#" 
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-2 py-1"
              >
                Contact Admin
              </a>
            </p>
          </footer>
        </div>
      </div>

      {/* Right Side - Enhanced Music Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-900/30 to-gray-900 z-10" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Music Themed Illustration */}
        <div className="relative z-20 flex items-center justify-center w-full p-12">
          <div className="relative">
            {/* Floating Music Notes Animation */}
            <div className="absolute inset-0 -left-20 -right-20 -top-20 -bottom-20">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-white/20 animate-float"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${5 + i * 11}%`,
                    animationDelay: `${i * 0.7}s`,
                    fontSize: `${24 + (i % 3) * 8}px`
                  }}
                >
                  {i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♬'}
                </div>
              ))}
            </div>

            {/* Main Visual */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-50 animate-pulse" />
              
              {/* Main Circle */}
              <div className="relative w-96 h-96 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
                <Music2 className="w-48 h-48 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin-reverse">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <Music2 className="w-10 h-10 text-white" />
                </div>
              </div>
              
              {/* Additional Orbiting Elements */}
              <div className="absolute inset-0 animate-spin-slow" style={{ animationDelay: '5s' }}>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">♪</span>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="mt-16 text-center">
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Your Music, Your Way
              </h2>
              <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
                Manage your entire music platform from one powerful dashboard
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  <span className="mr-2">🎵</span>Analytics
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  <span className="mr-2">👥</span>User Management
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20">
                  <span className="mr-2">🎼</span>Content Control
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.6; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 18s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginForm