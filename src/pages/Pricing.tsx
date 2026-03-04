import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-slate-600">Choose the plan that best fits your needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl shadow-sm p-8 border flex flex-col hover:shadow-lg ${plan.current
              ? 'border-indigo-600 ring-2 ring-indigo-600'
              : (plan as any).popular
                ? 'border-indigo-300'
                : 'border-slate-200'
              }`}
          >
            {(plan as any).popular && !plan.current && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                MOST POPULAR
              </div>
            )}
            {plan.current && (
              <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                CURRENT
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
              {plan.period && <span className="text-slate-500 ml-2 text-sm">{plan.period}</span>}
            </div>

            <ul className="mb-8 space-y-3 flex-grow">
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-700 font-medium text-sm">{plan.credits}</span>
              </li>
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {plan.current ? (
                <button disabled className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-400 font-medium bg-slate-50 cursor-not-allowed text-sm">
                  Current Plan
                </button>
              ) : plan.id === 'free' ? (
                <button disabled className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-400 font-medium bg-slate-50 cursor-not-allowed text-sm">
                  Default Plan
                </button>
              ) : !user ? (
                <Link
                  to="/login"
                  className="block w-full text-center py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all duration-200 text-sm"
                >
                  Login to Purchase
                </Link>
              ) : showButtons && (plan as any).ncpId ? (
                <PayPalHostedButton hostedButtonId={(plan as any).ncpId} />
              ) : (
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse mt-4" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center text-slate-400 text-xs bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          SSL Secured Payment • Powered by PayPal
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Credits added automatically after payment. All sales are final.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
