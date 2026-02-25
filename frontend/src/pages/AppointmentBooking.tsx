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
}

interface ApiAppointment {
  id: number;
  doctorId: number;
  patientName: string;
  contactNumber: string;
  reason?: string | null;
  appointmentType: string;
  date: string;
  timeSlot: string;
  queueNumber: number;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  doctor?: { fullName: string; specializationId: number };
}

interface AppointmentView {
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
  status: string;
  createdAt: string;
}

type Step = 'selectDoctor' | 'dateTime' | 'detailsForm' | 'confirm' | 'success';

const DEFAULT_TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '14:00',
  '14:30',
  '15:00',
];

const DEFAULT_HOSPITAL_LABEL = 'ABC Hospital';

const AppointmentBooking: React.FC = () => {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const [step, setStep] = useState<Step>('selectDoctor');
  const [doctors, setDoctors] = useState<ApiDoctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentType, setAppointmentType] = useState('Consultation');

  const [createdAppointment, setCreatedAppointment] =
    useState<AppointmentView | null>(null);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const specializationName = useMemo(() => {
    const map = new Map(SPECIALIZATIONS.map((s) => [s.id, s.name] as const));
    return (id: number) => map.get(id) || `#${id}`;
  }, []);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) || null,
    [doctors, selectedDoctorId]
  );

  useEffect(() => {
    if (user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
      setPatientName((prev) => prev || fullName);
      setContactNumber((prev) => prev || user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) return;

    void (async () => {
      try {
        const res = await axios.get<ApiDoctor[]>(
          `${import.meta.env.VITE_API_URL}/doctors/confirmed`,
          { headers: authHeaders }
        );

        setDoctors(res.data);
      } catch {
        console.error('Failed to load doctors');
      }
    })();
  }, [isLoggedIn, authHeaders]);

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const handleConfirm = () => {
    if (!selectedDoctor || !date || !timeSlot) return;
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
          { headers: authHeaders }
        );

        const api = response.data;

        setCreatedAppointment({
          id: api.id,
          patientName: api.patientName,
          contactNumber: api.contactNumber,
          reason: api.reason ?? '',
          appointmentType: api.appointmentType,
          doctorId: api.doctorId,
          doctorName: api.doctor?.fullName ?? selectedDoctor.fullName,
          specialization: specializationName(
            api.doctor?.specializationId ?? selectedDoctor.specializationId
          ),
          department: specializationName(
            api.doctor?.specializationId ?? selectedDoctor.specializationId
          ),
          hospital: DEFAULT_HOSPITAL_LABEL,
          date: api.date.slice(0, 10),
          timeSlot: api.timeSlot,
          queueNumber: api.queueNumber,
          status: api.status,
          createdAt: api.createdAt,
        });

        setStep('success');
      } catch {
        setCreateError('Failed to create appointment');
      } finally {
        setCreateLoading(false);
      }
    })();
  };

  const renderStepHeader = () => (
    <div className="flex flex-wrap gap-3 mb-8 p-3 bg-white rounded-2xl shadow-sm">
      {['Doctor', 'Date & Time', 'Details', 'Confirm', 'Success'].map(
        (label, index) => {
          const steps: Step[] = [
            'selectDoctor',
            'dateTime',
            'detailsForm',
            'confirm',
            'success',
          ];

          const active = step === steps[index];
          const done = steps.indexOf(step) > index;

          return (
            <Badge
              key={label}
              className={`px-4 py-2 rounded-xl transition ${
                active
                  ? 'bg-primary text-white'
                  : done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {label}
            </Badge>
          );
        }
      )}
    </div>
  );

  const renderDoctorSelection = () => (
    <Card className="p-8 rounded-3xl shadow-lg bg-white">
      {renderStepHeader()}

      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Choose Your Doctor
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            onClick={() => {
              setSelectedDoctorId(doc.id);
              setStep('dateTime');
            }}
            className={`p-5 rounded-2xl cursor-pointer transition hover:shadow-xl hover:-translate-y-1 ${
              selectedDoctorId === doc.id
                ? 'border-2 border-primary'
                : 'border'
            }`}
          >
            <h3 className="font-semibold text-lg">{doc.fullName}</h3>

            <p className="text-primary text-sm mt-1">
              {specializationName(doc.specializationId)}
            </p>

            <p className="text-gray-500 text-sm mt-3 line-clamp-3">
              {doc.description || 'No description available'}
            </p>
          </Card>
        ))}
      </div>
    </Card>
  );

  const renderDateTimeSelection = () => (
    <Card className="p-8 rounded-3xl shadow-lg">
      {renderStepHeader()}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Select Date</Label>
          <Input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <Label>Select Time Slot</Label>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {DEFAULT_TIME_SLOTS.map((slot) => (
              <Button
                key={slot}
                variant={timeSlot === slot ? 'default' : 'outline'}
                onClick={() => setTimeSlot(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep('selectDoctor')}>
          Back
        </Button>

        <Button
          disabled={!date || !timeSlot}
          onClick={() => setStep('detailsForm')}
        >
          Continue
        </Button>
      </div>
    </Card>
  );

  const renderDetailsForm = () => (
    <Card className="p-8 rounded-3xl shadow-lg">
      {renderStepHeader()}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Patient Name</Label>
          <Input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>

        <div>
          <Label>Contact Number</Label>
          <Input
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>

        <div>
          <Label>Appointment Type</Label>

          <Select value={appointmentType} onValueChange={setAppointmentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Checkup">Routine Checkup</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Reason (Optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep('dateTime')}>
          Back
        </Button>

        <Button
          disabled={!patientName || !contactNumber}
          onClick={() => setStep('confirm')}
        >
          Review
        </Button>
      </div>
    </Card>
  );

  const renderConfirm = () => (
    <Card className="p-8 rounded-3xl shadow-lg text-sm">
      {renderStepHeader()}

      <h2 className="text-2xl font-bold mb-6">Confirm Appointment</h2>

      {createError && (
        <Card className="p-4 bg-red-50 text-red-600 mb-4">
          {createError}
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">Doctor</h3>
          <p>{selectedDoctor?.fullName}</p>
          <p className="text-primary">
            {specializationName(selectedDoctor?.specializationId || 0)}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Appointment</h3>
          <p>Date: {date}</p>
          <p>Time: {timeSlot}</p>
          <p>Type: {appointmentType}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep('detailsForm')}>
          Edit
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={createLoading}
        >
          {createLoading ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </div>
    </Card>
  );

  const renderSuccess = () => (
    <Card className="p-12 text-center rounded-3xl shadow-xl bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold">Booking Successful</h2>

        <div className="flex gap-4 flex-wrap justify-center mt-6">
          <Button onClick={() => navigate('/my-appointments')}>
            View Appointment
          </Button>

          <Button variant="outline" onClick={resetForAnother}>
            Book Another
          </Button>
        </div>
      </div>
    </Card>
  );

  const resetForAnother = () => {
    setStep('selectDoctor');
    setSelectedDoctorId(null);
    setDate('');
    setTimeSlot('');
    setReason('');
    setAppointmentType('Consultation');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <PatientDashboardNavBar navLinks={navLinks} />

        <main className="flex-1 max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 text-center rounded-3xl shadow-lg">
            <h1 className="text-2xl font-bold">Appointment Booking</h1>

            <p className="text-gray-500 mt-3">
              Please login to book appointments.
            </p>

            <Button
              className="mt-6"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 max-w-6xl mx-auto px-6 mt-10 pb-16 space-y-8">
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