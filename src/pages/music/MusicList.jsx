import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Download, Trash2, Edit, Music, X, Loader2, AlertCircle, ChevronLeft, ChevronRight, Calendar, Clock, Users, Tag, Disc, Play, Pause, ArrowLeft, Volume2 } from 'lucide-react'
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
  
  // Details view state
  const [selectedMusic, setSelectedMusic] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(new Audio())

  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchMusicList()
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    const audio = audioRef.current
    
    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const fetchMusicList = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMusic({ page: currentPage, limit: itemsPerPage })
      
      let music = []
      let pagination = {}
      
      if (response.data?.data) {
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
      setSelectedTracks([])
    }
  }

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
    setSelectedTracks([])
  }

  const handleEdit = (music) => {
    setEditingMusic(music)
    setIsAddModalOpen(true)
    setSelectedMusic(null)
  }

  const handleDelete = async (musicId) => {
    if (!window.confirm('Are you sure you want to delete this track?')) {
      return
    }
    
    try {
      await deleteMusic(musicId)
      if (selectedMusic?._id === musicId) {
        setSelectedMusic(null)
      }
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

  const handleViewDetails = (music) => {
    setSelectedMusic(music)
    setIsPlaying(false)
    audioRef.current.pause()
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (selectedMusic?.audio) {
        audio.src = selectedMusic.audio
        audio.play()
        setIsPlaying(true)
      }
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  // If music details is selected, show details view
  if (selectedMusic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedMusic(null)
              setIsPlaying(false)
              audioRef.current.pause()
            }}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Music Library
          </button>

          {/* Details Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header Section with Image */}
            <div className="relative h-96 bg-gradient-to-br from-purple-600 to-pink-600">
              {selectedMusic.image ? (
                <img
                  src={selectedMusic.image}
                  alt={selectedMusic.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-32 h-32 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Title and Artists Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-5xl font-bold mb-3">{selectedMusic.title || selectedMusic.name}</h1>
                <div className="flex items-center gap-3 text-lg">
                  <Users className="w-5 h-5" />
                  <span>{selectedMusic.artists?.join(', ') || 'Unknown Artist'}</span>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={togglePlayPause}
                className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-purple-600" />
                ) : (
                  <Play className="w-8 h-8 text-purple-600 ml-1" />
                )}
              </button>

              {/* Status Badge */}
              <div className="absolute top-8 left-8">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedMusic.isActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {selectedMusic.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-semibold">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatDuration(selectedMusic.durationInSeconds)}
                  </p>
                </div>

                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-pink-600 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-semibold">Released</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(selectedMusic.releaseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Tag className="w-5 h-5" />
                    <span className="text-sm font-semibold">Category</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedMusic.category?.name || 'N/A'}
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Disc className="w-5 h-5" />
                    <span className="text-sm font-semibold">Album</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {selectedMusic.album?.name || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedMusic.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{selectedMusic.description}</p>
                </div>
              )}

              {/* Detailed Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Category Details */}
                {selectedMusic.category && (
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      Category Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-semibold">{selectedMusic.category.name}</p>
                      </div>
                      {selectedMusic.category.description && (
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-800">{selectedMusic.category.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SubCategory Details */}
                {selectedMusic.subCategory && (
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-pink-600" />
                      SubCategory Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-semibold">{selectedMusic.subCategory.name}</p>
                      </div>
                      {selectedMusic.subCategory.description && (
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-800">{selectedMusic.subCategory.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Album Details */}
                {selectedMusic.album && (
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Disc className="w-5 h-5 text-blue-600" />
                      Album Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-semibold">{selectedMusic.album.name}</p>
                      </div>
                      {selectedMusic.album.description && (
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-800">{selectedMusic.album.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Metadata</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Release Date</p>
                      <p className="text-gray-800 font-semibold">{formatDate(selectedMusic.releaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="text-gray-800">{formatDate(selectedMusic.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-gray-800">{formatDate(selectedMusic.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(selectedMusic)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Edit className="w-5 h-5" />
                  Edit Track
                </button>
                <button
                  onClick={() => window.open(selectedMusic.audio, '_blank')}
                  className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(selectedMusic._id)}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Music Library
          </h1>
          <p className="text-gray-600">Manage and discover your audio collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Tracks</p>
                <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-800">
                  {musicList.filter(m => m.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <button className="text-sm text-gray-500 mb-1 hover:text-purple-600 transition-colors">
                  Export Playlist
                </button>
              </div>
              <button
                onClick={() => {
                  setEditingMusic(null)
                  setIsAddModalOpen(true)
                }}
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 border-2 border-purple-600"
              >
                <Plus className="w-5 h-5" />
                Add Music
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Data</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchMusicList}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading music library...</p>
          </div>
        ) : (
          <>
            {/* Search and Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, artist, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
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
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedTracks.length} track(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Music Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTracks.length === filteredMusic.length && filteredMusic.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTracks(filteredMusic.map(m => m._id))
                            } else {
                              setSelectedTracks([])
                            }
                          }}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMusic.map((music) => (
                      <tr
                        key={music._id}
                        className="hover:bg-purple-50/50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                            handleViewDetails(music)
                          }
                        }}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedTracks.includes(music._id)}
                            onChange={() => toggleTrackSelection(music._id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {music.image ? (
                              <img
                                src={music.image}
                                alt={music.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                                {(music.title || music.name)?.charAt(0) || 'M'}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{music.title || music.name}</p>
                              <p className="text-sm text-gray-500">{music.artists?.join(', ') || 'Unknown Artist'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {music.category?.name || 'No Category'}
                            </span>
                            {music.subCategory && (
                              <span className="inline-block ml-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                {music.subCategory.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {music.album?.name || 'No Album'}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono">
                          {formatDuration(music.durationInSeconds)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            music.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {music.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(music)
                              }}
                              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(music._id)
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalItems > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{startIndex}</span> to{' '}
                    <span className="font-semibold">{endIndex}</span> of{' '}
                    <span className="font-semibold">{totalItems}</span> results
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
                      
                      if (!showPage) {
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

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredMusic.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tracks found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? 'Try adjusting your search criteria.'
                    : 'Get started by adding your first track.'}
                </p>
                <button
                  onClick={() => {
                    setEditingMusic(null)
                    setIsAddModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add New Track
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Music Modal */}
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