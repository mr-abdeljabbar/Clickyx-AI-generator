import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await register({ email, password });
      setError('');
      setSuccess(response?.data?.message || 'Registration successful! Redirecting to login...');

      // Delay redirect slightly so user can see they were successful
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="tech-card p-10 w-full max-w-md relative overflow-hidden">
        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />

        <div className="text-center mb-10">
          <div className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-4 opacity-50">System Initialization</div>
          <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow">Create Account</h2>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest text-center shadow-[0_0_15px_theme(colors.red.500/10)]">
            Registry Error: {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest text-center shadow-[0_0_15px_theme(colors.emerald.500/10)] animate-pulse">
            Success: {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">Target Address [Email]</label>
            <input
              type="email"
              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary/50 text-foreground font-medium transition-all placeholder:text-muted-foreground/20"
              placeholder="entity@net.core"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">Secure Matrix [Password]</label>
            <input
              type="password"
              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary/50 text-foreground font-medium transition-all placeholder:text-muted-foreground/20"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary-tech w-full py-4 text-xs uppercase tracking-[0.2em] mt-4 bg-secondary shadow-secondary/20"
            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-secondary-foreground)' }}
          >
            Finalize Registry
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            Existing Node? <Link to="/login" className="text-secondary hover:text-secondary/80 font-black uppercase tracking-widest ml-1 transition-colors">Access Terminal</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
