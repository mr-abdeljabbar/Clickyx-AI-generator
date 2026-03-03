import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuthStore } from '../store/authStore';

const Pricing = () => {
  const { user } = useAuthStore();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      credits: '3 Credits / Month',
      features: ['Standard Speed', 'Public Images'],
      current: user?.plan === 'FREE',
    },
    {
      name: 'Pro',
      price: '$15 / Month',
      credits: '50 Credits / Month',
      features: ['Fast Speed', 'Private Images', 'Priority Support'],
      current: user?.plan === 'PRO',
      paypalPlanId: 'P-YOUR_PAYPAL_PLAN_ID', // Replace with actual Plan ID
    },
    {
      name: 'Lifetime',
      price: '$50 One-time',
      credits: '150 Credits Total',
      features: ['No Expiry', 'All Pro Features'],
      current: user?.plan === 'LIFETIME',
      oneTime: true,
    },
  ];

  return (
    <>
      <PayPalScriptProvider options={{ clientId: "test" }}> {/* Replace "test" with process.env.PAYPAL_CLIENT_ID */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600">Choose the plan that best fits your needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative bg-white rounded-2xl shadow-sm p-8 border transition-all duration-300 hover:shadow-lg ${
                plan.current 
                  ? 'border-indigo-600 ring-1 ring-indigo-600' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              {plan.current && (
                <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  CURRENT
                </div>
              )}
              
              <h2 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h2>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price.split(' ')[0]}</span>
                <span className="text-slate-500 ml-2">{plan.price.split(' ').slice(1).join(' ')}</span>
              </div>
              
              <ul className="mb-8 space-y-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">{plan.credits}</span>
                </li>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                {plan.current ? (
                  <button disabled className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-400 font-medium bg-slate-50 cursor-not-allowed">
                    Current Plan
                  </button>
                ) : plan.name === 'Free' ? (
                  <button disabled className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-400 font-medium bg-slate-50 cursor-not-allowed">
                    Default Plan
                  </button>
                ) : (
                  <div className="w-full">
                     <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "pay" }}
                        className="z-0"
                        createSubscription={plan.paypalPlanId ? (data, actions) => {
                          return actions.subscription.create({
                            plan_id: plan.paypalPlanId!,
                            custom_id: user?.id // Pass userId
                          });
                        } : undefined}
                        createOrder={plan.oneTime ? (data, actions) => {
                          return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                  {
                                      amount: {
                                          currency_code: "USD",
                                          value: "50.00",
                                      },
                                      custom_id: `LIFETIME_${user?.id}`
                                  },
                              ],
                          });
                        } : undefined}
                     />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default Pricing;
