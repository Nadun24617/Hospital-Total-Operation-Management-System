import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import type { AppointmentStatus } from './AppointmentBooking';
import { SPECIALIZATIONS } from '../constants/specializations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

interface ApiAppointment {
  id: number;
  doctorId: number;
  userId?: string | null;
  patientName: string;
  contactNumber: string;
  reason?: string | null;
  appointmentType: string;
  date: string;
  timeSlot: string;
  queueNumber: number;
  status: AppointmentStatus;
  createdAt: string;
  doctor?: { fullName: string; specializationId: number };
}

const DEFAULT_HOSPITAL_LABEL = 'ABC Hospital';

const statusLabel: Record<AppointmentStatus, string> = {
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const statusVariant: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive'> = {
  UPCOMING: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const statusBadgeClass: Record<AppointmentStatus, string> = {
  UPCOMING: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
};

const MyAppointments: React.FC = () => {
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  const specializationName = useMemo(() => {
    const map = new Map(SPECIALIZATIONS.map((s) => [s.id, s.name] as const));
    return (id: number | undefined | null) => {
      const safeId = id ?? 0;
      return map.get(safeId) || (safeId ? `#${safeId}` : 'Not specified');
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError('');

    void (async () => {
      try {
        const response = await axios.get<ApiAppointment[]>(
          `${import.meta.env.VITE_API_URL}/appointments/my`,
          { headers: authHeaders },
        );
        setAppointments(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message ?? 'Failed to load appointments.');
        } else {
          setError('Failed to load appointments.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn, token, authHeaders]);

  const upcoming = useMemo(
    () => appointments.filter((a) => a.status === 'UPCOMING'),
    [appointments],
  );
  const past = useMemo(() => appointments.filter((a) => a.status === 'COMPLETED'), [appointments]);
  const cancelled = useMemo(
    () => appointments.filter((a) => a.status === 'CANCELLED'),
    [appointments],
  );

  const cancelAppointment = async (id: number) => {
    if (!token) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/appointments/${id}/cancel`,
        {},
        { headers: authHeaders },
      );
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        window.alert(err.response?.data?.message ?? 'Failed to cancel appointment.');
      } else {
        window.alert('Failed to cancel appointment.');
      }
    }
  };

  if (!isLoggedIn || !token) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="relative">
          <PatientDashboardNavBar navLinks={navLinks} />
        </div>
        <main className="max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground">Please log in to view your appointments.</p>
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

  const renderAppointmentCard = (a: ApiAppointment) => {
    const doctorName = a.doctor?.fullName ?? `Doctor #${a.doctorId}`;
    const specialization = specializationName(a.doctor?.specializationId);
    const date = (a.date || '').slice(0, 10);
    const department = specialization;
    const hospital = DEFAULT_HOSPITAL_LABEL;

    return (
    <Card
      key={a.id}
      className="p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground">{doctorName}</h3>
          <Badge
            variant={statusVariant[a.status]}
            className={statusBadgeClass[a.status]}
          >
            {statusLabel[a.status]}
          </Badge>
        </div>
        <p className="text-primary text-sm mb-1">{specialization}</p>
        <p className="text-muted-foreground text-sm mb-1">
          {date} at {a.timeSlot}
        </p>
        <p className="text-muted-foreground text-xs mb-1">{hospital} • {department}</p>
        <p className="text-muted-foreground text-xs">Queue number: {a.queueNumber}</p>
      </div>
      <div className="flex flex-col items-end gap-2 text-xs md:text-sm">
        <div className="text-muted-foreground">Appointment ID: {a.id}</div>
        <div className="flex flex-wrap gap-2 justify-end">
          {a.status === 'UPCOMING' && (
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => void cancelAppointment(a.id)}
            >
              Cancel
            </Button>
          )}
          {a.status === 'UPCOMING' && (
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-accent"
              onClick={() =>
                window.alert('Reschedule flow can be implemented to reopen booking with this appointment pre-filled.')
              }
            >
              Reschedule
            </Button>
          )}
          {a.status === 'COMPLETED' && (
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-accent"
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
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>
      <main className="max-w-6xl mx-auto mt-8 px-4 pb-10 space-y-8">
        <Card className="p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">My Appointments</h1>
          <p className="text-muted-foreground text-sm mb-4">
            View and manage your upcoming, past and cancelled appointments.
          </p>
        </Card>

        {error && (
          <Card className="p-4 border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </Card>
        )}

        {loading && (
          <Card className="p-5 text-sm text-muted-foreground">
            Loading appointments...
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Upcoming appointments</h2>
            <Button
              className="bg-primary text-white hover:bg-primary/90 text-sm font-semibold"
              onClick={() => navigate('/appointments')}
            >
              Book new appointment
            </Button>
          </div>
          {loading ? null : upcoming.length === 0 ? (
            <Card className="p-5 text-sm text-muted-foreground">
              You have no upcoming appointments.
            </Card>
          ) : (
            <div className="space-y-3">{upcoming.map(renderAppointmentCard)}</div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Past appointments</h2>
          {loading ? null : past.length === 0 ? (
            <Card className="p-5 text-sm text-muted-foreground">
              No completed appointments yet.
            </Card>
          ) : (
            <div className="space-y-3">{past.map(renderAppointmentCard)}</div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Cancelled appointments</h2>
          {loading ? null : cancelled.length === 0 ? (
            <Card className="p-5 text-sm text-muted-foreground">
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
