import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { SPECIALIZATIONS } from '../constants/specializations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

interface AppointmentDoctor {
  fullName: string;
  specializationId: number;
}

interface Appointment {
  id: number;
  doctorId: number;
  userId: string | null;
  patientName: string;
  contactNumber: string;
  reason: string | null;
  appointmentType: string;
  date: string;
  timeSlot: string;
  queueNumber: number;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  doctor: AppointmentDoctor;
}

interface Doctor {
  id: number;
  fullName: string;
  specializationId: number;
}

const statusOptions: AppointmentStatus[] = ['UPCOMING', 'COMPLETED', 'CANCELLED'];
const appointmentTypeOptions = ['Consultation', 'Follow-up', 'Checkup'];

const statusBadgeClass: Record<AppointmentStatus, string> = {
  UPCOMING: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
};

const statusVariant: Record<AppointmentStatus, 'default' | 'secondary' | 'destructive'> = {
  UPCOMING: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

const emptyForm = {
  doctorId: 0,
  userId: '',
  patientName: '',
  contactNumber: '',
  reason: '',
  appointmentType: 'Consultation',
  date: '',
  timeSlot: '',
  status: 'UPCOMING' as AppointmentStatus,
};

export default function AppointmentManagement() {
  const { token } = useAuth();
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : undefined), [token]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterDoctorId, setFilterDoctorId] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (!authHeaders) return;
    void fetchAppointments();
    void fetchDoctors();
  }, [authHeaders]);

  const fetchAppointments = async () => {
    if (!authHeaders) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterDoctorId) params.set('doctorId', filterDoctorId);
      if (filterDate) params.set('date', filterDate);
      const qs = params.toString();

      const response = await axios.get<Appointment[]>(
        `${import.meta.env.VITE_API_URL}/admin/appointments${qs ? `?${qs}` : ''}`,
        { headers: authHeaders }
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
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get<Doctor[]>(`${import.meta.env.VITE_API_URL}/doctors`);
      setDoctors(response.data);
    } catch {
      // Doctors list is supplementary; don't block UI on failure
    }
  };

  const startEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setForm({
      doctorId: apt.doctorId,
      userId: apt.userId ?? '',
      patientName: apt.patientName,
      contactNumber: apt.contactNumber,
      reason: apt.reason ?? '',
      appointmentType: apt.appointmentType,
      date: apt.date ? apt.date.substring(0, 10) : '',
      timeSlot: apt.timeSlot,
      status: apt.status,
    });
    setShowForm(true);
    setError('');
    setBanner('');
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setBanner('');
  };

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'doctorId' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;

    setSubmitting(true);
    setError('');
    setBanner('');

    const payload = {
      ...form,
      doctorId: Number(form.doctorId) || 0,
      userId: form.userId || undefined,
      reason: form.reason || undefined,
    };

    try {
      if (editingId) {
        const response = await axios.patch<Appointment>(
          `${import.meta.env.VITE_API_URL}/admin/appointments/${editingId}`,
          payload,
          { headers: authHeaders }
        );
        setAppointments(prev => prev.map(a => (a.id === editingId ? response.data : a)));
        setBanner('Appointment updated.');
      } else {
        const response = await axios.post<Appointment>(
          `${import.meta.env.VITE_API_URL}/admin/appointments`,
          payload,
          { headers: authHeaders }
        );
        setAppointments(prev => [response.data, ...prev]);
        setBanner('Appointment created.');
        setForm(emptyForm);
        setShowForm(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not save appointment.');
      } else {
        setError('Could not save appointment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!authHeaders) return;
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    setError('');
    setBanner('');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/appointments/${id}`, {
        headers: authHeaders,
      });
      setAppointments(prev => prev.filter(a => a.id !== id));
      setBanner('Appointment deleted.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not delete appointment.');
      } else {
        setError('Could not delete appointment.');
      }
    }
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterDoctorId('');
    setFilterDate('');
  };

  const getSpecName = (id: number) =>
    SPECIALIZATIONS.find(s => s.id === id)?.name ?? '-';

  return (
    <div className="space-y-10">
      {/* List section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Appointments</h2>
          <div className="flex gap-2">
            <Button variant="link" size="sm" className="text-primary" onClick={() => void fetchAppointments()}>
              Refresh
            </Button>
            <Button variant="link" size="sm" className="text-primary" onClick={startCreate}>
              New Appointment
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {banner && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{banner}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-end">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Doctor</Label>
            <Select value={filterDoctorId} onValueChange={(v) => setFilterDoctorId(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Doctors</SelectItem>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.fullName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Date</Label>
            <Input
              type="date"
              className="w-[160px] h-8 text-sm"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <Button size="sm" className="h-8" onClick={() => void fetchAppointments()}>
            Apply
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => { clearFilters(); void fetchAppointments(); }}>
            Clear
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Queue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                    Loading appointments...
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{apt.patientName}</TableCell>
                    <TableCell>{apt.doctor.fullName}</TableCell>
                    <TableCell>{getSpecName(apt.doctor.specializationId)}</TableCell>
                    <TableCell>{apt.date ? apt.date.substring(0, 10) : '-'}</TableCell>
                    <TableCell>{apt.timeSlot}</TableCell>
                    <TableCell>{apt.queueNumber}</TableCell>
                    <TableCell>{apt.appointmentType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant[apt.status]}
                        className={statusBadgeClass[apt.status]}
                      >
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" size="sm" className="text-primary" onClick={() => startEdit(apt)}>
                        Edit
                      </Button>
                      <Button variant="link" size="sm" className="text-destructive" onClick={() => void handleDelete(apt.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Create / Edit form */}
      {showForm && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit Appointment' : 'Create Appointment'}</h2>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>
              Cancel
            </Button>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="apt-doctor">Doctor</Label>
              <Select
                value={form.doctorId ? String(form.doctorId) : ''}
                onValueChange={(value) => handleChange('doctorId', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor..." />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(d => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-patient-name">Patient Name</Label>
              <Input
                id="apt-patient-name"
                type="text"
                value={form.patientName}
                onChange={e => handleChange('patientName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-contact">Contact Number</Label>
              <Input
                id="apt-contact"
                type="tel"
                value={form.contactNumber}
                onChange={e => handleChange('contactNumber', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-user-id">User ID (optional)</Label>
              <Input
                id="apt-user-id"
                type="text"
                value={form.userId}
                onChange={e => handleChange('userId', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Link to a registered patient account.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-type">Appointment Type</Label>
              <Select value={form.appointmentType} onValueChange={(value) => handleChange('appointmentType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypeOptions.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-date">Date</Label>
              <Input
                id="apt-date"
                type="date"
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-time">Time Slot</Label>
              <Input
                id="apt-time"
                type="time"
                value={form.timeSlot}
                onChange={e => handleChange('timeSlot', e.target.value)}
                required
              />
            </div>
            {editingId && (
              <div className="space-y-2">
                <Label htmlFor="apt-status">Status</Label>
                <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="apt-reason">Reason</Label>
              <Textarea
                id="apt-reason"
                rows={3}
                value={form.reason}
                onChange={e => handleChange('reason', e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Appointment'}
              </Button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
