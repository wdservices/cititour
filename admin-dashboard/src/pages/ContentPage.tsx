import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, FileText, Image, Video } from 'lucide-react'

interface Content {
  id: string
  title: string
  type: 'article' | 'guide' | 'announcement' | 'promotion'
  category: string
  status: 'published' | 'draft' | 'archived'
  author: string
  createdDate: string
  lastModified: string
  views: number
}

const mockContent: Content[] = [
  {
    id: '1',
    title: 'Top 10 Tourist Destinations in Nigeria',
    type: 'article',
    category: 'Travel Guide',
    status: 'published',
    author: 'Admin User',
    createdDate: '2024-01-15',
    lastModified: '2024-01-20',
    views: 25430
  },
  {
    id: '2',
    title: 'How to Book Your Perfect Vacation',
    type: 'guide',
    category: 'How-to',
    status: 'published',
    author: 'Admin User',
    createdDate: '2024-02-10',
    lastModified: '2024-02-12',
    views: 18920
  },
  {
    id: '3',
    title: 'New Features Coming to TourPH App',
    type: 'announcement',
    category: 'Updates',
    status: 'draft',
    author: 'Admin User',
    createdDate: '2024-03-01',
    lastModified: '2024-03-15',
    views: 0
  },
  {
    id: '4',
    title: 'Summer Special Offers - 50% Off',
    type: 'promotion',
    category: 'Promotions',
    status: 'published',
    author: 'Admin User',
    createdDate: '2024-03-20',
    lastModified: '2024-03-20',
    views: 12450
  }
]

export default function ContentPage() {
  const [content] = useState<Content[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'article' | 'guide' | 'announcement' | 'promotion'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText
      case 'guide': return FileText
      case 'announcement': return FileText
      case 'promotion': return Image
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'text-blue-600'
      case 'guide': return 'text-green-600'
      case 'announcement': return 'text-purple-600'
      case 'promotion': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Content
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{content.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">
                {content.filter(c => c.status === 'published').length}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {content.filter(c => c.status === 'draft').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">
                {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search content by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="guide">Guides</option>
              <option value="announcement">Announcements</option>
              <option value="promotion">Promotions</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className={`h-4 w-4 mr-2 ${getTypeColor(item.type)}`} />
                        <span className="text-sm text-gray-900 capitalize">{item.type}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.views.toLocaleString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastModified).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
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
        
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No content found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" className="input w-full" placeholder="Enter content title" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="input w-full">
                  <option>Select type</option>
                  <option value="article">Article</option>
                  <option value="guide">Guide</option>
                  <option value="announcement">Announcement</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input type="text" className="input w-full" placeholder="Enter category" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea 
                  className="input w-full h-32 resize-none" 
                  placeholder="Enter content..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 btn-primary">
                Create Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}