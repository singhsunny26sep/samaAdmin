import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  Edit, 
  Music,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { getMusic, deleteMusic } from '../../api/api'
import AddMusic from './AddMusic'

const MusicList = () => {
  const [musicList, setMusicList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingMusic, setEditingMusic] = useState(null)
  const [selectedTracks, setSelectedTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchMusicList()
  }, [currentPage, itemsPerPage])

  const fetchMusicList = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Pass page and limit to API
      const response = await getMusic({ page: currentPage, limit: itemsPerPage })
      
      // Handle the API response structure
      let music = []
      let pagination = {}
      
      if (response.data?.data) {
        // Structure from your API
        music = Array.isArray(response.data.data) ? response.data.data : []
        pagination = {
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 10
        }
      } else if (Array.isArray(response.data)) {
        music = response.data
      } else if (Array.isArray(response)) {
        music = response
      }
      
      setMusicList(music)
      setTotalItems(pagination.total || music.length)
      setTotalPages(pagination.totalPages || Math.ceil(music.length / itemsPerPage))
    } catch (err) {
      console.error('Error fetching music:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load music')
    } finally {
      setLoading(false)
    }
  }

  // Client-side search filtering
  const filteredMusic = musicList.filter(music => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      music.name?.toLowerCase().includes(searchLower) ||
      music.title?.toLowerCase().includes(searchLower) ||
      music.description?.toLowerCase().includes(searchLower) ||
      music.artists?.some(artist => artist.toLowerCase().includes(searchLower)) ||
      music.category?.name?.toLowerCase().includes(searchLower) ||
      music.subCategory?.name?.toLowerCase().includes(searchLower) ||
      music.album?.name?.toLowerCase().includes(searchLower)
    )
  })

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setSelectedTracks([]) // Clear selections when changing page
    }
  }

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1) // Reset to first page
    setSelectedTracks([])
  }

  const handleEdit = (music) => {
    setEditingMusic(music)
    setIsAddModalOpen(true)
  }

  const handleDelete = async (musicId) => {
    if (!window.confirm('Are you sure you want to delete this track?')) {
      return
    }

    try {
      await deleteMusic(musicId)
      await fetchMusicList()
    } catch (err) {
      console.error('Error deleting music:', err)
      alert(err.message || 'Failed to delete music')
    }
  }

  const handleAddOrUpdateMusic = async () => {
    await fetchMusicList()
  }

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTracks.length} track(s)?`)) {
      return
    }

    try {
      await Promise.all(selectedTracks.map(id => deleteMusic(id)))
      setSelectedTracks([])
      await fetchMusicList()
    } catch (err) {
      console.error('Error deleting tracks:', err)
      alert(err.message || 'Failed to delete some tracks')
    }
  }

  // Calculate display info
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Music Library</h1>
              <p className="text-white/80 text-lg">Manage and discover your audio collection</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span className="font-semibold">{totalItems} Tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {musicList.filter(m => m.isActive).length} Active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Playlist
              </button>
              <button 
                onClick={() => {
                  setEditingMusic(null)
                  setIsAddModalOpen(true)
                }}
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Music
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Data</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchMusicList}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading music library...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tracks, artists, albums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {selectedTracks.length > 0 && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-900">
                    {selectedTracks.length} track(s) selected
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                    <button 
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          checked={selectedTracks.length === filteredMusic.length && filteredMusic.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTracks(filteredMusic.map(m => m._id))
                            } else {
                              setSelectedTracks([])
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Track
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Album
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMusic.map((music) => (
                      <tr key={music._id} className="hover:bg-gray-50 transition-colors duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                            checked={selectedTracks.includes(music._id)}
                            onChange={() => toggleTrackSelection(music._id)}
                          />
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {music.image ? (
                                <img 
                                  src={music.image} 
                                  alt={music.title || music.name}
                                  className="h-12 w-12 rounded-xl object-cover shadow-lg"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                  <span className="text-lg font-bold text-white">
                                    {(music.title || music.name)?.charAt(0) || 'M'}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {music.title || music.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {music.artists?.join(', ') || 'Unknown Artist'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 w-fit">
                              {music.category?.name || 'No Category'}
                            </span>
                            {music.subCategory && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 w-fit">
                                {music.subCategory.name}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-600">
                            {music.album?.name || 'No Album'}
                          </p>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-600">
                            {music.durationInSeconds 
                              ? `${Math.floor(music.durationInSeconds / 60)}:${(music.durationInSeconds % 60).toString().padStart(2, '0')}`
                              : '-'}
                          </p>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            music.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {music.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleEdit(music)}
                              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(music._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Showing <span className="font-semibold text-gray-900">{startIndex}</span> to{' '}
                    <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalItems}</span> results
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {filteredMusic.length === 0 && !loading && (
              <div className="text-center py-12">
                <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first track.'}
                </p>
                <button 
                  onClick={() => {
                    setEditingMusic(null)
                    setIsAddModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add New Track
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AddMusic 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingMusic(null)
        }}
        onAddMusic={handleAddOrUpdateMusic}
        editingMusic={editingMusic}
      />
    </div>
  )
}

export default MusicList