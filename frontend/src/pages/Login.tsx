import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Signup';
import { useAuth } from '../auth';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);    
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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 px-6">
    
    <div className="w-full max-w-md">
      
      {/* Branding */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-medium">
          ABC Hospital
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Sign in to access your secure dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {banner && (
          <Alert className="mb-4 bg-emerald-50 border-emerald-200 text-emerald-700">
            <AlertDescription>{banner}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
              required
            />
          </div>
<div>
  <Label htmlFor="password" className="text-gray-700">
    Password
  </Label>

  <div className="relative mt-1">
    <Input
      id="password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={e => setPassword(e.target.value)}
      placeholder="Enter your password"
      className="pr-10"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-primary"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

          <Button
            type="submit"
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg"
          >
            Sign In
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full text-sm text-primary mt-2"
            onClick={() => setShowSignup(true)}
          >
            Don’t have an account? Sign up
          </Button>

        </form>
      </div>
    </div>
  </div>
);
}
