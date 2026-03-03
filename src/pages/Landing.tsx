import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl py-24 sm:py-32 lg:py-40 text-center">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20">
            Announcing our next generation AI models. <a href="#" className="font-semibold text-indigo-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6">
          Generate AI Images with <span className="text-indigo-600">AI Gen</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Create stunning visuals in seconds using our advanced AI models. 
          Start for free and upgrade as you grow. No credit card required.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
          >
            Get Started
          </Link>
          <Link to="/login" className="text-sm font-semibold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
            Log in <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      
      {/* Feature Grid (Optional addition for better landing page) */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            {[
              { title: 'Fast Generation', description: 'Get results in seconds with our optimized inference engine.' },
              { title: 'High Quality', description: 'Crystal clear 4K resolution images suitable for professional use.' },
              { title: 'Commercial Rights', description: 'You own the images you create. Use them anywhere.' },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
