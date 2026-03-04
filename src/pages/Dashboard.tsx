import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Dashboard = () => {
  const { user } = useAuthStore();

  const metrics = [
    { label: 'Neural Plan', value: user?.plan || 'Free', tag: 'SYS-PLAN' },
    { label: 'Compute Credits', value: user?.credits || 0, tag: 'SYS-CRED' },
    { label: 'Core Status', value: 'Active', tag: 'SYS-STAT', color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow mb-2">Control Center</h1>
          <p className="text-muted-foreground font-medium">Monitoring system parameters and neural access.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_theme(colors.emerald.500)]" />
          <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">Global Link Established</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="tech-card p-6 border-l-4 border-l-primary/30"
          >
            <div className="text-[10px] font-mono text-primary mb-4 opacity-50 tracking-widest">{metric.tag}</div>
            <h3 className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] mb-1">{metric.label}</h3>
            <p className={`text-4xl font-black uppercase tracking-tight ${metric.color || 'text-foreground'}`}>
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">System Directives</h2>
          <div className="flex-grow h-px bg-white/5" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/generate" className="btn-primary-tech group w-full">
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Generate Assets
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/pricing" className="flex items-center justify-center p-3 text-sm font-black text-muted-foreground uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-foreground transition-all h-full">
              Upgrade Access
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
