import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="tech-card p-10 w-full max-w-md relative overflow-hidden">
        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="text-center mb-10">
          <div className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] mb-4 opacity-50">Identity Verification</div>
          <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter neon-glow">Terminal Access</h2>
        </div>

        {error && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300">
            Auth Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">Universal Pointer [Email]</label>
            <input
              type="email"
              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-medium transition-all placeholder:text-muted-foreground/20"
              placeholder="user@neural.link"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase ml-1">Access Cipher [Password]</label>
            <input
              type="password"
              className="w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 text-foreground font-medium transition-all placeholder:text-muted-foreground/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary-tech w-full py-4 text-xs uppercase tracking-[0.2em] mt-4"
          >
            Authorize Connection
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            New Entity? <Link to="/register" className="text-primary hover:text-primary/80 font-black uppercase tracking-widest ml-1 transition-colors">Register Port</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
