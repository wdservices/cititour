import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, FileText } from 'lucide-react'

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
  { id: '1', title: 'Top 10 Tourist Destinations in Nigeria', type: 'article', category: 'Travel Guide', status: 'published', author: 'Admin User', createdDate: '2024-01-15', lastModified: '2024-01-20', views: 25430 },
  { id: '2', title: 'How to Book Your Perfect Vacation', type: 'guide', category: 'How-to', status: 'published', author: 'Admin User', createdDate: '2024-02-10', lastModified: '2024-02-12', views: 18920 },
  { id: '3', title: 'New Features Coming to Citivas App', type: 'announcement', category: 'Updates', status: 'draft', author: 'Admin User', createdDate: '2024-03-01', lastModified: '2024-03-15', views: 0 },
  { id: '4', title: 'Summer Special Offers - 50% Off', type: 'promotion', category: 'Promotions', status: 'published', author: 'Admin User', createdDate: '2024-03-20', lastModified: '2024-03-20', views: 12450 },
]

export default function AdminContentPage() {
  const [content] = useState<Content[]>(mockContent)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredContent = content.filter(item => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Content Management</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Content
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Content</p><p className="text-2xl font-bold text-gray-900">{content.length}</p></div><FileText className="h-8 w-8 text-blue-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Published</p><p className="text-2xl font-bold text-green-600">{content.filter(c => c.status === 'published').length}</p></div><Eye className="h-8 w-8 text-green-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Drafts</p><p className="text-2xl font-bold text-yellow-600">{content.filter(c => c.status === 'draft').length}</p></div><Edit className="h-8 w-8 text-yellow-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Views</p><p className="text-2xl font-bold text-purple-600">{content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</p></div><Eye className="h-8 w-8 text-purple-500" /></div></div>
      </div>

      <div className="card">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input type="text" placeholder="Search content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10 w-full" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{item.title}</div><div className="text-sm text-gray-500">{item.category}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{item.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.views.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                      <button className="text-gray-600 hover:text-gray-900"><Edit className="h-4 w-4" /></button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
