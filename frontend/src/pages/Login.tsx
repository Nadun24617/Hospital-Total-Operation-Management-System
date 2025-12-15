

import { useState } from 'react';
import axios from 'axios';
import Signup from './Signup';
import { useAuth } from '../auth';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [banner, setBanner] = useState('');
  const { login } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBanner('');
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email,
        password,
      });
      login(response.data.accessToken, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  if (showSignup) {
    return (
      <Signup
        onSuccess={message => {
          setBanner(message);
          setShowSignup(false);
        }}
        onCancel={() => {
          setBanner('');
          setShowSignup(false);
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {banner && <div className="mb-4 text-green-600 text-sm">{banner}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full mb-2">Login</button>
        <button
          type="button"
          className="w-full text-primary-700 hover:underline text-sm"
          onClick={() => setShowSignup(true)}
        >
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
}

