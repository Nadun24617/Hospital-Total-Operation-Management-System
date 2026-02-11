import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { SPECIALIZATIONS } from '../constants/specializations';

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
      let response;
      if (editingId) {
        response = await axios.patch<Doctor>(
          `${import.meta.env.VITE_API_URL}/doctors/${editingId}`,
          payload,
          { headers: authHeaders }
        );
        setDoctors(prev => prev.map(d => (d.id === editingId ? response!.data : d)));
        setBanner('Doctor details updated.');
      } else {
        response = await axios.post<Doctor>(`${import.meta.env.VITE_API_URL}/doctors`, payload, {
          headers: authHeaders
        });
        setDoctors(prev => [...prev, response.data]);
        setBanner('Doctor profile created.');
      }
      setEditingId(response.data.id);
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
            <button
              type="button"
              className="text-sm text-primary-700 hover:underline"
              onClick={() => void fetchDoctors()}
            >
              Refresh
            </button>
            <button
              type="button"
              className="text-sm text-primary-700 hover:underline"
              onClick={startCreate}
            >
              New Doctor
            </button>
          </div>
        </div>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {banner && <div className="mb-4 text-sm text-green-600">{banner}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">SLMC No.</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Specialization</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Joined Date</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    Loading doctors...
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              ) : (
                doctors.map(doctor => (
                  <tr key={doctor.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-700">{doctor.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{doctor.slmcNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {SPECIALIZATIONS.find(s => s.id === doctor.specializationId)?.name ||
                        (doctor.specializationId ? `#${doctor.specializationId}` : '-')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{doctor.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{doctor.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {doctor.joinedDate ? doctor.joinedDate.substring(0, 10) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="text-sm text-primary-700 hover:underline"
                        onClick={() => startEdit(doctor)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Doctor' : 'Create Doctor'}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-user-id">
              User ID
            </label>
            <input
              id="doctor-user-id"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.userId}
              onChange={event => handleChange('userId', event.target.value)}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Linked application user ID (cuid).</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-full-name">
              Full Name
            </label>
            <input
              id="doctor-full-name"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.fullName}
              onChange={event => handleChange('fullName', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-slmc-number">
              SLMC Number
            </label>
            <input
              id="doctor-slmc-number"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.slmcNumber}
              onChange={event => handleChange('slmcNumber', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-specialization-id">
              Specialization
            </label>
            <select
              id="doctor-specialization-id"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.specializationId}
              onChange={event => handleChange('specializationId', Number(event.target.value))}
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
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-phone">
              Phone
            </label>
            <input
              id="doctor-phone"
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.phone ?? ''}
              onChange={event => handleChange('phone', event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-email">
              Email
            </label>
            <input
              id="doctor-email"
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.email ?? ''}
              onChange={event => handleChange('email', event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-description">
              Description
            </label>
            <textarea
              id="doctor-description"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={3}
              value={form.description ?? ''}
              onChange={event => handleChange('description', event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="doctor-joined-date">
              Joined Date
            </label>
            <input
              id="doctor-joined-date"
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              value={form.joinedDate ?? ''}
              onChange={event => handleChange('joinedDate', event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
