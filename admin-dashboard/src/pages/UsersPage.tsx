import { useEffect, useMemo, useState } from 'react'
import { Search, Mail, Users as UsersIcon } from 'lucide-react'
import { listenUsers, AdminUser } from '../lib/adminData'

function formatDate(ts: any): string {
  if (!ts?.toDate) return '—'
  return ts.toDate().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = listenUsers((data) => {
      setUsers(data)
      setLoading(false)
    })
    return unsub
  }, [])

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return users.filter((u) => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
  }, [users, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Users</h1>
          <p className="text-sm text-ink/60 mt-1">{users.length.toLocaleString()} total registered users</p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-ink/70">
        Users are mirrored into this list automatically the first time each person signs in on the
        website or app — this reflects real accounts, not a manually maintained list. Fields like
        phone number and booking count aren't tracked anywhere in the client app yet, so they're not
        shown here rather than being shown as fabricated placeholder values.
      </div>

      <div className="card">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {loading ? (
          <p className="text-sm text-ink/50 py-8 text-center">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <UsersIcon className="h-10 w-10 text-ink/20 mx-auto mb-3" />
            <p className="text-sm text-ink/50">
              {users.length === 0 ? 'No users have signed in yet.' : 'No users match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-ink/50 border-b border-sand-200">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-sand-100 last:border-b-0">
                    <td className="py-3 font-medium text-ink">{user.name}</td>
                    <td className="py-3 text-ink/70">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-ink/40" />
                        {user.email}
                      </span>
                    </td>
                    <td className="py-3 text-ink/70">{formatDate(user.createdAt)}</td>
                    <td className="py-3 text-ink/70">{formatDate(user.lastSeenAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
