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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card
          className="relative w-full max-w-xl p-12 text-center space-y-6
                     backdrop-blur-sm bg-white/70 dark:bg-background/60
                     shadow-xl rounded-3xl border
                     transition-all duration-500
                     hover:shadow-2xl"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 
                          flex items-center justify-center
                          transition-transform duration-300
                          hover:scale-110">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 
                   00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            My Appointments
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed">
            Please log in to view your appointments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              className="bg-primary text-white font-semibold px-8 py-2
                         rounded-xl transition-all duration-300
                         hover:bg-primary/90 hover:scale-105
                         active:scale-95 shadow-md"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>

            <Button
              variant="outline"
              className="rounded-xl px-8 py-2 transition-all duration-300
                         hover:bg-muted"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
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
  <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
    <PatientDashboardNavBar navLinks={navLinks} />

    <main className="flex-1 max-w-7xl mx-auto px-6 mt-10 space-y-16">

      {/* ===== Header Section ===== */}
      <section className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-4">
        <p className="text-xs uppercase tracking-widest text-primary font-medium">
          Appointment Management
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          My <span className="text-primary">Appointments</span>
        </h1>

        <p className="text-gray-600 text-sm md:text-base">
          View, manage and track your upcoming, completed and cancelled appointments.
        </p>
      </section>


      {/* ===== Appointment Summary Cards ===== */}
      {!loading && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Upcoming", value: upcoming.length },
            { label: "Completed", value: past.length },
            { label: "Cancelled", value: cancelled.length },
          ].map(item => (
            <Card
              key={item.label}
              className="rounded-2xl shadow-md border-none p-6 bg-white text-center"
            >
              <div className="text-3xl font-bold text-primary">
                {item.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {item.label} Appointments
              </div>
            </Card>
          ))}
        </section>
      )}


      {/* ===== Error State ===== */}
      {error && (
        <Card className="rounded-2xl shadow-md border-none p-5 bg-red-50 text-red-600 text-sm">
          {error}
        </Card>
      )}


      {/* ===== Upcoming Section ===== */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Upcoming Appointments
          </h2>

          <button
            onClick={() => navigate('/appointments')}
            className="px-5 py-2 rounded-lg bg-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition"
          >
            Book Appointment
          </button>
        </div>

        {loading ? null : upcoming.length === 0 ? (
          <Card className="rounded-2xl shadow-md border-none p-6 text-center text-gray-500">
            You have no upcoming appointments.
          </Card>
        ) : (
          <div className="space-y-4">
            {upcoming.map(appointment => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-md p-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {renderAppointmentCard(appointment)}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* ===== Past Section ===== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Completed Appointments
        </h2>

        {loading ? null : past.length === 0 ? (
          <Card className="rounded-2xl shadow-md border-none p-6 text-center text-gray-500">
            No completed appointments yet.
          </Card>
        ) : (
          <div className="space-y-4">
            {past.map(appointment => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-md p-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {renderAppointmentCard(appointment)}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* ===== Cancelled Section ===== */}
      <section className="space-y-6 pb-10">
        <h2 className="text-2xl font-semibold text-gray-800">
          Cancelled Appointments
        </h2>

        {loading ? null : cancelled.length === 0 ? (
          <Card className="rounded-2xl shadow-md border-none p-6 text-center text-gray-500">
            No cancelled appointments.
          </Card>
        ) : (
          <div className="space-y-4">
            {cancelled.map(appointment => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-md p-5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                {renderAppointmentCard(appointment)}
              </div>
            ))}
          </div>
        )}
      </section>

    </main>

    <div className="mt-16">
      <Footer />
    </div>
  </div>
);
};

export default MyAppointments;
