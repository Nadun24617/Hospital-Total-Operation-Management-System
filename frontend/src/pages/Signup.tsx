import { useState } from 'react';
import axios from 'axios';

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
      await axios.post('http://localhost:3000/user/signup', {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 font-medium" htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" className="input-field" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-medium" htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" className="input-field" value={form.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" className="input-field" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input-field" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="input-field" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary w-full mb-2">Sign Up</button>
        {onCancel && (
          <button
            type="button"
            className="w-full text-primary-700 hover:underline text-sm"
            onClick={onCancel}
          >
            Already have an account? Log in
          </button>
        )}
      </form>
    </div>
  );
}
