import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

type LocationState = { success?: string } | null;

const ProfileView: React.FC = () => {
  const { isLoggedIn, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;

  if (!isLoggedIn || !token || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <PatientDashboardNavBar navLinks={navLinks} />
        <main className="flex-1 max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
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
      <main className="flex-1 max-w-6xl mx-auto mt-8 px-4 pb-10 space-y-6">
        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">My Profile</h1>
              <p className="text-muted-foreground text-sm">
                View your personal information.
              </p>
            </div>
            <Button
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-5"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        {state?.success && (
          <Card className="p-4 border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
            {state.success}
          </Card>
        )}

        <Card className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Name</div>
              <div className="text-foreground font-medium">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</div>
              <div className="text-foreground font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</div>
              <div className="text-foreground font-medium">{user.phone}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Account</div>
              <div className="text-muted-foreground text-sm">
                Status: {user.status} • Confirmed: {user.isConfirmed ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileView;
