

import { AuthProvider } from './auth';
import PatientDashboard from './pages/PatientDashboard';
import Login from './pages/Login';

import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}
