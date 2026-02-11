import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { SPECIALIZATIONS } from '../constants/specializations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

interface ApiDoctor {
  id: number;
  userId: string;
  fullName: string;
  slmcNumber: string;
  specializationId: number;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  joinedDate?: string | null;
}

const DEFAULT_TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];
const DEFAULT_HOSPITAL_LABEL = 'ABC Hospital';

export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

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

export interface AppointmentView {
  id: number;
  patientName: string;
  contactNumber: string;
  reason: string;
  appointmentType: string;
  doctorId: number;
  doctorName: string;
  specialization: string;
  department: string;
  hospital: string;
  date: string;
  timeSlot: string;
  queueNumber: number;
  status: AppointmentStatus;
  createdAt: string;
}

type Step = 'selectDoctor' | 'dateTime' | 'detailsForm' | 'confirm' | 'success';

const AppointmentBooking: React.FC = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  const [step, setStep] = useState<Step>('selectDoctor');
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState('Consultation');
  const [createdAppointment, setCreatedAppointment] = useState<AppointmentView | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) || null,
    [doctors, selectedDoctorId],
  );

  const specializationName = useMemo(() => {
    const map = new Map(SPECIALIZATIONS.map((s) => [s.id, s.name] as const));
    return (id: number) => map.get(id) || (id ? `#${id}` : 'Not specified');
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    setDoctorsLoading(true);
    setDoctorsError('');

    void (async () => {
      try {
        const response = await axios.get<ApiDoctor[]>(
          `${import.meta.env.VITE_API_URL}/doctors/confirmed`,
          { headers: authHeaders },
        );
        setDoctors(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setDoctorsError(err.response?.data?.message ?? 'Failed to load doctors.');
        } else {
          setDoctorsError('Failed to load doctors.');
        }
      } finally {
        setDoctorsLoading(false);
      }
    })();
  }, [isLoggedIn, authHeaders]);

  useEffect(() => {
    if (user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      setPatientName((prev) => (prev ? prev : fullName));
      setContactNumber((prev) => (prev ? prev : user.phone));
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="relative">
          <PatientDashboardNavBar navLinks={navLinks} />
        </div>
        <main className="max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Appointment Booking</h1>
            <p className="text-muted-foreground">
              Please log in to book an appointment and to auto-fill your patient details.
            </p>
            <Button
              className="mt-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6"
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

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const handleConfirm = () => {
    if (!selectedDoctor || !date || !timeSlot || !patientName || !contactNumber || !appointmentType) return;
    if (createLoading) return;

    setCreateError('');
    setCreateLoading(true);

    void (async () => {
      try {
        const response = await axios.post<ApiAppointment>(
          `${import.meta.env.VITE_API_URL}/appointments`,
          {
            doctorId: selectedDoctor.id,
            patientName,
            contactNumber,
            reason,
            appointmentType,
            date,
            timeSlot,
          },
          { headers: authHeaders },
        );

        const api = response.data;
        const doctorName = api.doctor?.fullName ?? selectedDoctor.fullName;
        const specialization = specializationName(api.doctor?.specializationId ?? selectedDoctor.specializationId);

        setCreatedAppointment({
          id: api.id,
          patientName: api.patientName,
          contactNumber: api.contactNumber,
          reason: api.reason ?? '',
          appointmentType: api.appointmentType,
          doctorId: api.doctorId,
          doctorName,
          specialization,
          department: specialization,
          hospital: DEFAULT_HOSPITAL_LABEL,
          date: (api.date ?? date).slice(0, 10),
          timeSlot: api.timeSlot,
          queueNumber: api.queueNumber,
          status: api.status,
          createdAt: api.createdAt,
        });
        setStep('success');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setCreateError(err.response?.data?.message ?? 'Failed to create appointment.');
        } else {
          setCreateError('Failed to create appointment.');
        }
      } finally {
        setCreateLoading(false);
      }
    })();
  };

  const resetForAnother = () => {
    setStep('selectDoctor');
    setSelectedDoctorId(null);
    setDate('');
    setTimeSlot('');
    setReason('');
    setAppointmentType('Consultation');
    setCreateError('');
  };

  const stepBadge = (label: string, active: boolean, done: boolean) => (
    <Badge
      variant={active ? 'default' : done ? 'secondary' : 'outline'}
      className={
        'flex items-center gap-2 px-3 py-1 text-xs md:text-sm ' +
        (active
          ? 'bg-primary text-primary-foreground hover:bg-primary'
          : done
          ? 'bg-accent text-foreground hover:bg-accent'
          : 'bg-muted text-muted-foreground')
      }
    >
      <span
        className={
          'w-5 h-5 flex items-center justify-center rounded-full border text-[10px] ' +
          (active || done ? 'border-white bg-white text-primary' : 'border-border text-muted-foreground')
        }
      >
        {done ? <Check className="h-3 w-3" /> : label.charAt(0)}
      </span>
      <span>{label}</span>
    </Badge>
  );

  const renderStepHeader = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {stepBadge('Doctor', step === 'selectDoctor', step !== 'selectDoctor')}
      {stepBadge('Date & Time', step === 'dateTime', step === 'detailsForm' || step === 'confirm' || step === 'success')}
      {stepBadge('Details', step === 'detailsForm', step === 'confirm' || step === 'success')}
      {stepBadge('Confirm', step === 'confirm', step === 'success')}
      {stepBadge('Success', step === 'success', step === 'success')}
    </div>
  );

  const renderDoctorSelection = () => (
    <Card className="p-6 md:p-8">
      {renderStepHeader()}
      <h1 className="text-2xl font-bold text-foreground mb-2">Choose a Doctor</h1>
      <p className="text-muted-foreground mb-6 text-sm md:text-base">
        Select a doctor for your appointment. You can view their specialization and department before proceeding.
      </p>
      {doctorsError && (
        <Card className="p-4 mb-5 border-red-200 bg-red-50 text-red-700 text-sm">
          {doctorsError}
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {doctorsLoading ? (
          <Card className="p-5 text-sm text-muted-foreground md:col-span-3">
            Loading doctors...
          </Card>
        ) : doctors.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground md:col-span-3">
            No confirmed doctors available right now.
          </Card>
        ) : (
          doctors.map((doc) => (
            <Card
              key={doc.id}
              className={
                'text-left hover:border-primary/40 transition p-4 flex flex-col gap-2 cursor-pointer ' +
                (selectedDoctorId === doc.id ? 'border-primary' : 'border-border')
              }
              onClick={() => {
                setSelectedDoctorId(doc.id);
                setStep('dateTime');
              }}
            >
              <div className="font-semibold text-foreground">{doc.fullName}</div>
              <div className="text-primary text-sm">{specializationName(doc.specializationId)}</div>
              <div className="text-muted-foreground text-xs">{specializationName(doc.specializationId)}</div>
              <div className="text-muted-foreground text-xs mt-1 line-clamp-3">
                {doc.description || 'No description provided.'}
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );

  const renderDateTimeSelection = () => {
    if (!selectedDoctor) return null;
    return (
      <Card className="p-6 md:p-8">
        {renderStepHeader()}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">{selectedDoctor.fullName}</h2>
            <div className="text-primary text-sm mb-1">{specializationName(selectedDoctor.specializationId)}</div>
            <div className="text-muted-foreground text-sm mb-2">{specializationName(selectedDoctor.specializationId)}</div>
            <p className="text-muted-foreground text-sm">{selectedDoctor.description || 'No description provided.'}</p>
            <p className="text-muted-foreground text-xs mt-2">{DEFAULT_HOSPITAL_LABEL}</p>
          </div>
          <Card className="flex-1 bg-muted p-4 text-sm text-muted-foreground border-border">
            <h3 className="font-semibold text-foreground mb-2">Appointment Info</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>Consultations are usually 15–20 minutes.</li>
              <li>Please arrive at least 15 minutes before your time slot.</li>
              <li>Bring previous reports, prescriptions and identity documents.</li>
            </ul>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground">Select Date</Label>
            <Input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Select Time Slot</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_TIME_SLOTS.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={timeSlot === slot ? 'default' : 'outline'}
                  className={
                    timeSlot === slot
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border-border text-muted-foreground hover:bg-accent'
                  }
                  onClick={() => setTimeSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            className="border-border text-primary hover:bg-accent"
            onClick={() => setStep('selectDoctor')}
          >
            Back to doctors
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90 font-semibold px-5"
            disabled={!date || !timeSlot}
            onClick={() => setStep('detailsForm')}
          >
            Continue
          </Button>
        </div>
      </Card>
    );
  };

  const renderDetailsForm = () => (
    <Card className="p-6 md:p-8">
      {renderStepHeader()}
      <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Details</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Your basic information is auto-filled from your profile. You can update it if needed.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label className="text-foreground">Patient name</Label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Contact number</Label>
          <Input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Appointment type</Label>
          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Checkup">Routine checkup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Reason for visit (optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-24 resize-none"
            placeholder="Describe your symptoms or reason for visit"
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          className="border-border text-primary hover:bg-accent"
          onClick={() => setStep('dateTime')}
        >
          Back
        </Button>
        <Button
          className="bg-primary text-white hover:bg-primary/90 font-semibold px-5"
          disabled={!patientName || !contactNumber || !appointmentType}
          onClick={() => setStep('confirm')}
        >
          Review & confirm
        </Button>
      </div>
    </Card>
  );

  const renderConfirm = () => {
    if (!selectedDoctor) return null;
    const displayDate = date || '-';
    const displayTime = timeSlot || '-';
    const queuePreview = 'Will be assigned on confirm';

    return (
      <Card className="p-6 md:p-8">
        {renderStepHeader()}
        <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Appointment</h2>
        {createError && (
          <Card className="p-4 mb-5 border-red-200 bg-red-50 text-red-700 text-sm">{createError}</Card>
        )}
        <div className="grid md:grid-cols-2 gap-6 mb-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground mb-1">Doctor</h3>
            <p className="text-muted-foreground">{selectedDoctor.fullName}</p>
            <p className="text-primary">{specializationName(selectedDoctor.specializationId)}</p>
            <p className="text-muted-foreground">{specializationName(selectedDoctor.specializationId)}</p>
            <p className="text-muted-foreground text-xs mt-1">{DEFAULT_HOSPITAL_LABEL}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground mb-1">Appointment</h3>
            <p className="text-muted-foreground">Date: {displayDate}</p>
            <p className="text-muted-foreground">Time: {displayTime}</p>
            <p className="text-muted-foreground">Type: {appointmentType}</p>
            <p className="text-muted-foreground text-xs">Queue number: {queuePreview}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground mb-1">Patient</h3>
            <p className="text-muted-foreground">{patientName}</p>
            <p className="text-muted-foreground">{contactNumber}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground mb-1">Reason</h3>
            <p className="text-muted-foreground min-h-[3rem]">{reason || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-border text-primary hover:bg-accent"
              onClick={() => setStep('detailsForm')}
            >
              Edit details
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/patient-dashboard')}
            >
              Cancel booking
            </Button>
          </div>
          <Button
            className="bg-primary text-white hover:bg-primary/90 font-semibold px-6"
            onClick={handleConfirm}
            disabled={createLoading}
          >
            {createLoading ? 'Booking...' : 'Confirm Appointment'}
          </Button>
        </div>
      </Card>
    );
  };

  const renderSuccess = () => {
    if (!createdAppointment) return null;
    return (
      <Card className="p-6 md:p-8 text-center">
        {renderStepHeader()}
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Booking Successful</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Your appointment has been successfully booked. Please arrive at the hospital at least 15 minutes before your selected time.
          </p>
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-left w-full max-w-xl">
            <Card className="bg-muted p-4">
              <h3 className="font-semibold text-foreground mb-1">Appointment</h3>
              <p className="text-muted-foreground">ID: {createdAppointment.id}</p>
              <p className="text-muted-foreground">
                Date & time: {createdAppointment.date} at {createdAppointment.timeSlot}
              </p>
              <p className="text-muted-foreground">Doctor: {createdAppointment.doctorName}</p>
              <p className="text-muted-foreground">Queue number: {createdAppointment.queueNumber}</p>
            </Card>
            <Card className="bg-muted p-4">
              <h3 className="font-semibold text-foreground mb-1">Instructions</h3>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Arrive 15 minutes before your scheduled time.</li>
                <li>Bring your previous prescriptions and reports if available.</li>
                <li>Carry a valid identity document.</li>
              </ul>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Button
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-5"
              onClick={() => navigate('/my-appointments')}
            >
              View appointment
            </Button>
            <Button
              variant="outline"
              className="border-border text-primary hover:bg-accent font-semibold px-5"
              onClick={() => window.alert('Download as PDF can be implemented here.')}
            >
              Download confirmation (PDF)
            </Button>
            <Button
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50 font-semibold px-5"
              onClick={resetForAnother}
            >
              Book another appointment
            </Button>
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
        {step === 'selectDoctor' && renderDoctorSelection()}
        {step === 'dateTime' && renderDateTimeSelection()}
        {step === 'detailsForm' && renderDetailsForm()}
        {step === 'confirm' && renderConfirm()}
        {step === 'success' && renderSuccess()}
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentBooking;
