import { useState } from 'react'
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertTriangle, User, Calendar } from 'lucide-react'

interface Complaint {
  id: string
  user: string
  email: string
  type: 'complaint' | 'suggestion' | 'bug_report' | 'feature_request'
  category: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdDate: string
}

const mockComplaints: Complaint[] = [
  { id: '1', user: 'Maria Santos', email: 'maria.santos@email.com', type: 'complaint', category: 'Booking Issues', subject: 'Unable to cancel booking', description: 'I tried to cancel my hotel booking but the cancel button is not working.', status: 'open', priority: 'high', createdDate: '2024-03-20' },
  { id: '2', user: 'John Dela Cruz', email: 'john.delacruz@email.com', type: 'suggestion', category: 'App Features', subject: 'Add dark mode to the app', description: 'It would be great if the app had a dark mode option.', status: 'in_progress', priority: 'medium', createdDate: '2024-03-18' },
  { id: '3', user: 'Ana Rodriguez', email: 'ana.rodriguez@email.com', type: 'bug_report', category: 'Payment', subject: 'Payment failed but money was deducted', description: 'My payment failed during checkout but the money was still deducted.', status: 'resolved', priority: 'urgent', createdDate: '2024-03-15' },
  { id: '4', user: 'Carlos Mendoza', email: 'carlos.mendoza@email.com', type: 'feature_request', category: 'Search', subject: 'Better search filters', description: 'Please add more search filters like price range, ratings.', status: 'open', priority: 'low', createdDate: '2024-03-10' },
]

export default function AdminComplaintsPage() {
  const [complaints] = useState<Complaint[]>(mockComplaints)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredComplaints = complaints.filter(c => {
    return c.subject.toLowerCase().includes(searchTerm.toLowerCase()) || c.user.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Complaints & Suggestions</h1>
        <div className="text-sm text-gray-500">Total: {complaints.length} items</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Open Issues</p><p className="text-2xl font-bold text-red-600">{complaints.filter(c => c.status === 'open').length}</p></div><AlertTriangle className="h-8 w-8 text-red-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">In Progress</p><p className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'in_progress').length}</p></div><Clock className="h-8 w-8 text-yellow-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Resolved</p><p className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p></div><CheckCircle className="h-8 w-8 text-green-500" /></div></div>
        <div className="card"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Urgent Priority</p><p className="text-2xl font-bold text-purple-600">{complaints.filter(c => c.priority === 'urgent').length}</p></div><AlertTriangle className="h-8 w-8 text-purple-500" /></div></div>
      </div>

      <div className="card">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input type="text" placeholder="Search complaints..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="rounded-2xl border border-sand-200 p-4 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">{complaint.type.replace('_', ' ')}</span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(complaint.priority)}`} />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>{complaint.status.replace('_', ' ')}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{complaint.subject}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{complaint.user}</span></div>
                <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{new Date(complaint.createdDate).toLocaleDateString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
