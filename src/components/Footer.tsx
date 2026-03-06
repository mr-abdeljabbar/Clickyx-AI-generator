import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    try {
      const response = await fetch('https://formspree.io/f/xkoqwayb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, _subject: 'New Newsletter Subscriber' }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="mt-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand & Socials */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground uppercase tracking-tighter neon-glow-text">
                Clickyx <span className="text-primary">AI</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em] mt-1">
                Neural_Interface_OS
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pr-4">
              High-throughput digital asset synthesis protocol. Transforming neural concepts into flawless visual media.
            </p>
            <div className="flex gap-4">
              {[
                { label: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { label: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: 'var(--color-primary)' }}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:border-primary/50 transition-all shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_theme(colors.primary/20)] cursor-pointer"
                  title={social.label}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Platform Engine</h3>
            <ul className="space-y-3">
              {[
                { name: 'Terminal (Home)', path: '/' },
                { name: 'Core Dashboard', path: '/dashboard' },
                { name: 'Neural Pricing', path: '/pricing' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Info Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Information Directory</h3>
            <ul className="space-y-3">
              {[
                { name: 'About Protocol', path: '/about' },
                { name: 'Initiate Contact', path: '/contact' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Liability Disclaimer', path: '/disclaimer' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Network Updates
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to the broadcast channel for algorithm updates and exclusive token grants.
            </p>

            {status === 'success' ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-xs font-medium text-emerald-500">Node successfully registered.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Establish connection..."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-500">Connection failed. Retry transmission.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-white/5 hover:bg-primary/20 text-foreground text-sm font-bold py-2 rounded-xl border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Clickyx_Archive. All Systems Nominal.
          </p>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* HUD Elements */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/30" />
    </footer>
  );
}
