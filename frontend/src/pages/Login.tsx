import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Signup';
import { useAuth } from '../auth';
import loginBackground from '../assets/Login-Background.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
        className="relative z-10 w-full max-w-md rounded-lg border border-white/20 bg-white/10 p-10 text-white shadow-lg backdrop-blur-xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-500/20 border-red-400/30">
            <AlertDescription className="text-red-200 text-sm">{error}</AlertDescription>
          </Alert>
        )}
        {banner && (
          <Alert className="mb-4 bg-emerald-500/20 border-emerald-400/30">
            <AlertDescription className="text-emerald-200 text-sm">{banner}</AlertDescription>
          </Alert>
        )}
        <div className="mb-4">
          <Label htmlFor="email" className="mb-1 font-medium text-white">Email</Label>
          <Input
            id="email"
            type="email"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="password" className="mb-1 font-medium text-white">Password</Label>
          <Input
            id="password"
            type="password"
            className="bg-white/15 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-white/50"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <Button type="submit" className="w-full mb-3 bg-primary hover:bg-primary/90 text-white font-medium">
          Login
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full text-sm text-white/80 hover:text-white"
          onClick={() => setShowSignup(true)}
        >
          Don't have an account? Sign up
        </Button>
      </form>
    </div>
  );
}
