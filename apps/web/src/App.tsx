import { useState, useEffect } from 'react'
import { BookOpen, Heart, Search, User, Menu, X, TrendingUp, Clock, Star } from 'lucide-react'

// API URL - will be replaced by environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

interface Story {
  id: string
  title: string
  slug: string
  description: string
  coverImageUrl?: string
  author: {
    username: string
    displayName: string
  }
  genre?: {
    name: string
    slug: string
  }
  readCount: number
  voteCount: number
  chapterCount: number
}

function App() {
  const [stories, setStories] = useState<Story[]>([])
  const [trending, setTrending] = useState<Story[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchStories()
    fetchTrending()
    fetchGenres()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_URL}/stories?limit=6`)
      const data = await res.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrending = async () => {
    try {
      const res = await fetch(`${API_URL}/search/trending`)
      const data = await res.json()
      setTrending(data.trending || [])
    } catch (error) {
      console.error('Error fetching trending:', error)
    }
  }

  const fetchGenres = async () => {
    try {
      const res = await fetch(`${API_URL}/search/genres`)
      const data = await res.json()
      setGenres(data.genres || [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-[#F6F7F6]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-[#B8FF3D]" />
              <span className="text-2xl font-bold text-gray-900">J Read</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Discover</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Library</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Write</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Community</a>
            </div>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search stories..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B8FF3D] w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="px-4 space-y-2">
              <a href="#" className="block py-2 text-gray-600">Discover</a>
              <a href="#" className="block py-2 text-gray-600">Library</a>
              <a href="#" className="block py-2 text-gray-600">Write</a>
              <a href="#" className="block py-2 text-gray-600">Community</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#B8FF3D] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B8FF3D] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-[#B8FF3D]/20 text-[#B8FF3D] text-sm font-medium rounded-full mb-6">
                Welcome to J Read
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Stories that stay with you.
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Discover millions of stories from writers around the world. Read, write, and connect with a community that loves stories.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-[#B8FF3D] text-gray-900 font-semibold rounded-xl hover:bg-[#a8ef2d] transition-colors">
                  Start Reading
                </button>
                <button className="px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                  Start Writing
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#B8FF3D]/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#B8FF3D]/30 to-gray-900/20" />
                  <div className="p-8">
                    <span className="text-xs font-medium text-gray-500 uppercase">Featured Story</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
                      The Last Bookstore on Mercury
                    </h3>
                    <p className="text-gray-600 mb-4">
                      A serialized sci-fi mystery about memory, paper, and a city that never sleeps.
                    </p>
                    <button className="px-6 py-3 bg-[#B8FF3D] text-gray-900 font-medium rounded-lg hover:bg-[#a8ef2d]">
                      Read Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#B8FF3D]">4.2M</p>
              <p className="text-gray-500 mt-1">Chapters read</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#B8FF3D]">18K</p>
              <p className="text-gray-500 mt-1">New stories</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#B8FF3D]">920K</p>
              <p className="text-gray-500 mt-1">Comments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending This Week</h2>
              <p className="text-gray-500 mt-2">Stories readers can't put down</p>
            </div>
            <a href="#" className="flex items-center text-gray-900 font-medium hover:text-gray-600">
              Explore all <TrendingUp className="h-4 w-4 ml-2" />
            </a>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {trending.slice(0, 3).map((story) => (
                <div key={story.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {story.coverImageUrl ? (
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B8FF3D]/30 to-gray-900/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-3 py-1 bg-[#B8FF3D] text-gray-900 text-xs font-medium rounded-full mb-2">
                        {story.genre?.name || 'Story'}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-1">{story.title}</h3>
                      <p className="text-white/70 text-sm">{story.author.displayName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Releases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Releases</h2>
              <p className="text-gray-500 mt-2">Fresh stories just published</p>
            </div>
            <a href="#" className="flex items-center text-gray-900 font-medium hover:text-gray-600">
              View all <Clock className="h-4 w-4 ml-2" />
            </a>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    {story.coverImageUrl ? (
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#B8FF3D]/20 to-gray-900/10" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {story.genre?.name || 'Story'}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1 mb-2 group-hover:text-gray-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{story.author.displayName}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(story.voteCount)}
                        </span>
                        <span>{story.chapterCount} chapters</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Browse by Genre</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {genres.map((genre) => (
              <a
                key={genre.id}
                href="#"
                className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#B8FF3D] hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl mb-3"
                  style={{ backgroundColor: genre.color + '20' }}
                >
                  <Star className="w-6 h-6 m-3" style={{ color: genre.color }} />
                </div>
                <span className="font-medium text-gray-900">{genre.name}</span>
                <span className="text-sm text-gray-400">{genre.story_count} stories</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start your reading journey?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join millions of readers and writers on J Read today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-[#B8FF3D] text-gray-900 font-semibold rounded-xl hover:bg-[#a8ef2d] transition-colors">
              Join J Read
            </button>
            <button className="px-10 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Browse Stories
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Stories</a></li>
                <li><a href="#" className="hover:text-white">Genres</a></li>
                <li><a href="#" className="hover:text-white">Trending</a></li>
                <li><a href="#" className="hover:text-white">New Releases</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Write</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Start Writing</a></li>
                <li><a href="#" className="hover:text-white">Writer Resources</a></li>
                <li><a href="#" className="hover:text-white">Contests</a></li>
                <li><a href="#" className="hover:text-white">Premium</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Discussions</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-[#B8FF3D]" />
              <span className="text-xl font-bold">J Read</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} J Read. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
