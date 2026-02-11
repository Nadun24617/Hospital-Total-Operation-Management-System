import { useState } from 'react';
import axios from 'axios';
import loginBackground from '../assets/Login-Background.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignupProps {
  onSuccess?: (message: string) => void;
  onCancel?: () => void;
}

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export default function Signup({ onSuccess, onCancel }: SignupProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setForm(initialForm);
      if (onSuccess) {
        onSuccess('Signup successful! Please wait for admin confirmation.');
      } else {
        setSuccess('Signup successful! Please wait for admin confirmation.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/30 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-400/30">
            <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-emerald-500/20 border-emerald-400/30">
            <AlertDescription className="text-emerald-200 text-sm">{success}</AlertDescription>
          </Alert>
        )}
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/2">
            <Label htmlFor="firstName" className="mb-1 font-medium text-white">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <Label htmlFor="lastName" className="mb-1 font-medium text-white">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="email" className="mb-1 font-medium text-white">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="phone" className="mb-1 font-medium text-white">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password" className="mb-1 font-medium text-white">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="confirmPassword" className="mb-1 font-medium text-white">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full mb-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold">
          Sign Up
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="link"
            className="w-full text-sm text-white/80 hover:text-white"
            onClick={onCancel}
          >
            Already have an account? Log in
          </Button>
        )}
      </form>
    </div>
  );
}
