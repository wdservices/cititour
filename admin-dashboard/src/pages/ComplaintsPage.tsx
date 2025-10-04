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
  lastUpdated: string
  assignedTo?: string
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    user: 'Maria Santos',
    email: 'maria.santos@email.com',
    type: 'complaint',
    category: 'Booking Issues',
    subject: 'Unable to cancel booking',
    description: 'I tried to cancel my hotel booking but the cancel button is not working. I need to cancel urgently due to emergency.',
    status: 'open',
    priority: 'high',
    createdDate: '2024-03-20',
    lastUpdated: '2024-03-20'
  },
  {
    id: '2',
    user: 'John Dela Cruz',
    email: 'john.delacruz@email.com',
    type: 'suggestion',
    category: 'App Features',
    subject: 'Add dark mode to the app',
    description: 'It would be great if the app had a dark mode option for better viewing at night.',
    status: 'in_progress',
    priority: 'medium',
    createdDate: '2024-03-18',
    lastUpdated: '2024-03-19',
    assignedTo: 'Dev Team'
  },
  {
    id: '3',
    user: 'Ana Rodriguez',
    email: 'ana.rodriguez@email.com',
    type: 'bug_report',
    category: 'Payment',
    subject: 'Payment failed but money was deducted',
    description: 'My payment failed during checkout but the money was still deducted from my account. Transaction ID: TXN123456',
    status: 'resolved',
    priority: 'urgent',
    createdDate: '2024-03-15',
    lastUpdated: '2024-03-17',
    assignedTo: 'Finance Team'
  },
  {
    id: '4',
    user: 'Carlos Mendoza',
    email: 'carlos.mendoza@email.com',
    type: 'feature_request',
    category: 'Search',
    subject: 'Better search filters',
    description: 'Please add more search filters like price range, ratings, and amenities to make finding places easier.',
    status: 'open',
    priority: 'low',
    createdDate: '2024-03-10',
    lastUpdated: '2024-03-10'
  }
]

export default function ComplaintsPage() {
  const [complaints] = useState<Complaint[]>(mockComplaints)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'complaint' | 'suggestion' | 'bug_report' | 'feature_request'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter
    return matchesSearch && matchesType && matchesStatus && matchesPriority
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint': return AlertTriangle
      case 'suggestion': return MessageSquare
      case 'bug_report': return AlertTriangle
      case 'feature_request': return MessageSquare
      default: return MessageSquare
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint': return 'text-red-600'
      case 'suggestion': return 'text-blue-600'
      case 'bug_report': return 'text-orange-600'
      case 'feature_request': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    console.log(`Changing complaint ${complaintId} status to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Complaints & Suggestions</h1>
        <div className="text-sm text-gray-500">
          Total: {complaints.length} items
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-red-600">
                {complaints.filter(c => c.status === 'open').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {complaints.filter(c => c.status === 'in_progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {complaints.filter(c => c.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Priority</p>
              <p className="text-2xl font-bold text-purple-600">
                {complaints.filter(c => c.priority === 'urgent').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-500" />
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
                placeholder="Search by subject, user, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="complaint">Complaints</option>
              <option value="suggestion">Suggestions</option>
              <option value="bug_report">Bug Reports</option>
              <option value="feature_request">Feature Requests</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredComplaints.map((complaint) => {
          const TypeIcon = getTypeIcon(complaint.type)
          return (
            <div key={complaint.id} className="card hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => setSelectedComplaint(complaint)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TypeIcon className={`h-4 w-4 ${getTypeColor(complaint.type)}`} />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {complaint.type.replace('_', ' ')}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(complaint.priority)}`} 
                       title={`${complaint.priority} priority`} />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{complaint.subject}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{complaint.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{complaint.user}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(complaint.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              {complaint.assignedTo && (
                <div className="mt-2 text-xs text-blue-600">
                  Assigned to: {complaint.assignedTo}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No complaints found matching your criteria.</p>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedComplaint.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 capitalize">
                      {selectedComplaint.type.replace('_', ' ')}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{selectedComplaint.category}</span>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedComplaint.priority)}`} />
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">User Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Name:</strong> {selectedComplaint.user}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedComplaint.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{selectedComplaint.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                    <select
                      value={selectedComplaint.status}
                      onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                      className="input w-full"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assign To</h4>
                    <select className="input w-full">
                      <option value="">Unassigned</option>
                      <option value="support">Support Team</option>
                      <option value="dev">Dev Team</option>
                      <option value="finance">Finance Team</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Response</h4>
                  <textarea 
                    className="input w-full h-24 resize-none" 
                    placeholder="Type your response..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="flex-1 btn-primary">
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}