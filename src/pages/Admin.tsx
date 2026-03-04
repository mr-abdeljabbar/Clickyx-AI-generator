import { useEffect, useState } from 'react';
import api from '../services/api';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/stats'),
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdjustCredits = async (userId: string, amount: number) => {
    try {
      await api.post('/admin/credits', { userId, amount });
      // Refresh users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (error) {
      alert('Failed to adjust credits');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6 mb-2">
        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow">Central Control</h1>
        <div className="flex-grow h-px bg-white/5" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_theme(colors.emerald.500/50)]" />
          <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Authority: Root_Link</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Neural Nodes', value: stats?.totalUsers || 0, color: 'text-primary' },
          { label: 'Synapse Assets', value: stats?.totalImages || 0, color: 'text-secondary' },
          { label: 'Revenue Stream', value: `$${stats?.totalRevenue || 0}`, color: 'text-emerald-500' }
        ].map((stat, i) => (
          <div key={i} className="tech-card p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-12 h-12 border-t-2 border-r-2 border-primary" />
            </div>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4">{stat.label}</h3>
            <p className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="tech-card overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Entity Directory</h2>
          <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-50">Filter: All_Entries</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/2 border-b border-white/5">
              <tr>
                {['Pointer', 'Privilege', 'Tier', 'Power', 'Command'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[10px] font-black text-primary uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 text-sm font-medium text-foreground">{user.email}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${user.role === 'ADMIN'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white/5 text-muted-foreground border border-white/10'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono text-muted-foreground uppercase tracking-wider">{user.plan}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{user.credits}</span>
                      <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (user.credits / 100) * 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdjustCredits(user.id, 10)}
                        className="p-2 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 rounded transition-all"
                        title="+10 Credits"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-60H6" /></svg>
                      </button>
                      <button
                        onClick={() => handleAdjustCredits(user.id, -10)}
                        className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded transition-all"
                        title="-10 Credits"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
