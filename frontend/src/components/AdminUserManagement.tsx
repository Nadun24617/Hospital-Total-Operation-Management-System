import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { SPECIALIZATIONS } from '../constants/specializations';

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
  // Doctor-specific fields (used when role === 'DOCTOR')
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
          <button
            type="button"
            className="text-sm text-primary-700 hover:underline"
            onClick={() => void fetchUsers()}
          >
            Refresh
          </button>
        </div>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {banner && <div className="mb-4 text-sm text-green-600">{banner}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Confirmation</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const selectedRole = roleSelection[user.id] ?? user.role;
                  const roleChanged = selectedRole !== user.role;
                  return (
                    <tr key={user.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={selectedRole}
                          onChange={event => handleRoleChange(user.id, event.target.value as ManagedRole)}
                        >
                          {roleOptions.map(role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="ml-2 text-sm text-primary-700 disabled:text-gray-400"
                          disabled={!roleChanged}
                          onClick={() => void updateRole(user.id)}
                        >
                          Save
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.status}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.isConfirmed ? (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold">
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-50 text-yellow-700 text-xs font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!user.isConfirmed && (
                          <button
                            type="button"
                            className="text-sm text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded"
                            onClick={() => void confirmUser(user.id)}
                          >
                            Confirm Account
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Register Staff</h2>
        {staffError && <div className="mb-4 text-sm text-red-600">{staffError}</div>}
        {staffSuccess && <div className="mb-4 text-sm text-green-600">{staffSuccess}</div>}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submitStaff}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-first-name">
              First Name
            </label>
            <input
              id="staff-first-name"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.firstName}
              onChange={event => handleStaffFormChange('firstName', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-last-name">
              Last Name
            </label>
            <input
              id="staff-last-name"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.lastName}
              onChange={event => handleStaffFormChange('lastName', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-email">
              Email
            </label>
            <input
              id="staff-email"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.email}
              onChange={event => handleStaffFormChange('email', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-phone">
              Phone
            </label>
            <input
              id="staff-phone"
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.phone}
              onChange={event => handleStaffFormChange('phone', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-password">
              Temporary Password
            </label>
            <input
              id="staff-password"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.password}
              onChange={event => handleStaffFormChange('password', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="staff-role">
              Role
            </label>
            <select
              id="staff-role"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={staffForm.role}
              onChange={event => handleStaffFormChange('role', event.target.value as ManagedRole)}
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          {staffForm.role === 'DOCTOR' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="staff-slmc-number">
                  SLMC Number
                </label>
                <input
                  id="staff-slmc-number"
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={staffForm.slmcNumber}
                  onChange={event => handleStaffFormChange('slmcNumber', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="staff-specialization-id">
                  Specialization
                </label>
                <select
                  id="staff-specialization-id"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={staffForm.specializationId}
                  onChange={event => handleStaffFormChange('specializationId', Number(event.target.value))}
                  required
                >
                  <option value={0}>Select specialization…</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="staff-description">
                  Doctor Description
                </label>
                <textarea
                  id="staff-description"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={staffForm.description}
                  onChange={event => handleStaffFormChange('description', event.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="staff-joined-date">
                  Joined Date
                </label>
                <input
                  id="staff-joined-date"
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={staffForm.joinedDate}
                  onChange={event => handleStaffFormChange('joinedDate', event.target.value)}
                />
              </div>
            </>
          )}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
              disabled={staffSubmitting}
            >
              {staffSubmitting ? 'Creating…' : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
