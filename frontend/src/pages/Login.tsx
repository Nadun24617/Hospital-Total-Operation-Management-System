import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Signup';
import { useAuth } from '../auth';
import loginBackground from '../assets/Login-Background.png';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [banner, setBanner] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBanner('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
        email,
        password,
      });
      login(response.data.accessToken, response.data.user);
      const roleRaw = response.data.user.role;
      const role = roleRaw?.toLowerCase();

      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'admin' || role === 'staff' || role === 'nurse') {
        navigate('/dashboard');
      } else {
        // Default/fallback: treat as patient portal
        navigate('/patient-dashboard');
      }
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
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/30 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="mb-4 text-sm text-red-200">{error}</div>}
        {banner && <div className="mb-4 text-sm text-emerald-200">{banner}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-white" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-white" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input-field bg-white/15 border-white/40 text-white placeholder-white/70"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full mb-3">Login</button>
        <button
          type="button"
          className="w-full text-sm text-white/80 hover:text-white hover:underline"
          onClick={() => setShowSignup(true)}
        >
          Don't have an account? Sign up
        </button>
      </form>
    </div>
  );
}

