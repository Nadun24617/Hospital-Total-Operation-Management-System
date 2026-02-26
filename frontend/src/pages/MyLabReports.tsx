import React from 'react';

import { useNavigate } from 'react-router-dom';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import LabManagement from '../components/LabManagement';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const MyLabReports: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !token) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <PatientDashboardNavBar navLinks={navLinks} />
        <main className="flex-1 max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">My Lab Reports</h1>
            <p className="text-muted-foreground">Please log in to view your lab reports.</p>
            <Button
              className="mt-2 bg-primary text-white hover:bg-primary/90 font-semibold px-6"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <PatientDashboardNavBar navLinks={navLinks} />
      <main className="flex-1 max-w-6xl mx-auto mt-8 px-4 pb-10 space-y-8">
        <Card className="p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">My Lab Reports</h1>
          <p className="text-muted-foreground text-sm">
            View your completed lab reports and download or print them.
          </p>
        </Card>

        <LabManagement mode="patient" />
      </main>
      <Footer />
    </div>
  );
};

export default MyLabReports;
