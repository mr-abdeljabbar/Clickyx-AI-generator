import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

// Mirrors PayPal's own generated embed code exactly:
// <div id="paypal-container-{ID}"></div>
// paypal.HostedButtons({ hostedButtonId: "{ID}" }).render("#paypal-container-{ID}")
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

    // Wait 1s then try — gives layout time to settle
    const id = setTimeout(tryRender, 1000);
    return () => clearTimeout(id);
  }, [hostedButtonId, containerId, attempted]);

  return (
    <div className="mt-4">
      {error && (
        <div className="text-xs text-red-400 mb-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          PayPal error: {error}
        </div>
      )}
      {/* This exact ID is REQUIRED by PayPal's SDK */}
      <div id={containerId} style={{ minHeight: '45px' }} />
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
      price: '$0',
      period: '',
      credits: '3 Credits / Month',
      features: ['Standard Speed', 'Public Images'],
      current: user?.plan === 'FREE',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$15',
      period: '/ Month',
      credits: '50 Credits / Month',
      features: ['Fast Speed', 'Private Images', 'Priority Support'],
      current: user?.plan === 'PRO',
      ncpId: proId,
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '$50',
      period: 'One-time',
      credits: '150 Credits Total',
      features: ['No Expiry', 'All Pro Features', 'Lifetime Access'],
      current: user?.plan === 'LIFETIME',
      ncpId: lifetimeId,
    },
  ];

  useEffect(() => {
    // Wait 800ms for all CSS transitions to fully complete before we allow PayPal to render
    const t = setTimeout(() => setShowButtons(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black text-foreground uppercase tracking-tighter neon-glow mb-4">Neural Access Plans</h1>
        <p className="text-lg text-muted-foreground font-medium">Select your node tier to unlock advanced synaptic processing.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`tech-card relative p-8 flex flex-col group ${plan.current
              ? 'border-primary ring-1 ring-primary/50 bg-primary/5'
              : (plan as any).popular
                ? 'border-secondary/40'
                : ''
              }`}
          >
            {(plan as any).popular && !plan.current && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-black tracking-widest px-6 py-1.5 rounded-full shadow-lg shadow-secondary/20 uppercase">
                Optimized Tier
              </div>
            )}
            {plan.current && (
              <div className="absolute top-0 right-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-b-lg uppercase tracking-widest shadow-[0_0_10px_theme(colors.emerald.500/20)]">
                Linked
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 opacity-70">Node: {plan.name}</h2>
              <div className="flex items-baseline">
                <span className="text-5xl font-black text-foreground tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-2 text-xs font-bold uppercase tracking-widest">{plan.period}</span>}
              </div>
            </div>

            <ul className="mb-10 space-y-4 flex-grow">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                  <div className="w-1.5 h-1.5 bg-primary rounded-sm" />
                </div>
                <span className="text-foreground font-bold text-xs uppercase tracking-tight">{plan.credits}</span>
              </li>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-sm" />
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto relative z-20">
              {plan.current ? (
                <div className="w-full py-4 text-center text-emerald-500 text-xs font-black uppercase tracking-widest bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  Node Active
                </div>
              ) : plan.id === 'free' ? (
                <div className="w-full py-4 text-center text-muted-foreground text-xs font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl">
                  Default Tier
                </div>
              ) : !user ? (
                <Link
                  to="/login"
                  className="btn-primary-tech w-full uppercase tracking-widest text-xs"
                >
                  Access Required
                </Link>
              ) : showButtons && (plan as any).ncpId ? (
                <div className="relative group/btn">
                  <PayPalHostedButton hostedButtonId={(plan as any).ncpId} />
                  {/* Styling the container to look better but PayPal will inject its own button */}
                </div>
              ) : (
                <div className="h-14 bg-white/5 rounded-xl animate-pulse mt-4 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* HUD Corner Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none opacity-20 border-b-2 border-l-2 border-primary/50 rounded-bl-xl" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-panel border border-white/10 group cursor-default">
          <svg className="w-4 h-4 text-primary group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Encrypted Node Transition via PayPal</span>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
