import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { SPECIALIZATIONS } from '../constants/specializations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Doctor {
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

const emptyForm: Omit<Doctor, 'id'> = {
  userId: '',
  fullName: '',
  slmcNumber: '',
  specializationId: 0,
  phone: '',
  email: '',
  description: '',
  joinedDate: ''
};

export default function DoctorProfiles() {
  const { token } = useAuth();
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : undefined), [token]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authHeaders) return;
    void fetchDoctors();
  }, [authHeaders]);

  const fetchDoctors = async () => {
    if (!authHeaders) return;
    setLoading(true);
    setError('');
    setBanner('');
    try {
      const response = await axios.get<Doctor[]>(`${import.meta.env.VITE_API_URL}/doctors`, {
        headers: authHeaders
      });
      setDoctors(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to load doctors.');
      } else {
        setError('Failed to load doctors.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setForm({
      userId: doctor.userId,
      fullName: doctor.fullName,
      slmcNumber: doctor.slmcNumber,
      specializationId: doctor.specializationId,
      phone: doctor.phone ?? '',
      email: doctor.email ?? '',
      description: doctor.description ?? '',
      joinedDate: doctor.joinedDate ? doctor.joinedDate.substring(0, 10) : ''
    });
    setError('');
    setBanner('');
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setBanner('');
  };

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm(prev => ({
      ...prev,
      [field]: field === 'specializationId' ? Number(value) || 0 : value
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
      specializationId: Number(form.specializationId) || 0,
      joinedDate: form.joinedDate || undefined
    };

    try {
      let saved: Doctor;
      if (editingId) {
        const response = await axios.patch<Doctor>(
          `${import.meta.env.VITE_API_URL}/doctors/${editingId}`,
          payload,
          { headers: authHeaders }
        );
        saved = response.data;
        setDoctors(prev => prev.map(d => (d.id === editingId ? saved : d)));
        setBanner('Doctor details updated.');
      } else {
        const response = await axios.post<Doctor>(`${import.meta.env.VITE_API_URL}/doctors`, payload, {
          headers: authHeaders
        });
        saved = response.data;
        setDoctors(prev => [...prev, saved]);
        setBanner('Doctor profile created.');
      }
      setEditingId(saved.id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not save doctor.');
      } else {
        setError('Could not save doctor.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctor Profiles</h2>
          <div className="flex gap-2">
            <Button variant="link" size="sm" className="text-primary" onClick={() => void fetchDoctors()}>
              Refresh
            </Button>
            <Button variant="link" size="sm" className="text-primary" onClick={startCreate}>
              New Doctor
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
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SLMC No.</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Loading doctors...
                  </TableCell>
                </TableRow>
              ) : doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No doctors found.
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map(doctor => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.fullName}</TableCell>
                    <TableCell>{doctor.slmcNumber}</TableCell>
                    <TableCell>
                      {SPECIALIZATIONS.find(s => s.id === doctor.specializationId)?.name ||
                        (doctor.specializationId ? `#${doctor.specializationId}` : '-')}
                    </TableCell>
                    <TableCell>{doctor.phone || '-'}</TableCell>
                    <TableCell>{doctor.email || '-'}</TableCell>
                    <TableCell>
                      {doctor.joinedDate ? doctor.joinedDate.substring(0, 10) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" size="sm" className="text-primary" onClick={() => startEdit(doctor)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Doctor' : 'Create Doctor'}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="doctor-user-id">User ID</Label>
            <Input
              id="doctor-user-id"
              type="text"
              value={form.userId}
              onChange={event => handleChange('userId', event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Linked application user ID (cuid).</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-full-name">Full Name</Label>
            <Input
              id="doctor-full-name"
              type="text"
              value={form.fullName}
              onChange={event => handleChange('fullName', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-slmc-number">SLMC Number</Label>
            <Input
              id="doctor-slmc-number"
              type="text"
              value={form.slmcNumber}
              onChange={event => handleChange('slmcNumber', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-specialization-id">Specialization</Label>
            <Select
              value={form.specializationId ? String(form.specializationId) : ''}
              onValueChange={(value) => handleChange('specializationId', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization…" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map(spec => (
                  <SelectItem key={spec.id} value={String(spec.id)}>{spec.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-phone">Phone</Label>
            <Input
              id="doctor-phone"
              type="tel"
              value={form.phone ?? ''}
              onChange={event => handleChange('phone', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-email">Email</Label>
            <Input
              id="doctor-email"
              type="email"
              value={form.email ?? ''}
              onChange={event => handleChange('email', event.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="doctor-description">Description</Label>
            <Textarea
              id="doctor-description"
              rows={3}
              value={form.description ?? ''}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor-joined-date">Joined Date</Label>
            <Input
              id="doctor-joined-date"
              type="date"
              value={form.joinedDate ?? ''}
              onChange={event => handleChange('joinedDate', event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Doctor'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
