import { useState } from 'react';
import axios from 'axios';
import loginBackground from '../assets/Login-Background.png';

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
        {error && <div className="mb-4 text-sm text-red-200">{error}</div>}
        {success && <div className="mb-4 text-sm text-emerald-200">{success}</div>}
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-medium text-white" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block mb-1 font-medium text-white" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-white" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-white" htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-white" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-white" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full mb-3">Sign Up</button>
        {onCancel && (
          <button
            type="button"
            className="w-full text-sm text-white/80 hover:text-white hover:underline"
            onClick={onCancel}
          >
            Already have an account? Log in
          </button>
        )}
      </form>
    </div>
  );
}
