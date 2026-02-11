import React, { useEffect, useMemo, useState } from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import type { StoredAppointment, AppointmentStatus } from './AppointmentBooking';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const APPOINTMENTS_KEY = 'appointments';

const statusLabel: Record<AppointmentStatus, string> = {
  UPCOMING: 'Upcoming',
  PAST: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusVariant: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive'> = {
  UPCOMING: 'default',
  PAST: 'secondary',
  CANCELLED: 'destructive',
};

const statusBadgeClass: Record<AppointmentStatus, string> = {
  UPCOMING: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  PAST: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
};

const MyAppointments: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<StoredAppointment[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    const all: StoredAppointment[] = raw ? JSON.parse(raw) : [];
    if (!user) {
      setAppointments([]);
      return;
    }
    const mine = all.filter((a) => a.patientId === user.id);

    const now = new Date();
    mine.forEach((a) => {
      if (a.status === 'UPCOMING') {
        const dt = new Date(`${a.date}T${a.timeSlot}:00`);
        if (dt.getTime() < now.getTime()) {
          a.status = 'PAST';
        }
      }
    });

    const merged = all.map((a) => {
      const updated = mine.find((m) => m.id === a.id);
      return updated ?? a;
    });
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(merged));

    setAppointments(mine);
  }, [user]);

  const upcoming = useMemo(
    () => appointments.filter((a) => a.status === 'UPCOMING'),
    [appointments],
  );
  const past = useMemo(() => appointments.filter((a) => a.status === 'PAST'), [appointments]);
  const cancelled = useMemo(
    () => appointments.filter((a) => a.status === 'CANCELLED'),
    [appointments],
  );

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    const all: StoredAppointment[] = raw ? JSON.parse(raw) : [];
    const updatedAll = all.map((a) => (a.id === id ? { ...a, status } : a));
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAll));
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="relative">
          <PatientDashboardNavBar navLinks={navLinks} />
        </div>
        <main className="max-w-3xl mx-auto mt-12 px-4">
          <Card className="rounded-3xl shadow p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-bold text-blue-800">My Appointments</h1>
            <p className="text-gray-600">Please log in to view your appointments.</p>
            <Button
              className="mt-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6"
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

  const renderAppointmentCard = (a: StoredAppointment) => (
    <Card
      key={a.id}
      className="rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-blue-800">{a.doctorName}</h3>
          <Badge
            variant={statusVariant[a.status]}
            className={statusBadgeClass[a.status]}
          >
            {statusLabel[a.status]}
          </Badge>
        </div>
        <p className="text-blue-500 text-sm mb-1">{a.specialization}</p>
        <p className="text-gray-600 text-sm mb-1">
          {a.date} at {a.timeSlot}
        </p>
        <p className="text-gray-500 text-xs mb-1">{a.hospital} • {a.department}</p>
        <p className="text-gray-500 text-xs">Queue number: {a.queueNumber}</p>
      </div>
      <div className="flex flex-col items-end gap-2 text-xs md:text-sm">
        <div className="text-gray-500">Appointment ID: {a.id}</div>
        <div className="flex flex-wrap gap-2 justify-end">
          {a.status === 'UPCOMING' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => updateAppointmentStatus(a.id, 'CANCELLED')}
            >
              Cancel
            </Button>
          )}
          {a.status === 'UPCOMING' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() =>
                window.alert('Reschedule flow can be implemented to reopen booking with this appointment pre-filled.')
              }
            >
              Reschedule
            </Button>
          )}
          {a.status === 'PAST' && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() =>
                window.alert('Consultation summary view can be implemented once backend data is available.')
              }
            >
              View summary
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>
      <main className="max-w-6xl mx-auto mt-8 px-4 pb-10 space-y-8">
        <Card className="rounded-3xl shadow p-6 md:p-8">
          <h1 className="text-2xl font-bold text-blue-800 mb-2">My Appointments</h1>
          <p className="text-gray-600 text-sm mb-4">
            View and manage your upcoming, past and cancelled appointments.
          </p>
        </Card>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-800">Upcoming appointments</h2>
            <Button
              className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
              onClick={() => navigate('/appointments')}
            >
              Book new appointment
            </Button>
          </div>
          {upcoming.length === 0 ? (
            <Card className="rounded-2xl p-5 text-sm text-gray-500">
              You have no upcoming appointments.
            </Card>
          ) : (
            <div className="space-y-3">{upcoming.map(renderAppointmentCard)}</div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800">Past appointments</h2>
          {past.length === 0 ? (
            <Card className="rounded-2xl p-5 text-sm text-gray-500">
              No completed appointments yet.
            </Card>
          ) : (
            <div className="space-y-3">{past.map(renderAppointmentCard)}</div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-blue-800">Cancelled appointments</h2>
          {cancelled.length === 0 ? (
            <Card className="rounded-2xl p-5 text-sm text-gray-500">
              No cancelled appointments.
            </Card>
          ) : (
            <div className="space-y-3">{cancelled.map(renderAppointmentCard)}</div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyAppointments;
