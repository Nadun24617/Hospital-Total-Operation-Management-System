
import { AuthProvider, useAuth } from './auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/PatientDashboard';
import { Routes, Route } from 'react-router-dom';


function AppRoutes() {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Login />;
  if (user?.role?.toLowerCase() === 'patient') {
    return <PatientDashboard />;
  }
  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppRoutes />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Routes>
    </AuthProvider>
  );
}
