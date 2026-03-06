import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import History from './pages/History';
import Pricing from './pages/Pricing';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generate" element={<Generator />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route element={<ProtectedRoute forbidAdmin={true} />}>
            <Route path="/pricing" element={<Pricing />} />
          </Route>

          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
