import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Download, Filter, Search } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface Transaction {
  id: string
  type: 'commission' | 'ad_revenue' | 'subscription' | 'refund'
  business: string
  amount: number
  commission: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  description: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'commission',
    business: 'Paradise Beach Resort',
    amount: 15000,
    commission: 2250,
    date: '2024-03-20',
    status: 'completed',
    description: 'Booking commission - 15%'
  },
  {
    id: '2',
    type: 'ad_revenue',
    business: 'Manila Food Tours',
    amount: 5000,
    commission: 5000,
    date: '2024-03-19',
    status: 'completed',
    description: 'Monthly ad placement'
  },
  {
    id: '3',
    type: 'commission',
    business: 'Baguio Adventures',
    amount: 8000,
    commission: 1200,
    date: '2024-03-18',
    status: 'completed',
    description: 'Tour booking commission - 15%'
  },
  {
    id: '4',
    type: 'subscription',
    business: 'Elite Car Rentals',
    amount: 2500,
    commission: 2500,
    date: '2024-03-17',
    status: 'pending',
    description: 'Premium listing subscription'
  },
  {
    id: '5',
    type: 'refund',
    business: 'Beach Resort',
    amount: 3000,
    commission: -450,
    date: '2024-03-16',
    status: 'completed',
    description: 'Booking refund - commission returned'
  }
]

const revenueData = [
  { month: 'Jan', commission: 45000, ads: 25000, subscription: 15000 },
  { month: 'Feb', commission: 52000, ads: 28000, subscription: 18000 },
  { month: 'Mar', commission: 48000, ads: 32000, subscription: 22000 },
  { month: 'Apr', commission: 61000, ads: 35000, subscription: 25000 },
  { month: 'May', commission: 58000, ads: 38000, subscription: 28000 },
  { month: 'Jun', commission: 65000, ads: 42000, subscription: 30000 }
]

const revenueSourceData = [
  { name: 'Booking Commission', value: 65, color: '#3B82F6' },
  { name: 'Ad Revenue', value: 25, color: '#10B981' },
  { name: 'Subscriptions', value: 10, color: '#F59E0B' }
]

export default function WalletPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'commission' | 'ad_revenue' | 'subscription' | 'refund'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.commission > 0 ? t.commission : 0), 0)
  const monthlyRevenue = transactions
    .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + (t.commission > 0 ? t.commission : 0), 0)
  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.commission, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commission': return 'text-blue-600'
      case 'ad_revenue': return 'text-green-600'
      case 'subscription': return 'text-purple-600'
      case 'refund': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission': return DollarSign
      case 'ad_revenue': return TrendingUp
      case 'subscription': return CreditCard
      case 'refund': return TrendingDown
      default: return DollarSign
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Wallet & Revenue</h1>
        <button className="btn-primary flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+12% from last month</span>
              </div>
            </div>
            <Wallet className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-green-600">₱{monthlyRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+8% from last month</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">₱{pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting processing</p>
            </div>
            <CreditCard className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-purple-600">{transactions.length}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, '']} />
              <Line 
                type="monotone" 
                dataKey="commission" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Commission"
              />
              <Line 
                type="monotone" 
                dataKey="ads" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Ad Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="subscription" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Subscriptions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Sources */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Sources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={revenueSourceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {revenueSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {revenueSourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
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
                placeholder="Search transactions by business or description..."
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
              <option value="commission">Commission</option>
              <option value="ad_revenue">Ad Revenue</option>
              <option value="subscription">Subscription</option>
              <option value="refund">Refund</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const TypeIcon = getTypeIcon(transaction.type)
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className={`h-4 w-4 mr-3 ${getTypeColor(transaction.type)}`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">{transaction.description}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.business}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₱{transaction.amount.toLocaleString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        transaction.commission >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.commission >= 0 ? '+' : ''}₱{transaction.commission.toLocaleString()}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}