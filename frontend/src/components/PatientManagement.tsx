import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type UserRole = 'ADMIN' | 'STAFF' | 'DOCTOR' | 'NURSE' | 'USER';
type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  isConfirmed: boolean;
  createdAt: string;
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  status: 'ACTIVE' as UserStatus,
  isConfirmed: true,
};

export default function PatientManagement() {
  const { token } = useAuth();
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : undefined), [token]);

  const [patients, setPatients] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authHeaders) return;
    void fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders]);

  const fetchPatients = async () => {
    if (!authHeaders) return;

    setLoading(true);
    setError('');
    setBanner('');
    try {
      const response = await axios.get<UserRecord[]>(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: authHeaders,
      });
      setPatients(response.data.filter(user => user.role === 'USER'));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to load patients.');
      } else {
        setError('Failed to load patients.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (patient: UserRecord) => {
    setEditingId(patient.id);
    setForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      password: '',
      status: patient.status,
      isConfirmed: patient.isConfirmed,
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

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) return;

    setSubmitting(true);
    setError('');
    setBanner('');

    try {
      if (editingId) {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          status: form.status,
          isConfirmed: form.isConfirmed,
        };

        const response = await axios.patch<UserRecord>(
          `${import.meta.env.VITE_API_URL}/admin/users/${editingId}`,
          payload,
          { headers: authHeaders }
        );
        const saved = response.data;
        setPatients(prev => prev.map(p => (p.id === editingId ? saved : p)));
        setBanner('Patient details updated.');
      } else {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          status: form.status,
          isConfirmed: form.isConfirmed,
        };

        const response = await axios.post<{ message: string; user: UserRecord }>(
          `${import.meta.env.VITE_API_URL}/admin/users/patients`,
          payload,
          { headers: authHeaders }
        );
        setPatients(prev => [response.data.user, ...prev]);
        setBanner(response.data.message);
        setEditingId(response.data.user.id);
        setForm(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not save patient.');
      } else {
        setError('Could not save patient.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Patient Management</h2>
          <div className="flex gap-2">
            <Button variant="link" size="sm" className="text-primary" onClick={() => void fetchPatients()}>
              Refresh
            </Button>
            <Button variant="link" size="sm" className="text-primary" onClick={startCreate}>
              New Patient
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confirmed</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Loading patients...
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell>{patient.isConfirmed ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{patient.createdAt ? patient.createdAt.substring(0, 10) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-primary"
                        onClick={() => startEdit(patient)}
                      >
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
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Patient' : 'Create Patient'}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="patient-first-name">First Name</Label>
            <Input
              id="patient-first-name"
              type="text"
              value={form.firstName}
              onChange={event => handleChange('firstName', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-last-name">Last Name</Label>
            <Input
              id="patient-last-name"
              type="text"
              value={form.lastName}
              onChange={event => handleChange('lastName', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-email">Email</Label>
            <Input
              id="patient-email"
              type="email"
              value={form.email}
              onChange={event => handleChange('email', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-phone">Phone</Label>
            <Input
              id="patient-phone"
              type="tel"
              value={form.phone}
              onChange={event => handleChange('phone', event.target.value)}
              required
            />
          </div>

          {!editingId && (
            <div className="space-y-2">
              <Label htmlFor="patient-password">Password</Label>
              <Input
                id="patient-password"
                type="password"
                value={form.password}
                onChange={event => handleChange('password', event.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => handleChange('status', value as UserStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Confirmed</Label>
            <Select
              value={form.isConfirmed ? 'true' : 'false'}
              onValueChange={(value) => handleChange('isConfirmed', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
