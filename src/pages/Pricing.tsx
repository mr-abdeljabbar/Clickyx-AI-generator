import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Shield, Infinity as InfinityIcon } from 'lucide-react';

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

const PayPalHostedButton = ({ hostedButtonId }: PayPalHostedButtonProps) => {
  const containerId = `paypal-container-${hostedButtonId}`;
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attempted) return;

    const tryRender = () => {
      const paypal = (window as any).paypal;
      if (!paypal?.HostedButtons) {
        setTimeout(tryRender, 1000);
        return;
      }
      const container = document.getElementById(containerId);
      if (!container) {
        setTimeout(tryRender, 500);
        return;
      }

      setAttempted(true);
      paypal
        .HostedButtons({ hostedButtonId })
        .render(`#${containerId}`)
        .catch((err: any) => {
          setError(err?.message || String(err));
          console.error(`[PayPal] ${hostedButtonId}:`, err);
        });
    };

    const id = setTimeout(tryRender, 1000);
    return () => clearTimeout(id);
  }, [hostedButtonId, containerId, attempted]);

  return (
    <div className="mt-6">
      {error && (
        <div className="text-xs text-red-400 mb-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
          Connection Error: {error}
        </div>
      )}
      <div id={containerId} className="min-h-[45px] transition-all duration-300 hover:scale-[1.02]" />
    </div>
  );
};

const Pricing = () => {
  const { user } = useAuthStore();
  const [showButtons, setShowButtons] = useState(false);

  const proId = import.meta.env.VITE_PAYPAL_NCP_PRO_ID || 'FJ3DL4RKJPNZQ';
  const lifetimeId = import.meta.env.VITE_PAYPAL_NCP_LIFETIME_ID || '236SD6UT8ECSG';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for exploring the neural engine.',
      price: '$0',
      period: 'Forever',
      credits: '3 Credits / Month',
      icon: <Zap className="w-5 h-5 text-zinc-400" />,
      features: ['Standard Generation Speed', 'Public Image Gallery', 'Community Support'],
      current: user?.plan === 'FREE',
      popular: false,
      color: 'zinc',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlock maximum creative potential.',
      price: '$15',
      period: '/ Month',
      credits: '50 Credits / Month',
      icon: <Shield className="w-5 h-5 text-primary" />,
      features: ['Lightning Fast Speed', 'Private Image History', 'Priority 24/7 Support', 'Commercial Usage Rights'],
      current: user?.plan === 'PRO',
      ncpId: proId,
      popular: true,
      color: 'primary',
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      description: 'One payment, perpetual access.',
      price: '$50',
      period: 'One-time',
      credits: '150 Credits Total',
      icon: <InfinityIcon className="w-5 h-5 text-secondary" />,
      features: ['No Expiration Date', 'All Pro Features Included', 'Early Access to Native Models', 'Lifetime V.I.P Status'],
      current: user?.plan === 'LIFETIME',
      ncpId: lifetimeId,
      popular: false,
      color: 'secondary',
    },
  ];

  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20 relative z-10"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase mb-6 shadow-[0_0_20px_theme(colors.primary/20)]">
          Neural Access Tiers
        </span>
        <h1 className="text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tighter mb-6 leading-tight">
          Supercharge Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-glow">Creativity</span>
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          Choose the protocol that fits your processing needs. No hidden fees, cancel anytime.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto mb-24 relative z-10">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            className="flex"
          >
            <div
              className={`flex flex-col w-full rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                ${plan.popular ? 'animated-border shadow-[0_0_30px_theme(colors.primary/15)] hover:shadow-[0_0_50px_theme(colors.primary/30)]' : 'bg-card/40 backdrop-blur-xl border border-white/10 hover:border-white/20'}
                ${plan.current ? 'ring-2 ring-emerald-500/50 bg-emerald-500/5' : ''}
              `}
            >
              {plan.popular && !plan.current && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-black tracking-widest px-6 py-1.5 rounded-full shadow-lg uppercase whitespace-nowrap z-20">
                  Most Popular
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-[0_0_15px_theme(colors.emerald.500/40)] z-20">
                  Active Protocol
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-black uppercase tracking-widest ${plan.color === 'primary' ? 'text-primary' : plan.color === 'secondary' ? 'text-secondary' : 'text-zinc-100'}`}>
                    {plan.name}
                  </h2>
                  <div className={`p-2 rounded-lg bg-${plan.color}/10`}>
                    {plan.icon}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium h-10">{plan.description}</p>
              </div>

              {/* Pricing */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <div className="flex items-end">
                  <span className="text-6xl font-black text-foreground tracking-tighter leading-none">{plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-sm font-bold uppercase tracking-widest pb-1">{plan.period}</span>
                </div>
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/5 rounded-md border border-white/5">
                  <span className="text-xs font-bold text-foreground uppercase tracking-widest">{plan.credits}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="mb-10 space-y-5 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : 'text-zinc-500'}`} />
                    <span className="text-muted-foreground text-sm font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Section */}
              <div className="mt-auto relative z-20">
                {plan.current ? (
                  <div className="w-full py-4 text-center text-emerald-500 text-sm font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    Currently Active
                  </div>
                ) : plan.id === 'free' ? (
                  <div className="w-full py-4 text-center text-muted-foreground text-sm font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl cursor-not-allowed">
                    Default Protocol
                  </div>
                ) : !user ? (
                  <Link
                    to="/login"
                    className={`btn-primary-tech w-full uppercase tracking-widest text-sm ${plan.popular ? 'bg-primary text-black hover:bg-white hover:text-black shadow-[0_0_20px_theme(colors.primary/40)]' : 'bg-white/10 text-white hover:bg-white/20 shadow-none'}`}
                    style={plan.popular ? {} : { backgroundColor: 'var(--color-muted)', color: 'white' }}
                  >
                    Authenticate to Upgrade
                  </Link>
                ) : showButtons && plan.ncpId ? (
                  <div className="relative group/btn w-full mt-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary/20 to-emerald-500/20 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-500 group-hover/btn:duration-200" />
                    <div className="relative bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 rounded-xl p-3 shadow-2xl transition-colors">
                      <div className="flex items-center gap-2 mb-1 w-full justify-center border-b border-white/5 pb-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest whitespace-nowrap">Secure Gateway</span>
                      </div>
                      <div className="-mt-2 w-full relative z-10 flex justify-center">
                        <PayPalHostedButton hostedButtonId={plan.ncpId} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[45px] mt-6 bg-white/5 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full bg-card/60 backdrop-blur-md border border-white/10 shadow-xl group cursor-default hover:border-white/20 transition-all">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] group-hover:text-foreground transition-colors">
            End-to-End Encrypted via PayPal Security
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
