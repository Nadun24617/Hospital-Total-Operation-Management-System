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

type ManagedRole = 'ADMIN' | 'STAFF' | 'DOCTOR' | 'NURSE' | 'USER';

interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: ManagedRole;
  status: string;
  isConfirmed: boolean;
  createdAt: string;
}

const roleOptions: ManagedRole[] = ['ADMIN', 'STAFF', 'DOCTOR', 'NURSE', 'USER'];

const initialStaffForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'STAFF' as ManagedRole,
  slmcNumber: '',
  specializationId: 0,
  description: '',
  joinedDate: ''
};

export default function AdminUserManagement() {
  const { token } = useAuth();
  const authHeaders = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : undefined), [token]);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [roleSelection, setRoleSelection] = useState<Record<string, ManagedRole>>({});

  const [staffForm, setStaffForm] = useState(initialStaffForm);
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');

  useEffect(() => {
    if (!authHeaders) {
      return;
    }

    void fetchUsers();
  }, [authHeaders]);

  const fetchUsers = async () => {
    if (!authHeaders) {
      return;
    }

    setLoading(true);
    setError('');
    setBanner('');
    try {
      const response = await axios.get<ManagedUser[]>(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: authHeaders
      });
      setUsers(response.data);
      setRoleSelection(
        response.data.reduce<Record<string, ManagedRole>>((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {})
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to load users.');
      } else {
        setError('Failed to load users.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmUser = async (userId: string) => {
    if (!authHeaders) {
      return;
    }

    setBanner('');
    try {
      const response = await axios.patch<ManagedUser>(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/confirm`, {}, {
        headers: authHeaders
      });
      setUsers(prev => prev.map(user => (user.id === userId ? response.data : user)));
      setBanner('Account confirmed.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not confirm user.');
      } else {
        setError('Could not confirm user.');
      }
    }
  };

  const handleRoleChange = (userId: string, newRole: ManagedRole) => {
    setRoleSelection(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const updateRole = async (userId: string) => {
    if (!authHeaders) {
      return;
    }

    setBanner('');
    const selectedRole = roleSelection[userId];
    try {
      const response = await axios.patch<ManagedUser>(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`,
        { role: selectedRole },
        { headers: authHeaders }
      );
      setUsers(prev => prev.map(user => (user.id === userId ? response.data : user)));
      setBanner('Role updated.');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Could not update role.');
      } else {
        setError('Could not update role.');
      }
    }
  };

  const handleStaffFormChange = (field: keyof typeof staffForm, value: string | number) => {
    setStaffForm(prev => ({
      ...prev,
      [field]: field === 'specializationId' ? Number(value) || 0 : value
    }));
  };

  const submitStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authHeaders) {
      return;
    }

    setStaffSubmitting(true);
    setStaffError('');
    setStaffSuccess('');
    setBanner('');

    try {
      const response = await axios.post<{ message: string; user: ManagedUser }>(
        `${import.meta.env.VITE_API_URL}/admin/users/staff`,
        staffForm,
        { headers: authHeaders }
      );
      setUsers(prev => [response.data.user, ...prev]);
      setRoleSelection(prev => ({
        ...prev,
        [response.data.user.id]: response.data.user.role
      }));
      setStaffForm(initialStaffForm);
      setStaffSuccess(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStaffError(err.response?.data?.message ?? 'Could not create staff account.');
      } else {
        setStaffError('Could not create staff account.');
      }
    } finally {
      setStaffSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          <Button variant="link" size="sm" className="text-primary" onClick={() => void fetchUsers()}>
            Refresh
          </Button>
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
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confirmation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => {
                  const selectedRole = roleSelection[user.id] ?? user.role;
                  const roleChanged = selectedRole !== user.role;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={selectedRole}
                            onValueChange={(value) => handleRoleChange(user.id, value as ManagedRole)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary"
                            disabled={!roleChanged}
                            onClick={() => void updateRole(user.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        {user.isConfirmed ? (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!user.isConfirmed && (
                          <Button size="sm" onClick={() => void confirmUser(user.id)}>
                            Confirm Account
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Register Staff</h2>
        {staffError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{staffError}</AlertDescription>
          </Alert>
        )}
        {staffSuccess && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{staffSuccess}</AlertDescription>
          </Alert>
        )}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submitStaff}>
          <div className="space-y-2">
            <Label htmlFor="staff-first-name">First Name</Label>
            <Input
              id="staff-first-name"
              type="text"
              value={staffForm.firstName}
              onChange={event => handleStaffFormChange('firstName', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-last-name">Last Name</Label>
            <Input
              id="staff-last-name"
              type="text"
              value={staffForm.lastName}
              onChange={event => handleStaffFormChange('lastName', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              value={staffForm.email}
              onChange={event => handleStaffFormChange('email', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-phone">Phone</Label>
            <Input
              id="staff-phone"
              type="tel"
              value={staffForm.phone}
              onChange={event => handleStaffFormChange('phone', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-password">Temporary Password</Label>
            <Input
              id="staff-password"
              type="password"
              value={staffForm.password}
              onChange={event => handleStaffFormChange('password', event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff-role">Role</Label>
            <Select
              value={staffForm.role}
              onValueChange={(value) => handleStaffFormChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {staffForm.role === 'DOCTOR' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="staff-slmc-number">SLMC Number</Label>
                <Input
                  id="staff-slmc-number"
                  type="text"
                  value={staffForm.slmcNumber}
                  onChange={event => handleStaffFormChange('slmcNumber', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-specialization-id">Specialization</Label>
                <Select
                  value={staffForm.specializationId ? String(staffForm.specializationId) : ''}
                  onValueChange={(value) => handleStaffFormChange('specializationId', Number(value))}
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
                <Label htmlFor="staff-description">Doctor Description</Label>
                <Textarea
                  id="staff-description"
                  value={staffForm.description}
                  onChange={event => handleStaffFormChange('description', event.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-joined-date">Joined Date</Label>
                <Input
                  id="staff-joined-date"
                  type="date"
                  value={staffForm.joinedDate}
                  onChange={event => handleStaffFormChange('joinedDate', event.target.value)}
                />
              </div>
            </>
          )}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={staffSubmitting}>
              {staffSubmitting ? 'Creating…' : 'Create Staff Account'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
