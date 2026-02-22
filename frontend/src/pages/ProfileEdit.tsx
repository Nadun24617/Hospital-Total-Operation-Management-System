import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { useAuth } from '../auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

type FieldErrors = Partial<Record<'firstName' | 'lastName' | 'email' | 'phone', string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

const ProfileEdit: React.FC = () => {
  const { isLoggedIn, token, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    void (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/me`,
          { headers: authHeaders },
        );
        const apiUser = response.data;
        updateUser(apiUser);
      } catch {
        // Keep UI usable even if refresh fails.
      }
    })();
  }, [isLoggedIn, token, authHeaders, updateUser]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    if (!lastName.trim()) next.lastName = 'Last name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!emailRegex.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!phone.trim()) next.phone = 'Phone number is required.';
    else if (!phoneRegex.test(phone.trim())) next.phone = 'Enter a valid phone number.';
    return next;
  };

  const onSubmit = () => {
    if (!token) return;
    if (loading) return;

    setError('');
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    void (async () => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/user/me`,
          {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
          { headers: authHeaders },
        );

        updateUser(response.data);
        navigate('/profile', { state: { success: 'Profile updated successfully.' } });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message ?? 'Failed to update profile.');
        } else {
          setError('Failed to update profile.');
        }
      } finally {
        setLoading(false);
      }
    })();
  };

  if (!isLoggedIn || !token || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <PatientDashboardNavBar navLinks={navLinks} />
        <main className="flex-1 max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground">Please log in to edit your profile.</p>
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

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <PatientDashboardNavBar navLinks={navLinks} />
      <main className="flex-1 max-w-6xl mx-auto mt-8 px-4 pb-10 space-y-6">
        <Card className="p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Edit Profile</h1>
          <p className="text-muted-foreground text-sm">
            Update your patient account details. Only your own information can be edited.
          </p>
        </Card>

        {error && (
          <Card className="p-4 border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </Card>
        )}

        <Card className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-foreground">First name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              {fieldErrors.firstName && (
                <div className="text-xs text-red-600">{fieldErrors.firstName}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Last name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {fieldErrors.lastName && (
                <div className="text-xs text-red-600">{fieldErrors.lastName}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {fieldErrors.email && (
                <div className="text-xs text-red-600">{fieldErrors.email}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Phone</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {fieldErrors.phone && (
                <div className="text-xs text-red-600">{fieldErrors.phone}</div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-border text-primary hover:bg-accent"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-6"
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
