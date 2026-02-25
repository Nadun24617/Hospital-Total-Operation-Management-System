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

type FieldErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'phone', string>
>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

const ProfileEdit: React.FC = () => {
  const { isLoggedIn, token, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Initialize form ONLY ONCE (Fixes frozen inputs issue)
  useEffect(() => {
    if (user && !initialized) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
      setInitialized(true);
    }
  }, [user, initialized]);

  // Refresh user data once on load
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    void (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/me`,
          { headers: authHeaders }
        );
        updateUser(response.data);
      } catch {
        // Silent fail to keep UI usable
      }
    })();
  }, [isLoggedIn, token, authHeaders, updateUser]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    if (!lastName.trim()) next.lastName = 'Last name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!emailRegex.test(email.trim()))
      next.email = 'Enter a valid email address.';
    if (!phone.trim()) next.phone = 'Phone number is required.';
    else if (!phoneRegex.test(phone.trim()))
      next.phone = 'Enter a valid phone number.';
    return next;
  };

  const onSubmit = async () => {
    if (!token || loading) return;

    setError('');
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/user/me`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        { headers: authHeaders }
      );

      updateUser(response.data);
      navigate('/profile', {
        state: { success: 'Profile updated successfully.' },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Failed to update profile.');
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || !token || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <PatientDashboardNavBar navLinks={navLinks} />
        <main className="flex-1 max-w-3xl mx-auto mt-12 px-4">
          <Card className="p-8 flex flex-col items-center text-center gap-4 shadow-sm border border-border">
            <h1 className="text-2xl font-semibold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Please log in to edit your profile.
            </p>
            <Button
              className="mt-2 px-6 font-semibold"
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
    <div className="min-h-screen flex flex-col bg-muted bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 max-w-4xl mx-auto mt-10 px-4 pb-16 space-y-6">
        {/* Header Card */}
        <Card className="p-8 rounded-3xl shadow-sm border border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {firstName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Edit Profile</h1>
              <p className="text-muted-foreground text-sm">
                Update your patient account details.
              </p>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="p-4 rounded-3xl border border-destructive/30 bg-destructive/10 text-destructive text-sm shadow-sm">
            {error}
          </Card>
        )}

        {/* Form Card */}
        <Card className="p-8 rounded-3xl shadow-sm border border-border bg-card space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                className="focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {fieldErrors.firstName && (
                <div className="text-xs text-destructive">
                  {fieldErrors.firstName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                className="focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {fieldErrors.lastName && (
                <div className="text-xs text-destructive">
                  {fieldErrors.lastName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                className="focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <div className="text-xs text-destructive">
                  {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                className="focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {fieldErrors.phone && (
                <div className="text-xs text-destructive">
                  {fieldErrors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              disabled={loading}
              className="px-6 font-semibold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileEdit;