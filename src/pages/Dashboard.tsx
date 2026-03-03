import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm uppercase font-semibold tracking-wider">Current Plan</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{user?.plan || 'Free'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm uppercase font-semibold tracking-wider">Credits Remaining</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{user?.credits || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm uppercase font-semibold tracking-wider">Account Status</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">Active</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/generate" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
            Generate Image
          </Link>
          <Link to="/pricing" className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
            Upgrade Plan
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
