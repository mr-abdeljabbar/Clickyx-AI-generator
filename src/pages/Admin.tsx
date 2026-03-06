import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'motion/react';
import { Users, Image as ImageIcon, DollarSign, Database, ShieldAlert, Activity, ChevronDown, Trash2 } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdjustCredits = async (userId: string, amount: number) => {
    try {
      await api.post('/admin/credits', { userId, amount });
      fetchAdminData();
    } catch (error) {
      alert('Failed to adjust credits');
    }
  };

  const handlePlanChange = async (userId: string, newPlan: string) => {
    try {
      await api.post('/admin/plan', { userId, plan: newPlan });
      fetchAdminData();
    } catch (error) {
      alert('Failed to update user plan');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (window.confirm(`Initiate Terminal Purge for Entity ${email}? This action is irreversible and will cascade delete all associated data.`)) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchAdminData();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to purge entity');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-secondary rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        <Database className="w-8 h-8 text-primary animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/10 pb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter neon-glow">Central Core</h1>
          </div>
          <p className="text-muted-foreground font-medium pl-11">Administrative overview and entity control interface.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_theme(colors.emerald.500/50)]" />
          <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Root System Online</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Nodes', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
          { label: 'Generated Assets', value: stats?.totalImages || 0, icon: ImageIcon, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
          { label: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative p-6 rounded-2xl bg-card/60 backdrop-blur-xl border ${stat.border} overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-3xl transition-all`} />
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</h3>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-5xl font-black ${stat.color} tracking-tighter drop-shadow-lg`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Users Database Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl bg-card/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Entity Directory</h2>
          </div>
          <div className="px-4 py-1.5 rounded-full bg-black/50 border border-white/10 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {users.length} Entries Found
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-black/20 border-b border-white/5">
              <tr>
                {['Pointer (Email)', 'Privilege', 'Protocol Tier', 'Processing Power', 'Authority Controls'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-primary opacity-70" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${user.role === 'ADMIN'
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_theme(colors.primary/20)]'
                      : 'bg-white/5 text-muted-foreground border border-white/10'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative inline-block w-40">
                      <select
                        value={user.plan}
                        onChange={(e) => handlePlanChange(user.id, e.target.value)}
                        className="appearance-none w-full bg-black/50 border border-white/10 text-white text-xs font-bold rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                      >
                        <option value="FREE">FREE Node</option>
                        <option value="PRO">PRO Node</option>
                        <option value="LIFETIME">LIFETIME Node</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 w-48">
                      <span className="text-sm font-bold text-foreground w-8">{user.credits}</span>
                      <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${Math.min(100, (user.credits / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2 relative">
                      <button
                        onClick={() => handleAdjustCredits(user.id, 10)}
                        className="flex items-center justify-center w-10 h-10 border border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white rounded-lg transition-all shadow-[0_0_10px_theme(colors.emerald.500/10)]"
                        title="Inject 10 Credits"
                      >
                        <span className="text-lg font-black leading-none">+</span>
                      </button>
                      <button
                        onClick={() => handleAdjustCredits(user.id, -10)}
                        className="flex items-center justify-center w-10 h-10 border border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500 hover:text-white rounded-lg transition-all shadow-[0_0_10px_theme(colors.amber.500/10)]"
                        title="Drain 10 Credits"
                      >
                        <span className="text-lg font-black leading-none">-</span>
                      </button>
                      <div className="w-px h-10 bg-white/10 mx-1" />
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="flex items-center justify-center w-10 h-10 border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-[0_0_10px_theme(colors.red.500/10)] group overflow-hidden relative"
                        title="Terminal Purge (Delete User)"
                      >
                        <Trash2 className="w-4 h-4 relative z-10" />
                        <div className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default Admin;
