import { Users, Megaphone, MessageSquare, DollarSign, TrendingUp, Eye } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const statsCards = [
  { title: 'Total Users', value: '12,543', change: '+12%', changeType: 'positive' as const, icon: Users, color: 'bg-marigold text-ink' },
  { title: 'Active Ads', value: '89', change: '+5%', changeType: 'positive' as const, icon: Megaphone, color: 'bg-palm text-white' },
  { title: 'Complaints', value: '23', change: '-8%', changeType: 'negative' as const, icon: MessageSquare, color: 'bg-coral text-white' },
  { title: 'Revenue', value: '₦45,230', change: '+18%', changeType: 'positive' as const, icon: DollarSign, color: 'bg-ink text-ivory' },
]

const userGrowthData = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1800 }, { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3200 }, { month: 'May', users: 4100 }, { month: 'Jun', users: 5200 },
  { month: 'Jul', users: 6800 }, { month: 'Aug', users: 8500 }, { month: 'Sep', users: 10200 },
  { month: 'Oct', users: 11800 }, { month: 'Nov', users: 12100 }, { month: 'Dec', users: 12543 },
]

const revenueData = [
  { month: 'Jan', revenue: 12000 }, { month: 'Feb', revenue: 18000 }, { month: 'Mar', revenue: 24000 },
  { month: 'Apr', revenue: 32000 }, { month: 'May', revenue: 41000 }, { month: 'Jun', revenue: 45230 },
]

const categoryData = [
  { name: 'Hotels', value: 35, color: '#D9891F' },
  { name: 'Restaurants', value: 25, color: '#D9422E' },
  { name: 'Tours', value: 20, color: '#146B5E' },
  { name: 'Transport', value: 15, color: '#1C1710' },
  { name: 'Others', value: 5, color: '#B8A889' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Dashboard</h1>
          <p className="text-sm text-ink/60 mt-1">Platform overview — {new Date().toLocaleDateString('en-NG', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">{stat.title}</p>
                  <p className="font-display text-3xl font-extrabold text-ink mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 ${stat.changeType === 'positive' ? 'text-palm' : 'text-coral'}`} />
                    <span className={`text-sm ml-1 font-medium ${stat.changeType === 'positive' ? 'text-palm' : 'text-coral'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-ink/50 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-2xl`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-ink">User Growth</h3>
            <Eye className="h-5 w-5 text-ink/40" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" />
              <XAxis dataKey="month" stroke="#6B6255" />
              <YAxis stroke="#6B6255" />
              <Tooltip contentStyle={{ background: '#FFF', border: '1px solid #E8E0D4', borderRadius: 12 }} />
              <Line type="monotone" dataKey="users" stroke="#D9891F" strokeWidth={3} dot={{ fill: '#D9891F', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-ink">Monthly Revenue</h3>
            <DollarSign className="h-5 w-5 text-ink/40" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" />
              <XAxis dataKey="month" stroke="#6B6255" />
              <YAxis stroke="#6B6255" />
              <Tooltip formatter={(v) => [`₦${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: '#FFF', border: '1px solid #E8E0D4', borderRadius: 12 }} />
              <Bar dataKey="revenue" fill="#146B5E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="font-display text-lg font-bold text-ink mb-6">Ad Categories</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={4} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-ink/70">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-ink">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-display text-lg font-bold text-ink mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New user registration', user: 'Maria Santos', time: '2 minutes ago', type: 'user' },
              { action: 'Ad approved', user: 'Hotel Paradise', time: '15 minutes ago', type: 'ad' },
              { action: 'Complaint resolved', user: 'John Doe', time: '1 hour ago', type: 'complaint' },
              { action: 'Payment received', user: 'Beach Resort', time: '2 hours ago', type: 'payment' },
              { action: 'New ad submitted', user: 'Local Restaurant', time: '3 hours ago', type: 'ad' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-sand-200 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mr-3 ${
                    activity.type === 'user' ? 'bg-marigold' :
                    activity.type === 'ad' ? 'bg-palm' :
                    activity.type === 'complaint' ? 'bg-coral' : 'bg-ink'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-ink">{activity.action}</p>
                    <p className="text-xs text-ink/50">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-ink/40">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
