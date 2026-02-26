

import { AuthProvider } from './auth';
import PatientDashboard from './pages/PatientDashboard';
import Login from './pages/Login';
import AboutHospital from './pages/AboutHospital';
import AboutDoctors from './pages/AboutDoctors';
import AppointmentBooking from './pages/AppointmentBooking';
import MyAppointments from './pages/MyAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import Dashboard from './pages/Dashboard';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';
import MyLabReports from './pages/MyLabReports';

import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutHospital />} />
        <Route path="/appointments" element={<AppointmentBooking />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-lab-reports" element={<MyLabReports />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/doctors" element={<AboutDoctors />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}
