import { useState } from 'react'
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Phone, MapPin } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
  lastActive: string
  totalBookings: number
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amina Bello',
    email: 'amina.bello@email.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    joinDate: '2024-01-15',
    status: 'active',
    lastActive: '2 hours ago',
    totalBookings: 12
  },
  {
    id: '2',
    name: 'Ahmed Ibrahim',
    email: 'ahmed.ibrahim@email.com',
    phone: '+234 802 345 6789',
    location: 'Abuja, Nigeria',
    joinDate: '2024-02-20',
    status: 'active',
    lastActive: '1 day ago',
    totalBookings: 8
  },
  {
    id: '3',
    name: 'Chidi Okoro',
    email: 'chidi.okoro@email.com',
    phone: '+234 803 456 7890',
    location: 'Port Harcourt, Nigeria',
    joinDate: '2024-03-10',
    status: 'inactive',
    lastActive: '1 week ago',
    totalBookings: 3
  },
  {
    id: '4',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@email.com',
    phone: '+234 804 567 8901',
    location: 'Kano, Nigeria',
    joinDate: '2024-01-05',
    status: 'suspended',
    lastActive: '2 weeks ago',
    totalBookings: 15
  },
  {
    id: '5',
    name: 'Fatima Ibrahim',
    email: 'fatima.ibrahim@email.com',
    phone: '+234 805 678 9012',
    location: 'Ibadan, Nigeria',
    joinDate: '2024-03-25',
    status: 'active',
    lastActive: '30 minutes ago',
    totalBookings: 6
  }
]

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended') => {
    // In a real app, this would make an API call
    console.log(`Changing user ${userId} status to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Total Users: {users.length}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-600">
                {users.filter(u => u.status === 'inactive').length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === 'suspended').length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => new Date(u.joinDate).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user.phone}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                    <div className="text-gray-500">Last active: {user.lastActive}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalBookings}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Suspend
                        </button>
                      ) : user.status === 'suspended' ? (
                        <button
                          onClick={() => handleStatusChange(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Activate
                        </button>
                      ) : null}
                      
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}