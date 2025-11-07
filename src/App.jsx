import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import UserList from './pages/users/UserList'
import UserProfile from './pages/users/UserProfile'


import NotFound from './pages/NotFound'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'
import MainLayout from './components/layouts/MainLayout'
import MusicList from './pages/music/MusicList'
import ManageSubscriptions from './pages/subscribe/ManageSubscriptions'
import ManageCategories from './pages/categories/ManageCategories'
import ManageSubcategories from './pages/subcategory/SubCategory'
import AlbumManagement from './pages/album/AlbumManagement'

function App() {
  const { isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/profile" element={<UserProfile />} />
        <Route path="music" element={<MusicList />} />
         <Route path="albums" element={<AlbumManagement />} />


        {/* Add other routes here */}
        <Route path='/categories' element={<ManageCategories/>} />
        {/* SUBCatgeerory */}
        <Route path='/subCategories' element={<ManageSubcategories/>} />

        <Route path='/subscriptions' element={<ManageSubscriptions />} />
     
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App